# Verification Plan: AIDD Control Plane MVP075

## 品質ゲート

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run doctor:aidd`
- `pnpm run test:e2e`
- `pnpm run capture:mvp075`

## E2E対象

PlaywrightはChromium / Firefox / WebKitを対象にする。安定化設定として`timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1`、ローカル`retries: 1`を使う。

## UI状態

- `empty`: source run未選択と次の入力を表示する。
- `valid`: run outcome、score、terminal evidence、initial / filled / failure / terminal screenshot、Chromium / Firefox / WebKit coverage、console status、Review Record excerpt、Learning Log excerpt、AI Task Packet delta、Codex prompt delta、note article angle、publish readinessを表示する。
- `failure`: score根拠不足、Firefox未実行、console warn、terminal evidence不足をReview Findingで表示する。
- `blocked`: local path / private host / private network URL混入を公開前に止める。

## capture証跡

- `assets/aidd-control-plane-mvp075-empty.png`
- `assets/aidd-control-plane-mvp075-valid.png`
- `assets/aidd-control-plane-mvp075-failure.png`
- `assets/aidd-control-plane-mvp075-blocked.png`
