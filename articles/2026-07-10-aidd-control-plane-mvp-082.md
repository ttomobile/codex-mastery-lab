# 「404だった」で終わらせない：Preview Smoke失敗を次の1回の修正Actionへ変換する

> 2026-07-10 / Codex Mastery Lab  
> 記事種別: Experiment / SaaS / Verification Evidence / AIDD-Spec  
> 将来の書籍章: 第10章 Verification Evidence、第11章 Learning Log、第18章 AIDD Control PlaneのMVP

## 読者の悩み

AI駆動開発で記事やpreviewを作っていると、最後にこういう事故が起きます。

「本文はできた。スクリーンショットも撮った。なのに公開previewで画像が404になっていた」

この時、単に「あとで直す」とメモするだけでは弱いです。次のAI依頼に何を渡せばよいか、どの証跡を再確認すればよいか、公開前に止める条件は何かが曖昧なままになります。

料理で言うと、「味が薄い」とだけ書いて次回に回すようなものです。塩を何g足すのか、どのタイミングで味見するのか、入れすぎたらどう戻すのかがないと、次も同じ失敗をします。

## 今回の仮説

MVP081では、複数のDispatch Receiptを比較し、同じ失敗が減ったか、どのRepair Actionが効いたかを見える化しました。

今回のMVP082の仮説は次です。

> Preview Smoke Receiptで見つかったfailure / blockedを、broken URL、分類、重要度、優先理由、execute_now action、検証コマンド、必要証跡へ変換できれば、「壊れていた」から「次の1回で直せる」へ進められる。

作った機能名は **Smoke Receipt Repair Action Planner** です。

## 実験内容

AI Task Packetでは、次を要求しました。

```text
Smoke Receipt Repair Action Planner MVP082
- ?state=empty|planned|failure|blocked で状態切替
- broken URL / finding category / severity / lane / priority reasonを表示
- execute_now action、next_increment、learning_logを分離
- Codex prompt previewにはexecute_nowだけを入れる
- AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connectionを表示
- blockedではprivate URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、AIDD-Spec接続不足、execute_now以外混入を止める
- 3ブラウザE2Eとdoctor:aiddで検証
```

実装先は次です。

```text
experiments/2026-07-10-aidd-control-plane-mvp-082/generated-repo/
```

なお、cron環境では `codex` CLI が見つからず、`codex-exec.txt` に失敗を保存しました。今回はその失敗を隠さず、AI Task Packetに沿ってHermes側で実装と独立検証を完了しました。

## 画面キャプチャ

### 1. empty: Smoke Receipt未選択

emptyでは、まだ壊れたpreview receiptが選ばれていません。どの入力が必要か、実行前に何を確認するかを先に表示します。

![MVP082 empty](assets/mvp082-empty.png)

### 2. planned: 壊れたterminal evidence画像を1回で直す

plannedでは、`preview/assets/mvp082-terminal-evidence.png` のような壊れたassetを、execute_now actionへ変換します。next_incrementとlearning_logは別欄に分離します。

![MVP082 planned](assets/mvp082-planned.png)

### 3. failure: HTTP失敗をReview Findingへ変換

failureでは、404、0 byte、content type mismatchを、Review Finding YAML、修正指示、検証コマンドへ変換します。

![MVP082 failure](assets/mvp082-failure.png)

### 4. blocked: 公開前に止める条件

blockedでは、private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、AIDD-Spec接続不足、execute_now以外混入を止めます。

![MVP082 blocked](assets/mvp082-blocked.png)

### 5. terminal evidence

検証コマンド結果も画像化しました。記事に「検証した」と書くだけでなく、読者が確認できる証跡として残します。

![MVP082 terminal evidence](assets/mvp082-terminal-evidence.png)

## 失敗と修正

今回の失敗は2つです。

1つ目は、`codex exec --sandbox danger-full-access` を実行したところ、cron環境では `codex: command not found` になったことです。これは `artifacts/terminal/codex-exec.txt` に保存しました。Codexが動かなかった事実も、SaaS化では「Agent Run失敗」として扱うべき一次情報です。

2つ目は、最初のE2Eで `getByText` が複数要素に一致し、strict mode violationになったことです。UIが壊れていたわけではなく、テストの指定が浅かった。そこで `getByRole` と `exact: true` を使い、何を検証しているかが明確なテストへ直しました。

## 検証ログ

個別に実行し、`artifacts/terminal/*.txt` に保存しました。

| コマンド | 結果 |
|---|---|
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | pass: 7 tests |
| `pnpm run build` | pass |
| `pnpm run test:e2e` | pass: Chromium / Firefox / WebKit 27 tests |
| `pnpm run doctor:aidd` | pass |
| `pnpm run capture:mvp082` | pass |

`doctor:aidd` の要約です。

```text
doctor:aidd passed
- 4状態: empty / planned / failure / blocked
- Smoke Receipt: broken URL / category / severity / lane / priority reason
- prompt preview: execute_nowのみ、next_increment / learning_log分離
- Repair Action: AI Task Packet patch / Codex prompt patch / verification commands / required evidence / rollback
- blocked: private URL / local path / Firefox除外 / terminal evidence不足 / failure screenshot不足 / AIDD-Spec接続不足 / execute_now以外混入
- 3ブラウザ: Chromium / Firefox / WebKit
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
|---|---|---|
| broken URLを残したか | どのpreview資産が壊れたか | 修正対象を1件に絞るため |
| categoryを付けたか | 404、0 byte、content type mismatchなどの種類 | 直し方が失敗種類で変わるため |
| severityを付けたか | 今すぐ直すか、後でよいか | execute_nowを大きくしすぎないため |
| priority reasonがあるか | なぜ今回やるのか | AIへの依頼を納得できる範囲にするため |
| execute_nowだけをpromptに入れたか | 次の1回でやることだけになっているか | AIが余計な範囲まで変更しないようにするため |
| next_incrementとlearning_logを分けたか | 次回送りと学びが混ざっていないか | 次の依頼と長期改善を分けるため |
| required evidenceがあるか | 修正後に何を保存するか | 「直ったはず」を証跡で確認するため |
| rollback conditionがあるか | 失敗時に戻す条件があるか | 修正で別の証跡を壊した時に止めるため |
| blocked条件があるか | 公開前に止める危険がないか | private URLや浅い検証の公開事故を避けるため |

## SaaS/AIDD-Specへの接続

AIDD-Spec v0.1では、Verification Evidenceはログや画像を置くだけでは終わりません。失敗した証跡はReview Recordへ入り、Learning Logと次回AI Task Packetへ戻る必要があります。

MVP082で追加したSmoke Receipt Repair Action Plannerは、AIDD Control PlaneのSaaSとして次の役割を持ちます。

- Preview Smoke Receiptの失敗を分類する。
- broken URL、severity、priority reasonを保存する。
- execute_now actionへ変換する。
- AI Task Packet patchとCodex prompt patchを生成する。
- required evidenceとrollback conditionを付ける。
- private URL、local path、Firefox除外、証跡不足をblockedにする。

noteで読まれる記事という意味でも、これは重要です。AI量産記事ではなく、実験した本人しか書けない一次情報は、失敗、修正、検証ログ、スクリーンショット、再発防止の型が揃っているほど強くなります。

## 次回

次は、Repair ActionをRun Queueへ入れる前に、複数の候補から「今回やる1件」を選ぶ優先順位ゲートへ進めます。壊れたものを全部AIに投げるのではなく、1回の実行に収まる量へ整えるSaaSに近づけます。
