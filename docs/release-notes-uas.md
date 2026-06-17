# Release Notes — UAS (Final Release)

## 📌 Overview

Rilis **UAS (v3.0.0-final)** menandai penyelesaian fase akhir pengembangan aplikasi **Kelarin** (Team Ethereal). Pada fase ini, sistem telah sepenuhnya bertransformasi dari arsitektur monolitik menjadi **microservices** yang terdistribusi, aman, dan terotomatisasi secara penuh melalui pipeline CI/CD modern.

---

## 🚀 Fitur Baru & Peningkatan (Modul 15)

### 1. Arsitektur Microservices (Stateless & Terisolasi)
* **Auth Service (`services/auth-service`)**: Microservice khusus penanganan registrasi, login JWT, validasi token, dan pengelolaan hak akses pengguna.
* **Task Service (`services/task-service`)**: Microservice khusus penanganan operasi CRUD tugas akademik, status penyelesaian, dan data statistik.
* **API Gateway (`services/gateway`)**: Titik masuk tunggal (*single entry point*) berbasis FastAPI/Nginx untuk merutekan request ke masing-masing microservice secara aman dan transparan.
* **Database per Service**: Isolasi data penuh dengan memisahkan database autentikasi (`auth-db`) dan database tugas (`task-db`) menggunakan PostgreSQL 16.

### 2. Portal Manajemen Admin (Frontend & Backend)
* **Akses Khusus Admin**: Tautan navigasi khusus **Admin Panel** di header yang hanya muncul jika pengguna login sebagai peran `admin`.
* **Daftar & Pencarian Pengguna**: Menampilkan tabel seluruh pengguna terdaftar dengan fitur filter pencarian real-time.
* **Edit Akun Global**: Fitur sidebar form untuk admin mengubah Nama Lengkap, Peran global (`admin`/`member`), atau melakukan reset Kata Sandi pengguna.
* **Upgrade Role Terproteksi**: Proteksi berlapis di backend (`auth-service`) untuk menolak request perubahan role dari pengguna non-admin (403 Forbidden).

### 3. Pipeline CI/CD Tingkat Lanjut & Otomatisasi (DevOps)
* **Notifikasi Halaman PR**: Integrasi komentar otomatis di Pull Request yang memuat status kelulusan pengujian (sukses/gagal) beserta tautan langsung ke tab Actions.
* **Docker Log Artifacts**: Jika integrasi test gagal atau selesai, logs kontainer mikro akan diekspor otomatis ke berkas `logs/docker-services.log` dan diunggah sebagai artifact GitHub Actions untuk mempermudah debugging.
* **Migrasi Docker Compose V2**: Seluruh pipeline otomatisasi diperbarui dari perintah usang `docker-compose` menjadi `docker compose`.

---

## 🛠️ Perbaikan & Optimalisasi Kode

* **Pengujian Unit Bebas Lock (Windows)**: Mengubah database pengujian lokal backend dari file fisik `test.db` menjadi *in-memory* SQLite (`sqlite:///:memory:`) dengan `StaticPool` untuk mencegah *file lock* pada sistem operasi Windows.
* **Pembersihan Monolith**: Menghapus direktori `./backend` monolitik lama dari konfigurasi pipeline pengujian CI dan CD guna mempercepat waktu eksekusi workflow.

---

## 🌐 Production URLs

| Layanan | URL Produksi |
| :--- | :--- |
| **Frontend App** | `https://cc-kelompok-a-ethereal-production.up.railway.app` |
| **API Gateway** | `https://kelarin.up.railway.app` |
| **API Docs (Swagger)** | `https://kelarin.up.railway.app/docs` |

---

## ⚠️ Known Issues & Rencana Mendatang

* **Sinkronisasi CORS**: Domain CORS origins dikunci statis pada server. Jika ada perubahan domain frontend baru, penyesuaian manual diperlukan di variabel konfigurasi Gateway dan Microservices.
* **Workspace Kolaborasi Kelompok**: Cetak biru (*blueprint*) untuk *Shared Workspace Selector* dan undangan kolaborasi tim via email telah dirancang di dokumen [ADMIN_FEATURES_AND_FUTURE_ROADMAP.md](file:///D:/01_Workspace/Projects/cc-kelompok-a-ethereal/docs/ADMIN_FEATURES_AND_FUTURE_ROADMAP.md) dan siap diimplementasikan pada fase berikutnya.

---

## 📌 Release Tag

```bash
git tag -a v3.0.0-final -m "Release Final UAS - Microservices & Admin Features"
```
