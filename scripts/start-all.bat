@echo off
title Menjalankan Aplikasi Amaliah Semarang Infak
echo ========================================================
echo   MENJALANKAN AMALIAH SEMARANG INFAK (XENDIT ENABLED)
echo ========================================================
echo.

echo [1/2] Menjalankan Backend Amaliah (Port 8081)...
start "Amaliah - Backend Server (8081)" cmd /k "cd /d \"%~dp0backend\" && mvnw.cmd spring-boot:run"

timeout /t 3 /nobreak >nul

echo [2/2] Menjalankan Frontend Vite (Port 3000)...
start "Amaliah - Frontend React (3000)" cmd /k "cd /d \"%~dp0frontend\" && npm run dev"

echo.
echo ========================================================
echo   SEMUA LAYANAN SEDANG DIMUAT!
echo   - Frontend       : http://localhost:3000
echo   - Backend API    : http://localhost:8081
echo   - Payment Gateway: Xendit (Webhook & Sandbox Simulation)
echo ========================================================
echo.
pause
