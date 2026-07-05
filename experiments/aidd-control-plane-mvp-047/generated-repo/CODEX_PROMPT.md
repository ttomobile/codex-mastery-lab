目的: experiments/aidd-control-plane-mvp-047/generated-repo に、AIDD Control Plane MVP 047「Review Finding Action Queue」を実装してください。

前提:
- 既存MVP046のRun Result Review Synthesizerを壊さず、MVP047として画面・型・判定・テスト・E2E・doctor:aidd・capture scriptを更新する。
- UI文言・テスト名・サンプルデータは日本語を基本にする。
- 既存のNext.js / TypeScript / Vitest / Playwright構成を使う。

実装したい機能:
Review Findingをsource review idとfinding listからAction Queueへ変換し、`execute_now` / `next_increment` / `learning_log`へ分ける。Codex prompt previewには`execute_now` laneのactionだけを含める。

必須状態:
1. empty
   - まだReview Finding Action Queueがないことを表示する。
2. valid
   - Review Findingを`execute_now` / `next_increment` / `learning_log`のlaneへ分ける。
   - source review id、queue id、action item、finding category、severity、lane、priority reason、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connection、Codex prompt previewを表示する。
   - Codex prompt previewに`next_increment`や`learning_log`を混入させない。
3. failure
   - source不足
   - priority reason不足
   - lane不足
   - verification command不足
   - rollback不足
   - required evidence不足
   - Firefox除外
   - terminal evidence不足
   - failure screenshot不足
   - execute_now以外のprompt混入
   - local path / host / private network URL混入
   - AIDD-Spec接続不足
   をblockedとして表示する。

実装詳細:
- `src/lib/intake.ts` のReview Finding Action Queue型、factory、evaluatorをMVP047向けに更新する。
- `app/page.tsx` に「AIDD Control Plane MVP 047」と「Review Finding Action Queue」を表示する。
- `tests/intake.test.ts` に日本語テスト名でunit testを追加・更新する。
- `e2e/intake-wizard.spec.ts` に日本語テスト名でE2Eを追加・更新する。
- `scripts/doctor-aidd.mjs` にMVP047の必須文言、capture script、Firefox、doctor:aidd、local path / host / private network URL検出を含める。
- `scripts/capture-mvp047.mjs` を追加し、empty / valid / failure / terminal evidenceのPNGを生成する。
- `package.json` に `capture:mvp047` を追加し、nameを `aidd-control-plane-mvp-047` にする。

受け入れ条件:
- `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が通る。
- empty / valid / failure / terminal evidence screenshotを生成できる。
- README.md / AI_TASK_PACKET.md / CODEX_PROMPT.md がMVP047の内容と一致する。
