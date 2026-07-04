あなたはCodex Mastery Labの実装担当です。既存のAIDD Control Plane MVP031をベースに、MVP032として「Codex Run Queue」を追加してください。

制約:
- 作業範囲はこのgenerated-repo内だけ。
- UI文言、テスト名、サンプルデータは日本語中心。
- 既存のRun Authorization Gateを壊さず、その次の段階として表示する。
- 重い依存は追加しない。

実装したい内容:
1. src/lib/intake.ts に CodexRunQueueItem / Review / sample factory / evaluate関数を追加する。
   - queue itemは sourceAuthorizationId, status(waiting/running/succeeded/failed/evidence_missing), codexCommand, sandboxMode, startedAt/finishedAt, requiredVerificationCommands, actualVerificationResults, browserProjects, evidencePaths, retryPolicy, rollbackPlan, reviewFindings, aiddSpecConnections を持つ。
   - valid sampleは waiting/running/succeeded を含み、failure sampleは failed/evidence_missing/危険command/Firefox除外/浅い検証/証跡不足/rollback不足を含む。
   - evaluateは「Run Authorization Gate valid由来か」「危険なcommandでないか」「Chromium/Firefox/WebKitを含むか」「lint/typecheck/test/build/test:e2e/doctor:aidd/mock:doctorがあるか」「terminal/screenshot/playwright evidenceがあるか」「retry/rollbackがあるか」「AIDD-Spec接続があるか」をfinding化する。
2. UI(app/page.tsx等)にMVP032見出しとCodex Run Queueセクションを追加する。
   - empty/valid/failureを切り替えるボタンを用意する。
   - validでは実行待ち・実行中・成功のqueueカード、検証コマンド、3ブラウザ、証跡、retry/rollback、AIDD-Spec接続を見せる。
   - failureでは失敗・証跡不足・危険command・Firefox除外・浅い検証などをReview Findingとして見せる。
3. VitestとPlaywright E2EをMVP032に合わせて追加/更新する。
4. doctor:aidd / mock:doctorに必要ならMVP032チェックを追加する。
5. capture scriptを追加し package.json に capture:mvp032 を追加する。assets相当のスクリーンショットを empty/valid/failure/terminal evidence で保存できるようにする。
6. READMEやdocsがあればMVP032の説明を短く更新する。

完了条件:
- pnpm run lint / typecheck / test / build / test:e2e / doctor:aidd / mock:doctor が通る想定の実装にする。
- 変更後に自分で軽い確認コマンドを実行し、結果を要約してください。
