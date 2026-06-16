# ☁️ **Kelarin — Cloud-Native Task Management Platform**

[![CI Pipeline](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-ethereal/actions/workflows/ci.yml/badge.svg)](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-ethereal/actions/workflows/ci.yml)

**Kelarin** adalah platform manajemen tugas akademik berbasis *cloud-native* yang dirancang khusus untuk mempermudah kolaborasi terstruktur antar mahasiswa. Platform ini menyelesaikan tantangan dokumentasi tugas yang terfragmentasi dan pembagian peran tim yang tidak jelas melalui visualisasi dashboard terpadu secara *real-time*.

---

## 🌐 Live Demo & Dokumentasi

| Layanan | Tautan Akses |
| :--- | :--- |
| **Aplikasi Frontend** | [cc-kelompok-a-ethereal-production.up.railway.app](https://cc-kelompok-a-ethereal-production.up.railway.app/) |
| **Backend API Gateway** | [kelarin.up.railway.app](https://kelarin.up.railway.app/) |
| **API Docs (Swagger)** | [kelarin.up.railway.app/docs](https://kelarin.up.railway.app/docs) |

---

## 👥 Profil Tim (ETHEREAL TEAM)

| Nama | NIM | Peran Utama |
| :--- | :--- | :--- |
| **Tiya Mitra Ayu** | 10231088 | Lead Backend Developer |
| **Amazia Devid Saputra** | 10231013 | Lead Frontend Developer |
| **Alsha Dwi Cahya** | 10231011 | Lead Container & Infrastructure |
| **Andini Permata Sari** | 10231015 | Lead QA & Technical Writer |
| **Ansellma Tita Pakartiwuri Putri** | 10231017 | Lead DevOps & CI/CD Engineer |

---

## 🚀 Fitur Utama & Kegunaan
* **Manajemen Tugas Kolaboratif:** Pembagian tugas tim yang transparan dilengkapi tenggat waktu (deadline).
* **Role-Based Access Control (RBAC):** Otentikasi aman berbasis JWT dengan pembagian peran terstruktur (`admin` & `member`).
* **Halaman Status Laporan:** Grafik ringkasan progres dan performa penyelesaian tugas kelompok secara real-time.
* **Portal Manajemen Admin:** Panel khusus administrator untuk memanajemen pengguna (mengubah nama, kata sandi, dan hak akses peran).

---

## 🛠️ Tech Stack & Arsitektur

### **Teknologi yang Digunakan**
* **Frontend:** React.js, Vite, Vanilla CSS (Modern UI/UX).
* **Backend API:** FastAPI (Python 3.12), SQLAlchemy (ORM).
* **Database & Cache:** PostgreSQL 16 (Persisten Cloud Database).
* **DevOps & Container:** Docker, Docker Compose, GitHub Actions (CI/CD), Nginx (API Gateway).
* **Cloud Hosting:** Railway (Backend Services & DB), Netlify/Railway (Frontend Deployment).

### **Diagram Arsitektur Sistem**
```
[Client Browser]
       │ (HTTPS)
       ▼
[React Frontend (SPA)] <─── REST API (Stateless JWT) ───> [FastAPI Backend API]
                                                               │
                                                 ┌─────────────┴─────────────┐
                                           (SQL / ORM)                  (API / SDK)
                                                 │                           │
                                                 ▼                           ▼
                                          [PostgreSQL 16]             [Cloud Storage]
```

---

## 🔄 Alur & Konfigurasi CI/CD

Pipeline otomatisasi kami berjalan di **GitHub Actions** untuk menjamin stabilitas kode rilis:

### **1. CI Pipeline (`ci.yml`)**
Berjalan otomatis di setiap *push* ke branch `main`, `feature/**`, `bugfix/**`, serta *Pull Request* (PR) ke branch `main`.
* **Linting:** Validasi standar kode Python menggunakan **Ruff**.
* **Unit Testing:** Menjalankan pengujian unit vitest (frontend) dan pytest (backend) secara paralel menggunakan Matrix Strategy.
* **Integration Testing:** Memulai docker-compose lokal, memverifikasi kontainer sehat, lalu mengeksekusi integrasi lintas service. Laporan log kontainer diekspor sebagai berkas artifact zip `docker-services-log`.

### **2. Deploy Pipeline (`deploy.yml`)**
Berjalan otomatis pasca-merge ke branch `main` setelah proses build selesai.
* **Smart Polling Health Check:** Melakukan ping otomatis ke endpoint `/health` produksi setiap 10 detik (maksimal 5 menit) hingga mendeteksi respons `HTTP 200`.
* **Laporan Summary:** Hasil rilis dikirimkan langsung ke **GitHub Step Summary** (SHA Commit, URL Frontend & Backend, Timestamp).

---

## ⚙️ Petunjuk Memulai (Local Setup)

### **Prasyarat Sistem**
* Python 3.12+
* Node.js 20+
* Docker & Docker Compose

### **1. Menjalankan Backend API**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### **2. Menjalankan Frontend**
```bash
cd frontend
npm install
npm run dev
```
*Aplikasi dapat diakses secara lokal di `http://localhost:5173`.*

---

## 🐳 Kontainerisasi dengan Docker Compose

Orkestrasi multi-container memungkinkan aplikasi berjalan secara konsisten di lingkungan mana pun.

### **Cara Menjalankan dengan Docker:**
1. Pastikan Docker Daemon aktif.
2. Jalankan perintah build dan up:
   ```bash
   docker compose up --build -d
   ```
3. Akses lokal:
   * **Frontend:** `http://localhost:5173`
   * **Backend API Gateway:** `http://localhost:8000`

### **Perintah Penting Docker Compose:**
| Perintah | Deskripsi |
| :--- | :--- |
| `docker compose up -d` | Menjalankan semua container di background. |
| `docker compose down -v` | Menghentikan container dan menghapus data volume. |
| `docker compose ps` | Memeriksa status kesehatan kontainer. |
| `docker compose logs -f` | Memantau log aplikasi secara real-time. |

---

## 🏷️ Panduan Release Tagging (v3.0.0)
Setelah Pull Request final digabungkan ke branch `main`, lakukan tagging rilis formal menggunakan Git CLI:

```bash
# Sinkronisasi branch main lokal
git checkout main
git pull origin main

# Membuat annotated tag rilis v3.0.0
git tag -a v3.0.0 -m "Release v3.0.0 - Final UAS Submission"

# Push tag ke GitHub
git push origin v3.0.0
```

---

## 🎬 Alur Demo UAS (3-Minute Backup Flow)
Gunakan checklist alur berikut untuk demonstrasi kelayakan aplikasi saat presentasi UAS:

* [ ] **Langkah 1: Launch App** — Akses [Halaman Kelarin](https://cc-kelompok-a-ethereal-production.up.railway.app/).
* [ ] **Langkah 2: Register** — Daftarkan akun baru (e.g. `uas-demo@itk.ac.id`, password: `Password123`).
* [ ] **Langkah 3: Login** — Autentikasi menggunakan akun demo tersebut.
* [ ] **Langkah 4: CRUD Task** — Buat tugas baru, lihat daftar tugas, tandai selesai, dan hapus satu tugas.
* [ ] **Langkah 5: Status Dashboard** — Navigasi ke halaman Status untuk memantau visualisasi statistik.
* [ ] **Langkah 6: CI/CD Status** — Tunjukkan badge status **passing** berwarna hijau di repositori GitHub.

---

## 📁 Struktur Repositori
```
cc-kelompok-ethereal_a/
├── backend/                  # Layanan API Utama (FastAPI)
├── frontend/                 # Layanan Antarmuka React (Vite SPA)
├── services/
│   ├── auth-service/         # Microservice Autentikasi Pengguna
│   └── task-service/         # Microservice Manajemen Tugas
├── docs/                     # Dokumentasi Teknis & Panduan
│   └── CI_CD_GUIDE.md        # Panduan Lengkap Pipeline CI/CD
├── scripts/                  # Skrip Otomatisasi & Setup
├── Makefile                  # DevOps Workflow Automation
└── README.md                 # Dokumentasi Utama Proyek
```
