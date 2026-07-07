# Verification Plan: AIDD Control Plane MVP060

## unit test

- emptyは`decision=empty`で詳細を生成しない。
- validは`decision=ready`でVerification Run Detailの必須項目を返す。
- failureは`decision=blocked`でcommit SHA不足、artifact path不足、失敗分類不足、修正指示不足、Firefox除外、証跡不足、local path/private host/private network URL混入をReview Finding形式で返す。
- repair_neededはfailed / timeout / evidence_missingのコマンドを次回修復delta候補へ変換する。
- Firefox除外、artifact path不足、修正指示不足を個別に検証する。

## Playwright E2E

- Chromium / Firefox / WebKitを対象にする。
- `timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1`、`retries: 1`で安定化する。
- emptyケース: `source queue itemがありません`と`readyになるまでVerification Run Detailは表示しません。`が見えること。
- validケース: `source_queue_item_id`、`source_run_status`、`commit_sha`、`command_details`、`browser_coverage`、`terminal_evidence`、`screenshot_evidence`、`playwright_report`、`review_finding_draft`、`aidd_spec_connections`が見えること。
- failureケース: 標準Review Finding形式とAI Task Packet delta / Codex prompt delta / verification commandが見えること。
- repair_neededケース: failed / timeout / evidence_missingのdelta候補が見えること。

## doctor:aidd

- `AIDD Control Plane MVP060`
- `Verification Run Detail`
- empty / valid / failure / repair_needed
- ready / blocked / repair_needed
- source_queue_item_id / source_run_status / commit_sha
- command_details / command / exit_code / duration / status / artifact_path / failure_category / repair_instruction
- browser_coverage / Chromium / Firefox / WebKit
- terminal evidence、screenshot evidence、playwright_report、AIDD-Spec接続
- commit SHA不足 / command別detail不足 / artifact path不足 / 失敗分類不足 / 修正指示不足 / Firefox除外 / 証跡不足 / local path/private host/private network URL混入
- `aidd-control-plane-mvp060-empty.png`
- `aidd-control-plane-mvp060-valid.png`
- `aidd-control-plane-mvp060-failure.png`
- `aidd-control-plane-mvp060-repair-needed.png`
- `aidd-control-plane-mvp060-terminal-evidence.png`
