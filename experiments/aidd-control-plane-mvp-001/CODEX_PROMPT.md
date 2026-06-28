# Codex Prompt: AIDD Control Plane MVP 001

You are building the first Next.js MVP of AIDD Control Plane.

Read these files first:

- `AGENTS.md`
- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- `experiments/aidd-control-plane-mvp-001/AI_TASK_PACKET.md`

Create the app under:

`experiments/aidd-control-plane-mvp-001/generated-repo/`

Follow the AI Task Packet exactly.

Requirements:

- Next.js App Router + TypeScript + pnpm.
- Use Japanese UI copy.
- No login, no external API, no DB, no localStorage.
- Implement these visible areas:
  - Dashboard
  - Project Brief Builder
  - AI Task Packet Builder
  - Packet Preview
  - Agent Runbook
  - Review Dashboard
  - Learning Log
- Implement empty/loading/success/error/offline/timeout states.
- Add scripts:
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `pnpm run test`
  - `pnpm run build`
  - `pnpm run test:e2e`
  - `pnpm run doctor:aidd`
- Add unit/logic tests for packet completeness and runbook generation.
- Add Playwright E2E for the primary workflow and state toggles. Chromium is enough for this L3 MVP.
- Add `docs/product-brief.md`, `docs/review-record.md`, `docs/learning-log.md`, `docs/verification-evidence.md`.
- Add `scripts/doctor-aidd.mjs` to verify required files, scripts, docs, AIDD copy, no external network APIs, no localStorage, and required UI tokens.
- Avoid committing runtime artifacts.

Do not commit.
When done, summarize created files and commands to run.
