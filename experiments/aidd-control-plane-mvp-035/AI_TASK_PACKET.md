# AI Task Packet: AIDD Control Plane MVP 035 Verification Run Detail

## AIDD-Spec接続
- AIDD-Spec v0.1: Verification Evidence / Review Record / Learning Log
- standards/aidd-control-plane-mvp-v0.1.md: Verification Run Tracker と Codex Run Queue の間を詳細化する
- standards/templates/verification-evidence-template-v0.1.md: command log、artifact、screenshot、reportを紐づける

## 目的
Codex Run Queueのitemを、command別exit code、artifact path、失敗分類、修正指示として展開し、Run Result Reviewが粗い成功/失敗だけに依存しないようにする。

## 実装要件
1. `VerificationRunDetail` 型を追加する。
2. `createEmptyVerificationRunDetail` / `createValidVerificationRunDetail` / `createFailureVerificationRunDetail` / `evaluateVerificationRunDetail` を追加する。
3. UIに `Verification Run Detail` セクションを追加する。
4. empty / valid / failureを切り替えるボタンを追加する。
5. validでは次を表示する。
   - sourceQueueItemId
   - sourceRunStatus
   - commitSha
   - command別 status / exit code / duration / artifact path
   - browserProjects（Chromium / Firefox / WebKit）
   - terminalEvidencePath / screenshotEvidencePath / playwrightReportPath
   - Review Finding draft
   - AIDD-Spec接続
6. failureでは次を検出する。
   - source queue item不足
   - commit SHA不足
   - command別detail不足
   - artifact path不足
   - failure category不足
   - 修正指示不足
   - Firefox除外
   - terminal / screenshot / playwright evidence不足
   - local path / host / tailnet混入
   - AIDD-Spec接続不足

## 検証要件
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run mock:doctor`
- `pnpm run capture:mvp035`

## 証跡要件
- terminal logs: `experiments/aidd-control-plane-mvp-035/artifacts/aidd-control-plane-mvp-035/terminal/`
- screenshots: empty / valid / failure / terminal evidence
- article: `articles/2026-07-04-aidd-control-plane-mvp-035.md`
- previewで画像が見えること
