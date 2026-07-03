# AIDD Control Plane MVP 023: Safe Patch Review Workspace

MVP 023は、MVP 022のPacket Draft Workspaceで生成した次回AI依頼ドラフトを、実ファイルへ反映する前に安全なpatch候補として確認するインクリメントです。

## 目的

AIDD Control Planeを「採用済みdeltaから下書きを作る」段階から、「どのファイルへ、どの差分を、どの条件で適用してよいかを人間とAIが同じ画面で確認する」段階へ進めます。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md`
  - AI Task Packet
  - Verification Evidence
  - Review Record
  - Learning Log
- `standards/aidd-control-plane-mvp-v0.1.md`
  - Packet Draft Workspaceの次段としてSafe Patch Review Workspaceを追加する

## 完了条件

- Next.js + TypeScript + pnpm
- UI、テスト名、記事本文は日本語
- Safe Patch Review Workspaceで `empty` / `valid` / `failure` を切り替えられる
- valid状態で `AI_TASK_PACKET.md` / `CODEX_PROMPT.md` / `VERIFICATION_PLAN.md` / `LEARNING_LOG.md` のpatch候補を表示する
- failure状態で、危険な適用条件をReview Findingとして表示する
- lint / typecheck / test / build / test:e2e / doctor:aiddを個別実行し、ログを保存する
- empty / valid / failure / terminal evidence画像を保存する
