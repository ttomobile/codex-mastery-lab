# Codex Prompt: AIDD Control Plane MVP 004

You are building AIDD Control Plane MVP 004: Project Intake Wizard.

Read these files first:

- `AGENTS.md`
- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- `experiments/aidd-control-plane-mvp-004/AI_TASK_PACKET.md`

Create a new Next.js + TypeScript app under:

`experiments/aidd-control-plane-mvp-004/generated-repo/`

Do not modify earlier MVP generated repos.

## Product goal

Make AIDD Control Plane understandable to a first-time user.

The user should be able to answer a simple wizard:

- 何を作りたいですか？
- 誰のどんな問題を解決しますか？
- 必要な機能は何ですか？
- 作らないものは何ですか？
- 外部連携はありますか？
- どんな状態を検証しますか？
- どの品質ゲートを通しますか？

Then the app generates:

- Product Brief
- AI Task Packet
- Verification Plan
- Codex Prompt
- Readiness Review

## Requirements

- Next.js + TypeScript
- pnpm
- Japanese UI copy
- Japanese test names where practical
- No external network calls
- No localStorage/sessionStorage
- No backend required
- Use deterministic local in-memory state
- Keep the important quality gates visible by default
- Use accessible labels and semantic HTML

## UI screens / sections

1. Hero / explanation
   - Explain in Japanese that this SaaS turns a rough app idea into a development brief, AI request, and verification plan.

2. Project Intake Wizard
   - App name input
   - App type select
   - Target user textarea
   - User problem textarea
   - Key features textarea, one per line
   - Non-goals textarea, one per line
   - External integrations textarea, one per line
   - State contract checkboxes: empty/loading/success/error/offline/timeout/auth/billing/media_error
   - Quality gates checkboxes: lint/typecheck/test/build/e2e/doctor:aidd/accessibility/security/performance

3. Generated Product Brief
   - Markdown preview

4. Generated AI Task Packet
   - YAML-like preview

5. Verification Plan
   - Checklist preview

6. Codex Prompt
   - Copyable prompt-style text preview

7. Readiness Review
   - status: empty/draft/ready/insufficient
   - readiness score
   - missing fields
   - recommended next questions

## Domain logic

Implement pure functions in `src/lib/intake.ts`:

- parseLines(text: string): string[]
- buildIntakeDraft(input): IntakeDraft
- evaluateReadiness(draft): ReadinessReview
- generateProductBrief(draft): string
- generateTaskPacket(draft): string
- generateVerificationPlan(draft): string
- generateCodexPrompt(draft): string

Readiness rules:

- empty: appName, targetUser, userProblem, keyFeatures all empty
- insufficient: missing required appName / appType / targetUser / userProblem / at least 2 key features / at least 2 state contract entries / lint+typecheck+test+build gates
- ready: all required fields present
- draft: partial but not empty and not ready

## Tests

Use Vitest for unit tests.

Unit tests must cover:

- empty state
- insufficient missing required fields
- ready state
- generated Product Brief includes app name, target user, non-goals
- generated Codex Prompt includes quality gates and state contract

Use Playwright for E2E.

E2E tests must cover:

- initial empty state is visible
- filling sample app reaches ready state and generated outputs appear
- removing key features produces insufficient/missing fields

## Scripts

package.json must include:

- `lint`
- `typecheck`
- `test`
- `build`
- `test:e2e`
- `doctor:aidd`

`doctor:aidd` must check:

- required files exist
- package scripts exist
- UI copy strings exist
- state contract strings exist
- no localStorage/sessionStorage/fetch/XMLHttpRequest/WebSocket in app source
- no external URLs in app source

## Docs

Create:

- `docs/product-brief.md`
- `docs/verification-plan.md`
- `docs/review-record.md`
- `docs/learning-log.md`

## Completion

Run all gates if possible, but I will independently verify after you finish.

Do not commit.
