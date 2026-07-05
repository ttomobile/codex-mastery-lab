# AIDD Control Plane MVP 049: Verification Run Detail Drilldown

## 目的

Codex Run Queue の各itemを、command別の exit code、duration、artifact path、失敗分類、修正指示、必要証跡へ展開する。

AIDD Control Plane は、AIが「実行しました」と言った後に、どのcommandが成功し、どのcommandが失敗し、次に何を直すべきかを迷子にしないSaaSを目指す。今回のMVPは、Run Queueの1件を Verification Evidence / Review Finding / Learning Log へ渡せる明細にする入口である。

## AIDD-Spec 接続

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md` の `Verification Run Detail`
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log

## 成果物

- `generated-repo/`: Next.js + TypeScript の日本語UI
- `AI_TASK_PACKET.md`: Codexに渡すAI Task Packet
- `CODEX_PROMPT.md`: Codex実行プロンプト
- `artifacts/terminal/`: 独立検証ログ
- `artifacts/screenshots/`: empty / ready / failure / terminal evidence の画像

## 完了条件

- 日本語UIで empty / ready / failure を切り替えて確認できる
- ready は lint/typecheck/test/build/e2e/doctor:aidd のcommand別明細、3ブラウザ、artifact path、修正不要理由を表示する
- failure は commit SHA不足、command別detail不足、artifact path不足、失敗分類不足、修正指示不足、Firefox除外、terminal/failure screenshot不足、local path/host/private network URL混入を検出する
- lint / typecheck / test / build / 3ブラウザE2E / doctor:aidd が通る
- 記事・preview・画像証跡が残る
