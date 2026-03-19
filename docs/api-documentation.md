# Kelarin API Documentation
Dokumentasi ini berisi panduan teknis lengkap untuk menggunakan layanan API RESTful dari aplikasi Kelarin. Seluruh pertukaran data, baik *request* maupun *response*, menggunakan format **JSON**.

- **Versi API:** `v0.2.0`
- **Terakhir Diperbarui:** 18 Maret 2026

# 1. Create Item

**Deskripsi:** Menambahkan item baru ke dalam database inventory.

### 📌 Detail Endpoint
* **URL:** `/items`
* **Method:** `POST`
* **Auth Required?:** `No`

---

### 📥 Request

**Headers**
| Key | Value | Description |
| :--- | :--- | :--- |
| `Content-Type` | application/json | Format data payload |

**Request Body**
```json
{
  "name": "Nama Barang",
  "description": "Deskripsi barang",
  "price": 15000,
  "quantity": 10
}
```

---

### 📤 Response

**Success Response (201 Created)**
```json
{
  "id": 1,
  "name": "Nama Barang",
  "description": "Deskripsi barang",
  "price": 15000,
  "quantity": 10
}
```

---

### 💻 Contoh cURL Command

```bash
curl -X POST http://localhost:8000/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nama Barang",
    "description": "Deskripsi barang",
    "price": 15000,
    "quantity": 10
  }'
```

# 2. List Items (with Search & Pagination)

**Deskripsi:** Mengambil daftar seluruh item dengan fitur pencarian dan paginasi.

### 📌 Detail Endpoint
* **URL:** `/items`
* **Method:** `GET`
* **Auth Required?:** `No`

---

### 📥 Request

**Path / Query Parameters**
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `skip` | Integer | No | Jumlah data yang di-skip (Default: 0) |
| `limit` | Integer | No | Jumlah data per halaman (Default: 20, Max: 100) |
| `search` | String | No | Cari berdasarkan nama atau deskripsi |

---

### 📤 Response

**Success Response (200 OK)**
```json
{
  "total": 1,
  "items": [
    {
      "id": 1,
      "name": "Nama Barang",
      "description": "Deskripsi barang",
      "price": 15000,
      "quantity": 10
    }
  ]
}
```

---

### 💻 Contoh cURL Command

```bash
curl -X GET "http://localhost:8000/items?skip=0&limit=10&search=barang"
```

# 3. Item Statistics

**Deskripsi:** Mendapatkan ringkasan statistik inventory termasuk total nilai aset, item termahal, dan termurah.

### 📌 Detail Endpoint
* **URL:** `/items/stats`
* **Method:** `GET`
* **Auth Required?:** `No`

---

### 📤 Response

**Success Response (200 OK)**
```json
{
  "total_items": 5,
  "total_value": 750000,
  "most_expensive": {
    "name": "Laptop Pro",
    "price": 15000000
  },
  "cheapest": {
    "name": "Penghapus",
    "price": 2000
  }
}
```

---

### 💻 Contoh cURL Command

```bash
curl -X GET http://localhost:8000/items/stats
```

# 4. Update Item

**Deskripsi:** Memperbarui data item yang sudah ada berdasarkan ID.

### 📌 Detail Endpoint
* **URL:** `/items/{item_id}`
* **Method:** `PUT`
* **Auth Required?:** `No`

---

### 📥 Request

**Path / Query Parameters**
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `item_id` | Integer | Yes | ID unik item yang akan diupdate |

**Request Body**
```json
{
  "name": "Nama Baru",
  "price": 20000
}
```

---

### 📤 Response

**Success Response (200 OK)**
```json
{
  "id": 1,
  "name": "Nama Baru",
  "description": "Deskripsi lama",
  "price": 20000,
  "quantity": 10
}
```

**Error Response (404 Not Found)**
```json
{
  "detail": "Item dengan id=1 tidak ditemukan"
}
```

---

# 5. Team Information & Health Check

**Deskripsi:** Endpoint untuk mengecek status API dan informasi anggota tim pengembang.

### 📌 Detail Endpoint
* **URL:** `/team` atau `/health`
* **Method:** `GET`
* **Auth Required?:** `No`

---

### 📤 Response

**Success Response (Team - 200 OK)**
```json
{
  "team": "cloud-team-XX",
  "members": [
    {"name": "Amazia Devid", "nim": "10231013", "role": "Lead Frontend"},
    {"name": "Tiya Mitra Ayu", "nim": "10231088", "role": "Lead Backend"}
  ]
}
```

**Success Response (Health - 200 OK)**
```json
{
  "status": "healthy",
  "version": "0.2.0"
}
```

---

## 📜 Changelog
* **[v0.1.0] - 18 Maret 2026:** Inisialisasi Dokumentasi API, update endpoint CRUD, Penambahan Fitur Statistik, dan Informasi Tim.