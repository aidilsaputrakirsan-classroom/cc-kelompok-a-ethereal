## 📝 Summary
Perbaikan error 422 pada login dengan mengembalikan format pengiriman data ke `x-www-form-urlencoded` (Form Data). Hal ini memastikan compatibility penuh dengan Backend Monolith lama sekaligus mendukung Auth Service microservice baru yang telah diupdate untuk menangani kedua format (JSON & Form).

## 🔗 Related Task
- **Target Branch:** `main`

## 🛠 Type of Change
- [x] 🐛 **Bug Fix**: Memperbaiki masalah 422 Unprocessable Entity (missing username/password).
- [x] ♻️ **Refactor**: Peningkatan kompatibilitas cross-version antara frontend dan backend.

## 🔍 Scope of Work
- **Frontend**: Mengubah metode pengiriman login dari JSON menjadi `URLSearchParams` (Form Data). Ini adalah format standar yang diharapkan oleh `OAuth2PasswordRequestForm` pada monolith.
- **Auth Service**: Mengupdate endpoint `/login` agar secara cerdas mendeteksi `Content-Type` dan memproses input baik dari JSON maupun Form Data.
- **Requirements**: Menambahkan `python-multipart` untuk mendukung pemrosesan Form Data di microservice.

## 🧪 Testing & Quality Assurance
- [x] **Compatibility**: Mendukung pengiriman field `email` atau `username`.
- [x] **Fallback**: Menangani kegagalan parsing JSON atau Form Data dengan pesan error 422 yang jelas.

## 📸 Proof of Work
Branch `feature/login-compatibility-fix` diperbarui dengan commit `b249de4`.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets**.
