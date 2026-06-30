あなたはAIDD Control Plane SaaSのMVP 009を実装するCodexです。

対象ディレクトリ: experiments/aidd-control-plane-mvp-009/generated-repo

やること:
1. 既存のMVP 008相当の実装をベースに、CI Artifact Importerを追加してください。
2. 日本語UIで、CI run URL、commit SHA、workflow名、job結果、artifact URL、Playwright report URLを取り込み、Artifact Evidence Binderへ反映してください。
3. empty / valid / failure のサンプル切替を用意してください。
4. failureでは、壊れたURL、短すぎるcommit SHA、失敗job、不足artifactをReview FindingとNext AI Task Packet Deltaへ戻してください。
5. docs/product-brief.md, docs/verification-plan.md, docs/review-record.md, docs/learning-log.md をMVP 009向けに更新してください。
6. unit test、Playwright E2E、doctor:aidd、キャプチャスクリプトを更新してください。
7. 日本語テスト名・日本語UI・AIDD-Spec v0.1接続を守ってください。
8. runtime生成物（node_modules, .next, coverage, playwright-report, test-results, *.tsbuildinfo）は作ってもコミット対象にしないでください。

完了条件:
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
が通る状態にしてください。
