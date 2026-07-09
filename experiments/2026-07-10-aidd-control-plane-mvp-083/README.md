# AIDD Control Plane MVP083: Smoke Repair Priority Gate

Preview Smoke / Smoke Repairで見つかった複数の修正候補を、次の1回で実行する1件に絞る優先順位ゲートの実験です。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- Verification Evidence / Review Record / Learning Log / AI Task Packet Delta

## 実装方針

- Next.js + TypeScript + pnpm
- 日本語UI / 日本語テスト名 / 日本語記事
- mock dataのみ。実サービス名、実API、実private URL、実ローカルパスは使わない
- `?state=empty|prioritized|conflict|blocked` で状態切替

## 検証

個別に以下を実行し、`artifacts/terminal/*.txt` に保存します。

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
