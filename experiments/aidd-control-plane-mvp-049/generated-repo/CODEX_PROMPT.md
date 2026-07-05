# Codex Prompt: AIDD Control Plane MVP 049

`experiments/aidd-control-plane-mvp-049/generated-repo/`に、AIDD Control Plane SaaSのVerification Run Detail Drilldown MVPを実装する。

## 必須要件

- Next.js + TypeScript + pnpm。
- UIとテスト名は日本語。
- empty / ready / failureの3状態を表示する。
- ready状態はCodex Run Queueの1件をcommand別Verification Run Detailとして見せる。
- readyにはsource queue item、source run status、commit SHA、command name、exit code、duration、terminal log path、artifact path、failure category、repair instruction、Chromium / Firefox / WebKit coverage、terminal / empty / ready / failure screenshot evidenceを含める。
- failure状態はcommit SHA不足、command別detail不足、exit code不足、artifact path不足、失敗分類不足、修正指示不足、Firefox除外、terminal evidence不足、failure screenshot不足、local path / host / private network URL混入、AIDD-Spec connection不足を表示する。
- Review Finding draftとして、失敗分類、理想状態、修正指示、必要な上流情報、検証commandを表示する。
- AIDD-Spec v0.1、Verification Evidence、Review Record、Learning Logへの接続を表示する。

## 必須スクリプト

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp049`

## 証跡

`capture:mvp049`でempty / ready / failure / terminal evidenceのPNGを実験ディレクトリとrepo rootの`assets/`へ保存する。
