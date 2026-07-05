# AIDD Control Plane MVP 052: Codex Run Budget Gate

## 目的

MVP051で採用済みRepair Deltaを次回packetへ進められるようになった。MVP052では、そのpacketをCodexへ投げる直前に、Codex実行予算・残り余力・停止条件・代替行動を確認する **Codex Run Budget Gate** を作る。

AI駆動開発では「次に直すこと」が決まっても、Codexの利用枠や長時間ループを無視すると、検証途中で止まり、証跡が欠ける。MVP052は、実行前に go / brake / stop を表示し、brake/stop時は小さな手動検証または次回cronへ回す判断を提示する。

## AIDD-Spec 接続

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log
- Maintenance Runbook

## 成果物

- `generated-repo/`: Next.js + TypeScript の日本語UI
- `AI_TASK_PACKET.md`: Codexに渡すAI Task Packet
- `CODEX_PROMPT.md`: Codex実行プロンプト
- `artifacts/terminal/`: 独立検証ログ
- `artifacts/screenshots/`: empty / ready / failure / terminal evidence の画像

## 完了条件

- 日本語UIで empty / ready / failure を切り替えられる
- ready はCodex実行が可能な状態として、予算、採用済みdelta、停止条件、検証コマンドを表示する
- failure はprimary/secondary usage過多、停止条件不足、Firefox除外、証跡不足、local path/host/private network URL混入を検出する
- lint / typecheck / test / build / 3ブラウザE2E / doctor:aidd が通る
- 記事・preview・画像証跡が残る
