# AI Task Packet: AIDD Control Plane MVP 055

## 1. Product Brief

AIDD Control Plane利用者が、MVP054の縮小版ハンドオフレシートを見た後、次回Codex実行へ進めるか・保留するか・止めるかを判断し、その根拠をReview Record / Learning Logへ残せる「Handoff Decision Ledger」を作る。

## 2. 非ゴール

- 実際にCodex実行キューへ投入しない。
- 外部DBやGitHub APIへ接続しない。
- 認証・権限管理は実装しない。

## 3. 主要ユーザーフロー

1. empty: 判断対象のHandoff Receiptがないため、必要な入力を確認する。
2. approved: execute_nowだけを次回Codex実行へ進める判断根拠と、検証・証跡・rollback条件を確認する。
3. held: まだ実行せず、追加証跡やLearning Logへ戻す理由を確認する。
4. blocked: 未承認・理由不足・local path/private host・3ブラウザ不足・証跡不足・rollback不足を公開前ブロックとして確認する。

## 4. 状態設計

- empty: source handoff receipt不足。
- approved: 承認済み。Codex command draftとverification commandsを出す。
- held: 保留。next actionと追加証跡を出す。
- blocked: 実行禁止。修正指示を出す。

## 5. 品質ゲート

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 6. Evidence要求

- initial/empty screenshot
- filled/approved screenshot
- held screenshot
- failure/blocked screenshot
- terminal evidence screenshot
- terminal logs under `artifacts/terminal/`

## 7. AIDD-Spec接続

- Product Brief
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log
- AIDD Control Plane MVP標準
