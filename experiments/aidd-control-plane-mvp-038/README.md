# AIDD Control Plane MVP 038: Execution Priority Set Builder

MVP 037のRepair Delta Priority Decision Workspaceで採用した複数のrepair deltaを、次の1回のCodex実行へ入れる「実行前優先順位セット」に絞るワークスペースを作る。

## 目的

AIDD-Spec v0.1のAI Task Packet / Review Record / Verification Evidenceを、次回実行直前のスコープ制御へ接続する。採用済みdeltaが複数ある場合でも、全部を同時に投げず、今回実行するもの・次回へ回すもの・Learning Logへ戻すものを分け、実行予算、検証コマンド、rollback条件を確認する。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- `standards/templates/ai-task-packet-template-v0.1.md`
- `standards/templates/verification-evidence-template-v0.1.md`

## 完了条件

- 日本語UIでExecution Priority Set Builderを表示できる
- empty / valid / failure状態を切り替えられる
- valid状態で今回実行、次回送り、Learning Log戻しを分けて表示する
- 今回実行するdeltaだけがCodex prompt previewへ入る
- failure状態で優先順位重複、実行予算不足、検証コマンド不足、rollback不足、未採用delta混入、Firefox除外、local path/host/tailnet混入を検出する
- lint / typecheck / test / build / 3ブラウザE2E / doctor:aiddが通る
- empty / valid / failure / terminal evidence画像を残す
