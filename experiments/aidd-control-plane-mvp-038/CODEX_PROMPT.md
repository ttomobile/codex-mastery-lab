あなたはAIDD Control Plane MVP 038を実装します。

対象ディレクトリ: `experiments/aidd-control-plane-mvp-038/generated-repo/`

目的: MVP 037のRepair Delta Priority Decision Workspaceの次段として、採用済みrepair deltaを次の1回のCodex実行へ入れる「Execution Priority Set Builder」を追加してください。

要件:

1. `src/lib/intake.ts` にExecution Priority Set Builderの型、empty/valid/failure factory、evaluatorを追加する。
2. valid状態では `execute_now` / `next_increment` / `learning_log` を混在させる。Codex prompt previewへ入るのは `execute_now` だけにする。
3. failure状態では、優先順位重複、実行予算不足、検証コマンド不足、rollback不足、未採用delta混入、Firefox除外、local path/host/tailnet混入を検出する。
4. `app/page.tsx` に日本語UIの「Execution Priority Set Builder」セクションを追加し、`execution empty` / `execution valid` / `execution failure` ボタンで状態切替できるようにする。
5. 日本語名のunit testとPlaywright E2Eを追加する。
6. `scripts/doctor-aidd.mjs` をMVP 038向けに更新する。
7. `scripts/capture-mvp038.mjs` と `package.json` の `capture:mvp038` を追加し、empty/valid/failure/terminal evidence画像を作れるようにする。
8. lint/typecheck/test/build/test:e2e/doctor:aiddが通る状態にする。

制約:
- UI、テスト名、サンプルデータは日本語を基本にする。
- 実際の外部API連携やCodex実行キューは作らない。
- runtime生成物をコミット対象にしない。
