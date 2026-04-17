# Makefile untuk Project Kelarin

.PHONY: build up down logs push clean restart

# Build semua image Docker
build:
	docker compose build

# Jalankan semua service di background
up:
	docker compose up -d

# Hentikan dan hapus container beserta network
down:
	docker compose down

# Lihat log dari semua service secara real-time
logs:
	docker compose logs -f

# Push semua image ke Docker Hub (Tugas Lead CI/CD)
push:
	docker compose push

# Hentikan, hapus container, beserta volume (hati-hati, data database akan hilang)
clean:
	docker compose down -v
	docker system prune -f

# Restart semua service
restart:
	docker compose restart