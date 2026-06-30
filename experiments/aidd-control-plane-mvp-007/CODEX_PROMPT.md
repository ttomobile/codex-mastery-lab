AIDD Control Plane MVP 007 を実装してください。

前提:
- 作業ディレクトリは `experiments/aidd-control-plane-mvp-007/generated-repo` です。
- 既存の MVP 006: Project Intake Wizard / App Type Templates / Verification Run Tracker を壊さないでください。
- Next.js + TypeScript + pnpm のまま実装してください。
- UI、テスト名、サンプルデータ、エラーメッセージは日本語にしてください。

実装内容:
1. Verification Run Tracker の結果から Review Record を生成する関数を追加してください。
2. Review Record から Learning Log と Next AI Task Packet Delta を生成する関数を追加してください。
3. 画面に「Review & Learning Log」セクションを追加してください。
4. 初期、成功、失敗、証跡不足の各状態で、Review Score / Findings / 修正指示 / needed upstream information / Codex prompt delta / Verification Evidence 要件が見えるようにしてください。
5. Product Brief / AI Task Packet / Verification Plan / Codex Prompt の出力にも Review Record と Learning Log の前提を含めてください。
6. unit test、Playwright E2E、doctor:aidd を更新してください。

受け入れ条件:
- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
が通ること。

注意:
- Codexの完了報告ではなく、実際にコマンドが通る状態まで修正してください。
- runtime生成物を意図的にコミット対象へ含めないでください。
