# AI Task Packet: AIDD Control Plane MVP 054

## 1. Product Brief

AIDD Control Plane利用者が、MVP053のShrink Plannerで小さく畳まれたAI Task Packetを、次回のCodex実行へ渡す直前に確認できる「縮小版ハンドオフレシート」を作る。

## 2. 非ゴール

- 実際にGitHub Actions APIへ接続しない。
- 複数プロジェクト管理DBは作らない。
- AIエージェント実行自体は行わない。

## 3. 主要ユーザーフロー

1. empty: まだShrink Planがないため、何を用意すべきかを見る。
2. valid: 縮小後AI Task Packetが次回実行へ渡せることを確認し、コピー用Codex promptを見る。
3. blocked: local path/private host、3ブラウザ不足、rollback不足、minimum_verification不足を確認し、修正指示を見る。

## 4. 状態設計

- empty: source shrink plan不足。
- valid: execute_nowだけがpromptに入り、defer_next_incrementはLearning Logへ戻る。
- blocked: 公開前ブロックと修正指示を表示する。

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
- filled/valid screenshot
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
