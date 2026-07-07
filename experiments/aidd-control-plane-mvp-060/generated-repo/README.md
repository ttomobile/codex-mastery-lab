# AIDD Control Plane MVP060

Verification Run Detailは、source queue itemから検証runの詳細を表示するNext.js + TypeScriptアプリです。UIは日本語で、empty / valid / failure / repair_neededのfixtureだけを使います。

## 実行

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp060
```

## fixture

- `empty`: source queue itemがない。
- `valid`: `ready`として`source_queue_item_id`、`source_run_status`、`commit_sha`、`command_details`、`browser_coverage`、`terminal_evidence`、`screenshot_evidence`、`playwright_report`、`review_finding_draft`、`aidd_spec_connections`を表示する。
- `failure`: `blocked`としてcommit SHA不足、command別detail不足、artifact path不足、失敗分類不足、修正指示不足、Firefox除外、証跡不足、local path/private host/private network URL混入を標準Review Finding形式で表示する。
- `repair_needed`: `failed` / `timeout` / `evidence_missing`のコマンドをAI Task Packet delta / Codex prompt delta / verification commandへ戻す。

## 静的確認

`pnpm run doctor:aidd`は次を確認します。

- MVP060固有語とVerification Run Detail
- Chromium / Firefox / WebKitの3ブラウザ
- command別detail、artifact path、failure category、repair instruction
- terminal evidence、screenshot evidence、playwright_report
- AIDD-Spec接続
- local path/private host/private network URL混入検出

## capture

`pnpm run capture:mvp060`で以下を`generated-repo/artifacts/screenshots`、repo rootの`assets/`、実験側`artifacts/screenshots`へ保存します。

- `artifacts/screenshots/aidd-control-plane-mvp060-empty.png`
- `artifacts/screenshots/aidd-control-plane-mvp060-valid.png`
- `artifacts/screenshots/aidd-control-plane-mvp060-failure.png`
- `artifacts/screenshots/aidd-control-plane-mvp060-repair-needed.png`
- `artifacts/screenshots/aidd-control-plane-mvp060-terminal-evidence.png`
