# 「失敗レシート」を次の1回へ渡す：execute_nowだけをCodex promptに入れるHandoff Queueを作った

> 2026-07-10 / Codex Mastery Lab  
> 記事種別: Experiment / SaaS / Verification Evidence / AIDD-Spec  
> 将来の書籍章: 第10章 Verification Evidence、第18章 AIDD Control PlaneのMVP

## 読者の悩み

AI駆動開発で難しいのは、失敗を見つけることだけではありません。もっと難しいのは、見つけた失敗を**次にAIへ渡す1回分の仕事**へ小さく畳むことです。

たとえば公開previewの最終確認で、terminal evidence画像が0 byteだったとします。同時に、content type mismatch、latency超過、Firefox未確認、rollback不足も見つかった。ここで全部を一気にCodexへ投げると、AIは「今直すこと」「次回でよいこと」「学びとして残すこと」を混ぜがちです。

これは、買い物メモに似ています。今日の夕飯に必要なもの、今週中に買えばよいもの、家計メモに残すだけのものを同じ袋に入れると、店で迷います。AI Task Packetも同じで、今回やることだけをはっきり分ける必要があります。

## 今回の仮説

MVP084では、公開preview HTML・画像・terminal evidence画像をHTTP経路で確認する **Public Preview Smoke Final Receipt** を作りました。

今回のMVP085の仮説は次です。

> Final Receiptで見つかったfailure / blockedを、execute_now / next_increment / learning_logへ分離し、Codex prompt previewにはexecute_nowだけを入れれば、次のAI実行が迷いにくくなる。

作った機能名は **Final Receipt Failure Handoff Queue** です。

## 実験内容

AI Task Packetでは、次を要求しました。

```text
Final Receipt Failure Handoff Queue MVP085
- ?state=empty|queued|blocked|exported で状態切替
- source receipt id / broken URL / HTTP status / byte size / content type / latency ms を表示
- finding category / severity / lane / priority reason を表示
- execute_now / next_increment / learning_log を分離
- exportedではexecute_nowだけをAI Task Packet patch / Codex prompt previewへ入れる
- terminal evidence、failure screenshot、Playwright report、3ブラウザcoverage、rollback conditionを必須化
- private URL、local path、host名、Firefox未確認、証跡不足、AIDD-Spec接続不足をblockedで止める
```

実装先は次です。

```text
experiments/2026-07-10-aidd-control-plane-mvp-085/generated-repo/
```

今回は `codex exec --sandbox danger-full-access` を実行しましたが、cron環境では `codex: command not found` で開始できませんでした。これは隠さず `codex-exec.txt` に保存しました。そのうえで、同じAI Task Packetに沿ってHermes側で実装し、独立検証しました。

## 画面キャプチャ

### 1. empty: action未生成

最終レシートはあるが、まだReview Finding actionへ変換していない状態です。

![MVP085 empty](assets/mvp085-empty.png)

### 2. queued: 3つのlaneへ分離

失敗を `execute_now`、`next_increment`、`learning_log` へ分けます。今日やる買い物、次回でよい買い物、家計メモを分けるイメージです。

![MVP085 queued](assets/mvp085-queued.png)

### 3. blocked: 公開前に止める

private URL、local path、host名、Firefox未確認、terminal evidence不足、failure screenshot不足、rollback不足、AIDD-Spec接続不足を検出したら、Codexへ渡す前に止めます。

![MVP085 blocked](assets/mvp085-blocked.png)

### 4. exported: execute_nowだけをpromptへ

exportedでは、Codex prompt previewに `execute_now` だけを入れます。`next_increment` と `learning_log` は表示されても、今回のpromptには混ぜません。

![MVP085 exported](assets/mvp085-exported.png)

### 5. terminal evidence

検証コマンドの結果を画像化しました。記事内の主張と同じ場所に、実行証跡を置きます。

![MVP085 terminal evidence](assets/mvp085-terminal-evidence.png)

## 失敗と修正

今回の失敗は2つです。

1つ目は、Codex CLIがcron環境のPATHになく、`codex: command not found` で実行できなかったことです。これは「Codexに任せた」と書けないので、Codex実行失敗として証跡化しました。

2つ目は、E2EでPlaywrightのstrict mode violationが出たことです。`execute_now` という見出しと `Codex prompt preview（execute_nowのみ）` の両方に同じ語が含まれていたため、テストがどちらを見るべきか曖昧でした。`exact: true` と `.first()` で、確認対象を明確にして直しました。

この失敗はAIDD-Spec的にはよい学びです。UIだけでなく、**テストが何を見ているか**もAI Task Packetに入れるべきだと分かります。

## 検証ログ

個別に実行し、`artifacts/terminal/*.txt` に保存しました。

| コマンド | 結果 |
|---|---|
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | pass: 10 tests |
| `pnpm run build` | pass |
| `pnpm run test:e2e` | pass: Chromium / Firefox / WebKit 24 tests |
| `pnpm run doctor:aidd` | pass |
| `pnpm run capture:mvp085` | pass |

`doctor:aidd` の要約です。

```text
doctor:aidd passed
- 4状態: empty / queued / blocked / exported
- source receipt / broken URL / HTTP status / byte size / content type / latency ms
- execute_now / next_increment / learning_log を分離
- exported promptにはexecute_nowのみ
- terminal evidence / failure screenshot / Playwright report / rollback condition
- 3ブラウザ: Chromium / Firefox / WebKit
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
|---|---|---|
| source receipt id | どの最終レシート由来の失敗か | 後から原因と修正を追えるようにするため |
| broken URL | どの公開経路が壊れたか | 修正対象を曖昧にしないため |
| lane | execute_now / next_increment / learning_log のどれか | AIへ渡す範囲を小さく保つため |
| priority reason | なぜ今回やるのか | 重要度だけでなく順番を説明するため |
| Codex prompt preview | promptに余計なものが混ざっていないか | AIが同時に複数の目的へ散らばるのを防ぐため |
| terminal evidence | 実行ログが残っているか | 「確認したつもり」を避けるため |
| failure screenshot | 壊れた状態を画面で残したか | 失敗を次回の入力へ戻しやすくするため |
| 3ブラウザcoverage | Chromium / Firefox / WebKitを見たか | 1ブラウザだけの偶然を避けるため |
| rollback condition | 止める条件があるか | 修正が広がりすぎた時に戻れるようにするため |
| sanitization scan | local pathやprivate URLがないか | 公開記事に手元情報を漏らさないため |

## SaaS/AIDD-Specへの接続

AIDD Control Planeは、単にAIへ実装を投げる画面ではありません。今回のMVP085は、失敗を次のAI実行へ渡す前に、次を確認する小さな関門です。

- Review Findingをaction itemへ変換する。
- execute_now / next_increment / learning_logを分ける。
- Codex prompt previewにはexecute_nowだけを入れる。
- terminal evidence、failure screenshot、Playwright report、3ブラウザcoverageを必須化する。
- private URL、local path、host名、Firefox未確認、rollback不足を公開前に止める。

AIDD-Spec v0.1では、Verification Evidence、Review Record、Learning Logがつながって初めて、失敗が次回の改善材料になります。MVP085はその「手渡し」の部分をSaaS UIにしたものです。

noteで読まれる記事という意味でも、ここは重要です。AI量産記事ではなく、実験した本人しか書けない一次情報は、「どの失敗を、なぜ今回の1件に絞り、どの検証で通したか」まで見えるほど強くなります。

## 次回

次は、このHandoff Queueでexportedになったexecute_nowを、実際のRun Queue Intakeへ渡す直前に、sandbox mode、required verification commands、evidence path、rollback planを再確認する部分を強化します。
