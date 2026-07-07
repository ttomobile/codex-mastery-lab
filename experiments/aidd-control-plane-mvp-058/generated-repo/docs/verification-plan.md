# Verification Plan: AIDD Control Plane MVP058

## unit test

- emptyは`decision=empty`でRun Result Review Recordを生成しない。
- validは`decision=valid`で18個の要求フィールドを表示する。
- failureはcommand失敗、Firefox未実行、doctor:aidd失敗、危険command、rollback不足、local path/private host/private network URL混入をReview Finding形式で返す。
- evidence_missingは成功結果でもterminal evidence、empty-valid-failure screenshot、Playwright report、Review Record出力不足をEvidence Repair Delta / Learning Logへ戻す。
- sanitizeForPublicとdetectUnsafePublicTokensでlocal path/private host/private network URLを検出する。

## Playwright E2E

Chromium / Firefox / WebKitで以下を確認する。

- emptyケース: `source_run_idがありません`と`validになるまでRun Result Review Recordは生成しません。`が見えること。
- validケース: `source_run_id`、`outcome`、`score`、`score_reason`、`terminal_evidence`、`screenshot_evidence`、`browser_coverage`、`doctor_aidd`、`rollback`、`privacy_scan`、`review_findings`、`needed_upstream_info`、`standard_update`、`ai_task_packet_delta`、`codex_prompt_delta`、`verification_command`、`learning_log`、`aidd_spec_connections`が見えること。
- failureケース: Review Findingのcategory、finding、severity、observed_by、ideal_state、fix_instruction、needed_upstream_info、standard_update、codex_prompt_delta、verificationが見えること。
- evidence_missingケース: Evidence Repair DeltaとLearning Logへの戻し先が見えること。

## doctor:aidd

`pnpm run doctor:aidd`で以下を確認する。

- `AIDD Control Plane MVP058`
- `Run Result Review Synthesizer`
- `AIDD-Spec v0.1`
- `standards/aidd-control-plane-mvp-v0.1.md`
- empty / valid / failure / evidence_missing
- validの18フィールド
- Review Findingの10フィールド
- command失敗 / Firefox未実行 / doctor:aidd失敗 / 危険command / rollback不足 / local path/private host/private network URL混入
- Evidence Repair Delta / Learning Log
- Chromium / Firefox / WebKit
- `aidd-control-plane-mvp058-empty.png`
- `aidd-control-plane-mvp058-valid.png`
- `aidd-control-plane-mvp058-failure.png`
- `aidd-control-plane-mvp058-evidence-missing.png`
- `aidd-control-plane-mvp058-terminal-evidence.png`
