あなたはCodex Mastery Labの実装担当です。WORKSPACEのgit repo内だけを変更してください。既存の `experiments/aidd-control-plane-mvp-053/generated-repo` を参考に、`experiments/aidd-control-plane-mvp-054/generated-repo` を作ってください。

テーマは AIDD Control Plane MVP 054「縮小版AI Task Packetを次回実行へ渡す前のハンドオフレシート」です。

要件:

1. Next.js + TypeScript + pnpmの小さなアプリにする。UI、テスト名、READMEは日本語。
2. MVP053のShrink Plannerの次段として、empty / valid / blocked の3ケースを表示する。
3. validでは「縮小版ハンドオフレシート」を表示する。含める項目: source_shrink_plan_id, execute_now, defer_next_increment, minimum_verification, codex_prompt_preview, required_evidence, rollback_condition, aidd_spec_connections。
4. blockedでは、未サニタイズのlocal path/private host/private network URL、minimum_verification不足、rollback不足、Chromium/Firefox/WebKit不足、evidence不足を公開前ブロックとして表示し、修正指示を出す。
5. `src/lib` 配下に純粋関数を置き、unit testで empty / valid / blocked とsanitizeを検証する。
6. Playwright E2Eで Chromium / Firefox / WebKit を対象に3ケースを確認する。
7. capture scriptで `assets/aidd-control-plane-mvp054-empty.png`, `valid.png`, `blocked.png`, `terminal-evidence.png` を生成する。実験側の `artifacts/screenshots/` にもコピーする。
8. `doctor:aidd` scriptで MVP054固有token、縮小版ハンドオフレシート、AIDD-Spec接続、3ブラウザ設定、画像名、local path検出を確認する。
9. READMEに実行方法を書く。
10. 重い依存追加は避け、MVP053の構成をコピーして必要最小限で変更する。

最後に実行すべき検証コマンド一覧を出力してください。
