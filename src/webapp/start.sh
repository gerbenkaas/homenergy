#!/bin/bash

# Working directories
BACKEND_DIR="/path/to/webapp/backend"
FRONTEND_DIR="/path/to/webapp/frontend"

# Activate virtual environment
source "$BACKEND_DIR/venv/bin/activate"

cd "$BACKEND_DIR"
exec uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &

cd "$FRONTEND_DIR"
python -m http.server 8080 > frontend.log 2>&1 &

echo $! > /tmp/frontend_http.pid
jobs -p | head -n 1 > /tmp/fastapi.pid
