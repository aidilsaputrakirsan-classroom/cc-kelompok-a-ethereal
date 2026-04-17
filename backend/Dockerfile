# ============================================================
# Stage 1: Builder (Untuk install library)
# ============================================
FROM python:3.12-slim AS builder

WORKDIR /app
COPY requirements.txt .

# Install dependencies ke dalam folder tertentu (/install)
RUN apt-get update && apt-get install -y --no-install-recommends gcc build-essential \
    && pip install --no-cache-dir --prefix=/install -r requirements.txt


# ============================================================
# Stage 2: Production Image (Final)
# ============================================================
FROM python:3.12-slim

WORKDIR /app

# 1. Ambil library dari stage builder (Tanpa bawa sampah build-tools)
COPY --from=builder /install /usr/local

# 2. Install curl saja (karena curl ringan & penting buat HEALTHCHECK)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 3. Copy seluruh kode aplikasi
COPY . .

# 4. Dokumentasikan port
EXPOSE 8000

# 5. Security: Non-root user (Tetap aman!)
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# 6. Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# 7. Jalankan aplikasi
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]