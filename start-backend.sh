#!/bin/bash

# AquaPulse Local Backend Start Script
# This starts the Express + SQLite backend server

set -e

echo "🚀 Starting AquaPulse Backend Server..."
echo ""

cd "$(dirname "$0")/server" || exit

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✨ Starting Express server on http://localhost:3001"
echo ""
node server.js
