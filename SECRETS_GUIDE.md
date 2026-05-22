# Panduan Konfigurasi GitHub Secrets

Agar pipeline CI/CD berjalan dengan sempurna (terutama untuk build Docker dan testing backend), Anda perlu menambahkan beberapa "Secrets" ke repositori GitHub Anda.

## Cara Menambahkan Secret ke GitHub
1. Buka repositori Anda di GitHub.
2. Klik tab **Settings** (pojok kanan atas).
3. Di sidebar kiri, pilih **Secrets and variables** > **Actions**.
4. Klik tombol hijau **New repository secret**.

---

## Daftar Secret yang Dibutuhkan

### 1. Docker Hub (Untuk Deployment / CD)
Digunakan agar GitHub bisa mengirim (push) Docker Image yang sudah jadi ke akun Docker Hub Anda.

| Nama Secret | Fungsi | Cara Mendapatkan |
| :--- | :--- | :--- |
| `DOCKERHUB_USERNAME` | Username akun Docker Hub Anda. | Lihat di profil Docker Hub Anda. |
| `DOCKERHUB_TOKEN` | Token akses sebagai pengganti password. | Login ke [Docker Hub](https://hub.docker.com/) > Account Settings > Security > New Access Token. Pilih akses **Read & Write**. |

### 2. Backend Environment (Untuk Testing / CI)
Digunakan agar unit test di `backend` bisa berjalan dengan konfigurasi keamanan yang benar.

| Nama Secret | Fungsi | Cara Mendapatkan |
| :--- | :--- | :--- |
| `SECRET_KEY` | Kunci enkripsi untuk JWT Token. | Bisa string random apa saja (misal: `supersecret123`). Direkomendasikan minimal 32 karakter. |
| `ALGORITHM` | Algoritma enkripsi JWT. | Isi dengan: `HS256` |

---

## Mengapa Menggunakan Token, Bukan Password?
*   **Keamanan**: Jika token bocor, Anda bisa menghapusnya tanpa perlu mengganti password utama akun Anda.
*   **Audit**: Anda bisa melihat kapan terakhir kali token tersebut digunakan oleh GitHub Actions.
*   **Scope**: Anda bisa membatasi token tersebut hanya untuk akses tertentu (misal: hanya Read/Write, tanpa bisa menghapus repositori).

## Verifikasi
Setelah menambahkan secret di atas, setiap kali Anda melakukan `git push`, GitHub Actions akan secara otomatis mengambil nilai tersebut tanpa menampilkannya di log (akan disensor sebagai `***`).

---
*Catatan: Jika Anda tidak menambahkan `DOCKERHUB_TOKEN`, maka pipeline `CD` akan gagal pada tahap Login, namun pipeline `CI` (testing) tetap bisa berjalan.*
