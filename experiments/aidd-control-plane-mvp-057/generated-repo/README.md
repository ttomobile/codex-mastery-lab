# AIDD Control Plane MVP057

MVP056のRun Queue Intakeの次段として、Codex実行の状態と証跡不足を確認する小さなNext.js + TypeScriptアプリです。empty / waiting / running / succeeded / failed / evidence_missingの6ケースを切り替え、succeededのときだけCodex Run Queue Status Trackerを表示します。

## 実行方法

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

## 検証コマンド

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp057
```

## 表示するケース

- `empty`: MVP056から`source_intake_id`が届いていないため、Status Trackerを生成しない。
- `waiting`: `queue_item_id`はあるが、Codex実行開始前として待機状態を表示する。
- `running`: Codex実行中として、Verification Evidence、Playwright report、Review Record、Learning Logが最終化されていない状態を表示する。
- `succeeded`: `source_intake_id`、`queue_item_id`、`run_status`、`actual_results`、`verification_summary`、`browser_projects`、`terminal_evidence`、`screenshot_evidence`、`playwright_report`、`rollback_plan`、`review_record_output`、`learning_log_output`、`aidd_spec_connections`を含むCodex Run Queue Status Trackerを表示する。
- `failed`: command失敗、Firefox未実行、doctor:aidd失敗、危険なcommand、rollback不足、未サニタイズのlocal path/private host/private network URLを失敗理由として表示し、修正指示を出す。
- `evidence_missing`: 実行結果は成功だがterminal evidence、empty/succeeded/failed/evidence_missing screenshot、Playwright report、Review Record出力が不足している状態を警告し、Evidence Repair Delta / Learning Logへ戻す指示を出す。

## Capture

`pnpm run capture:mvp057`で以下を生成し、repo rootの`assets/`と実験側の`artifacts/screenshots/`へコピーします。

- `assets/aidd-control-plane-mvp057-empty.png`
- `assets/aidd-control-plane-mvp057-succeeded.png`
- `assets/aidd-control-plane-mvp057-failed.png`
- `assets/aidd-control-plane-mvp057-evidence-missing.png`
- `assets/aidd-control-plane-mvp057-terminal-evidence.png`
