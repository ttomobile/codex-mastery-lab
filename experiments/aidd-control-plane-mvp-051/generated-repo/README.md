# AIDD Control Plane MVP 051 generated repo

Repair Delta Priority Decision Workspace

## Commands

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp051
```

## Acceptance

- 画面内に`AIDD Control Plane MVP051`と`Repair Delta Priority Decision Workspace`を表示する。
- empty / ready / failureを切り替えられる。
- readyでは採用 / 保留 / 却下を表示し、採用済みdeltaだけを次回packet previewへ進める。
- failureでは未判断、理由不足、証跡不足、rollback不足、Firefox除外、未採用delta混入、local path / host / private network URL混入を検出する。
- `doctor:aidd`はMVP051固有token、AIDD-Spec接続、capture script、3ブラウザE2E設定、local pathブロック文言を確認する。
