# Codex Prompt: AIDD Control Plane MVP 066

あなたはAIDD Control PlaneのNext.js + TypeScript実装担当です。

`experiments/2026-07-08-aidd-control-plane-mvp-066/generated-repo/` を更新し、MVP066 **Public Preview Smoke Verifier** を実装してください。

必須条件:

1. UIは日本語。AIDD-Spec v0.1 / AIDD Control Plane MVP v0.1 / Verification Evidence / Release Checklistとの接続を画面に表示する。
2. MVP065のPublication Evidence QA Gateの後段として、公開preview HTMLとassetsがHTTP経路で読めるかを判定するUIに変更する。
3. empty / valid / failure / blocked の4状態をfixtureで切り替えられるようにする。
4. 必須表示項目: smoke run id、article path、preview URL/path、checked URLs、HTTP status、byte size、content type、latency ms、terminal evidence image response、Chromium / Firefox / WebKit、console status、sanitization scan、Review Finding、Learning Log、AI Task Packet delta、Codex prompt delta、rerun command。
5. domain関数を用意し、日本語名のunit testで ready / failure / blocked / empty 判定を検証する。
6. Playwright E2EはChromium / Firefox / WebKit対象。日本語名のテストで4状態、失敗asset、再実行コマンド、3ブラウザ表示を確認する。
7. `pnpm run doctor:aidd` が、MVP066に必要なscript、4状態fixture、E2E、capture script、AIDD-Spec接続文言、ローカルパス/host/private network URL混入がないことを検査する。
8. `pnpm run capture:mvp066` を追加し、`artifacts/screenshots/aidd-control-plane-mvp066-empty.png`、`...-valid.png`、`...-failure.png`、`...-blocked.png`、`...-terminal-evidence.png` を保存する。
9. package名やREADME等のMVP番号を065から066へ更新する。
10. runtime生成物（node_modules, .next, coverage, playwright-report, test-results）は作ってもコミット対象にしない。

完了前に可能なら次を実行してください: `pnpm install --frozen-lockfile`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd`, `pnpm run capture:mvp066`。
