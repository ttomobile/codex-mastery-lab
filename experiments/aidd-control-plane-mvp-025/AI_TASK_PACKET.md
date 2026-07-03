# AI Task Packet: AIDD Control Plane MVP 025

## 目的

AIDD Control Planeを「誰でもベストに近いAI駆動開発フローと設計ドキュメントを作れるSaaS」に近づけるため、ユーザーの新規アプリ案seedを、実ファイルへ書く前のMarkdownレビュー対象に変換する。

## 背景

MVP 024では、Safe Patch Reviewで承認されたpatch候補をdiff bundle、before/after hash、dry-run結果、rollback evidenceとして確認できた。しかし、dogfoodアプリ案をAI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.mdへ落とす直前の本文確認がまだ弱い。AIにそのまま渡すと、mock service、failure state、3ブラウザE2E、公開可能境界が抜けたまま進む恐れがある。

## 機能要件

1. 日本語UIで `Dogfood Packet Markdown Review` を表示する。
2. Dogfood App Idea Packet Seedから3つのMarkdown反映前プレビューを生成する。
   - AI_TASK_PACKET.md
   - CODEX_PROMPT.md
   - VERIFICATION_PLAN.md
3. 各プレビューには以下を含める。
   - target file
   - heading
   - body preview
   - diff summary
   - preflight checks
   - verification command
   - rollback condition
4. copy bundleとして3ファイル分をまとめて表示する。
5. Review checklistで、ローカルパス、host名、プライベートネットワークURL、実在IP、浅い検証、Firefox除外を反映前に確認する。
6. `pnpm run doctor:aidd` がMVP025のUI token、unit test token、capture scriptを検査する。
7. `pnpm run capture:mvp025` でempty / valid / failure / terminal evidence画像を保存する。

## 非ゴール

- 実ファイルへの自動書き込みはしない。
- 外部GitHub APIや実CI artifact取得はしない。
- 実在サービスの商標、ロゴ、公式コピー、公式素材を使わない。

## 品質ゲート

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd

## 証跡要件

- experiments/aidd-control-plane-mvp-025/artifacts/terminal/*.txt に個別コマンドログ
- assets/ と experiments/aidd-control-plane-mvp-025/artifacts/screenshots/ に empty / valid / failure / terminal evidence画像
- articles/2026-07-03-aidd-control-plane-mvp-025.md にnote向け記事
- previewで記事と画像が表示されること
