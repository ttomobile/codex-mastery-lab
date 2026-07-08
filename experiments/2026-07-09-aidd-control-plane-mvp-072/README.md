# AIDD Control Plane MVP 072: Smoke Finding Action Queue

## 目的
MVP071のHandoff Decision Ledger後続として、Public Preview Smoke Verifierで見つかった公開preview/assetの失敗を、次の1回で実行するReview Finding Actionへ変換する画面を作る。

## AIDD-Spec接続
- `standards/aidd-spec-v0.1.md`: Verification Evidence / Review Record / Learning Log / AI Task Packet
- `standards/aidd-control-plane-mvp-v0.1.md`: Smoke Finding Action Queue

## 実装範囲
- 日本語UI
- empty / queued / blocked / exported の4状態
- broken URL、HTTP status、byte size、content type、finding category、severity、lane、priority reasonを表示
- AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec接続を表示
- execute_nowだけをCodex prompt previewへ入れ、next_increment / learning_logを混入させない
- private URL、Firefox未確認、terminal evidence不足、AIDD-Spec接続不足をblockedとして検出

## 独立検証
`pnpm install --frozen-lockfile`、`pnpm run lint`、`pnpm run typecheck`、`pnpm run test`、`pnpm run build`、`pnpm run test:e2e`、`pnpm run doctor:aidd`、`pnpm run capture:mvp072` を個別ログとして保存する。
