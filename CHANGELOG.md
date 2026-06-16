# Changelog

Semua perubahan penting dalam proyek ini akan dicatat dalam file ini.

Format ini didasarkan pada [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), dan proyek ini mematuhi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-16

### Added
- **User Management**: Implementasi User Roles (Admin, Leader, Member) dan seeding data pengguna untuk otorisasi berbasis peran.
- **Task Enhancements**: Fitur deadline pada pembuatan dan manajemen tugas.
- **Monitoring**: Dashboard Monitoring/Status Layanan yang telah dipoles untuk visibilitas kesehatan sistem.
- **Error Handling UI**: Implementasi UI penanganan error untuk layanan yang tidak tersedia (503 Service Unavailable).

### Changed
- **CI/CD Stability**: Peningkatan stabilitas pengujian frontend pada GitHub CI dengan optimasi timeout dan assertions yang lebih robust.
- **Frontend Integration**: Refaktor integrasi frontend menyeluruh untuk perbaikan UI dan pengalaman pengguna.
- **Health Checks**: Optimasi health checks dengan eksekusi paralel untuk pemantauan layanan yang lebih cepat.

### Fixed
- **Task Security**: Penegakan kepemilikan tugas (*Task Ownership*) untuk memastikan user hanya dapat mengakses data miliknya.
- **Database & Migrations**: Perbaikan script migrasi database dan mekanisme fallback database.
- **Auth & Integration**: Perbaikan bug pada tombol Logout dan sinkronisasi integrasi layanan.
- **Backend Cleanup**: Pembersihan variabel tidak terpakai dan optimasi kode pada backend.

## [0.19.0] - 2026-06-13

### Added
- **API Gateway**: Implementasi Central API Gateway sebagai titik masuk tunggal (entry point) untuk arsitektur microservices.
- **Service Routing**: Konfigurasi routing layanan dan penanganan payload tugas yang lebih terpusat.

### Fixed
- **Deployment**: Optimasi Gateway untuk deployment Railway, menyelesaikan masalah 502 Bad Gateway dan CORS.
- **Login Compatibility**: Restorasi dukungan form-data login untuk kompatibilitas dengan monolith dan pembaruan auth-service untuk menangani berbagai format payload.
- **Auth Service**: Perbaikan dependensi `psycopg2-binary` dan pembacaan `DATABASE_URL` pada auth-service.

## [0.18.0] - 2026-06-09

### Added
- **Observability**: Implementasi *Structured Logging* (JSON), Correlation ID untuk tracing, dan endpoint `/metrics` untuk monitoring.
- **Resilience**: Mekanisme *Error Alerting*, *Retry Logic* dengan exponential backoff, dan *Circuit Breaker* pada komunikasi inter-service.
- **Migration**: Script migrasi data otomatis dari monolith ke arsitektur microservices.
- **Documentation**: Penambahan Panduan Operasional, dokumentasi Observabilitas, dan laporan Pengujian Reliabilitas.

### Changed
- **Service Renaming**: Refaktor penamaan dari "Item Service" menjadi "Task Service" untuk konsistensi terminologi bisnis.

### Fixed
- **Fault Tolerance**: Penguatan resiliensi melalui pemantauan kesehatan dependensi dan dukungan inisialisasi database otomatis.

## [0.17.0] - 2026-05-27

### Added
- **Modular CI/CD**: Pemisahan workflow menjadi `ci.yml` (validasi PR) dan `cd.yml` (deployment) untuk manajemen pipeline yang lebih bersih.
- **Automated Testing**: Integrasi pengujian otomatis menggunakan docker-compose di dalam pipeline CI.
- **Notifications**: Fitur notifikasi deployment dan ringkasan langkah pada pipeline CD.
- **Architecture Docs**: Dokumentasi arsitektur microservices dan bukti pengujian produksi.

### Changed
- **Repository Structure**: Reorganisasi besar repositori; pemindahan script utilitas ke `scripts/` dan aset dokumentasi ke `docs/assets/`.
- **Contribution Standards**: Standarisasi proses kontribusi dan pembersihan repositori secara komprehensif.
- **Docker Optimization**: Optimasi build Docker menggunakan GitHub Actions Caching.

### Fixed
- **Frontend Testing**: Perbaikan masalah ambiguous input dan penambahan aria-label pada pengujian CreateTask.
- **Auth Crash**: Perbaikan crash pada bcrypt di auth-service dan sinkronisasi route gateway untuk pembuatan tugas.

## [0.16.0] - 2026-05-13

### Added
- Integrasi **Ruff Linter** pada backend dengan file konfigurasi `backend/ruff.toml`.
- Penambahan fitur **Task Completion** (tombol selesaikan tugas) pada frontend.
- Fitur **Task Attachment** dan **Category** untuk manajemen tugas yang lebih terorganisir.
- Fitur **Reference Link** pada detail tugas.
- Badge status CI Pipeline pada `README.md`.

### Changed
- **Enforced Linting**: Linter sekarang wajib *pass* agar CI Pipeline berhasil (menghapus `continue-on-error`).
- Pembaruan file `CODEOWNERS` untuk akurasi peran tim (Lead Backend, Frontend, DevOps, QA, dan CI/CD).
- Optimasi CI Pipeline: Implementasi *Concurrency*, *Timeouts*, dan notifikasi kegagalan via PR comment.
- Peningkatan cakupan pengujian (*test coverage*) untuk frontend dan backend.

### Fixed
- Perbaikan *syntax error* (trailing comma) pada `schemas.py`.
- Pembersihan *unused imports* pada file `main.py` dan `schemas.py`.
- Sinkronisasi izin (*permissions*) pada GitHub Actions agar bot dapat memberikan komentar di PR.

## [0.15.0] - 2026-05-06

### Added
- Template Pull Request (PR) pada `.github/pull_request_template.md` untuk standardisasi proses *code review*.
- Checklist fungsionalitas untuk perubahan database (SQL/Supabase migrations) di dalam template PR.
- Bagian "Deployment Impact" untuk melacak perubahan pada `.env` dan *dependencies* baru.
- Section "Proof of Work" untuk melampirkan bukti pengujian berupa screenshot atau log terminal.
- Implementasi *Security Hardening*: Rate limiting pada API Gateway dan validasi input (Pydantic) di semua endpoint.

### Changed
- Memperbarui struktur internal repositori untuk mendukung *workflow* CI/CD profesional.
- Meningkatkan kualitas checklist kualitas kode dengan integrasi aturan *Conventional Commits*.
- Final Polish: Pembersihan kode (*code cleanup*) dan standarisasi dokumentasi pada README.md.

### Fixed
- Masalah inkonsistensi informasi saat melakukan *merging* antar branch melalui penambahan panduan deskripsi tugas.
- Perbaikan celah keamanan: Menghapus seluruh *hardcoded secrets* dan menggantinya dengan manajemen `.env`.

## [0.14.0] - 2026-04-29

### Added
- Implementasi *Structured Logging* (format JSON) di semua layanan (Auth & Item Service).
- Sistem *Request Tracing* menggunakan Correlation ID yang diteruskan dari API Gateway.
- Endpoint `/metrics` untuk pemantauan performa aplikasi.
- Dashboard kesehatan (*health dashboard*) sederhana untuk memantau status container.

## [0.13.0] - 2026-04-22

### Added
- Mekanisme *Retry Logic* dengan *exponential backoff* pada komunikasi inter-service.
- Implementasi *Circuit Breaker pattern* untuk menangani kegagalan service secara elegan.
- Migrasi data dari database monolith ke arsitektur microservices terpisah.
- *Integration Tests* untuk memverifikasi komunikasi antar komponen yang berjalan bersamaan.

## [0.12.0] - 2026-04-15

### Added
- Dekomposisi Monolith menjadi Microservices (Auth Service & Item Service).
- API Gateway sebagai entry point tunggal untuk mengarahkan request.
- Konfigurasi Docker Compose untuk menjalankan multi-service (6 container termasuk database).

## [0.11.0] - 2026-04-08

### Added
- Continuous Deployment (CD) pipeline untuk otomatisasi rilis ke cloud (Railway/Render).
- Manajemen *Secrets* pada GitHub Actions untuk deployment yang aman.
- Penerapan prinsip 12-Factor App (Factor III: Config) pada infrastruktur cloud.

## [0.10.0] - 2026-04-01

### Added
- Continuous Integration (CI) pipeline menggunakan GitHub Actions.
- Automated testing: Unit test untuk backend (`pytest`) dan frontend (`Vitest`).
- Job otomatisasi untuk *Build Docker Image* setiap kali Push/PR ke branch utama.
- Badge status CI pada README.md.

## [0.9.0] - 2026-03-25

### Added
- Implementasi *Branch Protection Rules* pada branch `main` (mewajibkan PR & Review).
- Strategi branching (GitHub Flow) dengan naming convention yang konsisten.
- Pengenalan proses *Code Review* antar anggota tim untuk menjaga kualitas kode.

### Changed
- **Peningkatan Workflow**: Menghentikan kebiasaan push langsung ke `main` berdasarkan hasil Retrospective Milestone 1.

## [0.7.0] - 2026-03-18

### Added
- Orkestrasi multi-container dengan Docker Compose (`docker-compose.yml`).
- Konfigurasi *Healthcheck* database: memastikan backend hanya berjalan setelah DB siap.
- *Restart Policy* (`unless-stopped`) pada seluruh container untuk stabilitas sistem.

## [0.6.0] - 2026-03-11

### Added
- Implementasi *Multi-stage Build* pada Dockerfile frontend (React + Nginx) untuk optimasi ukuran image.
- Penggunaan *Docker Networks* untuk isolasi komunikasi antar container.
- *Docker Volumes* untuk persistensi data PostgreSQL agar data tetap ada meski container dihapus.

## [0.5.0] - 2026-03-04

### Added
- Inisialisasi *Containerization* menggunakan Docker.
- Pembuatan Dockerfile dasar untuk FastAPI backend.
- Konfigurasi `.dockerignore` untuk mempercepat proses build image.

## [0.4.0] - 2026-02-25

### Added
- Implementasi Autentikasi berbasis JWT (JSON Web Token).
- Fitur Register dan Login user secara end-to-end.
- Proteksi endpoint CRUD: Hanya user terautentikasi yang dapat mengakses data.
- Pengaturan CORS (Cross-Origin Resource Sharing) antara frontend dan backend.

## [0.3.0] - 2026-02-18

### Added
- Integrasi Frontend React dengan Backend API menggunakan `fetch`.
- Antarmuka CRUD (Create, Read, Update, Delete) yang fungsional.
- Penggunaan React Hooks (`useState`, `useEffect`) untuk manajemen state dan *side effects*.

## [0.2.0] - 2026-02-11

### Added
- Pengembangan REST API inti menggunakan FastAPI.
- Integrasi database PostgreSQL menggunakan SQLAlchemy ORM.
- Validasi data menggunakan Pydantic Schemas.
- Dokumentasi API otomatis via Swagger UI (`/docs`).

## [0.1.0] - 2026-02-04

### Added
- Inisialisasi repositori proyek di GitHub Classroom.
- Setup struktur folder dasar (`frontend` dan `backend`).
- Konfigurasi environment variables dasar (`.env.example`).
- Struktur dasar aplikasi full-stack (Hello World).