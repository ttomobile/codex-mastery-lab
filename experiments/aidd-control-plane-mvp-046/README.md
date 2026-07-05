# AIDD Control Plane MVP 046

## 機能名
Run Result Review Synthesizer

## 目的
MVP 045のVerification Evidence Receipt Binderで束ねた検証結果を、Review Finding、AI Task Packet delta、Codex prompt delta、Verification command、Learning Logへ変換する。検証ログを保存して終わらせず、次の1インクリメントでAIへ戻せる修正材料にする。

## AIDD-Spec接続
- AIDD-Spec v0.1: Verification Evidence / Review Record / Learning Log / AI Task Packet / Review Process
- `standards/aidd-control-plane-mvp-v0.1.md`: Run Result Review Synthesizer

## 受け入れ条件
- empty / valid / failureの3状態を日本語UIで確認できる
- validでは source run id、outcome、score、terminal evidence、screenshot evidence、browser coverage、doctor:aidd、rollback、privacy、prompt delta、needed upstream info、standard update、codex prompt delta、verification command がそろう
- failureでは source不足、score不足、prompt delta不足、needed upstream info不足、standard update不足、verification command不足、Firefox除外、doctor:aidd不足、rollback不足、local path / host / private network URL混入を検出する
- `pnpm install --frozen-lockfile`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が通る
- empty / valid / failure / terminal evidenceのPNGを保存する
