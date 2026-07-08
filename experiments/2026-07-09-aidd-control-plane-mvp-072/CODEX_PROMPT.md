# Codex Prompt: MVP072

`experiments/2026-07-09-aidd-control-plane-mvp-072/generated-repo/` で実装してください。

AIDD Control Planeの次インクリメントとして **Smoke Finding Action Queue** 画面を実装する。

要件:
- Next.js + TypeScript + pnpm構成を維持する
- 日本語UI、日本語テスト名にする
- 既存MVP071の構造を参考に、MVP072として差し替える
- empty / queued / blocked / exported 状態を表示する
- queuedでは broken URL、HTTP status、byte size、content type、finding category、severity、lane、priority reason、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec接続を表示する
- exportedでは execute_nowだけをCodex prompt previewへ入れる
- blockedでは private URL混入、Firefox未確認、terminal evidence不足、AIDD-Spec接続不足、execute_now以外のprompt混入を検出する
- unit test、Playwright E2E、doctor:aidd、capture:mvp072を更新する
- スクリーンショットは assets/ と artifacts/screenshots/ に保存できるようにする

完了前に pnpm run lint / typecheck / test / build / test:e2e / doctor:aidd が通る状態にする。
