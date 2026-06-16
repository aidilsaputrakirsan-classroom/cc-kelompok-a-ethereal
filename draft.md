## 📝 Summary
Perbaikan inkonsistensi pemanggilan endpoint status sistem antara Frontend dan API Gateway pada arsitektur Microservices dengan menambahkan rute `/system/status` di API Gateway serta memperbarui daftar pengecualian proxy frontend.

## 🔗 Related Task
- **Target Branch:** `main`

## 🛠 Type of Change
- [ ] ✨ **Feature**: Menambah fungsionalitas baru.
- [x] 🐛 **Bug Fix**: Memperbaiki masalah yang ada.
- [ ] ♻️ **Refactor**: Perubahan kode yang tidak mengubah fungsi (clean code).
- [ ] 📝 **Docs**: Perubahan dokumentasi saja.

## 🔍 Scope of Work
- **API Gateway Compatibility Fix**:
  - Menambahkan decorator `@app.get("/system/status")` di [services/gateway/main.py](file:///D:/01_Workspace/Projects/cc-kelompok-a-ethereal/services/gateway/main.py) sebagai alias untuk rute `/status` agar selaras dengan request status dari Frontend.
  - Memasukkan kata kunci `"system"` ke dalam daftar pengecualian pada fungsi `frontend_proxy` di [services/gateway/main.py](file:///D:/01_Workspace/Projects/cc-kelompok-a-ethereal/services/gateway/main.py) guna mencegah terjadinya loop request atau fallback statis ketika halaman status diakses.

## 🧪 Testing & Quality Assurance
- [x] **Local Integration & Manual Check**: Verifikasi fungsionalitas dashboard status menggunakan `scripts/dev-local.ps1`, memastikan data status untuk layanan Gateway, Auth, dan Tasks terambil dengan benar dan berstatus *healthy*.
- [x] **Frontend Unit Tests**: Memastikan seluruh 14 unit test frontend tetap berjalan hijau dan lulus tanpa regresi.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets**.
- [x] Dokumentasi internal/README/draft PR sudah diperbarui.
