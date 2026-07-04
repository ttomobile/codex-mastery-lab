# AIDD Control Plane MVP 037: Repair Delta Priority Decision Workspace

MVP 036のEvidence Repair Delta Generatorで生成した複数の修正候補を、次の1インクリメントに採用するもの、保留するもの、却下するものへ分けるワークスペースを作る。

## 目的

AIDD-Spec v0.1のReview Record / Learning Log / Verification Evidenceを、AIDD Control Planeの実行判断に接続する。失敗ログから生まれたrepair deltaを全部まとめて次回依頼へ流し込まず、優先順位、採用理由、証跡、rollback条件を確認してから次のAI Task Packetへ進める。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- `standards/templates/ai-task-packet-template-v0.1.md`
- `standards/templates/verification-evidence-template-v0.1.md`

## 完了条件

- 日本語UIでPriority Decision Workspaceを表示できる
- empty / valid / failure状態を切り替えられる
- valid状態で採用・保留・却下のrepair deltaを分けて表示する
- 採用済みdeltaだけが次回AI Task Packet / Codex promptへ進むことを示す
- failure状態で未判断、理由不足、証跡不足、rollback不足、Firefox除外、local path/host/tailnet混入を検出する
- lint / typecheck / test / build / 3ブラウザE2E / doctor:aiddが通る
- empty / valid / failure / terminal evidence画像を残す
