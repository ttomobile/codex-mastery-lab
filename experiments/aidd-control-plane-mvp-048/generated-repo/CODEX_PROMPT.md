# Codex Prompt: AIDD Control Plane MVP 048

`experiments/aidd-control-plane-mvp-048/generated-repo/`に、AIDD Control Plane SaaSのOne-Run Execution Readiness Gate MVPを実装する。

## 必須要件

- Next.js + TypeScript + pnpm。
- UIとテスト名は日本語。
- empty / ready / blockedの3状態を表示する。
- ready状態はReview Finding Action Queueの`execute_now` 1件だけをCodex実行へ渡す直前の手渡し確認として見せる。
- blocked状態はsource queue id不足、execute_now以外のaction混入、危険command、sandbox mode不足、required verification commands不足、Firefox除外、terminal evidence不足、failure screenshot不足、rollback stop condition不足、local path / host / private network URL混入、AIDD-Spec connection不足を表示する。
- Codex command previewにはreadyな`execute_now` actionだけを入れ、`next_increment`や`learning_log`を混ぜない。
- AIDD-Spec v0.1、Verification Evidence、Review Record、Learning Logへの接続を表示する。

## 必須スクリプト

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp048`

## 証跡

`capture:mvp048`でempty / ready / blocked / terminal evidenceのPNGを実験ディレクトリとrepo rootの`assets/`へ保存する。
