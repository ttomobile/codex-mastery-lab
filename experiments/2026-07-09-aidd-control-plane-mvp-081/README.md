# AIDD Control Plane MVP 081: Dispatch Receipt History Comparator

MVP080のRun Queue Dispatch Receiptを1件のレシートで終わらせず、複数回の実行Receiptを横並びに比較し、「同じ失敗が減ったか」「どのRepair Actionが効いたか」を判断する履歴ビューの実験。

- 接続標準: `standards/aidd-spec-v0.1.md`, `standards/aidd-control-plane-mvp-v0.1.md`
- 実装先: `generated-repo/`
- 重点: receipt history、before/after比較、recurring finding検出、effective repair action、blocked evidence、次回AI Task Packet deltaを日本語UIで表示し、3ブラウザE2Eとdoctor:aiddで確認する。
