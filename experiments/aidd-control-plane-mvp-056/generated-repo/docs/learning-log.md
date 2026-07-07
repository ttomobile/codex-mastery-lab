# Learning Log: MVP056

MVP055のHandoff Decision Ledgerは、次回実行へ渡す前にRun Queue投入条件を確認する必要がある。MVP056では`source_decision_id`、`queue_item_id`、`run_status`、`codex_command`、`sandbox_mode`、`required_verification_commands`、`browser_projects`、`required_evidence`、`rollback_plan`、`aidd_spec_connections`をRun Queue Intakeとしてまとめ、queuedのときだけCodex Run Queue候補に進める。

rejectedではheld / blocked / unapproved decision、危険なcommand、sandbox不足、Firefox除外、浅い検証、rollback不足、未サニタイズ情報をまとめて止める。evidence_missingではapproved判断があってもterminal evidence、empty/queued/rejected/evidence_missing screenshot、Playwright reportが欠けていればReview Record / Learning Logへ戻す。
