# AIDD Control Plane MVP 004：AIに頼む前の質問から、設計書と依頼書を作る

> 2026-06-29 / Codex Mastery Lab  
> 対象: AIDD Control Plane SaaS化 / Project Intake Wizard / AIDD-Spec v0.1  
> 結果: **粗いアプリ案からProduct Brief、AI Task Packet、検証計画、Codex Promptを生成する入口を作った**

## まず、何が分かりにくかったのか

前回までのAIDD Control Planeは、正直に言うと初見では意味が分かりにくかった。

MVP 001では、Product BriefからAI Task PacketやRunbookを作った。  
MVP 002では、JSON Contract Checkerを作った。  
MVP 003では、実行ログやスクリーンショットをVerification Evidenceにまとめた。

ただ、これは全部「分かっている人向けの内部部品」に近かった。

読者や利用者が最初に知りたいのは、たぶんこうだ。

```text
で、私は最初に何を入力すればいいの？
これを使うと、何が作れるの？
本当にAIへの依頼が良くなるの？
```

そこでMVP 004では、入口を作ることにした。

## 今回の仮説

AIDD Control Planeの価値は、AIにコードを書かせることそのものではない。

価値は、AIに頼む前に次を整理することにある。

```text
何を作るか
誰の問題を解くか
何を作らないか
どの状態を検証するか
どの品質ゲートを通すか
```

この質問に答えるだけで、Product Brief、AI Task Packet、検証計画、Codex Promptが生成されれば、SaaSの意味がかなり伝わりやすくなるはずだ。

## 作ったもの

今回は **Project Intake Wizard** を作った。

ユーザーは、次の項目を入力する。

- アプリ名
- アプリ種別
- 対象ユーザー
- 解決したい問題
- 必要な機能
- 作らないもの
- 外部連携
- 状態契約
- 品質ゲート

すると、画面下に次が生成される。

- Product Brief
- AI Task Packet
- Verification Plan
- Codex Prompt
- Readiness Review

## 初期状態

まず、何も入力していない状態。

![AIDD Control Plane MVP 004 初期画面](assets/aidd-control-plane-mvp004-empty.png)

ここでは `empty: 入力待ち` と表示される。

重要なのは、最初から品質ゲートが見えていることだ。

```text
lint
typecheck
test
build
e2e
doctor:aidd
```

AIに頼む前に、何を確認するべきかを隠さない。

## 入力すると、依頼書が生成される

サンプルとして、学習継続アプリ `StudyFlow` を入力した。

![AIDD Control Plane MVP 004 ready状態](assets/aidd-control-plane-mvp004-ready.png)

入力後、状態は `ready: AIへ渡せます` になる。

この時点で、画面にはProduct Brief、AI Task Packet、Verification Plan、Codex Promptが出ている。

つまり、ユーザーはもう「何をAIに渡せばいいか」で迷わない。

## 不足していると、何が足りないか分かる

主要機能を1つだけに減らすと、状態は `insufficient` になる。

![AIDD Control Plane MVP 004 insufficient状態](assets/aidd-control-plane-mvp004-insufficient.png)

ここで出るのは、単なるエラーではない。

```text
主要機能を2件以上
状態契約を2件以上
必要な品質ゲート
```

のように、AIへ渡す前に足りない設計観点が見える。

これがAIDD Control Planeの重要な価値だ。

## 実装で気をつけたこと

今回は外部AI APIを呼んでいない。

理由は、まずSaaSの中心価値を確かめたかったからだ。

```text
ユーザーの粗い入力
  -> 開発ブリーフ
  -> AI依頼書
  -> 検証計画
  -> Codex Prompt
```

この変換が使いやすくなければ、外部AI連携を足しても意味がない。

MVP 004では、まずこの変換をローカルで決定的に動かした。

## 検証結果

今回もCodexに実装させたあと、こちらで独立検証した。

![AIDD Control Plane MVP 004 terminal evidence](assets/aidd-control-plane-mvp004-terminal-evidence.png)

実行したゲートは次の通り。

| command | result |
| --- | --- |
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 5 tests passed |
| `pnpm run build` | pass |
| `pnpm run test:e2e` | 3 tests passed |
| `pnpm run doctor:aidd` | pass |

E2Eでは次を確認した。

```text
初期empty stateが表示される
サンプルアプリを入力するとready stateになり生成結果が表示される
主要機能を削除するとinsufficient stateとmissing fieldsが表示される
```

## 読者がすぐ使えるチェックリスト

AIにアプリ開発を頼む前に、最低限これを埋める。

| 質問 | 何を確認したいのか |
| --- | --- |
| 何を作りたいですか？ | アプリの中心目的 |
| 誰の問題を解決しますか？ | 対象ユーザー |
| その人は何に困っていますか？ | 解決すべき問題 |
| 最初に必要な機能は何ですか？ | MVPの範囲 |
| 作らないものは何ですか？ | scope creep防止 |
| 外部連携はありますか？ | API・認証・データ連携の有無 |
| どの状態を確認しますか？ | empty/loading/error/offlineなど |
| どの品質ゲートを通しますか？ | lint/test/build/E2Eなど |

これを埋めないままAIに頼むと、AIはだいたい「見た目だけそれっぽいもの」を作る。

逆に、ここまで埋めると、AIへの依頼はかなり具体的になる。

## noteで読まれる一次情報としての価値

最近、「noteは一次情報が強い」という話をよく見る。

その意味では、このシリーズはnote向きだと思う。

なぜなら、ここで書いているのはAIで量産した一般論ではなく、実際にCodexを動かして、失敗して、直して、スクリーンショットと検証ログを残した一次情報だからだ。

ただし、これを「誰でもすぐ稼げる」とは言わない。

現実的に価値があるのは、次の形だと思う。

```text
実験した本人しか書けない記録
読者が真似できるチェックリスト
次に使えるテンプレート
```

AIDD Control Planeは、この3つを増やすための道具にできる。

## AIDD-Specへの接続

MVP 004で、AIDD Control Planeは少しSaaSらしくなった。

前回までは、Verification EvidenceやContract Checkerという内部部品を作っていた。  
今回は、ユーザーが最初に触る入口を作った。

流れはこうなる。

```text
Project Intake Wizard
  -> Product Brief
  -> AI Task Packet
  -> Verification Plan
  -> Codex Prompt
  -> Evidence Collector
  -> Review Record
  -> Learning Log
```

この順番なら、初見ユーザーにも意味が伝わりやすい。

## まだ足りないもの

もちろん、これで完成ではない。

足りないものは多い。

- アプリ種別ごとのテンプレート
- 業種別の設計質問
- セキュリティ/アクセシビリティ/性能の深いチェック
- GitHub連携
- CI artifact連携
- 複数プロジェクト管理
- チームレビュー
- 実際のAI API連携

ただ、今回で一番大きな穴は埋まった。

**ユーザーが最初に何をすればいいか** が見えるようになった。

## 次回

次は、MVP 005として **アプリ種別テンプレート** を入れる。

例えば、同じ「アプリを作りたい」でも、必要な質問は違う。

```text
学習アプリ
予約アプリ
EC
社内業務ツール
コンテンツサービス
モバイルアプリ
```

それぞれに必要な設計観点、状態、検証ゲートがある。

MVP 005では、アプリ種別を選ぶだけで、必要な質問と品質ゲートが自動で変わるようにする。

ここまで来ると、AIDD Control Planeは「誰でもベストに近い開発フローと設計ドキュメントを作れるSaaS」に少し近づく。
