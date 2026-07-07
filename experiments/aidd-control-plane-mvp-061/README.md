# AIDD Control Plane MVP 061: Evidence Repair Delta Generator

MVP060のVerification Run Detailで分解した failed / timeout / evidence_missing を、次回AI Task Packet delta、Codex prompt delta、検証コマンド、rollback条件、Learning Logへ戻す実験。

## 目的

AIDD Control Plane利用者が、失敗した検証結果を見て終わりにせず、「次回Codexへ渡す修理差分」へ変換できるようにする。料理のレシピでいうと、味見で分かった不足を次回の材料メモと手順メモに戻す画面である。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- Verification Evidence
- Review Record
- Learning Log
- AI Task Packet
- Verification Run Detail
- Evidence Repair Delta Generator

## 実装先

`generated-repo/`

## 独立検証

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
