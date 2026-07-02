# AI Task Packet: AIDD Control Plane MVP 019

## 1. タスク名

Delta Decision ReviewをAIDD Control Plane generated repoに追加する。

## 2. 背景

MVP 018では、Spec Update Proposalを次回AI Task Packet差分として採用した場合のbefore/after、acceptance criteria、verification command、Codex prompt patch、rollback conditionを見える化した。しかし、差分をレビューしたあとに、採用 / 却下 / 保留の判断と理由が残らない。

これは料理の改善メモでいえば、「次回レシピに入れてよい変更」と「今回は見送る変更」が同じメモ帳に混ざっている状態である。AIへ渡す入力は、採用判断済みの差分だけに絞る必要がある。

## 3. 作るもの

`experiments/aidd-control-plane-mvp-019/generated-repo`に、MVP 018を引き継いだNext.js + TypeScriptアプリとして、次を実装する。

- UIセクション: `Delta Decision Review`
- 状態切替: `empty`, `valid`, `failure`
- decision生成ロジック
  - delta id
  - source proposal
  - decision status: `adopted` / `rejected` / `deferred`
  - decision owner
  - decision reason
  - decided at
  - next action
  - review evidence
  - rollback confirmed
  - included in next packet
- 採用済みdeltaだけを次回AI Task Packet / Codex prompt対象として集計する表示
- failure finding生成
- doctor:aiddの静的検査
- 日本語Unitテスト
- Chromium / Firefox / WebKitのPlaywright E2E
- capture:mvp019スクリプト

## 4. UI要件

- UIコピーは日本語。
- 初期状態では「まだ判断待ちの差分がありません」を表示する。
- validでは、採用 / 却下 / 保留の件数、次回packetへ入る差分、判断理由、証跡、rollback確認を表示する。
- failureでは、判断者不足、理由不足、rollback確認不足、採用なのにverification command不足、却下なのに再発防止メモ不足をReview Findingとして表示する。
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

- `AI Task Packet Delta -> Review Record -> 次回AI Task Packet` を具体化するMVPとして扱う。
- `standards/aidd-spec-v0.1.md` と `standards/aidd-control-plane-mvp-v0.1.md` に接続する文言をUIとdoctorに含める。
- 次のMVPとして、採用済みdeltaをMarkdown差分として書き出す入口へ進めるよう、データ構造を分ける。
