# AIDD Control Plane MVP059

Next Increment Plannerは、MVP058 Review Recordのsource reviewから次に実行する1インクリメントを選ぶNext.js + TypeScriptアプリです。UIは日本語で、empty / valid / failure / evidence_missingのfixtureだけを使います。

## scripts

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp059
```

## cases

- `empty`: source reviewがないため次インクリメント計画を生成しない。
- `valid`: `ready`として`source_review_id`、`source_run_id`、`recommended_increment`、`priority_reason`、`target_artifacts`、`acceptance_criteria`、`verification_commands`、`required_evidence`、`codex_prompt_draft`、`rollback_condition`、`note_article_angle`、`learning_log_connection`、`aidd_spec_connections`を表示する。
- `failure`: `blocked`としてsource review不足、priority不足、3ブラウザE2E不足、terminal/failure screenshot不足、rollback不足、local path/private host/private network URL混入を標準Review Finding形式で表示し、AI Task Packet delta / Codex prompt delta / verification commandへ戻す。
- `evidence_missing`: 証跡不足を最優先の修復インクリメントとして提案する。

## AIDD-Spec接続

- AIDD-Spec v0.1
- Next Increment Planner
- MVP058 Review Record
- Learning Log

## capture

`pnpm run capture:mvp059`で以下を`generated-repo/artifacts/screenshots`、repo rootの`assets/`、実験側`artifacts/screenshots`へ保存します。

- `artifacts/screenshots/aidd-control-plane-mvp059-empty.png`
- `artifacts/screenshots/aidd-control-plane-mvp059-valid.png`
- `artifacts/screenshots/aidd-control-plane-mvp059-failure.png`
- `artifacts/screenshots/aidd-control-plane-mvp059-evidence-missing.png`
- `artifacts/screenshots/aidd-control-plane-mvp059-terminal-evidence.png`
