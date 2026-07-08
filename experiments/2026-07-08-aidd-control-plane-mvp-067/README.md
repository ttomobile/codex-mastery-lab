# AIDD Control Plane MVP 067: Smoke Finding Action Queue

MVP066のPublic Preview Smoke Verifierで検出した壊れたasset / 0 byte / private URL / 証跡不足を、次回のAI Task Packetへ戻すための行動キューに変換する。

## 接続する標準

- `standards/aidd-spec-v0.1.md`: Verification Evidence / Review Record / Learning Log
- `standards/aidd-control-plane-mvp-v0.1.md`: Public Preview Smoke Verifier、Review Finding Action Queue

## 完了条件

- Next.js + TypeScript + pnpmで日本語UIを実装する
- empty / queued / blocked / exported の状態を表示する
- Smoke結果からReview Finding、実行lane、AI Task Packet patch、Codex prompt patch、検証コマンド、必要証跡、rollback条件を生成する
- execute_nowだけがCodex prompt previewへ入ることをテストで保証する
- private URL、local path、Firefox不足、terminal evidence不足、AIDD-Spec接続不足をblockedにする
- lint / typecheck / test / build / 3ブラウザE2E / doctor:aidd を通す
- 画像証跡を empty / valid(queued/exported) / failure(blocked) / terminal evidence で保存する
