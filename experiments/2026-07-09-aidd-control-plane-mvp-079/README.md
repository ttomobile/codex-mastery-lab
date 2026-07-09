# AIDD Control Plane MVP 079: Repair Action Run Queue Intake

MVP078で作ったRepair Action Planを、実Codex実行キューへ入れる前に最終確認するMVP。

## 今回の問い

Repair Action Plannerで「次の1回」が決まっても、そのまま実行キューへ入れると、next_incrementやlearning_logがpayloadへ混ざったり、Firefox確認やfailure screenshotが抜けたりする。キュー投入前の入口をSaaSに置けば、安全な1インクリメントに保てるかを検証する。

## 成果物

- `generated-repo/`: Next.js + TypeScriptのMVP実装。
- `AI_TASK_PACKET.md`: Codexへ渡す仕様。
- `CODEX_PROMPT.md`: Codex実装prompt。
- `artifacts/terminal/`: 独立検証ログ。
- `artifacts/screenshots/`, `assets/`: empty / ready / failure / blocked / terminal evidence画像。

## AIDD-Spec接続

- AIDD-Spec v0.1: AI Task Packet / Verification Evidence / Review Record / Learning Log。
- AIDD Control Plane MVP v0.1: 失敗Receiptを修正Actionに変換し、実行前にゲートで止めるSaaSフロー。
