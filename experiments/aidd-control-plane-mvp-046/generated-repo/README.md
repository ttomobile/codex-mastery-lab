# AIDD Control Plane MVP 046

## 機能名
Run Result Review Synthesizer

## 目的
MVP 045のVerification Evidence Receipt Binderで束ねた検証証跡をsourceにして、Run Result Reviewを生成する。validではReceiptからReview Finding / AI Task Packet delta / Codex prompt delta / needed upstream info / standard update / verification command / Learning Log noteへ変換し、failureでは次回依頼へ戻すblocked条件を明示する。

## AIDD-Spec接続
- AIDD-Spec v0.1: Verification Evidence / Review Record / Learning Log / AI Task Packet / Rollback Plan
- `standards/aidd-control-plane-mvp-v0.1.md`: Run Result Review Synthesizer

## 受け入れ条件
- UIに「AIDD Control Plane MVP 046」と「Run Result Review Synthesizer」を表示する
- empty / valid / failureを日本語UIで切り替えられる
- validではVerification Evidence ReceiptからReview Finding、AI Task Packet delta、Codex prompt delta、needed upstream info、standard update、verification command、Learning Log noteを表示する
- failureではsource不足、score不足、prompt delta不足、needed upstream info不足、standard update不足、verification command不足、Firefox除外、doctor:aidd不足、rollback不足、local path / host / private network URL混入をblockedとして表示する
- `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が通る状態を目指す
- `pnpm run capture:mvp046` でempty / valid / failure / terminal evidenceのPNGを生成できる
