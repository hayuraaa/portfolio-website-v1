# Deploy ke VPS

Satu container untuk aplikasi (Next.js + SQLite) dan satu untuk Caddy (HTTPS otomatis).
Semua data — database dan file upload — ada di volume Docker `portfolio-data`.

## Yang dibutuhkan

- VPS Linux (Ubuntu/Debian), minimal 1 GB RAM. Build pertama butuh memori; kalau RAM 1 GB, tambahkan swap 1–2 GB.
- Domain yang record **A**-nya sudah mengarah ke IP VPS.
- Port 80 dan 443 terbuka.

## Pertama kali

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

## Update setelah ada perubahan kode

```sh
./deploy/update.sh
```

Isinya `git pull` lalu `docker compose up -d --build`. Migrasi database jalan otomatis saat aplikasi start, data tidak hilang.

## Backup

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

## Memindahkan data dari laptop ke VPS

Kalau profil dan upload sudah diisi di laptop, salin folder `storage/` ke VPS lalu:

```sh
docker compose stop app
docker compose cp ./storage/. app:/app/storage/
docker compose run --rm -u root app sh -c 'chown -R app:app storage'
docker compose start app
```

## Perintah lain

| Keperluan | Perintah |
| --- | --- |
| Lihat log | `docker compose logs -f app` |
| Lupa password admin | `docker compose exec app node scripts/create-admin.mjs` (pakai email yang sama) |
| Restart | `docker compose restart app` |
| Status | `docker compose ps` |

## Catatan

- Tidak perlu install Node.js, MySQL, atau Nginx di VPS — semuanya ada di dalam container.
- Jangan membuka `portfolio.db` dengan tool SQLite lain (mis. `sqlite3`, DB Browser) **saat aplikasi berjalan** — versi SQLite yang berbeda bisa merusak catatan WAL dan perubahan terakhir hilang. Untuk salinan, pakai `./deploy/backup.sh`.
- Login hanya bisa lewat HTTPS (cookie `secure`). Untuk mencoba build produksi lewat `http://`, set `COOKIE_SECURE=false` di service `app`.
- Mau pakai `www.` juga? Tambahkan record DNS untuk `www`, lalu tambahkan blok ini di `deploy/Caddyfile`:

  ```
  www.{$DOMAIN} {
  	redir https://{$DOMAIN}{uri} permanent
  }
  ```
