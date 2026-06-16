## 📝 Summary
Implementasi penyimpanan log Docker Compose sebagai GitHub Actions Artifacts pada pipeline CI untuk mempermudah proses debugging jika terjadi kegagalan saat integration test.

## 🔗 Related Task
- **Target Branch:** `main`

## 🛠 Type of Change
- [ ] ✨ **Feature**: Menambah fungsionalitas baru.
- [x] 🐛 **Bug Fix**: Memperbaiki masalah yang ada.
- [ ] ♻️ **Refactor**: Perubahan kode yang tidak mengubah fungsi (clean code).
- [ ] 📝 **Docs**: Perubahan dokumentasi saja.

## 🔍 Scope of Work
- **CI Log Artifacts Integration**:
  - Memperbarui [.github/workflows/ci.yml](file:///D:/01_Workspace/Projects/cc-kelompok-a-ethereal/.github/workflows/ci.yml) pada tahap `integration-test`.
  - Menambahkan langkah `📋 Export Docker Logs` setelah penjalanan pengujian integrasi (`Run Integration Tests`) untuk mengekspor output log seluruh container ke `logs/docker-services.log`.
  - Menambahkan langkah `📤 Upload Docker Logs as Artifact` menggunakan action `actions/upload-artifact@v4` untuk menyimpan berkas log tersebut sebagai artifact di GitHub Actions dengan waktu retensi selama 7 hari.
  - Memastikan kedua proses ekspor dan unggah log tersebut berjalan dengan kondisi `if: always()` agar log tetap tersedia baik saat tes sukses maupun gagal (sangat berguna untuk debugging kegagalan tes).

## 🧪 Testing & Quality Assurance
- [x] **Lint & Workflow Config Validation**: Memvalidasi keselarasan struktur sintaksis YAML pada GitHub Actions.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets**.
- [x] Dokumentasi internal/README/draft PR sudah diperbarui.
