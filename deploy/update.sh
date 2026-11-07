#!/usr/bin/env sh
# Pull the latest code and rebuild. Data in the portfolio-data volume is kept.
set -eu
cd "$(dirname "$0")/.."

git pull --ff-only
docker compose up -d --build
docker image prune -f >/dev/null
docker compose ps
