# Verification Plan

- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp068

E2EはChromium / Firefox / WebKitを対象にし、empty / ready / blocked / sanitizedを確認する。Verification Evidenceとしてterminal evidence、empty screenshot、ready screenshot、blocked screenshot、failure screenshot、Playwright reportを保存する。
