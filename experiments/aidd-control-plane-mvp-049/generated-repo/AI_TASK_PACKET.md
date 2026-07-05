# AI Task Packet: AIDD Control Plane MVP 049

## 1. Product Brief

### 機能名

Verification Run Detail Drilldown

### ユーザーの悩み

Codex Run Queueの1件について、どのcommandが成功し、どの証跡があり、何を直すべきかが1画面で追えない。

### ゴール

`lint`、`typecheck`、`test`、`build`、`test:e2e`、`doctor:aidd`をcommand別Verification Run Detailとして表示する。failureでは不足項目をReview Finding draftとして日本語で列挙する。

### 非ゴール

- 実際のCodex実行。
- 外部API接続。
- DB永続化。

## 2. 主要フロー

1. empty: detail未作成を表示する。
2. ready: source queue item、source run status、commit SHA、6つのcommand別detail、3ブラウザ、証跡、AIDD接続を表示する。
3. failure: 不足項目とReview Finding draftを表示する。

## 3. UI要件

- UI文言とテスト名は日本語。
- 画面に「MVP 049: Verification Run Detail Drilldown」を表示する。
- empty / ready / failureを切り替えられる。
- readyではfailure categoryを「なし」、repair instructionを「追加修正なし」と表示する。
- AIDD-Spec v0.1、Verification Evidence、Review Record、Learning Logへの接続を表示する。

## 4. データ契約

`src/lib/verification-run.ts`にVerificationRunPacket、CommandDetail、evaluator、empty / ready / failure factoryを置く。

## 5. 品質ゲート

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp049`
