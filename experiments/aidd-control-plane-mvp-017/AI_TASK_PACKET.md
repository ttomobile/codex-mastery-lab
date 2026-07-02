# AI Task Packet: AIDD Control Plane MVP 017

## 1. タスク名

Spec Update Proposal QueueをAIDD Control Plane generated repoに追加する。

## 2. 背景

MVP 016ではCI workflowとartifact保存漏れを監査した。しかしAIDD Control PlaneがSaaSとして価値を出すには、見つけた不足をその場の修正だけでなく、AIDD-Spec、Control Plane MVP標準、AI Task Packetテンプレート、次回Codex promptへ戻す必要がある。

## 3. 作るもの

`experiments/aidd-control-plane-mvp-017/generated-repo`に、MVP 016を引き継いだNext.js + TypeScriptアプリとして、次を実装する。

- UIセクション: `Spec Update Proposal Queue`
- 状態切替: `empty`, `valid`, `failure`
- proposal生成ロジック
  - review finding
  - ideal state
  - needed upstream info
  - target standard document
  - target field
  - priority
  - acceptance criteria
  - codex prompt delta
  - verification command
- doctor:aiddの静的検査
- 日本語Unitテスト
- 3ブラウザPlaywright E2E
- capture:mvp017スクリプト

## 4. UI要件

- UIコピーは日本語。
- 初期状態では「まだ標準更新候補がありません」を表示する。
- validでは、CI artifact保存漏れが標準更新候補として整理され、優先度、対象文書、受け入れ条件が見える。
- failureでは、対象文書未設定、検証コマンド不足、Codex prompt delta不足をReview Findingとして表示する。
- 重要gateは初期画面または明確なセクションで見えるようにする。

## 5. テスト要件

- テスト名は日本語。
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 6. AIDD-Spec接続

- `Spec Improvement`を具体化するMVPとして扱う。
- Review Finding -> Spec Update Proposal -> AI Task Packet Delta -> Verification Evidence の流れをUIで説明する。
- 建築/建物メタファーは使わない。料理の味見メモや健康診断の再検査リストのように、初心者に伝わる比喩にする。
