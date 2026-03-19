# Setup Guide - Kelarin App


**Panduan lengkap dari nol sampai aplikasi bisa jalan**

## 🛠️ Prasyarat Sistem

Pastikan perangkat Anda telah terpasang dan berjalan dengan baik:

- Python 3.10+: Digunakan untuk menjalankan backend berbasis FastAPI.
- Node.js 18+ dan npm: Digunakan untuk menjalankan frontend berbasis React (Vite).
- PostgreSQL: Digunakan sebagai sistem manajemen basis data (pastikan service dalam kondisi running).
- Git: Digunakan untuk clone repository dan manajemen versi.
- Web Browser (Google Chrome / Microsoft Edge): Digunakan untuk mengakses aplikasi dan melakukan pengujian.

## 1️⃣ Clone Repository

```bash
git clone https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-ethereal.git
cd cc-kelompok-a-ethereal
```

---

## 2️⃣ Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

Buat file `.env`:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/kelarin
SECRET_KEY=isi-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:5173
```

Jalankan:

```bash
uvicorn main:app --reload --port 8000
```

---

## 3️⃣ Setup Database

```sql
CREATE DATABASE kelarin;
```
---

## 4️⃣ Setup Frontend

```bash
cd frontend
npm install
```

Buat `.env`:

```
VITE_API_URL=http://localhost:8000
```

Jalankan:

```bash
npm run dev
```

---

## 5️⃣ Akses Aplikasi

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend → [http://localhost:8000/docs](http://localhost:8000/docs)

---
