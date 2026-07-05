# AIDD Control Plane MVP 047

## 機能名
Review Finding Action Queue

## 目的
MVP 046のRun Result Review Synthesizerで作ったReview Findingを、次に実行する行動キューへ変換する。すべての指摘を一度にCodexへ渡すのではなく、`execute_now` / `next_increment` / `learning_log` に分け、今回の1インクリメントで実行するものだけをCodex prompt previewへ入れる。

## AIDD-Spec接続
- AIDD-Spec v0.1: Review Record / Learning Log / AI Task Packet / Verification Evidence / Review Process
- `standards/aidd-control-plane-mvp-v0.1.md`: Review Finding Action Queue

## 受け入れ条件
- empty / valid / failureの3状態を日本語UIで確認できる
- validでは source review id、queue id、action item、finding category、severity、lane、priority reason、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connection、Codex prompt previewを表示する
- validのCodex prompt previewには`execute_now`のactionだけを含め、`next_increment`と`learning_log`は混入させない
- failureでは source不足、priority reason不足、lane不足、verification command不足、rollback不足、required evidence不足、Firefox除外、terminal/failure screenshot不足、execute_now以外のprompt混入、local path / host / private network URL混入、AIDD-Spec接続不足をblockedとして検出する
- `pnpm install --frozen-lockfile`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が通る
- empty / valid / failure / terminal evidenceのPNGを保存する
