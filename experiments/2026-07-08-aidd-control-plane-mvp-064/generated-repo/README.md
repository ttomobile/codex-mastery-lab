# AIDD Control Plane MVP064

Run Result Digest Publisherは、MVP063のCodex Run Queue Status Trackerの後段として、実行結果、証跡、Review Record、Learning Log、次回AI Task Packet deltaを短いMarkdownダイジェストへ変換する小さなNext.js/TypeScriptアプリです。

## Commands

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp064`

## States

- `empty`: 入力待ち。
- `valid`: 共有用Markdown、次回AI Task Packet delta、Codex prompt delta、Verification Evidence checklistを表示。
- `failure`: 失敗調査中として、failure screenshotとterminal evidenceを確認。
- `blocked`: Review Findingを表示し、公開不可として扱う。
