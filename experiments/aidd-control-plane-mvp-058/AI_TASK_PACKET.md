# AI Task Packet: AIDD Control Plane MVP 058

## 1. Product Brief

AIDD Control Plane利用者が、MVP057のCodex Run Queue Status Trackerで得た実行結果を、そのまま「成功/失敗」と読むのではなく、標準化された Review Finding、AI Task Packet delta、Codex prompt delta、Verification command、Learning Logへ合成できる「Run Result Review Synthesizer」を作る。

目的は、AIの実行結果を次回の改善指示へ戻すこと。家計簿でいえば、レシートを見て終わりではなく、使いすぎ・不足・次回の買い物メモまで分けて残す状態にする。

## 2. 非ゴール

- 実際にCodex CLIやGitHub Actions APIを起動しない。
- 外部DBへ保存しない。
- 採点アルゴリズムを汎用AIで自動生成しない。今回はfixture駆動の静的合成に絞る。

## 3. 主要ユーザーフロー

1. empty: source run resultがないため、Codex Run Queue Status Trackerから実行結果を要求する。
2. valid: succeeded runをReview Recordへ変換し、score根拠、Review Finding、AI Task Packet delta、Codex prompt delta、Verification command、Learning Logを確認する。
3. failure: failed runを失敗分類別のReview Findingへ変換し、修正指示と必要な上流情報を確認する。
4. evidence_missing: run自体は成功でも証跡不足のため、Evidence Repair DeltaとLearning Logへ戻す。

## 4. 状態設計

- empty: source_run_id不足。
- valid: 3ブラウザ、terminal evidence、screenshot evidence、doctor:aidd、rollbackが揃う。
- failure: command失敗、Firefox未実行、doctor:aidd失敗、危険command、rollback不足、local path/private host/private network URL混入をReview Finding化する。
- evidence_missing: 成功扱いを止め、不足証跡をAI Task Packet deltaへ戻す。

## 5. 必須データ

- source_run_id
- outcome
- score / score_reason
- terminal_evidence
- screenshot_evidence
- browser_coverage: Chromium / Firefox / WebKit
- doctor_aidd
- rollback_plan
- privacy_scan
- review_findings
- needed_upstream_info
- standard_update
- ai_task_packet_delta
- codex_prompt_delta
- verification_command
- learning_log
- aidd_spec_connections

## 6. 品質ゲート

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run test:coverage`
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
- Run Result Review Synthesizer
- AIDD Control Plane MVP標準
