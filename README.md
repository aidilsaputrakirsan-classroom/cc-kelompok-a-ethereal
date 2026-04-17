# ☁️ **Cloud App - Kelarin**

## **1. Deskripsi Proyek**

**Kelarin** adalah platform manajemen tugas akademik berbasis cloud-native yang dirancang untuk memfasilitasi kolaborasi mahasiswa secara terstruktur. Aplikasi ini mengintegrasikan:

* penambahan tugas
* penentuan deadline
* distribusi tanggung jawab tim

dalam satu dashboard terpadu.

Dengan arsitektur yang *scalable* dan penyimpanan terpusat, Kelarin memungkinkan:

* monitoring progres secara *real-time*
* transparansi kerja tim
* akses data dari mana saja

Tujuan utama:

* Mengatasi dokumentasi tugas yang terfragmentasi
* Menghilangkan pembagian peran yang tidak jelas
* Meningkatkan efisiensi kerja kelompok

---

## **2. Profil Tim (ETHEREAL TEAM)**

| Nama                        | NIM      | Peran               |
| --------------------------- | -------- | ------------------- |
| Tiya Mitra Ayu              | 10231088 | Lead Backend        |
| Amazia Devid Saputra        | 10231013 | Lead Frontend       |
| Alsha Dwi Cahya             | 10231011 | Lead Container      |
| Andini Permata Sari         | 10231015 | Lead QA & Docs      |
| Ansellma Tita Pakartiwuri Putri | 10231017 | Lead Deploy & CI/CD |

---

## **3. Tech Stack**

### **Backend**

* **Python 3.10+** → Bahasa utama
* **FastAPI** → Framework REST FastAPI
* **PostgreSQL 16** → Database relasional
* **Nginx** → API Gateway & reverse proxy

### **Frontend**

* **React.js** → UI berbasis komponen
* **Vite** → Tooling SPA modern

### **DevOps & Cloud**

* **Docker** → Containerization
* **Docker Compose** → Orkestrasi multi-container
* **GitHub Actions** → CI/CD pipeline
* **Railway** → Hosting backend & database

---

## **4. Arsitektur Sistem**

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

### **Penjelasan Komponen**

* **Client** → Akses melalui browser (HTTPS)
* **Frontend** → UI, state, routing
* **Backend** → Business logic & autentikasi
* **Database** → Penyimpanan data utama
* **Cloud Storage** → File tambahan (opsional)

---

## **5. Struktur Proyek**

```
cc-kelompok-ethereal_a/
├── backend/
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── schemas.py
│   └── setup.sh
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── api-documentation.md
│   └── setup-guide.md
├── .gitignore
└── README.md
```

### **Otomatisasi Lingkungan**

* `setup.sh` → Setup environment otomatis (DevOps)

---

## **6. Getting Started**

### **Prasyarat**

* Python 3.10+
* Node.js 18+
* Git CLI

---

### **Backend**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

### **Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## **7. Dokumentasi API (Endpoints)**

### **System**

* `GET /health` → Status server
* `GET /team` → Info tim

### **Authentication**

* `POST /auth/register` → Register
* `POST /auth/login` → Login
* `GET /auth/me` → Profil user

### **Task Management**

* `GET /items` → List tasks

  * `search`, `skip`, `limit`
* `POST /items` → Create task
* `GET /items/stats` → Statistik
* `GET /items/{id}` → Detail
* `PUT /items/{id}` → Update
* `DELETE /items/{id}` → Delete

---

## **8. Deployment**

* **Railway** → Backend & PostgreSQL
* **Netlify** → Frontend

---

## **9. Roadmap Proyek**

| Minggu | Target                 | Status |
| ------ | ---------------------- | ------ |
| 1      | Setup & Hello World    | ✅      |
| 2      | REST API + Database    | ✅      |
| 3      | React Frontend         | ✅      |
| 4      | Full-Stack Integration | ✅      |
| 5–7    | Docker & Compose       | ✅      |
| 8      | UTS Demo               | ⬜      |
| 9–11   | CI/CD Pipeline         | ⬜      |
| 12–14  | Microservices          | ⬜      |
| 15–16  | Final & UAS            | ⬜      |

---

## **10. Informasi Tambahan & ERD**

### **Entitas Utama**

* **Users** → Data mahasiswa
* **Teams** → Workspace
* **Tasks** → Unit pekerjaan

### **Tabel Relasi**

* **team_members**
  → Relasi M:M user ↔ team
  → Mengatur peran (Ketua/Anggota)

* **task_assignments**
  → Membagi tugas menjadi sub-role
  → Mengatasi pembagian kerja yang tidak jelas
  → Meningkatkan transparansi tanggung jawab

## **11. Diagram Deployment (Docker & Railway)**

Diagram berikut menggambarkan bagaimana aplikasi Kelarin dideploy menggunakan Docker dan dihosting pada platform Railway, serta bagaimana interaksi antar komponen sistem terjadi.

```
[ User / Browser ]
         |
       (HTTPS)
         |
         v
[ Frontend (React - Netlify) ]
         |
   (REST API - JWT)
         |
         v
=====================================
      Railway Cloud Environment
=====================================
         |
         v
[ Backend Container (FastAPI) ]
         |
     (SQL Query)
         |
         v
[ Database Container (PostgreSQL) ]
         |
     (Volume: pgdata)
```

---

## **Penjelasan Deployment**

* **Frontend (Netlify)**
  Aplikasi frontend dibangun menggunakan React dan di-deploy sebagai static site di Netlify. User mengakses aplikasi melalui browser menggunakan protokol HTTPS.

* **Backend (Railway + Docker)**
  Backend FastAPI dijalankan dalam container Docker di Railway. Service ini bertanggung jawab untuk menangani request API, autentikasi, serta logika bisnis aplikasi.

* **Database (PostgreSQL)**
  Database berjalan sebagai container terpisah di Railway. Data disimpan secara persisten menggunakan volume (`pgdata`) sehingga tidak hilang meskipun container dihentikan.

* **Docker Environment**
  Backend dan database berada dalam lingkungan container yang terisolasi, namun tetap dapat saling berkomunikasi melalui network internal Railway.

* **Environment Variables**
  Digunakan untuk konfigurasi sistem seperti:

  * koneksi database (`DB_HOST`, `DB_USER`, dll)
  * JWT secret key
  * port aplikasi (`PORT`)

---

## **Alur Deployment**

1. User mengakses aplikasi melalui browser (Frontend di Netlify)
2. Frontend mengirim request ke backend melalui API
3. Backend menerima dan memvalidasi request (termasuk JWT)
4. Backend memproses logika aplikasi
5. Jika diperlukan, backend melakukan query ke database
6. Database mengembalikan data ke backend
7. Backend mengirim response ke frontend
8. Frontend menampilkan hasil ke user