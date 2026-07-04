# AI Task Packet: AIDD Control Plane MVP 039

## 1. Product Brief

AIDD Control Planeに「One-Run Handoff Pack Reviewer」を追加する。MVP 038で `execute_now` に絞ったrepair deltaを、次の1回のCodex実行へ渡す直前の手渡しパックとして、AI Task Packet追記、Codex prompt、検証コマンド、必要証跡、rollback、記事化観点まで確認する。

## 2. 背景

Execution Priority Setで今回やることを絞っても、そのままCodexへ渡すと次の問題が残る。

- AI Task Packet追記とCodex promptの関係が曖昧
- 検証コマンドが一部だけになる
- terminal / screenshot / Playwright reportなどの必要証跡が抜ける
- rollback条件や失敗時の停止条件が曖昧
- note記事に残す一次情報の観点が後付けになる
- ローカルパス、host名、tailnet、private network URLが混ざる

このMVPでは、料理の「今日作る1品の材料・手順・味見リスト」のように、次の1回に必要なものだけを手渡しパック化する。

## 3. 実装範囲

- `src/lib/intake.ts`
  - `OneRunHandoffPackReviewer` 系の型、empty/valid/failure factory、evaluatorを追加
  - valid sampleはMVP 038の `execute_now` itemを入力として、AI Task Packet patch、Codex prompt、verification commands、required evidence、rollback condition、note article angleを含める
  - failure sampleはsource不足、packet patch不足、Codex prompt不足、検証コマンド不足、3ブラウザ不足、terminal/screenshot evidence不足、rollback不足、AIDD-Spec接続不足、ローカルパス/host/tailnet/private URL混入を含める
- `app/page.tsx`
  - 「One-Run Handoff Pack Reviewer」セクションを追加
  - `handoff empty` / `handoff valid` / `handoff failure` の操作ボタンを追加
  - 手渡しパック、検証計画、証跡リスト、rollback、note記事観点、findingsを日本語で表示
- `tests/intake.test.ts`
  - 日本語名のunit testを追加
- Playwright E2E
  - empty / valid / failure状態をChromium / Firefox / WebKitで確認
- `scripts/doctor-aidd.mjs`
  - MVP 039固有の実装・テスト・E2E・日本語UI文言を検査
- capture script
  - empty / valid / failure / terminal evidence画像を生成

## 4. 非ゴール

- 実際にCodexを起動しない
- GitHub Issue / PRへ自動投稿しない
- 実ファイルへpatchを自動適用しない
- SaaSの認証やDB永続化は追加しない

## 5. 受け入れ条件

- `execute_now` のdeltaだけから手渡しパックが作られることがUIとテストで分かる
- AI Task Packet patch、Codex prompt、検証コマンド、必要証跡、rollback、note記事観点がvalid状態で見える
- failure状態で不足項目、浅い検証、Firefox除外、local path/host/tailnet/private network URL混入を検出する
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
```
