# UTS Demo Script - Aplikasi Kelarin

## Panduan Teknis Demonstrasi Aplikasi
Dokumen ini disusun sebagai panduan standar operasional untuk memastikan demonstrasi aplikasi "Kelarin" berjalan lancar dan profesional. Panduan ini mencakup langkah sistematis mulai dari inisialisasi kontainer, verifikasi layanan, hingga validasi fitur utama. Prosedur ini dirancang untuk meminimalkan risiko teknis dan menunjukkan performa serta stabilitas aplikasi secara lugas di hadapan dosen penguji.

## 1. Inisialisasi & Persiapan
*Pastikan Docker sudah dalam keadaan aktif sebelum memulai.*

1. **Clear Environment (Optional):** Hapus data lama agar demo dimulai dari kondisi bersih.
   ```bash
   docker compose down -v
   ```

2. **Build & Start: Menjalankan seluruh stack aplikasi.**
    ```bash
    docker compose up -d --build
    ```

3. **Verify Containers: Pastikan status semua layanan adalah Up.**
    ```bash
    docker compose ps
    ```

## 2. Validasi Akses Layanan
Buka browser dan arahkan ke alamat berikut untuk memastikan semuanya ready:

- Frontend Dashboard: http://localhost:5173
- API Documentation: http://localhost:8000/docs

## 3. Demonstrasi Fitur (Sequence)
Lakukan urutan ini agar alur presentasi terlihat logis:
1. **Autentikasi**: Lakukan Register akun baru, lalu Login.

2. **Task Management**:
    - **Create**: Tambahkan 1 tugas baru.
    - **Read**: Tunjukkan list tugas yang sudah ditambahkan sebelumnya.
    - **Update**: Ubah deskripsi tugas (misal: Membuat Laporan ke Membuat Video).
    - Delete: Hapus salah satu tugas untuk menunjukkan fungsi delete.


## 4. Pembuktian Data Persistence
Tunjukkan ini untuk membuktikan database berjalan dengan benar:

1. Pastikan data sudah terisi di web.

2. Matikan aplikasi:
    ```bash
    docker compose down
    ```

3. Jalankan kembali aplikasi:
    ```bash
    docker compose up -d
    ```

4. Refresh Browser: Tunjukkan bahwa data tugas masih tersimpan (tidak hilang).


## 5. Finalisasi (Clean Up)
Matikan aplikasi setelah sesi demo berakhir agar port kembali bebas:
 ```bash
    docker compose down
 ```