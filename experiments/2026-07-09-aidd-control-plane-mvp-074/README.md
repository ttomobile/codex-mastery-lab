# AIDD Control Plane MVP 074: Codex Run Queue Status Tracker

MVP073のRun Queue Intakeでqueuedになった実行を、waiting / running / succeeded / failed / evidence_missingとして追跡し、Verification Evidence / Review Record / Learning Logへ戻す画面を作る。

## 接続する標準
- standards/aidd-spec-v0.1.md
- standards/aidd-control-plane-mvp-v0.1.md の Codex Run Queue Status Tracker

## 実装範囲
- generated-repo/ にNext.js + TypeScriptアプリを作る
- 日本語UI、日本語テスト名、日本語記事を前提にする
- 3ブラウザE2E、doctor:aidd、画面キャプチャを含める
