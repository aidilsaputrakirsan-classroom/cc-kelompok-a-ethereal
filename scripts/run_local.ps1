# run_local.ps1
# Script untuk menjalankan Kelarin microservices secara lokal tanpa Docker

Write-Host ">>> Menyalakan Microservices Kelarin secara lokal..." -ForegroundColor Cyan

# Pastikan proses lama sudah dimatikan
Write-Host "Pembersihan proses Python lama..." -ForegroundColor Yellow
taskkill /F /IM python.exe 2>$null
taskkill /F /IM python3.12.exe 2>$null

# 1. Jalankan Auth Service di port 8001
Write-Host "[1/4] Menyalakan Auth Service di port 8001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/auth-service; python -m uvicorn main:app --port 8001 --reload"

# 2. Jalankan Task Service di port 8002
Write-Host "[2/4] Menyalakan Task Service di port 8002..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/task-service; python -m uvicorn main:app --port 8002 --reload"

# 3. Jalankan API Gateway di port 8000
Write-Host "[3/4] Menyalakan API Gateway di port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/gateway; `$env:PORT=8000; `$env:AUTH_SERVICE_URL='http://localhost:8001'; `$env:TASK_SERVICE_URL='http://localhost:8002'; python -m uvicorn main:app --port 8000 --reload"

# 4. Jalankan Frontend React/Vite
Write-Host "[4/4] Menyalakan Frontend React di port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; `$env:VITE_API_URL='http://localhost:8000'; npm run dev"

Write-Host "=== Semua service telah dijalankan di jendela terpisah! ===" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Green
