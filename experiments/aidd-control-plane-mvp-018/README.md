# AIDD Control Plane MVP 018

## テーマ

Spec Update Proposalを採用したとき、AI Task PacketとCodex promptがどう変わるかを事前に確認できる「AI Task Packet Delta Apply Preview」を追加する。

## 背景

MVP 017では、Review Finding / Learning Logを標準更新候補としてQueueに載せた。次の自然な詰まりは、候補を採用しても、次回のAI Task Packetへ何が入るのかが見えないこと。AIDD Control Planeが「誰でもベストに近いAI駆動開発フローと設計ドキュメントを作れるSaaS」になるには、採用前に差分・受け入れ条件・検証コマンド・リスクをレビューできる入口が必要。

## 実装対象

- `generated-repo/` にMVP 017を引き継いだNext.js + TypeScriptアプリを置く。
- UIセクション: `AI Task Packet Delta Apply Preview`
- 状態: `empty` / `valid` / `failure`
- validでは、Spec Update Proposalから次回AI Task Packetへ追加される差分、Codex promptへの追加文、検証計画の追加、採用後チェックリストを表示する。
- failureでは、差分の根拠、対象packetセクション、検証コマンド、rollback条件が足りない候補をReview Findingとして表示する。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md` のAI Task Packet / Verification Evidence / Review Record / Learning Log / Spec Improvementの往復に接続する。
- `standards/aidd-control-plane-mvp-v0.1.md` のSpec Update Proposal Queueの次段として扱う。

## 検証

個別に以下を実行し、`artifacts/terminal/*.txt`へ保存する。

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp018`
