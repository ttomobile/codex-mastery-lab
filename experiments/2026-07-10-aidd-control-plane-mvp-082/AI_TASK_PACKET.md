# AI Task Packet: MVP082 Smoke Receipt Repair Action Planner

## 背景

MVP081では、複数のDispatch Receiptを比較し、再発findingや効いたRepair Actionを見える化した。次は、公開preview smokeの失敗を「次の1回で直す行動」に変換する必要がある。

## 目的

Preview Smoke Receipt Binderで見つかった failure / blocked を、Review Finding Actionとして整理し、execute_now / next_increment / learning_logを混ぜずに扱うUIと検証を作る。

## Scope

- Next.js + TypeScript + pnpm
- 日本語UI
- query param `state` による4状態切替: `empty`, `planned`, `failure`, `blocked`
- mock dataのみ。外部API、実GitHub、実note、実YouTube、実private URLは使わない。

## 受け入れ条件

1. `empty` はSmoke Receipt未選択状態を説明し、必要入力を示す。
2. `planned` は壊れたpreview assetを修正するexecute_now actionを表示する。
3. `failure` はHTTP 404 / 0 byte / content type mismatchなどをReview Findingへ変換する。
4. `blocked` は公開前に止めるべき条件を表示する。
5. broken URL、finding category、severity、lane、priority reasonを表示する。
6. AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connectionを表示する。
7. Codex prompt previewにはexecute_nowだけを入れる。next_incrementとlearning_logは別欄にする。
8. blockedでは private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、AIDD-Spec接続不足、execute_now以外混入を検出する。
9. Unit testと3ブラウザE2Eで状態・prompt分離・blocked条件を確認する。
10. `doctor:aidd` がMVP082固有の必須語句と危険語混入を検査する。

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

## 必須証跡

- terminal: install / lint / typecheck / test / build / test:e2e / doctor:aidd / capture
- screenshots: empty / planned / failure / blocked / terminal evidence
- article: `articles/2026-07-10-aidd-control-plane-mvp-082.md`
