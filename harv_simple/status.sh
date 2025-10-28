#!/bin/bash

echo "📊 Harv Simple Status"
echo "========================================="
echo ""

# Check backend
echo "Backend (port 8001):"
if lsof -ti:8001 > /dev/null 2>&1; then
    echo "  Status: ✓ RUNNING"
    if curl -s http://localhost:8001/health > /dev/null; then
        HEALTH=$(curl -s http://localhost:8001/health)
        USERS=$(echo "$HEALTH" | python3 -c "import sys,json; print(json.load(sys.stdin)['stats']['users'])" 2>/dev/null || echo "?")
        MODULES=$(echo "$HEALTH" | python3 -c "import sys,json; print(json.load(sys.stdin)['stats']['modules'])" 2>/dev/null || echo "?")
        CONVOS=$(echo "$HEALTH" | python3 -c "import sys,json; print(json.load(sys.stdin)['stats']['conversations'])" 2>/dev/null || echo "?")
        echo "  Users: $USERS | Modules: $MODULES | Conversations: $CONVOS"
    else
        echo "  ⚠ Running but not responding"
    fi
else
    echo "  Status: ✗ NOT RUNNING"
fi

echo ""

# Check frontend
echo "Frontend (port 3001):"
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "  Status: ✓ RUNNING"
    if curl -s http://localhost:3001 > /dev/null; then
        echo "  URL: http://localhost:3001"
    else
        echo "  ⚠ Running but not responding"
    fi
else
    echo "  Status: ✗ NOT RUNNING"
fi

echo ""
echo "========================================="
