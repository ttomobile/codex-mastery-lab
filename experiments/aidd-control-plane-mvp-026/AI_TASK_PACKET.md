# AI Task Packet: AIDD Control Plane MVP 026

## タスク

AIDD Control PlaneのMVP 026として、Dogfood Packet Markdown Reviewの出力を実ファイルへ反映する直前に、apply command / dry-run / verification / rollback / evidence path を確認する `Packet Apply Command Composer` を追加する。

## UI要件

- UIコピー、テスト名、記事は日本語
- empty / valid / failure stateを持つ
- critical gatesは初期表示から見える
- AIDD-Spec v0.1とControl Plane標準への接続を表示する

## 受け入れ条件

- valid sampleは3ファイル分のapply planを表示する
- failure sampleは危険なtarget path、rollback不足、verification不足、未レビューMarkdown混入をissuesとして表示する
- `pnpm run lint` / `typecheck` / `test` / `build` / `test:e2e` / `doctor:aidd` が通る
- スクリーンショットを empty / valid / failure / terminal evidence の4種類保存する
