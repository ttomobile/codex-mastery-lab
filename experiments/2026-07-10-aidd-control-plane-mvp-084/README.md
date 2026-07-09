# AIDD Control Plane MVP084: Public Preview Smoke Final Receipt

MVP083の次インクリメントとして、公開previewのHTML・画像・terminal evidence画像をHTTP経路で確認した結果を、最終レシートとして束ねる。

## 目的

AIDD Control Planeを「誰でもベストに近いAI駆動開発フローと設計ドキュメントを作れるSaaS」に近づけるため、記事公開前の最後の不安である「previewでは本当に画像と証跡が読めるのか」をUIで確認できるようにする。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
  - Verification Evidence
  - Review Record
  - Learning Log
  - AI Task Packet
- `standards/aidd-control-plane-mvp-v0.1.md`
  - Public Preview Smoke Verifier
  - Preview Smoke Receipt Binder
  - Smoke Repair Priority Gate

## 生成物

- `generated-repo/`: Next.js + TypeScript のMVP実装
- `AI_TASK_PACKET.md`: Codexへ渡すAI Task Packet
- `CODEX_PROMPT.md`: 実装用プロンプト
- `artifacts/terminal/`: 独立検証ログ
- `artifacts/screenshots/`: 記事・preview用スクリーンショット
