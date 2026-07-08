# Codex Prompt: MVP073

`experiments/2026-07-09-aidd-control-plane-mvp-073/generated-repo/` で実装してください。

AIDD Control Planeの次インクリメントとして **Smoke Action Run Queue Intake** 画面を実装する。

要件:
- Next.js + TypeScript + pnpm構成を維持する
- 日本語UI、日本語テスト名にする
- 既存MVP072の構造を参考に、MVP073として差し替える
- empty / queued / rejected / evidence_missing 状態を表示する
- queuedでは source smoke action id、queue item id、Codex command、sandbox mode、required verification commands、Chromium / Firefox / WebKit、required evidence、rollback plan、AIDD-Spec接続、Run Queue payloadを表示する
- queued payloadとCodex command previewにはexecute_nowだけを入れ、next_increment / learning_logを混入させない
- rejectedでは未export action、execute_now以外混入、危険command、sandbox不足、Firefox除外、local path/private network URL混入を検出する
- evidence_missingではterminal evidence、failure screenshot、Playwright report不足を検出する
- unit test、Playwright E2E、doctor:aidd、capture:mvp073を更新する
- スクリーンショットは assets/ と artifacts/screenshots/ に保存できるようにする

完了前に pnpm run lint / typecheck / test / build / test:e2e / doctor:aidd が通る状態にする。
