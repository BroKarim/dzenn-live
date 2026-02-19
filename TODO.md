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

---

# 🚀 S3 Presigned URL Implementation (Direct-to-S3 Upload)

Goal: Move from Proxy Upload (Client → VPS → S3) to Direct Upload (Client → S3) using S3 Presigned URLs to reduce VPS resource load and bypass payload limits.

## 1. Backend Configuration (Server)

- [ ] **CORS Policy Strategy:**
  - Update AWS S3 Bucket CORS configuration to allow `PUT` requests from `https://dzenn.live` (and `http://localhost:3000`).
- [ ] **Presigned URL Action:**
  - Create a new server action `getPresignedUrl` in `server/upload/actions.ts`.
  - Use `@aws-sdk/s3-request-presigner` to generate a `PUT` URL for a specific key (e.g., `uploads/avatars/{userId}-{timestamp}.png`).
  - Set expiration time (e.g., 60 seconds).

## 2. Frontend Implementation (Client)

- [ ] **Refactor `ProfileEditor`:**
  - Update the upload logic in `components/control-panel/profile-editor.tsx`.
  - Step 1: Call `getPresignedUrl` to get the authorized URL.
  - Step 2: Use standard `fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })`.
  - Step 3: Once success, update the profile `avatarUrl` with the final S3 URL.
- [ ] **Optimization:**
  - Implement progress bar (optional) using `XMLHttpRequest` instead of `fetch` for better UX.

## 3. Cleanup & Final Check

- [ ] **Remove Proxy Logic:**
  - Delete `uploadBase64ToS3` and the old `uploadImage` action once the new system is stable.
- [ ] **Security:**
  - Ensure users can only generate URLs for their own directories/filenames if possible.
- [ ] **Validation:** Verify images are readable via CloudFront after direct upload.

## 4. Old File Deletion Strategy (Optimization)

Goal: Remove old profile pictures from S3 to save storage costs, but ONLY after the new profile picture is successfully updated in the database.

- [x] **Logic in `updateProfile` Action:**
  - In `server/user/profile/actions.ts`:
  - Before updating the database, fetch the current profile to get `oldAvatarUrl`.
  - Perform the DB update with the new `avatarUrl`.
  - If DB update is successful AND `oldAvatarUrl` exists:
    - Extract the S3 Key from `oldAvatarUrl`.
    - Call `deleteFromS3(key)` (import from `@/lib/s3`).
  - Wrap deletion in a generic error handler so it doesn't fail the main request if S3 deletion fails (it's a background task).

---

# 🐛 Bug Fixes & Stability Optimizations

## 1. Intermittent "Failed to Save" (Connection Pool Exhaustion)

- **Problem:** `Promise.all` fired 5+ parallel HTTP requests for a single "Save Changes" click, exhausting the VPS database connection pool.
- **Fix:** Consolidated 5 profile actions into one `saveAllProfileChanges` server action. Reduced DB round-trips from 5 → 1.

## 2. Duplicate Links & Persistent Corrupt State

- **Problem:** Corrupted `draftProfile` was persisting in `localStorage`. The store favored stale local drafts over fresh server data upon refresh.
- **Fix:** Refactored `editor-store.ts` to always update with server data and only restore drafts if all link IDs are still valid in the DB.

## 3. Prisma P2025 Error on Reorder/Delete

- **Problem:** `db.link.update` throws a fatal error if a record is missing (race condition).
- **Fix:** Replaced with `db.link.updateMany` and `db.link.deleteMany`, which handle missing records gracefully without crashing the transaction.

## 4. Backend Refactoring (Clean Code)

- **Fix:** Implemented `withAuth` HOF in `links/actions.ts` to centralize authentication, logging, and error handling, making server actions significantly cleaner and more robust.
