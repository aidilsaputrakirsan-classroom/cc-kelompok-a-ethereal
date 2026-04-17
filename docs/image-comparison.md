# **Docker Image Optimization & Multi-Stage Build Comparison Report**

## **1. Project Overview & Objectives**
Dokumen ini menjelaskan hasil optimasi dan strategi teknis dalam proses containerization aplikasi **Kelarin**. Dengan beralih ke strategi *multi-stage build* dan penggunaan *minimal base images*, kita berhasil meningkatkan efisiensi deployment secara drastis.

---

## **2. Backend Image Optimization (FastAPI)**

### **2.1 Image Size Comparison**
Berikut adalah hasil perbandingan setelah dilakukan *fine-tuning* pada layer Dockerfile:

| Configuration | Image Size |
| :--- | :--- |
| **Initial Optimized** | **76.7 MB** |
| **Final Optimized** | **69.93 MB** |

> **Analisis:** Berhasil dipangkas dari **76.7 MB** menjadi **69.93 MB**. Penghematan ini dicapai melalui pembersihan cache `pip` secara permanen dan memastikan hanya library produksi yang disalin ke *final stage*.

---

## **3. Frontend Image Optimization (React/Vite)**

### **3.1 Comparison**
Frontend menggunakan strategi pemisahan antara lingkungan *build* dan lingkungan *runtime* (Nginx) untuk mencapai ukuran seminimal mungkin:

| Strategy | Size |
| :--- | :--- |
| **Initial Build** | **26.1 MB** |
| **Final Optimized** | **24.85 MB** |

> **Analisis:** Berhasil dipangkas dari **26.1 MB** menjadi **24.85 MB**. Ukuran akhir ini mencerminkan image yang sangat ringan karena hanya berisi *static assets* dan web server Nginx-Alpine.

---

## **4. Conclusion**

Optimasi pada modul ini berhasil mencapai titik efisiensi tinggi sesuai target:
* **Backend**: Berhasil dipangkas dari **76.7 MB** menjadi **69.93 MB**.
* **Frontend**: Berhasil dipangkas dari **26.1 MB** menjadi **24.85 MB**.

Hasil ini memastikan proses *push/pull* pada pipeline CI/CD menjadi lebih cepat dan penggunaan *resource storage* di server deployment menjadi jauh lebih hemat.