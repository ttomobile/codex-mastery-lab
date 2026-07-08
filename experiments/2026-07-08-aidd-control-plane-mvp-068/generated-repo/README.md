# AIDD Control Plane MVP068

One-Run Execution Readiness Gate。Smoke Finding Action Queueのexecute_now itemをCodex Run Queueへ入れる直前に検査するNext.js + TypeScriptアプリです。

## Scripts

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp068`

UIは日本語で、empty / ready / blocked / sanitized の4状態を持ちます。
