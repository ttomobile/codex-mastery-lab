# Product Brief: AIDD Control Plane MVP058

## 対象体験

Run Result Review Synthesizerは、Codex Run Queueの実行結果を人間が次工程へ戻せる形へ合成する。成功、失敗、証跡不足を混ぜずに、Review Finding、AI Task Packet Delta、Codex Prompt Delta、Verification command、Learning Logへ分解する。

## ゴール

- empty / valid / failure / evidence_missingの4状態を切り替えられるUIを提供する。
- validでは`source_run_id`、`outcome`、`score`、`score_reason`、`terminal_evidence`、`screenshot_evidence`、`browser_coverage`、`doctor_aidd`、`rollback`、`privacy_scan`、`review_findings`、`needed_upstream_info`、`standard_update`、`ai_task_packet_delta`、`codex_prompt_delta`、`verification_command`、`learning_log`、`aidd_spec_connections`を表示する。
- failureではcommand失敗、Firefox未実行、doctor:aidd失敗、危険command、rollback不足、local path/private host/private network URL混入をReview Finding形式で表示する。
- evidence_missingでは成功結果でもterminal evidence、empty-valid-failure screenshot、Playwright report、Review Record出力不足を検出し、Evidence Repair Delta / Learning Logへ戻す。
- AIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdのRun Result Review Synthesizerへ接続する。

## 非ゴール

- 実GitHub Actionsログの取得は扱わない。
- 実ファイルへのAI Task Packet patch適用は扱わない。
- 公開記事やCI workflowの生成はこのMVPの範囲外。

## 主要ユーザーフロー

1. ユーザーがemptyケースを見て、source_run_idがないとReview Recordを生成しないことを確認する。
2. ユーザーがvalidケースへ切り替え、Run Result Review Recordの全フィールドとAIDD-Spec接続を確認する。
3. ユーザーがfailureケースへ切り替え、失敗がcategory/finding/severity/observed_by/ideal_state/fix_instruction/needed_upstream_info/standard_update/codex_prompt_delta/verificationを持つReview Findingへ変換されることを確認する。
4. ユーザーがevidence_missingケースへ切り替え、不足証跡がEvidence Repair Delta / Learning Logへ戻ることを確認する。
5. unit test、3ブラウザPlaywright E2E、doctor:aidd、capture:mvp058で仕様token、画像名、sanitizeを検証する。
