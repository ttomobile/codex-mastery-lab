# AIDD Control Plane MVP058

Run Result Review Synthesizerは、MVP057 Codex Run Queue Status Trackerの実行結果を、Review Finding、AI Task Packet Delta、Codex Prompt Delta、Verification command、Learning Logへ合成するNext.js + TypeScriptアプリです。

## scripts

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp058
```

## cases

- `empty`: `source_run_id`がないためRun Result Review Recordを生成しない。
- `valid`: `source_run_id`、`outcome`、`score`、`score_reason`、`terminal_evidence`、`screenshot_evidence`、`browser_coverage`、`doctor_aidd`、`rollback`、`privacy_scan`、`review_findings`、`needed_upstream_info`、`standard_update`、`ai_task_packet_delta`、`codex_prompt_delta`、`verification_command`、`learning_log`、`aidd_spec_connections`を表示する。
- `failure`: command失敗、Firefox未実行、doctor:aidd失敗、危険command、rollback不足、local path/private host/private network URL混入をReview Finding形式で表示する。
- `evidence_missing`: 成功結果でもterminal evidence、empty-valid-failure screenshot、Playwright report、Review Record出力が不足していればEvidence Repair Delta / Learning Logへ戻す。

## AIDD-Spec接続

- AIDD-Spec v0.1
- standards/aidd-control-plane-mvp-v0.1.md の Run Result Review Synthesizer
- MVP057 Codex Run Queue Status Tracker
- Review Record
- Learning Log

## capture

`pnpm run capture:mvp058`で以下を`generated-repo/artifacts/screenshots`、repo rootの`assets/`、実験側`artifacts/screenshots`へ保存します。

- `assets/aidd-control-plane-mvp058-empty.png`
- `assets/aidd-control-plane-mvp058-valid.png`
- `assets/aidd-control-plane-mvp058-failure.png`
- `assets/aidd-control-plane-mvp058-evidence-missing.png`
- `assets/aidd-control-plane-mvp058-terminal-evidence.png`
