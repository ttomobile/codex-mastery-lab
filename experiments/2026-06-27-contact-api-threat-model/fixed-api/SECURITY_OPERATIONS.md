# Contact API Security / Operations Evidence

## Data Classification

| Field | Classification | Handling |
| --- | --- | --- |
| `name` | `pii.name` | Validated in current request memory only; not logged or persisted. |
| `email` | `pii.email` | Validated in current request memory only; not logged or persisted. |
| `company` | `business.company_name` | Validated in current request memory only; not logged or persisted. |
| `message` | `pii_or_confidential.free_text` | Validated in current request memory only; not logged or persisted. |

## CSRF / Origin Policy

`POST /api/contact` requires `Content-Type: application/json`.

Browser-origin requests are accepted only when the `Origin` header exactly matches the allowlist in `ALLOWED_ORIGINS`, a comma-separated environment variable. If `ALLOWED_ORIGINS` is not set, the local demo default is:

```text
http://127.0.0.1,http://localhost
```

For browser-origin `POST` requests, `X-CSRF-Token` must match the `CSRF_TOKEN` environment variable. The local demo default is:

```text
lab-static-token
```

This static token is a demo control only. It is not production authentication and does not replace a real session-bound CSRF design.

## Rate Limit Policy

`POST /api/contact` uses a tiny in-memory per-IP rate limit:

```text
5 requests per 60 seconds
```

When the limit is exceeded, the API returns HTTP `429` with a `Retry-After` header and the standard error response contract.

## Audit Logging Policy

Each response has an `X-Request-Id` header. The server propagates a safe inbound `X-Request-Id` or generates one with `crypto.randomUUID()`.

Audit logs are JSON lines containing only non-PII metadata:

```json
{"audit":true,"requestId":"...","method":"POST","path":"/api/contact","status":202,"decision":"accepted_no_persistence"}
```

Raw request bodies and the `name`, `email`, `company`, and `message` fields are not logged.

## Retention / No Persistence Policy

Submissions are not persisted to disk, database, browser storage, queue, email, or external service. The submission payload exists only in memory for the current request and is discarded after validation and response generation. The rate limiter stores only per-IP counters in process memory.

## Error Response Contract

All API errors use this JSON shape:

```json
{
  "ok": false,
  "error": {
    "code": "machine_readable_code",
    "message": "Human-readable message.",
    "requestId": "response-request-id"
  }
}
```

Success responses use `{ "ok": true, ... }` and also include the request id.

## Verification

Expected commands:

```bash
node --check experiments/2026-06-27-contact-api-threat-model/fixed-api/server.js
python3 experiments/2026-06-27-contact-api-threat-model/smoke_contact_api.py experiments/2026-06-27-contact-api-threat-model/fixed-api
python3 experiments/2026-06-27-contact-api-threat-model/audit_contact_api.py experiments/2026-06-27-contact-api-threat-model/fixed-api
```

Expected results:

- `node --check` exits `0`.
- Smoke test exits `0`, with `GET /health` returning `200`, a valid `POST /api/contact` returning `202`, and an invalid contact returning `422`.
- Static audit exits `0` with all checks passing.
