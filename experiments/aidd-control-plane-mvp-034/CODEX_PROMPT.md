あなたはCodex Mastery Labの実装担当です。既存のAIDD Control Plane MVP033をベースに、MVP034として「Next Increment Planner」を追加してください。

制約:
- 作業範囲はこのgenerated-repo内だけ。
- UI文言、テスト名、サンプルデータは日本語中心。
- 既存のRun Result Review Synthesizerを壊さず、その次の段階として表示する。
- 重い依存は追加しない。
- package managerはpnpm。

実装したい内容:
1. `src/lib/intake.ts` に NextIncrementPlan / NextIncrementFinding / sample factory / evaluate関数を追加する。
   - planは sourceReviewId, sourceRunId, status(empty/ready/blocked), score, recommendedIncrement, priorityReason, targetArtifacts, acceptanceCriteria, verificationCommands, requiredEvidence, codexPromptDraft, rollbackCondition, noteArticleAngle, learningLogLinks, aiddSpecConnections, findings を持つ。
   - valid sampleはRun Result Reviewから次の1インクリメントを選び、AI_TASK_PACKET.md / CODEX_PROMPT.md / 検証計画 / 記事 / screenshotへつながる状態。
   - failure sampleはsource reviewなし、priority理由なし、acceptance criteria不足、3ブラウザE2E不足、terminal evidence不足、failure screenshot不足、rollback不足、Codex prompt不足、local path/host/tailnet/private URL混入を含む。
   - evaluateはfindingを標準形式(category/severity/observedBy/idealState/fixInstruction/neededUpstreamInfo/standardUpdate/codexPromptDelta/verification)で返す。
2. UI(app/page.tsx等)にMVP034見出しとNext Increment Plannerセクションを追加する。
   - empty/valid/failureを切り替えるボタンを用意する。
   - validではscore、recommended increment、選定理由、target artifacts、acceptance criteria、verification commands、required evidence、Codex prompt draft、rollback、note記事観点、Learning Log、AIDD-Spec接続を見せる。
   - failureでは不足や混入を赤/警告系のReview Findingとして見せる。
3. VitestとPlaywright E2EをMVP034に合わせて追加/更新する。
4. doctor:aiddにMVP034チェックを追加する。
5. capture scriptを追加し package.json に `capture:mvp034` を追加する。empty/valid/failure/terminal evidence のスクリーンショットを保存できるようにする。
6. READMEやdocsがあればMVP034の説明を短く更新する。

完了前に `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` を実行し、失敗があれば直してください。
