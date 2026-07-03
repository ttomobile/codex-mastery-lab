# AI Task Packet: AIDD Control Plane MVP 028

## 背景

MVP 027では、patch候補をdiff bundle / dry-run / rollback evidence / verification commandとして束ねた。次は、自動適用へ進む前に、bundleを採用・却下・保留として判断し、その理由と証跡をReview Recordへ残す必要がある。

## 作るもの

`generated-repo/` のNext.js + TypeScriptアプリに、`Diff Bundle Decision Ledger` を追加する。

## UI要件

- UIコピーは日本語。
- 画面上に `Diff Bundle Decision Ledger` の見出しを表示する。
- empty状態: まだ判断対象bundleがないこと、次に必要な入力を表示する。
- valid状態: 採用 / 却下 / 保留のサンプル判断を表示し、採用済みbundleだけが次回packetへ進むことを示す。
- failure状態: 不足や危険をReview Findingとして表示する。
- AIDD-Spec v0.1の `Review Record`、`Verification Evidence`、`Learning Log`、`Rollback Plan` への接続を表示する。

## データ要件

Decision Ledgerの項目:

- bundleId
- sourcePatchId
- targetFile
- decision: `adopted` / `rejected` / `held`
- decisionOwner
- decisionReason
- decidedAt
- reviewEvidencePath
- nextAction
- rollbackConfirmed
- verificationCommand
- localLeakScanPassed
- aiddSpecConnections

## 検証要件

- unit testでvalid / empty / failure評価を確認する。
- Playwright E2Eでempty / valid / failure表示を確認する。
- `pnpm run doctor:aidd` がMVP028のUI文言、テスト、capture script、AIDD-Spec接続を確認する。
- capture scriptで次の画像を作る。
  - empty / initial
  - filled / valid
  - failure state
  - terminal evidence

## 完了条件

次が通ること。

```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp028
```
