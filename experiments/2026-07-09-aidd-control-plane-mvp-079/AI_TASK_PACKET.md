# AI Task Packet: AIDD Control Plane MVP 079 Repair Action Run Queue Intake

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log
- Release Checklist

## Product Brief

MVP078のSmoke Receipt Repair Action Plannerでreadyになった1件のRepair Actionを、実Codex実行キューへ入れる前に最終確認する入口を作る。SaaS利用者が「この修正だけを次の1回で実行してよいか」を、payload、検証、証跡、rollback、sanitizeの観点で確認できるようにする。

## ユーザー

- 失敗Receiptから作った修正ActionをCodexへ渡す前に、範囲漏れや混入を止めたい開発者。
- 3ブラウザ、terminal evidence、failure screenshot、rollback条件を必須にしたいレビュー担当者。
- note記事に残せる一次情報として、実行前チェックのスクリーンショットを保存したい人。

## 非ゴール

- 実Codex CLIの起動、外部API連携、DB保存、認証はしない。
- 複数Actionの同時queue処理はしない。
- 実サービスの商標、ロゴ、実データは使わない。

## 主要状態

- `empty`: queueに入れるRepair Actionが未選択。
- `ready`: execute_nowだけを含むqueue payload、検証コマンド、required evidence、rollback条件が揃っている。
- `failure`: payloadはあるが、検証・証跡・rollback・AIDD-Spec接続のいずれかが不足。
- `blocked`: private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、next_increment/learning_logのpayload混入、破壊的cleanup要求があり実行前停止。

## 受け入れ条件

1. 画面タイトルは `Repair Action Run Queue Intake`。
2. 日本語UIで、source repair action、queue payload、execute_now summary、excluded next_increment、excluded learning_log、verification gate、evidence gate、rollback gate、sanitize gate、AIDD-Spec connectionを表示する。
3. `ready`では「実行キュー投入前チェックを通過しました」と表示し、payloadにexecute_nowだけが含まれる。
4. `failure`では不足ゲートとReview Finding YAML風カードを表示する。
5. `blocked`では「実行前停止」と理由を表示し、破壊的cleanup要求を明示する。
6. Codex prompt preview / queue payloadにnext_incrementやlearning_logが混入しないことをunit testとdoctorで検査する。
7. `pnpm run doctor:aidd` が状態名、AIDD-Spec接続、3ブラウザ、terminal/failure screenshot、local path禁止、payload限定、破壊的cleanup禁止を検査する。
8. Playwright E2EはChromium / Firefox / WebKitで通す。
9. UI copy、テスト名、docsは日本語を基本にする。
10. `pnpm run capture:mvp079` で empty / ready / failure / blocked / terminal evidence 画像を生成する。

## 検証コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp079
```
