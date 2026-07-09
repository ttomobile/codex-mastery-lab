# AIに全部投げない：Smoke Repair候補を「今回やる1件」へ絞る優先順位ゲート

> 2026-07-10 / Codex Mastery Lab
> 記事種別: Experiment / SaaS / Verification Evidence / AIDD-Spec
> 将来の書籍章: 第9章 AI Task Packet、第10章 Verification Evidence、第18章 AIDD Control PlaneのMVP

## 読者の悩み

AI駆動開発でpreview smokeや証跡QAを始めると、失敗は1つだけでは終わりません。

- terminal evidence画像が404
- failure screenshotが不足
- Playwright report URLも未確認
- asset copy規則も直したい
- Firefoxだけ除外されているかもしれない

ここで全部をAIに投げると、次の失敗が起きます。修正範囲が広がり、何を直したのか、どの証跡で確認したのか、どこまで戻せばよいのかが曖昧になります。

日常で言えば、買い物リストに「今日の夕食」「週末の作り置き」「調味料の補充」「掃除用品」を全部混ぜて、10分しかない昼休みにスーパーへ行くようなものです。大事なのは、全部を忘れないことではなく、**今回の1回で買うものを決めること**です。

## 今回の仮説

MVP082では、Preview Smoke Receiptのfailure / blockedを次の1回で実行するRepair Actionへ変換しました。

今回のMVP083の仮説は次です。

> Repair Action候補が複数ある時、severity、priority score、effort、risk、priority reason、必要証跡を見て、execute_nowを1件だけに絞れれば、AIに渡す依頼は小さくなり、検証証跡も追いやすくなる。

作った機能名は **Smoke Repair Priority Gate** です。

## 実験内容

AI Task Packetでは、次を要求しました。

```text
Smoke Repair Priority Gate MVP083
- ?state=empty|prioritized|conflict|blocked で状態切替
- candidate id / source receipt / severity / lane / priority score / effort / risk / priority reasonを表示
- execute_now / defer_next_increment / return_to_learning_log を分離
- Codex prompt previewにはexecute_nowだけを入れる
- conflictでは高severity複数・証跡不足・実行予算超過・優先理由不足をReview Finding化
- blockedではprivate URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、rollback不足、AIDD-Spec接続不足、execute_now以外混入を止める
- 3ブラウザE2Eとdoctor:aiddで検証
```

実装先は次です。

```text
experiments/2026-07-10-aidd-control-plane-mvp-083/generated-repo/
```

cron環境では今回も `codex` CLI が見つからず、`codex-exec.txt` に失敗を保存しました。失敗は隠さず、Agent Runの証跡として残したうえで、AI Task Packetに沿ってHermes側で実装と独立検証を完了しました。

## 画面キャプチャ

### 1. empty: Repair Action候補待ち

emptyでは、候補、source receipt、実行予算、必要証跡が揃うまでCodexへ渡さないことを示します。

![MVP083 empty](assets/mvp083-empty.png)

### 2. prioritized: 今回やる1件に絞る

prioritizedでは、3件のRepair候補から、criticalかつsmall effortのterminal evidence画像404修正だけを `execute_now` へ入れます。Playwright report smokeは次回送り、asset copy規則はLearning Log戻しに分けます。

![MVP083 prioritized](assets/mvp083-prioritized.png)

### 3. conflict: 優先順位が衝突している

conflictでは、高severity候補が複数ある、証跡不足、実行予算超過、priority reason不足をReview Findingとして表示します。この状態ではAI実行へ進めません。

![MVP083 conflict](assets/mvp083-conflict.png)

### 4. blocked: 公開前に止める

blockedでは、private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、rollback不足、AIDD-Spec接続不足、execute_now以外混入を止めます。

![MVP083 blocked](assets/mvp083-blocked.png)

### 5. terminal evidence

検証ログの要約を画像化しました。記事に「検証した」と書くだけでなく、読者が見られる証跡として残します。

![MVP083 terminal evidence](assets/mvp083-terminal-evidence.png)

## 失敗と修正

今回の失敗は2つです。

1つ目は、`codex exec --sandbox danger-full-access` が `codex: command not found` で失敗したことです。これはSaaS化すると「Agent Run開始失敗」として扱うべき証跡です。

2つ目は、最初のE2Eで `Firefox除外` という文字が複数箇所に出て、Playwrightのstrict mode violationになったことです。UIの問題ではなく、テストが曖昧でした。`getByText("Firefox除外", { exact: true })` に修正し、何を検証しているかを明確にしました。

## 検証ログ

個別に実行し、`artifacts/terminal/*.txt` に保存しました。

| コマンド | 結果 |
|---|---|
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | pass: 11 tests |
| `pnpm run build` | pass |
| `pnpm run test:e2e` | pass: Chromium / Firefox / WebKit 21 tests |
| `pnpm run doctor:aidd` | pass |
| `pnpm run capture:mvp083` | pass |

`doctor:aidd` の要約です。

```text
doctor:aidd passed
- 4状態: empty / prioritized / conflict / blocked
- Candidate: candidate id / source receipt / severity / lane / priority score / effort / risk / priority reason
- prompt preview: execute_nowのみ、defer_next_increment / return_to_learning_log分離
- Priority Gate: AI Task Packet patch / Codex prompt patch / verification commands / required evidence / rollback
- blocked: private URL / local path / Firefox除外 / terminal evidence不足 / failure screenshot不足 / rollback不足 / AIDD-Spec接続不足 / execute_now以外混入
- 3ブラウザ: Chromium / Firefox / WebKit
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
|---|---|---|
| candidate idがあるか | 候補を一意に追えるか | 後から「どの修正を選んだか」を確認するため |
| source receiptがあるか | どの失敗証跡から来た候補か | 思いつき修正ではなく、実測失敗に紐づけるため |
| severityを付けたか | 影響の大きさを見たか | 重要度の低い修正を先に選ばないため |
| effortを見たか | 今回の1回で終わるか | AIへの依頼を広げすぎないため |
| riskを見たか | 修正で別の証跡を壊さないか | rollback条件を先に持つため |
| priority reasonがあるか | なぜ今回やるのか | AIにもレビュー担当にも判断根拠を残すため |
| execute_nowは1件か | 今回やることが絞られているか | 検証結果を追いやすくするため |
| defer_next_incrementを分けたか | 次回送りが混ざっていないか | prompt肥大化を防ぐため |
| return_to_learning_logを分けたか | 長期改善が実行指示に混ざっていないか | ルール改善と実装修正を分けるため |
| rollback conditionがあるか | 失敗時に止める条件があるか | 追加修正で被害を広げないため |

## SaaS/AIDD-Specへの接続

AIDD-Spec v0.1では、AI Task Packetは「やってほしいことリスト」ではなく、検証可能な入力です。MVP083で追加したSmoke Repair Priority Gateは、AIDD Control PlaneのSaaSとして次の役割を持ちます。

- Review Findingから複数のRepair候補を受け取る。
- severity、priority score、effort、risk、priority reasonで比較する。
- execute_nowを1件だけに絞る。
- defer_next_incrementとreturn_to_learning_logを分離する。
- Codex prompt previewにはexecute_nowだけを入れる。
- conflict / blockedなら実行前に止める。

noteで読まれる記事という意味でも、これは重要です。AI量産記事ではなく、実験した本人しか書けない一次情報は、「失敗が複数出た時に、なぜこの1件を選んだのか」まで見えるほど強くなります。

## 次回

次は、優先順位ゲートで選んだ1件をRun Queueへ入れる前に、公開preview smokeのHTTP結果とterminal evidence画像が本当に読めるかを、最終receiptとして束ねる方向へ進めます。
