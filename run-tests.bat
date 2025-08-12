@echo off
REM TestBay Standalone Demo - Test Runner Script (Windows)
REM This script sets up and runs the Playwright test suite

echo 🧪 TestBay Standalone Demo - Test Runner
echo ========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 16 (
    echo ❌ Node.js version 16+ is required. Current version:
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js detected:
node --version

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
    echo ✅ Python detected:
    python --version
) else (
    python3 --version >nul 2>&1
    if %errorlevel% equ 0 (
        set PYTHON_CMD=python3
        echo ✅ Python detected:
        python3 --version
    ) else (
        echo ❌ Python is not installed. Please install Python 3.x first.
        pause
        exit /b 1
    )
)

REM Install dependencies if package-lock.json doesn't exist
if not exist "package-lock.json" (
    echo 📦 Installing dependencies...
    npm install
) else (
    echo ✅ Dependencies already installed
)

REM Install Playwright browsers if not already installed
if not exist "node_modules\.cache\ms-playwright" (
    echo 🌐 Installing Playwright browsers...
    npm run install-browsers
) else (
    echo ✅ Playwright browsers already installed
)

echo.
echo 🚀 Starting test server and running tests...
echo.

REM Run the tests
npm test

echo.
echo ✅ Tests completed!
echo.
echo 📊 To view the test report:
echo    npm run test:report
echo.
echo 🔍 To run tests in debug mode:
echo    npm run test:debug
echo.
echo 👁️  To run tests with browser visible:
echo    npm run test:headed
echo.
pause
