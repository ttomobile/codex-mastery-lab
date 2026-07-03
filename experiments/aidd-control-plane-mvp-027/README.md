# AIDD Control Plane MVP 027: Diff Bundle & Rollback Evidence Workspace

## 目的

MVP 026のPacket Apply Command Composerで作った反映直前コマンドを、まだ自動適用せず、diff bundle / dry-run結果 / rollback evidence / verification evidence を同じ単位で保存・レビューする画面へ進める。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md`: AI Task Packet、Verification Evidence、Review Record、Learning Log
- `standards/aidd-control-plane-mvp-v0.1.md`: Diff Bundle & Rollback Evidence Workspaceを追加し、Packet Apply Command Composerの次段に置く

## 成功条件

- 日本語UIで empty / valid / failure state を表示する
- valid stateではbundle id、source patch/apply plan、target file、before/after hash、diff bundle path、dry-run status、rollback evidence、verification commandを確認できる
- failure stateでは危険なtarget path、ローカルパス混入、dry-run未実行、rollback evidence不足、verification不足、未レビューbundleを止める
- unit test / 3ブラウザE2E / doctor:aidd / buildを通す
- assetsとartifacts/screenshotsに画面証跡を保存する
