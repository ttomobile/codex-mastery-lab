# AIDD Control Plane MVP 051: Repair Delta Priority Decision Workspace

## 目的

MVP050で生成したEvidence Repair Deltaを、次の1インクリメントへ採用 / 保留 / 却下として判断し、採用済みdeltaだけを次回AI Task Packet / Codex promptへ進める画面を作る。

MVP050は失敗ログを修正差分へ変換した。MVP051では、その差分をそのまま全部Codexへ渡さず、優先理由、判断者、証跡、rollback、Firefoxを含む検証条件を確認してから、採用済みdeltaだけを次回packetへ進める。AIDD Control Planeを「失敗から学ぶ」だけでなく、「次に何を1つ実行するかを安全に決める」SaaSに近づける。

## AIDD-Spec 接続

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- Verification Evidence
- Review Record
- Learning Log
- AI Task Packet

## 成果物

- `generated-repo/`: Next.js + TypeScript の日本語UI
- `AI_TASK_PACKET.md`: Codexに渡すAI Task Packet
- `CODEX_PROMPT.md`: Codex実行プロンプト
- `artifacts/terminal/`: 独立検証ログ
- `artifacts/screenshots/`: empty / ready / failure / terminal evidence の画像

## 完了条件

- 日本語UIで empty / ready / failure を切り替えられる
- ready は採用 / 保留 / 却下のrepair delta decisionを表示し、採用済みdeltaだけを次回packetへ進めることを明示する
- failure は未判断、理由不足、証跡不足、rollback不足、Firefox除外、未採用delta混入、local path/host/private network URL混入を検出する
- lint / typecheck / test / build / 3ブラウザE2E / doctor:aidd が通る
- 記事・preview・画像証跡が残る
