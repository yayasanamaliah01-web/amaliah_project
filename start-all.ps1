# Script untuk menjalankan semua service Amaliah
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  MENJALANKAN AMALIAH SEMARANG INFAK (XENDIT ENABLED)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "`n[1/2] Menjalankan Backend Amaliah (Port 8081)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; .\mvnw.cmd spring-boot:run"

Start-Sleep -Seconds 3

Write-Host "[2/2] Menjalankan Frontend Vite (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "  SEMUA LAYANAN SEDANG BERJALAN!" -ForegroundColor Green
Write-Host "  - Frontend       : http://localhost:3000" -ForegroundColor White
Write-Host "  - Backend API    : http://localhost:8081" -ForegroundColor White
Write-Host "  - Payment Gateway: Xendit (Webhook & Sandbox Simulation)" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green
