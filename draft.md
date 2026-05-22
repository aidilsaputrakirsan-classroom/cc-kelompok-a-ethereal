## 📝 Summary
Implementasi pipeline CI/CD multi-service menggunakan GitHub Actions dan reorganisasi struktur repositori untuk meningkatkan efisiensi build serta kebersihan proyek.

## 🔗 Related Task
- **Task Link:** N/A (Internal DevOps Improvement)
- **Target Branch:** `main`

## 🛠 Type of Change
- [x] ✨ **Feature**: Menambah fungsionalitas CI/CD baru.
- [x] ♻️ **Refactor**: Reorganisasi script ke folder `scripts/`.
- [x] 🔧 **Chore**: Update GitHub Actions config dan pembersihan file binary (PDF).

## 🔍 Scope of Work
- **CI/CD Pipeline**:
    - Membuat `ci.yml` untuk validasi otomatis pada PR (Parallel Matrix Build untuk Backend & Frontend).
    - Membuat `cd.yml` untuk deployment otomatis (Docker Buildx + GHA Caching).
- **Struktur Repositori**:
    - Memindahkan `dev.sh`, `docker.sh`, dan `setup.sh` ke folder `scripts/`.
- **Cleanup**:
    - Menghapus seluruh file PDF dari repositori (best practice untuk optimasi ukuran repo).
- **Dokumentasi**:
    - Memperbarui `CHANGELOG.md` dengan rilis versi 0.17.0.

## 🧪 Testing & Quality Assurance
- [x] **Unit Tests**: Pipeline CI telah dikonfigurasi untuk menjalankan `pytest` (backend) dan `vitest` (frontend).
- [x] **Local Integration**: Struktur folder baru telah diverifikasi di lingkungan lokal.

## 🚀 Deployment Impact
- [ ] **Migrations**: Tidak ada.
- [ ] **Env Vars**: Tidak ada (menggunakan variabel testing standar di CI).
- [ ] **Dependencies**: Tidak ada penambahan package, hanya update config.

## 📸 Proof of Work
### Docker Build Strategy in `cd.yml`:
```yaml
      - name: Build and Load Image
        uses: docker/build-push-action@v5
        with:
          cache-from: type=gha
          cache-to: type=gha,mode=max
```
*GHA Caching diaktifkan untuk mempercepat build layer Docker hingga 3x lipat.*

---

## 🏁 Checklist Before Merge
- [x] Kode sudah mengikuti standar **Conventional Commits**.
- [x] Tidak ada **Hardcoded Secrets**.
- [x] Dokumentasi internal/README sudah diperbarui (CHANGELOG.md).
