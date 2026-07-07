# AIDD Control Plane MVP 057

テーマ: Run Queue Intakeでqueuedになった1件を、Codex Run Queue Status Trackerとして waiting / running / succeeded / failed / evidence_missing の実行状態に展開し、実行結果・証跡・rollback・再試行判断をReview Record / Learning Logへ戻す。

## 背景

MVP056では、Handoff Decision Ledgerでapprovedになった実行候補だけをRun Queue Intakeで検査し、危険command・浅い検証・Firefox除外・証跡不足をキュー投入前に止めた。次の不足は、キューへ入った後の実行状態が「待ち」「実行中」「成功」「失敗」「証跡不足」のどこにあるかを、検証ログと証跡要求まで含めて追えること。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log
- Run Queue Intake
- Codex Run Queue

## 受け入れ条件

- 日本語UIで empty / waiting / running / succeeded / failed / evidence_missing の6状態を表示する。
- succeededでは source_intake_id、queue_item_id、run_status、actual_results、verification_summary、browser_projects、terminal_evidence、screenshot_evidence、playwright_report、rollback_plan、review_record_output、learning_log_output、aidd_spec_connectionsを表示する。
- failedでは command失敗、Firefox未実行、doctor:aidd失敗、危険command、rollback不足、local path/private host/private network URL混入を失敗理由として表示する。
- evidence_missingでは実行結果は成功でもterminal/screenshot/Playwright report/Review Record不足を警告する。
- 純粋関数とunit testで6状態、失敗分類、sanitize判定を検証する。
- Playwright E2Eで Chromium / Firefox / WebKit の主要状態を検証する。
- `doctor:aidd` でMVP057固有token、Codex Run Queue Status Tracker、AIDD-Spec接続、3ブラウザ、画像証跡名を確認する。
