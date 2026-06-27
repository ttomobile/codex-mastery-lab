# 技術選定理由

## 採用

- Next.js App Router: 画面単位のServer Componentと再生プレイヤーのClient Componentを分離しやすいため。
- TypeScript strict: APIモック、UI状態、動画プレイヤーの状態遷移を型で管理するため。
- npm + package-lock: 公開GitHubリポジトリで読者が再現しやすく、CIでも `npm ci` を使えるため。
- Vitest: Unit Test と Testing Library ベースの Component Test を高速に実行できるため。
- Playwright: Chromium / Firefox / WebKit のE2EとVisual Regressionを同じ設定で扱えるため。
- ローカルRoute Handlerモック: 実APIや実データを使わず、失敗、遅延、404、課金、認証状態を再現できるため。

## 分割方針

- `app/`: App Router、ページ、Route Handler。
- `features/`: 動画、コメント、チャンネル、レイアウトなど利用者の体験単位。
- `components/ui/`: 汎用UI。
- `lib/mocks/`: サンプルデータ、状態型、モックアダプタ。
- `lib/i18n/`: 日本語文言。将来の多言語化で差し替えやすいよう集約する。
- `lib/utils/format.ts`: 日付、数値、再生回数、通貨、タイムゾーンのフォーマット境界。

## 非採用

- 外部動画API: 実サービス依存と利用規約リスクを避けるため。
- 1ファイル巨大実装: プレイヤー、API、表示状態、テストの責務が混ざるため。
- YouTube由来のロゴや実データ: 独自名 WatchFlow と独自デザインで検証するため。
