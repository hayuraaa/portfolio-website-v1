#!/usr/bin/env bash
# Update the site on an aaPanel server: pull, install, build.
# Then restart the project in aaPanel (Website -> Node.js Project -> Restart).
#
#   cd /www/wwwroot/harisyr.my.id && ./deploy/update-aapanel.sh
set -euo pipefail
cd "$(dirname "$0")/.."

git pull --ff-only
# Always npm (package-lock.json); aaPanel may leave pnpm/yarn files behind.
rm -rf .pnpm-store pnpm-lock.yaml pnpm-workspace.yaml yarn.lock
npm ci --no-audit --no-fund
npm run build

# aaPanel runs Node projects as the "www" user; it must own the data folder.
mkdir -p storage/uploads
chown -R www:www .

echo
echo "Build done. Now restart the project in aaPanel: Website -> Node Project -> Restart."
