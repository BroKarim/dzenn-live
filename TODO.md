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

_(Completed ✅)_

Goal: Migrate from Supabase (cloud) to a self-hosted PostgreSQL instance on the VPS running in Docker. Since you want to continue using Prisma, this is fully supported; only the connection string (`DATABASE_URL`) changes.

## 1. Preparation (Local/Supabase)

- [x] **Export Data:**
  - Export data via Supabase Dashboard (SQL Editor) or `pg_dump` since the dataset is small.
  - Ensure the export includes Schema + Data.
- [x] **Verify Dump:** Check the SQL file to ensure all tables (`User`, `Profile`, `Link`, etc.) are included.

## 2. VPS Setup (Docker)

- [x] **Setup Postgres Container:**
  - Create a `docker-compose.yml` (recommended) or run a standalone `postgres` container.
  - Configure persistent volume mapping (e.g., `./pgdata:/var/lib/postgresql/data`) so data survives container restarts.
  - Set environment variables (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).
- [x] **Network Configuration:**
  - Ensure the `dzenn-app` container and new `postgres` container share a Docker network so they can communicate via hostname (e.g., `postgres`).

## 3. Data Import

- [x] **Copy & Import:**
  - SCP or copy the SQL dump file to the VPS.
  - Execute the SQL file against the new Postgres container.

## 4. Application Configuration

- [x] **Update Environment Variables:**
  - Modify `.env` on VPS.
  - Update `DATABASE_URL` to point to the local container.
  - Ensure `DIRECT_URL` is also updated.
- [x] **Refactor `lib/db.ts`:**
  - **Important:** Remove `@prisma/adapter-neon` usage.
  - Switch to standard `new PrismaClient()` initialization since we are running on a VPS (Serverful) with direct TCP connection to Docker Postgres.
  - Standard Postgres connection is more stable and performant for this setup than the serverless adapter.
- [x] **Prisma Check:**
  - Verify that the schema in the DB matches `prisma/schema.prisma`.
  - Run `npx prisma db push` or `migrate deploy` if needed.

## 5. Switch Over

- [x] **Restart App:** Redeploy or restart the app container to pick up the new database connection.
- [x] **Validation:** Check logs for connection errors and verify data consistency.

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

# �️ Server Reliability & Security (VPS 2GB Optimization)

To prevent resource exhaustion and ensure high availability on limited hardware.

# 🛠️ Server Reliability & Security (VPS 2GB Optimization)

Strategi optimasi untuk memastikan aplikasi tetap ringan, stabil, dan aman pada hardware terbatas (RAM 2GB).

---

## 1. Media Handling Optimization (Zero-Load Strategy)

**Masalah:** VPS mengalami Out of Memory (OOM) saat menghandle upload gambar berukuran besar.
**Solusi:** Memindahkan beban pemrosesan dari Server ke Client dan AWS S3.

### A. Direct Upload (S3 Presigned URLs)
- **Konsep:** Browser meminta URL sementara ke server, lalu upload langsung ke S3 tanpa melewati Next.js (VPS).
- **Keuntungan:** Beban RAM/CPU VPS 0% untuk proses upload.
- **Konfigurasi CORS:** S3 Bucket diatur untuk mengizinkan `PUT` method dari `https://dzenn.live` dan `http://localhost:3000`.

### B. Client-Side Compression
- **Library:** `browser-image-compression`.
- **Logic:** Gambar dikompres ke ukuran < 1MB dan resolusi max 1080px di browser user sebelum dikirim ke S3.
- **Efek:** Hemat kuota S3, hemat bandwidth user, dan proses upload lebih cepat.



---

## 2. Offsite Backup Strategy (Anti-Data Loss)

**Goal:** Mengirim dump database yang terkompresi langsung ke Cloud Storage (S3) tanpa membebani resource server saat jam sibuk.

### A. Tools & Security
- **Rclone:** Digunakan sebagai "kurir" untuk transfer file ke S3 dengan nama remote `s3-backup`.
- **Security:** Environment Variables diambil dari `/root/dzenn/.env` (menggunakan `chmod 600`) untuk menghindari hardcoded password di dalam script.
- **Resource Priority:** Menggunakan `nice -n 19` (CPU) dan `ionice -c 3` (Disk I/O) agar proses backup tidak mengganggu performa website.

### B. Backup Workflow (`/root/scripts/backup-db.sh`)
1. **Dump:** Mengambil data dari docker container `dzenn-postgres`.
2. **Stream Compression:** Hasil dump langsung di-pipe ke `gzip` untuk meminimalkan penggunaan disk lokal.
3. **Cloud Transfer:** Menggunakan `rclone move` dengan flag `--s3-no-check-bucket` untuk mengatasi error location constraint.
4. **Notification:** Integrasi Discord Webhook untuk laporan **SUCCESS** atau **FAILURE** secara real-time.

### C. Automation (Cron Job)
Dijalankan otomatis setiap hari jam 02:00 pagi:
```bash
0 2 * * * /bin/bash /root/scripts/backup-db.sh > /root/scripts/backup.log 2>&1

Lokasi Script : 	/root/scripts/backup-db.sh
Cek Backup di Cloud	: rclone ls s3-backup:brokarim-link-bio/backups/
Jalankan Backup Manual : 	bash /root/scripts/backup-db.sh
Cek Log Backup : 	cat /root/scripts/backup.log
Lokasi Rahasia (.env)	/root/dzenn/.env


## 2. Security Hardening

- [ ] **Firewall (UFW):**
  - **Critical:** Close port 5432 (Postgres) from public access.
  - Allow only minimal ports: 80, 443, 22.
- [ ] **Docker Log Rotation:**
  - Configure `max-size: "10m"` for container logs to prevent disk fill-up.

## 3. Resource Monitoring (Free Tier)

- [ ] **Uptime Monitor:**
  - Setup UptimeRobot pointing to `https://dzenn.live/api/health`.
- [ ] **Memory Watchdog:**
  - Simple script to restart app container if RAM usage > 90% (OOM prevention).
