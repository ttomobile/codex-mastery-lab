# Codex Prompt: AIDD Control Plane MVP 080

`experiments/2026-07-09-aidd-control-plane-mvp-080/generated-repo/` に、Next.js + TypeScript + pnpm の小さなMVPを実装してください。

要件:
- 機能名は `Run Queue Dispatch Receipt`。
- `?state=empty|ready|running|failure|blocked` で表示状態を切り替える。
- 日本語UIで、queue item、execute_now payload、dispatch command、verification gates、evidence checklist、rollback condition、sanitize scan、AIDD-Spec connection、Review Findingを表示する。
- readyでは「Dispatch Receiptを発行できます」、runningでは「実行中の証跡を収集中」、failureではReview Finding YAML風カード、blockedでは「Dispatch停止」を表示する。
- payload previewにはexecute_nowだけを入れ、next_increment / learning_logを混入させない。隔離欄には表示してよい。
- blockedでは local path、private URL、next_increment混入、learning_log混入、Firefox除外、terminal evidence不足、failure screenshot不足、破壊的cleanup要求を止める。
- `pnpm run lint`, `typecheck`, `test`, `build`, `test:e2e`, `doctor:aidd` を用意する。
- Playwrightは Chromium / Firefox / WebKit 3ブラウザ構成。
- `doctor:aidd` は状態名、AIDD-Spec接続、3ブラウザ、terminal/failure screenshot、local path禁止、execute_now限定payload、rollback、sanitize gateを検査する。
- スクリーンショット用に `scripts/capture-mvp080.mjs` を用意し、empty/ready/running/failure/blocked/terminal evidenceを `assets/` と `artifacts/screenshots/` に保存できるようにする。

完了後、実行したコマンドと結果を短くまとめてください。
