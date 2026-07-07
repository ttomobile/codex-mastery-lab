# Product Brief: AIDD Control Plane MVP056

## 体験

MVP055のHandoff Decision Ledgerを受け取り、次回Codex実行候補をCodex Run Queueへ入れてよいかを判断する。empty / queued / rejected / evidence_missingを切り替え、queuedのときだけRun Queue Intakeを表示する。

## 差別化したゴール

- empty / queued / rejected / evidence_missingの4ケースを日本語UIで比較できる。
- queuedでは`source_decision_id`、`queue_item_id`、`run_status`、`codex_command`、`sandbox_mode`、`required_verification_commands`、`browser_projects`、`required_evidence`、`rollback_plan`、`aidd_spec_connections`を含むRun Queue Intakeを表示する。
- rejectedではheld / blocked / unapproved decision、危険なcommand、sandbox不足、Firefox除外、浅い検証、rollback不足、未サニタイズのlocal path/private host/private network URLを拒否理由として表示する。
- evidence_missingではapproved判断はあるがterminal evidence、empty/queued/rejected/evidence_missing screenshot、Playwright reportが不足している状態を警告する。
- 各拒否理由と不足証跡に修正指示またはReview Record / Learning Logへの戻し先を出す。
- `sanitizeForPublic`でlocal path、private host、private network URLを`WORKSPACE`または`HOME`へ置換する。
- AIDD-Spec接続は、MVP055の判断、MVP056のIntake、Codex Run Queue、Spec Gateの対応関係として表示する。

## 非ゴール

- 実際のCI実行や外部サービス連携はしない。
- 実サービスの商標、ロゴ、コピーは使わない。
- AIによる自動実行までは行わず、Run Queue投入前の確認表示と検証に絞る。

## 主要ユーザーフロー

1. ユーザーがemptyケースを開き、MVP055由来の判断IDが未受信ならRun Queue Intakeが生成されないことを確認する。
2. ユーザーがqueuedケースへ切り替え、Run Queue IntakeとAIDD-Spec接続を確認する。
3. ユーザーがrejectedケースへ切り替え、拒否理由と修正指示を確認する。
4. ユーザーがevidence_missingケースへ切り替え、不足証跡とReview Record / Learning Logへの戻し先を確認する。
5. doctor:aiddと3ブラウザE2Eで、MVP056固有token、Run Queue Intake項目、sanitize、画像名を確認する。
