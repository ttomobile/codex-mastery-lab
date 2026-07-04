# AIDD Control Plane MVP 036: Evidence Repair Delta Generator

## 目的

MVP 035のVerification Run Detailは、command別のexit code、artifact path、失敗分類、修正指示を見える化した。MVP 036では、その失敗分類を次回AI Task Packet / Codex promptへ戻す **Evidence Repair Delta Generator** を追加する。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md`: Verification Evidence / Review Record / Learning Log / AI Task Packet
- `standards/aidd-control-plane-mvp-v0.1.md`: AIDD Control PlaneのMVP機能一覧

## 完了条件

- Evidence Repair Delta Generatorにempty / valid / failure stateがある
- failed / evidence_missing / timeoutを別々のrepair deltaとして表示する
- validではAI Task Packet delta、Codex prompt delta、verification command、rollback condition、Learning Log戻しを表示する
- failureではsource detail不足、失敗分類不足、repair instruction不足、Firefox除外、terminal/failure screenshot不足、AIDD-Spec接続不足、local path/host/tailnet混入を検出する
- 日本語UI、日本語テスト名、日本語記事で説明する
- lint / typecheck / test / build / e2e / doctor:aidd が通る
