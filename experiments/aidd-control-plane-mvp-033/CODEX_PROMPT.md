あなたはCodex Mastery Labの実装担当です。既存のAIDD Control Plane MVP032をベースに、MVP033として「Run Result Review Synthesizer」を追加してください。

制約:
- 作業範囲はこのgenerated-repo内だけ。
- UI文言、テスト名、サンプルデータは日本語中心。
- 既存のCodex Run Queueを壊さず、その次の段階として表示する。
- 重い依存は追加しない。

実装したい内容:
1. `src/lib/intake.ts` に RunResultReview / RunResultFinding / sample factory / evaluate関数を追加する。
   - reviewは sourceRunId, outcome(passed/failed/needs_evidence), score, findings, neededUpstreamInfo, aiTaskPacketDelta, codexPromptDelta, verificationCommands, reviewRecordLinks, learningLogEntries, aiddSpecConnections を持つ。
   - valid sampleは成功runからReview Record / Learning Log / prompt deltaまで生成できる状態。
   - failure sampleはterminal evidence不足、screenshot不足、Firefox除外、doctor:aidd未実行、rollback未確認、local path/host/tailnet混入、prompt delta不足を含む。
   - evaluateはfindingを標準形式(category/severity/observedBy/idealState/fixInstruction/neededUpstreamInfo/standardUpdate/codexPromptDelta/verification)で返す。
2. UI(app/page.tsx等)にMVP033見出しとRun Result Review Synthesizerセクションを追加する。
   - empty/valid/failureを切り替えるボタンを用意する。
   - validではscore、outcome、Review Finding、AI Task Packet delta、Codex prompt delta、Verification command、Learning Logを見せる。
   - failureでは不足や混入を赤/警告系のReview Findingとして見せる。
3. VitestとPlaywright E2EをMVP033に合わせて追加/更新する。
4. doctor:aiddにMVP033チェックを追加する。
5. capture scriptを追加し package.json に `capture:mvp033` を追加する。empty/valid/failure/terminal evidence のスクリーンショットを保存できるようにする。
6. READMEやdocsがあればMVP033の説明を短く更新する。

完了前に `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` を実行し、失敗があれば直してください。
