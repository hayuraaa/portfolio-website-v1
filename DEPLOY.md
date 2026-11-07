# Deploy dengan aaPanel

Aplikasi jalan sebagai **Node Project** di aaPanel; aaPanel yang mengurus proses, reverse proxy Nginx, dan SSL.
Semua data ada di satu folder: `storage/` (database `portfolio.db` + `uploads/`).

Contoh di bawah memakai folder `/www/wwwroot/portfolio` dan port `3001` — ganti kalau sudah terpakai.

## 1. Swap (sekali saja)

Build Next.js butuh ±1–1,5 GB RAM. Cek dengan `free -h`; kalau baris `Swap` masih 0:

```sh
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## 2. Node.js

aaPanel → **Website → Node Project → Node version manager** → install **v22** (LTS).
Lalu di Terminal, arahkan PATH ke Node itu:

```sh
ls /www/server/nodejs/                       # lihat versi yang terpasang, mis. v22.12.0
export PATH=/www/server/nodejs/v22.12.0/bin:$PATH
node -v
```

## 3. Ambil kode dan install

```sh
cd /www/wwwroot
git clone -b v2-nextjs https://github.com/hayuraaa/portfolio-website-v1.git portfolio
cd portfolio
echo 'DATABASE_URL=file:storage/portfolio.db' > .env
npm ci --no-audit --no-fund

# Cek driver SQLite cocok dengan server ini:
node -e "require('@libsql/client').createClient({url:':memory:'}).execute('select sqlite_version() v').then(r=>console.log('libsql OK', r.rows[0].v))"
```

## 4. Data

- **Pindah dari laptop:** di laptop jalankan `npm run db:export`, lalu upload `deploy-export/portfolio.db`
  lewat aaPanel **Files** ke `/www/wwwroot/portfolio/storage/` (buat folder `storage` kalau belum ada).
  Salinan ini sudah tanpa sertifikat dummy; akun admin ikut, jadi login dengan password yang sama.
- **Atau mulai kosong:** lewati upload, nanti buat akun dengan `npx tsx scripts/create-admin.mts`.

## 5. Build

```sh
npm run build
mkdir -p storage/uploads
chown -R www:www /www/wwwroot/portfolio
```

## 6. Tambahkan di aaPanel

**Website → Node Project → Add Node project**

| Isian | Nilai |
| --- | --- |
| Project directory | `/www/wwwroot/portfolio` |
| Project name | `portfolio` |
| Run opt | `start` (menjalankan `npm run start`: migrasi database, lalu server) |
| Port | `3001` |
| Run user | `www` |
| Node version | v22 |
| Domain | domain kamu |

Lalu buka pengaturan project → **SSL** → Let's Encrypt → aktifkan **Force HTTPS**.
Login hanya bisa lewat HTTPS, jadi SSL harus aktif sebelum masuk ke `/login`.

Upload gambar bisa sampai 25 MB per simpan; pastikan Nginx mengizinkannya
(**Config** situs → `client_max_body_size 30m;`).

## Update setelah ada perubahan kode

```sh
cd /www/wwwroot/portfolio
export PATH=/www/server/nodejs/v22.12.0/bin:$PATH
./deploy/update-aapanel.sh
```

Lalu **Restart** project di aaPanel. Data di `storage/` tidak tersentuh.

## Backup

```sh
cd /www/wwwroot/portfolio && ./deploy/backup-aapanel.sh
```

Hasilnya `backups/portfolio-<tanggal>.tar.gz` (database + upload), menyimpan 14 terakhir.
Jadwalkan lewat aaPanel **Cron → Shell Script**, harian, dengan dua baris di atas
(tambahkan `export PATH=...` seperti di langkah 2). Sesekali unduh ke luar VPS.

## Catatan

- Jangan buka `storage/portfolio.db` dengan tool SQLite lain saat aplikasi jalan; perubahan terakhir bisa hilang.
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
