# Verification Plan: AIDD Control Plane MVP 032

## 品質ゲート

```text
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run mock:doctor
pnpm run capture:mvp032
```

## 画面状態

- empty: `Codex Run Queue: empty` とqueue未生成メッセージを確認する。
- valid: waiting / running / succeeded、標準検証、3ブラウザ、terminal / screenshot / playwright evidence、retry / rollback、AIDD-Spec接続を確認する。
- failure: failed / evidence_missing、Run Authorization Gate valid由来でない、危険なcommand、Firefox除外、浅い検証、証跡不足、rollback不足を確認する。

## 証跡

Verification Evidenceとしてterminal evidenceとempty / valid / failure / terminal evidenceスクリーンショットを保存する。
