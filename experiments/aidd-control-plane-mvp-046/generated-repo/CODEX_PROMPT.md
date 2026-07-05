目的: experiments/aidd-control-plane-mvp-046/generated-repo に、AIDD Control Plane MVP 046「Run Result Review Synthesizer」を実装してください。

前提:
- experiments/aidd-control-plane-mvp-045/generated-repo のVerification Evidence Receipt Binderを壊さず、MVP046として追加・更新する。
- UI文言・テスト名・サンプルデータは日本語を基本にする。
- 既存のNext.js / TypeScript / Vitest / Playwright構成を使う。

実装したい機能:
Verification Evidence ReceiptからRun Result Reviewを合成し、Review Finding / AI Task Packet delta / Codex prompt delta / needed upstream info / standard update / verification command / Learning Log noteへ変換する。

必須状態:
1. empty
   - まだRun Result Reviewがないことを表示する。
2. valid
   - Verification Evidence Receiptをsourceにする。
   - Review Finding、AI Task Packet delta、Codex prompt delta、needed upstream info、standard update、verification command、Learning Log noteを表示する。
   - `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` をverification commandとして保持する。
3. failure
   - source不足
   - score不足
   - prompt delta不足
   - needed upstream info不足
   - standard update不足
   - verification command不足
   - Firefox除外
   - doctor:aidd不足
   - rollback不足
   - local path / host / private network URL混入
   をblockedとして表示する。

実装詳細:
- `src/lib/intake.ts` のRun Result Review型、factory、evaluatorをMVP046向けに更新する。
- `app/page.tsx` に「AIDD Control Plane MVP 046」と「Run Result Review Synthesizer」を表示する。
- `tests/intake.test.ts` に日本語テスト名でunit testを追加・更新する。
- `e2e/intake-wizard.spec.ts` に日本語テスト名でE2Eを追加・更新する。
- `scripts/doctor-aidd.mjs` にMVP046の必須文言、capture script、Firefox、doctor:aidd、local path / host / private network URL検出を含める。
- `scripts/capture-mvp046.mjs` を追加し、empty / valid / failure / terminal evidenceのPNGを生成する。
- `package.json` に `capture:mvp046` を追加し、nameを `aidd-control-plane-mvp-046` にする。

受け入れ条件:
- `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が通る。
- empty / valid / failure / terminal evidence screenshotを生成できる。
- README.md / AI_TASK_PACKET.md / CODEX_PROMPT.md がMVP046の内容と一致する。
