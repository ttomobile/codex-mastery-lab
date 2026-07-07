あなたはCodex Mastery Labの実装担当です。WORKSPACEのgit repo内だけを変更してください。`experiments/aidd-control-plane-mvp-056/generated-repo` はMVP055からruntime生成物を除いてコピー済みです。この中をMVP056へ更新してください。

テーマは AIDD Control Plane MVP 056「Run Queue Intake」です。

要件:

1. Next.js + TypeScript + pnpmの小さなアプリにする。UI、テスト名、READMEは日本語。
2. MVP055のHandoff Decision Ledgerの次段として、empty / queued / rejected / evidence_missing の4ケースを表示する。
3. queuedでは「Run Queue Intake」を表示する。含める項目: source_decision_id, queue_item_id, run_status, codex_command, sandbox_mode, required_verification_commands, browser_projects, required_evidence, rollback_plan, aidd_spec_connections。
4. rejectedでは、held / blocked / unapproved decision、危険なcommand（rm -rf, curl | sh, --yolo等）、sandbox不足、Firefox除外、浅い検証、rollback不足、未サニタイズのlocal path/private host/private network URLを拒否理由として表示し、修正指示を出す。
5. evidence_missingでは、approved判断はあるがterminal evidence、empty/queued/rejected/evidence_missing screenshot、Playwright reportの不足を警告し、Review Record / Learning Logへ戻す指示を出す。
6. `src/lib` 配下に純粋関数を置き、unit testで empty / queued / rejected / evidence_missing とsanitizeを検証する。
7. Playwright E2Eで Chromium / Firefox / WebKit を対象に4ケースを確認する。
8. capture scriptで `assets/aidd-control-plane-mvp056-empty.png`, `queued.png`, `rejected.png`, `evidence-missing.png`, `terminal-evidence.png` を生成する。実験側の `artifacts/screenshots/` にもコピーする。
9. `doctor:aidd` scriptで MVP056固有token、Run Queue Intake、Codex Run Queue、AIDD-Spec接続、3ブラウザ設定、画像名、local path検出を確認する。
10. READMEに実行方法を書く。
11. 重い依存追加は避け、MVP055の構成から必要最小限で変更する。

最後に実行すべき検証コマンド一覧を出力してください。
