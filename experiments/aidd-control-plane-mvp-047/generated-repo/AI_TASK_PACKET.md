# AI Task Packet: AIDD Control Plane MVP 047

## 1. Product Brief

### 機能名
Review Finding Action Queue

### ユーザーの悩み
Run Result ReviewからReview Findingが出ても、今すぐ実装するもの、次回incrementに送るもの、Learning Logへ残すものが混ざると、Codex promptが広がりすぎて検証対象が曖昧になる。

### ゴール
Review FindingをAction Queueへ変換し、`execute_now`だけを次のCodex prompt previewへ入れる。`next_increment`と`learning_log`は画面で見えるが、今回のprompt previewから除外する。

### 非ゴール
- 実GitHub review APIへの接続
- 複数incrementを同時に実装すること
- private path、host名、private network URLを証跡へ残すこと

## 2. 主要フロー

1. empty: まだReview Finding Action Queueがない。source review receipt / finding list / priority rule / verification command / evidence requirementが必要なことを表示する。
2. valid: Review Findingを`execute_now` / `next_increment` / `learning_log`へ分け、source review id、queue id、action item詳細、Codex prompt previewを表示する。
3. failure: source不足、priority reason不足、lane不足、verification command不足、rollback不足、required evidence不足、Firefox除外、terminal evidence不足、failure screenshot不足、execute_now以外のprompt混入、local path / host / private network URL混入、AIDD-Spec接続不足をblockedとして表示する。

## 3. UI要件

- UI文言は日本語。
- 画面に「AIDD Control Plane MVP 047」と「Review Finding Action Queue」を表示する。
- empty / valid / failureを切り替えられる。
- validではsource review id、queue id、action item、finding category、severity、lane、priority reason、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connection、Codex prompt previewを表示する。
- Codex prompt previewには`execute_now` laneのactionだけを含める。

## 4. データ契約

`src/lib/intake.ts` のReview Finding Action QueueをMVP047として拡張する。

- `ReviewFindingActionQueue.sourceReviewId`
- `ReviewFindingActionQueue.queueId`
- `ReviewFindingActionQueue.actionItems`
- `createEmptyReviewFindingActionQueue()`
- `createValidReviewFindingActionQueue()`
- `createFailureReviewFindingActionQueue()`
- `evaluateReviewFindingActionQueue()`

必須検出:

- source不足
- priority reason不足
- lane不足
- verification command不足
- rollback不足
- required evidence不足
- Firefox除外
- terminal evidence不足
- failure screenshot不足
- execute_now以外のprompt混入
- local path / host / private network URL混入
- AIDD-Spec接続不足

## 5. テスト要件

- Vitestでempty / valid / failureとprompt preview混入防止を確認する。
- PlaywrightでMVP047の見出し、Action Queue details、failure blocked表示を確認する。
- `doctor:aidd` にMVP047 UI / unit / E2E / capture / docs tokenを追加する。

## 6. 品質ゲート

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 7. 証跡要件

- `scripts/capture-mvp047.mjs` と `capture:mvp047` を追加する。
- empty / valid / failure / terminal evidenceのPNGを生成する。
- `assets/aidd-control-plane-mvp047-*.png` と `experiments/aidd-control-plane-mvp-047/artifacts/screenshots/` に保存する。
- local path、host名、private network URLを公開物へ混ぜない。
