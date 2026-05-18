# Release Notes — Milestone 2

## 📌 Overview

Milestone 2 merupakan tahap pengembangan lanjutan aplikasi **Kelarin**, yaitu aplikasi manajemen tugas berbasis cloud yang dirancang untuk membantu mahasiswa mengelola tugas akademik secara terstruktur dan kolaboratif.

Pada milestone ini, tim berhasil menyelesaikan proses deployment production, CI/CD pipeline, production testing, monitoring service, serta penyempurnaan dokumentasi project.

---

# 🚀 Features Completed

## Authentication

* User registration
* User login
* Session authentication

## Task Management

* Create task/item
* Read task list
* Update task/item
* Delete task/item
* Search task feature

## Deployment & DevOps

* Docker containerization
* Docker Compose setup
* GitHub Actions CI/CD pipeline
* Health endpoint monitoring (`/health`)
* Production testing documentation

## Documentation (W9-W11)

* Git workflow guide
* Deployment guide
* Production testing report
* Milestone retrospective
* Release notes documentation

---

# 🌐 Production URLs

| Service     | URL                                     |
| ----------- | --------------------------------------- |
| Frontend    | https://cc-kelompok-a-ethereal-production.up.railway.app/        |
| Backend API | https://kelarin.up.railway.app/      |
| API Docs    | https://kelarin.up.railway.app/docs |

---

# 🛠 Tech Stack

| Category         | Technology     |
| ---------------- | -------------- |
| Frontend         | React + Vite   |
| Backend          | FastAPI        |
| Database         | PostgreSQL     |
| Containerization | Docker         |
| CI/CD            | GitHub Actions |
| Deployment       | Railway        |
| Version Control  | Git & GitHub   |

---

# 🧪 Production Validation

Berikut validasi yang telah dilakukan pada environment production:

| Test                     | Status   |
| ------------------------ | -------- |
| Frontend accessible      | ✅ Passed |
| Backend API accessible   | ✅ Passed |
| Health endpoint working  | ✅ Passed |
| User authentication      | ✅ Passed |
| CRUD functionality       | ✅ Passed |
| Docker container running | ✅ Passed |
| CI/CD pipeline           | ✅ Passed |

---

# ⚠️ Known Issues

* Beberapa endpoint masih membutuhkan optimasi response time.
* Proses backup database saat ini masih dijalankan secara berkala tanpa otomatisasi penuh.
* Monitoring log masih dilakukan secara manual melalui Railway dashboard.

---

# 📌 Release Tag

```bash
git tag v2.0
```

Milestone 2 menandai versi stabil pertama aplikasi Kelarin yang berhasil berjalan pada production environment berbasis cloud.