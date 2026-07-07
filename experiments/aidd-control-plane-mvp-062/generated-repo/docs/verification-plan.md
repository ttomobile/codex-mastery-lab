# Verification Plan: AIDD Control Plane MVP062

## 品質ゲート

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp062`

## E2E対象

- Chromium
- Firefox
- WebKit

## UI状態

- `empty`: repair deltaなし。
- `valid`: 採用済みdeltaだけが次回packet/promptへ進む。
- `failure`: 未判断、理由不足、証跡不足、rollback不足、Firefox除外、未採用delta混入、local path / host / private network URL混入をReview Findingへ戻す。
- `decision_needed`: adopt_now / hold_next_increment / reject_to_learning_logを表示する。

## 必須スクリーンショット

- `aidd-control-plane-mvp062-empty.png`
- `aidd-control-plane-mvp062-valid.png`
- `aidd-control-plane-mvp062-failure.png`
- `aidd-control-plane-mvp062-decision-needed.png`
- `aidd-control-plane-mvp062-terminal-evidence.png`
