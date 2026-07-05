# AI Task Packet: AIDD Control Plane MVP 048

## 1. Product Brief

### 機能名

One-Run Execution Readiness Gate

### ユーザーの悩み

Review Finding Action Queueに複数種類のactionがあると、Codexへ渡す1回の実行内容に`next_increment`や`learning_log`が混ざり、検証対象と証跡責務が曖昧になる。

### ゴール

`execute_now` 1件だけをCodex command previewへ渡す直前確認画面を作る。危険command、検証不足、証跡不足、Firefox除外、公開不可情報混入、AIDD-Spec connection不足をblockedとして止める。

### 非ゴール

- 実際のCodexプロセス起動。
- Review Finding Action Queueの優先順位計算。
- 外部API接続。

## 2. 主要フロー

1. empty: 実行前入力がまだないことを表示する。
2. ready: source queue idと`execute_now` 1件だけを表示し、Codex command previewへ手渡しする。
3. blocked: source queue id不足、execute_now以外のaction混入、危険command、sandbox mode不足、required verification commands不足、Firefox除外、terminal evidence不足、failure screenshot不足、rollback stop condition不足、local path / host / private network URL混入、AIDD-Spec connection不足を表示する。

## 3. UI要件

- UI文言は日本語。
- 画面に「MVP 048: One-Run Execution Readiness Gate」を表示する。
- empty / ready / blockedを切り替えられる。
- readyではCodex command previewに`execute_now` 1件だけを入れる。
- AIDD-Spec v0.1、Verification Evidence、Review Record、Learning Logへの接続を表示する。

## 4. データ契約

`src/lib/readiness.ts`にReadinessPacket、QueueAction、evaluator、empty / ready / blocked factoryを置く。

## 5. 品質ゲート

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp048`
