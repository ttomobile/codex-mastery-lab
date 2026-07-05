# AIDD Control Plane MVP 050: Evidence Repair Delta Generator

## 目的

Verification Run Detailで見つけた失敗や証跡不足を、次回のAI Task Packet delta / Codex prompt delta / Verification Evidence条件 / Learning Logへ戻すための生成画面を作る。

MVP049ではcommand別の検証明細を可視化した。MVP050では、その明細から「次にAIへ何を頼むか」を自動で小さな修正差分にする。AIDD Control Planeを、単なる検証ダッシュボードではなく、失敗から次の上流情報を改善するSaaSに近づける。

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
- ready は failed / evidence_missing / timeout のfindingをdeltaへ変換し、優先度、修正指示、Codex prompt delta、検証command、rollback条件、Learning Logを表示する
- failure は finding不足、優先度不足、prompt delta不足、検証command不足、rollback不足、Learning Log不足、local path/host/private network URL混入を検出する
- lint / typecheck / test / build / 3ブラウザE2E / doctor:aidd が通る
- 記事・preview・画像証跡が残る
