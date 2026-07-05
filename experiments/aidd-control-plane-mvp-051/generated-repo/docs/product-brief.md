# Product Brief: AIDD Control Plane MVP051

Repair Delta Priority Decision Workspaceは、Evidence Repair Deltaを採用 / 保留 / 却下として判断し、採用済みdeltaだけを次回AI Task Packet / Codex promptへ進めるSaaS画面です。

## 主要体験

- empty: 判断対象がなく、次回packetへ進めないことを表示する
- ready: 採用 / 保留 / 却下を分け、execute_nowのdeltaだけをpreviewへ出す
- failure: 未判断、理由不足、証跡不足、rollback不足、Firefox除外、未採用delta混入、local path / host / private network URL混入を止める

## AIDD-Spec接続

Verification Evidence、Review Record、Learning Log、AI Task Packetをつなぎ、失敗から作った修正差分をそのまま全部Codexへ渡さないための判断記録を作る。
