# AI Task Packet: AIDD Control Plane MVP 012 Mock CI Evidence Connector

## 1. Product Brief

AIDD Control Planeは、AI駆動開発で必要なProduct Brief、AI Task Packet、Verification Evidence、Review Record、Learning LogをつなぐSaaSである。MVP 012では、GitHub Actions風のCI run URLとmock CI状態から、必要な証跡の有無、失敗理由、次の修正依頼を生成するMock CI Evidence Connectorを追加する。

## 2. AIDD-Spec接続

- AIDD-Spec v0.1: AI Task Packet / Verification Evidence / Review Record / Learning Log / Test Plan
- AIDD Control Plane MVP v0.1: CI Artifact Importer / GitHub Actions Artifact Fetch Plan / Evidence Gap Repair Planner
- Conformance target: L2 Lite（ローカル実装、Unit/E2E/doctor、画像証跡あり）

## 3. 実装要求

### UI

- 日本語UIにする。
- 初期画面から「Mock CI Evidence Connector」を見えるようにする。
- CI run URL、owner/repo/run id、commit SHA、workflow、job、artifact取得結果を表示する。
- 状態切替ボタンを用意する: `空の状態`, `証跡が揃った状態`, `証跡不足`, `取得タイムアウト`。
- failureでは次を表示する。
  - 不足artifact
  - 失敗job
  - token scope不足
  - 短すぎるcommit SHA
  - Evidence Gap Repair Plannerへ渡す修正指示
  - Codex prompt delta
- timeoutでは次を表示する。
  - 何を再試行するか
  - 手動Artifact Evidence Binderへ戻すfallback
  - ユーザーが保存すべきterminal evidence

### ロジック

- `src/lib/mock-ci.ts` を追加または拡張する。
- CI run URLから owner / repo / run id を抽出する。
- mock状態から jobs API / artifacts API / logs URL / token scope / artifact一覧を作る。
- 必須artifactは `coverage`, `playwright-report`, `test-results`, `terminal-evidence`, `empty-screenshot`, `valid-screenshot`, `failure-screenshot`。
- deterministicな関数としてUnit test可能にする。

### テスト

- Unit test名は日本語にする。
- E2E test名は日本語にする。
- Chromium / Firefox / WebKitで、empty / valid / failure / timeoutを確認する。
- `doctor:aidd` はdocs、e2e、capture script、package script、MVP 012文言を確認する。

### 画像証跡

- `scripts/capture-mvp012.mjs` を追加し、次を保存する。
  - `artifacts/screenshots/aidd-control-plane-mvp012-empty.png`
  - `artifacts/screenshots/aidd-control-plane-mvp012-valid.png`
  - `artifacts/screenshots/aidd-control-plane-mvp012-failure.png`
  - `artifacts/screenshots/aidd-control-plane-mvp012-terminal-evidence.png`

## 4. 検証コマンド

個別に実行できる状態にする。

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```

## 5. 非ゴール

- 実GitHub API接続
- token保存
- artifact zip展開
- 本番DB永続化
