# Product Brief: AIDD Control Plane MVP054

## 体験

MVP053のShrink Plannerが作った縮小計画を、次回のCodex実行へ渡す直前に点検する。empty / valid / blockedを切り替え、validのときだけ縮小版ハンドオフレシートを表示する。

## 差別化したゴール

- empty / valid / blockedの3ケースを日本語UIで比較できる。
- validでは`source_shrink_plan_id`、`execute_now`、`defer_next_increment`、`minimum_verification`、`codex_prompt_preview`、`required_evidence`、`rollback_condition`、`aidd_spec_connections`を含む縮小版ハンドオフレシートを表示する。
- blockedでは未サニタイズのlocal path/private host/private network URL、minimum_verification不足、rollback不足、Chromium/Firefox/WebKit不足、evidence不足を公開前ブロックとして表示する。
- 各公開前ブロックに修正指示を出し、次回実行へ渡してよいかを明確にする。
- `sanitizeForPublic`でlocal path、private host、private network URLを`WORKSPACE`または`HOME`へ置換する。

## 非ゴール

- 実際のCI実行や外部サービス連携はしない。
- 実サービスの商標、ロゴ、コピーは使わない。
- AIによる自動実行までは行わず、ハンドオフ前のレシート表示と検証に絞る。

## 主要ユーザーフロー

1. ユーザーがemptyケースを開き、縮小計画が未受信ならレシートが生成されないことを確認する。
2. ユーザーがvalidケースへ切り替え、縮小版ハンドオフレシートとAIDD-Spec接続を確認する。
3. ユーザーがblockedケースへ切り替え、公開前ブロック5種類と修正指示を確認する。
4. doctor:aiddと3ブラウザE2Eで、MVP054固有token、レシート項目、sanitize、画像名を確認する。
