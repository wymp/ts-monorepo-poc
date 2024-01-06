# This dockerfile sets node and pnpm versions to `latest` as a default. However, you should set these build args when
# you actually build the container so you can be sure your versions are pinned to your liking. For sanity, you may want
# to set and retrieve these values from the `package.json::engines` field.

ARG NODE_VERSION=lts
FROM node:${NODE_VERSION}-alpine3.17 as libs-builder

# Set up the PM_VERSION and STORE_DIR build args. You probably won't have to change the STORE_DIR, as this is an
# internal variable used to manage the pnpm cache.
ARG PM_VERSION=latest STORE_DIR=/monorepo/.pnpm-store

# Optional but nice to maintain good metadata
LABEL org.opencontainers.image.source ghcr.io/my-namespace/libs

# Now create the necessary directories, install pnpm and install bash. /monorepo will contain the monorepo and /pruned
# will contain the pruned and built service.
RUN \
  mkdir /monorepo /pruned && \
  chown node:node /monorepo /pruned && \
  npm install -g pnpm@${PM_VERSION} && \
  apk add bash
WORKDIR /monorepo

# Copy main package files
COPY ./*.json ./.npmrc ./pnpm-lock.yaml ./pnpm-workspace.yaml ./

# Install dependencies and build libraries. Note that our script will be replacing the `\#\#PACKAGE_MOUNTS\#\#` string
# with the appropriate mount commands for each package. Otherwise we'd have to do this manually and update it every time
# we added a new package.
RUN \
  --mount=type=cache,uid=1000,gid=1000,target=${STORE_DIR} \
  --mount=type=secret,id=npmrc,required=true,uid=1000,gid=1000,target=/root/.npmrc \
  # E.g., --mount=type=bind,source=./apps/my-service/package.json,target=./apps/my-service/package.json \
  ##PACKAGE_MOUNTS##
  pnpm install --store-dir="${STORE_DIR}" --package-import-method=copy --frozen-lockfile
COPY --chown=node:node ./libs ./libs
COPY --chown=node:node ./apps ./apps
COPY --chown=node:node ./scripts ./scripts
RUN pnpm build:libs




##
# Build a service
##

FROM libs-builder as service-builder
ARG STORE_DIR=/monorepo/.pnpm-store SERVICE_NAME="NEED SERVICE_NAME BUILD ARG"

# Build the designated service and "deploy" it. This basically just copies the built service and installs only its
# prod dependencies into the target folder.
RUN \
  --mount=type=cache,uid=1000,gid=1000,target=${STORE_DIR} \
  --mount=type=secret,id=npmrc,required=true,uid=1000,gid=1000,target=/root/.npmrc \
  pnpm --filter "./apps/${SERVICE_NAME}" build && \
  pnpm --store-dir "${STORE_DIR}" --filter "./apps/${SERVICE_NAME}" --prod deploy "/pruned/${SERVICE_NAME}" && \
  # There's a [bug in pnpm](https://github.com/pnpm/pnpm/issues/6269) that we need to compensate for here
  sed -ri 's#"main": "src/(.+)\.ts"#"main": "dist/\1.js"#' "/pruned/${SERVICE_NAME}"/node_modules/@monorepo/*/package.json




##
# Finally, prune the service container
##

FROM node:${NODE_VERSION}-alpine3.17 as service
ARG SERVICE_NAME="NEED SERVICE_NAME BUILD ARG"

# Use tini for signal handling and switch to the node user
RUN apk --update add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]
USER node

# Create and use the `/app` dir and copy the pruned service into it
WORKDIR /app
COPY --from=service-builder --chown=node:node /pruned/$SERVICE_NAME /app
COPY --from=service-builder --chown=node:node /monorepo/apps/$SERVICE_NAME/package.json /app

# From this point, it is intended that services provide an additional dockerfile that will be concatenated to this one
# and used to build the final image. Alternatively, you can build an image (e.g., for testing or exploration) using this
# file directly. To do that, you would do something like the following:

# SERVICE_NAME=my-microservice # IMPORTANT: SERVICE_NAME must match a folder name under the apps folder
# NODE_VERSION=18
# PM_VERSION=^8.2.0
# VERSION_TAG=dev
#
# ./scripts/.internal/concat-and-prep-dockerfiles.js ./deploy/node-base.dockerfile | \
# docker image build \
#   --secret id=npmrc,src=$HOME/.npmrc \
#   --build-arg NODE_VERSION=$NODE_VERSION \
#   --build-arg PM_VERSION=$PM_VERSION \
#   --build-arg SERVICE_NAME=$SERVICE_NAME \
#   -f - \
#   -t ghcr.io/my-namespace/$SERVICE_NAME:$VERSION_TAG \
#   --target service \
#   .
