# Product Brief: AIDD Control Plane MVP 022

## 体験

Packet Draft Workspaceは、採用済みdeltaの適用計画から、次回AIへ渡す `AI_TASK_PACKET.md` / `CODEX_PROMPT.md` / `VERIFICATION_PLAN.md` / `LEARNING_LOG.md` のドラフト本文を生成する画面です。

## ゴール

- 4種類の次回ファイルドラフトを表示する。
- draft body、source delta id、verification command、rollback condition、AIDD-Spec接続を確認する。
- 未採用deltaがAI依頼本文へ混入した場合にReview Findingへ変換する。

## 非ゴール

- 実ファイル自動書き換え。
- Git commit / Pull Request作成。
- 外部LLM/API実行。

## 主要ユーザーフロー

1. `draft empty` でドラフト未生成を確認する。
2. `draft valid` で4種類のドラフト本文とコピー用Codex promptを確認する。
3. `draft failure` でdraft body不足、source delta id不足、file target重複または衝突、未採用delta混入、AIDD-Spec接続不足を確認する。

## AIDD-Spec接続

AIDD-Spec v0.1 / standards/aidd-control-plane-mvp-v0.1.md / AI Task Packet / Verification Evidence / Review Record / Learning Log。
