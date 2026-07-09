# AIDD Control Plane MVP085

Final Receipt Failure Handoff Queue の実験アプリです。

公開previewの最終レシートで見つかった failure / blocked を、次の1回で実行する Review Finding action へ変換します。

## 状態

- `?state=empty`: action未生成
- `?state=queued`: execute_now / next_increment / learning_log へ分離済み
- `?state=blocked`: private URL、local path、host名、Firefox未確認、terminal evidence不足、failure screenshot不足、rollback不足、AIDD-Spec接続不足で停止
- `?state=exported`: execute_nowだけをCodex prompt previewへ出力

## 検証

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp085
```

## AIDD-Spec接続

AIDD-Spec v0.1の Verification Evidence / Review Record / Learning Log と、AIDD Control Plane MVP v0.1の Public Preview Smoke Final Receipt 後段に接続します。
