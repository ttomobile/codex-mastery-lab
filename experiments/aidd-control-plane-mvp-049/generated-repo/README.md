# AIDD Control Plane MVP 049

## 機能名

Verification Run Detail Drilldown

## 目的

Codex Run Queueの1件をcommand別Verification Run Detailとして表示し、exit code、duration、artifact、失敗分類、修正指示、3ブラウザ証跡、AIDD-Spec接続を確認する。

## 必須スクリプト

```text
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp049
```

## 受け入れ条件

- UIは日本語。
- empty / ready / failureの3状態を表示する。
- readyではCodex Run Queueの1件をcommand別detailとして表示する。
- failureではcommit SHA不足、command別detail不足、exit code不足、artifact path不足、失敗分類不足、修正指示不足、Firefox除外、terminal evidence不足、failure screenshot不足、local path / host / private network URL混入、AIDD-Spec connection不足を表示する。
- Review Finding draftに失敗分類、理想状態、修正指示、必要な上流情報、検証commandを表示する。
