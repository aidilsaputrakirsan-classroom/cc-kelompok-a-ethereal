# Kelarin Local Dev Runner (Windows PowerShell)
# Use this if Docker is not working.

$ErrorActionPreference = "Stop"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Kelarin Microservices Local Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Auth Service (8001)
Write-Host "[1/4] Launching Auth Service..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/auth-service; pip install -r requirements.txt; python -m uvicorn main:app --port 8001"

# 2. Task Service (8002)
Write-Host "[2/4] Launching Task Service..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/task-service; pip install -r requirements.txt; `$env:AUTH_SERVICE_URL='http://localhost:8001'; python -m uvicorn main:app --port 8002"

# 3. API Gateway (8000)
Write-Host "[3/4] Launching API Gateway..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/gateway; pip install -r requirements.txt; python -m uvicorn main:app --port 8000"

# 4. Frontend (5173)
Write-Host "[4/4] Launching Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm install; `$env:VITE_API_URL='http://localhost:8000'; npm run dev"

Write-Host "`nAll services are starting in separate windows." -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Gateway Health: http://localhost:8000/status" -ForegroundColor White
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "To stop: Close the separate terminal windows." -ForegroundColor Gray
