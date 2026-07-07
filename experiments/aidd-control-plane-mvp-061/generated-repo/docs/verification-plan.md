# Verification Plan: AIDD Control Plane MVP061

## unit test

- emptyは`decision=empty`でdeltaを生成しない。
- validは`decision=delta_ready`でVerification Run Detailから修理deltaを返す。
- failureは`decision=blocked`でsource detail不足、失敗分類不足、修正指示不足、Firefox除外、terminal/failure screenshot不足、local path / host / private network URL混入をReview Finding形式で返す。
- repair_neededはexecute_nowを次の1回のdeltaへ絞る。
- Firefox除外、source detail不足、修正指示不足を個別に検証する。

## Playwright E2E

- Chromium / Firefox / WebKitを対象にする。
- `timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1`、`retries: 1`で安定化する。
- emptyケース: `source queue itemがありません`と`入力が十分になるまでVerification Run Detailは表示しません。`が見えること。
- validケース: Verification Run Detail、AIDD-Spec接続、3ブラウザ、修理deltaの5項目が見えること。
- failureケース: Review Finding形式、Firefox除外、local path / host / private network URL混入ブロックが見えること。
- repair_neededケース: execute_now / next_increment / learning_logと次の1回に入れるdeltaが見えること。

## doctor:aidd

- `AIDD Control Plane MVP061`
- `Evidence Repair Delta Generator`
- AIDD-Spec v0.1 / AIDD Control Plane MVP v0.1 / Verification Evidence / Review Record / Learning Log / AI Task Packet
- empty / valid / failure / repair_needed
- delta_ready / blocked / repair_needed
- source_queue_item_id / source_run_status / commit_sha
- command_details / command / exit_code / duration / status / artifact_path / failure_category / repair_instruction
- browser_coverage / Chromium / Firefox / WebKit
- AI Task Packet delta / Codex prompt delta / verification command / rollback condition / Learning Log note
- execute_now / next_increment / learning_log
- source detail不足 / 失敗分類不足 / 修正指示不足 / Firefox除外 / terminal/failure screenshot不足 / local path / host / private network URL混入
- `aidd-control-plane-mvp061-empty.png`
- `aidd-control-plane-mvp061-valid.png`
- `aidd-control-plane-mvp061-failure.png`
- `aidd-control-plane-mvp061-repair-needed.png`
- `aidd-control-plane-mvp061-terminal-evidence.png`
