# AI Task Packet: AIDD Control Plane MVP 060

## 1. Product Brief

AIDD Control Plane利用者が、Codex Run Queueの各itemを、コマンド別exit code、artifact path、失敗分類、修正指示、terminal/screenshot/playwright evidence、3ブラウザ結果へ分解して確認できる「Verification Run Detail」を作る。

目的は、実行結果を「成功/失敗」の一言で終わらせず、次回AI Task Packetへ戻せる細かい証跡と修理メモへ変換すること。健康診断で総合判定だけを見るのではなく、血圧・血液検査・視力のように項目別に見て、次の生活改善を1つ決める感覚に近い。

## 2. 非ゴール

- 実際にCodex CLIを起動しない。
- GitHub Actions APIや外部DBへ接続しない。
- 大規模なログ解析エンジンは作らない。fixture駆動でVerification Run Detailの形を検証する。

## 3. 主要ユーザーフロー

1. empty: source queue itemがないため、Codex Run Queueから実行itemを要求する。
2. valid: command別detailを表示し、全コマンドのexit code、duration、artifact path、3ブラウザE2E、terminal/screenshot/playwright evidence、Review Finding draft、AIDD-Spec接続を確認する。
3. failure: commit SHA不足、command別detail不足、artifact path不足、失敗分類不足、修正指示不足、Firefox除外、証跡不足、local path/private host/private network URL混入を検出する。
4. repair_needed: failed / timeout / evidence_missingのコマンドを、次回修復delta候補へ変換する。

## 4. 状態設計

- empty: `source_queue_item`不足。
- valid: command detailがready。Chromium / Firefox / WebKitがそろい、artifactと修正指示がある。
- failure: 必須detail、artifact、分類、3ブラウザ、証跡、privacy scanの不足をReview Finding形式で表示。
- repair_needed: 実行は進んだが失敗/timeout/証跡不足があり、次回AI Task Packet delta候補を表示。

## 5. 必須データ

- source_queue_item_id
- source_run_status
- commit_sha
- command_details[]
  - command
  - exit_code
  - duration_ms
  - status
  - artifact_path
  - failure_category
  - repair_instruction
- browser_coverage: Chromium / Firefox / WebKit
- terminal_evidence
- screenshot_evidence
- playwright_report
- review_finding_draft
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
- repair_needed screenshot
- terminal evidence screenshot
- terminal logs under `artifacts/terminal/`

## 8. AIDD-Spec接続

- Product Brief
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log
- Codex Run Queue
- Verification Run Detail
- AIDD Control Plane MVP標準
