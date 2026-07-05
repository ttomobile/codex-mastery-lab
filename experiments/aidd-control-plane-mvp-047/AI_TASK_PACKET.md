# AI Task Packet: AIDD Control Plane MVP 047 Review Finding Action Queue

## 背景
AIDD Control Planeは「AIにコードを書かせるSaaS」ではなく、AI駆動開発に必要な説明・検証・証跡・レビュー・学習をつなぐSaaSである。MVP 046では、Verification Evidence ReceiptからReview Finding / AI Task Packet delta / Codex prompt delta / Verification command / Learning Log noteを合成した。次は、そのReview Findingを実行キューへ分け、次の1回で何だけを実行するかを決める。

## 今回作るもの
`experiments/aidd-control-plane-mvp-047/generated-repo/` のNext.jsアプリに、Review Finding Action Queueの画面・型・判定ロジック・テスト・E2E・capture script・doctor:aidd更新を追加する。

## UI要件
- UIコピーは日本語。
- 画面に「AIDD Control Plane MVP 047」「Review Finding Action Queue」を明示する。
- empty / valid / failureを切り替えられる。
- validでは次を表示する。
  - source review id
  - queue id
  - action item
  - finding category / severity
  - lane: `execute_now` / `next_increment` / `learning_log`
  - priority reason
  - AI Task Packet patch
  - Codex prompt patch
  - verification commands
  - required evidence（terminal / empty / valid / failure screenshot / Playwright report）
  - rollback condition
  - AIDD-Spec connection
  - Codex prompt preview
- validのCodex prompt previewには`execute_now` laneのactionだけを含める。
- failureでは不足・混入・浅い検証をblockedとして表示する。

## ロジック要件
- `src/lib/intake.ts` 等の既存libに、MVP047用の型と判定関数を追加してよい。
- valid sample / failure sample / empty sampleを定義する。
- 評価関数は、欠落項目を日本語の理由で返す。
- local path、host名、private network URLをpublic artifact riskとして検出する。
- `execute_now`以外のactionがCodex prompt previewへ混入したらblockedにする。
- Firefox / WebKit / Chromiumの3ブラウザ検証をrequired evidenceに含める。

## テスト要件
- Vitestのテスト名は日本語。
- Playwright E2EはChromium / Firefox / WebKitの3ブラウザで通る想定。
- `doctor:aidd` はMVP047の必須token・capture script・E2E・標準接続を確認する。

## 証跡要件
- `scripts/capture-mvp047.mjs` を追加し、次を保存する。
  - `artifacts/screenshots/aidd-control-plane-mvp047-empty.png`
  - `artifacts/screenshots/aidd-control-plane-mvp047-valid.png`
  - `artifacts/screenshots/aidd-control-plane-mvp047-failure.png`
  - `artifacts/screenshots/aidd-control-plane-mvp047-terminal-evidence.png`

## 実行コマンド
- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
