次の作業を `experiments/aidd-control-plane-mvp-059/generated-repo/` で実装してください。

あなたはAIDD Control Plane MVP059を作ります。既存のMVP058 Next.js実装を土台に、テーマを「Next Increment Planner」へ変更してください。

必須要件:

1. UIは日本語。英語の見出しやボタン文言を残さない。
2. `package.json` のnameとcapture scriptをmvp059へ変更する。
3. `src/domain` 等のドメインロジックをMVP059用に変更し、次の4状態fixtureを持つ。
   - empty: source reviewがない
   - valid: 次の1インクリメントがready
   - failure: source review不足、priority不足、3ブラウザE2E不足、terminal/failure screenshot不足、rollback不足、local path/private host/private network URL混入を検出
   - evidence_missing: 証跡不足を最優先の修復インクリメントとして提案
4. valid状態では以下を必ず画面に出す。
   - source_review_id
   - source_run_id
   - recommended_increment
   - priority_reason
   - target_artifacts
   - acceptance_criteria
   - verification_commands
   - required_evidence
   - codex_prompt_draft（execute_nowの1件だけ）
   - rollback_condition
   - note_article_angle
   - learning_log_connection
   - aidd_spec_connections
5. failure/evidence_missingでは、標準Review Finding形式に近いカードを表示し、AI Task Packet delta / Codex prompt delta / verification commandへ戻す。
6. unit testは日本語名で、ready/blocked/evidence_missingの判定と、Codex prompt draftにexecute_now以外が混入しないことを検証する。
7. Playwright E2EはChromium/Firefox/WebKitを対象にし、日本語名でempty/valid/failure/evidence_missingを検証する。
8. `doctor:aidd` はMVP059固有語、3ブラウザ、terminal evidence、screenshot evidence、rollback、AIDD-Spec接続、ローカルパス混入検出を静的に確認する。
9. `scripts/capture-mvp059.mjs` で以下の画像を `artifacts/screenshots/` に保存する。
   - `aidd-control-plane-mvp059-empty.png`
   - `aidd-control-plane-mvp059-valid.png`
   - `aidd-control-plane-mvp059-failure.png`
   - `aidd-control-plane-mvp059-evidence-missing.png`
   - `aidd-control-plane-mvp059-terminal-evidence.png`
10. 次のコマンドが通る状態にする。
   - `pnpm run lint`
   - `pnpm run typecheck`
   - `pnpm run test`
   - `pnpm run build`
   - `pnpm run test:e2e`
   - `pnpm run doctor:aidd`

実際の外部API・Codex起動・GitHub Actions接続はしないでください。fixture駆動の小さなMVPにしてください。
