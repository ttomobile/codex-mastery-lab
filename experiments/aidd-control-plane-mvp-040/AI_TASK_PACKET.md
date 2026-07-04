# AI Task Packet: AIDD Control Plane MVP 040

## 1. Product Brief

AIDD Control Planeに「Codex Run Start Receipt Auditor」を追加する。MVP 039で作ったOne-Run Handoff Packを、実際にCodexへ渡した直後の実行開始レシートとして記録し、後続のVerification Evidenceへつなぐ。

## 2. 背景

AIへ渡す直前の手渡しパックが整っていても、実行開始時点の記録が曖昧だと次の問題が残る。

- どのhandoff packを実行したのか分からない
- Codex commandやsandbox modeが後から追えない
- 証跡保存先が不明で、terminal logやスクリーンショットが散らばる
- 必須検証コマンドと3ブラウザE2Eが実行結果へ継承されない
- rollback停止条件が実行レシートに残らない
- local path、host名、private network、private URLが公開記事へ混ざる

このMVPでは、宅配の受領票のように、AI実行の開始条件を1枚のレシートとして固定する。

## 3. 実装範囲

- `src/lib/intake.ts`
  - `CodexRunStartReceiptAuditor` 系の型、empty/valid/failure factory、evaluatorを追加
  - valid sampleはMVP 039のhandoff packをsourceにし、Codex command、sandbox mode、started at、operator、evidence root、required verification commands、browser projects、required screenshots、rollback stop condition、AIDD-Spec connectionsを含める
  - failure sampleはhandoff不足、危険command、sandbox不足、evidence root不足、Firefox除外、terminal/failure screenshot不足、rollback不足、AIDD-Spec接続不足、local path/host/private network URL混入を含める
- `app/page.tsx`
  - 「Codex Run Start Receipt Auditor」セクションを追加
  - `receipt empty` / `receipt valid` / `receipt failure` の操作ボタンを追加
  - 実行開始レシート、検証継承、証跡保存先、rollback、findingsを日本語で表示
- `tests/intake.test.ts`
  - 日本語名のunit testを追加
- Playwright E2E
  - empty / valid / failure状態をChromium / Firefox / WebKitで確認
- `scripts/doctor-aidd.mjs`
  - MVP 040固有の実装・テスト・E2E・日本語UI文言を検査
- capture script
  - empty / valid / failure / terminal evidence画像を生成

## 4. 非ゴール

- 実際にCodexを起動しない
- 外部CI APIへ接続しない
- DB永続化や認証は追加しない

## 5. 受け入れ条件

- handoff pack idからCodex実行開始レシートが作られることがUIとテストで分かる
- valid状態でCodex command、sandbox mode、evidence root、検証コマンド、3ブラウザ、必要スクリーンショット、rollback停止条件、AIDD-Spec接続が見える
- failure状態で危険command、Firefox除外、証跡不足、rollback不足、local path/host/private network URL混入を検出する
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
pnpm run capture:mvp040
```
