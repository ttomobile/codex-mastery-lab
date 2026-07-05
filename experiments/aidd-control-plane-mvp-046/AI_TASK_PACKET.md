# AI Task Packet: AIDD Control Plane MVP 046 Run Result Review Synthesizer

## 背景
AIDD Control Planeは「AIにコードを書かせるSaaS」ではなく、AI駆動開発に必要な説明・検証・証跡・学習の流れをそろえるSaaSである。MVP 045では検証ログをVerification Evidence Receiptとして束ねた。次は、そのReceiptからReview RecordとLearning Logへ渡せる標準化された修正材料を生成する。

## 今回作るもの
`experiments/aidd-control-plane-mvp-046/generated-repo/` のNext.jsアプリに、Run Result Review Synthesizerの画面・型・判定ロジック・テスト・E2E・capture script・doctor:aidd更新を追加する。

## UI要件
- UIコピーは日本語。
- 画面に「AIDD Control Plane MVP 046」「Run Result Review Synthesizer」を明示する。
- empty / valid / failureを切り替えられる。
- validでは次を表示する。
  - source run id
  - outcome / score / review-ready判定
  - terminal evidence / screenshot evidence
  - Chromium / Firefox / WebKit coverage
  - doctor:aidd
  - rollback condition
  - privacy / local path sanitization
  - Review Finding draft
  - AI Task Packet delta
  - Codex prompt delta
  - needed upstream info
  - standard update
  - verification command
  - Learning Log note
- failureでは不足・混入・浅い検証をblockedとして表示する。

## ロジック要件
- `src/lib/intake.ts` 等の既存libに、MVP046用の型と判定関数を追加してよい。
- valid sample / failure sample / empty sampleを定義する。
- 評価関数は、欠落項目を日本語の理由で返す。
- local path、host名、private network URLをpublic artifact riskとして検出する。

## テスト要件
- Vitestのテスト名は日本語。
- Playwright E2EはChromium / Firefox / WebKitの3ブラウザで通る想定。
- `doctor:aidd` はMVP046の必須token・capture script・E2E・標準接続を確認する。

## 証跡要件
- `scripts/capture-mvp046.mjs` を追加し、次を保存する。
  - `artifacts/screenshots/aidd-control-plane-mvp046-empty.png`
  - `artifacts/screenshots/aidd-control-plane-mvp046-valid.png`
  - `artifacts/screenshots/aidd-control-plane-mvp046-failure.png`
  - `artifacts/screenshots/aidd-control-plane-mvp046-terminal-evidence.png`

## 実行コマンド
- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
