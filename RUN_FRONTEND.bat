@echo off
echo ========================================
echo   Starting Hospital Management Frontend
echo ========================================
echo.

cd frontend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting frontend app...
echo Frontend will open on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
