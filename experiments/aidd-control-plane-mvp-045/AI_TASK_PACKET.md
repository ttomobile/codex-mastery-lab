# AI Task Packet: AIDD Control Plane MVP 045

## 1. Product Brief

### 機能名
Verification Evidence Receipt Binder

### ユーザーの悩み
Codex実行を開始しても、検証コマンドの結果がバラバラのterminal logやスクリーンショットに散らばると、Review Recordへ渡す時点で「何が通り、何が失敗し、どの証跡を見ればよいか」が分からなくなる。

### ゴール
Codex Run Start Receiptに紐づく個別検証コマンド結果を1つのVerification Evidence Receiptとして束ね、レビュー可能な状態にする。

### 非ゴール
- 実際にGitHub APIや外部CIへ接続すること
- ファイルアップロード基盤を作ること
- 本番データや秘密情報を保存すること

## 2. 主要フロー

1. empty: まだReceipt Binderがない。必要入力を表示する。
2. valid: source run start receipt、command別exit code、duration、terminal log、artifact path、失敗分類、修正指示、Chromium / Firefox / WebKit、empty/valid/failure/terminal evidence screenshot、doctor:aidd、AIDD-Spec接続がそろい、review-readyとして表示する。
3. failure: source不足、command別detail不足、exit code不足、artifact不足、失敗分類不足、修正指示不足、Firefox除外、terminal/failure screenshot不足、doctor:aidd不足、local path / host / private network URL混入を検出する。

## 3. UI要件

- UI文言は日本語。
- empty / valid / failureを切り替えられる。
- validでは「Review Recordへ渡せる理由」「検証コマンド別結果」「証跡一覧」「ブラウザ範囲」「失敗時の修正指示」「AIDD-Spec接続」を見える化する。
- failureでは検出したissueと修正指示を日本語で表示する。

## 4. データ契約

`src/lib/intake.ts` へ次を追加する。

- `VerificationEvidenceReceiptBinder`
- `VerificationEvidenceReceiptReview`
- `createEmptyVerificationEvidenceReceiptBinder()`
- `createValidVerificationEvidenceReceiptBinder()`
- `createFailureVerificationEvidenceReceiptBinder()`
- `evaluateVerificationEvidenceReceiptBinder()`

必須フィールド:

- sourceRunStartReceiptId
- commandResults[]: command / exitCode / durationMs / terminalLogPath / artifactPath / failureCategory / repairInstruction
- browserProjects
- requiredScreenshots
- doctorAiddResult
- aiddSpecConnections
- reviewReadyReason
- issues

## 5. テスト要件

- Vitestでreview-ready判定とblocked判定をテストする。
- Playwrightでempty / valid / failure画面、command別exit code、Firefoxを含む3ブラウザ表示、doctor:aidd不足、local path混入検出を確認する。
- テスト名は日本語を含める。

## 6. 品質ゲート

個別に実行し、terminal logを保存する。

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 7. 証跡要件

- empty / valid / failure / terminal evidenceのPNGを生成する。
- `assets/aidd-control-plane-mvp045-*.png` と `experiments/aidd-control-plane-mvp-045/artifacts/screenshots/` に保存する。
- local path、host名、private network URLを記事・preview・terminal evidenceへ混ぜない。
