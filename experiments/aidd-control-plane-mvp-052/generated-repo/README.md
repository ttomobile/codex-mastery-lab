# AIDD Control Plane MVP052 generated app

Codex Run Budget Gate の検証用Next.jsアプリです。

## scripts

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp052`

## 画面

- empty: 実行候補packet未選択
- ready: go判断とCodex prompt preview
- failure: 利用枠過多、停止条件不足、fallback不足、Firefox除外、local path混入
