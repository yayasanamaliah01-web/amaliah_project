# Script untuk menjalankan semua service MAUN
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  MENJALANKAN MAUN SEMARANG INFAK + BANK SIMULATOR" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "`n[1/3] Menjalankan Bank Simulator (Port 9090)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\payment gateway'; .\mvnw.cmd spring-boot:run"

Start-Sleep -Seconds 3

Write-Host "[2/3] Menjalankan Backend MAUN (Port 8081)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; .\mvnw.cmd spring-boot:run"

Start-Sleep -Seconds 3

Write-Host "[3/3] Menjalankan Frontend Vite (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "  SEMUA LAYANAN SEDANG BERJALAN!" -ForegroundColor Green
Write-Host "  - Frontend       : http://localhost:3000" -ForegroundColor White
Write-Host "  - Backend API    : http://localhost:8081" -ForegroundColor White
Write-Host "  - Bank Simulator : http://localhost:9090" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green
