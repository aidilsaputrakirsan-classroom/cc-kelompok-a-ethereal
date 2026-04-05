# Image Comparison: Python 3.12

Dokumen ini mencatat perbandingan ukuran beberapa varian Docker image Python 3.12.

## Hasil Perbandingan

| Image                | Ukuran |
|---------------------|--------|
| python:3.12         | 1.62GB |
| python:3.12-slim    | 179MB  |
| python:3.12-alpine  | 75MB   |

## Cara Pengambilan Data

Perintah yang digunakan:

```bash
docker pull python:3.12
docker pull python:3.12-slim
docker pull python:3.12-alpine

docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | findstr python