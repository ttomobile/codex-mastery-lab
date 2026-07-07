# AI Task Packet: AIDD Control Plane MVP 057

## 1. Product Brief

AIDD Control Plane利用者が、Run Queue IntakeでqueuedになったCodex実行を、waiting / running / succeeded / failed / evidence_missing の状態として追跡できる「Codex Run Queue Status Tracker」を作る。目的は、AIの完了報告ではなく、実際の検証結果・3ブラウザ実行・証跡・rollback・Review Recordへの戻しを同じ画面で判断できること。

## 2. 非ゴール

- 実際にCodexを起動しない。
- GitHub Actions APIや外部DBへ接続しない。
- 複数プロジェクトの永続キュー管理は実装しない。

## 3. 主要ユーザーフロー

1. empty: queue itemがないため、Run Queue Intakeからqueued itemを要求する。
2. waiting: 実行待ち。required verification commandsと証跡要求を確認する。
3. running: 実行中。開始時刻、現在のcommand、rollback停止条件を確認する。
4. succeeded: lint/typecheck/test/coverage/build/e2e/doctor:aidd、Chromium / Firefox / WebKit、terminal/screenshot/playwright evidenceがそろい、Review Record / Learning Logへ渡せる。
5. failed: command失敗、Firefox未実行、doctor失敗、rollback不足、local path混入などを失敗分類として表示し、修正指示を出す。
6. evidence_missing: 実行結果は成功でも、terminal/screenshot/Playwright report/Review Record不足を警告する。

## 4. 状態設計

- empty: source_intake_id不足。
- waiting: 実行前の検証・証跡要求確認。
- running: 実行中の停止条件確認。
- succeeded: Verification EvidenceとReview Recordへ渡せる。
- failed: Review FindingとAI Task Packet deltaへ戻す。
- evidence_missing: 実行成功を完了扱いにせず証跡補修へ戻す。

## 5. 品質ゲート

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run test:coverage`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 6. Evidence要求

- initial/empty screenshot
- filled/succeeded screenshot
- failure/failed screenshot
- evidence_missing screenshot
- terminal evidence screenshot
- terminal logs under `artifacts/terminal/`

## 7. AIDD-Spec接続

- Product Brief
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log
- Run Queue Intake
- Codex Run Queue
- AIDD Control Plane MVP標準
