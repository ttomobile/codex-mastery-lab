あなたはAIDD Control Plane MVP 041を実装するCodexです。

`experiments/aidd-control-plane-mvp-041/generated-repo/` を編集してください。MVP 040の既存実装を壊さず、「Verification Evidence Receipt Binder」を追加します。

必須要件:

1. 日本語UI、日本語テスト名を維持する。
2. `src/lib/intake.ts` にVerification Evidence Receipt Binderの型、empty/valid/failure factory、evaluatorを追加する。
3. `app/page.tsx` に「Verification Evidence Receipt Binder」セクションと `binder empty` / `binder valid` / `binder failure` ボタンを追加する。
4. valid状態では、source run start receipt、lint/typecheck/test/build/e2e/doctor:aiddのcommand別exit code、duration、terminal log、artifact path、Chromium/Firefox/WebKit、empty/valid/failure/terminal evidence screenshots、AIDD-Spec接続を表示する。
5. failure状態では、source不足、command別detail不足、exit code不足、artifact不足、失敗分類不足、修正指示不足、Firefox除外、terminal/failure screenshot不足、doctor:aidd不足、local path/host/private network URL混入を検出して表示する。
6. unit testとPlaywright E2Eを追加・更新する。
7. `scripts/doctor-aidd.mjs` にMVP 041の静的検査を追加する。
8. `scripts/capture-mvp041.mjs` とpackage.json script `capture:mvp041` を追加する。
9. 既存のlint/typecheck/test/build/e2e/doctor:aiddが通る状態にする。

実装後、自己申告だけでなく、変更ファイルと実行すべき検証コマンドを短く報告してください。
