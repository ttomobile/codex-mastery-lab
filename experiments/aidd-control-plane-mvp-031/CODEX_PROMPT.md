# Codex Prompt: AIDD Control Plane MVP 031

`experiments/aidd-control-plane-mvp-031/generated-repo` を編集してください。目的は、MVP 030のExported Packet Preflight Reviewerの次段として **Run Authorization Gate** を追加することです。

## 実装要件

1. `package.json` のnameを `aidd-control-plane-mvp-031` にし、`capture:mvp031` scriptを追加してください。
2. `src/lib/intake.ts` にRun Authorization Gate用の型、empty/valid/failure生成関数、評価関数を追加してください。
3. `app/page.tsx` に日本語UIを追加してください。
   - 見出し: `MVP 031: Run Authorization Gate`
   - 状態ボタン: `empty`, `valid`, `failure`
   - validでは、approver、authorization reason、Codex command、sandbox mode、検証コマンド、3ブラウザ、証跡保存先、rollback、AIDD-Spec接続を表示。
   - failureでは、実行前に止めるべきReview Findingを表示。
4. Vitestに日本語テスト名でempty/valid/failure評価を追加してください。
5. Playwright E2Eに日本語テスト名で3状態の表示確認を追加してください。
6. `scripts/capture-mvp031.mjs` を追加し、empty/valid/failure/terminal evidence画像を保存できるようにしてください。
7. `scripts/doctor-aidd.mjs` がMVP031の必須要素を確認するように更新してください。

## failureで検出する項目

- preflight statusがvalidでない
- approver不足
- authorization reason不足
- Codex command不足または危険なtarget path
- sandbox mode不足
- Firefox除外
- shallow verification
- local path / host / tailnet / private network URL混入
- evidence path不足
- rollback plan不足
- AIDD-Spec接続不足

## 検証

実装後、可能なら以下を実行してください。

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```

Codexの自己申告だけで完了扱いにせず、失敗した場合はどのコマンドが失敗したかを残してください。
