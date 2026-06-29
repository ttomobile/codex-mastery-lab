# Verification Plan

## 静的ゲート

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run doctor:aidd`

## E2Eゲート

- `pnpm run test:e2e`

## 単体テスト観点

- empty stateを判定できる。
- 必須項目不足をinsufficientとして判定できる。
- 必須項目が揃うとreadyとして判定できる。
- Product Briefにアプリ名、対象ユーザー、非ゴールが含まれる。
- Codex Promptに品質ゲートと状態契約が含まれる。

## E2E観点

- 初期empty stateが表示される。
- サンプルアプリ入力でready stateになり、生成結果が表示される。
- 主要機能を削除するとinsufficient stateになり、missing fieldsが表示される。

## AIDD doctor観点

- 必須ファイルが存在する。
- 必須package scriptsが存在する。
- UIコピー文字列が存在する。
- 状態契約文字列が存在する。
- app/srcにブラウザ保存領域や外部通信プリミティブがない。
- app/srcに外部URLがない。
