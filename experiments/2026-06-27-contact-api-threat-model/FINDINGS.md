# Findings: Contact API Threat Model

## Summary
- Vibe API: 9 passed / 11 failed
- Fixed API: 20 passed / 0 failed

## Finding 1
```yaml
category: Security / Vulnerability
finding: The vibe contact API accepted browser-origin JSON POSTs without any documented CSRF token or Origin allowlist policy.
severity: high
observed_by: audit_contact_api.py
ideal_state: Browser-origin POST endpoints have an explicit Origin allowlist and CSRF/session-bound protection appropriate to the app context, with local demo defaults documented.
fix_instruction: Add ALLOWED_ORIGINS-based Origin validation and require X-CSRF-Token for browser-origin POST requests. Document demo limitations.
needed_upstream_info:
  - Security Baseline
  - API Contract
  - Trusted Origin List
  - CSRF Policy
standard_update:
  document: AI Task Packet Standard
  field: api_security_contract.csrf_policy + api_security_contract.allowed_origins
codex_prompt_delta: |
  For browser-origin JSON POST endpoints, implement and document an Origin allowlist and CSRF token policy. Include verification evidence.
verification:
  command: python3 experiments/2026-06-27-contact-api-threat-model/audit_contact_api.py experiments/2026-06-27-contact-api-threat-model/fixed-api
  expected: PASS
```

## Finding 2
```yaml
category: Load / Scalability
finding: The vibe contact API had no rate limit or abuse boundary for POST /api/contact.
severity: medium
observed_by: audit_contact_api.py
ideal_state: Public write endpoints state a request-rate assumption and enforce a minimal abuse guard, even in demos.
fix_instruction: Add a small in-memory per-IP rate limit for the demo and return HTTP 429 with Retry-After when exceeded.
needed_upstream_info:
  - Load Assumption
  - Abuse Case Catalog
  - Availability Target
  - Cost Budget
standard_update:
  document: AI Task Packet Standard
  field: api_operations_contract.rate_limit_policy
codex_prompt_delta: |
  Include a rate limit policy for public write endpoints and verify 429 behavior.
verification:
  command: python3 experiments/2026-06-27-contact-api-threat-model/audit_contact_api.py experiments/2026-06-27-contact-api-threat-model/fixed-api
  expected: PASS
```

## Finding 3
```yaml
category: Operations / Maintenance
finding: The vibe API returned successful responses but left no request id, audit logging policy, retention policy, or SECURITY_OPERATIONS.md evidence file.
severity: high
observed_by: audit_contact_api.py
ideal_state: Every API task emits non-PII operational evidence: request id, structured audit metadata, retention/no-persistence policy, and an error response contract.
fix_instruction: Add X-Request-Id, non-PII audit logs, explicit retention policy, consistent error contract, and SECURITY_OPERATIONS.md.
needed_upstream_info:
  - Observability Plan
  - Maintenance Runbook
  - Data Classification
  - Verification Evidence
standard_update:
  document: AI Task Packet Standard
  field: api_operations_contract.request_id + audit_log_policy + retention_policy + error_response_contract
codex_prompt_delta: |
  Create SECURITY_OPERATIONS.md with data classification, audit logging, retention, error contract, and verification commands/results.
verification:
  command: python3 experiments/2026-06-27-contact-api-threat-model/audit_contact_api.py experiments/2026-06-27-contact-api-threat-model/fixed-api
  expected: PASS
```
