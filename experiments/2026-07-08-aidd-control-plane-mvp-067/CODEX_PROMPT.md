あなたはCodexです。`generated-repo/` の中だけを編集し、AIDD Control Plane MVP 067「Smoke Finding Action Queue」を実装してください。

要件:
- Next.js + TypeScript + pnpm。日本語UI。
- Public Preview Smoke Verifierの失敗をReview Finding Action Queueへ変換するSaaS画面を作る。
- empty / queued / blocked / exported の4状態を切り替えられる。
- execute_nowだけをCodex prompt previewへ入れ、next_increment / learning_logは混入させない。
- private URL、local path、Firefox未確認、terminal evidence画像不足、AIDD-Spec接続不足をblockedとして表示する。
- `pnpm run lint`, `typecheck`, `test`, `build`, `test:e2e`, `doctor:aidd`, `capture:mvp067` を用意する。
- PlaywrightはChromium / Firefox / WebKit。
- 画像を `../artifacts/screenshots/` と `../assets/` に保存するcapture scriptを用意する。
- runtime生成物をコミット対象にしない `.gitignore` を置く。

検証は自己申告せず、実装後に実際にコマンドを実行できる構成にしてください。
