# AIDD Control Plane MVP069

Codex Run Budget Shrink Planner。One-Run Execution Readiness Gateで`brake / stop`になった実行候補を、今回やる最小単位へ畳むNext.js + TypeScriptアプリです。

## Scripts

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp069`

UIは日本語で、ready / brake / stop / sanitized の4状態を持ちます。AIDD-Spec v0.1のAI Task Packet / Verification Evidence / Review Record / Learning Logと、AIDD Control Plane MVP標準のCodex Run Budget Shrink Plannerへ接続します。
