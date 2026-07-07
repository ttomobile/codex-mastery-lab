# AIDD Control Plane MVP056

MVP055のHandoff Decision Ledgerの次段として、Codex Run Queueへ入れてよい実行候補を確認する小さなNext.js + TypeScriptアプリです。empty / queued / rejected / evidence_missingの4ケースを切り替え、queuedのときだけRun Queue Intakeを表示します。

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
pnpm run capture:mvp056
```

## 表示するケース

- `empty`: MVP055から`source_decision_id`が届いていないため、Run Queue Intakeを生成しない。
- `queued`: `source_decision_id`、`queue_item_id`、`run_status`、`codex_command`、`sandbox_mode`、`required_verification_commands`、`browser_projects`、`required_evidence`、`rollback_plan`、`aidd_spec_connections`を含むRun Queue Intakeを表示する。
- `rejected`: held / blocked / unapproved decision、危険なcommand、sandbox不足、Firefox除外、浅い検証、rollback不足、未サニタイズのlocal path/private host/private network URLを拒否理由として表示し、修正指示を出す。
- `evidence_missing`: approved判断はあるがterminal evidence、empty/queued/rejected/evidence_missing screenshot、Playwright reportが不足している状態を警告し、Review Record / Learning Logへ戻す指示を出す。

## Capture

`pnpm run capture:mvp056`で以下を生成し、repo rootの`assets/`と実験側の`artifacts/screenshots/`へコピーします。

- `assets/aidd-control-plane-mvp056-empty.png`
- `assets/aidd-control-plane-mvp056-queued.png`
- `assets/aidd-control-plane-mvp056-rejected.png`
- `assets/aidd-control-plane-mvp056-evidence-missing.png`
- `assets/aidd-control-plane-mvp056-terminal-evidence.png`
