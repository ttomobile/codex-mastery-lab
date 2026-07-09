# 「実行した1件」をレシートにする：Run Queue Dispatch Receiptを作った

> 2026-07-09 / Codex Mastery Lab  
> 記事種別: Experiment / SaaS / Verification Evidence / AIDD-Spec  
> 将来の書籍章: 第10章 Verification Evidence、第11章 Learning Log、第18章 AIDD Control PlaneのMVP

## 読者の悩み

AIへ渡す修正Actionを1件に絞った。キューにも入れられる状態になった。では、そのあと何を残せば「あとから見直せる実行」になるのでしょうか。

AI駆動開発では、ここで記録が薄くなりがちです。

- 何を実行したかは、チャットのどこかにある。
- どのコマンドで検証したかは、terminal履歴を探せば分かる。
- 失敗した理由は、担当者の記憶に残っている。
- 次に直すことは、なんとなく分かっている。

これは家計簿で、レシートを捨てて「だいたい合っている」と言っている状態に近いです。あとから確認できる形で、買った物、金額、店、日時を残しておくから家計簿になります。

AIDD Control Planeが目指すのは、AIにコードを書かせるSaaSではありません。AIへ渡した1件、検証した証跡、止めた理由、次へ戻す修正Actionを、あとから誰でも確認できる形にするSaaSです。

## 今回の仮説

MVP079では、Repair Actionを実行キューへ入れる直前に、execute_now以外の混入や証跡不足を止める **Repair Action Run Queue Intake** を作りました。

今回のMVP080の仮説は次です。

> queue投入済みのexecute_now payloadを、dispatch command、verification gates、evidence checklist、rollback condition、sanitize scan、次のRepair Action候補へ変換すれば、「実行した1件」をVerification Evidenceとして扱える。

作った機能名は **Run Queue Dispatch Receipt** です。

## 実験内容

AI Task Packetでは、次を要求しました。

```text
Run Queue Dispatch Receipt MVP080
- ?state=empty|ready|running|failure|blocked で状態切替
- queue item / execute_now payload / dispatch commandを表示
- verification / evidence / rollback / sanitize gateを表示
- runningではprogressとpending evidenceを表示
- failureではReview Finding YAMLと次のRepair Action候補を表示
- blockedではprivate URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、next_increment/learning_log混入、破壊的cleanup要求を止める
- payload previewにはexecute_nowだけを入れる
- 3ブラウザE2Eとdoctor:aiddで検証
```

実装先は次です。

```text
experiments/2026-07-09-aidd-control-plane-mvp-080/generated-repo/
```

今回もcron環境ではCodex CLIが見つからず、`codex exec --sandbox danger-full-access` は起動できませんでした。この失敗は `artifacts/terminal/codex-exec.txt` とterminal evidence画像に残し、Hermes側で同じAI Task Packetに沿って実装しました。Codexの自己申告ではなく、独立検証で通過を確認しています。

## 画面キャプチャ

### 1. empty: Dispatch対象が未選択

emptyでは、まだqueue itemが選ばれていません。あとから必要になるreceipt id、queue item、execute_now summary、dispatch commandなどの枠を先に見せます。

![MVP080 empty](assets/mvp080-empty.png)

### 2. ready: Dispatch Receiptを発行できる

readyでは「Dispatch Receiptを発行できます」と表示します。payload previewはexecute_nowだけを持ち、next_incrementとlearning_logは別欄へ隔離します。

![MVP080 ready](assets/mvp080-ready.png)

### 3. running: 実行中の証跡を収集中

runningでは「実行中の証跡を収集中」と表示し、まだ残っているpending evidenceを見せます。実行中に何が未収集かを先に見せることで、あとからスクリーンショットやterminal evidenceを取り忘れる事故を減らします。

![MVP080 running](assets/mvp080-running.png)

### 4. failure: 失敗を次のRepair Actionへ戻す

failureでは、dispatch command失敗、証跡ゲート不足、rollbackゲート発火をReview Finding YAML風カードで表示します。失敗は単なる赤い表示ではなく、次の1回で直すRepair Action候補へ戻します。

![MVP080 failure](assets/mvp080-failure.png)

### 5. blocked: Dispatch停止

blockedでは、private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、next_increment/learning_log混入、破壊的cleanup要求を止めます。

![MVP080 blocked](assets/mvp080-blocked.png)

### 6. terminal evidence

検証コマンドとCodex CLI起動失敗も、記事用の一次情報として画像化しました。

![MVP080 terminal evidence](assets/mvp080-terminal-evidence.png)

## 失敗と修正

今回の一番大きな失敗は、要求どおりにCodex CLIを起動しようとしたところ、cron環境で `codex: command not found` になったことです。

```text
codex exec --sandbox danger-full-access
failed: codex command not found
```

ここで「Codexが実装したことにする」のは、AIDD-Spec的には悪い証跡です。今回は失敗をそのまま記録し、Hermes実装へ切り替え、同じAI Task Packetで独立検証しました。

もう1つの失敗は、前回MVPから作業ディレクトリをコピーしたときに、不要な古いスクリーンショットや補助ファイルも混ざったことです。破壊的cleanupコマンドはcron安全ゲートで止まったため、再試行せず、コミット対象を必要ファイルに限定する方針にしました。

## 検証ログ

個別に実行し、`artifacts/terminal/*.txt` に保存しました。

| コマンド | 結果 |
|---|---|
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | pass |
| `pnpm run build` | pass |
| `pnpm run test:e2e` | pass: Chromium / Firefox / WebKit 15 tests |
| `pnpm run doctor:aidd` | pass |
| `pnpm run capture:mvp080` | pass |

`doctor:aidd` の要約です。

```text
doctor:aidd passed
- 5状態: empty / ready / running / failure / blocked
- ready: Dispatch Receiptを発行可能
- running: 実行中の証跡を収集中
- failure: dispatch command失敗 / 証跡ゲート不足 / rollbackゲート発火
- blocked: private URL / local path / Firefox除外 / terminal evidence不足 / failure screenshot不足 / payload混入 / 破壊的cleanup要求
- 3ブラウザ: Chromium / Firefox / WebKit
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
|---|---|---|
| execute_nowだけか | payload previewに次回改善や学びが混ざっていないか | 1回のAI実行範囲を小さく保つため |
| dispatch commandがあるか | 実際に何を起動したか | あとから再現できるようにするため |
| verification commandsが揃っているか | lint/typecheck/test/build/E2E/doctorを個別に確認したか | 「動いた気がする」を避けるため |
| required evidenceがあるか | 画面・失敗・terminal画像を残したか | 記事とレビューの一次情報にするため |
| running中の未収集証跡が見えるか | 何がまだ残っているか | 証跡の取り忘れを減らすため |
| rollback conditionがあるか | 失敗時にどこへ戻すか | 失敗を放置せず次のRepair Actionへ変えるため |
| sanitize scanがあるか | local pathやprivate URLが混ざっていないか | 公開記事やpreviewで事故を防ぐため |
| 3ブラウザE2Eか | Chromium / Firefox / WebKitで確認したか | 1ブラウザだけの偶然を避けるため |

## SaaS/AIDD-Specへの接続

AIDD-Spec v0.1では、Verification Evidenceは「コマンドが通った」という一文では不十分です。何を実行し、どの証跡を保存し、失敗時にどのRepair Actionへ戻したかまで残す必要があります。

MVP080で追加したRun Queue Dispatch Receiptは、AIDD Control PlaneのSaaSとしては次の役割を持ちます。

- Run Queueに入った1件を実行Receiptへ変換する。
- dispatch commandとpayload previewを保存する。
- running中のpending evidenceを見せる。
- failureをReview Findingと次のRepair Actionへ戻す。
- blocked条件を実行前に止める。
- 証跡を記事・レビュー・AIDD-Spec更新へ再利用できる形にする。

AI量産記事ではなく、実験した本人しか書けない一次情報が強い、という立場にもつながります。画面、terminal、失敗、修正、検証ログが残っているから、読者は「本当に試したのか」を確認できます。

## 次回

次は、Dispatch Receiptを1件で終わらせず、複数回のReceiptを並べて「同じ失敗が減ったか」「どのRepair Actionが効いたか」を比較する履歴ビューへ進めます。
