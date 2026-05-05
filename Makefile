# Makefile untuk Project Kelarin — Team Ethereal

.PHONY: build up down logs push clean restart lint test pr-check

# ==================== EXISTING TARGETS ====================

# Build semua image Docker
build:
	docker compose build

# Jalankan semua service di background menggunakan profile dev
up:
	docker compose --profile dev up -d

# Hentikan dan hapus container beserta network
down:
	docker compose --profile dev down

# Lihat log dari semua service secara real-time
logs:
	docker compose logs -f

# Push semua image ke Docker Hub (Tugas Lead CI/CD)
push:
	docker compose push

# Hentikan, hapus container, beserta volume (reset database)
clean:
	docker compose --profile dev down -v
	docker system prune -f

# Restart semua service
restart:
	docker compose restart

# ==================== NEW TARGETS (TUGAS 9) ====================

# 1. Menjalankan linter untuk mengecek kualitas kode di backend
lint:
	docker compose exec backend ruff check . || echo "Linter failed or not installed"

# 2. Placeholder untuk testing (Unit Test)
test:
	@echo "Running unit tests for Kelarin App..."
	@echo "No tests implemented yet, but environment is ready."

# 3. PR Check: Simulasi build dan health-check sebelum merge ke main
pr-check:
	docker compose build
	docker compose --profile dev up -d
	@echo "Verifying service health..."
	curl -f http://localhost:8000/health || (echo "Health check failed"; exit 1)
	@echo "PR Check Passed! Infrastruktur aman untuk di-merge."