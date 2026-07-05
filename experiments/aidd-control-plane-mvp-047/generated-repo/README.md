# AIDD Control Plane MVP 047

## 機能名
Review Finding Action Queue

## 目的
MVP 046のRun Result Review Synthesizerで作ったReview Findingを、次の実行へ渡すAction Queueへ変換する。validではReview Findingを`execute_now` / `next_increment` / `learning_log`へ分け、Codex prompt previewには`execute_now` laneだけを含める。

## AIDD-Spec接続
- AIDD-Spec v0.1: AI Task Packet / Codex Prompt / Verification Evidence / Review Record / Learning Log / Rollback Plan
- `standards/aidd-control-plane-mvp-v0.1.md`: Review Finding Action Queue

## 受け入れ条件
- UIに「AIDD Control Plane MVP 047」と「Review Finding Action Queue」を表示する
- empty / valid / failureを日本語UIで切り替えられる
- validではsource review id、queue id、action item、finding category、severity、lane、priority reason、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connection、Codex prompt previewを表示する
- Codex prompt previewには`execute_now` laneのactionだけを含め、`next_increment`や`learning_log`を混入させない
- failureではsource不足、priority reason不足、lane不足、verification command不足、rollback不足、required evidence不足、Firefox除外、terminal evidence不足、failure screenshot不足、execute_now以外のprompt混入、local path / host / private network URL混入、AIDD-Spec接続不足をblockedとして表示する
- `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が通る状態を目指す
- `pnpm run capture:mvp047` でempty / valid / failure / terminal evidenceのPNGを生成できる
