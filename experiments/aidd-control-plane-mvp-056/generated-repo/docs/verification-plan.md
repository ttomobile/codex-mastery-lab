# Verification Plan: AIDD Control Plane MVP056

## Unit

- emptyは`decision=empty`でRun Queue Intakeを生成しない。
- queuedは`decision=queued`で必須項目を持つRun Queue Intakeを生成する。
- rejectedはheld / blocked / unapproved decision、危険なcommand、sandbox不足、Firefox除外、浅い検証、rollback不足、未サニタイズのlocal path/private host/private network URLを拒否理由として返す。
- evidence_missingはapproved判断後のterminal evidence、empty/queued/rejected/evidence_missing screenshot、Playwright report不足と戻し先を返す。
- `sanitizeForPublic`がlocal path、private host、private network URLを`WORKSPACE`または`HOME`へ変換する。

## E2E

PlaywrightはChromium / Firefox / WebKitを対象にする。設定は`timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1`、ローカル`retries: 1`で安定化する。

- emptyケース: Run Queue Intakeが生成されないこと。
- queuedケース: `source_decision_id`、`queue_item_id`、`run_status`、`codex_command`、`sandbox_mode`、`required_verification_commands`、`browser_projects`、`required_evidence`、`rollback_plan`、`aidd_spec_connections`が見えること。
- rejectedケース: 拒否理由7種類と修正指示、サニタイズ済みプレビューが見えること。
- evidence_missingケース: 不足証跡3種類とReview Record / Learning Logへの戻し先が見えること。

## Doctor

`pnpm run doctor:aidd`で以下を確認する。

- `AIDD Control Plane MVP056`
- `Run Queue Intake`
- `Codex Run Queue`
- `AIDD-Spec接続`
- `source_decision_id`
- `queue_item_id`
- `run_status`
- `codex_command`
- `sandbox_mode`
- `required_verification_commands`
- `browser_projects`
- `required_evidence`
- `rollback_plan`
- `aidd_spec_connections`
- rejectedの拒否理由7種類
- evidence_missingのterminal evidence、4ケースscreenshot、Playwright report
- Chromium / Firefox / WebKit設定
- `aidd-control-plane-mvp056-empty.png`
- `aidd-control-plane-mvp056-queued.png`
- `aidd-control-plane-mvp056-rejected.png`
- `aidd-control-plane-mvp056-evidence-missing.png`
- `aidd-control-plane-mvp056-terminal-evidence.png`
