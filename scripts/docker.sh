#!/bin/bash

# ─────────────────────────────────────────────
#  docker.sh — Docker Workflow Helper
#  Stack: FastAPI + React/Vite + PostgreSQL
# ─────────────────────────────────────────────

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${GREEN}[docker]${NC} $1"; }
warn()  { echo -e "${YELLOW}[warn]${NC}  $1"; }
error() { echo -e "${RED}[error]${NC} $1"; } # Removed exit 1 to let trap handle it
info()  { echo -e "${CYAN}[info]${NC}  $1"; }

# ── 0. The "Safety Net" (Keep Window Open) ─────
cleanup() {
  echo ""
  echo -e "${YELLOW}──────────────────────────────────────────────────${NC}"
  echo -e "${YELLOW}  Process finished. Press any key to close window...${NC}"
  echo -e "${YELLOW}──────────────────────────────────────────────────${NC}"
  # Clear buffer and force read from terminal
  while read -r -t 0; do read -r; done
  read -n 1 -s < /dev/tty 2>/dev/null || read -n 1 -s
}
trap cleanup EXIT

# ── Config ───────────────────────────────────

REGISTRY="dwialsha/kelarin"
BACKEND_TAG="${BACKEND_TAG:-backend-v2}"
FRONTEND_TAG="${FRONTEND_TAG:-frontend-v1}"
COMPOSE_FILE="docker-compose.yml"

BACKEND_IMAGE="$REGISTRY:$BACKEND_TAG"
FRONTEND_IMAGE="$REGISTRY:$FRONTEND_TAG"

# ── Helpers ──────────────────────────────────
require_docker() {
  command -v docker >/dev/null 2>&1 || { error "Docker is not installed."; exit 1; }
  docker info >/dev/null 2>&1       || { error "Docker daemon is not running."; exit 1; }
}

require_compose() {
  docker compose version >/dev/null 2>&1 || { error "Docker Compose (v2) not found."; exit 1; }
  if [ ! -f "$COMPOSE_FILE" ]; then
    echo ""
    warn "docker-compose.yml not found."
    exit 0
  fi
}

# ── Commands ─────────────────────────────────

cmd_build() {
  log "Building all images..."
  docker compose -f "$COMPOSE_FILE" build --no-cache
  log "Build complete."
}

cmd_run() {
  log "Starting all services..."
  docker compose -f "$COMPOSE_FILE" up -d
  echo ""
  info "Services running:"
  info "  Frontend  → http://localhost:5173"
  info "  Backend   → http://localhost:8000"
  info "  Postgres  → localhost:5432"
}

cmd_stop() {
  log "Stopping all services..."
  docker compose -f "$COMPOSE_FILE" down
  log "All services stopped."
}

cmd_restart() {
  cmd_stop
  cmd_run
}

cmd_push() {
  log "Pushing to Docker Hub: $REGISTRY"
  warn "Make sure you're logged in: docker login"
  docker push "$BACKEND_IMAGE"
  docker push "$FRONTEND_IMAGE"
  log "Push complete."
}

cmd_clean() {
  warn "This will remove containers, networks, and volumes."
  echo -n -e "${YELLOW}Are you sure? (y/N): ${NC}"
  
  # FIX: Redirect read to tty so it works on double-click
  read -r confirm < /dev/tty
  
  [[ "$confirm" =~ ^[Yy]$ ]] || { log "Aborted."; exit 0; }

  log "Cleaning up..."
  docker compose -f "$COMPOSE_FILE" down --volumes --remove-orphans
  docker image prune -f
  log "Clean complete."
}

cmd_logs() {
  SERVICE="${2:-}"
  if [ -n "$SERVICE" ]; then
    log "Tailing logs for: $SERVICE"
    docker compose -f "$COMPOSE_FILE" logs -f "$SERVICE"
  else
    log "Tailing logs for all services..."
    docker compose -f "$COMPOSE_FILE" logs -f
  fi
}

cmd_shell() {
  SERVICE="${2:-backend}"
  log "Opening shell in: $SERVICE"
  docker compose -f "$COMPOSE_FILE" exec "$SERVICE" /bin/bash \
    || docker compose -f "$COMPOSE_FILE" exec "$SERVICE" /bin/sh
}

cmd_help() {
  echo -e "\n${CYAN}docker.sh — Docker Workflow Helper${NC}\n"
  echo "  Usage: bash scripts/docker.sh <command>"
  echo ""
  printf "  ${GREEN}%-12s${NC} %s\n" "build"   "Build images"
  printf "  ${GREEN}%-12s${NC} %s\n" "run"     "Start services"
  printf "  ${GREEN}%-12s${NC} %s\n" "stop"    "Stop services"
  printf "  ${GREEN}%-12s${NC} %s\n" "clean"   "Remove all"
  printf "  ${GREEN}%-12s${NC} %s\n" "logs"    "View logs"
}

# ── Entry point ──────────────────────────────
require_docker
require_compose

COMMAND="${1:-help}"

case "$COMMAND" in
  build)   cmd_build "$@"   ;;
  run)     cmd_run "$@"     ;;
  stop)    cmd_stop "$@"    ;;
  restart) cmd_restart "$@" ;;
  push)    cmd_push "$@"    ;;
  clean)   cmd_clean "$@"   ;;
  logs)    cmd_logs "$@"    ;;
  shell)   cmd_shell "$@"   ;;
  help|*)  cmd_help         ;;
esac