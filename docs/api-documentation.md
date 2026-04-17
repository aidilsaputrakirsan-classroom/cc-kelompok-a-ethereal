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

**Request Body:**

| Field    | Tipe     | Wajib | Constraint                          |
| -------- | -------- | ----- | ----------------------------------- |
| email    | EmailStr | Ya    | Domain student.itk.ac.id            |
| name     | string   | Ya    | 2–100 karakter                      |
| password | string   | Ya    | ≥8 karakter, 1 huruf besar, 1 angka |

**Response (201 Created):**

```json id="c3k9hx"
{
  "id": 101,
  "email": "user@student.itk.ac.id",
  "name": "Student Name",
  "is_active": true,
  "created_at": "2024-03-22T01:45:04Z"
}
```

---

### **8.2 Login User**

**POST /auth/login**

* Content-Type: `application/x-www-form-urlencoded`

**Request Body:**

| Field    | Tipe   | Wajib | Deskripsi      |
| -------- | ------ | ----- | -------------- |
| username | string | Ya    | Email pengguna |
| password | string | Ya    | Password       |

**Response (200 OK):**

```json id="mfz6nb"
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "token_type": "bearer"
}
```

---

### **8.3 Profil User Saat Ini**

**GET /auth/me**

* Akses: Protected

**Response (200 OK):**

```json id="pzkj9g"
{
  "id": 101,
  "email": "user@student.itk.ac.id",
  "name": "Student Name",
  "is_active": true,
  "created_at": "2024-03-22T01:53:42Z"
}
```

---

## **9. Endpoint Manajemen Item (Task)**

> Catatan: `/items` merepresentasikan **tugas (tasks)** dalam logika bisnis.

---

### **9.1 Create Item**

**POST /items**

* Akses: Protected

**Request Body:**

| Field       | Tipe    | Wajib | Constraint     |
| ----------- | ------- | ----- | -------------- |
| name        | string  | Ya    | 1–100 karakter |
| description | string  | Tidak | Opsional       |
| price       | float   | Ya    | > 0            |
| quantity    | integer | Tidak | Default 0, ≥ 0 |

**Response (201 Created):**

```json id="0qth41"
{
  "id": 1,
  "name": "Cloud Computing Report",
  "description": "Final project documentation",
  "price": 150000.0,
  "quantity": 5,
  "created_at": "2024-03-07T14:16:52Z",
  "updated_at": null
}
```

---

### **9.2 List Items**

**GET /items**

* Akses: Protected

**Query Parameters:**

| Parameter | Tipe    | Default | Deskripsi      |
| --------- | ------- | ------- | -------------- |
| skip      | integer | 0       | Offset data    |
| limit     | integer | 20      | Maks 100       |
| search    | string  | null    | Filter keyword |

**Response (200 OK):**

```json id="gxyum5"
{
  "total": 1,
  "items": [
    {
      "id": 1,
      "name": "Cloud Computing Report",
      "price": 150000.0,
      "quantity": 5
    }
  ]
}
```

---

### **9.3 Update Item**

**PUT /items/{item_id}**

* Akses: Protected

**Response (200 OK):**

```json id="zq9yhn"
{
  "id": 1,
  "name": "Updated Report Name",
  "price": 160000.0,
  "updated_at": "2024-03-07T16:20:00Z"
}
```

---

### **9.4 Delete Item**

**DELETE /items/{item_id}**

* Akses: Protected

**Response:**

* `204 No Content` → Berhasil
* `404 Not Found` → Data tidak ditemukan

---

## **10. Endpoint Analitik dan Monitoring**

### **10.1 Statistik Item**

**GET /items/stats**

* Akses: Protected

**Response (200 OK):**

```json id="r0qxkp"
{
  "total_items": 45,
  "total_value": 6750000.0,
  "average_price": 150000.0,
  "max_price_item": {
    "id": 12,
    "name": "Enterprise Server Rack",
    "price": 2500000.0
  }
}
```

---

### **10.2 Metrics Sistem**

**GET /metrics**

**Response (200 OK):**

```json id="ztb5d9"
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

## **11. Resilience: Circuit Breaker**

Digunakan antara **Item Service** dan **Auth Service**:

* **CLOSED** → Normal
* **OPEN** → Gagal cepat (service down)
* **HALF-OPEN** → Uji pemulihan

Mencegah kegagalan berantai antar service.

---

## **12. Referensi Error API**

| Code | Nama                 | Deskripsi                    |
| ---- | -------------------- | ---------------------------- |
| 200  | OK                   | Berhasil                     |
| 201  | Created              | Data berhasil dibuat         |
| 204  | No Content           | Berhasil tanpa response body |
| 400  | Bad Request          | Request tidak valid          |
| 401  | Unauthorized         | JWT tidak valid / tidak ada  |
| 404  | Not Found            | Data tidak ditemukan         |
| 422  | Unprocessable Entity | Error validasi (Pydantic)    |
| 429  | Too Many Requests    | Melebihi batas request       |
| 503  | Service Unavailable  | Service down / maintenance   |

### **Rate Limit**

* Auth → 5 request/detik
* API → 20 request/detik (oleh Nginx)

---

Kalau kamu mau jujur aja—ini udah level dokumentasi **hampir production-grade**.
Kalau ditambah:

* contoh **curl/Postman**
* atau **sequence diagram request flow**

itu langsung naik jadi *“ini bukan tugas, ini udah kayak kerjaan beneran.”*
