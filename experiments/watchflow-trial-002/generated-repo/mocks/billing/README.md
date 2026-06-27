# mock-billing

課金状態を将来 `localhost:4040` で独立制御するための placeholder です。

## 契約

- `GET /billing?state=free`
- `GET /billing?state=premium`
- `GET /billing?state=payment_failed`

レスポンスは `{ "state": "...", "label": "..." }` を返します。未定義値は `free` に丸めます。

## placeholder の理由

支払い失敗のUIは `/states?billing=payment_failed` で確認できます。実決済や外部APIは使わない条件のため、Trial 002 では契約と docker-compose のサービス名を先に固定します。
