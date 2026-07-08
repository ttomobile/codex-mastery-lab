# AIDD Control Plane MVP 066: Public Preview Smoke Verifier

MVP065のPublication Evidence QA Gateで公開前QAを行った後、公開previewページと画像が実際にHTTP経路で読めるかを確認するスモーク検査UIへ進める実験。

## 目的

記事Markdown上のリンクやローカルファイル確認だけではなく、`preview/*.html` と `preview/assets/*` が公開preview相当の経路で非ゼロbyteとして取得できることを、Verification Evidenceとして残す。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md`: Verification Evidence / Review Record / Release Checklist
- `standards/aidd-control-plane-mvp-v0.1.md`: Publication Evidence QA Gateの後段
- `standards/templates/verification-evidence-template-v0.1.md`: public preview URL / asset response / terminal evidence

## 成果物

- `generated-repo/`: Next.js + TypeScriptの日本語UI
- `AI_TASK_PACKET.md`: Codexへ渡す実装条件
- `CODEX_PROMPT.md`: 実行プロンプト
- `artifacts/terminal/`: 独立検証ログ
- `artifacts/screenshots/` と `assets/`: empty / valid / failure / terminal evidence画像
- `articles/2026-07-08-aidd-control-plane-mvp-066.md`: note向け記事
