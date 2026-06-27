# Mock service

Trial 003ではNext.js Route Handlerを残しつつ、Docker Composeで独立した軽量Node http serverを起動できるようにしています。Expressなどの追加依存は使わず、Node標準の `http` だけで実装します。

## 起動

```bash
docker compose up mock-api mock-media mock-auth mock-billing
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

## media障害モード

- `normal`: `sample.mp4` を返します。`Range` headerがある場合は `206 Partial Content` と `Content-Range` で応答します。
- `slow`: 送信開始を遅らせ、読み込み待ち状態を再現します。
- `not_found`: `404` JSONを返します。
- `failure`: `500` JSONを返します。
- `interrupted`: `Content-Length` より短い本文で接続を破断し、途中切断を再現します。
- `/captions/ja.vtt`: 日本語字幕VTTを返します。

`mocks/media/server.test.ts` でRange request、500応答、interrupted streamを確認しています。
