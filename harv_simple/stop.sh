#!/bin/bash

echo "🛑 Stopping Harv Simple..."
echo ""

# Kill backend (port 8001)
if lsof -ti:8001 > /dev/null 2>&1; then
    lsof -ti:8001 | xargs kill -9 2>/dev/null
    echo "✓ Backend stopped (port 8001)"
else
    echo "  Backend was not running"
fi

# Kill frontend (port 3001)
if lsof -ti:3001 > /dev/null 2>&1; then
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    echo "✓ Frontend stopped (port 3001)"
else
    echo "  Frontend was not running"
fi

echo ""
echo "Harv Simple stopped."
