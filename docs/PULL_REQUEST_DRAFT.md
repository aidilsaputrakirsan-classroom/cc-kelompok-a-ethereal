## 📝 Summary
Implementasi penuh Fitur Administrasi untuk Manajemen Pengguna (Ubah Nama, Peran/Role, dan Reset Password), penyempurnaan desain antarmuka navigasi (Header & Footer tanpa ikon dekoratif), penguatan pipeline otomatisasi CI/CD, serta pembuatan dokumen panduan UAS dan roadmap pengembangan frontend.

## 🔗 Related Task
- **Task Link:** UAS Final Submission - cc-kelompok-a-ethereal
- **Target Branch:** `main`

## 🛠 Type of Change
- [x] ✨ **Feature**: Menambah fungsionalitas baru (Fitur Admin, AdminPage, dan API Endpoint).
- [x] ♻️ **Refactor**: Perubahan kode yang tidak mengubah fungsi (Navbar, Footer, & Unit Test Mocking).
- [x] 📝 **Docs**: Perubahan dokumentasi saja (README, CI/CD Guide, & Future Roadmap).
- [x] 🔧 **Chore**: Update build tasks, package manager, atau config (Peningkatan CI/CD workflows).

## 🔍 Scope of Work
* **Backend (`services/auth-service`):**
  * Menambahkan endpoint administrasi `GET /users` (melihat semua user) dan `PUT /users/{user_id}` (mengubah nama, role global, reset password) dengan proteksi hak akses `admin`.
  * Membatasi validasi pergantian peran hanya boleh bernilai `admin` atau `member` (sesuai Opsi 3).
  * Menyelaraskan skema database seeding `seed_test_users.py` agar user leader default ber-role `member`.
* **Frontend (`frontend/src`):**
  * Membuat halaman khusus admin `/admin` (`AdminPage.jsx`) yang dilengkapi widget statistik, pencarian instan, tabel pengguna, dan sidebar form editing.
  * Membersihkan `Header.jsx` dan `Footer.jsx` dari ikon/emoji dekoratif untuk estetika yang lebih bersih dan profesional.
  * Membatasi akses menu navigasi `Status` hanya untuk admin saja.
  * Memperbarui file unit test `Header.test.jsx` dengan JWT mock token.
* **CI/CD (`.github/workflows`):**
  * Menghapus bypass status `continue-on-error: true` di `ci.yml` agar unit test gagal memblokir pipeline secara jujur.
  * Memperkenalkan algoritma **Smart Polling Health Check** pada `deploy.yml` (mencoba ping curl selama maksimal 5 menit) dan menulis laporan ringkasan deployment ke **GitHub Step Summary**.

## 🧪 Testing & Quality Assurance
- [x] **Unit Tests**: 14 Vitest unit tests frontend berhasil lulus 100% (Passed).
- [x] **Local Integration**: Telah diverifikasi menggunakan simulasi docker-compose lokal.
- [x] **Visual Check**: Desain Header, Footer, dan halaman Panel Admin terlihat responsif, minimalis, dan profesional baik di mode terang maupun gelap.

## 🚀 Deployment Impact
- [ ] **Migrations**: Tidak ada migrasi tabel baru (menggunakan tabel user bawaan).
- [ ] **Env Vars**: Tidak ada variabel lingkungan baru (menggunakan `VITE_API_URL` dan `HEALTH_URL` bawaan).
- [ ] **Dependencies**: Menginstal `pytest-cov` untuk visualisasi coverage testing di CI runner.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets** (API keys, JWT secrets, dll).
- [x] Dokumentasi internal/README sudah diperbarui.
