# Verification Plan: AIDD Control Plane MVP063

## 品質ゲート

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp063`

## E2E対象

- Chromium
- Firefox
- WebKit

Playwright設定では `timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1`、ローカル `retries: 1` を使う。

## UI状態

- `empty`: Run Queueが空。
- `waiting`: 実行待ち。
- `running`: 実行中で完了扱いにしない。
- `succeeded`: 成功証跡がそろっている。
- `failed`: 実行失敗をReview Findingとして出す。
- `evidence_missing`: terminal evidenceまたはscreenshot evidence不足をReview Findingとして出す。

## 必須スクリーンショット

- `aidd-control-plane-mvp063-empty.png`
- `aidd-control-plane-mvp063-waiting.png`
- `aidd-control-plane-mvp063-running.png`
- `aidd-control-plane-mvp063-succeeded.png`
- `aidd-control-plane-mvp063-failed.png`
- `aidd-control-plane-mvp063-evidence-missing.png`
