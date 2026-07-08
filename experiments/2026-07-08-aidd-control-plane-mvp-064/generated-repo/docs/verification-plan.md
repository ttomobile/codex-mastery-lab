# Verification plan

- `pnpm run lint` で静的検査を行う。
- `pnpm run typecheck` でTypeScriptを検査する。
- `pnpm run test` でドメインロジックを検査する。
- `pnpm run build` でNext.js buildを確認する。
- `pnpm run test:e2e` でChromium / Firefox / WebKitの3ブラウザE2Eを実行する。
- `pnpm run doctor:aidd` で4状態、3ブラウザ設定、必要script、公開危険文字列を検査する。
- `pnpm run capture:mvp064` でempty / valid / failure / blocked / terminal evidence風のスクリーンショットを保存する。
