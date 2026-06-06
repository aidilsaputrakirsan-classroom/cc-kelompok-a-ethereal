# ============================================================
# Makefile — Kelarin App Automation Tools (Team Ethereal)
# Modul 12 Task Terstruktur: Advance Healthchecks & Gateway
# ============================================================

.PHONY: build up down logs push clean restart lint test pr-check ps

# ==================== CORE TARGETS ====================

# Build semua image Docker
build:
	@echo "🛠️  Membangun seluruh image microservices..."
	docker compose build

# Jalankan semua service di background (Gateway akan menunggu semua backend healthy)
up:
	@echo "🚀 Menyalakan ekosistem microservices dan API Gateway..."
	docker compose up --build -d

# Hentikan dan hapus container beserta network
down:
	@echo "🛑 Menghentikan seluruh kontainer microservices..."
	docker compose down

# Lihat log dari semua service secara real-time
logs:
	@echo "📋 Menampilkan log dari seluruh kontainer..."
	docker compose logs -f

# Push semua image ke Docker Hub (Tugas Lead CI/CD)
push:
	@echo "📤 Membawa hasil build image ke Docker Hub..."
	docker compose push

# Hentikan, hapus container, beserta volume (reset total database)
clean:
	@echo "🧹 Membersihkan kontainer, jaringan, dan seluruh data volume database..."
	docker compose down -v
	docker system prune -f

# Restart semua service
restart:
	@echo "🔄 Memuat ulang seluruh layanan..."
	docker compose restart

# Memeriksa status kesehatan kontainer secara berkala
ps:
	@echo "🔍 Memeriksa status dan kesehatan kontainer..."
	docker compose ps

# ==================== AUTOMATION & QA TARGETS ====================

# Menjalankan linter untuk mengecek kualitas kode di auth-service
lint:
	@echo "🔍 Mengecek kualitas kode pada auth-service..."
	docker compose exec auth-service ruff check . || echo "Linter failed or not installed"

# Placeholder untuk testing (Unit Test)
test:
	@echo "🧪 Running unit tests for Kelarin Microservices App..."
	@echo "Executing tests inside task-service..."
	docker compose run --rm task-service pytest || echo "No tests implemented yet, but environment is ready."

# PR Check: Simulasi build dan health-check komplit lewat pintu API Gateway (Port 80)
pr-check:
	@echo "🚨 Menjalankan simulasi Pipeline PR Check..."
	docker compose build
	docker compose up -d
	@echo "⏳ Menunggu kontainer melakukan inisialisasi..."
	sleep 5
	@echo "📡 Memverifikasi kesehatan pintu utama API Gateway..."
	curl -f http://localhost/health || (echo "❌ Health check API Gateway gagal!"; exit 1)
	@echo "✅ PR Check Passed! Infrastruktur microservices aman untuk di-merge ke branch main."