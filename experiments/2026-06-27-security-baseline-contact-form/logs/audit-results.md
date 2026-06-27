# Audit Results: Security Baseline Contact Form

## Vibe app verification output

```text
APP: experiments/2026-06-27-security-baseline-contact-form/vibe-app
SIZES: total_static_bytes=10538 html=3471 css=4889 js=2178
PASS: Required app files exist: index.html, styles.css, app.js
PASS: Lead form exists with stable id
PASS: Email field uses type=email
PASS: Required fields are declared
FAIL: Text inputs/textarea have explicit maxlength constraints
PASS: Company size is constrained by select options
PASS: Budget is constrained by select options
FAIL: Privacy consent checkbox is required before preview
FAIL: PII fields carry data-classification markers
FAIL: Form fields reference privacy/retention help text
FAIL: Form explicitly declares static-demo/no-network behavior
PASS: User-controlled values are not rendered with HTML injection APIs
PASS: User-controlled preview is rendered with textContent or equivalent safe text API
PASS: No network submission APIs are used in the static demo
PASS: PII is not persisted to browser storage
PASS: No console logging of form/PII data
FAIL: SECURITY_PRIVACY.md evidence file exists
FAIL: Security/privacy evidence covers classification, PII, retention, no-network, verification
SUMMARY: 11 passed / 7 failed
```

## Finding 1

```yaml
category: Security / Vulnerability
finding: The form accepted user-controlled free text and displayed it safely with textContent, but the task packet did not require explicit length constraints or a documented safe rendering rule.
severity: medium
observed_by: audit_static_security.py
ideal_state: Every user-controlled field has a size limit and the rendering API for submitted values is explicitly constrained to safe text APIs.
fix_instruction: Add maxlength attributes for free-text fields and require textContent-only rendering for submitted values.
needed_upstream_info:
  - Security Baseline
  - Input Validation Contract
  - UI Component Responsibility
standard_update:
  document: AI Task Packet Standard
  field: security_contract.safe_rendering + security_contract.input_constraints
codex_prompt_delta: |
  Treat submitted values as user-controlled. Render them only with textContent. Do not use innerHTML/outerHTML/insertAdjacentHTML for submitted values. Add max length constraints for name/email/message.
verification:
  command: python3 experiments/2026-06-27-security-baseline-contact-form/audit_static_security.py experiments/2026-06-27-security-baseline-contact-form/fixed-app
  expected: PASS
```

## Finding 2

```yaml
category: Privacy / Data Classification
finding: The vibe app collected name, email, budget, company size, and free-text message without a machine-readable data classification or consent/retention contract.
severity: high
observed_by: audit_static_security.py
ideal_state: PII and business-sensitive fields are classified in the DOM and in evidence, and the user sees retention/no-network behavior before preview.
fix_instruction: Add data-classification attributes, privacy/retention helper text, and a required privacy consent checkbox.
needed_upstream_info:
  - Privacy/Data Classification
  - Consent Policy
  - Retention Policy
standard_update:
  document: AI Task Packet Standard
  field: privacy_contract.data_classification + privacy_contract.retention + privacy_contract.consent
codex_prompt_delta: |
  Add data-classification markers to PII/business-sensitive fields. Explain that this static demo keeps data in memory only until refresh and requires privacy consent before preview.
verification:
  command: python3 experiments/2026-06-27-security-baseline-contact-form/audit_static_security.py experiments/2026-06-27-security-baseline-contact-form/fixed-app
  expected: PASS
```

## Finding 3

```yaml
category: Build / Console / Verification Evidence
finding: Codex reported node --check success, but no SECURITY_PRIVACY.md evidence file was left for downstream security/privacy review.
severity: medium
observed_by: audit_static_security.py
ideal_state: Security-sensitive UI packets leave a concise evidence file with classification, no-network/no-storage assumptions, commands run, and known limitations.
fix_instruction: Require SECURITY_PRIVACY.md in the AI Task Packet and attach the audit output to logs.
needed_upstream_info:
  - Verification Evidence
  - Definition of Done
  - Security Review Record
standard_update:
  document: AI Task Packet Standard
  field: verification_evidence.security_privacy_file
codex_prompt_delta: |
  Create SECURITY_PRIVACY.md with data classification, PII handling, retention, no-network/no-storage policy, commands run, results, and limitations.
verification:
  command: test -f experiments/2026-06-27-security-baseline-contact-form/fixed-app/SECURITY_PRIVACY.md
  expected: file exists and audit passes
```
