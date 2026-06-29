# Verification Evidence: AIDD Control Plane MVP 003

## 必須コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```

## 期待される証跡

- Command log: lint / typecheck / test / build / e2e / doctor
- Screenshot: ready画面、terminal evidence画像
- Report link: CI run URL、Playwright report、coverage report
- Preview JSON: command_logs、screenshots、reports、missing_evidence、warnings

## ローカル検証結果

- `pnpm install --frozen-lockfile`: pass
  - 初回はpnpmのbuild script承認待ちで停止した。
  - `pnpm approve-builds --all`でesbuild、sharp、unrs-resolverを承認後、再実行して成功。
- `pnpm run lint`: pass
- `pnpm run typecheck`: pass
- `pnpm run test`: pass
  - Vitest 1 file / 4 tests passed.
- `pnpm run build`: pass
  - 初回は古い生成物の影響で失敗したため、`.next`を削除して再実行し成功。
- `pnpm run test:e2e`: pass
  - Chromium 3 tests passed.
- `pnpm run doctor:aidd`: pass
  - 必須file、script、state、UI token、禁止API利用を検査。

## Evidence JSON方針

- command_logsは必須扱い。
- screenshotsは必須扱い。
- reportsはwarning扱い。
- 外部API未接続で、画面内stateからPreview JSONを生成する。
