# Mock service

Trial 004ではNext.js Route Handlerを残しつつ、E2Eが独立した軽量Node http serverを実依存として使います。Expressなどの追加依存は使わず、Node標準の `http` だけで実装します。

## 起動

```bash
docker compose up mock-api mock-media mock-auth mock-billing
```

Playwrightと同じ起動導線を使う場合は、Docker Composeを優先し、Dockerが使えない環境ではNode直接起動へフォールバックします。

```bash
pnpm run mock:start
pnpm run mock:stop
```

個別起動もできます。

```bash
pnpm --dir mocks/api start
pnpm --dir mocks/media start
pnpm --dir mocks/auth start
pnpm --dir mocks/billing start
```

## エンドポイント

| service | port | endpoint |
| --- | ---: | --- |
| mock-api | 4010 | `/videos`, `/videos?id=vf-001`, `/search?q=設計`, `/health` |
| mock-media | 4020 | `/video?mode=normal|slow|not_found|failure|interrupted`, `/captions/ja.vtt`, `/health` |
| mock-auth | 4030 | `/auth?state=anonymous|logged_in|premium|session_expired`, `/health` |
| mock-billing | 4040 | `/billing?state=free|premium|payment_failed`, `/health` |

## control endpoint

各serviceはE2E専用の状態変更APIを持ちます。これはmock service専用の制御口であり、本番APIとして扱いません。

| service | state |
| --- | --- |
| mock-api | `online`, `offline`, `timeout` |
| mock-media | `normal`, `slow`, `not_found`, `failure`, `interrupted` |
| mock-auth | `anonymous`, `logged_in`, `premium`, `session_expired` |
| mock-billing | `free`, `premium`, `payment_failed` |

```bash
curl -X POST http://127.0.0.1:4020/__control/state \
  -H 'content-type: application/json' \
  -d '{"state":"failure"}'
curl http://127.0.0.1:4020/state
```

`/state` と `/__control/state` は同じ状態を返します。読み取りは `GET`、変更は `POST` です。

## media障害モード

- `normal`: `sample.mp4` を返します。`Range` headerがある場合は `206 Partial Content` と `Content-Range` で応答します。
- `slow`: 送信開始を遅らせ、読み込み待ち状態を再現します。
- `not_found`: `404` JSONを返します。
- `failure`: `500` JSONを返します。
- `interrupted`: `Content-Length` より短い本文で接続を破断し、途中切断を再現します。
- `/captions/ja.vtt`: 日本語字幕VTTを返します。

`mocks/media/server.test.ts` でRange request、500応答、interrupted streamを確認しています。

## E2Eでの使い方

`playwright.config.ts` の `webServer.command` は `pnpm run mock:start` を先に実行し、`WATCHFLOW_USE_EXTERNAL_MOCKS=1` を付けてNext.js dev serverを起動します。`/states` は独立mock serviceの認証、課金、ネットワーク状態を読み、`/watch/:id` はmock-mediaの状態を読みます。

ローカルにDockerがない場合でも `scripts/start-mock-services.mjs` が `pnpm --dir mocks/* start` で同じserviceを直接起動します。
