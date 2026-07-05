# Verification Plan: MVP051

## Commands

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp051
```

## Browser coverage

Playwrightはchromium / firefox / webkitを対象にする。設定は `timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1` を維持する。

## Evidence

`pnpm run capture:mvp051`でempty / ready / failure / terminal evidenceのPNGを生成し、実験ディレクトリとrepo rootの`assets/`へ保存する。

- aidd-control-plane-mvp051-empty.png
- aidd-control-plane-mvp051-ready.png
- aidd-control-plane-mvp051-failure.png
- aidd-control-plane-mvp051-terminal-evidence.png
