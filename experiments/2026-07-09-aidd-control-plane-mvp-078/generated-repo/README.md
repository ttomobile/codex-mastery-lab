# Smoke Receipt Repair Action Planner

MVP078は、MVP077 Preview Smoke Receipt Binder の後段に置くAIDD Control Plane MVPです。Preview Smoke Receiptの失敗を、次の1回で実行する修正Actionへ畳み込みます。

## 状態

- `?state=empty`: 修正Action未入力
- `?state=planned`: `次の1回で実行する修正Actionが準備できました`
- `?state=failure`: 検証コマンド不足、証跡不足、rollback不足、AIDD-Spec接続不足をReview Finding YAML風カードで表示
- `?state=blocked`: private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、execute_now以外のprompt混入を実行前停止として表示

## 表示するAction項目

- source receipt
- broken URL
- finding category
- severity
- lane
- priority reason
- execute_now action
- next_increment
- learning_log
- AI Task Packet patch
- Codex prompt patch
- verification commands
- required evidence
- rollback condition
- AIDD-Spec connection

Codex prompt previewにはexecute_nowだけを入れ、next_increment / learning_logは混ぜません。

## AIDD-Spec接続

- `AIDD-Spec v0.1`
- `standards/aidd-control-plane-mvp-v0.1.md`
- upstream gate: `MVP077 Preview Smoke Receipt Binder`
- feature: `Smoke Receipt Repair Action Planner`

## Scripts

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run test:coverage`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp078`
