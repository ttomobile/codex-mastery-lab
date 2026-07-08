AIDD Control Planeの次インクリメントとして Codex Run Queue Status Tracker 画面を実装してください。

要件:
- generated-repo/ にNext.js + TypeScriptアプリを作る。既存MVP073と同等の品質ゲート構成でよい。
- UIコピー、テスト名、サンプルデータは日本語。
- 画面は query param `?state=` で empty / waiting / running / succeeded / failed / evidence_missing を切り替えられる。
- waitingでは source intake id、queue item id、Codex command、sandbox、required verification commands、Chromium / Firefox / WebKit、rollback plan、AIDD-Spec接続を表示。
- runningでは started at、operator、current step、duration、evidence root、browser console collection statusを表示。
- succeededでは actual results、command別exit code、3ブラウザcoverage、terminal evidence、screenshot evidence、Playwright report、Review Record output、Learning Log outputを表示。
- failedでは command失敗、Firefox未実行、doctor:aidd失敗、危険command、rollback不足、console error/warn、local path/private network URL混入をReview Findingとして表示。
- evidence_missingでは terminal evidence、failure screenshot、browser console log、Playwright report、掲載用GIF不足を表示。
- unit test、E2E、doctor:aiddで上記を検査。
- `pnpm run capture:mvp074` で empty / waiting / running / succeeded / failed / evidence_missing / terminal evidence PNGを `assets/` と `artifacts/screenshots/` へ保存。
- runtime生成物をコミット対象にしない。
