#!/usr/bin/env sh

PORT=$1
[ -z "$1" ] && PORT=8081

npx redoc-cli serve --port ${PORT} --watch true ./doc/api.yml