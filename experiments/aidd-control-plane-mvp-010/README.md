# AIDD Control Plane MVP 010: GitHub Actions Artifact Fetch Plan

MVP 009では、CI run summaryを手入力して、commit SHA / workflow / job / artifact / Playwright report URLをVerification Evidenceへ取り込むCI Artifact Importerを作った。MVP 010では、その次段として、GitHub Actionsのrun URLから「何を取得すべきか」を解析し、API連携前でも取得計画・権限不足・artifact不足をレビューできる入口を作る。

## 目的

ユーザーがGitHub Actionsのrun URLを貼るだけで、repo owner、repo name、run id、想定API endpoint、必要なartifact、token権限、次に実行する検証コマンドを同じ画面で確認できるようにする。

## 対象

- 実装先: `experiments/aidd-control-plane-mvp-010/generated-repo`
- 接続先: `standards/aidd-spec-v0.1.md`, `standards/aidd-control-plane-mvp-v0.1.md`
- UI/テスト/docs: 日本語

## MVP範囲

- GitHub Actions run URL parser
- owner/repo/run idの抽出
- artifacts API / jobs API / logs APIの取得計画表示
- required artifacts: coverage, playwright-report, test-results, terminal-evidence
- empty / valid / failure state
- failureでは壊れたURL、権限不足、artifact不足、run id不足を表示
- Review Finding / Learning Log / Next AI Task Packet Deltaへの反映
- Playwrightでempty、valid、failure、terminal evidenceをキャプチャ

## 非ゴール

- GitHub APIへの実ネットワーク接続
- GitHub tokenの保存
- artifact zipの実ダウンロード
- 本番DB永続化
