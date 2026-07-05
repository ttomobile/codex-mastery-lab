あなたはAIDD Control PlaneのNext.js実装担当です。

`experiments/aidd-control-plane-mvp-046/generated-repo/` に、MVP 046「Run Result Review Synthesizer」を実装してください。

必須:
1. 既存MVP045を壊さず、MVP046として画面・型・判定・テスト・E2E・doctor:aidd・capture scriptを更新する。
2. UIは日本語。画面に「AIDD Control Plane MVP 046」と「Run Result Review Synthesizer」を表示する。
3. empty / valid / failure状態を切り替えられるようにする。
4. validではVerification Evidence ReceiptからReview Finding / AI Task Packet delta / Codex prompt delta / needed upstream info / standard update / verification command / Learning Log noteへ変換された結果を表示する。
5. failureではsource不足、score不足、prompt delta不足、needed upstream info不足、standard update不足、verification command不足、Firefox除外、doctor:aidd不足、rollback不足、local path / host / private network URL混入をblockedとして表示する。
6. `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が通るようにする。
7. `scripts/capture-mvp046.mjs` と `capture:mvp046` scriptを追加する。
8. README.md / AI_TASK_PACKET.md / CODEX_PROMPT.md もMVP046として整える。

実装後、自分でも主要コマンドを実行してよいが、最終検証はHermes側で独立に行うため、実行結果を誇張しないでください。
