## 📝 Summary
Penyelarasan dokumentasi dan perbaikan konfigurasi kritis untuk rilis final UAS. Pembaruan ini mencakup perbaikan masalah CORS Origins di lingkungan produksi, sinkronisasi skema API dari barang dagangan (`/items`) menjadi tugas kelompok akademik (`/tasks`), penulisan catatan rilis UAS (Milestone 3), dan pembuatan paper refleksi analitis individu untuk member Ansel selaku Lead CI/CD.

## 🔗 Related Task
- **Target Branch:** `main`
- **Source Branch:** `fix/docs-and-cors-sync`

## 🛠 Type of Change
- [x] 🐛 **Bug Fix**: Perbaikan bug fungsional yang tidak merusak fitur (Perbaikan CORS Origins di Gateway & Backend).
- [x] 📝 **Docs**: Perubahan dokumentasi saja (README, Spesifikasi API, Release Notes UAS, & Refleksi Ansel).

## 🔍 Scope of Work
* **Backend & API Gateway (`services/`):**
  * **CORS Synchronization**: Menambahkan domain frontend produksi `https://cc-kelompok-a-ethereal-production.up.railway.app` ke daftar CORS origins yang diizinkan pada API Gateway (`services/gateway/main.py`), Auth Service (`services/auth-service/main.py`), dan Task Service (`services/task-service/main.py`). Ini memperbaiki potensi error *CORS Blocked* di browser penguji saat mengakses web app di produksi.
* **Dokumentasi Umum (`README.md`):**
  * Menyelaraskan *Project Structure* agar merepresentasikan arsitektur microservices yang sesungguhnya (folder `services/`) dan membuang folder monolith lama.
  * Memperbaiki tabel *API Reference* agar menggunakan endpoint `/tasks` (bukan `/items`).
* **Dokumentasi API (`docs/api-documentation.md`):**
  * Mengubah dokumentasi manajemen barang `/items` (beserta field `price` & `quantity`) menjadi manajemen tugas akademik `/tasks` (dengan field `title`, `deadline`, `attachment_url`).
  * Mendokumentasikan rute manajemen admin baru (`GET /auth/users`, `PUT /auth/users/{user_id}`, `PATCH /auth/users/{user_id}/upgrade-role`).
* **Release Notes (`docs/release-notes-uas.md`):**
  * Membuat dokumentasi release notes UAS (Milestone 3 / Final Release) untuk mencatat penyelesaian migrasi microservices, fitur administrator, dan integrasi otomatisasi CI/CD.
* **Refleksi Anggota (`docs/member-ANSEL.md`):**
  * Membuat paper refleksi analitis mendalam untuk Ansellma Tita (NIM: 10231017) mengenai keputusan teknis (paralel testing, ephemeral docker compose), kendala database locking di Windows, dan lessons learned sebagai Lead CI/CD.

## 🧪 Testing & Quality Assurance
- [x] **Unit Tests**: Unit test `auth-service` (5/5 passed) dan `task-service` (3/3 passed) berhasil dijalankan secara lokal menggunakan database in-memory sqlite tanpa locking issue.
- [x] **CORS Check**: Verifikasi konfigurasi list origins di kode backend sudah sesuai dengan URL frontend produksi.

## 🚀 Deployment Impact
- [ ] **Migrations**: Tidak ada migrasi tabel database baru.
- [x] **Env Vars**: Mengharuskan domain frontend produksi ditambahkan secara dinamis ke CORS jika ada migrasi server.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets** (kredensial, API keys, dll).
- [x] Semua ketidaksesuaian dokumentasi API dan README telah diselaraskan.
