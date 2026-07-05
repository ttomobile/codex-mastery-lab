# AIDD Control Plane MVP 044: One-Run Execution Readiness Gate

MVP 043のReview Finding Action Queueで `execute_now` に絞った後、そのままCodexを起動すると、まだ「実行前の最終確認」が人間の暗黙知に残る。MVP 044では、Action Queueの `execute_now` itemを受け取り、1回のCodex実行を開始してよいかを判定する **One-Run Execution Readiness Gate** を作る。

## 目的

- execute_now itemだけを入力として扱う
- 実行前に command / sandbox / verification commands / evidence paths / rollback stop condition / 3ブラウザE2E / local path混入を確認する
- readyならCodex実行用の手順を表示する
- blockedなら不足理由と修正指示を日本語で表示する

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md`: AI Task Packet、Verification Evidence、Review Record、Rollback Plan
- `standards/aidd-control-plane-mvp-v0.1.md`: Review Finding Action Queueの次段としてRun Authorization / Codex Run Start Receiptへ接続

## 成果物

- `generated-repo/`: Next.js + TypeScript + Vitest + Playwright実装
- `AI_TASK_PACKET.md`: Codexへ渡す実装契約
- `CODEX_PROMPT.md`: 実際のCodex依頼文
- `artifacts/`: terminal logとスクリーンショット
