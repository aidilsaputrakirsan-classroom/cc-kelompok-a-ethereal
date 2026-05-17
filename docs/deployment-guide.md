# Deployment Guide
Dokumen ini berisi panduan deployment aplikasi Kelarin menggunakan Railway sebagai platform cloud deployment. Panduan ini dibuat untuk membantu tim dalam melakukan proses deploy frontend, backend, dan database secara terstruktur dan konsisten.

## Railway Setup

1. Login ke Railway menggunakan akun GitHub.
2. Buat project baru pada dashboard Railway.
3. Tambahkan service PostgreSQL untuk database aplikasi.
4. Deploy backend dengan memilih root directory `/backend`.
5. Deploy frontend dengan memilih root directory `/frontend`.
6. Pastikan deployment berhasil dan service berstatus aktif.
7. Salin URL deployment frontend dan backend untuk digunakan pada environment variables.

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
