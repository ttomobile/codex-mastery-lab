あなたはCodex Mastery Labの実装担当です。WORKSPACEのgit repo内だけを変更してください。既に `experiments/aidd-control-plane-mvp-055/generated-repo` はMVP054からコピー済みです。この中をMVP055へ更新してください。

テーマは AIDD Control Plane MVP 055「Handoff Decision Ledger」です。

要件:

1. Next.js + TypeScript + pnpmの小さなアプリにする。UI、テスト名、READMEは日本語。
2. MVP054の縮小版ハンドオフレシートの次段として、empty / approved / held / blocked の4ケースを表示する。
3. approvedでは「Handoff Decision Ledger」を表示する。含める項目: source_handoff_receipt_id, decision, decision_owner, decision_reason, approved_execute_now, codex_command_draft, verification_commands, required_evidence, rollback_condition, aidd_spec_connections。
4. heldでは、hold_reason, additional_evidence_needed, next_review_condition, learning_log_return を表示する。
5. blockedでは、未承認、理由不足、rollback不足、Chromium/Firefox/WebKit不足、evidence不足、未サニタイズのlocal path/private host/private network URLを公開前ブロックとして表示し、修正指示を出す。
6. `src/lib` 配下に純粋関数を置き、unit testで empty / approved / held / blocked とsanitizeを検証する。
7. Playwright E2Eで Chromium / Firefox / WebKit を対象に4ケースを確認する。
8. capture scriptで `assets/aidd-control-plane-mvp055-empty.png`, `approved.png`, `held.png`, `blocked.png`, `terminal-evidence.png` を生成する。実験側の `artifacts/screenshots/` にもコピーする。
9. `doctor:aidd` scriptで MVP055固有token、Handoff Decision Ledger、AIDD-Spec接続、3ブラウザ設定、画像名、local path検出を確認する。
10. READMEに実行方法を書く。
11. 重い依存追加は避け、MVP054の構成から必要最小限で変更する。

最後に実行すべき検証コマンド一覧を出力してください。
