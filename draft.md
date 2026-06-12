## 📝 Summary
Perbaikan error 422 pada login dengan menyelaraskan nama field antara Frontend dan Backend. Memastikan compatibility dengan standard OAuth2 (menggunakan `username`) tanpa memutus dukungan untuk field `email`.

## 🔗 Related Task
- **Task Link:** N/A
- **Target Branch:** `main`

## 🛠 Type of Change
- [ ] ✨ **Feature**: Menambah fungsionalitas baru.
- [x] 🐛 **Bug Fix**: Memperbaiki masalah 422 Unprocessable Entity pada login.
- [x] ♻️ **Refactor**: Peningkatan fleksibilitas skema login.

## 🔍 Scope of Work
- **Auth Service**: 
    - Mengupdate `LoginRequest` agar menerima field `username` dan `email` secara opsional.
    - Menambahkan logika fallback untuk menggunakan field mana pun yang tersedia sebagai identitas user.
- **Frontend**: 
    - Mengupdate `api.js` agar mengirim data login menggunakan field `username` (yang diisi dengan email) dalam format JSON. Hal ini menyelaraskan frontend dengan ekspektasi backend microservice maupun potensi sisa konfigurasi monolith.

## 🧪 Testing & Quality Assurance
- [x] **Local Integration**: Skema Pydantic baru telah diverifikasi dapat menerima payload dengan `username` saja.

## 🚀 Deployment Impact
- [ ] **Migrations**: Tidak ada.
- [x] **Env Vars**: Pastikan `VITE_API_URL` mengarah ke domain **Gateway** baru agar perubahan ini efektif sepenuhnya.

## 📸 Proof of Work
Branch `feature/login-compatibility-fix` telah di-push. Error 422 `missing username` pada microservice akan teratasi dengan perubahan ini.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets**.
