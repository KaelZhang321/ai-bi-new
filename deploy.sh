#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${ROOT_DIR}"

COMPOSE_CMD=(docker compose)
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-80}"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

wait_for_http() {
  local name="$1"
  local url="$2"
  local attempts="${3:-30}"

  for ((i=1; i<=attempts; i++)); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      echo "${name} is healthy: ${url}"
      return 0
    fi
    sleep 2
  done

  echo "${name} health check failed: ${url}" >&2
  return 1
}

ensure_env() {
  if [[ ! -f backend/.env ]]; then
    echo "Missing backend/.env. Copy .env.example to backend/.env and fill in production values first." >&2
    exit 1
  fi
}

deploy() {
  ensure_env
  "${COMPOSE_CMD[@]}" up -d --build --remove-orphans
  "${COMPOSE_CMD[@]}" ps
  wait_for_http "Backend" "http://127.0.0.1:${BACKEND_PORT}/api/health"
  wait_for_http "Frontend" "http://127.0.0.1:${FRONTEND_PORT}/"
}

down() {
  "${COMPOSE_CMD[@]}" down
}

restart() {
  "${COMPOSE_CMD[@]}" down
  deploy
}

logs() {
  "${COMPOSE_CMD[@]}" logs -f --tail=200
}

status() {
  "${COMPOSE_CMD[@]}" ps
}

require_command docker
require_command curl

case "${1:-start}" in
  start)
    deploy
    ;;
  stop)
    down
    ;;
  restart)
    restart
    ;;
  logs)
    logs
    ;;
  status)
    status
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|logs|status}" >&2
    exit 1
    ;;
esac
