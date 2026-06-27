# WatchFlow Trial 001 初回プロンプト

> 公開記事では個人ユーザー名を含む絶対パスを出さない。パスは `/path/to/project-root/` または `~/watchflow-lab/` として表記する。

## 目的

Next.jsを使って、日本語UIのYouTube風動画視聴Webアプリ「WatchFlow」を作る。これはYouTubeの複製ではなく、動画視聴サービスに必要な体験、テスト、設計、モック基盤、公開リポジトリ運用を採点するための実験用アプリである。

## Codexに渡す初回プロンプト

```text
/path/to/project-root/ に、Next.js + TypeScriptで日本語UIのYouTube風動画視聴Webアプリ「WatchFlow」を作ってください。

目的は、YouTubeそのものをコピーすることではなく、動画視聴サービスとしてプロフェッショナル品質に近づけるためのAI駆動開発実験です。

必須条件:
- UI、サンプルデータ、エラー文、テスト名、READMEは日本語ベースにしてください。
- Next.js App Routerを使ってください。
- TypeScript strictを前提にしてください。
- package manager、Node.jsバージョン、lockfile、依存バージョン方針が再現可能になるようにしてください。
- YouTubeのロゴ、商標、実データ、実APIは使わないでください。
- 独自名 WatchFlow と独自の参照デザインで作ってください。
- 公開GitHubリポジトリで配布し、記事を読んだ人がローカルで動かせる前提にしてください。

最低限ほしい画面:
- ホーム
- 検索結果
- 動画詳細/再生画面
- チャンネル概要
- コメント欄
- 関連動画
- エラー状態

最低限ほしいローカルモック:
- 動画一覧API
- 検索API
- コメントAPI
- 認証状態モック anonymous / logged_in / premium / session_expired
- 課金状態モック free / premium / payment_failed
- 動画メディアの正常/遅延/404/失敗モード

動画再生まわりで確認したいこと:
- poster表示
- 再生/一時停止
- シーク
- 音量/ミュート
- 字幕またはキャプションの設計余地
- バッファリング表示
- 動画取得失敗時のエラー表示
- リトライ
- キーボード操作
- アクセシブルな操作名

テストと自動化:
- Unit Testを用意してください。
- Component TestまたはTesting Libraryベースのテストを用意してください。
- PlaywrightでChromium/Firefox/WebKitのE2Eを用意してください。
- Visual Regression用のスクリーンショット基準を用意してください。
- テスト結果やHTML reportをCI artifactとして保存できるようにしてください。
- GitHub Actionsを用意してください。
- Dependabotを設定してください。

設計:
- 1ファイル巨大実装にしないでください。
- design tokens、共有UI、feature単位のコンポーネント、API client、mock adapterを分けてください。
- 動画プレイヤーはClient Componentとして責務を分けてください。
- loading / empty / error / offline / timeout / retry状態を設計してください。
- 国際対応を視野に入れ、UI文言、日付、数値、再生回数、通貨、タイムゾーンを後から差し替えやすくしてください。
- GDPR観点として、閲覧履歴、コメント、課金状態、Cookie/storage、同意、削除要求、データエクスポート、保持期間を設計メモに残してください。

成果物:
- README.md
- docs/decisions/ に技術選定理由
- docs/testing.md
- docs/privacy-gdpr-readiness.md
- docs/score-self-review.md
- GitHub Actions設定
- Dependabot設定

最後に、実行したコマンド、成功/失敗したテスト、既知の制約、次に改善すべき点を日本語で報告してください。
```

## Trial 001で見ること

- CodexはNext.jsアーキテクチャをどこまで妥当に分けるか。
- package versionやpinningをどこまで再現可能にするか。
- E2E/Unit/Visual/CIをどこまで実装するか。
- mock-api / mock-media / mock-auth / mock-billingをどこまで作るか。
- 動画再生の失敗・遅延・リトライをどこまで扱うか。
- GDPR/国際対応をどこまで設計メモに残すか。
- 公開リポジトリで第三者が動かせる説明になるか。
