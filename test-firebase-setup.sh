#!/bin/bash

echo "🔥 Firebase Notification Setup Test"
echo "===================================="

# Check if environment files exist
echo "📝 Checking environment files..."

if [ -f "client/.env" ]; then
    echo "✅ Client .env file exists"
else
    echo "❌ Client .env file missing - create from .env.example"
fi

if [ -f "server/.env" ]; then
    echo "✅ Server .env file exists"
else
    echo "❌ Server .env file missing - create from .env.example"
fi

# Check if service worker exists
if [ -f "client/public/firebase-messaging-sw.js" ]; then
    echo "✅ Firebase service worker exists"
else
    echo "❌ Firebase service worker missing"
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Follow FIREBASE_SETUP.md to configure your Firebase project"
echo "2. Update client/.env with your Firebase credentials"
echo "3. Update server/.env with your Firebase Admin credentials"
echo "4. Update client/public/firebase-messaging-sw.js with your config"
echo "5. Start the servers and test notifications!"

echo ""
echo "🚀 Quick Start Commands:"
echo "# Terminal 1 - Start client"
echo "cd client && npm run dev"
echo ""
echo "# Terminal 2 - Start server"
echo "cd server && npm run dev"
