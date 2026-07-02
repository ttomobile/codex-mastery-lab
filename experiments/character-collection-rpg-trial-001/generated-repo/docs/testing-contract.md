# Testing Contract

## Mock endpoints

Base URL: `http://127.0.0.1:4100`

- `GET /health`: mock serviceの稼働確認。
- `GET /state`: UIが読む現在状態。
- `POST /__control/state`: E2Eや手動検証がscenarioを切り替える。

## Scenario

- `success`
- `empty_roster`
- `offline`
- `timeout`
- `battle_win`
- `battle_lose`
- `party_invalid`
- `gacha_result`
- `payment_failed`

## Gates

- `pnpm run lint`: ESLint。
- `pnpm run typecheck`: TypeScript strict check。
- `pnpm run test`: 編成、戦闘、幻晶、ready判定のunit test。
- `pnpm run test:coverage`: Vitest coverage。
- `pnpm run build`: Next.js production build。
- `pnpm run mock:doctor`: mock endpointと全scenario制御の確認。
- `pnpm run doctor:playwright`: Chromium / Firefox / WebKit 起動確認。
- `pnpm run test:e2e`: 3ブラウザでhappy pathと失敗状態を確認。

## Trial 001 mock boundary

`mocks/api`などを分ける代わりに、`scripts/mock-server.mjs`が1プロセスで`api/media/auth/billing`相当の状態を返します。Docker Compose経路は`docker-compose.yml`に残し、Dockerが使えない環境ではNode fallbackで起動します。
