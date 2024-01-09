#!/bin/bash
set -e

ROOT="$(dirname "$0")/.."
OPTS=()
for f in "$ROOT"/deploy/compose.*; do
  if ! echo "$f" | grep -q 'compose\.[^.]\+\.ya\?ml$'; then
    continue
  fi
  nm="$(echo "$f" | sed -r 's#^.*/compose\.([^.]+)\.ya?ml$#\1#')"
  if [ "$nm" = 'base' ]; then
    continue
  fi
  OPTS+=("$nm")
done

function echo_help() {
  echo "Usage: $0 -h|--help                       View this helptext"
  echo "       $0 [ENV] ([DOCKER COMPOSE ARGS])   Run docker compose with the [ENV] file, passing along any [DOCKER COMPOSE ARGS] to docker compose"
  echo
  echo "Available environments: ${OPTS[*]}"
}

ENV=

while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help)
      echo_help
      exit 0
      ;;
    -*|build|config|cp|create|down|events|exec|images|kill|logs|ls|pause|port|ps|pull|push|restart|rm|run|start|stop|top|unpause|up|version|wait)
      break
      ;;
    *)
      if [ -z "$ENV" ]; then
        ENV="$1"
        shift
      else
        >&2 echo_help
        >&2 echo
        >&2 echo "E: Unknown argument: '$1'"
        exit 1
      fi
  esac
done

if [ -z "$ENV" ]; then
  ENV="dev"
fi

if ! [ -f "$ROOT/deploy/compose.${ENV}.yml" ]; then
  >&2 echo "E: Unknown environment: '$ENV'. Available environments: ${OPTS[*]}"
  exit 1
fi

ARGS=(-f "$ROOT/deploy/compose.base.yml" -f "$ROOT/deploy/compose.${ENV}.yml")
if [ -f "$ROOT/deploy/compose.local.yml" ] && [ "$ENV" != 'local' ]; then
  ARGS+=(-f "$ROOT/deploy/compose.local.yml")
fi

echo
echo "Executing docker compose command using the '${ENV}' profile"
echo
echo

docker compose "${ARGS[@]}" "$@"
