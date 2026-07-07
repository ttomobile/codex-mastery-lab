# Product Brief: AIDD Control Plane MVP060

## 体験

Verification Run Detailは、source queue itemから検証runの状態を読み、commit SHA、command別detail、3ブラウザ、証跡、Review Finding draft、AIDD-Spec接続を1画面で確認する。

## ゴール

- empty / valid / failure / repair_neededの4状態をfixtureで切り替える。
- validでは`source_queue_item_id`、`source_run_status`、`commit_sha`、`command_details`、`browser_coverage`、`terminal_evidence`、`screenshot_evidence`、`playwright_report`、`review_finding_draft`、`aidd_spec_connections`を表示する。
- failureではcommit SHA不足、command別detail不足、artifact path不足、失敗分類不足、修正指示不足、Firefox除外、証跡不足、local path/private host/private network URL混入を標準Review Finding形式へ変換する。
- repair_neededではfailed / timeout / evidence_missingのコマンドを次回修復delta候補に変換し、AI Task Packet delta / Codex prompt delta / verification commandへ戻す。

## 非ゴール

- 実際の外部API、Codex起動、GitHub Actions接続は行わない。
- 実サービスの商標、ロゴ、コピーは使わない。

## 主要フロー

1. キューなしを開き、source queue itemがないことを確認する。
2. 検証readyへ切り替え、Verification Run Detailの必須項目を確認する。
3. 差し戻しへ切り替え、標準Review Finding形式の不足項目を確認する。
4. 修復候補へ切り替え、failed / timeout / evidence_missingがdeltaへ戻ることを確認する。
5. unit test、Chromium / Firefox / WebKitのPlaywright E2E、doctor:aidd、capture:mvp060で確認する。
