# AI Task Packet: AIDD Control Plane MVP 038

## 1. Product Brief

AIDD Control Planeに「Execution Priority Set Builder」を追加する。MVP 037で採用済みにしたrepair deltaを、次の1回のCodex実行へ入れる範囲、次回以降へ送る範囲、Learning Logへ戻す範囲に整理し、実行直前のAI Task Packet / Codex promptを小さく保つ。

## 2. 背景

採用済みrepair deltaが複数あると、すべて重要に見える。しかしAI駆動開発の1インクリメントは、検証できる大きさに切る必要がある。AIDD-Specでは、実行前にスコープ、予算、証跡、rollbackを確認するReview Recordが必要になる。

## 3. 実装範囲

- `src/lib/intake.ts`
  - `ExecutionPrioritySetBuilder`系の型、empty/valid/failure factory、evaluatorを追加
  - valid sampleはMVP 037のadopted repair deltaを入力として、`execute_now` / `next_increment` / `learning_log`を混在させる
  - execute_nowだけにCodex prompt patch、検証コマンド、rollback条件、terminal/screenshot evidenceを持たせる
  - failure sampleは優先順位重複、実行予算不足、検証コマンド不足、rollback不足、未採用delta混入、Firefox除外、local path/host/tailnet混入を含める
- `app/page.tsx`
  - 「Execution Priority Set Builder」セクションを追加
  - `execution empty` / `execution valid` / `execution failure` の操作ボタンを追加
  - status、findings、今回実行、次回送り、Learning Log戻し、Codex prompt previewを日本語で表示
- `tests/intake.test.ts`
  - 日本語名のunit testを追加
- Playwright E2E
  - empty / valid / failure状態を3ブラウザで確認
- `scripts/doctor-aidd.mjs`
  - MVP 038固有の実装・テスト・E2E・日本語UI文言を検査
- capture script
  - empty / valid / failure / terminal evidence画像を生成

## 4. 非ゴール

- 実際にCodexを起動するジョブキューは作らない
- GitHub IssueやPRへ自動投稿しない
- 複数プロジェクト管理はしない

## 5. 受け入れ条件

- 今回実行するdeltaだけがCodex prompt previewへ入ることがUIとテストで分かる
- 次回送り/Learning Log戻しが、今回promptに混ざらない
- 優先順位重複、実行予算不足、検証コマンド不足、rollback不足、Firefox除外、local path/host/tailnet混入をfailureとして検出する
- 表示文言、テスト名、記事は日本語を基本にする
- AIDD-Spec v0.1とControl Plane MVP標準への接続がUIとdoctorで確認できる

## 6. 検証コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```
