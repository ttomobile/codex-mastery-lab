# mock-media

`public/mock-media/sample.mp4` と poster 生成 Route Handler を、将来 `localhost:4020` で独立制御するための placeholder です。

## 契約

- `GET /video?mode=normal|slow|not_found|failure`
- `GET /poster?v=vf-001`
- `GET /captions-ja.vtt`

## placeholder の理由

動画バイナリの配信、遅延、404、503 は現状の Route Handler で再現できます。Trial 002 では docker-compose のサービス境界と契約を明文化し、実サービス化は次段階の作業に残します。
