# AIDD Control Plane MVP 019

## テーマ

AI Task Packet Deltaに「採用 / 却下 / 保留」の判断を持たせ、誰が・いつ・なぜ判断したかをReview Recordとして残す「Delta Decision Review」を追加する。

## 背景

MVP 018では、Spec Update Proposalを次回AI Task Packet差分として採用する前に、追加acceptance criteria、verification command、Codex prompt patch、rollback conditionを確認できるようにした。次の自然な詰まりは、差分を見たあとに「採用するのか、保留するのか、却下するのか」が記録されないこと。

AIDD Control Planeが「誰でもベストに近いAI駆動開発フローと設計ドキュメントを作れるSaaS」になるには、改善候補の判断理由を残し、次回のAI依頼へ入れてよい差分だけを選べる必要がある。

## 実装対象

- `generated-repo/` にMVP 018を引き継いだNext.js + TypeScriptアプリを置く。
- UIセクション: `Delta Decision Review`
- 状態: `empty` / `valid` / `failure`
- validでは、AI Task Packet Deltaごとに採用 / 却下 / 保留、decision owner、decision reason、decided at、next action、review evidenceを表示する。
- failureでは、判断者不足、理由不足、rollback確認不足、採用なのにverification command不足、却下なのに再発防止メモ不足をReview Findingとして表示する。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md` のReview Record / Learning Log / Spec Improvementに接続する。
- `standards/aidd-control-plane-mvp-v0.1.md` のAI Task Packet Delta Apply Previewの次段として扱う。
- 採用済みdeltaだけが次回AI Task Packet / Codex promptへ進む、という運用ルールを明示する。

## 検証

個別に以下を実行し、`artifacts/terminal/*.txt`へ保存する。

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp019`
