# AIDD Control Plane MVP 065: Publication Evidence QA Gate

MVP064のRun Result Digest Publisherで作った共有ダイジェストを、note/preview公開前に画像・terminal evidence・3ブラウザ証跡・サニタイズ結果まで確認する公開前QAゲートへ進める実験。

## 目的

AI実行結果を記事化するときに、スクリーンショットのリンク切れ、terminal evidence不足、Firefox除外、ローカルパス混入、AIDD-Spec接続不足を公開前に止める。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md`: Verification Evidence / Review Record / Learning Log / Release Checklist
- `standards/aidd-control-plane-mvp-v0.1.md`: Run Result Digest Publisherの後段
- `standards/templates/verification-evidence-template-v0.1.md`: screenshot / terminal / browser coverage / public preview evidence

## 成果物

- `generated-repo/`: Next.js + TypeScriptの日本語UI
- `AI_TASK_PACKET.md`: Codexへ渡す実装条件
- `CODEX_PROMPT.md`: 実行プロンプト
- `artifacts/terminal/`: 独立検証ログ
- `artifacts/screenshots/` と `assets/`: empty / valid / failure / terminal evidence画像
- `articles/2026-07-08-aidd-control-plane-mvp-065.md`: note向け記事
