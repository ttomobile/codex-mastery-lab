# Product Brief: AIDD Control Plane MVP 033

## 体験

Run Result Review Synthesizerは、Codex Run Queueの完了runをReview Record、Learning Log、AI Task Packet delta、Codex prompt deltaへ変換する画面です。

## ゴール

- 成功runからsourceRunId、outcome、score、Review Finding、Review Record link、Learning Logを生成する。
- AI Task Packet delta、Codex prompt delta、Verification commandを次回依頼へ戻せる形にする。
- terminal evidence不足、screenshot不足、Firefox除外、doctor:aidd未実行、rollback未確認、local path/host/tailnet混入、prompt delta不足を標準Review Findingへ変換する。

## 非ゴール

- 実際のCodexプロセス起動。
- Git commit / Pull Request作成。
- 外部LLM/API実行。

## 主要ユーザーフロー

1. `review empty` で結果レビュー未生成を確認する。
2. `queue valid` の後に `review valid` で成功runからReview Record / Learning Log / prompt deltaを確認する。
3. `review failure` で不足証跡、Firefox除外、doctor未実行、rollback未確認、公開不可情報混入、prompt delta不足を確認する。

## AIDD-Spec接続

AIDD-Spec v0.1 / AI Task Packet / Verification Evidence / Review Record / Learning Log / Rollback Plan。
