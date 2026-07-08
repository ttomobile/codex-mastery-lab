# MVP073 Product Brief

## 体験

AIDD Control Plane MVP073は、export済みSmoke ActionをRun Queueへ投入する前に、投入可能性、Codex command、sandbox、3ブラウザ検証、必要証跡を確認する小さなSaaS画面です。

## ゴール

- empty / queued / rejected / evidence_missing を日本語UIで切り替える。
- queuedでは、source smoke action id、queue item id、Codex command、sandbox mode、required verification commands、Chromium / Firefox / WebKit、required evidence、rollback plan、AIDD-Spec接続、Run Queue payloadを表示する。
- queued payloadとCodex command previewにはexecute_nowだけを入れ、next_increment / learning_logを混ぜない。
- rejectedでは未export action、execute_now以外混入、危険command、sandbox不足、Firefox除外、local path/private network URL混入を検出する。
- evidence_missingではterminal evidence、failure screenshot、Playwright report不足を検出する。
- スクリーンショットを `assets/` と `artifacts/screenshots/` の両方へ保存できる。

## 非ゴール

- 実際のCodex実行キュー投入はしない。
- 外部監視SaaSやGitHub APIは呼ばない。
- 実サービス名、公式ロゴ、秘密情報は使わない。

## 主要フロー

1. reviewerがempty状態で投入待ちSmoke Actionがないことを確認する。
2. queuedへ切り替え、Run Queue itemとexecute_now限定payloadを確認する。
3. rejectedへ切り替え、投入前に拒否すべき6種類の条件を確認する。
4. evidence_missingへ切り替え、提出証跡の不足を確認する。

## 検証

`pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd`, `pnpm run capture:mvp073` で独立検証できるログと画像を `artifacts/` と `assets/` に残します。
