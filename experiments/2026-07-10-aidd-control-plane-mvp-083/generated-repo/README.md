# MVP083 Smoke Repair Priority Gate

AIDD Control PlaneのSaaS化実験です。Preview Smoke / Repair Actionで見つかった複数の修正候補を、今回実行する1件、次回送り、Learning Log戻しへ分けます。

## 状態

- `empty`: Repair Action候補待ち
- `prioritized`: 1件に絞り込み済み
- `conflict`: 高severity複数・証跡不足・実行予算超過などで判断保留
- `blocked`: private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、rollback不足、AIDD-Spec接続不足、execute_now以外混入を止める

## 検証

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp083
```

## AIDD-Spec接続

AIDD-Spec v0.1の Verification Evidence / Review Record / Learning Log / AI Task Packet Delta に接続します。
