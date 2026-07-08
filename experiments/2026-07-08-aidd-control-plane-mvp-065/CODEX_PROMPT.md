あなたはAIDD Control Plane MVPを実装するCodexです。

`generated-repo/` を更新して、MVP065「Publication Evidence QA Gate」を完成させてください。

要件:
- Next.js + TypeScript。UI・テスト名・サンプルデータは日本語。
- 既存MVP064の実装を土台にしてよいが、アプリ名・package名・capture script名をMVP065へ更新する。
- 公開候補ダイジェストを empty / valid / failure / blocked で判定するdomain関数を作る。
- UIには source digest id、article path、preview、asset copy、terminal evidence、initial/filled/failure screenshots、Chromium/Firefox/WebKit、console status、sanitization scan、Review Record、Learning Log、AI Task Packet delta、Codex prompt delta、publish checklist を表示する。
- blockedでは local path / host / private network URL、Firefox除外、terminal evidence不足、記事観点不足、AIDD-Spec接続不足をReview Findingとして出す。
- `pnpm run lint`, `typecheck`, `test`, `build`, `test:e2e`, `doctor:aidd` が通るようにする。
- Playwrightは Chromium / Firefox / WebKit の3ブラウザ。
- `pnpm run capture:mvp065` で empty / valid / failure / blocked / terminal evidence PNG を `artifacts/screenshots/` に保存する。
- doctor:aidd は重要テキスト、3ブラウザ設定、capture script、公開危険文字列のfixture混入検査を行う。

実装後、必要なログを残して終了してください。
