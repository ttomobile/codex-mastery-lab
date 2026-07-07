AIDD Control Plane MVP 058「Run Result Review Synthesizer」を実装してください。

作業場所: experiments/aidd-control-plane-mvp-058/generated-repo/

前提:
- experiments/aidd-control-plane-mvp-057/generated-repo を参考にしてよい。runtime生成物（.next, node_modules, coverage, playwright-report, test-results）はコピーしない。
- Next.js + TypeScript + pnpm。UI・テスト名・サンプルデータは日本語。
- AIDD-Spec v0.1 と standards/aidd-control-plane-mvp-v0.1.md の Run Result Review Synthesizer に接続する。

実装要件:
1. empty / valid / failure / evidence_missing の4状態を切り替えられるUIを作る。
2. validでは source_run_id, outcome, score, score_reason, terminal_evidence, screenshot_evidence, browser_coverage(Chromium/Firefox/WebKit), doctor_aidd, rollback, privacy_scan, review_findings, needed_upstream_info, standard_update, ai_task_packet_delta, codex_prompt_delta, verification_command, learning_log, aidd_spec_connections を表示する。
3. failureでは command失敗、Firefox未実行、doctor:aidd失敗、危険command、rollback不足、local path/private host/private network URL混入をReview Finding形式（category/finding/severity/observed_by/ideal_state/fix_instruction/needed_upstream_info/standard_update/codex_prompt_delta/verification）で表示する。
4. evidence_missingでは成功結果でも terminal evidence / empty-valid-failure screenshot / Playwright report / Review Record出力不足を検出し、Evidence Repair Delta / Learning Logへ戻す。
5. unit test、3ブラウザPlaywright E2E、doctor:aidd、capture:mvp058を用意する。
6. capture:mvp058は empty / valid / failure / evidence_missing / terminal evidence のpngを generated-repo/artifacts/screenshots に保存する。

package scripts:
- lint, typecheck, test, test:coverage, build, test:e2e, doctor:aidd, capture:mvp058

完了後、自己申告だけでなく実ファイルが存在する状態にしてください。
