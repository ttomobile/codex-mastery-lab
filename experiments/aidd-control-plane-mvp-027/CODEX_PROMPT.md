あなたはCodexです。`experiments/aidd-control-plane-mvp-027/generated-repo` で作業してください。

MVP 026のNext.js + TypeScriptアプリをベースに、AIDD Control Plane MVP 027 `Diff Bundle & Rollback Evidence Workspace` を実装してください。

要件:

1. 日本語UIで `Diff Bundle & Rollback Evidence Workspace` セクションを追加する。
2. empty / valid / failure stateを表示できること。
3. valid stateでは以下を確認できること:
   - bundle id
   - source apply plan / patch id
   - target file
   - before hash / after hash
   - diff bundle path
   - dry-run command と dry-run status
   - rollback evidence path
   - rollback verified command
   - verification command
   - reviewer checklist
   - AIDD-Spec接続
4. failure stateでは以下を検出して日本語で表示すること:
   - 危険なtarget path（`../`、絶対パス）
   - ローカルパスやhost名の混入
   - dry-run未実行または失敗
   - rollback evidence不足
   - verification command不足
   - reviewer未承認
   - AIDD-Spec接続不足
5. unit testを追加・更新し、日本語のテスト名を使う。
6. Playwright E2Eを追加・更新し、Chromium / Firefox / WebKitで empty / valid / failure の主要表示を確認する。
7. `scripts/doctor-aidd.mjs` をMVP 027用に更新する。
8. `capture:mvp027` scriptを用意し、empty / valid / failure / terminal evidence スクリーンショットを `../artifacts/screenshots` とroot `assets` コピー用に出せるようにする。
9. `pnpm run lint` / `pnpm run typecheck` / `pnpm run test` / `pnpm run build` / `pnpm run test:e2e` / `pnpm run doctor:aidd` が通る状態にする。

注意:
- 実在サービスの商標、ロゴ、実APIは使わない。
- UIコピー、サンプルデータ、テスト名は日本語。
- runtime生成物（node_modules, .next, coverage, playwright-report, test-results, *.tsbuildinfo）はコミット対象にしない。
