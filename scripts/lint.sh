#!/bin/bash
set -e

SCRIPTS="$(dirname "$0")"

ESLINT_USE_FLAT_CONFIG=1 eslint -c "$SCRIPTS/../eslint.config.js" --cache --cache-location ./node_modules/.cache/ $@
