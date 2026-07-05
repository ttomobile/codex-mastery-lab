# AIDD Control Plane MVP 048: One-Run Execution Readiness Gate

## 目的

MVP 047 の Review Finding Action Queue で `execute_now` に絞った行動を、実際に Codex へ渡す直前の ready / blocked 判定に変換する。

AIDD Control Plane は、誰でもベストに近いAI駆動開発フローと設計ドキュメントを作れるSaaSを目指す。今回のMVPは「次に実行する1件」が本当に実行可能かを、Codex実行前に止める入口である。

## AIDD-Spec 接続

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md` の `One-Run Execution Readiness Gate`
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log

## 成果物

- `generated-repo/`: Next.js + TypeScript の日本語UI
- `AI_TASK_PACKET.md`: Codexに渡すAI Task Packet
- `CODEX_PROMPT.md`: Codex実行プロンプト
- `artifacts/terminal/`: 独立検証ログ
- `artifacts/screenshots/`: empty / ready / blocked / terminal evidence の画像

## 完了条件

- 日本語UIで empty / ready / blocked を切り替えて確認できる
- ready は execute_now の1件だけを Codex command に含める
- blocked は source不足、execute_now以外混入、危険command、sandbox不足、検証不足、Firefox除外、terminal/failure screenshot不足、rollback不足、local path/host/private network URL混入、AIDD-Spec接続不足を検出する
- lint / typecheck / test / build / 3ブラウザE2E / doctor:aidd が通る
- 記事・preview・画像証跡が残る
