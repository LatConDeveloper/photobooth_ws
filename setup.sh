#!/bin/bash

# PhotoBooth MVP Setup Script
# Run this script to set up both backend and mobile app

set -e

echo "🎬 PhotoBooth MVP Setup"
echo "======================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be >= 18 (current: $(node -v))"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Backend Setup
echo "${GREEN}📦 Setting up Backend...${NC}"
cd server

if [ ! -f ".env" ]; then
    echo "${YELLOW}⚠️  Creating .env from .env.example${NC}"
    cp .env.example .env
    echo "⚠️  Please edit server/.env with your Supabase credentials"
fi

echo "Installing backend dependencies..."
npm install

echo "✅ Backend setup complete"
echo ""

cd ..

# Mobile App Setup
echo "${GREEN}📱 Setting up Mobile App...${NC}"
cd app-mobile

if [ ! -f ".env" ]; then
    echo "${YELLOW}⚠️  Creating .env from .env.example${NC}"
    cp .env.example .env
fi

echo "Installing mobile dependencies..."
npm install

# iOS setup
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v pod &> /dev/null; then
        echo "Installing iOS pods..."
        cd ios
        pod install
        cd ..
        echo "✅ iOS pods installed"
    else
        echo "${YELLOW}⚠️  CocoaPods not found. Skipping iOS setup.${NC}"
        echo "   Install with: sudo gem install cocoapods"
    fi
fi

echo "✅ Mobile app setup complete"
echo ""

cd ..

# Summary
echo ""
echo "${GREEN}✨ Setup Complete!${NC}"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure Supabase:"
echo "   - Create project at https://supabase.com"
echo "   - Run migrations from ops/supabase/migrations/"
echo "   - Update server/.env with your credentials"
echo ""
echo "2. Start Backend:"
echo "   cd server && npm run dev"
echo ""
echo "3. Start Mobile App:"
echo "   cd app-mobile && npm run ios    # or npm run android"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - docs/instructions.md - Architecture"
echo "   - docs/user_stories.md - Features"
echo ""
echo "Happy coding! 🚀"
