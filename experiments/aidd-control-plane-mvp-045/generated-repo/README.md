# AIDD Control Plane MVP 045

## 機能名
Verification Evidence Receipt Binder

## 目的
MVP 044のOne-Run Execution Readiness Gateを通過してCodex実行を開始した後、個別の検証コマンド結果を1つのVerification Evidence Receiptとして束ねる。これにより、lint / typecheck / test / build / E2E / doctor:aiddの実行結果、terminal log、artifact path、失敗分類、修正指示、3ブラウザ、スクリーンショット証跡をReview Recordへ渡せる状態にする。

## AIDD-Spec接続
- AIDD-Spec v0.1: Verification Evidence / Review Record / Learning Log / AI Task Packet
- `standards/aidd-control-plane-mvp-v0.1.md`: Verification Evidence Receipt Binder

## 受け入れ条件
- empty / valid / failureの3状態を日本語UIで確認できる
- validではcommand別exit code、duration、terminal log、artifact path、Chromium / Firefox / WebKit、empty/valid/failure/terminal evidence screenshot、doctor:aidd、AIDD-Spec接続がそろう
- failureではsource不足、command別detail不足、exit code不足、artifact不足、失敗分類不足、修正指示不足、Firefox除外、terminal/failure screenshot不足、doctor:aidd不足、local path / host / private network URL混入を検出する
- `pnpm install --frozen-lockfile`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が通る
- empty / valid / failure / terminal evidenceのPNGを保存する
