# AIDD Control Plane MVP 039: One-Run Handoff Pack Reviewer

## 目的

MVP 038のExecution Priority Set Builderで `execute_now` に絞ったrepair deltaを、次の1回のCodex実行へ渡す直前の「手渡しパック」として確認する。

AIDD Control Planeは、AIへ曖昧に「これを直して」と渡すSaaSではない。今回実行する範囲、AI Task Packet追記、Codex prompt、検証コマンド、必要証跡、rollback条件、note記事の観点を一画面で確認し、実行前に不足を止める。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
  - AI Task Packet
  - Verification Evidence
  - Review Record
  - Learning Log
- `standards/aidd-control-plane-mvp-v0.1.md`
  - Execution Priority Set Builderの次段としてOne-Run Handoff Pack Reviewerを追加する

## 実装対象

- `experiments/aidd-control-plane-mvp-039/generated-repo/`
- 日本語UI、日本語テスト名、日本語記事を前提にする
- Next.js + TypeScript + pnpm

## 検証

個別に実行し、`artifacts/aidd-control-plane-mvp-039/terminal/*.txt` に保存する。

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```

## 証跡

- empty / initial
- filled / valid
- failure state
- terminal evidence

を `assets/` と `experiments/aidd-control-plane-mvp-039/artifacts/screenshots/` に保存する。
