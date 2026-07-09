# Preview Smoke Receipt Binder

MVP077は、MVP076 Publication Evidence QA Gate の後段に置く小さなAIDD Control Plane MVPです。公開preview HTML、asset、terminal evidence imageがHTTP経路で読めた事実をReceiptとして束ねます。

## 状態

- `?state=empty`: Receipt未入力
- `?state=valid`: 公開previewのHTTP証跡を保存できます
- `?state=failure`: 404、0 byte、content type mismatch、latency超過をReview Findingとして表示
- `?state=blocked`: private URL、local path、Firefox未確認、receipt保存先不足、AIDD-Spec接続不足を公開前停止として表示

## AIDD-Spec接続

- `AIDD-Spec v0.1`
- `standards/aidd-control-plane-mvp-v0.1.md`
- upstream gate: `MVP076 Publication Evidence QA Gate`
- feature: `Preview Smoke Receipt Binder`

## Scripts

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp077`
