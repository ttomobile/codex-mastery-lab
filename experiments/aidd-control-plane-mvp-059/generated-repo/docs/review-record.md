# Review Record: MVP059

## Decision

AIDD Control Plane MVP059として、MVP058 Review Recordのsource reviewから次に実行する1インクリメントを選ぶNext Increment Plannerを採用する。

## Rationale

source reviewが十分でも、証跡不足やrollback不足が残ると次のCodex実行へ渡す指示が不安定になる。MVP059ではready、blocked、evidence_missingを分け、blockedは標準Review Finding形式、evidence_missingは最優先の修復インクリメントとして扱う。

## Scope

- empty / valid / failure / evidence_missingの4ケースをUIで表示する。
- validでは次インクリメント計画を表示する。
- failureではsource review不足、priority不足、3ブラウザE2E不足、terminal/failure screenshot不足、rollback不足、local path/private host/private network URL混入を表示する。
- evidence_missingでは証跡不足を最優先で修復する。

## Verification

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp059`
