# AI Task Packet: AIDD Control Plane MVP 018

## 1. タスク名

AI Task Packet Delta Apply PreviewをAIDD Control Plane generated repoに追加する。

## 2. 背景

MVP 017では、Review FindingとLearning LogをSpec Update Proposal Queueへ変換した。しかし、proposalを採用した後にAI Task Packet、Codex prompt、検証計画がどう変わるのかが見えない。これは料理でいえば、改善メモはあるが、次回のレシピのどこに何を足すのかが確認できない状態である。

AIDD Control Planeは別のコーディングエージェントではなく、AIへ渡す前後の情報を整えるSaaSである。MVP 018では、Spec Update Proposalを次回AI Task Packetへ反映する前の差分プレビューを作る。

## 3. 作るもの

`experiments/aidd-control-plane-mvp-018/generated-repo`に、MVP 017を引き継いだNext.js + TypeScriptアプリとして、次を実装する。

- UIセクション: `AI Task Packet Delta Apply Preview`
- 状態切替: `empty`, `valid`, `failure`
- delta生成ロジック
  - source proposal
  - target packet section
  - before summary
  - after summary
  - added acceptance criteria
  - added verification commands
  - codex prompt patch
  - rollback condition
  - review checklist
- doctor:aiddの静的検査
- 日本語Unitテスト
- Chromium / Firefox / WebKitのPlaywright E2E
- capture:mvp018スクリプト

## 4. UI要件

- UIコピーは日本語。
- 初期状態では「まだ反映プレビューがありません」を表示する。
- validでは、MVP 017のSpec Update Proposalを採用した場合に、次回AI Task Packetのどの欄がどう変わるかを表示する。
- validでは、Codex prompt deltaと検証コマンドをすぐコピーできる形で表示する。
- failureでは、対象packet section未設定、検証コマンド不足、rollback条件不足、根拠finding不足をReview Findingとして表示する。
- 重要gateは初期画面または明確なセクションで見えるようにする。
- 建築/建物メタファーは使わない。

## 5. テスト要件

- テスト名は日本語。
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 6. AIDD-Spec接続

- `Spec Improvement -> AI Task Packet Delta -> Verification Evidence` を具体化するMVPとして扱う。
- `standards/aidd-spec-v0.1.md` と `standards/aidd-control-plane-mvp-v0.1.md` に接続する文言をUIとdoctorに含める。
- next stepとして、承認/却下/保留ステータスや実ファイル差分生成に進めるよう、データ構造を分ける。
