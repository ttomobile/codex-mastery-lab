# AI Task Packet: AIDD Control Plane MVP 034

## Spec接続
- AIDD-Spec v0.1: Review Record、Learning Log、AI Task Packet、Verification Evidence、Review Process
- AIDD Control Plane MVP v0.1: Run Result Review Synthesizerの次工程として、Next Increment Plannerを追加
- AI Task Packet標準 v0.1: findingsを次回1インクリメントのscope / acceptance criteria / verification / evidenceへ戻す

## ユーザー価値
AI実行後のレビュー結果を見て「で、次は何をすればいいの？」で止まらず、次の1インクリメントだけを安全に選び、AIへ渡せる粒度の計画・検証・記事化観点まで確認できる。

## 必須UI
1. `Next Increment Planner` セクション
2. empty / valid / failure 切替
3. valid状態では以下を表示
   - source review id / source run id
   - recommended increment id とタイトル
   - priority と選定理由
   - target artifact（AI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.md / article / screenshotなど）
   - acceptance criteria
   - verification commands（lint/typecheck/test/build/e2e/doctor:aidd）
   - required evidence（terminal、empty/valid/failure screenshot、preview curl check）
   - Codex prompt draft
   - rollback condition
   - note article angle
   - AIDD-Spec / Control Plane標準への接続
4. failure状態では以下を検出
   - source reviewがない
   - priority理由がない
   - acceptance criteria不足
   - 3ブラウザE2E不足
   - terminal evidence不足
   - failure screenshot不足
   - rollback条件不足
   - Codex prompt draft不足
   - local path / host / tailnet / private URL混入

## データ/ロジック
- `src/lib/intake.ts` に NextIncrementPlan / NextIncrementFinding / sample factory / evaluate関数を追加する。
- finding形式は category, severity, observedBy, idealState, fixInstruction, neededUpstreamInfo, standardUpdate, codexPromptDelta, verification を持つ。
- scoreは100点満点から重大度に応じて減点する。
- valid sampleはMVP033のRun Result ReviewからMVP034の1インクリメント計画を生成する文脈にする。

## テスト
- Vitestでvalid/failure scoreとfinding分類を確認する。
- Playwrightでempty/valid/failureの表示と日本語ラベルを確認する。
- doctor:aiddでMVP034の重要文言とscriptを検査する。

## 非ゴール
- 実際にGitHub issueや外部タスク管理ツールへ登録しない。
- LLMによる自由文生成はしない。今回は決定的なfixture/evaluatorで検証する。
