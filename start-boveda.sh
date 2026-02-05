#!/bin/bash
# Boveda Clean Startup Script

echo "🧹 Cleaning up conflicting processes..."
lsof -ti:3001,3005,3100 | xargs -r kill -9 2>/dev/null
sleep 2

echo "🚀 Starting Boveda on dedicated ports..."
echo "   - API: http://localhost:3001"
echo "   - Studio: http://localhost:3100"
echo ""

# Start in current directory
pnpm dev

# When you stop with Ctrl+C, cleanup
trap "echo 'Stopping Boveda...'; lsof -ti:3001,3100 | xargs -r kill -9 2>/dev/null" EXIT
