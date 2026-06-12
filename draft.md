## 📝 Summary
Implementasi Central API Gateway menggunakan FastAPI dan refaktorisasi Frontend untuk mendukung arsitektur layanan terpusat. Mengganti direct call ke microservices menjadi melalui Gateway.

## 🔗 Related Task
- **Task Link:** N/A
- **Target Branch:** `main`

## 🛠 Type of Change
- [x] ✨ **Feature**: Menambah fungsionalitas baru (API Gateway).
- [x] ♻️ **Refactor**: Perubahan kode pada Frontend untuk integrasi Gateway.
- [x] 🔧 **Chore**: Update docker-compose dan environment variables.

## 🔍 Scope of Work
- **Backend/Gateway**: Membuat service gateway baru menggunakan FastAPI untuk mem-proxy request ke Auth dan Task service.
- **Frontend**: Mengupdate `api.js`, `LoginPage.jsx`, dan `StatusPage.jsx` untuk berkomunikasi melalui endpoint tunggal di Gateway.
- **Infrastructure**: Menambahkan konfigurasi build gateway di `docker-compose.yml` dan `docker-compose.prod.yml`, serta mengupdate environment variables.

## 🧪 Testing & Quality Assurance
- [ ] **Unit Tests**: N/A
- [x] **Local Integration**: Struktur folder dan konfigurasi Docker telah diverifikasi.
- [x] **Visual Check**: Logic pada StatusPage telah disesuaikan untuk menampilkan status agregat dari Gateway.

## 🚀 Deployment Impact
- [ ] **Migrations**: Tidak ada perubahan skema database.
- [x] **Env Vars**: Penambahan `AUTH_SERVICE_URL`, `TASK_SERVICE_URL`, dan `FRONTEND_URL` untuk konfigurasi Gateway.
- [x] **Dependencies**: Penambahan `httpx` dan `fastapi` pada service gateway baru.

## 📸 Proof of Work
Branch `feature/api-gateway-implementation` telah di-push ke repository.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets**.
- [x] Dokumentasi internal/README sudah diperbarui secara implisit dalam kode.
