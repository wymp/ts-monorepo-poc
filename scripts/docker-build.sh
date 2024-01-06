#!/bin/bash
set -e

SERVICE_NAME="$([ -n "$SERVICE_NAME" ] && echo "$SERVICE_NAME" || echo "$PNPM_PACKAGE_NAME")"
if [ -z "$SERVICE_NAME" ]; then
  if [ -n "$PNPM_SCRIPT_SRC_DIR" ]; then
    SERVICE_NAME="$(basename "$PNPM_SCRIPT_SRC_DIR")"
  else
    echo "SERVICE_NAME or PNPM_PACKAGE_NAME must be set to the name of the app we're building"
    exit 1
  fi
fi

ROOT="$(dirname "$0")/.."
FILES=("$ROOT"/deploy/node-base.dockerfile)

# TODO: Make these come from somewhere centralized, like package.json::engines
NODE_VERSION=20
PM_VERSION=^8.14.0

VERSION_TAG="$([ -n "$VERSION_TAG" ] && echo "$VERSION_TAG" || echo "dev")"

if [ -f "$ROOT"/apps/"$SERVICE_NAME"/deploy/service.dockerfile ]; then
  FILES+=("$ROOT"/apps/"$SERVICE_NAME"/deploy/service.dockerfile)
fi

"$ROOT"/scripts/.internal/concat-and-prep-dockerfiles.js "${FILES[@]}" \
  | docker image build \
    --secret id=npmrc,src=$HOME/.npmrc \
    --build-arg NODE_VERSION=$NODE_VERSION \
    --build-arg PM_VERSION=$PM_VERSION \
    --build-arg SERVICE_NAME="$SERVICE_NAME" \
    -f - \
    -t ghcr.io/my-namespace/"$SERVICE_NAME":"$VERSION_TAG" \
    --target service \
    "$ROOT"
