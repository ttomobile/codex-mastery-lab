# Public Preview Smoke Final Receipt MVP084

AIDD Control Plane MVP084は、公開previewのHTML・画像・terminal evidence画像がHTTP経路で読めるかを最終レシートとして束ねるNext.js実験です。

## 状態

- `empty`: smoke対象URLと必要証跡が未登録
- `verified`: HTML / asset / terminal evidence imageが200・非0byte・期待content type・latency予算内
- `failure`: 404 / 0 byte / content type mismatch / latency超過をReview Findingへ変換
- `blocked`: private URL / local path / host名 / Firefox未確認 / terminal evidence不足 / AIDD-Spec接続不足 / rollback不足で公開前停止

## 検証

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp084
```
