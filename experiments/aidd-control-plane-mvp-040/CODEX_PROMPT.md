あなたはCodex Mastery LabのAIDD Control Plane MVP 040を実装するエージェントです。

作業ディレクトリ: `experiments/aidd-control-plane-mvp-040/generated-repo/`

## ゴール

既存のAIDD Control Planeデモに「Codex Run Start Receipt Auditor」を追加してください。これはMVP 039のOne-Run Handoff Pack Reviewerの次に位置し、手渡しパックをCodexへ渡した直後の実行開始レシートを監査する機能です。

## 必須要件

1. `src/lib/intake.ts`
   - `CodexRunStartReceiptAuditor` 系の型を追加する。
   - empty / valid / failure fixtureとevaluatorを追加する。
   - valid fixtureには次を含める。
     - source handoff pack id
     - Codex command（`codex exec --sandbox danger-full-access ...`）
     - sandbox mode
     - started at
     - operator
     - evidence root
     - required verification commands（lint/typecheck/test/build/test:e2e/doctor:aidd）
     - browser projects（Chromium / Firefox / WebKit）
     - required screenshots（empty / valid / failure / terminal evidence）
     - rollback stop condition
     - AIDD-Spec connections
   - failure fixtureでは危険command、sandbox不足、evidence root不足、Firefox除外、terminal/failure screenshot不足、rollback不足、AIDD-Spec接続不足、local path/host/private network URL混入を検出する。

2. `app/page.tsx`
   - 日本語UIで「Codex Run Start Receipt Auditor」セクションを追加する。
   - `receipt empty` / `receipt valid` / `receipt failure` 操作を追加する。
   - valid状態で実行開始レシート、検証継承、証跡保存先、rollback停止条件、AIDD-Spec接続を表示する。
   - failure状態でfindingsを表示する。

3. tests / E2E / doctor / capture
   - `tests/intake.test.ts` に日本語名のunit testを追加する。
   - Playwright E2Eでempty / valid / failureがChromium / Firefox / WebKitで通るようにする。
   - `scripts/doctor-aidd.mjs` でMVP 040固有の文言・型・テスト・E2E・capture scriptを検査する。
   - `scripts/capture-mvp040.mjs` を追加し、`artifacts/screenshots/` に以下を保存する。
     - `aidd-control-plane-mvp040-empty.png`
     - `aidd-control-plane-mvp040-valid.png`
     - `aidd-control-plane-mvp040-failure.png`
     - `aidd-control-plane-mvp040-terminal-evidence.png`
   - `package.json` に `capture:mvp040` を追加し、nameをMVP 040にする。

## 制約

- UI、テスト名、エラーメッセージは日本語を基本にする。
- 実際にCodexを起動しない。
- runtime生成物（node_modules, .next, coverage, playwright-report, test-results）はコミット対象にしない。
- AIDD-Spec v0.1と`standards/aidd-control-plane-mvp-v0.1.md`への接続をUIとdoctorで確認できるようにする。

## 完了条件

以下が成功する状態まで修正してください。

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp040
```
