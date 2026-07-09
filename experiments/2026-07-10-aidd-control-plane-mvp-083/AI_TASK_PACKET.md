# AI Task Packet: MVP083 Smoke Repair Priority Gate

## 背景

MVP082では、Preview Smoke Receiptで見つかった failure / blocked を、次の1回で実行できるRepair Actionへ変換した。次の課題は、Repair Action候補が複数ある時に、AIへ全部投げず、今回の実行予算に収まる1件へ絞ること。

## 目的

Smoke Receipt Repair Action Plannerの出力を受け取り、複数候補から `execute_now` 1件、`next_increment` 候補、`learning_log` 戻しを分離する優先順位ゲートを作る。AIDD Control Planeを「何を作るか」だけでなく「何を今回やらないか」まで決められるSaaSに近づける。

## Scope

- Next.js + TypeScript + pnpm
- 日本語UI
- query param `state` による4状態切替: `empty`, `prioritized`, `conflict`, `blocked`
- mock dataのみ。外部API、実GitHub、実note、実YouTube、実private URLは使わない。

## 受け入れ条件

1. `empty` はRepair Action候補が未選択の状態を説明し、優先順位判断に必要な入力を示す。
2. `prioritized` は複数候補から今回実行する1件を選び、選定理由、実行予算、期待証跡を表示する。
3. `conflict` は高severity候補が複数ある、証跡不足、実行予算超過などで優先順位が衝突している状態を表示する。
4. `blocked` は危険なprompt、Firefox除外、terminal evidence不足、failure screenshot不足、rollback不足、AIDD-Spec接続不足、local path/private URL混入を公開前に止める。
5. candidate id、source receipt、severity、lane、priority score、effort、risk、priority reasonを表示する。
6. `execute_now`、`defer_next_increment`、`return_to_learning_log` を分離し、Codex prompt previewには `execute_now` だけを入れる。
7. AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connectionを表示する。
8. Unit testと3ブラウザE2Eで状態・prompt分離・blocked条件を確認する。
9. `doctor:aidd` がMVP083固有の必須語句と危険語混入を検査する。

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
- screenshots: empty / prioritized / conflict / blocked / terminal evidence
- article: `articles/2026-07-10-aidd-control-plane-mvp-083.md`
