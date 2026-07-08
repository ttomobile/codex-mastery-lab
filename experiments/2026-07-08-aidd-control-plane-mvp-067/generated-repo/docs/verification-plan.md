# Verification Plan

MVP067は次で検証する。

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp067`

E2EはChromium / Firefox / WebKitで、empty / queued / blocked / exportedを確認する。
