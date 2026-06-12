# Pull Request Draft: Total Repository Refactor & Service Integration

## 📝 Summary
Integrasi menyeluruh dari semua fitur tertunda, transisi arsitektur microservices, optimalisasi pipeline CI/CD modular, serta standarisasi struktur repositori dan kontribusi.

## 🔗 Related Task
- **Task Link:** N/A (Consolidated PR)
- **Target Branch:** `main`

## 🛠 Type of Change
- [x] ✨ **Feature**: Fitur Category pada Task, Error Handling Frontend, Integrasi Multi-Service.
- [x] ♻️ **Refactor**: Pemisahan monolithic CI workflow, modularitas Docker build, reorganisasi folder asset & script.
- [x] 📝 **Docs**: Re-linking dokumentasi, update asset path, penambahan PR template bilingual.
- [x] 🔧 **Chore**: Optimalisasi `.gitignore`, integrasi environment variables (non-hardcoded).

## 🔍 Scope of Work
### 1. Functional Features (Business Logic)
- **Task Category**: Implementasi kolom kategori pada Backend (Models, CRUD, Schemas) dan Frontend (UI components).
- **Frontend Resilience**: Penambahan error handling untuk kondisi service unavailable dan validasi token yang lebih robust.
- **Microservices Transition**: Penyiapan direktori `services/` (auth-service, task-service, gateway) untuk migrasi dari monolith.

### 2. Infrastructure & DevOps Optimization
- **Modular CI/CD**: Pemecahan workflow menjadi `ci.yml` (Lint/Test), `cd.yml` (Build/Integration), dan `deploy.yml` (Health/Notify).
- **Parallel Testing**: Implementasi matrix testing untuk Backend Monolith, Frontend, Auth Service, dan Task Service.
- **Matrix Docker Builds**: Otomatisasi build image untuk 4 service sekaligus secara paralel.
- **Automated Integration Tests**: Penambahan tahap pengujian cross-service menggunakan `docker-compose` dalam pipeline.
- **Security**: Penghapusan URL hardcoded, digantikan dengan GitHub Action Variables (`HEALTH_URL`).

### 3. Repository Cleanup & Standardization
- **Script Management**: Relokasi script root (`dev.sh`, `docker.sh`, `setup.sh`) ke folder `scripts/`.
- **Asset Consolidation**: Penyatuan semua gambar dokumentasi ke `docs/assets/` dan update referensi di semua file `.md`.
- **Contribution Standards**: Implementasi `.github/pull_request_template.md` dengan struktur detail dan bilingual.
- **Git Hygiene**: Update `.gitignore` untuk melindungi file internal (`draft.md`, `AGENTS.md`) dan merapikan pengecualian environment.

## 🧪 Testing & Quality Assurance
- [x] **Unit Tests**: Pass untuk Backend dan Frontend (diperluas ke Microservices).
- [x] **Integration Tests**: Verifikasi interoperabilitas antar layanan via Docker Compose dalam pipeline.
- [x] **Local Integration**: Seluruh script operasional di folder `scripts/` telah diverifikasi.
- [x] **Visual Check**: UI task category sudah sesuai.

## 🚀 Deployment Impact
- [ ] **Migrations**: Penambahan kolom `category` pada tabel tasks (memerlukan update skema DB).
- [x] **Env Vars**: Penambahan `VITE_API_URL` dan `HEALTH_URL` untuk fleksibilitas environment.
- [ ] **Dependencies**: Integrasi `pytest-cov`, `httpx`, dan dependencies microservices lainnya.

## 📸 Proof of Work
- Pipeline CI/CD modular berhasil dieksekusi di GitHub Actions.
- Struktur direktori yang rapi dan terdokumentasi.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets** di dalam workflow maupun kode.
- [x] Dokumentasi internal/README sudah diperbarui untuk mencerminkan struktur baru.
