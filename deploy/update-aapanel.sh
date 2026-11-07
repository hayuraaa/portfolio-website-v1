#!/usr/bin/env bash
# Update the site on an aaPanel server: pull, install, build.
# Then restart the project in aaPanel (Website -> Node Project -> Restart).
#
#   cd /www/wwwroot/portfolio && ./deploy/update-aapanel.sh
set -euo pipefail
cd "$(dirname "$0")/.."

git pull --ff-only
npm ci --no-audit --no-fund
npm run build

# aaPanel runs Node projects as the "www" user; it must own the data folder.
mkdir -p storage/uploads
chown -R www:www .

echo
echo "Build done. Now restart the project in aaPanel: Website -> Node Project -> Restart."
