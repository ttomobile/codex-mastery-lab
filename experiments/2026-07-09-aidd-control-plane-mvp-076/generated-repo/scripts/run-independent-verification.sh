#!/usr/bin/env bash
set -euo pipefail
mkdir -p artifacts/terminal
run_cmd() {
  local slug="$1"
  shift
  echo "===== $* =====" | tee "artifacts/terminal/${slug}.txt"
  "$@" 2>&1 | tee -a "artifacts/terminal/${slug}.txt"
  local status=${PIPESTATUS[0]}
  echo "===== exit ${status} =====" | tee -a "artifacts/terminal/${slug}.txt"
  return "${status}"
}
run_cmd pnpm-install-frozen-lockfile pnpm install --frozen-lockfile
run_cmd pnpm-run-lint pnpm run lint
run_cmd pnpm-run-typecheck pnpm run typecheck
run_cmd pnpm-run-test pnpm run test
run_cmd pnpm-run-build pnpm run build
run_cmd pnpm-run-test-e2e pnpm run test:e2e
run_cmd pnpm-run-doctor-aidd pnpm run doctor:aidd
run_cmd pnpm-run-capture-mvp076 pnpm run capture:mvp076
