@echo off
title ListIQ Dev Server
color 0A

echo ========================================
echo   ListIQ - Clearing stale ports...
echo ========================================

:: Kill anything on port 5173 (frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 "') do (
  taskkill /PID %%a /F >nul 2>&1
)

:: Kill anything on port 5000 (backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 "') do (
  taskkill /PID %%a /F >nul 2>&1
)

echo Ports cleared.
echo.
echo ========================================
echo   Starting Backend on port 5000...
echo ========================================
start "ListIQ Backend" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 4 /nobreak >nul

echo ========================================
echo   Starting Frontend on port 5173...
echo ========================================
start "ListIQ Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 4 /nobreak >nul

echo.
echo ========================================
echo   Both servers started!
echo   Backend  → http://localhost:5000
echo   Frontend → http://localhost:5173
echo ========================================
echo.
echo Opening dashboard...
start "" "http://localhost:5173/dashboard"
