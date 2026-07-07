# AIDD Control Plane MVP 062

## テーマ

**Repair Delta Priority Decision Workspace** を作る。MVP061で生成した Evidence Repair Delta を、次の1インクリメントへ採用 / 保留 / 却下として判断し、採用済みdeltaだけを次回AI Task Packet / Codex promptへ進める。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- Verification Evidence / Review Record / Learning Log

## 受け入れ条件

- 日本語UIで empty / valid / failure / decision_needed を表示できる。
- 採用済みdeltaだけが次回packetへ進むことを画面とテストで確認できる。
- 未判断、理由不足、証跡不足、rollback不足、Firefox除外、未採用delta混入、local path / host / private network混入をReview Finding形式に戻せる。
- `lint` / `typecheck` / `test` / `build` / `test:e2e` / `doctor:aidd` が通る。
- empty / valid / failure / terminal evidence の画像を保存する。
