main ref : https://x.com/proskuaaa/status/1932897625327469036?s=20

# TODO: Migrasi API ke Server Actions (ohmylink)

File ini berisi daftar fitur dan logika dari folder `app/api/` yang harus diimplementasikan ulang ke dalam **Server Actions** di folder `server/user/`.

## 🔗 Links (`server/user/links/actions.ts`)

- [ ] **S3 Cleanup (Penghapusan Media)**
  - Implementasikan logika penghapusan file di S3/CloudFront saat `deleteLink` dipanggil.
  - Pastikan `previewImageUrl` atau `icon` yang tersimpan dihapus agar tidak menjadi file sampah.
- [ ] **Validasi Kepemilikan (Security Check)**
  - Tambahkan pengecekan `userId` di setiap action (`updateLink`, `deleteLink`, `reorderLinks`).
  - Pastikan user hanya bisa memodifikasi link yang terhubung dengan `profileId` milik mereka sendiri.
- [ ] **Bulk Reorder System**
  - Buat action khusus untuk menerima array of IDs dan mengupdate field `position` secara batch di database.
  - Dibutuhkan untuk mendukung fitur drag-and-drop di UI.
- [ ] **Zod Schema Validation**
  - Pastikan setiap data yang masuk di-validate menggunakan `zod` sebelum masuk ke DB.
  - Sinkronkan dengan file `server/user/links/schema.ts`.

## 👤 Profile (`server/user/profile/actions.ts`)

- [ ] **Lazy Profile Creation (Auto-Create)**
  - Saat proses `createLink`, tambahkan logika untuk cek apakah record Profile user sudah ada.
  - Jika belum ada, buat record profile secara otomatis sebelum menyimpan link.
- [ ] **Profile Media Cleanup**
  - Saat user mengganti foto profil atau banner, pastikan file lama di S3 dihapus.

## 🗑️ Cleanup Tasks (Setelah Migrasi Selesai)

- [ ] Hapus folder `app/api/links/` secara keseluruhan.
- [ ] Hapus folder `app/api/link-preview/` (karena tidak menggunakan metadata scraping).
- [ ] Update komponen UI agar memanggil Server Actions, bukan lagi `fetch` ke endpoint API.

---

# 🗄️ Database Migration (Supabase -> Self-hosted Postgres)

Goal: Migrate from Supabase (cloud) to a self-hosted PostgreSQL instance on the VPS running in Docker. Since you want to continue using Prisma, this is fully supported; only the connection string (`DATABASE_URL`) changes.

## 1. Preparation (Local/Supabase)

- [ ] **Export Data:**
  - Export data via Supabase Dashboard (SQL Editor) or `pg_dump` since the dataset is small.
  - Ensure the export includes Schema + Data.
- [ ] **Verify Dump:** Check the SQL file to ensure all tables (`User`, `Profile`, `Link`, etc.) are included.

## 2. VPS Setup (Docker)

- [ ] **Setup Postgres Container:**
  - Create a `docker-compose.yml` (recommended) or run a standalone `postgres` container.
  - Configure persistent volume mapping (e.g., `./pgdata:/var/lib/postgresql/data`) so data survives container restarts.
  - Set environment variables (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).
- [ ] **Network Configuration:**
  - Ensure the `dzenn-app` container and new `postgres` container share a Docker network so they can communicate via hostname (e.g., `postgres`).

## 3. Data Import

- [ ] **Copy & Import:**
  - SCP or copy the SQL dump file to the VPS.
  - Execute the SQL file against the new Postgres container:
    ```bash
    cat backup.sql | docker exec -i <postgres-container-name> psql -U <user> -d <dbname>
    ```

## 4. Application Configuration

- [ ] **Update Environment Variables:**
  - Modify `.env` on VPS.
  - Update `DATABASE_URL` to point to the local container:
    `postgresql://user:pass@postgres_container_name:5432/dbname`
  - Ensure `DIRECT_URL` is also updated (usually same as `DATABASE_URL` for self-hosted).
- [ ] **Refactor `lib/db.ts`:**
  - **Important:** Remove `@prisma/adapter-neon` usage.
  - Switch to standard `new PrismaClient()` initialization since we are running on a VPS (Serverful) with direct TCP connection to Docker Postgres.
  - Standard Postgres connection is more stable and performant for this setup than the serverless adapter.
- [ ] **Prisma Check:**
  - Verify that the schema in the DB matches `prisma/schema.prisma`.
  - Run `npx prisma db push` or `migrate deploy` if needed.

## 5. Switch Over

- [ ] **Restart App:** Redeploy or restart the app container to pick up the new database connection.
- [ ] **Validation:** Check logs for connection errors and verify data consistency.
