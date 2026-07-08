AIDD Control Plane MVP 064として、experiments/2026-07-08-aidd-control-plane-mvp-064/generated-repo に小さなNext.js/TypeScriptアプリを作ってください。

題材は「Run Result Digest Publisher」です。MVP063のCodex Run Queue Status Trackerの後段として、実行結果・証跡・Review Record・Learning Log・次回AI Task Packet deltaを、レビュー担当者やnote読者にも共有できる短いMarkdownダイジェストへ変換するUIです。

必須要件:
- UIは日本語。
- empty / valid / failure / blocked の4状態を切り替えられる。
- source run id、run outcome、score、terminal evidence、initial/filled/failure/terminal screenshot、Chromium/Firefox/WebKit coverage、console status、Review Record、Learning Log、AI Task Packet delta、note article angle、publish readinessを表示する。
- blockedでは source run id不足、terminal evidence不足、failure screenshot不足、Firefox除外、console error/warn未確認、local path/host/private network URL混入、Learning Log接続不足、note記事観点不足をReview Findingとして表示する。
- validでは共有用Markdown、次回AI Task Packet delta、Codex prompt delta、Verification Evidence checklistを表示する。
- pnpm run lint / typecheck / test / build / test:e2e / doctor:aidd / capture:mvp064 が動くようにする。
- PlaywrightはChromium / Firefox / WebKitの3ブラウザ設定にする。Firefoxが遅くても外さない。
- テスト名、UI文言、サンプルデータは日本語。
- 重い依存は避ける。既存のMVP063 generated-repoが参考になれば構成を参考にしてよい。
- scripts/doctor-aidd.mjs は、4状態、3ブラウザ設定、必要script、危険な公開文字列の検査を行う。
- scripts/capture-mvp064.mjs は、empty/valid/failure/blocked/terminal evidence風のスクリーンショットを artifacts/screenshots と ../assets に保存する。

実装後に自分でも可能な範囲でコマンドを実行し、結果を要約してください。ただし最終判断は別プロセスで独立検証します。