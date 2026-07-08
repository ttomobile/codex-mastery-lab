# AIDD Control Plane MVP070 generated app

Shrunk Packet Handoff ReceiptのNext.js実装。

## 状態

- empty: source shrink plan未選択でblocked。
- valid: execute_now、defer_next_increment、minimum verification、Chromium / Firefox / WebKit、terminal evidence、initial screenshot、filled screenshot、failure screenshot、Playwright report、rollback、AIDD-Spec v0.1接続が揃う。
- blocked: Firefox除外、failure screenshot不足、rollback不足、公開用prompt混入を止める。

## Commands

- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp070
