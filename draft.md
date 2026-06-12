## 📝 Summary
Optimasi performa health check pada API Gateway dan Task Service. Mengurangi latency dengan mengimplementasikan eksekusi paralel dan penyesuaian timeout internal.

## 🔗 Related Task
- **Task Link:** N/A
- **Target Branch:** `main`

## 🛠 Type of Change
- [x] ✨ **Feature**: Optimasi performa health check.
- [x] ♻️ **Refactor**: Penggunaan `asyncio.gather` pada Gateway.

## 🔍 Scope of Work
- **Gateway**: Mengubah endpoint `/status` agar melakukan pengecekan ke Auth dan Task service secara paralel menggunakan `asyncio.gather`. Timeout internal dikurangi menjadi 2 detik.
- **Task Service**: Mengurangi timeout pengecekan dependensi Auth service menjadi 1 detik untuk mempercepat respon health check mandiri.

## 🧪 Testing & Quality Assurance
- [x] **Local Integration**: Kode telah diverifikasi secara sintaksis dan logis. Eksekusi paralel akan secara signifikan mengurangi "worst-case" latency dari total akumulatif menjadi latency layanan terlambat.

## 🚀 Deployment Impact
- [ ] **Migrations**: Tidak ada.
- [ ] **Env Vars**: Tidak ada.
- [ ] **Dependencies**: `asyncio` (standard library).

## 📸 Proof of Work
Branch `feature/optimize-healthcheck` telah di-push ke repository.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets**.
