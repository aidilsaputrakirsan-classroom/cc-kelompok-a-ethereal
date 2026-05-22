# Tutorial: Mengelola Pipeline CI/CD Multi-Service (GitHub Actions)

Dokumen ini menjelaskan cara menggunakan dan memperbarui sistem CI/CD baru yang telah diimplementasikan dalam repositori ini.

## 1. Arsitektur Pipeline
Pipeline kita sekarang terbagi menjadi dua file utama untuk efisiensi:
- **`ci.yml`**: Berjalan pada setiap Pull Request dan Push ke branch fitur. Fokus pada testing paralel.
- **`cd.yml`**: Berjalan hanya saat merge ke `main`. Fokus pada build Docker image dan deployment.

## 2. Fitur Utama
- **Parallel Matrix Build**: Backend dan Frontend diuji secara bersamaan di VM yang berbeda.
- **Dependency Caching**: Library Python (`pip`) dan Node.js (`npm`) disimpan di cache agar instalasi berikutnya lebih cepat.
- **Docker Buildx & GHA Cache**: Proses build Docker image menggunakan cache GitHub Actions untuk menghemat waktu build hingga 70%.

---

## 3. Cara Menambahkan Service Baru
Jika Anda menambahkan service baru (misal: `analytics-service`), ikuti langkah ini:

### Di `ci.yml`:
Tambahkan entitas baru ke dalam `matrix.include`:
```yaml
matrix:
  include:
    # ... service yang sudah ada
    - service: analytics
      path: ./analytics
      runtime: python # atau 'node'
```

### Di `cd.yml`:
Tambahkan nama folder service ke dalam daftar matrix:
```yaml
strategy:
  matrix:
    service: [backend, frontend, analytics]
```

---

## 4. Mengelola Environment Variables (Secrets)
Jika aplikasi Anda membutuhkan API Key atau rahasia lainnya:
1. Masuk ke **Settings** > **Secrets and variables** > **Actions** di GitHub.
2. Tambahkan **New repository secret**.
3. Panggil di dalam file `.yml` dengan format: `${{ secrets.NAMA_SECRET }}`.

Contoh di `ci.yml`:
```yaml
env:
  DATABASE_URL: ${{ secrets.DB_TEST_URL }}
```

---

## 5. Troubleshooting Common Issues
- **Job Gagal di Frontend**: Pastikan file `package-lock.json` sudah di-commit. CI menggunakan `npm ci` yang membutuhkan file tersebut.
- **Job Gagal di Backend**: Cek apakah semua dependencies sudah terdaftar di `requirements.txt`.
- **Docker Build Timeout**: Jika build terlalu lama, pastikan Dockerfile menggunakan multi-stage build untuk mengoptimalkan layer.

## 6. Tips DevOps Senior
- **Jangan matikan cache**: Caching adalah kunci kecepatan. Jika Anda mengubah versi runtime (misal Node 18 ke 20), GitHub Actions akan otomatis mengupdate cache pada run berikutnya.
- **Gunakan PR untuk Test**: Selalu buat Pull Request untuk melihat apakah `ci.yml` berjalan sukses sebelum melakukan merge ke `main`.

---
*Dibuat oleh Senior DevOps Engineer - 2026*
