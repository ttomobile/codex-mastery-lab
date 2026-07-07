# AI Task Packet: AIDD Control Plane MVP 056

## 1. Product Brief

AIDD Control Plane利用者が、MVP055のHandoff Decision Ledgerでapprovedになった実行判断だけを、Codex実行待ちキューへ積む直前に検査できる「Run Queue Intake」を作る。目的は、実行してよいもの・拒否すべきもの・証跡不足のものを同じキューへ混ぜないこと。

## 2. 非ゴール

- 実際にCodexを起動しない。
- 外部DB、GitHub API、認証には接続しない。
- 複数プロジェクト管理は実装しない。

## 3. 主要ユーザーフロー

1. empty: source decision ledgerがないため、まずapproved判断を要求する。
2. queued: approvedかつ安全なcommand・sandbox・検証・rollback・3ブラウザ・証跡要件があるため、queue itemとして表示する。
3. rejected: held / blocked / unapproved、危険command、sandbox不足、浅い検証、Firefox除外、rollback不足、local path/private host/private network URL混入を拒否理由として表示する。
4. evidence_missing: 実行判断はapprovedだが、terminal / screenshot / Playwright reportなどの証跡不足を警告し、Review Record / Learning Logへ戻す。

## 4. 状態設計

- empty: source_decision_id不足。
- queued: Codex Run Queueへ積める状態。
- rejected: 実行禁止。修正指示を出す。
- evidence_missing: 実行前に証跡要求を補う必要がある状態。

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
- filled/queued screenshot
- failure/rejected screenshot
- evidence_missing screenshot
- terminal evidence screenshot
- terminal logs under `artifacts/terminal/`

## 7. AIDD-Spec接続

- Product Brief
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log
- Handoff Decision Ledger
- Codex Run Queue
- AIDD Control Plane MVP標準
