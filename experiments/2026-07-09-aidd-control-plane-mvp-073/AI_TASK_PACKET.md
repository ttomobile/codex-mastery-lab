# AI Task Packet: AIDD Control Plane MVP 073 Smoke Action Run Queue Intake

## Product Brief
Smoke Finding Action Queueでexportedになったexecute_now actionを、実際のCodex Run Queueへ積む前に検査する。読者やレビュアーが「この修正actionは今すぐ実行してよいのか」「証跡が足りず止めるべきか」を判断できるようにする。

## Non-goals
- 実際にCodexを起動するキューworkerは作らない
- GitHub Actions API連携はしない
- 複数プロジェクト管理はしない

## Target UI states
1. empty: exported smoke actionが未選択
2. queued: execute_now actionだけがRun Queue itemへ変換される
3. rejected: 未export action、危険command、sandbox不足、Firefox除外、local path/private network URL混入を拒否する
4. evidence_missing: 実行前に必要なterminal/failure screenshot/Playwright report証跡が足りない

## Acceptance criteria
- 全UIコピー・テスト名は日本語
- AIDD-Spec v0.1、Control Plane標準、Verification Evidence、Review Record、Learning Log接続が見える
- queued payloadにはexecute_nowだけが入り、next_increment / learning_logは混入しない
- rejected理由とevidence_missing理由が画面・unit test・E2E・doctor:aiddで確認できる
- PlaywrightはChromium / Firefox / WebKitで通す
- empty / queued / rejected / evidence_missing / terminal evidence画像を生成する

## Verification commands
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp073
