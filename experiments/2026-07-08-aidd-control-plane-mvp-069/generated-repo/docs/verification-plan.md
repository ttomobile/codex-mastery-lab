# Verification Plan: MVP069

## 品質ゲート

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp069

## E2E

Chromium / Firefox / WebKitで次を確認する。

- ready状態ではsource packet id、keep_now、minimum verificationが見える。
- brake状態ではkeep_nowとdefer_next_incrementが分かれて見える。
- stop状態では最低検証不足、3ブラウザ不足、terminal/failure screenshot不足、rollback不足、prompt混入が見える。
- sanitized状態ではCodex prompt preview（keep_nowのみ）からdefer_next_incrementとprivate hostが消える。

## Evidence

- terminal logs: artifacts/terminal/*.txt
- screenshots: artifacts/screenshots/*.png
- Playwright report: playwright-report
- AIDD-Spec v0.1 / Verification Evidence / Review Record / Learning Log connection
