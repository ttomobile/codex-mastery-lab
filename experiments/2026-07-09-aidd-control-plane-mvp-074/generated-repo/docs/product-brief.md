# MVP074 Product Brief

## 体験

AIDD Control Plane MVP074は、Run Queueに入ったCodex実行を、実行待ち、実行中、成功、失敗、証跡不足として追跡する画面です。レビュアーは、実行状態、検証結果、3ブラウザcoverage、Review Finding、Learning Logへ戻す内容を1画面で確認できます。

## ゴール

- `?state=` で empty / waiting / running / succeeded / failed / evidence_missing を切り替える。
- waitingではsource intake id、queue item id、Codex command、sandbox、required verification commands、Chromium / Firefox / WebKit、rollback plan、AIDD-Spec接続を表示する。
- runningではstarted at、operator、current step、duration、evidence root、browser console collection statusを表示する。
- succeededではactual results、command別exit code、3ブラウザcoverage、terminal evidence、screenshot evidence、Playwright report、Review Record output、Learning Log outputを表示する。
- failedではcommand失敗、Firefox未実行、doctor:aidd失敗、危険command、rollback不足、console error/warn、local path/private network URL混入をReview Findingとして表示する。
- evidence_missingではterminal evidence、failure screenshot、browser console log、Playwright report、掲載用GIF不足を表示する。
- `pnpm run capture:mvp074` で画面PNGを `assets/` と `artifacts/screenshots/` の両方へ保存する。

## 非ゴール

- 実際にCodex workerを起動しない。
- GitHub Actions APIや外部監視サービスへ接続しない。
- 永続DB、認証、課金、複数tenant管理は実装しない。
- 実在サービスの商標、公式ロゴ、秘密情報は使わない。

## 主要フロー

1. reviewerがempty状態で追跡中のCodex実行がないことを確認する。
2. waitingへ切り替え、投入元、command、sandbox、検証command、3ブラウザ、rollback、AIDD-Spec接続を確認する。
3. runningへ切り替え、開始時刻、operator、現在step、duration、証跡保存先、console収集状態を確認する。
4. succeededへ切り替え、実行結果、exit code、3ブラウザcoverage、terminal/screenshot evidence、Playwright report、Review Record、Learning Logを確認する。
5. failedへ切り替え、Review Findingとして戻すべき失敗分類を確認する。
6. evidence_missingへ切り替え、不足証跡を次回AI Task Packet deltaへ戻す。

## 検証

`pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd`, `pnpm run capture:mvp074` で独立検証できるログと画像を `artifacts/` と `assets/` に残します。
