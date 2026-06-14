## 📝 Summary
Refactoring menyeluruh pada frontend dan sinkronisasi backend untuk standarisasi integrasi API Gateway, dukungan tema (Dark Mode), perbaikan reliabilitas database, dan penanganan error yang lebih robust.

## 🔗 Related Task
- **Target Branch:** `main`

## 🛠 Type of Change
- [ ] ✨ **Feature**: Menambah fungsionalitas baru.
- [ ] 🐛 **Bug Fix**: Memperbaiki masalah yang ada.
- [x] ♻️ **Refactor**: Perubahan kode yang tidak mengubah fungsi (clean code).
- [ ] 📝 **Docs**: Perubahan dokumentasi saja.
- [ ] 🔧 **Chore**: Update build tasks, package manager, atau config.

## 🔍 Scope of Work
### Frontend:
- **API Integration**: Sentralisasi pemanggilan API melalui gateway menggunakan `VITE_API_URL`. Menghapus hardcoded `localhost` dan development assumptions.
- **Safe Fetch Utility**: Implementasi `handleResponse` yang membaca body sebagai text sebelum parsing JSON, mencegah crash pada response kosong/malformed.
- **UI/UX Refinement**: Standarisasi komponen `Button`, `Input`, dan `Toast`. Perbaikan navigasi (catch-all route) dan penanganan session expiry (401/403).
- **Theme Support**: Implementasi penuh Dark Mode pada seluruh halaman (`AboutPage`, `StatusPage`, `TaskList`, dll) dengan audit kontras visual.

### Backend (Task Service & Gateway):
- **Gateway Routing**: Perbaikan pola routing `/tasks` agar tidak lagi 404 dan mendukung base path serta sub-path secara efisien.
- **DB Synchronization**: Pemetaan `owner_id` ke kolom `created_by` sesuai skema asli database Railway. Penambahan kolom `assigned_to` dan `updated_at`.
- **Auto-Migration**: Penambahan script `run_migrations` pada startup untuk menjamin ketersediaan kolom `completed` dan `deadline` di PostgreSQL.
- **FastAPI Lifespan**: Pemindahan inisialisasi DB ke event lifespan untuk mencegah *startup hang* pada koneksi database yang lambat.

## 🧪 Testing & Quality Assurance
- [x] **Unit Tests**: Seluruh 14 test di frontend pass (`npm test`).
- [x] **Integration Check**: Verifikasi alur Login -> Dashboard -> Task Fetching melalui API Gateway.
- [x] **Visual Check**: Tampilan diperiksa pada mode terang dan gelap, termasuk navbar yang tetap konsisten di halaman status.

## 🚀 Deployment Impact
- [ ] **Migrations**: Dijalankan secara otomatis saat startup service.
- [x] **Env Vars**: Memerlukan `VITE_API_URL` pada frontend dan `DATABASE_URL` yang valid pada backend.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets**.
- [x] Dokumentasi internal/README sudah diperbarui.
