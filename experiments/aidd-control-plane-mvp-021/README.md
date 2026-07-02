# AIDD Control Plane MVP 021: Packet File Apply Planner

MVP 020の `Adopted Delta Markdown Exporter` は、採用済みdeltaだけを次回AI Task Packet向けMarkdownへ書き出した。

MVP 021では、そのMarkdownを実際の `AI_TASK_PACKET.md` / `CODEX_PROMPT.md` / `VERIFICATION_PLAN.md` / `LEARNING_LOG.md` に反映する前に、対象ファイル・追記位置・before/after差分・検証コマンド・rollback手順を確認する `Packet File Apply Planner` を作る。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- AI Task Packet / Verification Evidence / Review Record / Learning Log / Spec Improvement

## 今回の検証

```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run mock:doctor
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp021
```

## 証跡

- `artifacts/terminal/*.txt`
- `artifacts/screenshots/*.png`
- `assets/aidd-control-plane-mvp021-*.png`
- `articles/2026-07-03-aidd-control-plane-mvp-021.md`
