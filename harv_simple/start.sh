#!/bin/bash

echo "🚀 Starting Harv Simple..."
echo ""

# Kill any existing Harv Simple processes on ports 8001 and 3001
echo "Checking for existing Harv Simple processes..."

# Kill backend on port 8001
BACKEND_PID=$(lsof -ti:8001)
if [ ! -z "$BACKEND_PID" ]; then
    echo "Stopping existing Harv Simple backend (port 8001)..."
    kill -9 $BACKEND_PID 2>/dev/null
fi

# Kill frontend on port 3001
FRONTEND_PID=$(lsof -ti:3001)
if [ ! -z "$FRONTEND_PID" ]; then
    echo "Stopping existing Harv Simple frontend (port 3001)..."
    kill -9 $FRONTEND_PID 2>/dev/null
fi

sleep 1

# Start backend
echo "Starting backend on port 8001..."
cd backend
uvicorn main:app --reload --port 8001 > /tmp/harv_simple_backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -s http://localhost:8001/health > /dev/null; then
    echo "✓ Backend started successfully on port 8001"
else
    echo "✗ Backend failed to start. Check /tmp/harv_simple_backend.log"
    exit 1
fi

# Start frontend
echo "Starting frontend on port 3001..."
cd frontend
python3 -m http.server 3001 > /tmp/harv_simple_frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

sleep 2

echo ""
echo "========================================="
echo "✓ Harv Simple is running!"
echo "========================================="
echo ""
echo "Frontend: http://localhost:3001"
echo "Backend:  http://localhost:8001"
echo "API Docs: http://localhost:8001/docs"
echo ""
echo "Login: admin@harv.com / admin123"
echo ""
echo "To stop: ./stop.sh"
echo ""
echo "NOTE: Main Harv uses ports 8000/3000"
echo "      Harv Simple uses ports 8001/3001"
echo "      Both can run simultaneously!"
echo "========================================="
