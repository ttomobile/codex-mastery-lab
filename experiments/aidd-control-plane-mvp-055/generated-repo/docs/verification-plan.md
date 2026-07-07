# Verification Plan: AIDD Control Plane MVP055

## Unit

- emptyは`decision=empty`でHandoff Decision Ledgerを生成しない。
- approvedは`decision=approved`で必須項目を持つHandoff Decision Ledgerを生成する。
- heldは`hold_reason`、`additional_evidence_needed`、`next_review_condition`、`learning_log_return`を返す。
- blockedは未承認、理由不足、rollback不足、Chromium/Firefox/WebKit不足、evidence不足、未サニタイズのlocal path/private host/private network URLを公開前ブロックとして返す。
- `sanitizeForPublic`がlocal path、private host、private network URLを`WORKSPACE`または`HOME`へ変換する。

## E2E

PlaywrightはChromium / Firefox / WebKitを対象にする。設定は`timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1`、ローカル`retries: 1`で安定化する。

- emptyケース: Ledgerが生成されないこと。
- approvedケース: `source_handoff_receipt_id`、`decision`、`decision_owner`、`decision_reason`、`approved_execute_now`、`codex_command_draft`、`verification_commands`、`required_evidence`、`rollback_condition`、`aidd_spec_connections`が見えること。
- heldケース: `hold_reason`、`additional_evidence_needed`、`next_review_condition`、`learning_log_return`が見えること。
- blockedケース: 公開前ブロック6種類と修正指示、サニタイズ済みプレビューが見えること。

## Doctor

`pnpm run doctor:aidd`で以下を確認する。

- `AIDD Control Plane MVP055`
- `Handoff Decision Ledger`
- `AIDD-Spec接続`
- `source_handoff_receipt_id`
- `decision_owner`
- `decision_reason`
- `approved_execute_now`
- `codex_command_draft`
- `verification_commands`
- `required_evidence`
- `rollback_condition`
- `aidd_spec_connections`
- `hold_reason`
- `additional_evidence_needed`
- `next_review_condition`
- `learning_log_return`
- Chromium / Firefox / WebKit設定
- `aidd-control-plane-mvp055-empty.png`
- `aidd-control-plane-mvp055-approved.png`
- `aidd-control-plane-mvp055-held.png`
- `aidd-control-plane-mvp055-blocked.png`
- `aidd-control-plane-mvp055-terminal-evidence.png`
