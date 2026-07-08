# AIDD Control Plane MVP 070: Shrunk Packet Handoff Receipt

MVP069のCodex Run Budget Shrink Plannerで、大きすぎるAI依頼を`keep_now`と`defer_next_increment`へ分けられるようになった。MVP070では、その縮小後AI Task PacketをCodexへ渡す直前の「手渡しレシート」として確認する。

## 目的

- `source_shrink_plan`、`execute_now`、`defer_next_increment`を1つのハンドオフレシートへ束ねる。
- `minimum_verification`、Chromium / Firefox / WebKit、terminal / initial / filled / failure / report evidenceを必須化する。
- rollback conditionとAIDD-Spec接続を、実行直前に見落とさない。
- local path / private host / private network URLを含む公開用promptをblockedにする。
- AIDD-Spec v0.1のAI Task Packet / Verification Evidence / Review Record / Learning Logと、`standards/aidd-control-plane-mvp-v0.1.md`のShrunk Packet Handoff Receiptへ接続する。

## 実装範囲

`generated-repo/` にNext.js + TypeScriptアプリを作る。UI、テスト名、サンプルデータ、記事は日本語を基本にする。

## 状態

- empty: shrink planが未選択で、まだ渡せない。
- valid: execute_now、検証、証跡、rollback、AIDD-Spec接続、サニタイズが揃い、Codexへ渡せる。
- blocked: 3ブラウザ不足、evidence不足、rollback不足、local path / private host / private network URL混入などで止める。

## 検証

個別ログを`artifacts/terminal/*.txt`に保存する。

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp070
