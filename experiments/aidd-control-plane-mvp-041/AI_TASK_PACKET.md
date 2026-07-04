# AI Task Packet: AIDD Control Plane MVP 041

## 1. Product Brief

AIDD Control Planeに「Verification Evidence Receipt / Command Result Binder」を追加する。MVP 040のCodex Run Start Receiptをsourceとして、個別検証コマンド結果を1つの証跡レシートへ束ね、Review Record / Learning Logへ渡せる状態にする。

## 2. 背景

実行開始レシートがあっても、検証結果が「全部通ったらしい」という文章だけでは再現性がない。

- lint/typecheck/test/build/e2e/doctor:aiddを個別に追えない
- exit code、duration、ログpath、artifact pathが揃わない
- 失敗時の分類と修正指示がReview Findingに戻らない
- Firefoxやfailure screenshotが抜けても見逃す
- ローカルpath、host名、private network URLが公開証跡へ混ざる

このMVPでは、家計簿のレシート明細のように、各検証コマンドの結果を1行ずつ残す。

## 3. 実装範囲

- `src/lib/intake.ts`
  - `VerificationEvidenceReceiptBinder` 系の型、empty/valid/failure factory、evaluatorを追加
  - valid sampleはMVP 040のrun start receiptをsourceにし、required commandごとのexit code、duration、terminal log、artifact、failure category、repair instruction、browser coverage、screenshot evidence、AIDD-Spec connectionsを含める
  - failure sampleはsource receipt不足、command別detail不足、exit code不足、artifact path不足、失敗分類不足、修正指示不足、Firefox除外、terminal/failure screenshot不足、doctor:aidd不足、local path/host/private network URL混入を含める
- `app/page.tsx`
  - 「Verification Evidence Receipt Binder」セクションを追加
  - `binder empty` / `binder valid` / `binder failure` の操作ボタンを追加
  - コマンド明細、証跡、失敗分類、修正指示、findingsを日本語で表示
- `tests/intake.test.ts`
  - 日本語名のunit testを追加
- Playwright E2E
  - empty / valid / failure状態をChromium / Firefox / WebKitで確認
- `scripts/doctor-aidd.mjs`
  - MVP 041固有の実装・テスト・E2E・日本語UI文言を検査
- capture script
  - empty / valid / failure / terminal evidence画像を生成

## 4. 非ゴール

- 実際のCI API接続はしない
- 実際のterminal log内容を解析しない
- 外部ストレージアップロードや認証は追加しない

## 5. 受け入れ条件

- source run start receiptからVerification Evidence Receiptが作られることがUIとテストで分かる
- valid状態で各検証コマンドのexit code、duration、ログpath、artifact、3ブラウザ、必要スクリーンショット、doctor:aidd、AIDD-Spec接続が見える
- failure状態で不足detail、exit code不足、artifact不足、失敗分類不足、修正指示不足、Firefox除外、terminal/failure screenshot不足、local path/host/private network URL混入を検出する
- 表示文言、テスト名、記事は日本語を基本にする
- AIDD-Spec v0.1とControl Plane MVP標準への接続がUIとdoctorで確認できる

## 6. 検証コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp041
```
