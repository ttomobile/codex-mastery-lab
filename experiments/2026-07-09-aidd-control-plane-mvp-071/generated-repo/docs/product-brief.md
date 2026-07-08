# MVP071 Product Brief

## 体験

AIDD Control Plane MVP071は、Handoff Receiptを見た後に次回Codex実行へ進めるか、保留するか、止めるかをReview Recordとして残す小さなSaaS画面です。

## ゴール

- empty / approved / held / blocked を日本語UIで切り替える。
- approvedでは、source handoff receipt、decision owner、decision reason、approved execute_now、Codex command draft、verification commands、required evidence、rollback condition、AIDD-Spec接続を表示する。
- Codex command draftにはapproved execute_nowだけを入れ、deferやheld理由を混ぜない。
- blockedでは未承認、理由不足、3ブラウザ不足、evidence不足、local path/private host/private network URL混入を検出する。

## 非ゴール

- 実際のCodex実行キュー投入はしない。
- 外部GitHub APIは呼ばない。
- 実サービス名、公式ロゴ、秘密情報は使わない。

## 主要フロー

1. reviewerがempty状態で判断材料なしを確認する。
2. approvedへ切り替え、execute_nowだけで作られたCodex command draftを確認する。
3. heldへ切り替え、hold reasonとLearning Log返却を確認する。
4. blockedへ切り替え、停止理由と公開前サニタイズ違反を確認する。

## 検証

`pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd`, `pnpm run capture:mvp071` で独立検証できるログと画像を `artifacts/` に残します。
