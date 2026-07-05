# Learning Log: MVP051

## 学び

- Evidence Repair Deltaを全部Codexへ渡すと、次の1インクリメントが大きくなりすぎる。
- 採用 / 保留 / 却下とpriority reasonを分けると、execute_nowだけをCodex promptへ入れられる。
- Firefox除外、未採用delta混入、rollback不足は、実装前のDecision Workspaceで止めるべきである。

## AIDD-Spec update candidate

Repair Delta Priority Decision WorkspaceをReview RecordとAI Task Packetの間に置き、採用済みdeltaだけを次回packetへ進める標準項目として扱う。
