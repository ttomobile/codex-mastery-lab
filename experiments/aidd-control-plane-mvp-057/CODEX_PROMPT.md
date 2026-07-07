あなたはCodex Mastery Labの実装担当です。WORKSPACEのgit repo内だけを変更してください。`experiments/aidd-control-plane-mvp-057/generated-repo` はMVP056からruntime生成物を除いてコピー済みです。この中をMVP057へ更新してください。

テーマは AIDD Control Plane MVP 057「Codex Run Queue Status Tracker」です。

要件:

1. Next.js + TypeScript + pnpmの小さなアプリにする。UI、テスト名、READMEは日本語。
2. MVP056のRun Queue Intakeの次段として、empty / waiting / running / succeeded / failed / evidence_missing の6ケースを表示する。
3. succeededでは「Codex Run Queue Status Tracker」を表示する。含める項目: source_intake_id, queue_item_id, run_status, actual_results, verification_summary, browser_projects, terminal_evidence, screenshot_evidence, playwright_report, rollback_plan, review_record_output, learning_log_output, aidd_spec_connections。
4. failedでは、command失敗、Firefox未実行、doctor:aidd失敗、危険なcommand（再帰的削除、pipe経由のshell実行、no-sandbox相当等）、rollback不足、未サニタイズのlocal path/private host/private network URLを失敗理由として表示し、修正指示を出す。
5. evidence_missingでは、実行結果は成功だがterminal evidence、empty/succeeded/failed/evidence_missing screenshot、Playwright report、Review Record出力の不足を警告し、Evidence Repair Delta / Learning Logへ戻す指示を出す。
6. `src/lib` 配下に純粋関数を置き、unit testで empty / waiting / running / succeeded / failed / evidence_missing とsanitizeを検証する。
7. Playwright E2Eで Chromium / Firefox / WebKit を対象に4ケース以上（empty/succeeded/failed/evidence_missing）を確認する。
8. capture scriptで `assets/aidd-control-plane-mvp057-empty.png`, `succeeded.png`, `failed.png`, `evidence-missing.png`, `terminal-evidence.png` を生成する。実験側の `artifacts/screenshots/` にもコピーする。
9. `doctor:aidd` scriptで MVP057固有token、Codex Run Queue Status Tracker、Verification Evidence、Review Record、Learning Log、AIDD-Spec接続、3ブラウザ設定、画像名、local path検出を確認する。
10. READMEに実行方法を書く。
11. 重い依存追加は避け、MVP056の構成から必要最小限で変更する。

最後に実行すべき検証コマンド一覧を出力してください。
