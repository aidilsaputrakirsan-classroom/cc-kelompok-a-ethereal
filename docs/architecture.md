# Microservices Architecture Documentation

## 1. Introduction

Dokumentasi ini dibuat untuk menjelaskan implementasi arsitektur microservices pada aplikasi Kelarin.  
Pada modul ini, backend monolith dipecah menjadi beberapa service independen agar sistem lebih modular, scalable, dan mudah dikelola.

Arsitektur microservices pada project ini terdiri dari:
- Auth Service
- Item Service
- API Gateway (Nginx)
- Database terpisah untuk setiap service
- Frontend Application

---

## 2. Architecture Overview

### Microservices Architecture Diagram

```mermaid

graph TD



User --> Frontend



Frontend --> Gateway



Gateway --> AuthService

Gateway --> TaskService



TaskService -->|Verify Token| AuthService



AuthService --> AuthDB

TaskService --> TaskDB



TaskService --> HealthAggregation

TaskService --> RetryLogic

TaskService --> CircuitBreaker

```

---

## 3. Reliability Features

| Feature            | Description                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Health Aggregation | Menggabungkan status kesehatan service dan dependency untuk menentukan kondisi sistem secara keseluruhan.         |
| Retry Logic        | Melakukan percobaan ulang otomatis ketika komunikasi antar service gagal akibat timeout atau gangguan sementara.  |
| Circuit Breaker    | Mencegah service terus mengirim request ke dependency yang sedang bermasalah untuk menghindari cascading failure. |
| Health Monitoring  | Monitoring kondisi service melalui endpoint `/health` dan Docker healthcheck.                                     |


## 4. Service Overview

| Service | Port | Description |
|----------|------|-------------|
| Frontend | 80 | User interface aplikasi |
| Gateway (Nginx) | 80 | API Gateway dan reverse proxy |
| Auth Service | 8001 | Authentication dan authorization service |
| Item Service | 8002 | CRUD item management |
| Auth Database | 5432 | Database khusus authentication |
| Item Database | 5432 | Database khusus item service |

---

## 5. API Contract

### Auth Service

| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/register` | Register user baru |
| POST | `/login` | Login user |
| GET | `/verify` | Verifikasi JWT token |
| GET | `/health` | Healthcheck auth-service |

---

### Task Service

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/tasks` | Menampilkan seluruh task |
| GET | `/tasks/{id}` | Menampilkan detail task |
| POST | `/tasks` | Menambahkan task baru |
| PUT | `/tasks/{id}` | Mengubah task |
| DELETE | `/tasks/{id}` | Menghapus task |
| GET | `/health` | Healthcheck task-service |

---

## 6. Docker Compose Workflow

| Command | Description |
|----------|-------------|
| `docker compose up --build` | Menjalankan seluruh container microservices |
| `docker compose down` | Menghentikan seluruh container |
| `docker compose ps` | Melihat status container |
| `docker compose logs auth-service` | Melihat logs auth-service |
| `docker compose logs item-service` | Melihat logs item-service |

---
## 7. Local Development Setup

### Prerequisites

* Docker Desktop
* Docker Compose
* Git

### Menjalankan Seluruh Service

```bash
docker compose up --build
```

## 8. Verifikasi Status Service

```bash
docker compose ps
```

Expected Result:

* auth-service → healthy
* task-service → healthy
* auth-db → healthy
* task-db → healthy
* gateway-nginx → healthy
* frontend → healthy

### Menghentikan Service

```bash
docker compose down
```



## 9. Healthcheck & Monitoring

### Health Endpoint

| Service | Endpoint | Status |
|----------|-----------|--------|
| Auth Service | `/health` | ✅ Active |
| Item Service | `/health` | ✅ Active |

---

### Monitoring Logs

| Command | Function |
|----------|----------|
| `docker compose logs auth-service` | Monitoring auth-service |
| `docker compose logs item-service` | Monitoring item-service |

---

## 10. Testing Validation

### Docker Compose Validation

| Service | Status |
|----------|--------|
| auth-service | ✅ Healthy |
| item-service | ✅ Healthy |
| auth-db | ✅ Healthy |
| item-db | ✅ Healthy |
| frontend | ✅ Healthy  |
| gateway-nginx | ✅ Healthy |

### Keterangan

- Seluruh container berhasil dijalankan menggunakan Docker Compose.
- Healthcheck service menunjukkan status healthy.
- Tidak ditemukan crash pada service utama.

---

## 11. Health Endpoint Testing

| Test Case | Result |
|------------|--------|
| Auth Service `/health` accessible | ✅ Passed |
| Item Service `/health` accessible | ✅ Passed |
| Health status returns `200 OK` | ✅ Passed |

### Keterangan

- Endpoint health berhasil diakses melalui Swagger dan Docker healthcheck.
- Service memberikan response `200 OK`.
- Monitoring service berjalan dengan normal tanpa error.

---

## 12. Feature Testing

| Feature | Result |
|----------|--------|
| Register User | ✅ Passed |
| Login User | ✅ Passed |
| Create Task | ✅ Passed |
| Read Task | ✅ Passed |
| Update Task | ✅ Passed |
| Delete Task | ✅ Passed |

### Keterangan

- Seluruh fitur utama aplikasi berhasil berjalan pada implementasi microservices.
- Frontend berhasil terhubung dengan API Gateway dan backend services.

---

# 13. Development vs Microservices Comparison

| Component | Monolith Architecture | Microservices Architecture |
|------------|----------------------|----------------------------|
| Backend Structure | Single backend | Multiple independent services |
| Database | Single database | Database per service |
| Deployment | Single container | Multi-container |
| Scalability | Limited | More scalable |
| Fault Isolation | Single point of failure | Service isolation |

---

## 14. Documentation Evidence

| Testing Activity | Evidence | Description |
|------------------|----------|-------------|
| Docker Compose Validation | ![Docker Compose](assets/docker-compose-ps.png) | Pengujian dilakukan menggunakan perintah `docker compose ps` untuk memastikan seluruh container microservices berjalan dengan status running dan healthy. |
| Auth Service Healthcheck | ![Auth Health](assets/auth-health.png) | Pengujian dilakukan pada endpoint `/health` auth-service melalui Swagger untuk memastikan service authentication berjalan normal dengan response `200 OK`. |
| Item Service Healthcheck | ![Item Health](assets/item-health.png) | Pengujian dilakukan pada endpoint `/health` item-service untuk memastikan service item management berjalan normal tanpa error. |
| User Registration Testing | ![Register Testing](assets/register-testing.png) | Pengujian dimulai dengan membuat akun baru melalui halaman registrasi untuk memastikan auth-service dapat menyimpan data user dengan baik. |
| User Login Testing | ![Login Testing](assets/login-testing.png) | Pengujian dilakukan menggunakan akun yang telah terdaftar untuk memastikan proses authentication dan JWT token berjalan normal. |
| Create Item Testing | ![Create Item](assets/create-item.png) | Pengujian dilakukan dengan menambahkan item baru pada aplikasi untuk memastikan item-service dapat menerima dan menyimpan data dengan baik. |
| Read Item Testing | ![Read Item](assets/read-item.png) | Pengujian dilakukan untuk memastikan item yang telah dibuat berhasil ditampilkan pada frontend application. |
| Update Item Testing | ![Update Item](assets/update-item.png) | Pengujian dilakukan dengan mengubah data item untuk memastikan fitur update berjalan normal pada microservices architecture. |
| Delete Item Testing | ![Delete Item](assets/delete-item.png) | Pengujian dilakukan dengan menghapus item dari sistem untuk memastikan delete endpoint berjalan dengan baik tanpa error. |
| Frontend Microservices Testing | ![Frontend Testing](assets/frontend-dashboard.png) | Pengujian dilakukan dengan membuka aplikasi melalui gateway nginx untuk memastikan frontend berhasil terhubung dengan backend microservices. |

---

## 15. Service Debug Guide

### Auth Service

Melihat log Auth Service:

```bash
docker compose logs auth-service
```

Health Endpoint:

```text
http://localhost:8001/health
```

---

### Task Service

Melihat log Task Service:

```bash
docker compose logs task-service
```

Health Endpoint:

```text
http://localhost:8002/health
```

---

### API Gateway

Melihat log Gateway:

```bash
docker compose logs gateway
```

Endpoint:

```text
http://localhost
```

---

### Common Troubleshooting

| Problem                              | Solution                                                  |
| ------------------------------------ | --------------------------------------------------------- |
| Container tidak berjalan             | Jalankan `docker compose up --build`                      |
| Service unhealthy                    | Cek logs menggunakan `docker compose logs <service-name>` |
| Frontend tidak dapat connect backend | Periksa konfigurasi gateway nginx                         |
| Endpoint tidak dapat diakses         | Pastikan container running dan network Docker aktif       |
| Healthcheck gagal                    | Periksa dependency service dan database                   |
| Gateway tidak meneruskan request     | Periksa konfigurasi reverse proxy nginx                   |


---

# 13. Conclusion

Implementasi microservices pada aplikasi Kelarin berhasil dijalankan menggunakan Docker Compose dengan arsitektur multi-service.

Seluruh service:
- berhasil berjalan
- saling terhubung
- memiliki healthcheck
- dapat melakukan komunikasi antar service dengan normal

Pengujian fitur utama aplikasi menunjukkan bahwa sistem berjalan stabil pada implementasi microservices.

---

# Final Status

🟢 MICROSERVICES ARCHITECTURE RUNNING SUCCESSFULLY