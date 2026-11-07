# Deploy dengan aaPanel

Situs ini berjalan di `https://harisyr.my.id` sebagai **Node.js Project** di aaPanel
(Ubuntu 20.04, Node v24 dari aaPanel, port 3002). aaPanel mengurus proses, reverse proxy Nginx, dan SSL.
Semua data ada di satu folder: `/www/wwwroot/harisyr.my.id/storage/` (database `portfolio.db` + `uploads/`).

## Pengaturan project di aaPanel

**Website → Node.js Project → harisyr → Modify**

| Isian | Nilai |
| --- | --- |
| Path | `/www/wwwroot/harisyr.my.id` |
| Name | `harisyr` (hanya huruf, angka, garis bawah) |
| Run opt | **Custom command**: `node node_modules/next/dist/bin/next start -p 3002` |
| Port | `3002` (3000 dan 3001 dipakai aplikasi lain) |
| User | `www` |
| Node | v24.16.0 |
| Boot | aktif |

Hal yang perlu diperhatikan:

- **Jangan centang "Install dependencies"** dan jangan pakai pnpm/yarn. aaPanel mendeteksi pnpm sendiri;
  kalau dibiarkan, ia memasang ulang dependency dengan pnpm/yarn, menghapus `package-lock.json`,
  dan bisa membuat server sangat lambat. Dependency selalu dipasang manual dengan `npm ci`.
- **Port harus ditulis di perintah** (`-p 3002`). aaPanel tidak meneruskan port ke aplikasi;
  tanpa itu Next.js mencoba port 3000 dan langsung berhenti (`EADDRINUSE`).
- **Next.js dijalankan langsung dengan `node`**, bukan `npm run start`, supaya tidak ada proses npm
  yang ikut memakan ±75 MB RAM. Migrasi database tetap jalan otomatis saat server start.
- SSL: tab **SSL** → Let's Encrypt (`harisyr.my.id` + `www`) → **Force HTTPS**.
  Login admin hanya bisa lewat HTTPS.
- Nginx sudah mengizinkan upload 50 MB (`client_max_body_size` di `nginx.conf`), cukup untuk admin.
- Log aplikasi: `/www/wwwlogs/nodejs/harisyr.log`.

## Update setelah ada perubahan kode

Di Terminal aaPanel:

```sh
cd /www/wwwroot/harisyr.my.id
./deploy/update-aapanel.sh
```

Script ini menjalankan `git pull`, `npm ci`, `npm run build`, lalu `chown` ke user `www`.
Setelah selesai, klik **Restart** pada project di aaPanel. Data di `storage/` tidak tersentuh.

Build butuh ±1–1,5 GB RAM; server ini punya swap tambahan 2 GB di `/swapfile` untuk itu.

## Backup

```sh
cd /www/wwwroot/harisyr.my.id && ./deploy/backup-aapanel.sh
```

Hasilnya `backups/portfolio-<tanggal>.tar.gz` (database + upload), menyimpan 14 terakhir.
Bisa dijadwalkan lewat aaPanel **Cron → Shell Script** (harian) dengan baris di atas.
Sesekali unduh ke luar VPS.

## Pasang dari nol (server baru)

```sh
# swap kalau RAM ≤ 2 GB
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

cd /www/wwwroot
git clone -b v2-nextjs https://github.com/hayuraaa/portfolio-website-v1.git harisyr.my.id
cd harisyr.my.id
git config --global --add safe.directory /www/wwwroot/harisyr.my.id
echo 'DATABASE_URL=file:storage/portfolio.db' > .env
npm ci --no-audit --no-fund
mkdir -p storage/uploads
# upload storage/portfolio.db (dari `npm run db:export` di laptop), atau mulai kosong
npm run build
chown -R www:www /www/wwwroot/harisyr.my.id
```

Lalu tambahkan project di aaPanel dengan pengaturan di atas. Kalau database kosong,
buat akun admin: `npx tsx scripts/create-admin.mts`, lalu `chown -R www:www storage`.

## Catatan

- Jangan membuka `storage/portfolio.db` dengan tool SQLite lain saat aplikasi jalan; perubahan terakhir bisa hilang.
  Untuk salinan, pakai script backup.
- Lupa password admin: `npx tsx scripts/create-admin.mts` dengan email yang sama, lalu `chown -R www:www storage`.

---

# Alternatif: Docker

Kalau VPS tanpa panel dan sudah ada Docker. Satu container untuk aplikasi (Next.js + SQLite) dan satu untuk Caddy (HTTPS otomatis).
Semua data — database dan file upload — ada di volume Docker `portfolio-data`.

### Yang dibutuhkan

- VPS Linux (Ubuntu/Debian), minimal 1 GB RAM. Build pertama butuh memori; kalau RAM 1 GB, tambahkan swap 1–2 GB.
- Domain yang record **A**-nya sudah mengarah ke IP VPS.
- Port 80 dan 443 terbuka.

### Pertama kali

```sh
# 1. Install Docker (sekali saja)
curl -fsSL https://get.docker.com | sh

# 2. Ambil kode
git clone <url-repo-kamu> portfolio
cd portfolio

# 3. Isi domain
echo "DOMAIN=namadomainkamu.com" > .env

# 4. Build dan jalankan
docker compose up -d --build

# 5. Buat akun admin (password diketik tersembunyi)
docker compose exec app node scripts/create-admin.mjs
```

Buka `https://namadomainkamu.com/login`, masuk, lalu isi profil di **Admin → Profil**.
Sertifikat HTTPS diambil otomatis oleh Caddy saat pertama diakses.

### Update setelah ada perubahan kode

```sh
./deploy/update.sh
```

Isinya `git pull` lalu `docker compose up -d --build`. Migrasi database jalan otomatis saat aplikasi start, data tidak hilang.

### Backup

```sh
./deploy/backup.sh
```

Hasilnya `backups/portfolio-<tanggal>.tar.gz` berisi salinan database dan semua upload. Aman dijalankan saat situs hidup.
Simpan file itu di luar VPS (mis. `scp` ke laptop). Untuk backup harian, tambahkan ke crontab:

```
0 3 * * * cd /home/<user>/portfolio && ./deploy/backup.sh >/dev/null 2>&1
```

### Restore

```sh
mkdir -p /tmp/restore && tar xzf backups/portfolio-<tanggal>.tar.gz -C /tmp/restore
mv /tmp/restore/backup-snapshot.db /tmp/restore/portfolio.db

docker compose stop app
docker compose cp /tmp/restore/. app:/app/storage/
docker compose run --rm -u root app sh -c 'rm -f storage/portfolio.db-wal storage/portfolio.db-shm; chown -R app:app storage'
docker compose start app
```

### Memindahkan data dari laptop ke VPS

Kalau profil dan upload sudah diisi di laptop, salin folder `storage/` ke VPS lalu:

```sh
docker compose stop app
docker compose cp ./storage/. app:/app/storage/
docker compose run --rm -u root app sh -c 'chown -R app:app storage'
docker compose start app
```

### Perintah lain

| Keperluan | Perintah |
| --- | --- |
| Lihat log | `docker compose logs -f app` |
| Lupa password admin | `docker compose exec app node scripts/create-admin.mjs` (pakai email yang sama) |
| Restart | `docker compose restart app` |
| Status | `docker compose ps` |

### Catatan

- Tidak perlu install Node.js, MySQL, atau Nginx di VPS — semuanya ada di dalam container.
- Jangan membuka `portfolio.db` dengan tool SQLite lain (mis. `sqlite3`, DB Browser) **saat aplikasi berjalan** — versi SQLite yang berbeda bisa merusak catatan WAL dan perubahan terakhir hilang. Untuk salinan, pakai `./deploy/backup.sh`.
- Login hanya bisa lewat HTTPS (cookie `secure`). Untuk mencoba build produksi lewat `http://`, set `COOKIE_SECURE=false` di service `app`.
- Mau pakai `www.` juga? Tambahkan record DNS untuk `www`, lalu tambahkan blok ini di `deploy/Caddyfile`:

  ```
  www.{$DOMAIN} {
  	redir https://{$DOMAIN}{uri} permanent
  }
  ```
