# AIDD Control Plane MVP065

Publication Evidence QA Gateは、公開候補ダイジェストをempty / valid / failure / blockedで判定するNext.js/TypeScriptアプリです。source digest id、article path、preview、asset copy、terminal evidence、initial/filled/failure screenshots、terminal evidence PNG、Chromium/Firefox/WebKit、console status、sanitization scan、Review Record、Learning Log、AI Task Packet delta、Codex prompt delta、publish checklistを同じ画面で確認します。

## Commands

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp065`

## States

- `empty`: 公開候補の入力待ち。
- `valid`: 公開候補ダイジェストとQA判定サマリーを表示。
- `failure`: 失敗調査中としてfailure screenshotとterminal evidenceを保存。
- `blocked`: local path / host / private network URL混入、Firefox除外、terminal evidence不足、記事観点不足、AIDD-Spec接続不足をReview Findingとして表示。
