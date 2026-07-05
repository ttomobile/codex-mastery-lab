# AI Task Packet: AIDD Control Plane MVP 044

## 1. Product Brief

### 機能名
One-Run Execution Readiness Gate

### ユーザーの悩み
Review Finding Action Queueで「今やること」を絞っても、Codex実行直前に必要な確認（sandbox、検証コマンド、証跡保存先、rollback、Firefox含む3ブラウザ、ローカル情報混入）が抜けると、実行後に証拠が不足する。

### ゴール
`execute_now` itemを1回のCodex実行へ渡す前に、実行準備が整っているかをready / blockedで判定し、blockedなら不足理由と修正指示を出す。

### 非ゴール
- 実際にCodexを起動すること
- GitHub APIや外部サービスへ接続すること
- 本番認証・決済・秘密情報の保存

## 2. 主要フロー

1. empty: まだReadiness Gateが作られていない。必要入力を表示する。
2. valid: execute_now item、Codex command、sandbox、検証コマンド、証跡パス、rollback停止条件、3ブラウザE2E、AIDD-Spec接続がそろい、readyとして表示する。
3. failure: source不足、execute_now以外の混入、危険command、sandbox不足、検証不足、Firefox除外、terminal/failure screenshot不足、rollback不足、local path / host / private network URL混入、AIDD-Spec接続不足をblockedとして表示する。

## 3. UI要件

- UI文言は日本語。
- empty / ready / blockedを切り替えられる。
- readyでは「実行してよい理由」「Codex command preview」「検証コマンド」「必要証跡」「rollback停止条件」を見える化する。
- blockedでは検出したissueと修正指示を日本語で表示する。

## 4. データ契約

`src/lib/intake.ts` へ次を追加する。

- `OneRunExecutionReadinessGate`
- `OneRunExecutionReadinessReview`
- `createEmptyOneRunExecutionReadinessGate()`
- `createValidOneRunExecutionReadinessGate()`
- `createFailureOneRunExecutionReadinessGate()`
- `evaluateOneRunExecutionReadinessGate()`

必須フィールド:

- sourceQueueId
- executeNowActionId
- codexCommand
- sandboxMode
- requiredVerificationCommands
- requiredEvidence
- browserProjects
- rollbackStopCondition
- aiddSpecConnections
- readyReason
- issues

## 5. テスト要件

- Vitestでready判定とblocked判定をテストする。
- Playwrightでempty / ready / blocked画面、Codex command preview、Firefoxを含む3ブラウザ表示、local path混入検出を確認する。
- テスト名は日本語を含める。

## 6. 品質ゲート

個別に実行し、terminal logを保存する。

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 7. 証跡要件

- empty / ready / blocked / terminal evidenceのPNGを生成する。
- `assets/aidd-control-plane-mvp044-*.png` と `experiments/aidd-control-plane-mvp-044/artifacts/screenshots/` に保存する。
- local path、host名、private network URLを記事・preview・terminal evidenceへ混ぜない。
