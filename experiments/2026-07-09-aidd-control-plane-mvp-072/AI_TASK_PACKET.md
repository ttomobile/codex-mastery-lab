# AI Task Packet: AIDD Control Plane MVP 072 Smoke Finding Action Queue

## Product Brief
Public Preview Smoke Verifierの失敗結果を、次の1回で実行できるReview Finding Action Queueに変換する。読者やレビュアーが「壊れたURLを見つけた後、何を直すべきか」を迷わないようにする。

## Non-goals
- 実際のGitHub API連携はしない
- 実際のpreviewサーバーをクロールしない
- 複数プロジェクト管理はしない

## Target UI states
1. empty: smoke runが未選択
2. queued: broken URLからaction itemが作られ、execute_now / next_increment / learning_logに分離される
3. blocked: private URL混入、Firefox未確認、terminal evidence不足、AIDD-Spec接続不足、execute_now以外のprompt混入を止める
4. exported: execute_nowだけをCodex prompt previewへ書き出す

## Acceptance criteria
- 全UIコピー・テスト名は日本語
- AIDD-Spec v0.1、Control Plane標準、Verification Evidence、Review Record、Learning Log接続が見える
- blocked理由が画面とunit test/e2eで確認できる
- PlaywrightはChromium / Firefox / WebKitで通す
- empty / queued / blocked / terminal evidence画像を生成する

## Verification commands
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp072
