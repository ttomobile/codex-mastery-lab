# AI Task Packet: AIDD Control Plane MVP 033

## Spec接続
- AIDD-Spec v0.1: Verification Evidence、Review Record、Learning Log、AI Task Packet Delta
- AIDD Control Plane MVP v0.1: Codex Run Queueの次工程として、Run Result Review Synthesizerを追加
- AI Task Packet標準 v0.1: findingsを次回prompt deltaとverification commandへ戻す

## ユーザー価値
AI実行後のログを見て「成功した」「失敗した」だけで終わらせず、次回AIへ渡す改善指示、必要な上流artifact、検証コマンドまで一画面で確認できる。

## 必須UI
1. `Run Result Review Synthesizer` セクション
2. empty / valid / failure 切替
3. valid状態では以下を表示
   - source run id
   - review score
   - passed / needs evidence / failed の分類
   - finding一覧
   - needed upstream information
   - AI Task Packet delta
   - Codex prompt delta
   - verification command
   - Review Record / Learning Log / AIDD-Spec接続
4. failure状態では以下を検出
   - queue結果がない
   - terminal evidence不足
   - screenshot / playwright report不足
   - Firefox除外
   - doctor:aidd未実行
   - rollback未確認
   - local path / host / tailnet混入
   - 次回prompt delta不足

## データ/ロジック
- `src/lib/intake.ts` に RunResultReview / RunResultFinding / sample factory / evaluate関数を追加する。
- finding形式は category, severity, observedBy, idealState, fixInstruction, neededUpstreamInfo, standardUpdate, codexPromptDelta, verification を持つ。
- scoreは100点満点から重大度に応じて減点する。

## テスト
- Vitestでvalid/failure scoreとfinding分類を確認する。
- Playwrightでempty/valid/failureの表示と日本語ラベルを確認する。
- doctor:aiddでMVP033の重要文言とscriptを検査する。

## 非ゴール
- 実際のGitHub API連携はしない。
- LLMによる自由文生成はしない。今回は決定的なfixture/evaluatorで検証する。
