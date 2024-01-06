#!/bin/bash
set -e

pnpm typecheck
pnpm prettier
pnpm lint