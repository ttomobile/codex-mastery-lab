# AI Task Packet: AIDD Control Plane MVP 046

## 1. Product Brief

### 機能名
Run Result Review Synthesizer

### ユーザーの悩み
Verification Evidence Receiptが揃っても、そこからReview Finding、次回AI Task Packet差分、Codex prompt差分、Learning Logへ何を戻すかが手作業だと、成功runでも学びが失われ、失敗runではblocked理由が曖昧になる。

### ゴール
Verification Evidence Receiptをsourceにして、Run Result Reviewを生成し、次回実装へ渡す差分とblocked findingを同じ画面で確認できるようにする。

### 非ゴール
- 外部CIやGitHub APIへ実接続すること
- 実ログのアップロード基盤を作ること
- 秘密情報やローカル環境名を保存すること

## 2. 主要フロー

1. empty: まだRun Result Reviewがない。Verification Evidence Receipt Binder valid後に生成することを表示する。
2. valid: Verification Evidence ReceiptからReview Finding / AI Task Packet delta / Codex prompt delta / needed upstream info / standard update / verification command / Learning Log noteを生成して表示する。
3. failure: source不足、score不足、prompt delta不足、needed upstream info不足、standard update不足、verification command不足、Firefox除外、doctor:aidd不足、rollback不足、local path / host / private network URL混入をblockedとして表示する。

## 3. UI要件

- UI文言は日本語。
- 画面に「AIDD Control Plane MVP 046」と「Run Result Review Synthesizer」を表示する。
- empty / valid / failureを切り替えられる。
- validではsource receipt、sourceRunId、outcome、score、Review Finding、AI Task Packet delta、Codex prompt delta、needed upstream info、standard update、verification command、Learning Log noteを表示する。
- failureではblocked summaryと各Review Findingのcategory / severity / observedBy / idealState / fixInstruction / neededUpstreamInfo / standardUpdate / codexPromptDelta / verificationを表示する。

## 4. データ契約

`src/lib/intake.ts` のRun Result Review SynthesizerをMVP046として拡張する。

- `RunResultReview.sourceEvidenceReceiptId`
- `createEmptyRunResultReview()`
- `createValidRunResultReview()`
- `createFailureRunResultReview()`
- `evaluateRunResultReview()`

必須検出:

- source不足
- score不足
- prompt delta不足
- needed upstream info不足
- standard update不足
- verification command不足
- Firefox除外
- doctor:aidd不足
- rollback不足
- local path / host / private network URL混入

## 5. テスト要件

- Vitestでempty / valid / failureとblocked findingを確認する。
- PlaywrightでMVP046の見出し、valid変換結果、failureのblocked表示を確認する。
- `doctor:aidd` にMVP046 UI / unit / E2E / capture / docs tokenを追加する。

## 6. 品質ゲート

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 7. 証跡要件

- `scripts/capture-mvp046.mjs` と `capture:mvp046` を追加する。
- empty / valid / failure / terminal evidenceのPNGを生成する。
- `assets/aidd-control-plane-mvp046-*.png` と `experiments/aidd-control-plane-mvp-046/artifacts/screenshots/` に保存する。
- local path、host名、private network URLを公開物へ混ぜない。
