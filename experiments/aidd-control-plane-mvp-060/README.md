# AIDD Control Plane MVP 060: Verification Run Detail

MVP059のNext Increment Plannerで選んだ次の1インクリメントを、実行結果の各コマンド詳細へ分解してレビューできるようにする実験。

## 目的

AIDD Control Plane利用者が、Codex Run Queueの1件について「pnpm run lintは通ったが、test:e2eのFirefoxだけ失敗した」「artifact pathが足りない」「失敗分類と修正指示がない」といった状態を、コマンド別のVerification Evidenceとして確認できるようにする。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- Verification Evidence
- Review Record
- Learning Log
- AI Task Packet
- Codex Run Queue
- Next Increment Planner

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
