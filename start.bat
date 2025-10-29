@echo off
echo ========================================
echo   Groq AI Chat - Starting Server
echo ========================================
echo.

REM Check if .env file exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo.
    echo Please create a .env file with your configuration:
    echo   1. Copy .env.example to .env
    echo   2. Add your GROQ_API_KEY from https://console.groq.com/
    echo   3. Set a secure JWT_SECRET
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo [INFO] Installing dependencies...
    echo.
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

echo [INFO] Starting server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

node server.js

pause
