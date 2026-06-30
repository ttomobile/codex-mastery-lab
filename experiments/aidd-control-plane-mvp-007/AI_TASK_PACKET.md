# AI Task Packet: AIDD Control Plane MVP 007

## Spec connection

- Standard: AIDD-Spec v0.1
- MVP Design: standards/aidd-control-plane-mvp-v0.1.md
- Conformance target: L2 Lite demo
- Scope: Review Record / Learning Log / Spec Improvement Proposal

## 背景

MVP 006 では Verification Run Tracker により、品質ゲートが本当に実行されたか、証跡が足りているかを画面化した。しかし、失敗ログを次の開発依頼へ戻す導線がまだ弱い。AI駆動開発では、失敗を単なる赤い表示で終わらせず、次回の依頼文・検証条件・証跡要件へ戻す必要がある。

## 実装対象

既存の `generated-repo/` を壊さず、MVP 007として Review & Learning Log Generator を追加する。

### 必須UI

- Review & Learning Log セクション
- Review Score
- Review Findings 一覧
  - category
  - severity
  - finding
  - fix instruction
  - needed upstream information
  - verification command
- Learning Log
  - what worked
  - what failed
  - spec updates needed
- Next AI Task Packet Delta
- 状態切替ボタン
  - 成功サンプルを適用
  - 失敗サンプルを適用
  - 証跡不足サンプルを適用

### 必須ロジック

- Verification Run の gate/browser/evidence 状態から Review Record を生成する。
- 成功時も「残リスク」と「次回改善案」を表示する。
- 失敗時は ready 扱いにせず、修正指示と upstream artifact を出す。
- Learning Log から Codex prompt delta を生成する。

### 日本語要件

- UI文言、テスト名、サンプルデータ、doctor:aidd のエラー文は日本語にする。
- YouTubeなど実サービス名・商標・ロゴは使わない。
- 建築/建物メタファーは使わず、レシート、チェックリスト、健康診断のような日常比喩を使う。

## 検証コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```
