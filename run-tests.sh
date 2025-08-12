#!/bin/bash

# TestBay Standalone Demo - Test Runner Script
# This script sets up and runs the Playwright test suite

set -e

echo "🧪 TestBay Standalone Demo - Test Runner"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python is not installed. Please install Python 3.x first."
    exit 1
fi

echo "✅ Python detected: $($PYTHON_CMD --version)"

# Install dependencies if package-lock.json doesn't exist
if [ ! -f "package-lock.json" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Install Playwright browsers if not already installed
if [ ! -d "node_modules/.cache/ms-playwright" ]; then
    echo "🌐 Installing Playwright browsers..."
    npm run install-browsers
else
    echo "✅ Playwright browsers already installed"
fi

echo ""
echo "🚀 Starting test server and running tests..."
echo ""

# Run the tests
npm test

echo ""
echo "✅ Tests completed!"
echo ""
echo "📊 To view the test report:"
echo "   npm run test:report"
echo ""
echo "🔍 To run tests in debug mode:"
echo "   npm run test:debug"
echo ""
echo "👁️  To run tests with browser visible:"
echo "   npm run test:headed"
