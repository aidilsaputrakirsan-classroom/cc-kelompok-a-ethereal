# 🚀 Week 10 PR Template — Ethereal Team
<!-- Template khusus untuk pengumpulan Phase 1 - 4 pada Week 10 -->

## 📝 Summary
<!-- Ringkasan progres Phase 1 sampai Phase 4 -->
- **Phase 1:** Global Environment & Docker Config
- **Phase 2:** Ruff Linter Integration in CI
- **Phase 3:** PR Template Creation (Week 10)
- **Phase 4:** [Pending implementation]

## 🛠 Progress Details
- [x] **Phase 1**: Pembuatan `.env.example` global dan update `docker-compose.yml`.
- [x] **Phase 2**: Penambahan job `lint-backend` di `ci.yml` dan konfigurasi `ruff.toml`.
- [x] **Phase 3**: Pembuatan template PR khusus Week 10 (`pr_week10.md`).
- [ ] **Phase 4**: [Target Phase 4]

## 🔍 Technical Implementation
<!-- Penjelasan singkat mengenai perubahan teknis -->
- Penggunaan default values di `docker-compose.yml` untuk port dan db config.
- Integrasi `ruff` dengan rule `E` dan `F` untuk menjaga kualitas kode backend.

## 🧪 Verification
- [x] `ruff check backend/` pass locally.
- [x] `docker-compose config` valid.
- [ ] CI Pipeline test results (Screenshot di bawah).

## 📸 Screenshots / Proof of Work
<!-- Lampirkan bukti output terminal ruff atau docker config -->

## 🏁 Final Checklist
- [x] Semua phase telah di-push ke branch masing-masing.
- [x] Tidak ada secrets yang bocor di commit history.
- [x] Penamaan branch konsisten (`phase-x-...`).
