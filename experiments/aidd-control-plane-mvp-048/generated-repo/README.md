# AIDD Control Plane MVP 048

## 機能名

One-Run Execution Readiness Gate

## 目的

Review Finding Action Queueの`execute_now`を1件だけCodex実行へ渡す直前確認として表示し、証跡不足・危険command・AIDD-Spec接続不足を実行前に止める。

## 必須スクリプト

```text
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp048
```

## 受け入れ条件

- UIは日本語。
- empty / ready / blockedの3状態を表示する。
- readyではReview Finding Action Queueの`execute_now` 1件だけをCodex command previewへ入れる。
- blockedではsource queue id不足、execute_now以外のaction混入、危険command、sandbox mode不足、required verification commands不足、Firefox除外、terminal evidence不足、failure screenshot不足、rollback stop condition不足、local path / host / private network URL混入、AIDD-Spec connection不足を表示する。
- AIDD-Spec v0.1、Verification Evidence、Review Record、Learning Logへの接続を表示する。
