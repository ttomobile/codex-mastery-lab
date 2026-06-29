# Codex Prompt: AIDD Control Plane MVP 003

You are building AIDD Control Plane MVP 003: Evidence Collector UI.

Read these files first:

- `AGENTS.md`
- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- `experiments/aidd-control-plane-mvp-003/AI_TASK_PACKET.md`
- `experiments/aidd-control-plane-mvp-002/generated-repo/src/lib/contracts.ts`
- `experiments/aidd-control-plane-mvp-002/generated-repo/app/page.tsx`

Create a new Next.js app under:

`experiments/aidd-control-plane-mvp-003/generated-repo/`

Build a Japanese UI for collecting Verification Evidence:

- Evidence Collector Dashboard
- Command Log Collector for lint/typecheck/test/build/e2e/doctor
- Screenshot Evidence Collector for UI screenshots and terminal evidence images
- CI and Report Links for CI run URL, Playwright report, coverage report
- Verification Evidence Preview JSON
- readiness score
- missing evidence list
- buttons:
  - サンプル証跡を入れる
  - 必須ログを消して失敗を見る
  - スクリーンショットを消して失敗を見る
  - リセット

Constraints:

- No external API calls.
- No fetch/XMLHttpRequest/WebSocket/localStorage/sessionStorage.
- Japanese visible UI copy.
- TypeScript strict enough to pass typecheck.
- Use Vitest unit tests for evidence readiness logic.
- Use Playwright Chromium E2E for sample ready, missing_logs, and missing_screenshots.
- Add `doctor:aidd` static checker.
- Save docs: product-brief, review-record, learning-log, verification-evidence.

After implementation, run and fix until these pass:

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```

Return a concise summary with changed files and real command results.
