# SagaForge Trial 001

商標・既存IP・公式素材を使わず、キャラクター収集型ターン制RPGの一般的な操作パターンを抽象化した日本語モバイルWebプロトタイプです。

## 開発コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run mock:doctor
pnpm run doctor:playwright
pnpm run test:e2e
```

## mock service

Trial 001では軽量化のため、`mock-api`、`mock-media`、`mock-auth`、`mock-billing`相当の状態を1つのNode mock serviceへ集約しています。

- `GET /health`
- `GET /state`
- `POST /__control/state`

Docker Compose定義は含めていますが、ローカルではNode fallbackを優先して検証できます。
