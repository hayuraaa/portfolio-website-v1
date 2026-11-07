#!/usr/bin/env sh
# Writes backups/portfolio-<timestamp>.tar.gz with a consistent copy of the
# database (VACUUM INTO, safe while the site is running) plus all uploads.
set -eu
cd "$(dirname "$0")/.."

stamp=$(date +%Y%m%d-%H%M%S)
mkdir -p backups

docker compose exec -T app node -e "
  const { createClient } = require('@libsql/client');
  createClient({ url: 'file:storage/portfolio.db' })
    .execute(\"VACUUM INTO 'storage/backup-snapshot.db'\")
    .then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
"
docker compose exec -T app sh -c 'tar czf - -C storage backup-snapshot.db uploads; rm -f storage/backup-snapshot.db' \
  > "backups/portfolio-$stamp.tar.gz"

echo "Backup: backups/portfolio-$stamp.tar.gz"
