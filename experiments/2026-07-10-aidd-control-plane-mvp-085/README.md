# AIDD Control Plane MVP085: Final Receipt Failure Handoff Queue

MVP084のPublic Preview Smoke Final Receiptで見つかったfailure / blockedを、次の1回で実行するaction queueへ変換する実験。

## 目的

- final receiptのHTTP失敗を、Review Findingで終わらせず、execute_now / next_increment / learning_logへ分離する。
- Codex prompt previewにはexecute_nowだけを入れる。
- terminal evidence、failure screenshot、3ブラウザE2E、rollback condition、AIDD-Spec接続を必須化する。

## 接続する標準

- `standards/aidd-spec-v0.1.md`: Verification Evidence / Review Record / Learning Log
- `standards/aidd-control-plane-mvp-v0.1.md`: Public Preview Smoke Final Receiptの後段

## 実装先

`generated-repo/`

## 検証

`generated-repo/artifacts/terminal/*.txt` に個別ログを保存する。
