@echo off
color 0A
title Automatic Database Setup

echo ================================================================================
echo                   AUTOMATIC DATABASE SETUP
echo ================================================================================
echo.
echo This will create the database automatically!
echo.
echo Your MySQL password is: 13990028
echo.
echo Press any key to start...
pause >nul

echo.
echo [1/3] Attempting to create database...
echo.

mysql -u root -p13990028 -e "CREATE DATABASE IF NOT EXISTS hospital_management;" 2>nul

if %errorlevel% equ 0 (
    echo ✓ Database created successfully!
    echo.
    echo [2/3] Creating tables...
    echo.
    
    mysql -u root -p13990028 hospital_management < setup-database.sql 2>nul
    
    if %errorlevel% equ 0 (
        echo ✓ Tables created successfully!
        echo.
        echo [3/3] Verifying setup...
        echo.
        
        mysql -u root -p13990028 -e "USE hospital_management; SHOW TABLES;" 2>nul
        
        echo.
        echo ================================================================================
        echo                          ✅ SUCCESS! ✅
        echo ================================================================================
        echo.
        echo Database setup complete!
        echo.
        echo Next steps:
        echo 1. Close this window
        echo 2. Double-click: START_APPLICATION.bat
        echo 3. Open browser: http://localhost:3000
        echo 4. Register and start using the app!
        echo.
        echo ================================================================================
    ) else (
        goto MANUAL_SETUP
    )
) else (
    goto MANUAL_SETUP
)

echo.
pause
exit

:MANUAL_SETUP
echo.
echo ================================================================================
echo                   ⚠️  AUTOMATIC SETUP FAILED
echo ================================================================================
echo.
echo MySQL command line is not in your system PATH.
echo.
echo Please use one of these manual methods:
echo.
echo METHOD 1: MySQL Workbench (EASIEST)
echo ------------------------------------
echo 1. Open MySQL Workbench
echo 2. Connect with password: 13990028
echo 3. File → Open SQL Script
echo 4. Select: setup-database.sql
echo 5. Click Execute (⚡ icon)
echo.
echo METHOD 2: MySQL Command Line
echo -----------------------------
echo 1. Open "MySQL 8.0 Command Line Client"
echo 2. Enter password: 13990028
echo 3. Run: SOURCE C:/Users/SAIF SANADI/Desktop/Hospital MGMT/setup-database.sql;
echo.
echo ================================================================================
echo.
pause
exit
