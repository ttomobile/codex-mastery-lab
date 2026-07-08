# Verification plan

- `pnpm run lint` で静的検査を行う。
- `pnpm run typecheck` でTypeScriptを検査する。
- `pnpm run test` で公開preview smokeのdomain判定を検査する。
- `pnpm run build` でNext.js buildを確認する。
- `pnpm run test:e2e` でChromium / Firefox / WebKitの3ブラウザE2Eを実行する。
- `pnpm run doctor:aidd` で必要script、4状態fixture、E2E、capture script、AIDD-Spec接続文言、公開危険文字列のfixture混入検査を行う。
- `pnpm run capture:mvp066` でempty / valid / failure / blocked / terminal evidence PNGを`artifacts/screenshots/`へ保存する。
