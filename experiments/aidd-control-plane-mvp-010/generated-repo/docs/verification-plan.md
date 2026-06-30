# Verification Plan

対象はAIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdに接続するAIDD Control Plane MVP 009: CI Artifact Importer。

## 静的ゲート

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run doctor:aidd`

## E2Eゲート

- `pnpm run test:e2e`
- PlaywrightはChromium / Firefox / WebKitを対象にする。

## 単体テスト観点

- empty stateを判定できる。
- テンプレート選択後の未適用failure stateを判定できる。
- 必須項目不足をinsufficientとして判定できる。
- 必須項目が揃うとreadyとして判定できる。
- Verification Runのvalidサンプルがreadyになる。
- Verification Runのfailureサンプルがreadyにならない。
- Artifact Evidence Binderのemptyサンプルが不足証跡を返す。
- Artifact Evidence BinderのvalidサンプルがCI run URL、CI artifact URL、Playwright report URLを束ねる。
- Artifact Evidence Binderのfailureサンプルが壊れたURL、不足証跡、古いログをReview Recordへ戻す。

## E2E観点

- 初期empty stateが表示される。
- テンプレート未選択とテンプレート未適用が表示される。
- テンプレート適用後に主要機能、非ゴール、外部連携、生成結果が更新される。
- サンプルアプリ入力でready stateになり、生成結果が表示される。
- Artifact Evidence Binder: emptyが初期表示される。
- validサンプルでlint、typecheck、test、build、e2e、doctor:aidd、Chromium / Firefox / WebKit、terminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLが表示される。
- failureサンプルで壊れたURL、不足証跡、古いログが表示され、Review FindingsとNext AI Task Packet Deltaに戻る。
- 証跡不足サンプルでevidence file不足が表示され、readyではない状態が表示される。

## AIDD doctor観点

- 必須ファイルが存在する。
- 必須package scriptsが存在する。
- UIコピー文字列が存在する。
- 状態契約文字列が存在する。
- App Type Templatesが4件以上存在する。
- Playwright設定にChromium / Firefox / WebKitが存在する。
- app/srcにブラウザ保存領域や外部通信プリミティブがない。
- Verification Run Tracker、Artifact Evidence Binder、Verification Evidence、Review Record、Learning Logの文言が存在する。
- testsとE2E specにvalid / failure / emptyとBinderの主要状態の検査が存在する。


## CI Artifact Importer接続

commit SHA、workflow、CI jobs、CI artifacts、Playwright report URLを取り込み、Artifact Evidence Binder / Verification Evidence / Review Record / Learning Logへ接続する。

## MVP 010追加: GitHub Actions Artifact Fetch Plan

GitHub Actions run URLからowner / repo / run id / jobs API endpoint / artifacts API endpoint / logs URL / actions:read / contents:read / required artifactsを確認し、Verification Evidence / Review Record / Learning Logへ接続する。failureではrun id不足、token scope不足、artifact取得計画不足をNext AI Task Packet Deltaへ戻す。
