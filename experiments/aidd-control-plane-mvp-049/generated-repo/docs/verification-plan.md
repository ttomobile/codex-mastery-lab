# Verification Plan: AIDD Control Plane MVP 049

## 品質ゲート

```text
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp049
```

## 画面状態

- empty: Verification Run Detailの必要入力を表示する。
- ready: Codex Run Queueの1件を6つのcommand別detailとして表示し、3ブラウザと4種類の証跡を表示する。
- failure: commit SHA不足、command別detail不足、exit code不足、artifact path不足、失敗分類不足、修正指示不足、Firefox除外、terminal evidence不足、failure screenshot不足、local path / host / private network URL混入、AIDD-Spec connection不足を表示する。

## 証跡

`pnpm run capture:mvp049`でempty / ready / failure / terminal evidenceのPNGを生成し、実験ディレクトリとrepo rootの`assets/`へ保存する。
