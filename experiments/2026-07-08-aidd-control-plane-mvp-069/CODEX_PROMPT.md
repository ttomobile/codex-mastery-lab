# Codex Prompt: MVP069 Codex Run Budget Shrink Planner

`experiments/2026-07-08-aidd-control-plane-mvp-069/generated-repo/` を実装してください。

要件:

- Next.js + TypeScript + pnpm。
- UI、テスト名、サンプルデータ、README/docsは日本語。
- AIDD Control Plane MVP069として、Codex Run Budget Shrink Plannerを作る。
- 状態は ready / brake / stop / sanitized。
- brakeでは、`keep_now`を1件に絞り、`defer_next_increment`を次回送りとして表示する。
- stopでは、最低検証・3ブラウザ・terminal/failure screenshot・rollback不足をブロック理由として表示する。
- sanitizedでは、Codex prompt previewに`keep_now`だけを残し、local path / private host / private network URLを含めない。
- `pnpm run lint`, `typecheck`, `test`, `build`, `test:e2e`, `doctor:aidd`, `capture:mvp069`を用意する。
- PlaywrightはChromium / Firefox / WebKit。`timeout: 120_000`, `expect: { timeout: 90_000 }`, `workers: 1`, ローカル`retries: 1`を使う。
- `scripts/doctor-aidd.mjs`でAIDD-Spec接続、3ブラウザ、危険文字列、prompt混入、capture asset名を検査する。
- 画像証跡を`assets/`と`artifacts/screenshots/`へ保存するcapture scriptを作る。

完了後、Codexの自己申告に頼らず独立検証できる状態にしてください。
