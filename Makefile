.PHONY: up down build logs ps clean restart shell-backend shell-db

# 1. Menyalakan aplikasi (Default)
up:
	docker compose up -d

# 2. Build ulang dari nol (Wajib dipakai setelah tim push kode baru/Vite v7)
# Pakai --no-cache supaya benar-benar fresh seperti instruksi tadi
build:
	docker compose build --no-cache
	docker compose up -d

# 3. Matikan aplikasi (Hapus container tapi data DB aman)
down:
	docker compose down

# 4. Reset Total (Hapus volume database & sampah image)
# Hati-hati: Data di database kelarin bakal hilang!
clean:
	docker compose down -v
	docker system prune -f

# 5. Lihat status container (Untuk cek port 5173 & 8000)
ps:
	docker compose ps

# 6. Pantau Log secara Real-time (Untuk debugging backend/frontend)
logs:
	docker compose logs -f

# 7. Masuk ke terminal Backend (Buat cek file di dalam container)
shell-backend:
	docker compose exec backend bash

# 8. Masuk ke Database Postgres (Langsung ke DB kelarin)
# Sesuaikan 'db-kelarin' dengan nama service di docker-compose.yml kamu
shell-db:
	docker compose exec db-kelarin psql -U postgres -d kelarin

# 9. Jalankan Setup awal (Shortcut buat teman timmu)
setup:
	chmod +x setup.sh
	./setup.sh
