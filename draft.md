## 📝 Summary
Perbaikan deployment API Gateway pada Railway untuk mengatasi error 502 Bad Gateway dan masalah CORS. Memastikan Gateway mendengarkan pada port yang tepat dan memiliki endpoint health check yang independen.

## 🔗 Related Task
- **Target Branch:** `main`

## 🛠 Type of Change
- [x] 🐛 **Bug Fix**: Memperbaiki error 502 dan CORS pada Railway.
- [x] 🔧 **Chore**: Optimalisasi startup script untuk Railway environment.

## 🔍 Scope of Work
- **API Gateway (`main.py`)**: 
    - Mengupdate blok `if __name__ == "__main__":` agar menggunakan variabel environment `PORT` dari Railway.
    - Menambahkan `uvicorn.run("main:app", ...)` dengan string import agar mendukung reload dan threading yang lebih baik di production.
    - Menyederhanakan endpoint `/health` agar tidak memiliki dependensi ke service lain (mencegah timeout selama deployment).
    - Memperketat konfigurasi CORS hanya untuk domain yang diizinkan.

## 🧪 Testing & Quality Assurance
- [x] **Local Integration**: Gateway start-up logic telah diverifikasi.

## 🚀 Deployment Impact
- **Root Directory**: Pastikan diset ke `/services/gateway` di Railway settings.
- **Start Command**: `python main.py`
- **Healthcheck Path**: `/health`

## 📸 Proof of Work
Branch `fix/railway-gateway-deployment` telah di-push. Perubahan ini akan memastikan Gateway terdeteksi "Healthy" oleh Railway.

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets**.
