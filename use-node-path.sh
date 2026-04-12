#!/usr/bin/env bash
set -euo pipefail

# Project-local helper to make Git Bash find node/npm on Windows.
# Usage (must be sourced):  source ./use-node-path.sh

add_path_if_dir() {
  local d="$1"
  if [[ -d "$d" ]]; then
    case ":$PATH:" in
      *":$d:"*) ;;
      *) export PATH="$d:$PATH" ;;
    esac
  fi
}

# Common Node.js locations on Windows
add_path_if_dir "/c/Program Files/nodejs"
add_path_if_dir "/c/Program Files (x86)/nodejs"

# nvm-windows typical locations (user-specific)
if [[ -n "${USERPROFILE:-}" ]]; then
  win_userprofile="$(cygpath "${USERPROFILE}" 2>/dev/null || true)"
  if [[ -n "${win_userprofile}" ]]; then
    add_path_if_dir "${win_userprofile}/AppData/Roaming/nvm"
    add_path_if_dir "${win_userprofile}/AppData/Roaming/npm"
  fi
fi

if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  echo "OK: node=$(node -v) npm=$(npm -v)"
else
  echo "ERROR: Git Bash still can't find node/npm."
  echo "Try restarting Git Bash. If it persists, make sure Node.js is installed (includes npm) and that 'Add to PATH' was enabled."
  echo "Debug:"
  command -v node >/dev/null 2>&1 || echo " - node not found in PATH"
  command -v npm >/dev/null 2>&1 || echo " - npm not found in PATH"
fi

