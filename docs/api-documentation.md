# **Spesifikasi API dan Panduan Referensi Kelarin**

## **1. Gambaran Proyek dan Arsitektur**

**Kelarin** adalah sistem manajemen tugas berbasis cloud yang dirancang untuk membantu mahasiswa dalam mengelola dan mengoordinasikan tugas akademik. Sistem ini menyediakan:

* pelacakan tugas
* manajemen deadline
* kolaborasi tim

dalam lingkungan yang terpusat dan scalable.

---

## **2. Tech Stack**

| Komponen         | Teknologi        | Kebutuhan Versi | Deskripsi                       |
| ---------------- | ---------------- | --------------- | ------------------------------- |
| Backend          | FastAPI (Python) | 3.10+           | REST API berperforma tinggi     |
| Frontend         | React (Vite)     | Node.js 18+     | Single Page Application (SPA)   |
| Database         | PostgreSQL       | 16-alpine       | Penyimpanan relasional terpisah |
| Containerization | Docker           | Latest          | Container dan orkestrasi        |
| API Gateway      | Nginx            | Stable          | Reverse proxy & SSL termination |

---

## **3. Arsitektur Sistem**

Kelarin menggunakan **arsitektur microservices**, terdiri dari:

* **Auth Service** → Mengelola autentikasi, registrasi, dan JWT
* **Item Service** → Mengelola logika tugas dan operasi CRUD

Setiap service memiliki **database PostgreSQL terpisah** untuk menjaga isolasi data.

**Nginx** berperan sebagai API Gateway:

* titik masuk utama
* SSL termination
* routing request
* rate limiting

---

## **4. Autentikasi dan Otorisasi**

API menggunakan model keamanan **stateless berbasis JWT (Bearer Token)**.

### **Implementasi Keamanan**

* Mekanisme: JSON Web Token (JWT)
* Header:

  ```
  Authorization: Bearer <access_token>
  ```
* Password disimpan dengan hashing **bcrypt**
* Token memiliki masa berlaku tertentu

### **Syarat Password**

* Minimal 8 karakter
* Minimal 1 huruf besar
* Minimal 1 angka

---

## **5. Detail Koneksi**

| Environment | Base URL                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------ |
| Development | [http://localhost:8000](http://localhost:8000)                                             |
| Production  | [https://kelarin-production.up.railway.app/](https://kelarin-production.up.railway.app/) |

---

## **6. Monitoring: Four Golden Signals**

* **Latency** → Target: p95 < 500ms
* **Traffic** → Jumlah request per detik
* **Errors** → Rasio error (4xx / 5xx)
* **Saturation** → Penggunaan CPU, memory, database

---

## **7. Endpoint Sistem**

### **7.1 Health Check**

**GET /health**
Memeriksa status sistem.

* Akses: Publik

**Response (200 OK):**

```json id="m5bd6n"
{
  "status": "healthy",
  "app": "Kelarin"
}
```

---

### **7.2 Informasi Tim**

**GET /team**
Menampilkan informasi tim pengembang.

* Akses: Publik

| Nama                        | NIM      | Peran               |
| --------------------------- | -------- | ------------------- |
| Tiya Mitra Ayu              | 10231088 | Lead Backend        |
| Amazia Devid Saputra        | 10231013 | Lead Frontend       |
| Alsha Dwi Cahya             | 10231011 | Lead DevOps         |
| Andini Permata Sari         | 10231015 | Lead QA & Docs      |
| Ansellma Tita Pakartiwuri P | 10231017 | Lead CI/CD & Deploy |

---

## **8. Endpoint Autentikasi**

### **8.1 Registrasi User**

**POST /auth/register**

**Request Body (application/json):**

| Field    | Tipe     | Wajib | Constraint                          |
| -------- | -------- | ----- | ----------------------------------- |
| email    | EmailStr | Ya    | Domain email valid (e.g. itk.ac.id) |
| name     | string   | Ya    | Nama lengkap pengguna               |
| password | string   | Ya    | ≥8 karakter                         |
| role     | string   | Tidak | Default: "member"                   |

**Response (201 Created):**

```json
{
  "id": 1,
  "email": "user@student.itk.ac.id",
  "name": "Student Name",
  "role": "member"
}
```

---

### **8.2 Login User**

**POST /auth/login**

**Request Body (application/json):**

| Field    | Tipe   | Wajib | Deskripsi      |
| -------- | ------ | ----- | -------------- |
| email    | string | Ya    | Email pengguna |
| password | string | Ya    | Password       |

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "token_type": "bearer"
}
```

---

### **8.3 Verifikasi Token**

**GET /auth/verify**

* Akses: Protected (Memerlukan token)
* Header: `Authorization: Bearer <access_token>`

**Response (200 OK):**

```json
{
  "user_id": 1,
  "email": "user@student.itk.ac.id",
  "name": "Student Name",
  "role": "member"
}
```

---

## **9. Endpoint Manajemen Tugas (Tasks)**

---

### **9.1 Create Task**

**POST /tasks**

* Akses: Protected (Memerlukan token)
* Header: `Authorization: Bearer <access_token>`

**Request Body (application/json):**

| Field          | Tipe    | Wajib | Constraint          |
| -------------- | ------- | ----- | ------------------- |
| title          | string  | Ya    | Judul tugas         |
| description    | string  | Tidak | Deskripsi tugas     |
| category       | string  | Tidak | Kategori tugas      |
| attachment_url | string  | Tidak | URL lampiran file   |
| deadline       | string  | Tidak | Tanggal & waktu ISO |

**Response (201 Created):**

```json
{
  "id": 1,
  "title": "Laporan Akhir Cloud Computing",
  "description": "Dokumentasi deployment microservices",
  "category": "Tugas Besar",
  "status": "pending",
  "attachment_url": "https://storage.googleapis.com/kelarin/docs.pdf",
  "completed": false,
  "owner_id": 1,
  "assigned_to": null,
  "deadline": "2026-06-20T23:59:59Z",
  "created_at": "2026-06-17T02:00:00Z",
  "updated_at": null
}
```

---

### **9.2 List Tasks**

**GET /tasks**

* Akses: Protected (Memerlukan token)
* Header: `Authorization: Bearer <access_token>`
* Mengembalikan seluruh tugas aktif (belum selesai) milik user atau yang ditugaskan ke user.

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "title": "Laporan Akhir Cloud Computing",
    "description": "Dokumentasi deployment microservices",
    "category": "Tugas Besar",
    "status": "pending",
    "attachment_url": "https://storage.googleapis.com/kelarin/docs.pdf",
    "completed": false,
    "owner_id": 1,
    "assigned_to": null,
    "deadline": "2026-06-20T23:59:59Z",
    "created_at": "2026-06-17T02:00:00Z",
    "updated_at": null
  }
]
```

---

### **9.3 Update Task**

**PUT /tasks/{task_id}**

* Akses: Protected (Memerlukan token)
* Header: `Authorization: Bearer <access_token>`

**Request Body (application/json - semua field opsional):**

| Field          | Tipe    | Wajib | Deskripsi            |
| -------------- | ------- | ----- | -------------------- |
| title          | string  | Tidak | Judul tugas baru     |
| description    | string  | Tidak | Deskripsi tugas baru |
| category       | string  | Tidak | Kategori baru        |
| status         | string  | Tidak | Status tugas baru    |
| attachment_url | string  | Tidak | URL lampiran baru    |
| completed      | boolean | Tidak | Menandai tugas done  |
| deadline       | string  | Tidak | Deadline baru        |

**Response (200 OK):**

```json
{
  "id": 1,
  "title": "Laporan Akhir Cloud Computing - Revisi 1",
  "description": "Dokumentasi deployment microservices",
  "category": "Tugas Besar",
  "status": "in-progress",
  "attachment_url": "https://storage.googleapis.com/kelarin/docs.pdf",
  "completed": false,
  "owner_id": 1,
  "assigned_to": null,
  "deadline": "2026-06-22T23:59:59Z",
  "created_at": "2026-06-17T02:00:00Z",
  "updated_at": "2026-06-17T03:30:00Z"
}
```

---

### **9.4 Delete Task**

**DELETE /tasks/{task_id}**

* Akses: Protected (Memerlukan token)
* Header: `Authorization: Bearer <access_token>`

**Response (200 OK):**

```json
{
  "message": "Task deleted"
}
```

---

## **10. Endpoint Analitik dan Administrasi**

### **10.1 Statistik Tugas**

**GET /tasks/stats**

* Akses: Protected (Memerlukan token)
* Header: `Authorization: Bearer <access_token>`

**Response (200 OK):**

```json
{
  "total_tasks": 10,
  "completed_tasks": 6,
  "pending_tasks": 4
}
```

---

### **10.2 Kelola Pengguna (Admin Only)**

**GET /auth/users**

* Akses: Admin Only
* Header: `Authorization: Bearer <admin_token>`
* Mengambil daftar seluruh pengguna terdaftar dalam sistem.

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "email": "admin@itk.ac.id",
    "name": "Administrator",
    "role": "admin"
  },
  {
    "id": 2,
    "email": "user@student.itk.ac.id",
    "name": "Student Name",
    "role": "member"
  }
]
```

---

### **10.3 Edit Data Pengguna (Admin Only)**

**PUT /auth/users/{user_id}**

* Akses: Admin Only
* Header: `Authorization: Bearer <admin_token>`
* Melakukan update nama, peran, atau reset kata sandi pengguna secara global.

**Request Body (application/json - semua field opsional):**

| Field    | Tipe   | Wajib | Deskripsi                     |
| -------- | ------ | ----- | ----------------------------- |
| name     | string | Tidak | Nama baru                     |
| role     | string | Tidak | Peran baru ('admin'/'member') |
| password | string | Tidak | Reset kata sandi baru         |

**Response (200 OK):**

```json
{
  "id": 2,
  "email": "user@student.itk.ac.id",
  "name": "Updated Student Name",
  "role": "admin"
}
```

---

### **10.4 Upgrade Peran Pengguna (Admin Only)**

**PATCH /auth/users/{user_id}/upgrade-role**

* Akses: Admin Only
* Header: `Authorization: Bearer <admin_token>`
* Mengubah peran pengguna secara spesifik.

**Request Body (application/json):**

```json
{
  "new_role": "admin"
}
```

**Response (200 OK):**

```json
{
  "message": "User role successfully updated to admin",
  "user_id": 2,
  "role": "admin"
}
```

---

### **10.5 Metrics Sistem**

**GET /metrics**

**Response (200 OK):**

```json
{
  "request_count": 1250,
  "error_rate": 0.02,
  "latency": {
    "p50": "45ms",
    "p95": "120ms",
    "p99": "350ms"
  }
}
```

---

## **11. Referensi Error API**

| Code | Nama                 | Deskripsi                    |
| ---- | -------------------- | ---------------------------- |
| 200  | OK                   | Berhasil                     |
| 201  | Created              | Data berhasil dibuat         |
| 204  | No Content           | Berhasil tanpa response body |
| 400  | Bad Request          | Request tidak valid          |
| 401  | Unauthorized         | JWT tidak valid / tidak ada  |
| 403  | Forbidden            | Hak akses tidak mencukupi    |
| 404  | Not Found            | Data tidak ditemukan         |
| 422  | Unprocessable Entity | Error validasi (Pydantic)    |
| 503  | Service Unavailable  | Service down / maintenance   |

