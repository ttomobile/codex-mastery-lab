# AI Task Packet: AIDD Control Plane MVP 013

## 1. Product Brief

AIDD Control Plane MVP 013は、MVP 012の画面内Mock CI Evidence ConnectorをUIから独立したMock CI Serviceへ切り出す。ユーザーはCI run URLを貼り、SaaSはmock serviceから取得したCI状態に基づいて、証跡が揃ったか、不足したか、タイムアウトしたか、rate limitになったかを判断する。

## 2. AIDD-Spec接続

- AIDD-Spec v0.1: Product Brief / AI Task Packet / Verification Evidence / Review Record / Learning Log
- AIDD Control Plane MVP v0.1: Evidence Collector / Artifact Evidence Binder / CI Artifact Importer / GitHub Actions Artifact Fetch Plan / Evidence Gap Repair Planner
- Conformance target: L2 Lite（ローカルmock service、品質ゲート、E2E証跡）

## 3. 主要ユーザーフロー

1. 初期画面でMock CI Service接続状態と必要artifact一覧を見る
2. mock serviceのempty状態を表示する
3. E2EまたはUI操作でvalid状態へ切り替え、coverage / playwright-report / test-results / terminal evidence / screenshotsが揃うことを見る
4. failure状態へ切り替え、不足artifact、失敗job、短すぎるcommit SHAを修正指示に変換する
5. timeout状態へ切り替え、再試行と手動Evidence Binder fallbackを見る
6. rate_limit状態へ切り替え、token scope / 待機 / CI再取得計画を次回AI Task Packet Deltaへ戻す

## 4. 受け入れ条件

- 日本語UIである
- `mocks/ci-service/server.mjs` などUIから独立したmock serviceがある
- mock serviceに `/health`, `/state`, `/__control/state` がある
- `pnpm run mock:start`, `pnpm run mock:stop`, `pnpm run mock:doctor` がある
- E2Eが `/__control/state` を使って状態を変更する
- 3ブラウザPlaywright設定を維持する
- `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd`, `pnpm run mock:doctor` が通る
- capture scriptが empty / valid / failure / terminal evidence を画像化する

## 5. 状態契約

- empty: URL未入力、必要artifact一覧を表示
- valid: 必須artifactが揃い、Review Recordがpassになる
- failure: 不足artifact、失敗job、短いcommit SHA、権限不足を表示
- timeout: jobs/artifacts取得タイムアウト、再試行とmanual binder fallbackを表示
- rate_limit: API制限、待機、token scope、次回取得計画を表示

## 6. 品質ゲート

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run mock:doctor

## 7. 証跡要件

- `artifacts/terminal/*.txt` に個別コマンドログを保存
- `artifacts/screenshots/` とrepo root `assets/` にempty/valid/failure/terminal evidence画像を保存
- 記事にスクリーンショットとterminal evidence画像を掲載
- local path、tailnet、host名、`/Users/tto` を公開記事・preview・画像に残さない
