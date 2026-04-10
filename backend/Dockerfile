# ============================================================
# Stage: Production Image
# ============================================================

# 1. Base image — Python 3.12 slim
FROM python:3.12-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy requirements.txt (cache optimization)
COPY requirements.txt .

# 4. Install dependencies & curl (curl dibutuhkan untuk HEALTHCHECK)
# apt-get update & clean dilakukan dalam satu RUN untuk menjaga image tetap kecil
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 5. Copy seluruh kode aplikasi
COPY . .

# 6. Dokumentasikan port
EXPOSE 8000

# 7. Security: Membuat dan menggunakan non-root user (Tugas Lead DevOps)
RUN useradd -m appuser
# Pastikan folder aplikasi dimiliki oleh appuser
RUN chown -R appuser:appuser /app
USER appuser

# 8. Healthcheck (Tugas Lead Backend)
# Memastikan aplikasi merespon di endpoint /health
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# 9. Jalankan aplikasi
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

