# Deployment Guide
Dokumen ini berisi panduan deployment aplikasi Kelarin menggunakan Railway sebagai platform cloud deployment. Panduan ini dibuat untuk membantu tim dalam melakukan proses deploy frontend, backend, dan database secara terstruktur dan konsisten.

## Railway Setup

1. Login ke Railway menggunakan akun GitHub.
2. Buat project baru pada dashboard Railway.
3. Tambahkan service PostgreSQL untuk database aplikasi.
4. Deploy backend dan frontend menggunakan Dockerfile yang terhubung dengan GitHub repository atau image Docker yang telah tersedia di Docker Hub.
5. Pastikan proses build dan deployment berhasil tanpa error.
6. Salin URL deployment frontend dan backend untuk digunakan pada environment variables.
7. Verifikasi bahwa seluruh service berjalan dengan normal pada Railway dashboard.

---

## Manual Rollback Procedure

Jika deployment versi terbaru menyebabkan aplikasi mengalami error, unhealthy status, atau crash di production, lakukan langkah rollback berikut:

1. Buka Railway Dashboard dan pilih service yang bermasalah (backend atau frontend).
2. Masuk ke tab **Deployments**.
3. Cari deployment versi stabil sebelumnya yang berhasil berjalan dengan baik.
4. Klik menu titik tiga pada deployment tersebut lalu pilih **Rollback** atau **Redeploy to this commit**.
5. Tunggu proses deployment selesai.
6. Lakukan pengecekan ulang pada endpoint `/health` untuk memastikan aplikasi kembali stabil dan dapat diakses dengan normal.

---

## Environment Variables

### Backend (Railway)

| Variable     | Contoh Value                       |
| ------------ | ---------------------------------- |
| DATABASE_URL | `${{Postgres.DATABASE_URL}}`       |
| SECRET_KEY   | `(random hex 64 chars)`            |
| CORS_ORIGINS | `https://frontend-url.railway.app` |
| ENVIRONMENT  | `production`                       |

### Frontend (Railway)

| Variable     | Contoh Value                      |
| ------------ | --------------------------------- |
| VITE_API_URL | `https://backend-url.railway.app` |

### GitHub Secrets

| Secret        | Keterangan                                         |
| ------------- | -------------------------------------------------- |
| RAILWAY_TOKEN | Token deployment dari `railway.app/account/tokens` |

---

## Deployment Verification

Setelah deployment selesai, lakukan pengecekan berikut:

* Frontend dapat diakses melalui URL Railway.
* Backend API berjalan dengan normal.
* Endpoint `/health` memberikan response sukses.
* API Documentation (`/docs`) dapat diakses.
* Tidak terdapat error pada logs deployment Railway.

---

## Troubleshooting

| Masalah                                   | Solusi                                                             |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Frontend tidak dapat terhubung ke backend | Pastikan `VITE_API_URL` mengarah ke URL backend Railway yang benar |
| Error CORS saat akses API                 | Periksa konfigurasi `CORS_ORIGINS` pada backend                    |
| Deployment gagal build                    | Cek logs Railway dan pastikan dependency sudah sesuai              |
| Backend gagal connect database            | Pastikan `DATABASE_URL` sudah benar dan PostgreSQL aktif           |
| GitHub Actions gagal deploy               | Pastikan `RAILWAY_TOKEN` sudah ditambahkan pada GitHub Secrets     |
| Endpoint `/docs` tidak muncul             | Pastikan backend berjalan normal dan FastAPI Swagger aktif         |

---

## Notes

* Jangan menyimpan secret atau token langsung di repository.
* Gunakan GitHub Secrets untuk data sensitif.
* Pastikan environment production menggunakan konfigurasi yang aman.
