# AI Task Packet: AIDD Control Plane MVP 074 Codex Run Queue Status Tracker

## Product Brief
Run Queue IntakeでqueuedになったCodex実行を、実行待ち・実行中・成功・失敗・証跡不足として追跡する。読者やレビュアーが「実行はどこまで進み、何が証跡として残り、何を次回AI Task Packetへ戻すべきか」を1画面で判断できるようにする。

## Non-goals
- 実際にCodexを起動するworkerは作らない
- GitHub Actions API連携はしない
- 複数プロジェクトの永続DBは作らない
- 実在サービスの商標・ロゴ・コピーは使わない

## Target UI states
1. empty: queued runがない
2. waiting: 実行待ち。command、sandbox、検証継承、rollback条件が見える
3. running: 実行中。開始時刻、進捗、現在の検証ステップ、証跡保存先が見える
4. succeeded: 成功。actual results、Chromium / Firefox / WebKit、terminal evidence、screenshot evidence、browser console、Playwright report、Review Record / Learning Log出力が見える
5. failed: 失敗。exit code、失敗分類、修正指示、次回AI Task Packet delta、rollback条件が見える
6. evidence_missing: 実行は終わったがterminal/failure screenshot/Playwright report/browser console等が欠けている

## Acceptance criteria
- 全UIコピー・テスト名は日本語
- AIDD-Spec v0.1、Control Plane標準、Verification Evidence、Review Record、Learning Log接続が見える
- succeeded/failed/evidence_missingをReview FindingまたはLearning Logへ戻す表示がある
- dangerous command、Firefox除外、doctor:aidd失敗、console error/warn、local path/private network URL混入を検出する
- PlaywrightはChromium / Firefox / WebKitで通す
- empty / waiting / running / succeeded / failed / evidence_missing / terminal evidence画像を生成する

## Verification commands
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp074
