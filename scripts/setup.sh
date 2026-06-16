#!/bin/bash

# 1. REMOVE 'set -e' so the script doesn't vanish on a minor error.
# Instead, we will handle errors gracefully.

# ─────────────────────────────────────────────
#  setup.sh — Enhanced Resilience Version
# ─────────────────────────────────────────────

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()    { echo -e "${GREEN}[setup]${NC} $1"; }
warn()   { echo -e "${YELLOW}[warn]${NC}  $1"; }
error()  { echo -e "${RED}[error]${NC} $1"; } # Don't exit 1 here, let the trap handle it

# ── 0. The "Safety Net" ──────────────────────
# This function runs whenever the script finishes or crashes.
cleanup() {
  echo ""
  echo -e "${YELLOW}──────────────────────────────────────────────────${NC}"
  echo -e "${YELLOW}  Script finished. Press any key to close window...${NC}"
  echo -e "${YELLOW}──────────────────────────────────────────────────${NC}"
  # Force reading from the terminal directly
  read -n 1 -s < /dev/tty 2>/dev/null || read -n 1 -s
}
trap cleanup EXIT

# ── 1. Check required tools ──────────────────
log "Checking required tools..."

command -v python3 >/dev/null 2>&1 || { error "Python 3 not found."; exit 1; }
command -v node     >/dev/null 2>&1 || { error "Node.js not found."; exit 1; }

# ── 2. Backend setup ─────────────────────────
log "Setting up backend..."
if [ -d "backend" ]; then
  cd backend
  python3 -m venv venv || warn "Could not create venv"
  source venv/bin/activate || warn "Could not activate venv"
  pip install -r requirements.txt --quiet || warn "Pip install failed"
  [ -f ".env.example" ] && [ ! -f ".env" ] && cp .env.example .env
  deactivate
  cd ..
else
  warn "Backend directory not found!"
fi

# ── 3. Frontend setup ────────────────────────
log "Setting up frontend..."
if [ -d "frontend" ]; then
  cd frontend
  npm install --silent || warn "NPM install failed"
  [ -f ".env.example" ] && [ ! -f ".env" ] && cp .env.example .env
  cd ..
else
  warn "Frontend directory not found!"
fi

log "Setup process finished!"