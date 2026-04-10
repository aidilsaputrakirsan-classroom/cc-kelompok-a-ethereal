#!/bin/bash

# ============================================================
# Script untuk mempermudah start/stop semua container Kelarin
# ============================================================

ACTION=${1:-start}

case $ACTION in
  start)
    echo "🚀 Starting Ethereal Team Infrastructure..."
    
    # Create network
    docker network create kelarin-net 2>/dev/null || true
    
    # 1. Database
    echo "📦 Starting Database (db-kelarin)..."
    docker run -d \
      --name db-kelarin \
      --network kelarin-net \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=PW_ANDA \
      -e POSTGRES_DB=kelarin \
      -p 5433:5432 \
      -v pgdata:/var/lib/postgresql/data \
      postgres:16-alpine
    
    # Wait for database
    echo "⏳ Waiting for database to wake up..."
    sleep 5
    
    # 2. Backend
    echo "🐍 Starting Backend (v2)..."
    docker run -d \
      --name backend \
      --network kelarin-net \
      --env-file backend/.env.docker \
      -p 8000:8000 \
      dwialsha/kelarin:backend-v2
    
    # 3. Frontend
    echo "⚛️ Starting Frontend (v1)..."
    docker run -d \
      --name frontend \
      --network kelarin-net \
      -p 3000:80 \
      dwialsha/kelarin:frontend-v1
    
    echo ""
    echo "✅ All containers started!"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8000"
    echo "   Database: localhost:5433"
    ;;
    
  stop)
    echo "🛑 Stopping all containers..."
    docker stop frontend backend db-kelarin 2>/dev/null
    docker rm frontend backend db-kelarin 2>/dev/null
    echo "✅ All containers stopped and removed (Data is safe in Volume)."
    ;;
    
  status)
    echo "📊 Container Status:"
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
    ;;
    
  *)
    echo "Usage: ./scripts/docker-run.sh [start|stop|status]"
    ;;
esac