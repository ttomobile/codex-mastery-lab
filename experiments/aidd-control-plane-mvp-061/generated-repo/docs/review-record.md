# Review Record: MVP061

## 判断

AIDD Control Plane MVP061として、Verification Run DetailからEvidence Repair Deltaを生成する画面を採用する。

## 理由

検証runの失敗を次の作業へ戻すには、失敗したcommandだけでなく、修正指示、再検証コマンド、戻す条件、Learning Logへ残す内容が必要になる。MVP061ではfailed / timeout / evidence_missingから修理deltaを作り、AIDD-Spec v0.1、AIDD Control Plane MVP v0.1、Verification Evidence、Review Record、Learning Log、AI Task Packetへの接続を表示する。

## 差し戻し観点

- source detail不足
- 失敗分類不足
- 修正指示不足
- Firefox除外
- terminal/failure screenshot不足
- local path / host / private network URL混入

## 修復観点

repair_neededではexecute_now / next_increment / learning_logに分け、次の1回に入れるdeltaを絞る。validではAI Task Packet delta / Codex prompt delta / verification command / rollback condition / Learning Log noteを表示する。

## 確認

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp061`
