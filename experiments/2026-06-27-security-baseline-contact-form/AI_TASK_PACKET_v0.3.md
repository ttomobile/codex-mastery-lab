# AI Task Packet v0.3: Security-Baselined Static Demo Request Form

## Scope
- Target path: `experiments/2026-06-27-security-baseline-contact-form/fixed-app/`
- Do not modify files outside `fixed-app/`.
- Do not install dependencies.
- Use only HTML, CSS, and vanilla JavaScript.

## Product intent
Create a polished B2B SaaS demo request page with a static client-side preview. The page is a local prototype, not a production lead submission endpoint.

## Functional requirements
- Include fields for name, email, company size, budget, and message.
- Show a recent submission preview after submit.
- Keep at most 3 preview submissions in memory only.
- Reset the form after preview.

## Security Contract
- Treat name, email, budget, company size, and message as user-controlled input.
- Render user-controlled values only through safe text APIs such as `textContent`; do not use `innerHTML`, `outerHTML`, or `insertAdjacentHTML` for submitted values.
- Do not use `fetch`, `XMLHttpRequest`, or `navigator.sendBeacon`; this is a static no-network demo.
- Do not use `localStorage`, `sessionStorage`, or `indexedDB`; PII must not be persisted in browser storage.
- Do not log submitted form values to console.
- Add explicit length constraints:
  - name max 80
  - email max 120
  - message max 600
- Use constrained select options for company size and budget.

## Privacy / Data Classification Contract
- Add `data-classification` attributes to PII/business-sensitive fields:
  - name: `pii.name`
  - email: `pii.email`
  - company size: `business.company_size`
  - budget: `business.budget`
  - message: `pii_or_confidential.free_text`
- Add visible helper text explaining this is a no-network preview and that data is retained in memory only until refresh.
- Add a required privacy consent checkbox named `privacyConsent` before previewing.
- Connect privacy/retention helper text via `aria-describedby` where appropriate.
- Add `data-static-demo="true"` to the form to make no-network behavior explicit for audit.

## Accessibility Contract
- Keep visible labels for all fields.
- Keep focus-visible evidence in CSS.
- Recent submissions region should use `aria-live="polite"`.

## Verification Evidence
Create `SECURITY_PRIVACY.md` inside `fixed-app/` containing:
- Data classification table.
- PII handling and retention rule.
- No-network/no-storage statement.
- Verification commands and actual results.
- Known limitations: client-side validation is not a production security boundary.

## Quality Gate
Run and report:

```bash
node --check experiments/2026-06-27-security-baseline-contact-form/fixed-app/app.js
python3 experiments/2026-06-27-security-baseline-contact-form/audit_static_security.py experiments/2026-06-27-security-baseline-contact-form/fixed-app
```

Expected: both exit 0; all static security audit checks PASS.
