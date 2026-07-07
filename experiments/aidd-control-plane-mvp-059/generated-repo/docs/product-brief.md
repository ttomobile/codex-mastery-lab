# Product Brief: AIDD Control Plane MVP059

## 対象体験

Next Increment Plannerは、MVP058 Review Recordのsource reviewを読み、次に実行する1インクリメントだけを選ぶ。実装へ進めるready、差し戻すblocked、証跡回収を優先するevidence_missingを分けて表示する。

## ゴール

- empty / valid / failure / evidence_missingの4状態をfixtureで切り替える。
- validでは`source_review_id`、`source_run_id`、`recommended_increment`、`priority_reason`、`target_artifacts`、`acceptance_criteria`、`verification_commands`、`required_evidence`、`codex_prompt_draft`、`rollback_condition`、`note_article_angle`、`learning_log_connection`、`aidd_spec_connections`を表示する。
- `codex_prompt_draft`は`execute_now`の1件だけにする。
- failureではsource review不足、priority不足、3ブラウザE2E不足、terminal/failure screenshot不足、rollback不足、local path/private host/private network URL混入を標準Review Finding形式へ変換する。
- evidence_missingでは証跡不足を最優先の修復インクリメントとして提案し、AI Task Packet delta / Codex prompt delta / verification commandへ戻す。

## 非ゴール

- 実際の外部API、Codex起動、GitHub Actions接続はしない。
- 実サービスの商標、ロゴ、コピーは使わない。
- 実ファイルへAI Task Packetを自動適用しない。

## 主要ユーザーフロー

1. ユーザーが未受信ケースを見て、source reviewがないと計画を生成しないことを確認する。
2. ユーザーが準備完了ケースへ切り替え、次の1インクリメントと必須13項目を確認する。
3. ユーザーが差し戻しケースへ切り替え、Review Finding形式と戻し先deltaを確認する。
4. ユーザーが証跡不足ケースへ切り替え、証跡回収が最優先インクリメントになることを確認する。
5. unit test、Chromium / Firefox / WebKitのPlaywright E2E、doctor:aidd、capture:mvp059で確認する。
