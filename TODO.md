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
