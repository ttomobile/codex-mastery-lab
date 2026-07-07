# Verification Plan: AIDD Control Plane MVP059

## unit test

- emptyは`decision=empty`で次インクリメント計画を生成しない。
- validは`decision=ready`で必須13項目を持つ。
- failureは`decision=blocked`でsource review不足、priority不足、3ブラウザE2E不足、terminal/failure screenshot不足、rollback不足、local path/private host/private network URL混入をReview Finding形式で返す。
- evidence_missingは証跡不足を最優先インクリメントにする。
- Codex prompt draftに`execute_now`以外が混入しない。

## Playwright E2E

Chromium / Firefox / WebKitで以下を確認する。

- emptyケース: `レビュー元がありません`と`readyになるまで次インクリメント計画は生成しません。`が見えること。
- validケース: `source_review_id`、`source_run_id`、`recommended_increment`、`priority_reason`、`target_artifacts`、`acceptance_criteria`、`verification_commands`、`required_evidence`、`codex_prompt_draft`、`rollback_condition`、`note_article_angle`、`learning_log_connection`、`aidd_spec_connections`が見えること。
- failureケース: Review Findingのcategory、finding、severity、observed_by、ideal_state、fix_instruction、ai_task_packet_delta、codex_prompt_delta、verification_commandが見えること。
- evidence_missingケース: 証跡不足の修復インクリメントと`pnpm run capture:mvp059`が見えること。

## doctor:aidd

`pnpm run doctor:aidd`で以下を確認する。

- `AIDD Control Plane MVP059`
- `Next Increment Planner`
- `AIDD-Spec v0.1`
- empty / valid / failure / evidence_missing
- ready / blocked / evidence_missing
- validの13フィールド
- Review Finding形式
- source review不足 / priority不足 / 3ブラウザE2E不足 / terminal/failure screenshot不足 / rollback不足 / local path/private host/private network URL混入
- AI Task Packet delta / Codex prompt delta / verification command
- Chromium / Firefox / WebKit
- `timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1`
- terminal evidence、screenshot evidence、rollback、AIDD-Spec接続、local path/private host/private network URL検出
- `aidd-control-plane-mvp059-empty.png`
- `aidd-control-plane-mvp059-valid.png`
- `aidd-control-plane-mvp059-failure.png`
- `aidd-control-plane-mvp059-evidence-missing.png`
- `aidd-control-plane-mvp059-terminal-evidence.png`
