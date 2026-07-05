# Verification Plan: AIDD Control Plane MVP 048

## 品質ゲート

```text
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp048
```

## 画面状態

- empty: One-Run Execution Readiness Gateの必要入力を表示する。
- ready: Review Finding Action Queueの`execute_now` 1件だけをCodex command previewへ表示し、`next_increment`と`learning_log`を混ぜない。
- blocked: source queue id不足、execute_now以外のaction混入、危険command、sandbox mode不足、required verification commands不足、Firefox除外、terminal evidence不足、failure screenshot不足、rollback stop condition不足、local path / host / private network URL混入、AIDD-Spec connection不足を表示する。

## 証跡

`pnpm run capture:mvp048`でempty / ready / blocked / terminal evidenceのPNGを生成し、実験ディレクトリとrepo rootの`assets/`へ保存する。
