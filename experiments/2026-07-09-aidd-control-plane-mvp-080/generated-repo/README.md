# Run Queue Dispatch Receipt

MVP080は、MVP079 Repair Action Run Queue Intakeでreadyになった1件を、実行直前/実行後のDispatch Receiptへ変換するAIDD Control Plane MVPです。

## 状態

- `?state=empty`: Dispatch対象のqueue itemが未選択
- `?state=ready`: `Dispatch Receiptを発行できます`
- `?state=running`: `実行中の証跡を収集中`
- `?state=failure`: dispatch command失敗、証跡ゲート不足、rollbackゲート発火をReview Finding YAML風カードで表示
- `?state=blocked`: private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、next_increment混入、learning_log混入、破壊的cleanup要求をDispatch停止として表示

## 表示する項目

- queue item
- dispatch payload
- execute_now summary
- dispatch command
- excluded next_increment
- excluded learning_log
- verification gate
- evidence gate
- rollback gate
- sanitize gate
- timeout budget
- running progress / pending evidence
- next repair action
- AIDD-Spec connection

Dispatch payload / payload previewにはexecute_nowだけを入れ、next_increment / learning_logは混ぜません。

## AIDD-Spec接続

- `AIDD-Spec v0.1`
- `standards/aidd-control-plane-mvp-v0.1.md`
- upstream gate: `MVP079 Repair Action Run Queue Intake`
- feature: `Run Queue Dispatch Receipt`

## Scripts

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run test:coverage`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp080`
