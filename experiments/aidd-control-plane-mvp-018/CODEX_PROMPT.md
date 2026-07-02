あなたはCodex Mastery Lab内のAIDD Control Plane MVP 018を実装するコーディングエージェントです。

作業場所: `experiments/aidd-control-plane-mvp-018/generated-repo`

前提:
- Next.js + TypeScript + pnpm。
- UIコピー、テスト名、docsは日本語。
- AIDD-Spec v0.1と`standards/aidd-control-plane-mvp-v0.1.md`に接続する。
- 建築/建物メタファーは禁止。料理の改善メモ、健康診断の再検査、旅行の持ち物リストのような初心者に伝わる比喩を使う。
- Codexの自己申告だけで終えず、テストが通る実装にする。

実装するMVP:
`AI Task Packet Delta Apply Preview`

MVP 017の`Spec Update Proposal Queue`の次段として、proposalを採用したときに次回AI Task Packet / Codex prompt / verification planがどう変わるかをプレビューする。

必須要件:
1. UIセクション `AI Task Packet Delta Apply Preview` を追加。
2. 状態切替 `empty` / `valid` / `failure` を追加。
3. valid状態では以下を表示:
   - source proposal
   - target packet section
   - before summary
   - after summary
   - added acceptance criteria
   - added verification commands
   - codex prompt patch
   - rollback condition
   - review checklist
4. failure状態では以下の不足を検出して表示:
   - 根拠finding不足
   - target packet section不足
   - verification command不足
   - rollback condition不足
5. `src/lib/intake.ts`等に純粋関数を追加し、日本語Unitテストを書く。
6. Playwright E2EでChromium / Firefox / WebKit対象の既存設定に乗せ、empty/valid/failureの切替とCodex prompt patch表示を確認。
7. `doctor:aidd`で、UI文言、MVP 018スクリプト、AIDD-Spec接続文言、テストファイル存在を静的検査。
8. `scripts/capture-mvp018.mjs`を追加し、以下を保存:
   - `../../assets/aidd-control-plane-mvp018-empty.png`
   - `../../assets/aidd-control-plane-mvp018-valid.png`
   - `../../assets/aidd-control-plane-mvp018-failure.png`
   - `../artifacts/screenshots/aidd-control-plane-mvp018-empty.png`
   - `../artifacts/screenshots/aidd-control-plane-mvp018-valid.png`
   - `../artifacts/screenshots/aidd-control-plane-mvp018-failure.png`
   - terminal evidence画像は後続でHermes側が作るため、必要なら既存スタイルに合わせる。
9. `package.json`に`capture:mvp018`を追加。

完了前に以下を実行して修正する:
- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

注意:
- runtime生成物をコミット対象にする必要はない。
- ローカルパスやホスト名をUIや記事に埋め込まない。
