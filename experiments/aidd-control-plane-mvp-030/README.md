# AIDD Control Plane MVP 030: Exported Packet Preflight Reviewer

MVP 029のAdopted Bundle Exporterの次段として、採用済みbundleから生成された次回AI Task Packet / Verification Plan / Codex promptを、Codexへ渡す直前にpreflight reviewする。

## 目的

- 採用済みbundle export後、次回AI依頼として渡してよいかを確認する入口を作る。
- AI Task Packet / Verification Plan / Codex prompt / rollback / evidence path / AIDD-Spec接続がそろっているかをUIで見せる。
- 却下・保留bundle、浅い検証、Firefox除外、ローカルパス、host名、tailnet情報、rollback不足を止める。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log
- Rollback Plan

## 完了条件

- 日本語UIでempty / valid / failure状態を表示する。
- `pnpm run lint`, `typecheck`, `test`, `build`, `test:e2e`, `doctor:aidd` が通る。
- `pnpm run capture:mvp030` でempty / valid / failure / terminal evidence画像を保存する。
- 記事とpreviewにスクリーンショットを掲載する。
