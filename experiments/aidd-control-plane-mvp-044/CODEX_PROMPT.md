目的: experiments/aidd-control-plane-mvp-044/generated-repo に、AIDD Control Plane MVP 044「One-Run Execution Readiness Gate」を実装してください。

前提:
- experiments/aidd-control-plane-mvp-043/generated-repo をコピーして土台にしてよい。
- UI文言・テスト名・サンプルデータは日本語を基本にする。
- 重い依存追加は禁止。既存のNext.js/TypeScript/Vitest/Playwright構成を使う。
- 既存の未コミット変更（character-collection-rpg画像、scripts/codex_usage_kpi.pyなど）は触らない。
- このMVPで触ってよい主な範囲は experiments/aidd-control-plane-mvp-044/ 配下です。

実装したい機能:
MVP 043のReview Finding Action Queueで execute_now に絞ったaction itemを、実際のCodex実行へ渡す直前にready / blockedで判定する One-Run Execution Readiness Gate を作る。

必須状態:
1. empty
   - まだReadiness Gateがないことを表示
   - 必要入力として source queue id / execute_now action / Codex command / sandbox / verification commands / evidence paths / rollback stop condition / browser projects / AIDD-Spec connection を表示
2. valid
   - sourceQueueId
   - executeNowActionId
   - codexCommand
   - sandboxMode: danger-full-access または workspace-write など
   - requiredVerificationCommands: lint / typecheck / test / build / test:e2e / doctor:aidd
   - browserProjects: Chromium / Firefox / WebKit
   - requiredEvidence: terminal / empty screenshot / valid screenshot / failure screenshot / Playwright report
   - rollbackStopCondition
   - readyReason
   - AIDD-Spec connection
   を表示し、readyとして扱う
3. failure
   - source queue不足
   - execute_now以外の混入
   - Codex command不足または危険command
   - sandbox不足
   - verification command不足
   - Firefox除外
   - terminal / failure screenshot不足
   - rollback不足
   - local path / host / private network URL混入
   - AIDD-Spec接続不足
   を検出して日本語でblocked表示する

実装詳細:
- `src/lib/intake.ts` に型、factory、evaluatorを追加してください。
- `app/page.tsx` にMVP 044のUIを追加または置き換えてください。
- `tests/intake.test.ts` に日本語テスト名でunit testを追加してください。
- `e2e/intake-wizard.spec.ts` に日本語テスト名でE2Eを追加してください。
- `scripts/doctor-aidd.mjs` にMVP 044の必須文言・証跡・Firefox・rollback・local path検出を含めてください。
- `scripts/capture-mvp044.mjs` を追加し、empty / valid / failure / terminal evidence のPNGを `../artifacts/screenshots/` に保存してください。
- `package.json` に `capture:mvp044` を追加してください。

受け入れ条件:
- pnpm install --frozen-lockfile, lint, typecheck, test, build, test:e2e, doctor:aidd が通る。
- empty / valid / failure / terminal evidence screenshotを生成できる。
- execute_now以外の混入、Firefox除外、local path混入、rollback不足をfailureで検出できる。
- README/AI_TASK_PACKET/CODEX_PROMPTの意図と実装が一致する。
