# Portfolio v2

Portofolio Haris Yunanda — Next.js 16, SQLite (Drizzle ORM), dengan halaman admin di `/admin`.

## Jalankan di laptop

```sh
npm install
npm run admin:create   # buat akun admin (sekali)
npm run dev            # http://localhost:3000
```

Database (`storage/portfolio.db`) dan file upload (`storage/uploads/`) dibuat otomatis.
Migrasi database jalan sendiri setiap server start.

Import profil dari situs lama (Laravel, MySQL): `npm run db:seed`.

## Mengubah struktur database

1. Edit `src/db/schema.ts`
2. `npm run db:generate` — membuat file migrasi baru di `drizzle/`
3. Restart `npm run dev`; migrasi diterapkan otomatis. Commit file di `drizzle/`.

`npm run db:studio` membuka tampilan isi database di browser.

Jangan buka `storage/portfolio.db` dengan `sqlite3` bawaan macOS atau tool SQLite lain selagi `npm run dev` jalan; versi SQLite-nya berbeda dan perubahan bisa hilang. Pakai `db:studio`, atau matikan server dulu.

## Deploy

Lihat [DEPLOY.md](./DEPLOY.md) — Docker Compose + Caddy (HTTPS otomatis) di VPS.
