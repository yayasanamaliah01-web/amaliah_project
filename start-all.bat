@echo off
title Menjalankan Aplikasi MAUN Semarang Infak
echo ========================================================
echo   MENJALANKAN MAUN SEMARANG INFAK + BANK SIMULATOR
echo ========================================================
echo.

echo [1/3] Menjalankan Bank Simulator (Port 9090)...
start "MAUN - Bank Simulator (9090)" cmd /k "cd /d \"%~dp0payment gateway\" && mvnw.cmd spring-boot:run"

timeout /t 3 /nobreak >nul

echo [2/3] Menjalankan Backend MAUN (Port 8081)...
start "MAUN - Backend Server (8081)" cmd /k "cd /d \"%~dp0backend\" && mvnw.cmd spring-boot:run"

timeout /t 3 /nobreak >nul

echo [3/3] Menjalankan Frontend Vite (Port 3000)...
start "MAUN - Frontend React (3000)" cmd /k "cd /d \"%~dp0frontend\" && npm run dev"

echo.
echo ========================================================
echo   SEMUA LAYANAN SEDANG DIMUAT!
echo   - Frontend       : http://localhost:3000
echo   - Backend API    : http://localhost:8081
echo   - Bank Simulator : http://localhost:9090
echo ========================================================
echo.
pause
