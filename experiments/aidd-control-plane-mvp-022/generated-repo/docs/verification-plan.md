# Verification Plan: AIDD Control Plane MVP 022

## 品質ゲート

```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp022
```

## 画面状態

- empty: `Packet Draft Workspace: empty` とドラフト未生成メッセージを確認する。
- valid: AI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.md / LEARNING_LOG.md のドラフト、コピー用Codex prompt、verification command、rollback condition、AIDD-Spec接続を確認する。
- failure: draft body不足、source delta id不足、verification command不足、rollback condition不足、file target重複または衝突、未採用delta混入、AIDD-Spec接続不足を確認する。

## 証跡

Verification Evidenceとしてterminal evidenceとempty / valid / failure / terminal evidenceスクリーンショットを保存する。
