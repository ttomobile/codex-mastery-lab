# AI Task Packet: AIDD Control Plane MVP 029

## 背景

MVP 028では、Diff Bundleを採用 / 却下 / 保留として判断し、理由・判断者・証跡・rollback確認をDecision Ledgerへ残した。次は、採用済みbundleだけを次回AI Task Packet / Verification Plan / Codex promptへ書き出すExportプレビューが必要である。

## 作るもの

`generated-repo/` のNext.js + TypeScriptアプリに、`Adopted Bundle Exporter` を追加する。

## UI要件

- UIコピーは日本語。
- 画面上に `Adopted Bundle Exporter` の見出しを表示する。
- empty状態: export対象の採用済みbundleがまだないこと、次にDecision Ledgerで採用判断が必要なことを表示する。
- valid状態: 採用済みbundleだけから、次回AI Task Packet Markdown、Verification Plan patch、Codex prompt patchを生成するプレビューを表示する。
- failure状態: 却下・保留・未判断bundleの混入、review evidence不足、rollback condition不足、verification command不足、local path/host混入、AIDD-Spec接続不足をReview Findingとして表示する。
- AIDD-Spec v0.1の `AI Task Packet`、`Verification Evidence`、`Review Record`、`Learning Log`、`Rollback Plan` への接続を表示する。

## データ要件

Exporterの項目:

- exportId
- sourceBundleId
- sourceDecision
- targetPacketSection
- markdownSection
- verificationPlanPatch
- codexPromptPatch
- rollbackCondition
- reviewEvidencePath
- verificationCommand
- learningLogReturn
- localLeakScanPassed
- aiddSpecConnections

## 検証要件

- unit testでvalid / empty / failure評価を確認する。
- Playwright E2Eでempty / valid / failure表示を確認する。
- `pnpm run doctor:aidd` がMVP029のUI文言、テスト、capture script、AIDD-Spec接続を確認する。
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
pnpm run capture:mvp029
```
