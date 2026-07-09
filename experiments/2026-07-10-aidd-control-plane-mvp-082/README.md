# AIDD Control Plane MVP082: Smoke Receipt Repair Action Planner

MVP081のDispatch Receipt履歴比較の次段として、公開preview smokeで見つかった失敗・blocked状態を、次の1回で実行するRepair Actionへ変換するSaaS入口を検証する。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- AIDD Control Plane MVP機能: `Smoke Receipt Repair Action Planner`

## 実装先

- `generated-repo/`: Next.js + TypeScript + pnpm
- UI、テスト名、docs、記事は日本語を基本にする。

## 完了条件

- `?state=empty|planned|failure|blocked` で状態を切り替えられる。
- Preview Smoke Receiptの broken URL / finding category / severity / lane / priority reason を表示する。
- execute_now action、next_increment、learning_logを分離し、Codex prompt previewにはexecute_nowのみを入れる。
- AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connectionを表示する。
- blockedでは private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、AIDD-Spec接続不足、execute_now以外混入を止める。
- `lint / typecheck / test / build / test:e2e / doctor:aidd` を独立実行し、terminal evidenceを保存する。
- empty / planned / failure / blocked / terminal evidence のスクリーンショットを保存する。
