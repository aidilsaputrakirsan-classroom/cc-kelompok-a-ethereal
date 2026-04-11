#!/bin/bash

# ─────────────────────────────────────────────
#  dev.sh — Local Development Runner
# ─────────────────────────────────────────────

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${GREEN}[dev]${NC}    $1"; }
warn()  { echo -e "${YELLOW}[warn]${NC}   $1"; }
error() { echo -e "${RED}[error]${NC}  $1"; }
info()  { echo -e "${CYAN}[info]${NC}   $1"; }

# ── 0. The Safety Trap ───────────────────────
# This ensures background processes die and the window stays open on exit.
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  warn "Shutting down services..."
  
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
  
  echo -e "${YELLOW}──────────────────────────────────────────────────${NC}"
  echo -e "${YELLOW}  Dev Runner stopped. Press any key to close...    ${NC}"
  echo -e "${YELLOW}──────────────────────────────────────────────────${NC}"
  
  # Flush buffer and wait
  while read -r -t 0; do read -r; done
  read -n 1 -s < /dev/tty 2>/dev/null || read -n 1 -s
  exit 0
}

# Catch Ctrl+C and script exit
trap cleanup SIGINT SIGTERM EXIT

# ── 1. Start services ───────────────────────────
start() {
  # Backend
  if [ -d "backend" ]; then
    log "Starting backend..."
    cd backend
    source venv/bin/activate
    # Use --no-use-colors to make logs less messy if preferred
    uvicorn main:app --reload --port 8000 &
    BACKEND_PID=$!
    deactivate
    cd ..
  else
    error "Backend folder missing."
  fi

  # Frontend
  if [ -d "frontend" ]; then
    log "Starting frontend..."
    cd frontend
    # We use -- --no-clearScreen to prevent Vite from wiping your terminal history
    npm run dev -- --no-clearScreen &
    FRONTEND_PID=$!
    cd ..
  else
    error "Frontend folder missing."
  fi

  echo ""
  info "  Backend  → http://localhost:8000"
  info "  Frontend → http://localhost:5173"
  echo ""
}

# ── 2. Main Menu Loop ──────────────────────────
echo -e "${GREEN}╔══════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Kelarin Dev Runner       ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════╝${NC}"

start

while true; do
  # We use /dev/tty to ensure 'read' listens to YOU, not the background logs
  echo -e "\n${CYAN}COMMANDS: [r] restart | [q] quit${NC}"
  echo -n -e "  > "
  
  # Flush any "stray" logs from the input buffer before reading
  while read -r -t 0; do read -r; done
  
  if read -r -n 1 cmd < /dev/tty; then
    case "$cmd" in
      r|R)
        echo -e "\n"
        log "Restarting..."
        [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null
        [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
        sleep 1
        start
        ;;
      q|Q)
        echo -e "\n"
        log "Exiting..."
        exit 0
        ;;
      *)
        # Just ignore other keys and keep the loop clean
        ;;
    esac
  fi
done