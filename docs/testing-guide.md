# Testing & QA Guide — Project Kelarin
Dokumen ini berfungsi sebagai panduan bagi seluruh anggota tim untuk menjalankan pengujian secara lokal, memahami alur kerja GitHub Actions, dan melakukan debugging saat terjadi kegagalan pada pipeline.

## 1. Cara Menjalankan Test Lokal
Sebelum melakukan git push, setiap developer wajib menjalankan test secara lokal untuk memastikan perubahan kode tidak merusak fitur yang sudah ada.

**🐍 Backend (Python & Pytest)**

Pastikan kamu berada di dalam direktori backend dan virtual environment sudah aktif.

- Menjalankan semua test:
```bash
pytest
```

- Menjalankan test dengan laporan coverage:
```bash
pytest --cov=. --cov-report=term-missing
```
(Gunakan ini untuk memastikan fungsi baru yang kamu buat sudah ter-cover oleh test minimal 50-60%).

- Catatan: Backend menggunakan SQLite in-memory untuk testing agar proses cepat dan tidak mengganggu database utama.

---

**⚛️ Frontend (React & Vitest)**

Masuk ke direktori frontend `cd frontend` sebelum menjalankan perintah di bawah ini.

- Instalasi dependensi (jika ada error modul tidak ditemukan): 
```bash
npm install
```

- Menjalankan semua test (Sekali jalan):
```bash
npm test
```

- Jika ingin memantau perubahan secara real-time:
```bash
npm run test:watch
```

- Melihat coverage:
```bash
npm run test:coverage
```

---

## 2. Cara Membaca Log CI di GitHub Actions
Setiap kali kamu membuat Pull Request (PR), GitHub Actions akan otomatis menjalankan pipeline. Jika muncul tanda silang merah (❌), ikuti langkah ini:

1. Buka tab "Checks" pada Pull Request kamu atau klik "Details" di samping status commit yang gagal.
2. Pilih Job yang gagal di sisi kiri (contoh: 🐍 Test Backend atau ⚛️ Test Frontend).
3. Cari Step yang berwarna merah. Klik tanda panah untuk melakukan expand pada log.
4. Lihat pesan error (biasanya berada di baris paling bawah sebelum log selesai).

---

## 3. Strategi Debugging Test Failure
Jangan panik saat test gagal! Gunakan tabel referensi ini:


- **AssertionError**: Hasil kode tidak sesuai dengan ekspektasi di file test. Periksa kembali logika di file `.py` atau `.jsx` kamu.  

- **ERR_MODULE_NOT_FOUND (Frontend)**: Sering terjadi jika folder `node_modules` tidak lengkap. Solusinya: hapus `node_modules`, jalankan `npm install`, lalu coba lagi.  

- **ModuleNotFoundError (Backend)**: Kamu mungkin lupa menambahkan library baru ke file `requirements.txt`.  

- **Docker Build Failure**: Jika test lolos tapi build gagal, periksa apakah ada file yang lupa di-copy di dalam `Dockerfile`.

---

## 4. Cara Menambah Test Baru
Untuk menjaga stabilitas project Kelarin, setiap fitur baru harus disertai file test.

- **Menambah Test Backend**: Buat file di `backend/tests/` dengan nama yang diawali `test_`, misalnya `test_task_management.py`.  

- **Menambah Test Frontend**: Buat file di `frontend/src/components/__tests__/` untuk komponen UI, atau di `frontend/src/test/` untuk logika API.  

- **Target Tugas**: Pastikan total test backend minimal 15 dan frontend minimal 10 skenario.

---

## 5. Standar Kelulusan (Definition of Done)
Sebuah fitur dianggap selesai jika:
1. Semua test PASSED di lokal.
2. Coverage minimal 60% untuk backend.
3. Pipeline CI Hijau (Passing) di GitHub.
4. Sudah di-review oleh Lead QA atau anggota tim lainnya.