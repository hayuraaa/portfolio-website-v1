#!/usr/bin/env bash
# Writes backups/portfolio-<timestamp>.tar.gz: a consistent copy of the database
# (VACUUM INTO, safe while the site runs) plus all uploads. Keeps the latest 14.
#
#   cd /www/wwwroot/portfolio && ./deploy/backup-aapanel.sh
# aaPanel cron: Cron -> Shell Script, daily, with the line above.
set -euo pipefail
cd "$(dirname "$0")/.."

stamp=$(date +%Y%m%d-%H%M%S)
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
mkdir -p backups

node -e "
  require('@libsql/client').createClient({ url: 'file:storage/portfolio.db' })
    .execute({ sql: 'VACUUM INTO ?', args: ['$work/portfolio.db'] })
    .then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
"
cp -r storage/uploads "$work/uploads" 2>/dev/null || mkdir -p "$work/uploads"
tar czf "backups/portfolio-$stamp.tar.gz" -C "$work" portfolio.db uploads

ls -1t backups/portfolio-*.tar.gz | tail -n +15 | xargs -r rm --
echo "Backup: backups/portfolio-$stamp.tar.gz"
