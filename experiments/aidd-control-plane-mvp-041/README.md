# AIDD Control Plane MVP 041: Verification Evidence Receipt / Command Result Binder

MVP 040で作ったCodex Run Start Receipt Auditorの次段として、開始レシートに紐づく個別検証コマンド結果を1枚のVerification Evidence Receiptへ束ねる。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- Verification Evidence
- Review Record
- Learning Log

## 今回の1インクリメント

- `generated-repo/` にCommand Result Binderを追加する。
- lint/typecheck/test/build/e2e/doctor:aiddの各結果を、exit code、ログpath、duration、artifact、失敗分類、修正指示として見える化する。
- empty / valid / failure の状態をUI、unit test、E2E、画像証跡で確認する。

## 非ゴール

- 実際のCI API取り込みはしない。
- DB永続化やログアップロードAPIは作らない。
- 実際のCodex実行はUIから起動しない。
