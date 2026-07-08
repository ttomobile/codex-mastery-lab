# Verification Plan: MVP070

- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp070

3ブラウザE2EはChromium / Firefox / WebKitを必須にする。証跡はterminal evidence、initial screenshot、filled screenshot、failure screenshot、Playwright reportを要求する。
