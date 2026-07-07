# Product Brief: AIDD Control Plane MVP062

## 対象体験

Evidence Repair Deltaを採用 / 保留 / 却下として判断し、採用済みdeltaだけを次回AI Task Packet / Codex promptへ進める。

## ユーザー課題

失敗ログから作った修理deltaを全部promptへ混ぜると、AIの作業範囲が広がりすぎ、未採用delta混入、Firefox除外、証跡不足、rollback不足が起きる。

## ゴール

- repair deltaをadopt / hold / rejectとして判断できる。
- adopt_nowだけがAI Task Packet patchとCodex prompt previewへ入る。
- hold / rejectはLearning Logへ戻る。
- 未判断、理由不足、証跡不足、rollback不足、Firefox除外、未採用delta混入、local path / host / private network URL混入をReview Findingへ戻す。

## 非ゴール

- 実GitHub API連携
- 実Codexキュー投入
- 永続DB

## 主要フロー

1. repair deltaを選ぶ。
2. 採用 / 保留 / 却下を判断する。
3. priority reason、decision owner、review evidence、rollback conditionを確認する。
4. adopt_nowだけをCodex prompt previewへ入れる。
5. hold / rejectをLearning Logへ戻す。
6. unit test、Chromium / Firefox / WebKitのPlaywright E2E、doctor:aidd、capture:mvp062で確認する。
