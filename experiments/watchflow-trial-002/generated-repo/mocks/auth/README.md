# mock-auth

認証状態を将来 `localhost:4030` で独立制御するための placeholder です。

## 契約

- `GET /auth?state=anonymous`
- `GET /auth?state=logged_in`
- `GET /auth?state=premium`
- `GET /auth?state=session_expired`

レスポンスは `{ "state": "..." }` を返します。未定義値は `anonymous` に丸めます。

## placeholder の理由

Trial 002 では UI 状態確認を `/states` に追加し、Route Handler の契約を維持します。認証サーバーの実装はセッションCookieの契約設計を含むため、今回は起動境界だけを固定します。
