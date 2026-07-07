# AIDD Control Plane MVP055

MVP054の縮小版ハンドオフレシートの次段として、Handoff Decision Ledgerを表示する小さなNext.js + TypeScriptアプリです。empty / approved / held / blockedの4ケースを切り替え、approvedのときだけ実行承認のLedgerを表示します。

## 実行方法

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

## 検証コマンド

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp055
```

## 表示するケース

- `empty`: MVP054から`source_handoff_receipt_id`が届いていないため、Handoff Decision Ledgerを生成しない。
- `approved`: `source_handoff_receipt_id`、`decision`、`decision_owner`、`decision_reason`、`approved_execute_now`、`codex_command_draft`、`verification_commands`、`required_evidence`、`rollback_condition`、`aidd_spec_connections`を含むHandoff Decision Ledgerを表示する。
- `held`: `hold_reason`、`additional_evidence_needed`、`next_review_condition`、`learning_log_return`を表示し、承認判断を保留する。
- `blocked`: 未承認、理由不足、rollback不足、Chromium/Firefox/WebKit不足、evidence不足、未サニタイズのlocal path/private host/private network URLを公開前ブロックとして表示し、修正指示を出す。

## Capture

`pnpm run capture:mvp055`で以下を生成し、repo rootの`assets/`と実験側の`artifacts/screenshots/`へコピーします。

- `assets/aidd-control-plane-mvp055-empty.png`
- `assets/aidd-control-plane-mvp055-approved.png`
- `assets/aidd-control-plane-mvp055-held.png`
- `assets/aidd-control-plane-mvp055-blocked.png`
- `assets/aidd-control-plane-mvp055-terminal-evidence.png`
