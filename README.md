# ☁️ **Cloud App - Kelarin**

## 🌐 Live Demo

| Layanan | Tautan Akses |
| :--- | :--- |
| **Aplikasi Frontend** | [cc-kelompok-a-ethereal-production.up.railway.app](https://cc-kelompok-a-ethereal-production.up.railway.app/) |
| **Backend API Gateway** | [kelarin.up.railway.app](https://kelarin.up.railway.app/) |
| **API Docs (Swagger)** | [kelarin.up.railway.app/docs](https://kelarin.up.railway.app/docs) |

## 🔄 CI/CD

![CI Pipeline](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-ethereal/actions/workflows/ci.yml/badge.svg)
![CD Pipeline](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-ethereal/actions/workflows/deploy.yml/badge.svg?branch=main)

Pipeline otomatis berjalan saat push ke main:
1. ✅ Test backend (pytest)
2. ✅ Test frontend (Vitest)
3. ✅ Build Docker images
4. 🚀 Deploy ke Railway

---

# **1. Deskripsi Proyek**

**Kelarin** adalah platform manajemen tugas akademik berbasis cloud-native yang dirancang untuk memfasilitasi kolaborasi mahasiswa secara terstruktur. Aplikasi ini mengintegrasikan:

* Penambahan tugas
* Penentuan deadline
* Distribusi tanggung jawab tim

dalam satu dashboard terpadu.

Dengan arsitektur yang *scalable* dan penyimpanan terpusat, Kelarin memungkinkan:

* Monitoring progres secara *real-time*
* Transparansi kerja tim
* Akses data dari mana saja

**Tujuan utama:**

* Mengatasi dokumentasi tugas yang terfragmentasi
* Menghilangkan pembagian peran yang tidak jelas
* Meningkatkan efisiensi kerja kelompok


# **2. Fitur Utama & Kegunaan**
* **Manajemen Tugas Kolaboratif:** Pembagian tugas tim yang transparan dilengkapi tenggat waktu (deadline).
* **Role-Based Access Control (RBAC):** Otentikasi aman berbasis JWT dengan pembagian peran terstruktur (`admin` & `member`).
* **Halaman Status Laporan:** Grafik ringkasan progres dan performa penyelesaian tugas kelompok secara real-time.
* **Portal Manajemen Admin:** Panel khusus administrator untuk memanajemen pengguna (mengubah nama, kata sandi, dan hak akses peran).


## 🔐 Authentication & Authorization
* Register
* Login
* JWT Authentication
* Role-Based Access Control (RBAC)


Role:
* Admin
* Member


## 📋 Task Management
* Create Task
* Read Task
* Update Task
* Delete Task
* Search Task


## 📊 Monitoring & Reporting
* Dashboard Status
* Statistik penyelesaian tugas
* Monitoring progres kelompok


## 👨‍💼 Admin Management
* Kelola pengguna
* Ubah role pengguna
* Reset informasi akun
---

# **3. Profil Tim (ETHEREAL TEAM)**

| Nama                        | NIM      | Peran               |
| --------------------------- | -------- | ------------------- |
| Tiya Mitra Ayu              | 10231088 | Lead Backend        |
| Amazia Devid Saputra        | 10231013 | Lead Frontend       |
| Alsha Dwi Cahya             | 10231011 | Lead Container      |
| Andini Permata Sari         | 10231015 | Lead QA & Docs      |
| Ansellma Tita Pakartiwuri Putri | 10231017 | Lead Deploy & CI/CD |

---

# **4. Tech Stack**

## **Backend**

* **Python 3.10+** → Bahasa utama
* **FastAPI** → Framework REST FastAPI
* **PostgreSQL 16** → Database relasional
* **Nginx** → API Gateway & reverse proxy

## **Frontend**

* **React.js** → UI berbasis komponen
* **Vite** → Tooling SPA modern

## **DevOps & Cloud**

* **Docker** → Containerization
* **Docker Compose** → Orkestrasi multi-container
* **GitHub Actions** → CI/CD pipeline
* **Railway** → Hosting backend & database

---

# **5. Arsitektur Sistem**

Kelarin menggunakan komunikasi **stateless berbasis JWT**.

```
[Client / User]
       |
     (HTTPS)
       |
       v
[React Frontend (Vite)]  <--- REST API (JWT Stateless) --->  [FastAPI Backend]
                                                                |
                              ---------------------------------
                              |                               |
                           (SQL / ORM)                    (API / SDK)
                              |                               |
                              v                               v
                        [PostgreSQL 16]                 [Cloud Storage]
                  (Data User, Task, Status)        (Optional: File Attachment)
```

## **Penjelasan Komponen**

* **Client** → Akses melalui browser (HTTPS)
* **Frontend** → UI, state, routing
* **Backend** → Business logic & autentikasi
* **Database** → Penyimpanan data utama
* **Cloud Storage** → File tambahan (opsional)

---

# **6. Getting Started**

## Prasyarat

Pastikan perangkat telah terpasang:

* Docker Desktop
* Docker Compose
* Python 3.12+
* Node.js 20+
* Git CLI

---

## Menjalankan Seluruh Sistem (Direkomendasikan)

Karena Kelarin menggunakan arsitektur microservices, cara menjalankan aplikasi yang direkomendasikan adalah menggunakan Docker Compose.

### Build dan Jalankan Seluruh Service

```bash
docker compose up --build
```

Atau dalam mode background:

```bash
docker compose up -d
```

Service yang akan berjalan:

* Frontend
* Gateway Service (Nginx)
* Auth Service
* Task Service
* Auth Database
* Task Database

---

### Mengecek Status Service

```bash
docker compose ps
```

---

### Melihat Log Service

Melihat seluruh log:

```bash
docker compose logs
```

Melihat log secara realtime:

```bash
docker compose logs -f
```

Melihat log service tertentu:

```bash
docker compose logs auth-service
docker compose logs task-service
docker compose logs gateway-service
```

---

### Menghentikan Seluruh Service

```bash
docker compose down
```

---

### Menjalankan Frontend Secara Lokal (Opsional)

Untuk pengembangan frontend tanpa Docker:

```bash
cd frontend
npm install
npm run dev
```

Frontend dapat diakses melalui:

```text
http://localhost:5173
```

---

### Menjalankan Auth Service Secara Lokal (Opsional)

```bash
cd services/auth-service

pip install -r requirements.txt

uvicorn main:app --reload --port 8001
```

Auth Service dapat diakses melalui:

```text
http://localhost:8001
```

Swagger Documentation:

```text
http://localhost:8001/docs
```

---

### Menjalankan Task Service Secara Lokal (Opsional)

```bash
cd services/task-service

pip install -r requirements.txt

uvicorn main:app --reload --port 8002
```

Task Service dapat diakses melalui:

```text
http://localhost:8002
```

---

## Endpoint Lokal

| Service           | URL                        |
| ----------------- | -------------------------- |
| Frontend          | http://localhost:5173      |
| Gateway Service   | http://localhost           |
| Auth Service      | http://localhost:8001      |
| Task Service      | http://localhost:8002      |
| Auth Swagger Docs | http://localhost:8001/docs |

---

## Struktur Service Microservices

| Service         | Deskripsi                             |
| --------------- | ------------------------------------- |
| Frontend        | Antarmuka pengguna berbasis React     |
| Gateway Service | Reverse Proxy dan API Gateway (Nginx) |
| Auth Service    | Authentication dan Authorization      |
| Task Service    | Manajemen tugas dan CRUD item         |
| Auth Database   | Database khusus authentication        |
| Task Database   | Database khusus task management       |

---

## Validasi Deployment Lokal

Pastikan seluruh container berjalan dengan status **healthy** menggunakan:

```bash
docker compose ps
```

Contoh hasil yang diharapkan:

```text
NAME                 STATUS
frontend-kelarin     Up
gateway-service      Up
auth-service         Up (healthy)
task-service         Up (healthy)
auth-db-kelarin      Up (healthy)
task-db-kelarin      Up (healthy)
```

---

# **7. Project Structure**

```
cc-kelompok-a-ethereal/
├── frontend/                  # Antarmuka Pengguna (React + Vite)
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── services/                  # Arsitektur Microservices
│   ├── auth-service/          # Layanan Autentikasi & Pengguna (FastAPI)
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── Dockerfile
│   ├── task-service/          # Layanan CRUD Tugas & Statistik (FastAPI)
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── Dockerfile
│   └── gateway/               # API Gateway & Reverse Proxy
│       ├── main.py
│       └── Dockerfile
├── docs/                      # Dokumentasi & Laporan Pengujian
│   ├── api-documentation.md
│   ├── deployment-guide.md
│   ├── release-notes-uas.md
│   └── ...
├── .github/workflows/         # Pipeline CI/CD (GitHub Actions)
│   ├── ci.yml                 # CI Pipeline
│   └── deploy.yml             # Deploy Pipeline
├── docker-compose.yml         # Orkestrasi Container Lokal
├── Makefile                   # Otomatisasi Perintah Pengembang
├── .gitignore
└── README.md
```

## **Otomatisasi Lingkungan**

* `scripts/setup.sh` → Setup environment otomatis (DevOps)

---

# **8. Informasi Tambahan & ERD**

## **Entitas Utama**

* **Users** → Menyimpan data pengguna, autentikasi, dan informasi peran (*role*).
* **Tasks** → Menyimpan informasi tugas seperti judul, deskripsi, status, dan deadline.
* **Roles** → Mengatur hak akses pengguna dalam sistem (*admin* dan *member*).

## **Relasi Data**

* **Users → Tasks**
  → Satu pengguna dapat memiliki banyak tugas.
  → Digunakan untuk mengelola aktivitas dan progres pekerjaan.

* **Users → Roles**
  → Setiap pengguna memiliki satu role.
  → Role menentukan hak akses terhadap fitur tertentu dalam aplikasi.

## **Tujuan Perancangan Data**

Struktur data dirancang untuk mendukung manajemen tugas yang terorganisir, autentikasi berbasis JWT, serta penerapan Role-Based Access Control (RBAC). Dengan pendekatan ini, sistem dapat memberikan akses yang sesuai kepada setiap pengguna sekaligus menjaga keamanan dan konsistensi data.

---

# **9. Roadmap Proyek**

| Minggu | Target                 | Status |
| ------ | ---------------------- | ------ |
| 1      | Setup & Hello World    | ✅      |
| 2      | REST API + Database    | ✅      |
| 3      | React Frontend         | ✅      |
| 4      | Full-Stack Integration | ✅      |
| 5–7    | Docker & Compose       | ✅      |
| 8      | UTS Demo               | ✅      |
| 9–11   | CI/CD Pipeline         | ✅      |
| 12–14  | Microservices          | ✅      |
| 15–16  | Final & UAS            | ✅      |


---

# **10. Testing & QA Report**

Bagian ini mendokumentasikan aktivitas Quality Assurance (QA), pengujian fungsional, validasi integrasi layanan, serta verifikasi deployment untuk memastikan aplikasi Kelarin berjalan sesuai kebutuhan pengguna dan spesifikasi teknis.

---

## **10.1 Testing Documentation**

Dokumentasi pengujian yang lebih rinci tersedia pada folder `/docs`.

| Dokumentasi              | Deskripsi                                              |
| ------------------------ | ------------------------------------------------------ |
| `ui-test-results.md`     | Hasil pengujian antarmuka pengguna (UI Testing)        |
| `production-testing.md`  | Validasi deployment pada environment production        |
| `reliability-testing.md` | Pengujian reliability, recovery, dan health monitoring |
| `architecture.md`        | Dokumentasi arsitektur microservices                   |
| `deployment-guide.md`    | Panduan deployment aplikasi                            |

---

## **10.2 API Reference (Microservices Endpoint)**

### Auth Service

| Method | Endpoint    | Auth | Deskripsi                 |
| ------ | ----------- | ---- | ------------------------- |
| POST   | `/register` | No   | Registrasi pengguna baru  |
| POST   | `/login`    | No   | Login pengguna            |
| GET    | `/verify`   | Yes  | Verifikasi JWT Token      |
| GET    | `/health`   | No   | Health check Auth Service |

---

### Task Service

| Method | Endpoint             | Auth | Deskripsi                  |
| ------ | -------------------- | ---- | -------------------------- |
| GET    | `/tasks`             | Yes  | Menampilkan tugas aktif    |
| POST   | `/tasks`             | Yes  | Menambahkan tugas baru     |
| GET    | `/tasks/{task_id}`   | Yes  | Detail tugas spesifik      |
| PUT    | `/tasks/{task_id}`   | Yes  | Mengubah data tugas        |
| DELETE | `/tasks/{task_id}`   | Yes  | Menghapus tugas            |
| GET    | `/tasks/stats`       | Yes  | Mengambil statistik tugas  |
| GET    | `/health`            | No   | Health check Task Service  |

---

### Admin Features (Auth Service via Gateway)

| Method | Endpoint                         | Auth  | Deskripsi                             |
| ------ | -------------------------------- | ----- | ------------------------------------- |
| GET    | `/auth/users`                    | Admin | Menampilkan seluruh pengguna terdaftar|
| PUT    | `/auth/users/{user_id}`          | Admin | Mengubah data profil pengguna global  |
| PATCH  | `/auth/users/{user_id}/upgrade-role`| Admin| Mengubah peran pengguna secara spesifik |

---

## **10.3 Health Check Validation**

Pengujian dilakukan untuk memastikan seluruh service dapat dipantau melalui endpoint health check.

| Service          | Endpoint              | Status   |
| ---------------- | --------------------- | -------- |
| Auth Service     | `/health`             | ✅ Passed |
| Task Service     | `/health`             | ✅ Passed |
| Gateway Service  | Reverse Proxy Running | ✅ Passed |
| Frontend Service | Accessible            | ✅ Passed |

---

## **10.4 Functional Testing Status**

Pengujian dilakukan terhadap seluruh fitur utama aplikasi.

| Feature               | Test Result |
| --------------------- | ----------- |
| User Registration     | ✅ Passed    |
| User Login            | ✅ Passed    |
| JWT Authentication    | ✅ Passed    |
| Create Task           | ✅ Passed    |
| Read Task             | ✅ Passed    |
| Update Task           | ✅ Passed    |
| Delete Task           | ✅ Passed    |
| Search Task           | ✅ Passed    |
| Admin User Management | ✅ Passed    |
| Role Management       | ✅ Passed    |

---

## **10.5 Docker & Infrastructure Validation**

Validasi deployment menggunakan Docker Compose.

| Component              | Status    |
| ---------------------- | --------- |
| Frontend Container     | ✅ Running |
| Gateway Container      | ✅ Running |
| Auth Service Container | ✅ Healthy |
| Task Service Container | ✅ Healthy |
| Auth Database          | ✅ Healthy |
| Task Database          | ✅ Healthy |
| Docker Network         | ✅ Active  |

---

## **10.6 CI/CD Validation**

Pipeline GitHub Actions digunakan untuk menjaga kualitas kode dan proses deployment.

| Pipeline Stage            | Status   |
| ------------------------- | -------- |
| Code Checkout             | ✅ Passed |
| Dependency Installation   | ✅ Passed |
| Linting                   | ✅ Passed |
| Unit Testing              | ✅ Passed |
| Build Process             | ✅ Passed |
| Docker Validation         | ✅ Passed |
| Deployment Workflow       | ✅ Passed |
| Health Check Verification | ✅ Passed |

---

## **10.7 Production Deployment Validation**

Validasi dilakukan pada environment production Railway.

| Validation Item                  | Status   |
| -------------------------------- | -------- |
| Frontend Accessible              | ✅ Passed |
| Backend Accessible               | ✅ Passed |
| API Gateway Accessible           | ✅ Passed |
| Swagger Documentation Accessible | ✅ Passed |
| Authentication Working           | ✅ Passed |
| CRUD Functionality Working       | ✅ Passed |
| Role Management Working          | ✅ Passed |

---

## **10.8 Test Summary**

| Testing Category     | Result   |
| -------------------- | -------- |
| Functional Testing   | ✅ Passed |
| API Testing          | ✅ Passed |
| Health Check Testing | ✅ Passed |
| Docker Validation    | ✅ Passed |
| CI/CD Validation     | ✅ Passed |
| Production Testing   | ✅ Passed |

---

## **10.9 Conclusion**

Berdasarkan seluruh aktivitas pengujian yang telah dilakukan, aplikasi Kelarin berhasil memenuhi kebutuhan fungsional dan non-fungsional yang ditetapkan. Implementasi microservices, Docker containerization, CI/CD pipeline, health monitoring, serta deployment production telah berjalan dengan baik dan stabil.

Status akhir pengujian menunjukkan bahwa sistem siap digunakan pada environment production dan memenuhi kebutuhan demonstrasi serta penilaian proyek akhir Cloud Computing.


---
# **11. Docker & Containerization**

Kelarin menggunakan **Docker** dan **Docker Compose** untuk menjalankan seluruh komponen aplikasi dalam lingkungan yang konsisten dan terisolasi. Dengan pendekatan containerization, setiap service dapat dikembangkan, diuji, dan dijalankan secara independen tanpa bergantung pada konfigurasi perangkat lokal masing-masing anggota tim.

## **Tujuan Penggunaan Docker Compose**

1. **Konsistensi Lingkungan**

   Menyamakan konfigurasi environment pengembangan, pengujian, dan produksi sehingga mengurangi masalah *"it works on my machine"*.

2. **Orkestrasi Multi-Service**

   Menjalankan seluruh komponen sistem secara otomatis melalui satu perintah, meliputi:

   * Frontend Service
   * Gateway Service (Nginx)
   * Auth Service
   * Task Service
   * Auth Database
   * Task Database

3. **Isolasi Layanan**

   Setiap service berjalan pada container terpisah sehingga kegagalan pada satu service tidak secara langsung memengaruhi service lainnya.

4. **Kemudahan Deployment**

   Seluruh konfigurasi service, network, volume, dan dependency dikelola melalui file `docker-compose.yml` sehingga proses deployment menjadi lebih sederhana dan terstandarisasi.

5. **Mendukung Arsitektur Microservices**

   Docker Compose memungkinkan komunikasi antar service melalui jaringan internal Docker sehingga Auth Service, Task Service, Gateway, dan Database dapat berinteraksi secara aman dan terstruktur.

## **Container yang Digunakan**

| Container       | Fungsi                                          |
| --------------- | ----------------------------------------------- |
| Frontend        | Menyediakan antarmuka pengguna berbasis React   |
| Gateway Service | Reverse Proxy dan API Gateway menggunakan Nginx |
| Auth Service    | Menangani autentikasi dan otorisasi pengguna    |
| Task Service    | Menangani manajemen tugas dan CRUD item         |
| Auth Database   | Penyimpanan data autentikasi                    |
| Task Database   | Penyimpanan data tugas dan aktivitas pengguna   |

## Docker Build & Run Instructions

### Cara Menjalankan Aplikasi

Ikuti langkah-langkah berikut:

1. Pastikan Docker sudah terinstall dan sedang berjalan
2. Buka terminal di folder project ini
3. Untuk menjalankan seluruh service (frontend, backend, dan database), gunakan perintah berikut:
```bash
docker compose up --build
```

4. Tunggu hingga semua service berhasil berjalan
5. Buka browser dan akses:
- Frontend → http://localhost:5173
- Backend → http://localhost:8000

Jika halaman berhasil terbuka, berarti aplikasi sudah berjalan dengan baik ✅

---

### Cara Menghentikan Aplikasi

Untuk menghentikan semua container, jalankan:

``` bash
docker compose down
```

---

### Cara Mengecek Status

Untuk memastikan semua service berjalan:

```bash
docker compose ps
```

Jika statusnya Up, berarti container berjalan dengan normal.

---

### Cara Melihat Log

Jika terjadi error atau ingin melihat aktivitas aplikasi:

```bash
docker compose logs
```

Untuk melihat log secara real-time:

```bash
docker compose logs -f
```

---

## Perintah Penting Docker Compose

Berikut beberapa perintah Docker Compose yang sering digunakan:

| Perintah | Deskripsi |
|----------|----------|
| docker compose up | Menjalankan semua service (build jika diperlukan) |
| docker compose up -d | Menjalankan semua service di background (detached mode) |
| docker compose down | Menghentikan dan menghapus container serta network |
| docker compose down -v | Menghentikan dan menghapus container beserta volume (⚠️ data akan hilang) |
| docker compose restart | Me-restart semua service |
| docker compose stop | Menghentikan container tanpa menghapus |
| docker compose ps | Menampilkan status semua container |
| docker compose logs | Menampilkan log dari semua service |
| docker compose logs -f | Menampilkan log secara real-time |
| docker compose exec backend bash | Masuk ke dalam container backend |
| docker compose build | Build semua image |
| docker compose pull | Mengambil image dari registry |

---

# **12. Deployment**

Kelarin dideploy menggunakan platform cloud Railway dengan pendekatan containerized microservices. Setiap service berjalan secara independen sehingga lebih mudah dikelola, dikembangkan, dan diskalakan.

## **Deployment Platform**

| Service                 | Platform             |
| ----------------------- | -------------------- |
| Frontend                | Railway              |
| Gateway Service (Nginx) | Railway              |
| Auth Service            | Railway              |
| Task Service            | Railway              |
| Auth Database           | PostgreSQL (Railway) |
| Task Database           | PostgreSQL (Railway) |

---

## **12.1 Diagram Deployment**

Diagram berikut menggambarkan arsitektur deployment aplikasi Kelarin pada environment production.

```text
                    [ User / Browser ]
                             |
                           HTTPS
                             |
                             ▼
                    [ Frontend Service ]
                             |
                        REST API
                             |
                             ▼
                    [ Gateway Service ]
                          (Nginx)
                       /            \
                      /              \
                     ▼                ▼
           [ Auth Service ]    [ Task Service ]
                  |                  |
                  ▼                  ▼
         [ Auth Database ]   [ Task Database ]
             PostgreSQL         PostgreSQL
```

---

## **Penjelasan Deployment**

### **Frontend Service**

Frontend dibangun menggunakan React dan Vite, kemudian dideploy pada Railway. Service ini menyediakan antarmuka pengguna dan berkomunikasi dengan backend melalui API Gateway.

### **Gateway Service**

Gateway Service menggunakan Nginx sebagai reverse proxy dan entry point utama untuk seluruh request API. Gateway bertugas meneruskan request ke service backend yang sesuai.

### **Auth Service**

Auth Service bertanggung jawab terhadap:

* Registrasi pengguna
* Login pengguna
* JWT Authentication
* Token Verification
* Role Management

### **Task Service**

Task Service bertanggung jawab terhadap:

* Create Task
* Read Task
* Update Task
* Delete Task
* Search Task
* Task Management

### **Database Services**

Setiap service memiliki database tersendiri sesuai prinsip Database per Service pada arsitektur microservices.

* Auth Database menyimpan data pengguna dan autentikasi.
* Task Database menyimpan data tugas dan aktivitas pengguna.

### **Environment Variables**

Konfigurasi aplikasi dikelola menggunakan environment variables, seperti:

* Database Connection String
* JWT Secret Key
* Service URL
* API Gateway Configuration
* Railway Deployment Variables

---

## **12.2 Deployment Workflow**

1. Developer melakukan push code ke GitHub Repository.
2. GitHub Actions menjalankan proses CI Pipeline.
3. Unit test dan validasi build dijalankan secara otomatis.
4. Deployment workflow dijalankan setelah proses build berhasil.
5. Railway melakukan build dan deploy service terbaru.
6. Health Check endpoint diverifikasi secara otomatis.
7. Service dinyatakan aktif apabila seluruh health check berhasil.
8. Frontend dan backend siap diakses oleh pengguna.

---

## **Production URLs**

| Service               | URL                                                      |
| --------------------- | -------------------------------------------------------- |
| Frontend              | https://cc-kelompok-a-ethereal-production.up.railway.app |
| Backend API Gateway   | https://kelarin.up.railway.app                           |
| Swagger Documentation | https://kelarin.up.railway.app/docs                      |

```
```

---

# UAS / Final Release Readiness Checklist

Pastikan seluruh komponen aplikasi telah diverifikasi sebelum presentasi UAS dan final release proyek.

* [x] **Production Deployment**: Frontend, API Gateway, dan seluruh service berhasil dideploy pada Railway.
* [x] **Frontend Accessibility**: Aplikasi dapat diakses melalui URL production tanpa error.
* [x] **Backend Accessibility**: API Gateway dan endpoint backend merespons dengan status yang sesuai.
* [x] **API Documentation**: Swagger/OpenAPI dapat diakses melalui endpoint `/docs`.
* [x] **Authentication & Authorization**: Login, register, JWT authentication, serta Role-Based Access Control (RBAC) berjalan dengan baik.
* [x] **Task Management Features**: Seluruh fitur Create, Read, Update, Delete (CRUD) task berhasil diuji.
* [x] **Admin Management Features**: Fitur pengelolaan user dan role oleh administrator berfungsi dengan baik.
* [x] **Service Health Monitoring**: Endpoint health check dapat digunakan untuk memantau status layanan.
* [x] **Containerization**: Seluruh service berjalan menggunakan Docker dan Docker Compose tanpa error.
* [x] **CI/CD Pipeline**: Workflow GitHub Actions berhasil menjalankan proses build, testing, dan deployment otomatis.
* [x] **Reliability Documentation**: Dokumentasi reliability testing telah tersedia pada folder `docs/`.
* [x] **Deployment Documentation**: Panduan deployment dan konfigurasi production telah diperbarui.
* [x] **Architecture Documentation**: Dokumentasi arsitektur microservices telah diperbarui sesuai implementasi terbaru.
* [x] **Security Review**: Environment variable, credential, dan secret tidak disimpan secara hardcoded di repository.
* [x] **Release Notes**: Release Notes Milestone 2 / Final Release telah dibuat dan diperbarui.
* [x] **README Documentation**: README telah diperbarui mencakup deployment, arsitektur, CI/CD, testing, dan panduan penggunaan.
* [x] **Git Repository Hygiene**: Seluruh Pull Request telah di-review dan branch feature telah digabungkan ke branch utama.
* [x] **Team Readiness**: Seluruh anggota memahami arsitektur, deployment, CI/CD, dan kontribusi masing-masing untuk sesi presentasi dan viva.

---

## Final Release Status

✅ Production Ready

✅ Documentation Complete

✅ CI/CD Active

✅ Deployment Successful

✅ UAS Presentation Ready

---

# **DevOps Workflow (Makefile)**

Untuk mempermudah proses development, testing, dan validasi sebelum deployment, tim menggunakan beberapa automation command melalui Makefile.

| Command | Deskripsi |
|----------|-----------|
| `make up` | Menjalankan seluruh service menggunakan Docker Compose. |
| `make down` | Menghentikan seluruh service dan membersihkan container yang berjalan. |
| `make restart` | Melakukan restart seluruh service. |
| `make logs` | Menampilkan log seluruh service secara real-time. |
| `make lint` | Menjalankan pengecekan kualitas kode (linting). |
| `make test` | Menjalankan unit test dan integration test yang tersedia. |
| `make health` | Memeriksa status health endpoint seluruh service. |
| `make pr-check` | Menjalankan validasi sebelum Pull Request (build, health check, dan testing). |
| `make clean` | Menghapus container, network, dan volume development. |

### Contoh Penggunaan

Menjalankan seluruh service:

```bash
make up
```

Menjalankan pengecekan kualitas kode:

```bash
make lint
```

Menjalankan validasi sebelum Pull Request:

```bash
make pr-check
```

Menghentikan seluruh service:

```bash
make down
```