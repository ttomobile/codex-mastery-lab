# 自己レビュー

| 観点 | 評価 | メモ |
| --- | ---: | --- |
| 日本語UI | 4/5 | 画面、サンプルデータ、エラー、テスト名、README/docsを日本語中心にした。 |
| App Router / strict | 5/5 | App Router、Route Handler、TypeScript strict前提。 |
| モックの網羅 | 4/5 | Route Handlerに加え、api/media/auth/billingの独立mock serviceを追加。mediaはRange、slow、interrupted、404、500、字幕を扱う。 |
| 動画プレイヤー | 4/5 | poster、再生、一時停止、シーク、音量、ミュート、字幕、バッファリング、失敗、リトライ、キーボード操作を実装。 |
| テスト | 4/5 | Unit、Component、E2E、Visual Regression、mock-media service testを用意。axeはcolor-contrastを有効化。 |
| CI / 自動化 | 5/5 | GitHub Actions、artifact保存、Dependabotを設定。 |
| デザイン品質 | 4/5 | サイドナビ、カテゴリレール、登録チャンネル、履歴、プレイリスト、通知を追加し、動画サービスらしい情報設計を少し強めた。 |
| GDPR準備 | 4/5 | 主要論点を文書化。実装としての同意管理やエクスポートAPIは未実装。 |

## 次に改善する点

- Cookie同意、閲覧履歴の削除、データエクスポートの実画面を追加する。
- プレミアム状態と支払い失敗状態を画面上の権限制御に接続する。
- 独立mock serviceをE2Eの外部依存として切り替える設定を追加する。
- Firefox実ブラウザをCI/ローカルで安定導入する手順をさらに固める。

## Trial 003 自己採点案

86/100

- React `act(...)` warningを抑制ではなく待機で解消する方針に変更。
- axeの `color-contrast` 除外を外し、色トークンを補正。
- placeholderだったmock serviceを独立Node http serverとして起動可能にした。
- media障害再現とservice testを追加。
- Product Parityは情報設計を強めたが、実サービス相当のパーソナライズや権限制御はまだ限定的。
