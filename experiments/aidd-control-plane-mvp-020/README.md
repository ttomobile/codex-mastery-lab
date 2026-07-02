# AIDD Control Plane MVP 020

## テーマ

MVP 019で採用 / 却下 / 保留に分けたAI Task Packet Deltaのうち、採用済みdeltaだけを次回AI Task Packet Markdown差分として書き出す「Adopted Delta Markdown Exporter」を追加する。

## 背景

MVP 019では、改善候補を採用 / 却下 / 保留に分け、判断者・理由・rollback確認をReview Recordとして残した。次の自然な詰まりは、採用判断ができても「次回Codexへ渡すAI Task Packetへ、実際にどのMarkdownが追加されるのか」が見えないこと。

AIDD Control Planeが「誰でもベストに近いAI駆動開発フローと設計ドキュメントを作れるSaaS」になるには、採用判断を人間が読めるMarkdown差分とCodex prompt追記に変換し、却下 / 保留はLearning Logへ戻す必要がある。

## 実装対象

- `generated-repo/` にMVP 019を引き継いだNext.js + TypeScriptアプリを置く。
- UIセクション: `Adopted Delta Markdown Exporter`
- 状態: `empty` / `valid` / `failure`
- validでは、採用済みdeltaだけを次回AI Task Packet Markdown、Verification Plan追記、Codex prompt追記へ変換して表示する。
- rejected / pending deltaはLearning Log戻し対象として表示し、Markdown exportから除外する。
- failureでは、採用deltaなのにMarkdown section不足、verification command不足、rollback condition不足、review evidence不足、未採用delta混入を検出する。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md` のAI Task Packet / Verification Evidence / Review Record / Learning Log / Spec Improvementに接続する。
- `standards/aidd-control-plane-mvp-v0.1.md` のDelta Decision Reviewの次段として扱う。
- 「採用済みdeltaだけが次回AI Task Packet MarkdownとCodex promptへ進む」という運用ルールを明示する。

## 検証

個別に以下を実行し、`artifacts/terminal/*.txt`へ保存する。

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp020`
