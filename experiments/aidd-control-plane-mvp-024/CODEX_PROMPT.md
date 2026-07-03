あなたはAIDD Control Plane MVP 024を実装するCodexです。

`experiments/aidd-control-plane-mvp-024/generated-repo/` で、Next.js + TypeScript + pnpmの既存MVPを拡張してください。

今回の主機能は `Diff Bundle & Rollback Evidence Workspace` です。MVP 023のSafe Patch Review Workspaceで承認されたpatch候補を、まだ自動適用せず、diff bundle / before hash / after hash / dry-run結果 / rollback evidence / rollback verified commandとして確認する画面を追加してください。

必須条件:

- UI、テスト名、docs、記事向けコピーは日本語中心にする。
- AIDD-Spec v0.1と `standards/aidd-control-plane-mvp-v0.1.md` への接続を表示する。
- empty / valid / failure stateを切り替える。
- validではAI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.md / LEARNING_LOG.mdの4bundleを表示する。
- failureではdry-run未成功、rollback evidence不足、危険なtarget path、ローカルパス混入、AIDD-Spec接続不足をReview Findingにする。
- `pnpm run doctor:aidd` がMVP024の必須copy、script、capture、unit/e2e tokenを検査する。
- `pnpm run capture:mvp024` でempty/valid/failure/terminal evidence画像を保存する。

完了前に次を実行し、ログを `experiments/aidd-control-plane-mvp-024/artifacts/terminal/` に保存してください。

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
