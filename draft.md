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

- **CI Integration Testing Improvisation**:
  - Mengubah target eksekusi pengujian integrasi dari container `item-service` yang usang menjadi container `task-service` yang aktif.
  - Memperbarui berkas pengujian [services/task-service/tests/test_integration.py](file:///D:/01_Workspace/Projects/cc-kelompok-a-ethereal/services/task-service/tests/test_integration.py) agar menggunakan konfigurasi dinamis via environment variable (`AUTH_SERVICE_URL` & `TASK_SERVICE_URL`) dengan fallback default localhost.
  - Melewatkan environment variable tersebut pada eksekusi `docker-compose exec -T -e AUTH_SERVICE_URL=... -e TASK_SERVICE_URL=... task-service pytest` di `ci.yml` agar pengujian integrasi dapat saling berkomunikasi melalui internal docker network.

## 🧪 Testing & Quality Assurance
- [x] **Lint & Workflow Config Validation**: Memvalidasi keselarasan struktur sintaksis YAML pada GitHub Actions.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets**.
- [x] Dokumentasi internal/README/draft PR sudah diperbarui.
