あなたはCodexです。`generated-repo/` の中だけを編集し、AIDD Control Plane MVP 068「One-Run Execution Readiness Gate」を実装してください。

要件:
- Next.js + TypeScript + pnpm。日本語UI。
- Smoke Finding Action Queueのexecute_now itemを、Codex Run Queueへ入れる直前にready / blockedとして判定するSaaS画面を作る。
- empty / ready / blocked / sanitized の4状態を切り替えられる。
- Codex command、sandbox mode、required verification commands、Chromium / Firefox / WebKit、required evidence、rollback stop condition、ready reason、AIDD-Spec connectionを表示する。
- next_increment / learning_log混入、危険command、sandbox不足、Firefox除外、terminal/failure screenshot不足、rollback不足、local path/private URL、AIDD-Spec接続不足をblockedとして表示する。
- sanitized状態では公開用にlocal path/private network URLを含まないCodex prompt previewを表示し、execute_nowだけが含まれることを保証する。
- `pnpm run lint`, `typecheck`, `test`, `build`, `test:e2e`, `doctor:aidd`, `capture:mvp068` を用意する。
- PlaywrightはChromium / Firefox / WebKit。
- 画像を `../artifacts/screenshots/` と `../assets/` に保存するcapture scriptを用意する。
- runtime生成物をコミット対象にしない `.gitignore` を置く。

検証は自己申告せず、実装後に実際にコマンドを実行できる構成にしてください。
