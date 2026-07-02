# Codex Prompt: AIDD Control Plane MVP 020

あなたはNext.js + TypeScriptでAIDD Control Planeを実装するAIエージェントです。

`experiments/aidd-control-plane-mvp-020/generated-repo/` の既存MVP 019を拡張し、`Adopted Delta Markdown Exporter` を実装してください。

## 実装要件

- UIは日本語にしてください。
- テスト名も日本語にしてください。
- `empty` / `valid` / `failure` を切り替えられるようにしてください。
- valid状態では採用済みdeltaだけを次回AI Task Packet Markdown、Verification Plan追記、Codex prompt追記へ変換してください。
- 却下 / 保留deltaはMarkdown exportに混ぜず、Learning Log戻し対象として表示してください。
- failure状態では、Markdown section不足、verification command不足、rollback condition不足、review evidence不足、未採用delta混入をReview Findingとして表示してください。
- `src/lib/intake.ts` に純粋関数を追加し、unit testで検証してください。
- Playwright E2EでChromium / Firefox / WebKitが通るようにしてください。
- `scripts/doctor-aidd.mjs` とcapture scriptをMVP 020へ更新してください。

## 実行してほしい検証

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp020
```

## 完了条件

実装だけでなく、検証ログとスクリーンショットを残せる状態にしてください。Codexの自己申告ではなく、後続の独立検証で確認できるようにしてください。
