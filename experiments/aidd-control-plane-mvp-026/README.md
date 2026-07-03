# AIDD Control Plane MVP 026: Packet Apply Command Composer

## 目的

MVP 025で生成した `AI_TASK_PACKET.md` / `CODEX_PROMPT.md` / `VERIFICATION_PLAN.md` previewを、まだ自動適用せず、実ファイル反映直前の安全なコマンド計画として確認する。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md`: AI Task Packet / Verification Evidence / Review Record
- `standards/aidd-control-plane-mvp-v0.1.md`: Dogfood Packet Markdown Reviewの次段として、Packet Apply Command Composerを追加

## 成功条件

- 日本語UIで empty / valid / failure state を表示する
- valid stateでは対象ファイル、apply command、dry-run command、verification command、rollback command、証跡保存先を確認できる
- failure stateでは危険なtarget path、rollback不足、検証不足、未レビューMarkdown混入を止める
- unit test / 3ブラウザE2E / doctor:aidd / buildを通す
- assetsとartifacts/screenshotsに画面証跡を保存する
