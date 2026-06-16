# 👑 Fitur Admin & Panduan Pengembangan Workspace Frontend

Dokumen ini merinci apa saja yang **telah diubah pada Fitur Admin** (Backend & Frontend) serta memberikan **panduan desain/roadmap bagi tim Frontend** untuk pengembangan fitur ruang kerja (*Workspace*) dan kolaborasi kelompok di masa mendatang.

---

## 📌 Latar Belakang (Penyederhanaan Peran)
Sesuai dengan keputusan **Opsi 3**, peran tingkat sistem (*system-wide roles*) disederhanakan menjadi hanya dua peran saja:
1. **`admin` (Administrator):** Memiliki kontrol penuh atas manajemen akun pengguna (mengubah nama, password, dan mengganti peran tingkat sistem).
2. **`member` (Anggota Umum):** Pengguna standar yang dapat membuat ruang kerja pribadi (*Personal Workspace*) maupun kelompok (*Shared Workspace*). 

*Catatan: Peran kepemimpinan kelompok (seperti "Ketua/Leader") dikelola secara lokal di dalam tingkat kelompok/workspace masing-masing, bukan lagi dikelola di tingkat sistem global.*

---

## 🛠️ Bagian 1: Perubahan yang Telah Diimplementasikan (Fitur Admin)

Berikut adalah daftar perubahan penuh pada modul khusus Administrator yang telah selesai diimplementasikan:

### A. Sisi Backend (`services/auth-service`)
1. **Skema Validasi Baru (`schemas.py`):**
   * Menambahkan class `UserUpdateAdmin` untuk memvalidasi pembaruan profil yang dikirimkan oleh admin:
     ```python
     class UserUpdateAdmin(BaseModel):
         name: Optional[str] = None
         role: Optional[str] = None  # Hanya menerima 'admin' atau 'member'
         password: Optional[str] = None
     ```
2. **Endpoint Administrasi Baru (`main.py`):**
   * **`GET /users`**: Mengambil daftar seluruh pengguna terdaftar. Dilindungi oleh hak akses `admin` (jika token bukan milik admin, mengembalikan `403 Forbidden`).
   * **`PUT /users/{user_id}`**: Memperbarui nama, mengubah peran global, atau melakukan reset password pengguna secara langsung dengan enkripsi hash bcrypt. Dilindungi oleh hak akses `admin`.
   * **Validasi Role Global**: Membatasi input pergantian role hanya boleh diisi antara `"admin"` atau `"member"`.

### B. Sisi Frontend (`frontend/src`)
1. **Integrasi Client API (`services/api.js`):**
   * Menambahkan fungsi `getUsers(token)` untuk memanggil API daftar pengguna.
   * Menambahkan fungsi `updateUserByAdmin(userId, updateData, token)` untuk mengirim payload pembaruan data pengguna.
2. **Halaman Manajemen Admin (`pages/AdminPage.jsx`):**
   * Rute `/admin` didaftarkan secara aman. Menampilkan pesan **Akses Ditolak (403)** jika dimasuki oleh pengguna non-admin.
   * **Widget Statistik:** Menampilkan total pengguna, jumlah admin, dan jumlah member aktif.
   * **Fitur Pencarian:** Filter pencarian instan berbasis teks untuk mencocokkan Nama atau Email pengguna secara real-time.
   * **Panel Sunting Samping (Sidebar Edit Form):** Saat tombol "Edit" diklik pada tabel, panel form akan muncul di sisi kanan untuk mengubah Nama Lengkap, Peran, atau Kata Sandi. Form password sengaja dikosongkan secara default (hanya terupdate jika diisi).
3. **Menu Navigasi Dinamis (`components/Header.jsx`):**
   * Tautan navigasi **Admin Panel** didekorasi secara clean (tanpa ikon) dan hanya muncul di navbar apabila token aktif berhasil diverifikasi sebagai `admin`.

---

## 🚀 Bagian 2: Panduan Pengembangan Workspace & Kolaborasi (Untuk Frontend)

Berikut adalah cetak biru (*blueprint*) arsitektur workspace yang perlu ditambahkan di sisi Frontend untuk mendukung kolaborasi kelompok:

### A. Konsep Default: Personal Workspace (Ruang Kerja Pribadi)
Secara default, saat pengguna (role `member`) masuk ke dashboard untuk pertama kalinya, mereka harus diarahkan ke **Personal Workspace** mereka sendiri.
* **Karakteristik:**
  * Ruang kerja ini bersifat privat dan terisolasi penuh.
  * Tidak ada tombol undang (*invite*) dan tidak ada pengguna lain yang dapat mencari atau bergabung ke ruang kerja ini.
  * Digunakan untuk tugas mandiri/pribadi.
* **Rekomendasi UI:**
  * Di pojok kiri atas dashboard, sediakan dropdown pemilih ruang kerja (*Workspace Selector*). Pilihan pertama secara default bernilai `"Ruang Kerja Pribadi (Personal)"`.

### B. Konsep Shared Workspace (Ruang Kerja Kelompok)
Pengguna standar dapat membuat satu atau beberapa ruang kerja kelompok (*Shared Workspace*) untuk kolaborasi tim.
* **Alur Pembuatan:**
  * Sediakan tombol **"Buat Ruang Kerja Baru"** di dalam dropdown pemilih ruang kerja.
  * Menampilkan modal dengan input: `Nama Workspace` dan `Deskripsi`.
  * Saat disubmit, frontend mengirim request ke backend untuk menyimpan data kelompok baru.
* **Manajemen Peran di Tingkat Kelompok:**
  * Pengguna yang membuat *Shared Workspace* tersebut secara otomatis memegang hak akses **Ketua (Leader/Owner)** di dalam kelompok tersebut.
  * Anggota lain yang bergabung/diundang ke kelompok tersebut secara default memegang hak akses **Anggota (Member)** kelompok.
  * Hanya pemilik dengan peran **Ketua** kelompok yang berhak menghapus workspace, mengganti nama workspace, atau mengelola anggota.

### C. Alur Fitur Mengundang Anggota (Invite Member)
Di dalam sebuah *Shared Workspace*, Ketua kelompok dapat menambahkan orang lain ke tim mereka.
* **Alur Antarmuka Pengguna (UI Flow):**
  1. Pada dashboard *Shared Workspace*, tampilkan tab/tombol **"Kelola Anggota"** atau **"Undang Teman"**.
  2. Menampilkan kolom input teks bertuliskan **"Undang Anggota melalui Email"**.
  3. Ketua mengetikkan email pengguna tujuan (misal: `mahasiswa-b@itk.ac.id`) lalu mengklik tombol **"Kirim Undangan"**.
  4. Frontend mengirim POST request ke API (misal: `POST /workspaces/{workspace_id}/invite` dengan body `{ "email": "mahasiswa-b@itk.ac.id" }`).
  5. Jika email terdaftar di sistem, pengguna tujuan akan langsung masuk ke dalam daftar anggota workspace kelompok tersebut (atau dikirimi status pending).
* **Manajemen Tampilan Kolaborator:**
  * Tampilkan daftar anggota aktif di workspace tersebut beserta peran lokal mereka (contoh: *Ketua* untuk pemilik, *Anggota* untuk kolaborator).
  * Berikan tombol **"Keluarkan"** (*kick*) di samping nama anggota yang hanya boleh ditekan oleh pengguna dengan peran Ketua.
