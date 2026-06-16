# Reliability Testing Documentation

## Overview

Dokumen ini berisi hasil pengujian reliability pada arsitektur microservices aplikasi Kelarin. Pengujian dilakukan untuk memastikan sistem mampu menangani gangguan layanan, memberikan status kesehatan yang sesuai, serta kembali beroperasi normal setelah layanan dipulihkan.

Lingkungan pengujian menggunakan Docker Compose dengan beberapa service yang saling berkomunikasi melalui jaringan internal Docker.

---

# Test Environment

| Component         | Technology     |
| ----------------- | -------------- |
| Frontend          | React + Vite   |
| Gateway           | Nginx          |
| Auth Service      | FastAPI        |
| Task Service      | FastAPI        |
| Auth Database     | PostgreSQL     |
| Task Database     | PostgreSQL     |
| Container Runtime | Docker Desktop |
| Orchestration     | Docker Compose |

---

# Reliability Test Scenarios

## 1. Service Down Testing

### Objective

Memastikan sistem dapat mendeteksi ketika salah satu service tidak tersedia dan memberikan status yang sesuai.

---

### Service Tested

Auth Service

---

### Reproduce Steps

Jalankan seluruh service:

```bash
docker compose up -d
```

Pastikan seluruh service dalam kondisi healthy:

```bash
docker compose ps
```

Matikan Auth Service:

```bash
docker compose stop auth-service
```

Akses endpoint health pada Task Service:

```http
GET /health
```

---

### Expected Behavior

* Task Service tetap berjalan.
* Dependency Auth Service terdeteksi tidak tersedia.
* Status health berubah menjadi `degraded`.
* Sistem tidak mengalami crash.

---

### Actual Result

Response health menunjukkan:

```json
{
  "status": "degraded",
  "service": "task-service",
  "dependencies": {
    "auth-service": "unhealthy"
  }
}
```

### Status

✅ PASSED

---

### Conclusion

Task Service berhasil mendeteksi kegagalan Auth Service dan mengubah status health menjadi degraded tanpa menghentikan service utama.

---

## 2. Timeout / Dependency Failure Testing

### Objective

Memastikan service dapat menangani kegagalan komunikasi dengan dependency tanpa menyebabkan aplikasi berhenti bekerja.

---

### Reproduce Steps

Matikan Auth Service:

```bash
docker compose stop auth-service
```

Kirim request yang membutuhkan komunikasi ke Auth Service.

Pantau log service:

```bash
docker compose logs task-service
```

---

### Expected Behavior

* Request ke dependency gagal dengan timeout atau connection error.
* Error ditangani oleh service.
* Service utama tetap berjalan.
* Tidak terjadi crash container.

### Actual Result

Task Service tetap berjalan meskipun dependency Auth Service tidak tersedia.

Health endpoint menunjukkan status:

```json
{
  "status": "degraded"
}
```

Container Task Service tetap berstatus running.

### Status

✅ PASSED

### Conclusion

Sistem mampu menangani kegagalan dependency tanpa menyebabkan service utama berhenti beroperasi.

---

## 3. Service Recovery Testing

### Objective

Memastikan sistem dapat kembali beroperasi normal setelah service yang gagal dipulihkan.

---

### Reproduce Steps

Nyalakan kembali Auth Service:

```bash
docker compose start auth-service
```

Pastikan service kembali healthy:

```bash
docker compose ps
```

Lakukan pengecekan endpoint health:

```http
GET /health
```

---

### Expected Behavior

* Auth Service kembali healthy.
* Dependency dapat diakses kembali.
* Status health berubah dari degraded menjadi healthy.
* Sistem kembali berjalan normal.

---

### Actual Result

Auth Service berhasil dijalankan kembali dan status container berubah menjadi healthy.

Task Service kembali dapat berkomunikasi dengan Auth Service.

---

### Status

✅ PASSED

---

### Conclusion

Sistem berhasil melakukan recovery setelah dependency kembali tersedia.

---

# Reliability Testing Summary

| Scenario                     | Expected Result               | Result   |
| ---------------------------- | ----------------------------- | -------- |
| Service Down                 | Dependency failure terdeteksi | ✅ Passed |
| Timeout / Dependency Failure | Service tetap berjalan        | ✅ Passed |
| Service Recovery             | Sistem kembali normal         | ✅ Passed |

---

# Conclusion

Berdasarkan pengujian yang dilakukan, arsitektur microservices Kelarin menunjukkan kemampuan reliability yang baik dalam menghadapi gangguan layanan. Sistem mampu mendeteksi service yang gagal, mempertahankan operasi service utama ketika dependency tidak tersedia, serta kembali beroperasi normal setelah service dipulihkan.

Hasil pengujian menunjukkan bahwa mekanisme health monitoring dan service isolation berjalan sesuai dengan tujuan implementasi microservices.