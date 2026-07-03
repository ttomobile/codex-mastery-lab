# Verification Plan: MVP 026

## Commands

```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp026
python3 scripts/build_preview.py
```

## Evidence

- experiments/aidd-control-plane-mvp-026/artifacts/terminal/*.txt
- experiments/aidd-control-plane-mvp-026/artifacts/screenshots/*.png
- assets/aidd-control-plane-mvp026-*.png
- preview/2026-07-03-aidd-control-plane-mvp-026.html
