# Audit Results: FAQ Search Accessibility Contract

## Summary

- Experiment: `experiments/2026-06-27-accessibility-contract-vibe-faq/`
- Vibe implementation: `vibe-app/`
- Corrected implementation: `fixed-app/`
- Audit categories: Accessibility, Requirement Fit / State Behavior, Build / Console / Verification Evidence

## Commands

```bash
node --check experiments/2026-06-27-accessibility-contract-vibe-faq/vibe-app/app.js
python3 <inline static audit>
node --check experiments/2026-06-27-accessibility-contract-vibe-faq/fixed-app/app.js
python3 experiments/2026-06-27-accessibility-contract-vibe-faq/audit_static.py experiments/2026-06-27-accessibility-contract-vibe-faq/fixed-app
```

## Vibe app static audit excerpt

```text
PASS: HTML lang exists
PASS: Search input has label for faq-search
PASS: Result count live region exists
FAIL: FAQ list has explicit list semantics
FAIL: Search input declares controlled results
FAIL: No-result state is programmatically referenced by input
FAIL: Form submit is prevented in JS
FAIL: Focus visible rule exists
PASS: FAQ item count >= 8
PASS: No dependency import statements
```

## Fixed app verification excerpt

```text
PASS: HTML lang exists
PASS: Search input has visible label
PASS: Search input controls faq-list
PASS: Search input references helper text
PASS: Search input references result status
PASS: Search input references no-result status
PASS: Result count live region exists
PASS: FAQ collection uses ul/list semantics
PASS: FAQ item data count >= 8
PASS: FAQ toggles use buttons
PASS: Form submit is prevented in JS
PASS: CSS includes focus-visible rule
PASS: Decorative SVG icons are hidden
PASS: No dependency import statements
```

## Standardized findings

```yaml
- category: Accessibility
  finding: FAQ results were rendered in a generic div without list semantics.
  severity: medium
  observed_by: static HTML audit
  ideal_state: Search results are exposed as a navigable collection using ul/li or equivalent role=list/listitem semantics.
  fix_instruction: Render the FAQ collection as <ul id="faq-list"> and each FAQ as <li>; if custom roles are used, include role="list" and role="listitem".
  needed_upstream_info:
    - Accessibility Contract
    - Screen Inventory
    - Component Responsibility
  standard_update:
    document: AI Task Packet
    field: accessibility_contract.collection_semantics
  codex_prompt_delta: |
    The FAQ result collection must expose list semantics: use <ul id="faq-list"> with <li> items or equivalent ARIA roles.
  verification:
    command: python3 experiments/2026-06-27-accessibility-contract-vibe-faq/audit_static.py experiments/2026-06-27-accessibility-contract-vibe-faq/fixed-app
    expected: PASS: FAQ collection uses ul/list semantics

- category: Accessibility
  finding: The search input did not declare which result region it controls or which status text describes it.
  severity: high
  observed_by: static HTML audit
  ideal_state: Search input is programmatically connected to result list, helper text, result count, and no-result state.
  fix_instruction: Add aria-controls="faq-list" and aria-describedby="search-help result-status no-results" to the input; keep the referenced elements present in the DOM.
  needed_upstream_info:
    - Accessibility Contract
    - State Design: empty/loading/error/success
    - Copy Contract
  standard_update:
    document: AI Task Packet
    field: accessibility_contract.search_relationships
  codex_prompt_delta: |
    The search input must declare aria-controls for the results container and aria-describedby for helper, live result status, and no-result status text.
  verification:
    command: python3 experiments/2026-06-27-accessibility-contract-vibe-faq/audit_static.py experiments/2026-06-27-accessibility-contract-vibe-faq/fixed-app
    expected: PASS: Search input controls faq-list; PASS: Search input references result status

- category: Requirement Fit / State Behavior
  finding: Pressing Enter in the search form could submit the form and reload the static page.
  severity: medium
  observed_by: code review / static JS audit
  ideal_state: Live search remains in-page for keyboard users; Enter does not destroy the current filtered state.
  fix_instruction: Give the form an id and add a submit listener that calls event.preventDefault().
  needed_upstream_info:
    - User Flow Diagram
    - Keyboard Interaction Contract
    - Acceptance Criteria Matrix
  standard_update:
    document: AI Task Packet
    field: interaction_contract.form_submit_behavior
  codex_prompt_delta: |
    Pressing Enter in the search input must not reload or navigate; prevent default form submission and keep filtered state visible.
  verification:
    command: python3 experiments/2026-06-27-accessibility-contract-vibe-faq/audit_static.py experiments/2026-06-27-accessibility-contract-vibe-faq/fixed-app
    expected: PASS: Form submit is prevented in JS

- category: Build / Lint / Format / Console
  finding: The vibe prompt did not ask Codex to leave a reusable verification command or audit script.
  severity: medium
  observed_by: experiment log review
  ideal_state: Every AI-generated UI task includes executable verification evidence, even if the check is lightweight.
  fix_instruction: Add a small dependency-free static audit script and require node --check plus the audit script in the task packet.
  needed_upstream_info:
    - Quality Gate Contract
    - Verification Evidence
    - Definition of Done
  standard_update:
    document: Verification Evidence
    field: required_commands.static_ui_audit
  codex_prompt_delta: |
    After implementation, run node --check and a local static accessibility audit script; include the command output in the final report.
  verification:
    command: node --check experiments/2026-06-27-accessibility-contract-vibe-faq/fixed-app/app.js && python3 experiments/2026-06-27-accessibility-contract-vibe-faq/audit_static.py experiments/2026-06-27-accessibility-contract-vibe-faq/fixed-app
    expected: exit 0
```
