# 「実行してよい1件」だけをキューに入れる：Repair Action Run Queue Intakeを作った

> 2026-07-09 / Codex Mastery Lab  
> 記事種別: Experiment / SaaS / Verification Evidence / AIDD-Spec  
> 将来の書籍章: 第10章 Verification Evidence、第11章 Learning Log、第18章 AIDD Control PlaneのMVP

## 読者の悩み

AIで失敗原因を見つけ、修正Actionまで整理した。では、そのActionをすぐCodexへ渡してよいのか。

ここで起きやすい事故があります。

- next_incrementまでpromptに混ざる。
- learning_logまで作業指示として解釈される。
- Firefox確認だけ抜ける。
- terminal evidence画像やfailure screenshotが後回しになる。
- 「一度消してからやり直す」という破壊的cleanupが、証跡ごと消してしまう。

これは、今日の買い物メモに「今日買う物」「来月検討する物」「家計簿の反省」「レシートを捨てる指示」が混ざっている状態に近いです。AIに渡す前に、今日買う物だけを小さなカゴへ移す必要があります。

AIDD Control Planeが目指すのは、コードを書くAIそのものではなく、AIへ渡す前の共通説明と証跡を整えるSaaSです。

## 今回の仮説

MVP078では、Preview Smoke Receiptの失敗をRepair Actionへ変換しました。

今回のMVP079の仮説は次です。

> Repair Actionを実Codex実行キューへ入れる直前に、queue payload、検証ゲート、証跡ゲート、rollbackゲート、sanitizeゲートを確認すれば、execute_now以外の混入と証跡不足を実行前に止められる。

作った機能名は **Repair Action Run Queue Intake** です。

## 実験内容

AI Task Packetでは、次を要求しました。

```text
Repair Action Run Queue Intake MVP079
- ?state=empty|ready|failure|blocked で状態切替
- source repair action / queue payload / execute_now summaryを表示
- excluded next_increment / excluded learning_logを別欄に隔離
- verification / evidence / rollback / sanitize gateを表示
- readyではpayloadにexecute_nowだけを入れる
- blockedではprivate URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、next_increment/learning_log混入、破壊的cleanup要求を止める
- 3ブラウザE2Eとdoctor:aiddで検証
```

実装先は次です。

```text
experiments/2026-07-09-aidd-control-plane-mvp-079/generated-repo/
```

なお、cron環境ではCodex CLIが見つからず、`codex exec --sandbox danger-full-access` は起動できませんでした。今回はこの失敗をterminal evidenceに残し、Hermes側で同じAI Task Packetに沿って実装し、独立検証を行いました。

## 画面キャプチャ

### 1. empty: キューへ入れるRepair Actionが未選択

emptyでは、まだ実行キューへ入れるRepair Actionが選ばれていません。source repair action、execute_now summary、excluded next_increment、excluded learning_logなど、混入を防ぐための欄を先に見せます。

![MVP079 empty](assets/mvp079-empty.png)

### 2. ready: execute_nowだけをpayloadへ入れる

readyでは「実行キュー投入前チェックを通過しました」と表示します。Queue payload previewはexecute_nowだけを持ち、next_incrementとlearning_logは別欄に隔離します。

![MVP079 ready](assets/mvp079-ready.png)

### 3. failure: ゲート不足をReview Findingにする

failureでは、検証ゲート不足、証跡ゲート不足、rollbackゲート不足、AIDD-Spec接続不足をReview Finding YAML風カードとして表示します。

![MVP079 failure](assets/mvp079-failure.png)

### 4. blocked: 実行前停止

blockedでは、private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、next_increment/learning_log混入、破壊的cleanup要求を止めます。

![MVP079 blocked](assets/mvp079-blocked.png)

### 5. terminal evidence画像

検証ログも記事に貼れる証跡画像として保存しました。

![MVP079 terminal evidence](assets/mvp079-terminal-evidence.png)

## 失敗と修正

今回の明確な失敗は、Codex CLIがcron環境で見つからなかったことです。

```text
codex exec --sandbox danger-full-access
blocked: codex CLI not found in cron environment
```

ただし、ここで作業を止めるとMVPの価値検証ができません。そこで、Codexが担うはずだった実装をHermes側で行い、その後の検証はCodexの自己申告ではなく、個別コマンドとして実行しました。

もう1つの修正はsanitizeです。最初のdoctorでは、禁止したいローカルパス例そのものをUI説明に書いていたため、doctorが正しく失敗しました。公開記事やpreviewへ出す説明では、具体的な個人環境名ではなく「ローカル絶対パス」と表現するよう直しました。

## 検証ログ

独立検証結果です。

```text
pnpm install --frozen-lockfile  exit 0
pnpm run lint                  exit 0
pnpm run typecheck             exit 0
pnpm run test                  exit 0
pnpm run build                 exit 0
pnpm run test:e2e              exit 0 / Chromium, Firefox, WebKit
pnpm run doctor:aidd           exit 0
pnpm run capture:mvp079        exit 0
```

保存したterminal logは次にあります。

```text
experiments/2026-07-09-aidd-control-plane-mvp-079/artifacts/terminal/
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| source repair action | どの修正Actionをキューへ入れるか | 修正理由を後から追えるようにするため |
| queue payload | AIへ渡す実データ | prompt混入を実行前に止めるため |
| execute_now summary | 今回1回でやること | 作業範囲を小さく保つため |
| excluded next_increment | 次回送りにしたこと | ついで作業を防ぐため |
| excluded learning_log | 学びとして残すこと | 学習メモを作業指示にしないため |
| verification gate | 何で直ったと判断するか | 感覚ではなく証跡で完了判断するため |
| evidence gate | どの画像・ログを残すか | note記事とレビューの一次情報にするため |
| rollback gate | 何が起きたら戻すか | 失敗した修正を安全に止めるため |
| sanitize gate | private URLやlocal pathがないか | 公開事故を防ぐため |
| destructive cleanup | 証跡を消す要求がないか | 検証ログや画像を守るため |

## SaaS / AIDD-Specへの接続

MVP079は、AIDD Control Planeを「修正Actionを作るツール」から「実行キューに入れてよいかを判断するツール」へ進めました。

AIDD-Spec v0.1では、今回の学びを次のように扱えます。

```yaml
standard_update:
  document: AIDD Control Plane MVP v0.1
  field: repair_action_run_queue_intake
  rule: |
    Repair Actionを実行キューへ投入する前に、source repair action、queue payload、execute_now summary、excluded next_increment、excluded learning_log、verification gate、evidence gate、rollback gate、sanitize gate、AIDD-Spec connectionを確認する。
    queue payloadにはexecute_nowだけを含める。
    private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、next_increment/learning_log混入、破壊的cleanup要求はblockedとして実行前停止にする。
```

noteで読まれる記事にするうえでも、この工程は強い一次情報になります。AI量産記事ではなく、「どこで止め、何を証跡として残し、どの条件なら次へ進めるか」を実験した本人だけが書けるからです。

## 次回

次は、Run Queue Intakeを通過した1件を、実際の実行結果Receiptへ変換する **Run Result Receipt Collector** に進むのが自然です。

キュー投入前だけでなく、実行後に「何を実行したか」「どの検証が通ったか」「どの証跡が増えたか」をSaaS上でReceipt化できるようにします。
