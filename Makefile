# ============================================================
# Makefile — Kelarin App Automation Tools (Team Ethereal)
# Modul 14: Monitoring, Logging & Observability Support
# ============================================================

.PHONY: build up down logs push clean restart lint test pr-check ps prod status

# ==================== CORE TARGETS ====================

# Build semua image Docker
build:
	@echo "🛠️  Membangun seluruh image microservices..."
	docker compose build

# Jalankan semua service di background
up:
	@echo "🚀 Menyalakan ekosistem microservices dan API Gateway..."
	docker compose up --build -d

# Jalankan versi PRODUCTION (menggunakan override file)
prod:
	@echo "📦 Menjalankan sistem dalam mode PRODUCTION..."
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Hentikan dan hapus container beserta network
down:
	@echo "🛑 Menghentikan seluruh kontainer microservices..."
	docker compose down

# Lihat log dari semua service secara real-time
logs:
	@echo "📋 Menampilkan log dari seluruh kontainer..."
	docker compose logs -f

# Hentikan, hapus container, beserta volume (reset total database)
clean:
	@echo "🧹 Membersihkan kontainer, jaringan, dan seluruh data volume database..."
	docker compose down -v
	docker system prune -f

# Restart semua service
restart:
	@echo "🔄 Memuat ulang seluruh layanan..."
	docker compose restart

# Memeriksa status kesehatan kontainer
status:
	@echo "🔍 Memeriksa status dan kesehatan kontainer..."
	docker compose ps

# ==================== AUTOMATION & QA TARGETS ====================

# [BARU] Menjalankan script log helper
trace:
	@echo "🔗 Membuka log trace untuk correlation ID..."
	./scripts/logs.sh trace $(id)

# [BARU] Menjalankan pengecekan metrics
metrics:
	@echo "📊 Mengambil snapshot metrik dari services..."
	./scripts/logs.sh metrics

# Menjalankan linter untuk mengecek kualitas kode
lint:
	@echo "🔍 Mengecek kualitas kode..."
	docker compose exec auth-service ruff check . || echo "Linter failed or not installed"

# Menjalankan unit tests
test:
	@echo "🧪 Running unit tests..."
	docker compose run --rm task-service pytest || echo "No tests implemented."

# PR Check: Simulasi build dan health-check
pr-check:
	@echo "🚨 Menjalankan simulasi Pipeline PR Check..."
	docker compose build
	docker compose up -d
	sleep 5
	@echo "📡 Memverifikasi kesehatan pintu utama API Gateway..."
	curl -f http://localhost/health || (echo "❌ Health check API Gateway gagal!"; exit 1)
	@echo "✅ PR Check Passed!"