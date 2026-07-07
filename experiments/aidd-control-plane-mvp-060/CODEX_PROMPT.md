次の作業を `experiments/aidd-control-plane-mvp-060/generated-repo/` で実装してください。

あなたはAIDD Control Plane MVP060を作ります。既存のMVP059 Next.js実装を土台に、テーマを「Verification Run Detail」へ変更してください。

必須要件:

1. UIは日本語。英語の見出しやボタン文言を残さない。
2. `package.json` のnameとcapture scriptをmvp060へ変更する。
3. `src/domain` 等のドメインロジックをMVP060用に変更し、次の4状態fixtureを持つ。
   - empty: source queue itemがない
   - valid: コマンド別Verification Run Detailがready
   - failure: commit SHA不足、command別detail不足、artifact path不足、失敗分類不足、修正指示不足、Firefox除外、証跡不足、local path/private host/private network URL混入を検出
   - repair_needed: failed / timeout / evidence_missingのコマンドを次回修復delta候補へ変換
4. valid状態では以下を必ず画面に出す。
   - source_queue_item_id
   - source_run_status
   - commit_sha
   - command_details（command / exit_code / duration / status / artifact_path / failure_category / repair_instruction）
   - browser_coverage（Chromium / Firefox / WebKit）
   - terminal_evidence
   - screenshot_evidence
   - playwright_report
   - review_finding_draft
   - aidd_spec_connections
5. failure/repair_neededでは、標準Review Finding形式に近いカードを表示し、AI Task Packet delta / Codex prompt delta / verification commandへ戻す。
6. unit testは日本語名で、ready/blocked/repair_neededの判定、Firefox除外検出、artifact path不足検出、修正指示不足検出を検証する。
7. Playwright E2EはChromium/Firefox/WebKitを対象にし、日本語名でempty/valid/failure/repair_neededを検証する。
8. `doctor:aidd` はMVP060固有語、3ブラウザ、command別detail、artifact path、failure category、repair instruction、terminal evidence、screenshot evidence、AIDD-Spec接続、ローカルパス混入検出を静的に確認する。
9. `scripts/capture-mvp060.mjs` で以下の画像を `artifacts/screenshots/` に保存する。
   - `aidd-control-plane-mvp060-empty.png`
   - `aidd-control-plane-mvp060-valid.png`
   - `aidd-control-plane-mvp060-failure.png`
   - `aidd-control-plane-mvp060-repair-needed.png`
   - `aidd-control-plane-mvp060-terminal-evidence.png`
10. 次のコマンドが通る状態にする。
   - `pnpm run lint`
   - `pnpm run typecheck`
   - `pnpm run test`
   - `pnpm run build`
   - `pnpm run test:e2e`
   - `pnpm run doctor:aidd`

実際の外部API・Codex起動・GitHub Actions接続はしないでください。fixture駆動の小さなMVPにしてください。
