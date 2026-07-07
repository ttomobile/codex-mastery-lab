# Review Record: MVP060

## 判断

AIDD Control Plane MVP060として、検証runの1件をcommand別に読めるVerification Run Detailを採用する。

## 理由

検証runが成功したかだけでは、次の修復指示や記事化に必要な証跡が足りない。MVP060ではcommit SHA、command別detail、3ブラウザ、terminal evidence、screenshot evidence、playwright_report、AIDD-Spec接続を表示し、不足があればReview Finding形式で戻す。

## 差し戻し観点

- commit SHA不足
- command別detail不足
- artifact path不足
- 失敗分類不足
- 修正指示不足
- Firefox除外
- 証跡不足
- local path/private host/private network URL混入

## 修復観点

repair_neededではfailed / timeout / evidence_missingのコマンドを次回修復delta候補に変換し、AI Task Packet delta / Codex prompt delta / verification commandへ戻す。

## 確認

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp060`
