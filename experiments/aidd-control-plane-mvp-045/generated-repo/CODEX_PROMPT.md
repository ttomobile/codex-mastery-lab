目的: experiments/aidd-control-plane-mvp-045/generated-repo に、AIDD Control Plane MVP 045「Verification Evidence Receipt Binder」を実装してください。

前提:
- experiments/aidd-control-plane-mvp-044/generated-repo をコピー済みです。この土台をMVP 045へ更新してください。
- UI文言・テスト名・サンプルデータは日本語を基本にする。
- 重い依存追加は禁止。既存のNext.js/TypeScript/Vitest/Playwright構成を使う。
- 既存の未コミット変更（character-collection-rpg画像、scripts/codex_usage_kpi.pyなど）は触らない。
- このMVPで触ってよい主な範囲は experiments/aidd-control-plane-mvp-045/ 配下です。

実装したい機能:
MVP 044のOne-Run Execution Readiness Gateの次段として、Codex Run Start Receiptに紐づく個別検証コマンド結果を1つのVerification Evidence Receiptへ束ね、Review Record / Learning Logへ渡す前にreview-ready / blockedを判定する。

必須状態:
1. empty
   - まだReceipt Binderがないことを表示
   - 必要入力として source run start receipt / command results / exit code / duration / terminal log / artifact path / failure category / repair instruction / browser projects / screenshots / doctor:aidd / AIDD-Spec connection を表示
2. valid
   - sourceRunStartReceiptId
   - commandResults: lint / typecheck / test / build / test:e2e / doctor:aidd
   - 各commandに exitCode, durationMs, terminalLogPath, artifactPath, failureCategory, repairInstruction を持たせる
   - browserProjects: Chromium / Firefox / WebKit
   - requiredScreenshots: empty / valid / failure / terminal evidence
   - doctorAiddResult: pass
   - reviewReadyReason
   - AIDD-Spec connection
   を表示し、review-readyとして扱う
3. failure
   - source不足
   - command別detail不足
   - exit code不足
   - artifact不足
   - 失敗分類不足
   - 修正指示不足
   - Firefox除外
   - terminal / failure screenshot不足
   - doctor:aidd不足
   - local path / host / private network URL混入
   を検出して日本語でblocked表示する

実装詳細:
- `src/lib/intake.ts` に型、factory、evaluatorを追加してください。
- `app/page.tsx` にMVP 045のUIを追加または置き換えてください。
- `tests/intake.test.ts` に日本語テスト名でunit testを追加してください。
- `e2e/intake-wizard.spec.ts` に日本語テスト名でE2Eを追加してください。
- `scripts/doctor-aidd.mjs` にMVP 045の必須文言・証跡・Firefox・doctor:aidd・local path検出を含めてください。
- `scripts/capture-mvp045.mjs` を追加し、empty / valid / failure / terminal evidence のPNGを `../artifacts/screenshots/` に保存してください。
- `package.json` に `capture:mvp045` を追加し、nameを `aidd-control-plane-mvp-045` にしてください。

受け入れ条件:
- pnpm install --frozen-lockfile, lint, typecheck, test, build, test:e2e, doctor:aidd が通る。
- empty / valid / failure / terminal evidence screenshotを生成できる。
- Firefox除外、doctor:aidd不足、local path混入、修正指示不足をfailureで検出できる。
- README/AI_TASK_PACKET/CODEX_PROMPTの意図と実装が一致する。
