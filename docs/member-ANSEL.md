# 📝 Laporan Refleksi Individu (Reflection Paper)

* **Nama**: Ansellma Tita Pakartiwuri Putri
* **NIM**: 10231017
* **Peran**: Lead CI/CD & Deploy (Team Ethereal)
* **Proyek**: Kelarin — Platform Kolaborasi Manajemen Tugas Akademik

---

## 📌 1. Pendahuluan & Tanggung Jawab Peran

Sebagai **Lead CI/CD & Deploy**, tanggung jawab utama saya adalah merancang, membangun, dan memelihara pipa otomatisasi yang menjamin kualitas kode sejak dari komputer lokal pengembang hingga berjalan dengan sukses di lingkungan produksi (*production environment*). Pipa ini memayungi integrasi berkelanjutan (**Continuous Integration / CI**), pengiriman berkelanjutan (**Continuous Delivery / CD**), hingga pemantauan pasca-deployment (**Deployment Verification & Health Checking**).

Secara khusus, fokus saya adalah memastikan bahwa transisi kode microservices tim (yang terdiri dari `auth-service`, `task-service`, dan `gateway-service`) dari repositori GitHub ke platform Railway berjalan tanpa hambatan (*zero-downtime deployment*) serta memiliki toleransi kesalahan (*fault-tolerance*) yang tinggi.

---

## 🛠️ 2. Keputusan Teknis & Arsitektur Pipeline

Dalam membangun sistem CI/CD untuk aplikasi Kelarin, saya mengambil beberapa keputusan teknis utama yang didasari oleh analisis kebutuhan proyek dan efisiensi infrastruktur:

### A. Orkestrator Pipeline: GitHub Actions
* **Keputusan**: Menggunakan GitHub Actions sebagai mesin orkestrasi otomatisasi.
* **Rasional**: Keuntungan integrasi *native* dengan siklus hidup Git (Pull Request & Push) mempercepat umpan balik (*feedback loop*). Fitur caching dependensi (`actions/setup-python` & `setup-node` caching) memangkas waktu build hingga **40%**, menghemat penggunaan kuota build bulanan GitHub Actions runner.

### B. Strategi Pengujian Paralel (Matrix Strategy)
* **Keputusan**: Mengimplementasikan `matrix strategy` pada tahap *Unit Testing* (`test-services`).
* **Rasional**: Menjalankan tes `Vitest` untuk frontend dan `pytest` untuk masing-masing microservice secara paralel pada mesin runner yang terisolasi. Pendekatan ini memotong durasi tunggu keseluruhan pipeline secara signifikan daripada mengeksekusinya secara sekuensial. Jika salah satu layanan gagal, pipeline akan segera menghentikan proses rilis (*fail-fast*), mencegah kode rusak masuk ke tahap build Docker.

### C. Simulasi Lingkungan Riil (Ephemeral Integration Testing)
* **Keputusan**: Membangun lingkungan mikro lokal sementara di dalam GitHub Actions runner menggunakan **Docker Compose V2** sebelum deployment resmi dilakukan.
* **Rasional**: Pengujian unit saja tidak cukup untuk arsitektur microservices. Dengan menyalakan kontainer database (`auth-db`, `task-db`), microservices, dan API Gateway di dalam runner, kami dapat menguji integrasi lintas layanan (misal: memverifikasi bahwa `task-service` dapat memvalidasi token JWT ke `auth-service` melalui API Gateway).

---

## ⚠️ 3. Kesulitan Teknis & Troubleshooting (Masalah Nyata & Solusi)

Selama siklus pengembangan Modul 15 dan persiapan UAS, saya menghadapi tiga tantangan teknis utama yang menuntut investigasi mendalam:

### A. Isu Depresiasi Perintah `docker-compose` (Command Not Found)
* **Masalah**: Pipeline integrasi kami tiba-tiba gagal di runner dengan galat `/home/runner/work/_temp/...sh: line 1: docker-compose: command not found`.
* **Analisis**: Runner GitHub Actions modern (`ubuntu-latest`) telah membuang dukungan untuk Docker Compose V1 (`docker-compose` versi binary terpisah) dan menggantinya dengan Docker Compose V2 yang terintegrasi di dalam Docker CLI (`docker compose` sebagai plugin).
* **Solusi**: Saya memigrasi seluruh pemanggilan skrip dan workflow CI/CD dari format lama `docker-compose <command>` ke format baru `docker compose <command>` tanpa tanda hubung. Perbaikan ini memastikan kompatibilitas penuh dengan runner modern di GitHub.

### B. Kegagalan Database Lock di Windows vs Runner (SQLite Read-Only Database)
* **Masalah**: Pengujian unit lokal FastAPI backend sering tertahan (*hang*) atau memicu galat `sqlalchemy.exc.OperationalError: attempt to write a readonly database` saat dijalankan di sistem operasi Windows tim pengembang.
* **Analisis**: Konfigurasi pengujian awal menggunakan file database SQLite fisik sementara (`./test.db`). Di OS Windows, file database ini sering terkunci (*locked*) oleh proses Python yang tidak menutup koneksi database secara sempurna di akhir fungsi pengujian, menyebabkan uji coba berikutnya gagal menulis data.
* **Solusi**: Saya mengubah parameter database testing pada modul `conftest.py` microservices untuk menggunakan SQLite *in-memory* (`sqlite:///:memory:`) yang dikombinasikan dengan `StaticPool` SQLAlchemy. Dengan cara ini, database dibuat secara eksklusif di RAM selama tes berjalan dan langsung hancur setelah tes selesai, menghilangkan dependensi penulisan file fisik dan mengeliminasi masalah *file locking*.

### C. Masalah "Cold Start" Kontainer di Platform Cloud (Railway)
* **Masalah**: Pipeline deployment mendeteksi kegagalan *health check* sesaat setelah deployment selesai, padahal kode lokal berjalan dengan baik.
* **Analisis**: Kontainer microservices di Railway membutuhkan waktu startup internal (*cold start*) antara 15 hingga 30 detik untuk menginisialisasi koneksi database PostgreSQL. Health check sederhana yang menembak URL endpoint secara instan setelah rilis memicu *false alarm* karena kontainer belum sepenuhnya siap.
* **Solusi**: Saya merancang algoritma **Smart Polling** di dalam pipeline deployment (`deploy.yml`). Sistem akan mencoba melakukan ping ke endpoint `/health` secara berkala (setiap 10 detik) hingga batas waktu maksimal 5 menit (30 kali percobaan). Begitu terdeteksi status `HTTP 200`, pipeline dinyatakan berhasil dan segera selesai. Ini mencegah kegagalan pipeline akibat waktu tunggu cold start.

---

## 💡 4. Pelajaran Berharga & Refleksi Diri

Proses merancang infrastruktur otomatisasi untuk proyek Kelarin memberikan saya beberapa pelajaran berharga di bidang DevOps dan Cloud-Native Engineering:

1. **Otomatisasi Adalah Jembatan Ketahanan (Resilience)**:
   Membangun pipeline bukan sekadar menulis file YAML agar tugas build selesai, melainkan merancang sistem penanganan galat (*error handling*) yang kokoh. Keputusan menambahkan **Docker Compose Logs Export** sebagai artifact zip terbukti mempermudah tim dalam melacak penyebab matinya kontainer tanpa perlu melakukan *reverse-engineering* manual.
2. **Pentingnya Isolasi Lingkungan**:
   Penggunaan database in-memory untuk testing dan isolasi kontainer Docker menyadarkan saya bahwa lingkungan pengembangan (*development*), pengujian (*staging/testing*), dan produksi (*production*) harus terstandarisasi. Jika tim tidak mengadopsi Docker, disparitas sistem operasi antar pengembang akan menghambat rilis fitur.
3. **Keamanan Kredensial adalah Prioritas Utama**:
   Mengelola siklus hidup kredensial sensitif (seperti `RAILWAY_TOKEN` dan database connection strings) melalui GitHub Secrets dan Railway Environment Variables mengajarkan saya pentingnya keamanan informasi sejak awal proyek (*security by design*), bukan sebagai tambahan di akhir.

Secara keseluruhan, peran ini melatih kemampuan analitis saya dalam mendiagnosis masalah integrasi sistem yang kompleks dan memperluas wawasan saya tentang pentingnya siklus rilis perangkat lunak yang cepat, aman, dan dapat diandalkan.
