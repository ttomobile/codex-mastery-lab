# Experiment Plan: Accessibility Contract reverse engineering from a vibe-coded FAQ app

Date: 2026-06-27

## Theme

監査カテゴリ: Accessibility / Requirement Fit / Quality Gate Contract

雑なCodexプロンプトで小さなFAQ検索アプリを作り、アクセシビリティと仕様充足の欠陥から、AI Task Packetに事前に含めるべき Accessibility Contract と Verification Evidence を逆算する。

## Hypothesis

Codexへ「FAQ検索アプリを作って」とだけ渡すと、見た目と基本動作は作るが、以下が抜けやすい。

- フォーム/検索欄の明示ラベル
- 検索結果件数のスクリーンリーダー通知
- no results / empty query など状態設計
- キーボード操作やフォーカス可視化
- 検証コマンド/証拠の残し方

これらは、実装後に「直して」と言うのではなく、前工程の Accessibility Contract / State Design / Verification Evidence としてAI Task Packetに入れるべきである。

## Scope

- 依存追加なし。HTML/CSS/vanilla JSのみ。
- 実験ディレクトリ内に閉じる。
- ローカルファイル/軽量Python HTTP serverで確認する。
- 監査は手動HTMLレビュー + 軽量スクリプト + Node構文チェックで行う。

## Codex prompt for vibe coding

```text
In this git repo, create a tiny static FAQ search app under experiments/2026-06-27-accessibility-contract-vibe-faq/vibe-app.
Use only HTML, CSS, and vanilla JavaScript. Make it look like a polished SaaS help center.
Include at least 8 FAQ items and a search box that filters questions live.
Keep it simple. Do not install dependencies. Do not modify files outside that vibe-app directory. Then exit.
```

## Audit categories

1. Accessibility
2. Requirement Fit / state behavior
3. Build / Console / Verification Evidence

## Evidence to save

- logs/environment.txt
- logs/codex-vibe-run.log
- logs/audit-results.md
- logs/git-status-before.txt / git-status-after.txt / git-diff-after.patch
- assets/2026-06-27-accessibility-contract-reverse-chain.svg
- articles/2026-06-27-accessibility-contract-vibe-faq.md
