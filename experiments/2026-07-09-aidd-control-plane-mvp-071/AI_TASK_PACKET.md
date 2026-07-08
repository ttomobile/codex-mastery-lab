# AI Task Packet: AIDD Control Plane MVP071 Handoff Decision Ledger

## Product Brief

AIDD Control Planeは、縮小版AI Task PacketをCodexへ渡す直前のHandoff Receiptを見た後、実行へ進めるか、保留するか、止めるかをReview Recordとして残すSaaSである。

## Goal

MVP071では `Handoff Decision Ledger` を実装する。MVP070のreceiptを入力にして、次をUIに出す。

- empty: 判断材料がない
- approved: 実行してよい。approved execute_nowだけをCodex command draftへ進める
- held: 保留。hold reasonとLearning Log返却が必要
- blocked: 未承認、理由不足、3ブラウザ不足、evidence不足、local path / private host / private network URL混入を止める

## Non-goals

- 実際のCodex実行キュー投入はしない
- 外部GitHub APIは呼ばない
- 実サービス名、公式ロゴ、秘密情報は使わない

## Acceptance Criteria

1. 日本語UIで4状態を切り替えられる。
2. approvedではdecision owner、decision reason、approved execute_now、Codex command draft、verification commands、required evidence、rollback condition、AIDD-Spec接続が見える。
3. heldではhold reasonとLearning Log返却が見える。
4. blockedでは未承認、理由不足、3ブラウザ不足、evidence不足、local path/private host/private network URL混入を日本語で表示する。
5. Codex prompt / command draftにはapproved execute_now以外を混ぜない。
6. doctor:aiddで日本語UI、3ブラウザE2E、terminal evidence、initial/approved/blocked/terminal screenshot、AIDD-Spec接続を検査する。

## Verification Commands

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp071
```

## Required Evidence

- `artifacts/terminal/*.txt`
- `artifacts/screenshots/aidd-control-plane-mvp071-initial.png`
- `artifacts/screenshots/aidd-control-plane-mvp071-approved.png`
- `artifacts/screenshots/aidd-control-plane-mvp071-blocked.png`
- `artifacts/screenshots/aidd-control-plane-mvp071-terminal-evidence.png`

## Rollback Condition

3ブラウザE2E、doctor:aidd、または公開前サニタイズ検査が失敗した場合は、実行判断をapprovedにせずblockedとしてLearning Logへ戻す。
