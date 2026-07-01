あなたはCodexです。`experiments/aidd-control-plane-mvp-013/generated-repo` を、AIDD Control Plane MVP 013として完成させてください。

前提:
- 既存のMVP 012実装をコピー済みです。
- UI/テスト/docsは日本語にしてください。
- AIDD-Spec v0.1と `standards/aidd-control-plane-mvp-v0.1.md` に接続してください。
- 実GitHub APIには接続しません。ローカルmock serviceだけで決定的に検証します。

必須実装:
1. package名、hero、docs、doctor、capture scriptをMVP 013へ更新する。
2. `mocks/ci-service` に独立したNode mock serviceを作る。
   - `/health` は `{ ok: true, service: "mock-ci-service" }` を返す。
   - `/state` は現在のCI証跡状態を返す。
   - `/__control/state` はPOSTで `empty | valid | failure | timeout | rate_limit` へ切り替える。
   - 状態はUIコードから分離されたmock backend contractとして扱う。
3. `pnpm run mock:start`, `pnpm run mock:stop`, `pnpm run mock:doctor` を追加する。
   - mock:startはport fileまたはpid fileを使って起動状態を管理する。
   - mock:doctorはhealth/state/controlを実際に叩いて検査する。
4. UIのMock CI Evidence Connectorを、mock service由来の状態を表示するUIへ更新する。
   - 初期表示でサービス未接続/emptyを分かるようにする。
   - `empty`, `valid`, `failure`, `timeout`, `rate_limit` ボタンを用意する。
   - failure/timeout/rate_limitは、Evidence Gap Repair PlannerやAI Task Packet Deltaへ戻す修正指示を表示する。
   - fetchを使う場合はdoctor:aiddの禁止ルールを調整し、外部URL禁止は維持する。接続先は相対API routeかlocalhost mockだけにする。
5. Next.js側に必要ならAPI proxy routeを追加し、ブラウザUIがmock serviceを読めるようにする。
6. Unit testでmock serviceの状態評価とrepair deltaを検証する。
7. Playwright E2Eで `/__control/state` を使い、valid/failure/timeout/rate_limitの画面反映をChromium/Firefox/WebKitで確認する。
8. `doctor:aidd` をMVP 013仕様へ更新し、mock service、mock scripts、E2Eのcontrol endpoint利用、スクリーンショット状態を検査する。
9. capture scriptを `capture:mvp013` に更新し、empty/valid/failure/timeout/rate_limit/terminal evidence画像を保存する。

完了条件:
- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run mock:doctor`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
が通る状態にしてください。

注意:
- runtime生成物（node_modules, .next, coverage, playwright-report, test-results, tsbuildinfo）はコミット対象にしません。
- テスト名も日本語を優先してください。
- Dockerは非必須です。今回はNode fallback mockを優先してください。
