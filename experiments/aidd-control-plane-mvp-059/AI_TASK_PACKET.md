# AI Task Packet: AIDD Control Plane MVP 059

## 1. Product Brief

AIDD Control Plane利用者が、MVP058のRun Result Review Synthesizerで作られたReview Record / Learning Logから、次に実行する1インクリメントだけを選べる「Next Increment Planner」を作る。

目的は、失敗や証跡不足を大きなTODOリストにせず、次回のAI実行へ渡せる小さな実行計画へ変換すること。旅行の持ち物リストでいえば、忘れ物を全部眺めるだけでなく「次の買い物で最初に買うもの」を1つ決め、確認方法まで書いておく状態にする。

## 2. 非ゴール

- 実際にCodex CLIを起動しない。
- GitHub Actions APIや外部DBへ接続しない。
- 複数インクリメントを同時実行する計画管理SaaSにはしない。今回は1インクリメント選定に絞る。

## 3. 主要ユーザーフロー

1. empty: source reviewがないため、Run Result Review SynthesizerからReview Recordを要求する。
2. valid: Review RecordとLearning Logから次の1インクリメントを提案し、priority reason / target artifacts / acceptance criteria / verification commands / required evidence / Codex prompt draft / rollback condition / note article angleを表示する。
3. failure: 3ブラウザE2E不足、terminal evidence不足、failure screenshot不足、rollback不足、local path/private host/private network URL混入を検出し、次回計画をblockedにする。
4. evidence_missing: 実行内容は妥当でも証跡不足なら、まず証跡修復インクリメントを提案する。

## 4. 状態設計

- empty: `source_review_id`不足。
- valid: 次の1インクリメント計画がready。Codex prompt draftにはexecute_nowの1件だけが入る。
- failure: source review不足、priority不足、3ブラウザE2E不足、terminal/failure screenshot不足、rollback不足、local path/private host/private network URL混入をReview Finding形式で表示。
- evidence_missing: terminal evidence / empty screenshot / valid screenshot / failure screenshot / Playwright reportの不足を、最優先修復計画として表示。

## 5. 必須データ

- source_review_id
- source_run_id
- recommended_increment
- priority_reason
- target_artifacts
- acceptance_criteria
- verification_commands
- required_evidence
- codex_prompt_draft
- rollback_condition
- note_article_angle
- learning_log_connection
- aidd_spec_connections
- privacy_scan
- readiness_status

## 6. 品質ゲート

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 7. Evidence要求

- initial/empty screenshot
- filled/valid screenshot
- failure screenshot
- evidence_missing screenshot
- terminal evidence screenshot
- terminal logs under `artifacts/terminal/`

## 8. AIDD-Spec接続

- Product Brief
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log
- Next Increment Planner
- AIDD Control Plane MVP標準
