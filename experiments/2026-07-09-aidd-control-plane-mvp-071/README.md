# AIDD Control Plane MVP071: Handoff Decision Ledger

MVP070のShrunk Packet Handoff Receiptを見た後、次回Codex実行へ進めるか・保留するか・止めるかをReview Recordとして判断する小さなSaaS画面を作る。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md` の `Handoff Decision Ledger`
- AI Task Packet / Verification Evidence / Review Record / Learning Log

## 完了条件

- 日本語UIで empty / approved / held / blocked を切り替えられる。
- 未承認、理由不足、3ブラウザ不足、evidence不足、local path / private host / private network URL混入をblockedとして表示する。
- approved execute_nowだけがCodex command draftへ進むことを画面とテストで確認する。
- lint / typecheck / test / build / 3ブラウザE2E / doctor:aidd / capture が通る。
- initial / approved / blocked / terminal evidence画像を保存する。
