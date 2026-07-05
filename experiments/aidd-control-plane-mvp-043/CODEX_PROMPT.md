あなたはCodex Mastery Labの実装担当です。/Users/tto/codex-mastery-lab はgit repoです。

目的: experiments/aidd-control-plane-mvp-043/generated-repo に、AIDD Control Plane MVP 043「Review Finding Action Queue」を実装してください。

前提:
- experiments/aidd-control-plane-mvp-042/generated-repo をコピーして土台にしてよい。
- UI文言・テスト名・サンプルデータは日本語を基本にする。
- 重い依存追加は禁止。既存のNext.js/TypeScript/Vitest/Playwright構成を使う。
- 既存の未コミット変更（assets/2026-07-05-character-collection-rpg-trial-028-battle-stage.png、preview/assets/...、scripts/codex_usage_kpi.py、logs/2026-07-05-env-precheck.log）は触らない。

実装したい機能:
Review Record Receipt Synthesizerの結果を入力として、Review Findingを次の行動キューに変換するUIを作る。

MVP 043の名前:
- AIDD Control Plane MVP 043 Review Finding Action Queue

必須状態:
1. empty
   - まだReview Finding Action Queueがないことを表示
   - 次に必要な入力として source review receipt / finding list / priority rule / verification command / evidence requirement を表示
2. valid
   - source review id
   - queue id
   - findingごとの action item
   - action itemには action id, finding category, severity, lane(execute_now / next_increment / learning_log), priority reason, AI Task Packet patch, Codex prompt patch, verification commands, required evidence, rollback condition, AIDD-Spec connection を持たせる
   - execute_now だけをCodex prompt previewに入れる
   - next_increment と learning_log はpromptに混ぜないことを明示
3. failure
   - source不足
   - priority reason不足
   - lane不足
   - verification command不足
   - rollback不足
   - required evidence不足
   - Firefox除外
   - terminal / failure screenshot不足
   - local path / host / private network URL混入
   - execute_now以外のprompt混入
   - AIDD-Spec接続不足
   を検出して日本語で表示する

必要な実装:
- package名等を mvp-043 に更新
- 型、factory、evaluatorを追加または更新
- UIにReview Finding Action Queueセクションを追加
- サンプル操作ボタン: action empty / action valid / action failure
- Vitestでempty/valid/failure evaluatorをテスト
- Playwrightで3状態の表示と、valid時にexecute_nowのみprompt previewに入ること、failure時に不足が見えることをテスト
- doctor:aiddでMVP名と主要観点を検査
- capture:mvp043 scriptを作り、assetsに empty / valid / failure / terminal evidence のpngを保存できるようにする

検証:
可能な範囲で以下を実行してください。
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run doctor:aidd
- pnpm run test:e2e

最後に、変更概要・実行したコマンド・失敗があれば失敗内容を出力してください。
