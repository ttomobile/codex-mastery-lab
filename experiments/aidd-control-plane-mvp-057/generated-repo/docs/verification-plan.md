# Verification Plan: AIDD Control Plane MVP057

## Unit

- emptyは`decision=empty`でStatus Trackerを生成しない。
- waitingは`decision=waiting`で実行待ちを返す。
- runningは`decision=running`で実行中を返す。
- succeededは`decision=succeeded`で指定項目を持つCodex Run Queue Status Trackerを生成する。
- failedはcommand失敗、Firefox未実行、doctor:aidd失敗、危険なcommand、rollback不足、未サニタイズのlocal path/private host/private network URLを失敗理由として返す。
- evidence_missingは成功後のterminal evidence、empty/succeeded/failed/evidence_missing screenshot、Playwright report、Review Record出力不足と戻し先を返す。
- `sanitizeForPublic`がlocal path、private host、private network URLを`WORKSPACE`または`HOME`へ変換する。

## E2E

PlaywrightはChromium / Firefox / WebKitを対象にする。設定は`timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1`、ローカル`retries: 1`で安定化する。

- emptyケース: Status Trackerが生成されないこと。
- succeededケース: `source_intake_id`、`queue_item_id`、`run_status`、`actual_results`、`verification_summary`、`browser_projects`、`terminal_evidence`、`screenshot_evidence`、`playwright_report`、`rollback_plan`、`review_record_output`、`learning_log_output`、`aidd_spec_connections`が見えること。
- failedケース: 失敗理由6種類と修正指示、サニタイズ済みプレビューが見えること。
- evidence_missingケース: 不足証跡4種類とEvidence Repair Delta / Learning Logへの戻し先が見えること。

## Doctor

`pnpm run doctor:aidd`で以下を確認する。

- `AIDD Control Plane MVP057`
- `Codex Run Queue Status Tracker`
- `Verification Evidence`
- `Review Record`
- `Learning Log`
- `AIDD-Spec接続`
- succeededのStatus Tracker指定項目13個
- failedの失敗理由6種類
- evidence_missingのterminal evidence、4ケースscreenshot、Playwright report、Review Record出力不足
- Chromium / Firefox / WebKit設定
- `aidd-control-plane-mvp057-empty.png`
- `aidd-control-plane-mvp057-succeeded.png`
- `aidd-control-plane-mvp057-failed.png`
- `aidd-control-plane-mvp057-evidence-missing.png`
- `aidd-control-plane-mvp057-terminal-evidence.png`
