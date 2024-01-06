#!/bin/bash
set -e

ROOT="$(dirname "$0")/.."

MAIN_FILE="$([ -n "$MAIN_FILE" ] && echo "$MAIN_FILE" || echo "src/main.ts")"

WATCH_FILES=(--watch "./src/**/*")
if [ -d "node_modules/@monorepo" ]; then
  WATCH_FILES+=(--watch "./node_modules/@monorepo/*/src/**/*")
fi

nodemon --config "$ROOT/nodemon.json" "$MAIN_FILE" "${WATCH_FILES[@]}"