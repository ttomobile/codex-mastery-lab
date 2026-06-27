# AI Task Packet v0.1: Accessible FAQ Search

## Task

Create a corrected static FAQ search app in `experiments/2026-06-27-accessibility-contract-vibe-faq/fixed-app` using only HTML, CSS, and vanilla JavaScript.

## Product intent

A polished SaaS help center FAQ search. It must support fast keyword filtering and be usable by keyboard and screen reader users.

## Functional requirements

- At least 8 FAQ items.
- Search filters live across question, answer, and tag.
- Empty query shows all FAQs.
- No-result query shows a visible no-results message.
- Pressing Enter inside the search form must not reload the page.

## Accessibility Contract

- The search input must have a visible label.
- The search input must declare `aria-controls="faq-list"`.
- The search input must declare `aria-describedby` pointing to helper text and result status/no-result status as appropriate.
- The result count must be in an `aria-live="polite"` region and include the query context when a query exists.
- FAQ collection must expose list semantics (`ul/li` or equivalent `role="list"/"listitem"`).
- FAQ toggle controls must be keyboard-operable and retain visible focus.
- CSS must include a `:focus-visible` rule for keyboard focus evidence.
- Decorative icons must be `aria-hidden="true"` and `focusable="false"`.

## Quality Gate / Verification Evidence

After implementation, run or make possible these checks:

```bash
node --check experiments/2026-06-27-accessibility-contract-vibe-faq/fixed-app/app.js
python3 experiments/2026-06-27-accessibility-contract-vibe-faq/audit_static.py experiments/2026-06-27-accessibility-contract-vibe-faq/fixed-app
```

## Constraints

- Do not install dependencies.
- Do not modify files outside `fixed-app` unless creating a tiny local audit script directly under `experiments/2026-06-27-accessibility-contract-vibe-faq/`.
- Keep the implementation small and readable.
