#!/bin/bash
set -e

# Find the root of the repo
ROOT="$(dirname "$0")/.."

# Initialize docker args
DOCKER_ARGS=()

# We need a service name - this can either be set explicitly or inferred from pnpm variables. The service name should
# correspond to some directory under ./apps
SERVICE_NAME="$([ -n "$SERVICE_NAME" ] && echo "$SERVICE_NAME" || echo "$PNPM_PACKAGE_NAME")"
if [ -z "$SERVICE_NAME" ]; then
  if [ -n "$PNPM_SCRIPT_SRC_DIR" ]; then
    SERVICE_NAME="$(basename "$PNPM_SCRIPT_SRC_DIR")"
  else
    echo "SERVICE_NAME or PNPM_PACKAGE_NAME must be set to the name of the app we're building"
    exit 1
  fi
fi

DOCKER_ARGS+=(--build-arg SERVICE_NAME="$SERVICE_NAME")

# Create a files array that will contain the dockerfiles (in order) that we're going to concat together to make our
# final dockerfile. If this is a react app, add the react extension. Finally, if the service has a service.dockerfile,
# we'll add that
FILES=("$ROOT"/deploy/dockerfile.base)
if [ -n "$REACT" ]; then
  FILES+=("$ROOT"/deploy/dockerfile.react-ext)
  if [ -z "$DOCKER_TARGET" ]; then
    DOCKER_TARGET=react-app
  fi
fi
if [ -f "$ROOT"/apps/"$SERVICE_NAME"/deploy/dockerfile.service ]; then
  FILES+=("$ROOT"/apps/"$SERVICE_NAME"/deploy/dockerfile.service)
fi

# Get node and pnpm versions from `package.json::engines`
NODE_VERSION="$("$ROOT/scripts/.internal/getEngineVersion.js" node)"
PM_VERSION="$("$ROOT/scripts/.internal/getEngineVersion.js" pnpm)"

DOCKER_ARGS+=(--build-arg NODE_VERSION=$NODE_VERSION)
DOCKER_ARGS+=(--build-arg PM_VERSION=$PM_VERSION)

# By default, we'll tag our images as `dev`. You can set `VERSION_TAG` to change this, though
VERSION_TAG="$([ -n "$VERSION_TAG" ] && echo "$VERSION_TAG" || echo "dev")"

# If we've got an npmrc file, provide it as a secret
if [ -f "$HOME"/.npmrc ]; then
  DOCKER_ARGS+=(--secret id=npmrc,src=$HOME/.npmrc)
fi

# `DOCKER_TARGET` allows us to specify a different target than our default `service` target. We'll need to this for
# building react apps or node apps with appendages.
if [ -n "$DOCKER_TARGET" ]; then
  DOCKER_ARGS+=(--target "$DOCKER_TARGET")
fi

DOCKER_ARGS+=(-f -)
DOCKER_ARGS+=(-t ghcr.io/my-namespace/"$SERVICE_NAME":"$VERSION_TAG")
DOCKER_ARGS+=("$ROOT")

# Finally, run the files through our concatenator/preparator script and pipe it into docker build
# NOTE: Docker builds depend on having auth creds in your ~/.npmrc file. In CI you can just create this file.
"$ROOT"/scripts/.internal/concat-and-prep-dockerfiles.js "${FILES[@]}" | docker image build "${DOCKER_ARGS[@]}"
