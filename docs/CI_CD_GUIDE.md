# 🚀 Panduan CI/CD & Deployment — Kelarin Project
Dokumen ini menjelaskan arsitektur, alur kerja, dan konfigurasi otomatisasi **Continuous Integration (CI)**, **Continuous Delivery (CD)**, serta **Deployment** pada proyek Kelarin (Team Ethereal).

---

## 📌 1. Gambaran Umum Pipeline
Sistem ini menggunakan **GitHub Actions** untuk memastikan bahwa setiap kode baru yang didorong (push) atau diusulkan melalui Pull Request (PR) memenuhi standar kualitas, lulus pengujian unit/integrasi, dan sukses berjalan di lingkungan produksi (Railway).

Sistem otomatisasi dibagi menjadi 3 file konfigurasi utama di direktori `.github/workflows/`:
1. **`ci.yml` (CI Pipeline)**: Dijalankan pada setiap *Push* ke branch feature/bugfix dan setiap *Pull Request* ke branch `main`.
2. **`cd.yml` (CD Pipeline)**: Dijalankan otomatis di branch `main` setelah `CI Pipeline` selesai dengan sukses.
3. **`deploy.yml` (Deploy Pipeline)**: Dijalankan otomatis di branch `main` setelah `CD Pipeline` selesai, bertugas memverifikasi kesehatan aplikasi di lingkungan produksi.

---

## 🛠️ 2. Detail Arsitektur Alur Kerja

### A. CI Pipeline (`ci.yml`) — *Validation & Quality Gate*
Fokus utama dari pipeline ini adalah memverifikasi kode baru sebelum digabungkan (merge) ke branch utama.
* **Tahap 1: Linting (`lint`)**
  * Menggunakan **Ruff** linter untuk mendeteksi kesalahan sintaksis, gaya penulisan, dan potensi bug pada semua layanan backend Python (`backend`, `auth-service`, `task-service`).
* **Tahap 2: Unit Testing (`test-services`)**
  * Menggunakan strategi **Matrix Job** untuk menjalankan tes secara paralel.
  * Backend (`pytest`): Menjalankan unit test dengan laporan cakupan kode (coverage).
  * Frontend (`vitest`): Menginstal dependensi melalui `npm ci`, melakukan build, dan menjalankan unit test.
  * *Penting:* Flag bypass (`continue-on-error`) telah dihapus. Jika salah satu unit test gagal, pipeline otomatis berhenti dan PR ditandai merah (gagal).
* **Tahap 3: Integration Test (`integration-test`)**
  * Men-spin up seluruh layanan secara lokal di GitHub Runner menggunakan **Docker Compose**.
  * Menunggu hingga semua kontainer berstatus `healthy`.
  * Mengeksekusi pengujian lintas layanan (integration test) di dalam kontainer `task-service` yang menembak API `auth-service`.
  * Mengekspor log kontainer dan mengunggahnya sebagai **Artifact** (`docker-services-log`) yang dapat diunduh untuk kebutuhan debugging.
* **Tahap 4: Notifikasi Pull Request (`notify-success`/`notify-failure`)**
  * Meninggalkan komentar otomatis di halaman Pull Request yang menginformasikan apakah CI sukses atau gagal beserta tautan langsung ke halaman log eksekusi.

---

### B. CD Pipeline (`cd.yml`) — *Build Verification*
Mempersiapkan rilis image Docker saat ada perubahan yang resmi masuk ke branch `main`.
* **Build Docker Cache (`build-docker`)**
  * Membangun Docker Image untuk 4 layanan (`backend`, `frontend`, `auth-service`, `task-service`) menggunakan Docker Buildx.
  * Menggunakan cache GitHub Actions (`cache-from: type=gha`, `cache-to: type=gha`) untuk mempercepat proses build di masa mendatang.
* **Integration Test Akhir (`integration-test`)**
  * Memastikan konfigurasi docker-compose final di `main` dapat berjalan dan merespons health check localhost dengan sukses.

---

### C. Deploy Pipeline (`deploy.yml`) — *Production Verification*
Railway dikonfigurasi untuk langsung men-deploy perubahan begitu mendeteksi push baru di branch `main`. Pipeline ini bertugas memverifikasi pasca-deployment tersebut.
* **Tahap 1: Polling Pintar Health Check (`deploy-health-check`)**
  * Untuk mencegah *false alarm* akibat cold start container, workflow menggunakan algoritma **Smart Polling**.
  * Sistem akan mencoba melakukan ping ke endpoint `/health` produksi (`https://kelarin.up.railway.app/health`) setiap **10 detik** hingga maksimal **5 menit (30 kali percobaan)**.
  * Begitu mendeteksi respons `HTTP 200`, langkah ini dinyatakan sukses dan segera selesai. Jika setelah 5 menit tetap tidak merespons, pipeline akan gagal (menandakan deployment crash loop).
* **Tahap 2: Laporan Ringkasan (`Write Success/Failure Summary`)**
  * Hasil deployment (status sukses/gagal, URL frontend, URL backend, commit SHA, dan timestamp) akan ditulis langsung ke halaman **GitHub Step Summary** agar mudah dilihat oleh tim pengembang tanpa perlu membuka log mentah.

---

## 📁 3. Direktori Berkas Alur Kerja
* [ci.yml](file:///D:/01_Workspace/Projects/cc-kelompok-a-ethereal/.github/workflows/ci.yml) — Konfigurasi Integrasi Berkelanjutan (Lint & Test).
* [cd.yml](file:///D:/01_Workspace/Projects/cc-kelompok-a-ethereal/.github/workflows/cd.yml) — Konfigurasi Pengiriman Berkelanjutan (Build Verify).
* [deploy.yml](file:///D:/01_Workspace/Projects/cc-kelompok-a-ethereal/.github/workflows/deploy.yml) — Konfigurasi Health Check Produksi.

---

## 🔍 4. Panduan Pemecahan Masalah (Debugging)
Jika pipeline CI/CD Anda gagal (berwarna merah), ikuti langkah-langkah berikut:

1. **Gagal di Tahap `Lint`**:
   * Jalankan linter secara lokal sebelum commit:
     ```bash
     ruff check backend/
     ruff check services/auth-service/
     ruff check services/task-service/
     ```
2. **Gagal di Tahap `test-services` (Unit Test)**:
   * **Backend**: Masuk ke folder backend, pastikan dependensi terinstal, lalu jalankan `pytest`.
   * **Frontend**: Masuk ke folder `frontend`, jalankan `npm run test` untuk memeriksa vitest lokal Anda.
3. **Gagal di Tahap `integration-test`**:
   * Buka run GitHub Actions yang gagal.
   * Masuk ke tab **Summary** dan unduh file di bawah kolom **Artifacts** bernama `docker-services-log`.
   * Periksa isi file log tersebut untuk melihat error atau crash dump dari kontainer database, backend, auth, maupun task service.
4. **Gagal di Tahap `deploy-health-check` (Produksi)**:
   * Buka dashboard **Railway** Anda.
   * Periksa logs untuk masing-masing container (khususnya `auth-service` dan `task-service`).
   * Cari tahu apakah ada masalah koneksi database, error variabel lingkungan (environment variables), atau crash startup.
