@echo off
REM Vibe Pro Agency Website - Setup Script for Windows
REM This script will install all dependencies and set up the project

echo.
echo ========================================
echo Vibe Pro Agency - Windows Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Node.js is not installed
    echo Please download and install Node.js from https://nodejs.org/
    echo Recommended: LTS version (18+ or higher)
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo OK: Node.js found: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo OK: npm found: %NPM_VERSION%

REM Install dependencies
echo.
echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Create .env.local if it doesn't exist
if not exist ".env.local" (
    echo.
    echo Creating .env.local file...
    (
        echo # Contact form email
        echo CONTACT_EMAIL=contact@vibepro.com
        echo.
        echo # Email service (optional - for production use Resend, SendGrid, etc.^)
        echo # RESEND_API_KEY=your-api-key-here
        echo.
        echo # Node environment
        echo NODE_ENV=development
    ) > .env.local
    echo OK: .env.local created
)

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo The site will be available at: http://localhost:3000
echo.
pause
