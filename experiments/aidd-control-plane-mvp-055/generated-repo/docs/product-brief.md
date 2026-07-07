# Product Brief: AIDD Control Plane MVP055

## 体験

MVP054の縮小版ハンドオフレシートを受け取り、次回Codex実行へ進めてよいかを判断する。empty / approved / held / blockedを切り替え、approvedのときだけHandoff Decision Ledgerを表示する。

## 差別化したゴール

- empty / approved / held / blockedの4ケースを日本語UIで比較できる。
- approvedでは`source_handoff_receipt_id`、`decision`、`decision_owner`、`decision_reason`、`approved_execute_now`、`codex_command_draft`、`verification_commands`、`required_evidence`、`rollback_condition`、`aidd_spec_connections`を含むHandoff Decision Ledgerを表示する。
- heldでは`hold_reason`、`additional_evidence_needed`、`next_review_condition`、`learning_log_return`を表示する。
- blockedでは未承認、理由不足、rollback不足、Chromium/Firefox/WebKit不足、evidence不足、未サニタイズのlocal path/private host/private network URLを公開前ブロックとして表示する。
- 各公開前ブロックに修正指示を出し、何を直すべきかを明確にする。
- `sanitizeForPublic`でlocal path、private host、private network URLを`WORKSPACE`または`HOME`へ置換する。
- AIDD-Spec接続は、MVP054の入力、MVP055のLedger、Decision Gateの対応関係として表示する。

## 非ゴール

- 実際のCI実行や外部サービス連携はしない。
- 実サービスの商標、ロゴ、コピーは使わない。
- AIによる自動実行までは行わず、承認判断の表示と検証に絞る。

## 主要ユーザーフロー

1. ユーザーがemptyケースを開き、MVP054由来のレシートIDが未受信ならLedgerが生成されないことを確認する。
2. ユーザーがapprovedケースへ切り替え、Handoff Decision LedgerとAIDD-Spec接続を確認する。
3. ユーザーがheldケースへ切り替え、保留理由、追加証跡、次回レビュー条件、learning log返却を確認する。
4. ユーザーがblockedケースへ切り替え、公開前ブロック6種類と修正指示を確認する。
5. doctor:aiddと3ブラウザE2Eで、MVP055固有token、Ledger項目、sanitize、画像名を確認する。
