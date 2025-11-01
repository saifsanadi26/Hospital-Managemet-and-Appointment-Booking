@echo off
color 0B
title Hospital Management System - Launcher

echo ================================================================================
echo                   HOSPITAL MANAGEMENT SYSTEM - LAUNCHER
echo ================================================================================
echo.

:: Check if setup is done
if not exist "backend\.env" (
    echo ⚠️  ERROR: Setup not complete!
    echo.
    echo Please run AUTO_SETUP.bat first!
    echo.
    pause
    exit
)

if not exist "backend\node_modules\" (
    echo ⚠️  ERROR: Backend dependencies not installed!
    echo.
    echo Please run AUTO_SETUP.bat first!
    echo.
    pause
    exit
)

if not exist "frontend\node_modules\" (
    echo ⚠️  ERROR: Frontend dependencies not installed!
    echo.
    echo Please run AUTO_SETUP.bat first!
    echo.
    pause
    exit
)

echo [✓] Setup verified
echo.
echo Starting Hospital Management System...
echo.
echo This will open TWO windows:
echo   1. Backend Server (http://localhost:5000)
echo   2. Frontend App (http://localhost:3000)
echo.
echo Press any key to start...
pause >nul

:: Start backend in new window
start "Hospital MGMT - Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"

:: Wait 5 seconds for backend to start
echo.
echo Waiting for backend to start...
timeout /t 5 >nul

:: Start frontend in new window
start "Hospital MGMT - Frontend" cmd /k "cd /d "%~dp0frontend" && npm start"

echo.
echo ================================================================================
echo                          APPLICATION STARTED!
echo ================================================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000 (will open automatically)
echo.
echo To stop the application:
echo   - Close both terminal windows
echo   - Or press Ctrl+C in each window
echo.
echo ================================================================================
echo.
echo This window can be closed now.
timeout /t 5
exit
