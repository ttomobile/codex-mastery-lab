# AIDD Control Plane MVP 022: Packet Draft Workspace

MVP 021の `Packet File Apply Planner` は、採用済みdeltaをどのファイルのどこへ反映するかを確認できるようにした。

MVP 022では、その適用計画をもとに、次回の `AI_TASK_PACKET.md` / `CODEX_PROMPT.md` / `VERIFICATION_PLAN.md` / `LEARNING_LOG.md` のドラフト本文を画面上で組み立てる `Packet Draft Workspace` を作る。実ファイルはまだ書き換えず、AIへ渡す前に「最終ドラフト」「差分サマリ」「不足・衝突・未採用delta混入」を確認する。

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
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp022
```

## 証跡

- `artifacts/terminal/*.txt`
- `artifacts/screenshots/*.png`
- `assets/aidd-control-plane-mvp022-*.png`
- `articles/2026-07-03-aidd-control-plane-mvp-022.md`
