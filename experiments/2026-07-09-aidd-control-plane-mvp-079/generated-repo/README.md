# Repair Action Run Queue Intake

MVP079は、MVP078 Smoke Receipt Repair Action Plannerでreadyになった1件を、実Codex実行キューへ投入する前に確認するAIDD Control Plane MVPです。

## 状態

- `?state=empty`: キューへ入れるRepair Actionが未選択
- `?state=ready`: `実行キュー投入前チェックを通過しました`
- `?state=failure`: 検証ゲート不足、証跡ゲート不足、rollbackゲート不足、AIDD-Spec接続不足をReview Finding YAML風カードで表示
- `?state=blocked`: private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、next_increment混入、learning_log混入、破壊的cleanup要求を実行前停止として表示

## 表示する項目

- source repair action
- queue payload
- execute_now summary
- excluded next_increment
- excluded learning_log
- verification gate
- evidence gate
- rollback gate
- sanitize gate
- AIDD-Spec connection

Queue payload / Codex prompt previewにはexecute_nowだけを入れ、next_increment / learning_logは混ぜません。

## AIDD-Spec接続

- `AIDD-Spec v0.1`
- `standards/aidd-control-plane-mvp-v0.1.md`
- upstream gate: `MVP078 Smoke Receipt Repair Action Planner`
- feature: `Repair Action Run Queue Intake`

## Scripts

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run test:coverage`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp079`
