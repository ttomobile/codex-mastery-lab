# AIDD Control Plane MVP 056

テーマ: Handoff Decision Ledgerで approved になった1件だけを、Codex実行キューへ積む前の「Run Queue Intake」として検査する。

## 背景

MVP055では、縮小版ハンドオフレシートを approved / held / blocked に分けて判断した。次の不足は、approvedになった判断だけが実行待ちキューへ入り、heldやblocked、危険なcommand、浅い検証、証跡不足が混ざらないことを確認する入口である。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log
- Handoff Decision Ledger
- Codex Run Queue

## 受け入れ条件

- 日本語UIで empty / queued / rejected / evidence_missing の4状態を表示する。
- queuedでは source_decision_id、queue_item_id、run_status、codex_command、sandbox_mode、required_verification_commands、browser_projects、required_evidence、rollback_plan、aidd_spec_connectionsを表示する。
- rejectedでは held / blocked / unapproved decision、危険なcommand、sandbox不足、Firefox除外、浅い検証、rollback不足、local path/private host/private network URL混入を拒否理由として表示する。
- evidence_missingでは queueへ積めるが、terminal / screenshot / Playwright reportなど不足証跡を警告し、Review Recordへ戻す指示を表示する。
- 純粋関数とunit testで4状態とsanitize判定を検証する。
- Playwright E2Eで Chromium / Firefox / WebKit の主要状態を検証する。
- `doctor:aidd` でMVP056固有token、Run Queue Intake、AIDD-Spec接続、3ブラウザ、画像証跡名を確認する。
