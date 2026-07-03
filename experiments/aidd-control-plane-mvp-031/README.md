# AIDD Control Plane MVP 031: Run Authorization Gate

MVP 030のExported Packet Preflight Reviewerでvalidになったpacketを、実際のCodex run queueへ積む前に、誰が・どの条件で・どの証跡保存先を確認して実行許可したかを残すRun Authorization Gateを作る。

## 目的

- preflight validなpacketだけを実行許可対象にする。
- 実行者、承認理由、対象packet、Codex command、sandbox mode、検証コマンド、証跡保存先、rollback条件をUIで確認する。
- 未承認packet、preflight failure、危険なsandbox/command、Firefox除外、浅い検証、local path/host/tailnet混入、証跡不足、rollback不足を実行前に止める。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log
- Rollback Plan
- Agent Run

## 完了条件

- 日本語UIでempty / valid / failure状態を表示する。
- Run Authorization GateのユニットテストとE2Eを追加する。
- `pnpm install --frozen-lockfile`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が通る。
- `pnpm run capture:mvp031` でempty / valid / failure / terminal evidence画像を保存する。
- 記事とpreviewにスクリーンショットを掲載する。
