# Deployment Guide

Dokumen ini berisi panduan deployment aplikasi Kelarin menggunakan Railway sebagai platform cloud deployment. Panduan ini dibuat untuk membantu tim dalam melakukan proses deploy frontend, backend, dan database secara terstruktur, konsisten, dan mudah dipelihara.

---

## Deployment Architecture

Deployment aplikasi Kelarin terdiri dari beberapa service yang berjalan secara terpisah di Railway.

| Service         | Function                         |
| --------------- | -------------------------------- |
| Frontend        | User Interface aplikasi          |
| Auth Service    | Authentication dan Authorization |
| Task Service    | Task Management                  |
| PostgreSQL Auth | Database Auth Service            |
| PostgreSQL Task | Database Task Service            |

Setiap service memiliki database masing-masing untuk mendukung prinsip microservices dan isolasi data.

---

## Railway Setup

1. Login ke Railway menggunakan akun GitHub.
2. Buat project baru pada Railway Dashboard.
3. Tambahkan PostgreSQL database service untuk setiap service yang membutuhkan database.
4. Hubungkan repository GitHub ke Railway.
5. Deploy backend dan frontend menggunakan Dockerfile yang tersedia pada repository.
6. Atur environment variables sesuai kebutuhan masing-masing service.
7. Tunggu proses build dan deployment hingga selesai.
8. Salin URL deployment frontend dan backend.
9. Verifikasi bahwa seluruh service berjalan normal pada Railway Dashboard.

---

## Deployment Workflow

1. Developer melakukan push perubahan kode ke GitHub Repository.
2. Railway mendeteksi perubahan repository secara otomatis.
3. Railway menjalankan proses build berdasarkan Dockerfile masing-masing service.
4. Container baru dijalankan pada environment Railway.
5. Healthcheck service dijalankan secara otomatis.
6. Service yang berhasil deploy akan tersedia melalui URL deployment Railway.
7. Tim melakukan verifikasi deployment sebelum fitur digunakan oleh pengguna.

---

## Environment Variables

### Auth Service (Railway)

| Variable | Contoh Value |
|----------|-------------|
| DATABASE_URL | `${{Postgres.DATABASE_URL}}` |
| SECRET_KEY | `(random hex 64 chars)` |
| ENVIRONMENT | `production` |

### Task Service (Railway)

| Variable | Contoh Value |
|----------|-------------|
| DATABASE_URL | `${{Postgres.DATABASE_URL}}` |
| AUTH_SERVICE_URL | ${{AUTH_SERVICE_URL}} |
| ENVIRONMENT | `production` |

### API Gateway (Railway)

| Variable | Contoh Value |
|----------|-------------|
| AUTH_SERVICE_URL | `${{AUTH_SERVICE_URL}}` |
| TASK_SERVICE_URL | `${{TASK_SERVICE_URL}}` |

### Frontend (Railway)

| Variable | Contoh Value |
|----------|-------------|
| VITE_API_URL | `https://kelarin.up.railway.app/` |

### GitHub Secrets

| Secret | Keterangan |
|---------|------------|
| RAILWAY_TOKEN | Token deployment dari `railway.app/account/tokens` |


---

## Deployment Verification

Setelah deployment selesai, lakukan pengecekan berikut:

* Frontend dapat diakses melalui URL Railway.
* Backend API berjalan dengan normal.
* Endpoint `/health` memberikan response sukses.
* API Documentation (`/docs`) dapat diakses.
* Tidak terdapat error pada logs deployment Railway.

### Health Verification

| Service      | Endpoint  |
| ------------ | --------- |
| Auth Service | `/health` |
| Task Service | `/health` |

Expected Response:

```json
{
  "status": "healthy"
}
```

Apabila terjadi gangguan dependency, service dapat memberikan status:

```json
{
  "status": "degraded"
}
```

---

## Manual Rollback Procedure

Jika deployment versi terbaru menyebabkan aplikasi mengalami error, unhealthy status, atau crash di production, lakukan langkah rollback berikut:

1. Buka Railway Dashboard dan pilih service yang bermasalah.
2. Masuk ke menu **Deployments**.
3. Cari deployment stabil sebelumnya yang berhasil berjalan dengan baik.
4. Klik menu titik tiga pada deployment tersebut.
5. Pilih **Rollback** atau **Redeploy to this Commit**.
6. Tunggu proses deployment selesai.
7. Verifikasi kembali endpoint `/health`.
8. Pastikan aplikasi dapat diakses dengan normal setelah rollback selesai.

---

## Troubleshooting

| Masalah                                   | Solusi                                                             |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Frontend tidak dapat terhubung ke backend | Pastikan `VITE_API_URL` mengarah ke URL backend Railway yang benar |
| Error CORS saat akses API                 | Periksa konfigurasi `CORS_ORIGINS` pada backend                    |
| Deployment gagal build                    | Periksa logs Railway dan pastikan seluruh dependency tersedia      |
| Backend gagal connect database            | Pastikan `DATABASE_URL` sudah benar dan PostgreSQL aktif           |
| GitHub Actions gagal deploy               | Pastikan `RAILWAY_TOKEN` sudah ditambahkan pada GitHub Secrets     |
| Endpoint `/docs` tidak muncul             | Pastikan backend berjalan normal dan FastAPI Swagger aktif         |
| Healthcheck gagal                         | Periksa logs service dan status database                           |
| Service restart terus menerus             | Periksa environment variables dan konfigurasi deployment           |

---

## Security Considerations

* Jangan menyimpan password, token, API key, atau secret secara hardcoded di repository.
* Gunakan Railway Variables untuk konfigurasi production.
* Gunakan GitHub Secrets untuk token deployment dan data sensitif lainnya.
* Pastikan hanya URL frontend yang terdaftar pada konfigurasi CORS.
* Jangan membagikan DATABASE_URL kepada pihak yang tidak berkepentingan.
* Lakukan rotasi credential secara berkala jika diperlukan.

---

## Notes

* Jangan menyimpan secret atau token langsung di repository.
* Selalu gunakan environment variables untuk konfigurasi sensitif.
* Pastikan deployment production menggunakan konfigurasi yang aman.
* Lakukan verifikasi deployment setiap kali terdapat perubahan besar pada aplikasi.
* Simpan dokumentasi deployment agar dapat digunakan oleh anggota tim lain.

---

## Conclusion

Deployment aplikasi Kelarin menggunakan Railway memungkinkan proses deployment dilakukan secara otomatis, konsisten, dan mudah dipantau. Dengan penggunaan environment variables, health verification, rollback procedure, serta troubleshooting guide yang jelas, proses pengelolaan aplikasi di lingkungan production menjadi lebih aman dan terstruktur.

---

# Final Status

🟢 DEPLOYMENT GUIDE READY FOR USE
