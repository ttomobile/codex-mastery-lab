# AIDD Control Plane MVP 080: Run Queue Dispatch Receipt

MVP079のRepair Action Run Queue Intakeで投入可能になった1件のexecute_now payloadを、実行直前/実行後のDispatch Receiptとして記録する実験。

- 接続標準: `standards/aidd-spec-v0.1.md`, `standards/aidd-control-plane-mvp-v0.1.md`
- 実装先: `generated-repo/`
- 重点: queue payloadがexecute_nowだけであること、実行コマンド・証跡・rollback・sanitize結果をReceipt化し、失敗時は次のRepair Actionへ戻せる形で表示する。
