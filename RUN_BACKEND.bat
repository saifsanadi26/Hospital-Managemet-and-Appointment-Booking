@echo off
echo ========================================
echo   Starting Hospital Management Backend
echo ========================================
echo.

cd backend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting backend server...
echo Backend will run on: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
