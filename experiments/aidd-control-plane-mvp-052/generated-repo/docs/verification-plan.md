# Verification Plan: Codex Run Budget Gate

## コマンド

- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp052

## E2E対象

Playwrightは Chromium / Firefox / WebKit を対象にする。設定は `timeout: 120_000`, `expect: { timeout: 90_000 }`, `workers: 1` とする。

## 確認する状態

- empty: 実行候補packet未選択
- ready: go / brake / stop のうちgo、prompt previewあり
- failure: primary usage過多、secondary usage過多、max runtime不足、停止条件不足、fallback action不足、Firefox除外、local path / host / private network URL混入
