# テスト方針

## Unit Test

`lib/utils/format.test.ts` で日本語フォーマットを検証します。日付、数値、再生回数、通貨は国際対応時の差し替え境界になるため、ユーティリティ単位で守ります。

## Component Test

`features/video/VideoPlayer.test.tsx` で Testing Library を使い、再生ボタン、失敗時の再試行、ミュート操作名を検証します。動画再生そのものはブラウザ実装に依存するため、HTMLMediaElementをテスト内でモックします。

## E2E

`e2e/watchflow.spec.ts` で以下を確認します。

- ホームから動画詳細へ移動できる。
- 検索結果の空状態を表示できる。
- 動画取得失敗時にリトライ導線を表示できる。

Playwright設定では Chromium / Firefox / WebKit を対象にしています。

## Visual Regression

`e2e/visual.spec.ts` でホームと動画詳細のスクリーンショット基準を管理します。Visual Regressionは差分ノイズを抑えるためChromium基準に限定し、機能E2Eは Chromium / Firefox / WebKit で実行します。初回または意図したUI変更時は `npm run test:e2e:update` を実行して基準を更新します。

## CI artifact

GitHub Actions は `playwright-report/` と `test-results/` を artifact として保存します。失敗時はHTML report、trace、スクリーンショットから原因を追えます。
## コマンド

```bash
pnpm run lint
pnpm run typecheck
pnpm run test:coverage
pnpm run build
pnpm run doctor:playwright
pnpm run test:e2e
```

## Coverage

Vitest coverage は V8 provider を使います。Trial 002 の初期閾値は `statements: 35`, `branches: 25`, `functions: 30`, `lines: 35` です。低めに設定し、プレイヤー分割後の回帰検知を始めることを優先します。

## Accessibility

Playwright E2E で `@axe-core/playwright` を使い、ホーム、検索、動画詳細、状態表示の基本ページを検査します。色コントラストは今後のビジュアル調整対象として、Trial 002 では `color-contrast` rule のみ除外します。
