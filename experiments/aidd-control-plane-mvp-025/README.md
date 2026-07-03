# AIDD Control Plane MVP 025

## テーマ

Dogfood Packet Markdown Review。MVP 024までで安全なpatch候補とrollback証跡を見られるようになったため、今回は「新規アプリ案seed」をAI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.mdへ反映する前に、Markdown本文、差分サマリ、実行前チェック、検証コマンド、rollback条件を1画面で確認できる入口へ進める。

## AIDD-Spec接続

- standards/aidd-spec-v0.1.md: AI Task Packet / Verification Evidence / Review Record / Learning Log
- standards/aidd-control-plane-mvp-v0.1.md: Dogfood Packet Markdown ReviewをProject Intake WizardからCodex実装へ渡す直前のレビュー段として追加
- 目的: 「何を作りたいか」から、公開可能で検証可能なAI依頼Markdownへ変換する

## 実装範囲

- generated-repo/ のNext.js + TypeScriptアプリをMVP025として複製
- Dogfood App Idea Packet Seedから3ファイルのMarkdown反映前プレビューを生成
  - AI_TASK_PACKET.md
  - CODEX_PROMPT.md
  - VERIFICATION_PLAN.md
- 各ファイルにdiff summary、preflight checks、verification command、rollback conditionを表示
- copy bundleを表示し、実ファイル反映前にレビューできるようにする
- unit / e2e / doctor / captureをMVP025向けに更新

## 検証

artifacts/terminal/ に個別ログを保存する。

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp025
