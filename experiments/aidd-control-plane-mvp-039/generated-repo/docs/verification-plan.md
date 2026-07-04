# Verification Plan: AIDD Control Plane MVP 033

## 品質ゲート

```text
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run mock:doctor
pnpm run capture:mvp033
```

## 画面状態

- empty: `Run Result Review Synthesizer: empty` と結果レビュー未生成メッセージを確認する。
- valid: sourceRunId、outcome、score、Review Finding、AI Task Packet delta、Codex prompt delta、Verification command、Learning Logを確認する。
- failure: terminal evidence不足、screenshot不足、Firefox除外、doctor:aidd未実行、rollback未確認、ローカル環境名/非公開URL混入、prompt delta不足を確認する。

## 証跡

Verification Evidenceとしてterminal evidenceとempty / valid / failure / terminal evidenceスクリーンショットを保存する。
