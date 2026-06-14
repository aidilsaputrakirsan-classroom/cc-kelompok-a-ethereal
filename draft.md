## 📝 Summary
Refactoring menyeluruh pada frontend untuk standarisasi integrasi API Gateway, perbaikan UI/UX, dukungan tema (Dark Mode), dan penanganan error yang lebih robust.

## 🔗 Related Task
- **Target Branch:** `main`

## 🛠 Type of Change
- [ ] ✨ **Feature**: Menambah fungsionalitas baru.
- [ ] 🐛 **Bug Fix**: Memperbaiki masalah yang ada.
- [x] ♻️ **Refactor**: Perubahan kode yang tidak mengubah fungsi (clean code).
- [ ] 📝 **Docs**: Perubahan dokumentasi saja.
- [ ] 🔧 **Chore**: Update build tasks, package manager, atau config.

## 🔍 Scope of Work
- **API Integration**: Sentralisasi pemanggilan API melalui gateway menggunakan `VITE_API_URL`. Menghapus hardcoded `localhost` dan fallback yang tidak aman.
- **Safe Fetch Utility**: Implementasi `handleResponse` yang membaca body sebagai text terlebih dahulu sebelum parsing JSON, mencegah crash pada response kosong atau malformed.
- **UI Components**: Standarisasi komponen `Button`, `Input`, dan `Toast` dengan dukungan visual feedback (loading, disabled, success/error states).
- **Theme Support**: Implementasi penuh Dark Mode pada seluruh halaman (`AboutPage`, `StatusPage`, `TaskList`, dll) dengan audit kontras visual.
- **Robust Error Handling**: Penanganan granular untuk error 401/403 (unauthorized), 503 (service unavailable), dan network errors dengan redirect otomatis ke login jika session habis.
- **Routing**: Perbaikan navigasi dengan catch-all route dan proteksi halaman yang lebih konsisten.

## 🧪 Testing & Quality Assurance
- [x] **Unit Tests**: Seluruh 14 test di frontend pass (`npm test`).
- [x] **Visual Check**: Tampilan diperiksa pada mode terang dan gelap, termasuk status banner dan toast.

## 🚀 Deployment Impact
- [ ] **Migrations**: Tidak ada.
- [x] **Env Vars**: Memerlukan `VITE_API_URL` yang valid (sudah diimplementasikan pengecekan di level UI jika missing).
- [ ] **Dependencies**: Tidak ada penambahan package baru.

## 📸 Proof of Work
- **Test Results**: All 14 tests passed in `vitest`.
- **UI Refinement**: Konsistensi warna dan shadow pada komponen kartu dan form di mode gelap.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets**.
- [x] Dokumentasi internal/README sudah diperbarui (via PR summary).
