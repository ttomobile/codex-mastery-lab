# AIDD Control Plane MVP 069: Codex Run Budget Shrink Planner

MVP068のOne-Run Execution Readiness Gateで、実行直前に`ready / blocked`を判定できるようになった。MVP069では、実行予算・時間・証跡枠が足りず`brake / stop`になったときに、単に止めるのではなく、今回やる最小単位へ畳んだAI Task Packetを生成する。

## 目的

- `keep_now`と`defer_next_increment`を分ける。
- `minimum_verification`を明示して、検証を消さずに縮小する。
- `fallback_action`と`resume_condition`をLearning Logへ戻す。
- local path / private host / private network URLを公開用promptから除去する。
- AIDD-Spec v0.1のAI Task Packet / Verification Evidence / Review Record / Learning Logと、`standards/aidd-control-plane-mvp-v0.1.md`のCodex Run Budget Shrink Plannerへ接続する。

## 実装範囲

`generated-repo/` にNext.js + TypeScriptアプリを作る。UI、テスト名、サンプルデータ、記事は日本語を基本にする。

## 状態

- ready: 予算内でそのまま実行できる。
- brake: 実行範囲を縮小すれば今回進められる。
- stop: 証跡・rollback・3ブラウザなどが足りず、実行を止めてLearning Logへ戻す。
- sanitized: 公開用に危険文字列を除去した縮小promptを確認する。

## 検証

個別ログを`artifacts/terminal/*.txt`に保存する。

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp069
