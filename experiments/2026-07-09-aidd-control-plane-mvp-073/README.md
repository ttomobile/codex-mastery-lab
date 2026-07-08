# AIDD Control Plane MVP 073: Smoke Action Run Queue Intake

## 目的
MVP072のSmoke Finding Action Queueでexportedになったexecute_now actionを、Codex Run Queueへ入れる直前に `queued / rejected / evidence_missing / empty` として検査する入口を作る。

## AIDD-Spec接続
- `standards/aidd-spec-v0.1.md`: AI Task Packet / Verification Evidence / Review Record / Learning Log
- `standards/aidd-control-plane-mvp-v0.1.md`: Smoke Action Run Queue Intake

## 実装範囲
- 日本語UI
- empty / queued / rejected / evidence_missing の4状態
- source smoke action id、queue item id、Codex command、sandbox mode、required verification commands、Chromium / Firefox / WebKit、required evidence、rollback plan、AIDD-Spec接続を表示
- rejectedでは未export action、execute_now以外混入、危険command、sandbox不足、Firefox除外、local path/private network URL混入を検出
- evidence_missingではterminal/failure screenshot/Playwright report不足を検出
- queuedではRun Queueへ渡す最小payloadと次のverification commandを表示

## 独立検証
`pnpm install --frozen-lockfile`、`pnpm run lint`、`pnpm run typecheck`、`pnpm run test`、`pnpm run build`、`pnpm run test:e2e`、`pnpm run doctor:aidd`、`pnpm run capture:mvp073` を個別ログとして保存する。
