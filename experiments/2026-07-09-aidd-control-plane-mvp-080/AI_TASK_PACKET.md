# AI Task Packet: AIDD Control Plane MVP 080 Run Queue Dispatch Receipt

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log
- Repair Action Queue
- Codex prompt delta

## Product Brief

MVP079でキュー投入前に確認したRepair Actionを、実行直前/実行後のReceiptへ変換する画面を作る。ユーザーは「AIへ渡した1件が何で、どのゲートを通り、どのコマンドで検証され、どの証跡が残り、失敗時にどのRepair Actionへ戻るか」を1画面で確認できる。

## ユーザー

- Repair ActionをCodexへ渡す直前に、payload混入や証跡不足を止めたい開発者。
- 実行後に、成功/失敗/停止の理由をVerification Evidenceとして残したいレビュー担当者。

## 非ゴール

- 実Codex API、GitHub Actions API、外部previewへの接続はしない。
- 本番DB保存、認証、課金はしない。
- 実サービスの商標、ロゴ、実データは使わない。

## 主要状態

- empty: dispatch対象のqueue itemが未選択。
- ready: execute_nowだけのpayload、検証ゲート、証跡ゲート、rollback、sanitizeが揃い、実行直前Receiptを確認できる。
- running: 実行中としてcommand、progress、pending evidence、timeout budgetを表示する。
- failure: 実行後に失敗し、Review Findingと次のRepair Action候補へ戻す。
- blocked: local path、private URL、next_increment混入、learning_log混入、Firefox除外、terminal evidence不足、破壊的cleanup要求で停止する。

## 受け入れ条件

1. 画面タイトルは `Run Queue Dispatch Receipt`。
2. 日本語UIで、queue item、execute_now payload、dispatch command、verification gates、evidence checklist、rollback condition、sanitize scan、AIDD-Spec connection、Review Findingを表示する。
3. readyでは「Dispatch Receiptを発行できます」と表示する。
4. runningでは「実行中の証跡を収集中」と表示し、未完了証跡を明示する。
5. failureではReview Finding YAML風カードと次のRepair Action候補を表示する。
6. blockedでは「Dispatch停止」と理由を表示する。
7. payload previewにはexecute_nowだけを入れ、next_increment / learning_logの内容を混入させない。
8. `pnpm run doctor:aidd` が状態名、AIDD-Spec接続、3ブラウザ、terminal/failure screenshot、local path禁止、execute_now限定payload、rollback、sanitize gateを検査する。
9. Playwright E2EはChromium / Firefox / WebKitで通す。
10. UI copy、テスト名、docsは日本語を基本にする。

## 検証コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```
