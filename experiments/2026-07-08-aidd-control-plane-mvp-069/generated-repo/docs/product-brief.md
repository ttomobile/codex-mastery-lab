# Product Brief: Codex Run Budget Shrink Planner

## 対象体験

AIDD Control Planeで、Codex Runへ渡すAI Task Packetが大きすぎる時に、今回実行する`keep_now`と次回に送る`defer_next_increment`を分ける。

## ユーザーの困りごと

AIへ渡す前のタスクが大きすぎると、検証・証跡・rollbackが薄くなる。結果として「動いたつもり」のまま記事化やpreview公開へ進んでしまう。

## ゴール

- ready / brake / stop / sanitizedをUIで確認できる。
- brake時に最小実行単位のAI Task Packetへ畳める。
- stop時に最低検証、3ブラウザ、terminal/failure screenshot、rollback不足を止める。
- AIDD-Spec v0.1のAI Task Packet / Verification Evidence / Review Record / Learning Logへ接続する。

## 非ゴール

- 実際のCodex API実行管理はしない。
- GitHub Actions artifactの自動取得はしない。
- 複数プロジェクト管理はしない。
