# AIDD Control Plane MVP 055

テーマ: 縮小版ハンドオフレシートを、次回Codex実行へ進めるか・保留するか・止めるかを判断する「Handoff Decision Ledger」を作る。

## 背景

MVP054では、Shrink Plannerで小さく畳まれたAI Task Packetを次回実行へ渡す直前に確認するハンドオフレシートを作った。次の不足は、そのレシートを見た人が「実行してよい」と判断した根拠、保留理由、または停止理由をReview Recordとして残すことである。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log

## 受け入れ条件

- 日本語UIで empty / approved / held / blocked の4状態を表示する。
- approvedでは source_handoff_receipt_id、decision owner、decision reason、approved execute_now、Codex command draft、verification commands、required evidence、rollback condition、AIDD-Spec接続を表示する。
- heldでは保留理由、次回までに必要な追加証跡、Learning Log戻し先を表示する。
- blockedでは未承認、理由不足、rollback不足、3ブラウザ不足、local path/private host/private network URL混入、evidence不足を公開前ブロックとして表示する。
- 純粋関数とunit testで判定ロジックを検証する。
- Playwright E2Eで Chromium / Firefox / WebKit の主要状態を検証する。
- `doctor:aidd` でMVP055固有token、AIDD-Spec接続、3ブラウザ、画像証跡名を確認する。
