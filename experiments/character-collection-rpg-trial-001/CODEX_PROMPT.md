# Codex Prompt: Character Collection RPG Trial 001

You are building a non-infringing mobile Web prototype inspired by the general interaction pattern of character-collection turn-based RPGs. Do not use any real Romancing SaGa RS, SaGa, Square Enix, or other existing IP names, logos, characters, images, copy, rates, or assets. Use original names and placeholder content only.

Read first:

- `AGENTS.md`
- `experiments/character-collection-rpg-trial-001/README.md`
- `experiments/character-collection-rpg-trial-001/AI_TASK_PACKET.md`

Create the implementation under:

```text
experiments/character-collection-rpg-trial-001/generated-repo/
```

## Product

Build `SagaForge Trial 001`, a Japanese mobile-first Next.js + TypeScript prototype that demonstrates:

- home dashboard
- character roster
- party builder
- quest selection
- simple turn-based battle state
- win/lose/reward screen
- gacha-like result screen using original terms only
- training/enhancement screen
- state/failure screen

## Required mock services

Provide mock services or a compact local mock server with endpoints equivalent to:

- `/health`
- `/state`
- `/__control/state`

The app and E2E must be able to switch at least these states:

- `success`
- `empty_roster`
- `offline`
- `timeout`
- `battle_win`
- `battle_lose`
- `party_invalid`
- `gacha_result`
- `payment_failed`

Include scripts:

```json
{
  "mock:start": "...",
  "mock:stop": "...",
  "mock:doctor": "...",
  "doctor:playwright": "...",
  "test:coverage": "..."
}
```

Prefer a practical Node fallback if Docker Compose is too heavy for Trial 001, but include docs explaining the boundary.

## Verification

Implement real tests:

- unit tests for party validity, battle state, gacha result mapping, readiness scoring
- coverage command
- Playwright E2E for happy path and at least 3 failure/state paths
- If possible, configure Chromium/Firefox/WebKit; do not remove a browser just because it is slower

## Docs

Create:

```text
docs/product-brief.md
docs/testing-contract.md
docs/score-self-review.md
docs/review-record.md
docs/learning-log.md
```

## Scripts

The following should pass if dependencies/browsers are available:

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run mock:doctor
pnpm run doctor:playwright
pnpm run test:e2e
```

## Completion

When done, summarize generated files and commands you ran. Do not claim success for commands you did not actually run.
