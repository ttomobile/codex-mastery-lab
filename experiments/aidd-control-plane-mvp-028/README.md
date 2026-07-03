# AIDD Control Plane MVP 028: Diff Bundle Decision Ledger

## 目的

MVP 027のDiff Bundle & Rollback Evidence Workspaceで束ねたbundleを、採用 / 却下 / 保留の判断として保存し、理由・判断者・判断時刻・次の行動・Review Record接続を追跡できる台帳へ進める。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md`: Review Record、Verification Evidence、Learning Log、Rollback Plan
- `standards/aidd-control-plane-mvp-v0.1.md`: Diff Bundle Decision Ledgerを追加し、Diff Bundle & Rollback Evidence Workspaceの次段に置く

## 成功条件

- 日本語UIで empty / valid / failure state を表示する
- valid stateではbundle id、decision（採用/却下/保留）、decision owner、decision reason、decided at、review evidence path、next action、rollback confirmed、verification command、AIDD-Spec接続を確認できる
- failure stateでは未判断、理由不足、証跡不足、rollback未確認、危険なlocal path / host名混入、採用済みなのにverification command不足を止める
- 採用済みbundleだけが次回AI Task Packet / Codex promptへ進むことを画面とdoctorで確認できる
- lint / typecheck / test / build / 3ブラウザE2E / doctor:aiddを通す
- assetsとartifacts/screenshotsにempty / valid / failure / terminal evidenceを保存する
