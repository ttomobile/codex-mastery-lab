# mock-api

Trial 002 では Next.js Route Handler の `app/api/*` を本実装として維持し、docker-compose では独立サービス化の起動 placeholder を用意します。

## 契約

- `GET /videos`
- `GET /videos?id=vf-001`
- `GET /videos?relatedTo=vf-001`
- `GET /search?q=設計`
- `GET /comments?videoId=vf-001`

## placeholder の理由

今回の改善ではプレイヤー分割、pnpm化、axe、coverage、状態UIの追加を優先します。APIの二重実装は不整合リスクが高いため、Trial 002 では契約とポートを固定し、次回以降に Route Handler から共有 adapter を呼ぶ軽量HTTPサービスへ分離します。
