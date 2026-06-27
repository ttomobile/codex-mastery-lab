# 自己レビュー

| 観点 | 評価 | メモ |
| --- | ---: | --- |
| 日本語UI | 4/5 | 画面、サンプルデータ、エラー、テスト名、README/docsを日本語中心にした。 |
| App Router / strict | 5/5 | App Router、Route Handler、TypeScript strict前提。 |
| モックの網羅 | 5/5 | Route Handlerに加え、api/media/auth/billingの独立mock serviceを追加。Trial 004ではcontrol endpointとE2E実依存化を追加した。 |
| 動画プレイヤー | 4/5 | poster、再生、一時停止、シーク、音量、ミュート、字幕、バッファリング、失敗、リトライ、キーボード操作を実装。 |
| テスト | 4/5 | Unit、Component、E2E、Visual Regression、mock-media service testを用意。E2Eは独立mock service状態変更と「後で見る」操作も検証する。 |
| CI / 自動化 | 5/5 | GitHub Actions、Playwright browser install、HTML report/test-results/coverage artifact保存、Dependabotを設定。 |
| デザイン品質 | 4/5 | サイドナビ、カテゴリレール、登録チャンネル、履歴、プレイリスト、通知を追加し、動画サービスらしい情報設計を少し強めた。 |
| GDPR準備 | 4/5 | 主要論点を文書化。実装としての同意管理やエクスポートAPIは未実装。 |

## 次に改善する点

- Cookie同意、閲覧履歴の削除、データエクスポートの実画面を追加する。
- プレミアム状態と支払い失敗状態を動画一覧や権限制御へさらに接続する。
- Firefox実ブラウザをCI/ローカルで安定導入する手順をさらに固める。

## Trial 004 自己採点案

91/100

- React `act(...)` warningを抑制ではなく待機で解消する方針に変更。
- axeの `color-contrast` 除外を外し、色トークンを補正。
- Trial 004では上部表示のposter画像をpriority化し、LCP poster warning抑制を狙った。
- 独立mock serviceをPlaywrightの実依存にし、control endpointで状態変更できるようにした。
- CI artifactにcoverageを追加し、FirefoxはCIで `--with-deps` install後に走らせる方針を明記した。
- Product Parityは「後で見る」の追加/解除まで進めたが、履歴や課金連動の永続データ操作はまだ限定的。
