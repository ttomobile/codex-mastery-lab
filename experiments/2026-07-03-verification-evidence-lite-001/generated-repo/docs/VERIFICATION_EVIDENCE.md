# Verification Evidence

## 今回の品質ゲート

- `pnpm run doctor:evidence`: 受け入れ条件、検証証跡ドキュメント、Playwrightテストの存在確認。
- `pnpm run typecheck`: TypeScriptの型検査。
- `pnpm run lint`: ESLintによる静的検査。
- `pnpm run build`: Next.js本番ビルド。
- `pnpm run test:e2e`: Playwrightによる受け入れ条件ID単位のE2E確認。

## ログ保存先

- 推奨保存先: `../artifacts/verification-evidence-lite/terminal/`
- 保存例: `pnpm run test:e2e | tee ../artifacts/verification-evidence-lite/terminal/test-e2e.log`

## スクリーンショット/GIF保存先

- 推奨保存先: `../artifacts/verification-evidence-lite/assets/`
- Playwrightの失敗時出力: `test-results/`

## 残リスク

- mock backend、課金、認証、CIはこの軽量検証では対象外。
- E2Eはローカルの単一ブラウザ設定に依存するため、3ブラウザ保証は別検証が必要。
- スクリーンリーダー実機での読み上げ確認は未実施。ARIA属性とアクセシブル名をE2Eで確認する。
