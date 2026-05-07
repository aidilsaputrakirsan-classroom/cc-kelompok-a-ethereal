## 📝 Summary
Implementasi konfigurasi global environment, integrasi linter backend (Ruff) pada CI pipeline, dan pembuatan template PR khusus untuk progres Week 10.

## 🔗 Related Task
- **Task Link:** Phase 1, 2, 3 - Week 10
- **Target Branch:** `main`

## 🛠 Type of Change
- [x] ✨ **Feature**: Menambah fungsionalitas CI (Ruff) dan template baru.
- [x] 🔧 **Chore**: Update `docker-compose.yml` dan `.env.example`.

## 🔍 Scope of Work
- **Phase 1**: Reorganisasi variabel lingkungan ke `.env.example` root dan sinkronisasi `docker-compose.yml`.
- **Phase 2**: Penambahan job `lint-backend` di `.github/workflows/ci.yml` dan konfigurasi `backend/ruff.toml`.
- **Phase 3**: Pembuatan file `pr_week10.md` sebagai dokumentasi progres mingguan.

## 🧪 Testing & Quality Assurance
- [x] **Local Integration**: `docker-compose config` telah diverifikasi valid.
- [x] **Linter**: `ruff check backend/` berhasil dijalankan secara lokal dan memperbaiki 2 unused imports.

## 🚀 Deployment Impact
- [x] **Env Vars**: Penambahan `.env.example` di root directory.
- [x] **Dependencies**: Penambahan `ruff` sebagai dependency linter di CI.

## 📸 Proof of Work
- Linter output: `Found 2 errors (2 fixed, 0 remaining).`
- Docker config: Environment variables loaded with fallback values.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets**.
- [x] Dokumentasi internal telah diperbarui.
