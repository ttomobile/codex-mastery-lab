# Verification Plan: AIDD Control Plane MVP 030

## コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp030
```

## 画面証跡

- empty / initial
- filled / valid
- failure state
- terminal evidence

## 合格条件

- すべての検証コマンドがpassする。
- 3ブラウザE2Eを除外しない。
- 記事・preview・artifactに `HOME`、host名、tailnet、ローカル絶対パスが残らない。
