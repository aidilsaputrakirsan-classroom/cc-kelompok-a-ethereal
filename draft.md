# Draft Release / Pull Request Notes
## Branch: `feature/user-management-and-runner`

Dokumen ini berisi rangkuman perubahan dan fitur baru yang telah ditambahkan pada branch ini.

---

### 1. Fitur Manajemen Pengguna (User Management)
*   **Fitur Hapus (Delete) Pengguna**:
    *   **Backend (`auth-service`)**: Menambahkan endpoint `DELETE /users/{user_id}` di `services/auth-service/main.py`. Dilengkapi proteksi keamanan agar Administrator tidak bisa menghapus akunnya sendiri secara tidak sengaja.
    *   **API Client Frontend**: Menambahkan fungsi API `deleteUserByAdmin` ke `frontend/src/services/api.js`.
    *   **Antarmuka Admin**: Menambahkan tombol **Hapus** (dengan ikon 🗑️) pada baris tabel pengguna di halaman admin. Disertai dengan dialog konfirmasi sebelum data dihapus secara permanen.
*   **Tombol Kembali yang Aesthetic**:
    *   Menambahkan tombol "← Kembali ke Beranda" di bagian atas halaman admin untuk mempermudah navigasi kembali ke dashboard secara interaktif dan responsif.
*   **Perbaikan CSS Dropdown Peran (Role)**:
    *   Memperbaiki tampilan `<select>` untuk pemilihan peran (admin/member) di panel penyuntingan halaman admin. Menggunakan style modern (border tipis, warna semi-transparan yang ramah dark mode, rounded corners `rounded-xl`, shadow halus, dan transisi fokus yang bersih).

---

### 2. Otomatisasi & Pembersihan Runner Lokal (Local Development)
*   **Penyusunan Script Runner**:
    *   Memindahkan file runner lokal ke direktori `scripts/run_local.ps1`.
    *   Menghapus file runner lama `run_local.ps1` di root dan `scripts/dev-local.ps1` yang usang.
*   **Perbaikan Bug Gateway & Uvicorn**:
    *   Memperbaiki bug escaping variabel environment (tanda `$`) pada Windows PowerShell dengan menggunakan backtick (`` ` ``).
    *   Mengalihkan eksekusi server dari perintah `uvicorn` global ke `python -m uvicorn` untuk mencegah masalah ketidaktersediaan command di `PATH` global Windows.
    *   Menambahkan proses pembersihan otomatis (*auto-cleanup*) untuk mematikan instance python/uvicorn yang menggantung (*zombie processes*) sebelum runner baru dinyalakan.

---

### 3. Cara Menjalankan Aplikasi Secara Lokal (Tanpa Docker)
Buka terminal PowerShell pada direktori root proyek Anda, kemudian jalankan:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run_local.ps1
```

Layanan yang akan aktif:
*   💻 **Frontend**: [http://localhost:5173](http://localhost:5173)
*   📡 **API Gateway**: [http://localhost:8000](http://localhost:8000)
*   🔑 **Auth Service**: `http://localhost:8001`
*   📋 **Task Service**: `http://localhost:8002`
