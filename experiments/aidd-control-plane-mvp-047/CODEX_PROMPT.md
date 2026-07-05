あなたはAIDD Control PlaneのNext.js実装担当です。

`experiments/aidd-control-plane-mvp-047/generated-repo/` に、MVP 047「Review Finding Action Queue」を実装してください。

必須:
1. 既存MVP046を壊さず、MVP047として画面・型・判定・テスト・E2E・doctor:aidd・capture scriptを更新する。
2. UIは日本語。画面に「AIDD Control Plane MVP 047」と「Review Finding Action Queue」を表示する。
3. empty / valid / failure状態を切り替えられるようにする。
4. validではReview Findingを、`execute_now` / `next_increment` / `learning_log` のlaneへ分けたAction Queueとして表示する。
5. validでは source review id、queue id、action item、finding category、severity、lane、priority reason、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connection、Codex prompt previewを表示する。
6. Codex prompt previewには`execute_now` laneのactionだけを含め、`next_increment`や`learning_log`を混入させない。
7. failureでは source不足、priority reason不足、lane不足、verification command不足、rollback不足、required evidence不足、Firefox除外、terminal/failure screenshot不足、execute_now以外のprompt混入、local path / host / private network URL混入、AIDD-Spec接続不足をblockedとして表示する。
8. `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が通るようにする。
9. `scripts/capture-mvp047.mjs` と `capture:mvp047` scriptを追加する。
10. README.md / AI_TASK_PACKET.md / CODEX_PROMPT.md もMVP047として整える。

実装後、自分でも主要コマンドを実行してよいが、最終検証はHermes側で独立に行うため、実行結果を誇張しないでください。
