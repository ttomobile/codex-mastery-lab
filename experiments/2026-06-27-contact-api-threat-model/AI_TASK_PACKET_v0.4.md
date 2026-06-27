# AI Task Packet v0.4: Contact API Security / Operations Contract

## Scope
- Target paths: `experiments/2026-06-27-contact-api-threat-model/fixed-api/`
- Forbidden paths: everything outside `fixed-api/`
- Dependencies policy: no npm install; use built-in Node.js modules only.

## Product intent
Create a tiny demo-ready contact form HTTP API that can be reviewed by security and operations teams, not merely a working endpoint.

## Functional requirements
- `GET /health` returns JSON health status.
- `POST /api/contact` accepts JSON: `name`, `email`, `company`, `message`.
- Validate required fields and length limits.
- Return consistent JSON success/error responses.

## Non-goals
- Do not persist submissions to disk, DB, browser storage, or external services.
- Do not send email.
- Do not add authentication or sessions.
- Do not install dependencies.

## Security Contract
- Treat `name`, `email`, `company`, `message` as user-controlled; `name`, `email`, and `message` are PII or potentially confidential.
- Require `Content-Type: application/json` for POST.
- Set a small explicit request body limit.
- Add browser-origin protection: reject disallowed `Origin` values. Use an `ALLOWED_ORIGINS` environment variable and document the default behavior for local demo.
- Add a simple CSRF demo control: require `X-CSRF-Token` to match `CSRF_TOKEN` environment variable for browser-origin POST requests. For this experiment, default both to a local demo token and document that this is not production auth.
- Add a tiny in-memory per-IP rate limit for `POST /api/contact`; return `429` when exceeded.
- Do not log raw request bodies or PII fields.

## Operations Contract
- Generate or propagate a request id for every response via `X-Request-Id`.
- Produce audit logs containing only non-PII metadata: request id, method, path, status code, and rate-limit/validation/security decision.
- Add explicit retention policy: submissions are not persisted; only current request memory is used.
- Add consistent error response contract: `{ ok: false, error: { code, message, requestId } }`.

## Data Classification
- `name`: `pii.name`
- `email`: `pii.email`
- `company`: `business.company_name`
- `message`: `pii_or_confidential.free_text`

## Quality Gate
Run and save these commands:

```bash
node --check experiments/2026-06-27-contact-api-threat-model/fixed-api/server.js
python3 experiments/2026-06-27-contact-api-threat-model/smoke_contact_api.py experiments/2026-06-27-contact-api-threat-model/fixed-api
python3 experiments/2026-06-27-contact-api-threat-model/audit_contact_api.py experiments/2026-06-27-contact-api-threat-model/fixed-api
```

## Verification Evidence
Create `SECURITY_OPERATIONS.md` inside `fixed-api/` containing:
- Data classification table
- CSRF / Origin policy
- Rate limit policy
- Audit logging policy
- Retention/no-persistence policy
- Error response contract
- Verification commands and expected results

## Prompt delta log
Previous failure: the vibe API worked, but had no CSRF/origin policy, rate limit, request id, audit log, retention evidence, data classification, or evidence file.
Added instruction: make security/operations controls and evidence first-class deliverables.
