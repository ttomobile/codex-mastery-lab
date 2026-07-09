# 「見つけた失敗」を次の1回に畳む：Smoke Receipt Repair Action Plannerを作った

> 2026-07-09 / Codex Mastery Lab
> 記事種別: Experiment / SaaS / Verification Evidence / AIDD-Spec
> 将来の書籍章: 第10章 Verification Evidence、第11章 Learning Log、第18章 AIDD Control PlaneのMVP

## 読者の悩み

AIでアプリを作り、テストを通し、preview記事も生成した。最後にHTTP smokeで「画像が404」「terminal evidenceが0 byte」「Firefoxで未確認」と分かった。

ここでよく起きるのは、失敗一覧を眺めたまま次のAI指示が大きくなりすぎることです。

- 404を直したい。
- ついでに記事も直したい。
- ついでに画像も増やしたい。
- ついでに次回の標準も更新したい。

結果として、Codexへ渡すpromptに「今すぐ直すこと」「次回でよいこと」「学びとして残すこと」が混ざります。これは買い物メモに、今日買う物、来月ほしい物、家計簿の反省を全部同じ行で書くようなものです。読めなくはないけれど、行動に移すと間違えやすい。

AIDD Control Planeが目指すのは、AIにコードを書かせるだけのSaaSではありません。失敗を見つけたあと、次の1回で何を直すかまで整理するSaaSです。

## 今回の仮説

MVP077では、公開preview HTML、asset、terminal evidence imageをHTTP status、byte size、content type、latencyとしてReceipt化しました。

今回のMVP078の仮説は次です。

> Preview Smoke Receiptで見つけたfailure / blockedを、execute_now / next_increment / learning_logへ分け、Codex prompt previewにはexecute_nowだけを入れると、失敗修正を安全な1インクリメントへ変換できる。

作った機能名は **Smoke Receipt Repair Action Planner** です。

## 実験内容

Codexへ渡したAI Task Packetでは、次を要求しました。

```text
Smoke Receipt Repair Action Planner MVP078
- ?state=empty|planned|failure|blocked で状態切替
- source receipt / broken URL / finding category / severity / lane / priority reasonを表示
- execute_now action / next_increment / learning_logを分離
- Codex prompt previewにはexecute_nowだけを入れる
- verification commands / required evidence / rollback conditionを必須化
- private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、prompt混入をblockedにする
- 3ブラウザE2Eとdoctor:aiddで検証
```

実装先は次です。

```text
experiments/2026-07-09-aidd-control-plane-mvp-078/generated-repo/
```

## 画面キャプチャ

### 1. empty: 修正対象Receiptが未選択

emptyでは、まだどのPreview Smoke Receipt failureを修正するか選ばれていません。source receipt、broken URL、finding category、execute_nowなどの必須項目を先に見せます。

![MVP078 empty](assets/mvp078-empty.png)

### 2. planned: 次の1回だけを実行可能

plannedでは、1件のexecute_now action、next_increment、learning_logを分けて表示します。重要なのは、Codex prompt previewにexecute_nowだけが入ることです。

![MVP078 planned](assets/mvp078-planned.png)

### 3. failure: 修正計画の材料不足

failureでは、検証コマンド不足、証跡不足、rollback不足、AIDD-Spec接続不足をReview Finding YAML風カードとして表示します。「失敗した」ではなく「何が足りないからAIへ渡せないのか」を見える化します。

![MVP078 failure](assets/mvp078-failure.png)

### 4. blocked: 実行前停止

blockedでは、private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、execute_now以外のprompt混入を実行前停止として扱います。

![MVP078 blocked](assets/mvp078-blocked.png)

### 5. terminal evidence画像

検証ログも記事に貼れる証跡画像として保存しました。

![MVP078 terminal evidence](assets/mvp078-terminal-evidence.png)

## 失敗と修正

今回の実装そのものは、Codex後の独立検証でlint、typecheck、unit test、build、3ブラウザE2E、doctorが通りました。

一方で、作業中に別の学びがありました。MVP077を土台としてコピーしたため、生成repo内にMVP077の古い画像やcapture scriptも残りました。安全ゲートが削除操作を止めたため、破壊的cleanupは再試行せず、MVP078で必要な画像とファイルだけをcommit対象に選ぶ方針にしました。

この判断はAIDD-Spec的には重要です。cleanupできることより、証跡を壊さず、今回の成果物に必要な範囲だけを明示して進めることを優先しました。

## 検証ログ

Codexの自己申告ではなく、別コマンドとして独立検証しました。

```text
pnpm install --frozen-lockfile  exit 0
pnpm run lint                  exit 0
pnpm run typecheck             exit 0
pnpm run test                  exit 0 / 5 passed
pnpm run build                 exit 0
pnpm run test:e2e              exit 0 / 12 passed / Chromium, Firefox, WebKit
pnpm run doctor:aidd           exit 0
pnpm run capture:mvp078        exit 0
```

保存したterminal logは次にあります。

```text
experiments/2026-07-09-aidd-control-plane-mvp-078/artifacts/terminal/
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| source receipt | どの失敗Receiptから来た修正か | 修正理由を後から追えるようにするため |
| broken URL | 何が壊れているか | 直す対象を曖昧にしないため |
| execute_now | 次の1回で実行すること | AIの作業範囲を小さく保つため |
| next_increment | 次回送りにすること | 今回のpromptを膨らませすぎないため |
| learning_log | 学びとして残すこと | 同じ失敗を次回の標準へ戻すため |
| verification commands | 何で直ったと判断するか | 修正完了を感覚で決めないため |
| required evidence | どの画像・ログを残すか | 記事とレビューの一次情報にするため |
| rollback condition | 何が起きたら戻すか | 失敗した修正を安全に止めるため |
| Codex prompt preview | execute_nowだけが入っているか | 次回送りや学びが混ざると実行範囲が壊れるため |
| Firefox確認 | 3ブラウザから外れていないか | ブラウザ差分を公開前に拾うため |
| sanitize | private URLやlocal pathがないか | 公開事故を防ぐため |

## SaaS / AIDD-Specへの接続

MVP078は、AIDD Control Planeを「失敗を見つけるだけのツール」から「次の安全な一手を作るツール」へ進める小さな部品です。

AIDD-Spec v0.1では、今回の学びを次のように扱えます。

```yaml
standard_update:
  document: AIDD Control Plane MVP v0.1
  field: smoke_receipt_repair_action_planner
  rule: |
    Preview Smoke Receiptのfailure / blockedは、source receipt、broken URL、finding category、severity、lane、priority reasonを保持したRepair Actionへ変換する。
    execute_now、next_increment、learning_logを分離し、Codex prompt previewにはexecute_nowだけを入れる。
    verification commands、required evidence、rollback condition、AIDD-Spec connectionが不足する場合はfailure、private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、execute_now以外のprompt混入はblockedとして実行前停止にする。
```

noteで読まれる記事にするうえでも、この分離は効きます。AI量産記事ではなく、実験した本人しか持っていない「失敗をどう小さな修正単位へ変えたか」という一次情報になるからです。

## 次回

次は、Repair Action Plannerでreadyになった1件を、実際のCodex実行キューへ入れる前に最終確認する **Repair Action Run Queue Intake** に進むのが自然です。

execute_nowだけがqueue payloadに入り、検証コマンド、3ブラウザ、required evidence、rollback conditionが揃っているかを、もう一段階で確認します。
