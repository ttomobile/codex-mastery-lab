# AI Task Packet: AIDD Control Plane MVP 027

## タスク

AIDD Control PlaneのMVP 027として、Packet Apply Command Composerの出力を実ファイルへ反映する前に、diff bundle、dry-run結果、rollback evidence、verification commandをまとめてレビューする `Diff Bundle & Rollback Evidence Workspace` を追加する。

## UI要件

- UIコピー、テスト名、記事は日本語
- empty / valid / failure stateを持つ
- critical gatesは初期表示から見える
- AIDD-Spec v0.1とControl Plane標準への接続を表示する
- 料理の手順確認のように、実行前に材料・手順・失敗時の戻し方・記録場所を確認する比喩で説明する

## 受け入れ条件

- valid sampleは3件以上のdiff bundleを表示する
- valid sampleはbefore hash / after hash / diff bundle path / dry-run command + status / rollback evidence path / verification command / reviewer checklistを表示する
- failure sampleは危険なtarget path、ローカルパス、dry-run未実行、rollback evidence不足、verification不足、未レビューbundle、AIDD-Spec接続不足をissuesとして表示する
- `pnpm run lint` / `typecheck` / `test` / `build` / `test:e2e` / `doctor:aidd` が通る
- スクリーンショットを empty / valid / failure / terminal evidence の4種類保存する
