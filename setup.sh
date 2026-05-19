#!/bin/bash

# Vibe Pro Agency Website - Setup Script
# This script will install all dependencies and set up the project

echo "🚀 Vibe Pro Agency - Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please download and install Node.js from https://nodejs.org/"
    echo "Recommended: LTS version (18+ or higher)"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✓ npm found: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo ""
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# Contact form email
CONTACT_EMAIL=contact@vibepro.com

# Email service (optional - for production use Resend, SendGrid, etc.)
# RESEND_API_KEY=your-api-key-here

# Node environment
NODE_ENV=development
EOF
    echo "✓ .env.local created"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "The site will be available at: http://localhost:3000"
