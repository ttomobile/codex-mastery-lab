# AIDD Control Plane MVP 024

## テーマ

Diff Bundle & Rollback Evidence Workspace。MVP 023のSafe Patch Review Workspaceで承認されたpatch候補を、まだ自動適用せず、diff bundle、before/after hash、dry-run結果、rollback evidence、rollback verified commandとして保存する直前確認へ進める。

## AIDD-Spec接続

- standards/aidd-spec-v0.1.md: Verification Evidence / Review Record / Rollback Plan / Learning Log
- standards/aidd-control-plane-mvp-v0.1.md: Safe Patch Review Workspaceの次段としてDiff Bundle & Rollback Evidence Workspaceを追加
- AI Task Packet: 日本語UI、日本語テスト名、日本語記事、pnpm/Next.js/TypeScript

## 実装範囲

- generated-repo/ にNext.js + TypeScriptアプリを実装
- empty / valid / failure stateを切替
- validでは4ファイル分のdiff bundleとrollback evidenceを表示
- failureではdry-run未成功、rollback evidence不足、危険なtarget path、ローカルパス混入をReview Findingへ変換
- unit / e2e / doctor / captureをMVP024へ更新

## 検証

artifacts/terminal/ に個別ログを保存する。

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp024
