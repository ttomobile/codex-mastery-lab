あなたはAIDD Control Plane SaaSのMVP 008を実装するCodexです。

対象ディレクトリ: experiments/aidd-control-plane-mvp-008/generated-repo

やること:
1. 既存のMVP 007をベースに、Artifact Evidence Binderを追加してください。
2. 日本語UIで、terminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを束ねて状態判定してください。
3. empty / valid / failure のサンプル切替を用意してください。
4. failureでは、壊れたURL、不足証跡、古いログをReview FindingとNext AI Task Packet Deltaへ戻してください。
5. docs/product-brief.md, docs/verification-plan.md, docs/review-record.md, docs/learning-log.md をMVP 008向けに更新してください。
6. unit test、Playwright E2E、doctor:aiddを更新してください。
7. 日本語テスト名・日本語UI・AIDD-Spec v0.1接続を守ってください。

完了条件:
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
が通る状態にしてください。
