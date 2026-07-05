# AI Task Packet: AIDD Control Plane MVP 048

## 1. Product Brief

### 名前
One-Run Execution Readiness Gate

### 解く課題
Review Finding Action Queueで `execute_now` に選ばれた項目を、実際にCodexへ渡す直前に ready / blocked として判定したい。AI実行前に、危険なcommand、浅い検証、Firefox除外、証跡不足、rollback不足、local pathやhost名の混入を止める。

### 非ゴール

- 実際にCodexを起動する機能は作らない
- GitHub APIや外部CI連携はしない
- 認証・DB永続化は実装しない
- 英語UIにはしない

## 2. 主要ユーザーフロー

1. ユーザーが空状態を見る
2. サンプルのready receiptを読み込む
3. `source queue id`、`execute_now action id`、`Codex command`、`sandbox mode`、`required verification commands`、`Chromium / Firefox / WebKit`、`required evidence`、`rollback stop condition`、`ready reason`、`AIDD-Spec connection` を確認する
4. readyならCodex実行前チェックを通過として表示する
5. blockedサンプルでは不足・危険条件を日本語で一覧表示する
6. Codex command previewには `execute_now` の1件だけが入る

## 3. 状態設計

- empty: readiness gate未作成。必要入力一覧と「なぜ止めるか」を表示
- ready: 1件のexecute_nowのみ、danger-full-accessなど明示sandbox、lint/typecheck/test/build/e2e/doctor:aidd、3ブラウザ、terminal/empty/valid/failure screenshot、rollback、AIDD-Spec接続が揃っている
- blocked: 次を検出して止める
  - source queue id不足
  - execute_now以外のaction混入
  - 危険command（`rm -rf`、`curl | sh`、未レビューpush等）
  - sandbox mode不足
  - required verification commands不足
  - Firefox除外
  - terminal evidence不足
  - failure screenshot不足
  - rollback stop condition不足
  - local path / host / private network URL混入
  - AIDD-Spec connection不足

## 4. 受け入れ条件

- UI文言、テスト名、サンプルデータは日本語
- Next.js + TypeScript + pnpm
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e` は Chromium / Firefox / WebKit
- `pnpm run doctor:aidd` はMVP048固有tokenと証跡条件を検査する
- `pnpm run capture:mvp048` で empty / ready / blocked / terminal evidence 画像を生成する

## 5. Verification Evidence

保存先:

- `experiments/aidd-control-plane-mvp-048/artifacts/terminal/*.txt`
- `experiments/aidd-control-plane-mvp-048/artifacts/screenshots/*.png`
- repo root `assets/aidd-control-plane-mvp048-*.png`

## 6. AIDD-Spec接続

- `Verification Evidence` は「実行前に検証条件を固定する」証跡
- `Review Record` は blocked reason を finding として残す
- `Learning Log` は、実行前に止められた理由を次回packetへ戻す
- `AI Task Packet` は ready item だけを次のCodex promptへ渡す
