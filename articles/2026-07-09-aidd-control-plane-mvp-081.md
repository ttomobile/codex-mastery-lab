# 1回の成功で終わらせない：Dispatch Receipt履歴比較を作った

> 2026-07-09 / Codex Mastery Lab  
> 記事種別: Experiment / SaaS / Verification Evidence / AIDD-Spec  
> 将来の書籍章: 第10章 Verification Evidence、第11章 Learning Log、第18章 AIDD Control PlaneのMVP

## 読者の悩み

AI駆動開発で検証ログやスクリーンショットを残すようになると、次に起きる悩みがあります。

「今回の1回は通った。でも、同じ失敗は本当に減っているのか？」

1回分のレシートだけを見ると、成功か失敗かは分かります。しかし、前回より良くなったのか、同じ証跡不足を繰り返しているのか、どの修正指示が効いたのかは分かりません。

これは健康診断を1回だけ見て安心する状態に近いです。体重、血圧、睡眠時間は、前回からの変化を見るから意味があります。AI開発のVerification Evidenceも同じで、1回のpass/failではなく、履歴として比べる必要があります。

## 今回の仮説

MVP080では、Run Queueへ入った1件のexecute_now payloadを、実行コマンド、証跡、rollback、sanitize結果へ変換する **Run Queue Dispatch Receipt** を作りました。

今回のMVP081の仮説は次です。

> 複数のDispatch Receiptを横並びにして、score推移、再発finding、減ったfinding、効いたRepair Action、次回AI Task Packet deltaを表示すれば、「たまたま1回通った」ではなく「改善が進んだか」をレビューできる。

作った機能名は **Dispatch Receipt History Comparator** です。

## 実験内容

AI Task Packetでは、次を要求しました。

```text
Dispatch Receipt History Comparator MVP081
- ?state=empty|valid|improved|regression|blocked で状態切替
- 3件以上のReceipt履歴を比較
- score推移、再発finding、減ったfinding、効いたRepair Actionを表示
- Review Finding YAMLと次回AI Task Packet deltaを表示
- prompt previewにはexecute_nowだけを入れる
- next_incrementとlearning_logは別欄に分離
- blockedではprivate URL、local path、host名、Firefox除外、terminal evidence不足、failure screenshot不足、AIDD-Spec接続不足、execute_now以外混入を止める
- 3ブラウザE2Eとdoctor:aiddで検証
```

実装先は次です。

```text
experiments/2026-07-09-aidd-control-plane-mvp-081/generated-repo/
```

今回は `codex exec --sandbox danger-full-access` を起動しましたが、cronの実行枠では120秒でタイムアウトしました。Codexは途中までMVP080の雛形をコピーしたものの、MVP081の履歴比較としては未完成でした。そこで、失敗を `artifacts/terminal/codex-exec.txt` に残し、Hermes側で同じAI Task Packetに沿って補完しました。

## 画面キャプチャ

### 1. empty: 比較対象Receiptが未選択

emptyでは、まだ比較対象がありません。3件以上のReceiptを選ぶ必要があること、再発finding候補、次の操作を先に見せます。

![MVP081 empty](assets/mvp081-empty.png)

### 2. valid: 3件のReceipt履歴を比較

validでは、3件のReceiptを横並びにし、結果、score、finding数、terminal evidence、screenshot evidence、3ブラウザcoverage、console status、Repair Actionを比較します。

![MVP081 valid](assets/mvp081-valid.png)

### 3. improved: 同じ失敗が減っている

improvedでは、findingが5件から1件へ減ったこと、効いたRepair Action、次回AI Task Packetへ固定すべきdeltaを表示します。

![MVP081 improved](assets/mvp081-improved.png)

### 4. regression: 再発findingを検出

regressionでは、前回消えたはずのterminal evidence不足やfailure screenshot不足が再発した状態を表示します。失敗は赤表示だけで終わらせず、Review Finding YAMLとして次の修正指示へ戻します。

![MVP081 regression](assets/mvp081-regression.png)

### 5. blocked: 公開前ブロック

blockedでは、private URL、local path、host名、Firefox除外、terminal evidence不足、failure screenshot不足、AIDD-Spec接続不足、execute_now以外混入を止めます。

![MVP081 blocked](assets/mvp081-blocked.png)

### 6. terminal evidence

検証コマンドと、Codexがタイムアウトした事実も画像化しました。成功だけでなく、失敗した入口も一次情報として残します。

![MVP081 terminal evidence](assets/mvp081-terminal-evidence.png)

## 失敗と修正

今回の失敗は2つあります。

1つ目は、Codex実行が120秒でタイムアウトしたことです。ただし、途中でMVP080由来のファイルが生成されました。ここで「Codexが完成した」と扱うのではなく、未完成の証跡として保存し、独立検証できる形まで補完しました。

2つ目は、MVP080由来の古いテスト名とcapture scriptが残ったことです。そのままではdoctorやE2EがMVP080の成功を見てしまう危険があります。今回は互換入口として残すファイルもMVP081を確認する内容に置き換え、`doctor:aidd` でMVP081の状態、履歴比較、prompt分離、blocked条件を検査しました。

## 検証ログ

個別に実行し、`artifacts/terminal/*.txt` に保存しました。

| コマンド | 結果 |
|---|---|
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | pass: 6 tests |
| `pnpm run build` | pass |
| `pnpm run test:e2e` | pass: Chromium / Firefox / WebKit 30 tests |
| `pnpm run doctor:aidd` | pass |
| `pnpm run capture:mvp081` | pass |

`doctor:aidd` の要約です。

```text
doctor:aidd passed
- 5状態: empty / valid / improved / regression / blocked
- 履歴比較: 3件のReceipt、score推移、再発finding、減ったfinding、効いたRepair Action
- prompt preview: execute_nowのみ、next_increment / learning_log分離
- blocked: private URL / local path / host名 / Firefox除外 / terminal evidence不足 / failure screenshot不足 / AIDD-Spec接続不足 / execute_now以外混入
- 3ブラウザ: Chromium / Firefox / WebKit
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
|---|---|---|
| Receiptを複数件で見たか | 1回の成功だけで判断していないか | 改善傾向を見るため |
| score推移があるか | 前回より良くなったか悪くなったか | 感覚ではなく変化で判断するため |
| 再発findingがあるか | 同じ失敗を繰り返していないか | 指示や標準に戻すべき不足を見つけるため |
| 減ったfindingがあるか | どの問題が解消したか | 効いたルールを次回も使うため |
| 効いたRepair Actionが見えるか | どの修正指示が効果を出したか | 次回AI Task Packetへ再利用するため |
| execute_nowだけか | prompt previewに次回送りや学びが混ざっていないか | 1回のAI実行範囲を小さく保つため |
| next_incrementとlearning_logを分けたか | 今やること、次回やること、学びを混ぜていないか | AIへの依頼を曖昧にしないため |
| 3ブラウザ証跡があるか | Chromium / Firefox / WebKitで確認したか | 1ブラウザだけの偶然を避けるため |
| 公開前ブロックがあるか | local pathやprivate URLが混ざっていないか | note/preview公開時の事故を防ぐため |

## SaaS/AIDD-Specへの接続

AIDD-Spec v0.1では、Verification Evidenceは「ログがある」だけでは不十分です。Review RecordとLearning Logへつながり、次回AI Task Packetを良くする必要があります。

MVP081で追加したDispatch Receipt History Comparatorは、AIDD Control PlaneのSaaSとして次の役割を持ちます。

- Receiptを履歴として保存する。
- scoreとfinding数の推移を見る。
- 再発findingをReview Findingへ変換する。
- 減ったfindingから、効いたRepair Actionを抽出する。
- 次回AI Task Packet deltaへ戻す。
- 公開前に危険な証跡や浅い検証を止める。

AI量産記事ではなく、実験した本人しか書けない一次情報が強い、という立場にもつながります。履歴、失敗、修正、検証ログ、画面があるから、読者は「本当に改善したのか」を確認できます。

## 次回

次は、履歴比較で見つかった「効いたRepair Action」を、チームレビューで採用・保留・却下に分けるDecision Ledgerへ進めます。単にAIへ次の指示を投げるのではなく、どの改善を標準に取り込むかを判断できるSaaSへ近づけます。
