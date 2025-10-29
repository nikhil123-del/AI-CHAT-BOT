@echo off
echo ========================================
echo Groq AI Chat - Vercel Deployment Script
echo ========================================
echo.

echo Checking if Vercel CLI is installed...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Vercel CLI not found!
    echo Installing Vercel CLI globally...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo Failed to install Vercel CLI
        echo Please install manually: npm install -g vercel
        pause
        exit /b 1
    )
)

echo.
echo Vercel CLI is ready!
echo.

echo Choose deployment option:
echo 1. Deploy to Preview (Development)
echo 2. Deploy to Production
echo 3. Login to Vercel
echo 4. Check Deployment Status
echo 5. View Logs
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo.
    echo Deploying to Preview environment...
    vercel
) else if "%choice%"=="2" (
    echo.
    echo Deploying to Production...
    vercel --prod
) else if "%choice%"=="3" (
    echo.
    echo Logging in to Vercel...
    vercel login
) else if "%choice%"=="4" (
    echo.
    echo Checking deployment status...
    vercel ls
) else if "%choice%"=="5" (
    echo.
    echo Viewing logs...
    vercel logs
) else if "%choice%"=="6" (
    echo.
    echo Exiting...
    exit /b 0
) else (
    echo.
    echo Invalid choice!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Deployment process completed!
echo ========================================
pause
