# Product Brief: AIDD Control Plane MVP057

## 体験

MVP056のRun Queue Intakeを受け取り、Codex実行の状態、成功時の成果、失敗理由、証跡不足を確認する。empty / waiting / running / succeeded / failed / evidence_missingを切り替え、succeededのときだけCodex Run Queue Status Trackerを表示する。

## 差別化したゴール

- 6ケースを日本語UIで比較できる。
- succeededでは`source_intake_id`、`queue_item_id`、`run_status`、`actual_results`、`verification_summary`、`browser_projects`、`terminal_evidence`、`screenshot_evidence`、`playwright_report`、`rollback_plan`、`review_record_output`、`learning_log_output`、`aidd_spec_connections`を表示する。
- failedではcommand失敗、Firefox未実行、doctor:aidd失敗、危険なcommand、rollback不足、未サニタイズのlocal path/private host/private network URLを失敗理由として表示する。
- evidence_missingでは実行結果は成功だがterminal evidence、empty/succeeded/failed/evidence_missing screenshot、Playwright report、Review Record出力が不足している状態を警告する。
- 各失敗理由と不足証跡に修正指示またはEvidence Repair Delta / Learning Logへの戻し先を出す。
- `sanitizeForPublic`でlocal path、private host、private network URLを`WORKSPACE`または`HOME`へ置換する。
- AIDD-Spec接続は、MVP056 Intake、MVP057 Status Tracker、Verification Evidence、Review Record、Learning Logの対応関係として表示する。

## 非ゴール

- 実際のCI実行や外部サービス連携はしない。
- 実サービスの商標、ロゴ、コピーは使わない。
- AIによる自動再実行までは行わず、Run Queue実行結果の確認表示と検証に絞る。

## 主要ユーザーフロー

1. ユーザーがemptyケースを開き、MVP056由来の`source_intake_id`が未受信ならStatus Trackerが生成されないことを確認する。
2. ユーザーがwaiting / runningケースへ切り替え、実行待ちと実行中の状態を確認する。
3. ユーザーがsucceededケースへ切り替え、Codex Run Queue Status TrackerとAIDD-Spec接続を確認する。
4. ユーザーがfailedケースへ切り替え、失敗理由と修正指示を確認する。
5. ユーザーがevidence_missingケースへ切り替え、不足証跡とEvidence Repair Delta / Learning Logへの戻し先を確認する。
6. doctor:aiddと3ブラウザE2Eで、MVP057固有token、Status Tracker項目、sanitize、画像名を確認する。
