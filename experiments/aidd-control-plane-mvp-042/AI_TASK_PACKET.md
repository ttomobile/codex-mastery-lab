# AI Task Packet: AIDD Control Plane MVP 042

## 1. Product Brief

AIDD Control Planeに「Review Record Receipt Synthesizer」を追加する。MVP 041のVerification Evidence Receipt Binderをsourceとして、個別検証結果をReview Record、Learning Log、次回AI Task Packet deltaへ変換する。

## 2. 背景

検証証跡を1行ずつ束ねても、最後に人間が「たぶん次はここを直す」と作文するだけでは、AIDD-Specの再現性が弱い。

- exit codeとfailure categoryからreview findingへ変換できない
- score根拠が曖昧になる
- needed upstream informationが残らない
- AI Task Packet deltaとCodex prompt deltaが検証結果に紐づかない
- failure screenshot、terminal evidence、3ブラウザE2Eの不足がLearning Logへ戻らない
- local path、host名、private network URL混入が公開前riskとして残らない

このMVPでは、健康診断の結果表のように、検査値から「要再検査」「生活改善」「次の予約」を同じ紙にまとめる。

## 3. 実装範囲

- `src/lib/intake.ts`
  - `ReviewRecordReceiptSynthesizer` 系の型、empty/valid/failure factory、evaluatorを追加
  - valid sampleはMVP 041のvalid binderをsourceにし、review score、review findings、learning log notes、next AI Task Packet delta、Codex prompt delta、verification command、evidence references、AIDD-Spec connectionsを含める
  - failure sampleはsource binder不足、score根拠不足、finding分類不足、needed upstream info不足、AI Task Packet delta不足、Codex prompt delta不足、verification command不足、Learning Log接続不足、Firefox除外、terminal/failure screenshot不足、local path/host/private network URL混入を含める
- `app/page.tsx`
  - 「Review Record Receipt Synthesizer」セクションを追加
  - `review empty` / `review valid` / `review failure` の操作ボタンを追加
  - score、findings、needed upstream information、standard update、prompt delta、next verification、learning logを日本語で表示
- `tests/intake.test.ts`
  - 日本語名のunit testを追加
- Playwright E2E
  - empty / valid / failure状態をChromium / Firefox / WebKitで確認
- `scripts/doctor-aidd.mjs`
  - MVP 042固有の実装・テスト・E2E・日本語UI文言を検査
- capture script
  - `pnpm run capture:mvp042` で empty / valid / failure / terminal evidence画像を生成

## 4. 非ゴール

- 外部LLMによる自動レビュー生成はしない
- 実際のGitHub Issue/PRコメント投稿はしない
- 実際のCI API接続はしない

## 5. 受け入れ条件

- Verification Evidence Receipt BinderからReview Record Receiptが作られることがUIとテストで分かる
- valid状態でscore、finding、needed upstream information、AI Task Packet delta、Codex prompt delta、verification command、Learning Log、3ブラウザ、terminal/failure screenshot、AIDD-Spec接続が見える
- failure状態でsource不足、score根拠不足、finding分類不足、needed upstream info不足、delta不足、prompt不足、検証コマンド不足、Learning Log接続不足、Firefox除外、terminal/failure screenshot不足、local path/host/private network URL混入を検出する
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
pnpm run capture:mvp042
```
