# AIDD Control Plane MVP 020：採用した改善だけを次回AI Task Packet Markdownへ書き出す

MVP 019では、AI Task Packet Deltaを「採用 / 却下 / 保留」に分け、誰が・なぜ判断したのかをReview Recordとして残しました。

## 読者の悩み

今回の詰まりは、その一歩先です。

> 採用すると決めた改善はある。でも、次回Codexへ渡すAI Task Packetに、実際どのMarkdownを足せばよいのか分からない。

AI駆動開発では、失敗から学んだことを次回依頼へ戻すのが大事です。ただし、「採用した改善」「却下した改善」「まだ保留中の改善」を同じ依頼文へ混ぜると、AIはどれを守るべきか判断できません。

料理のメモでいえば、「次回から必ず入れる材料」と「今回は入れない材料」と「まだ試食待ちの材料」が同じ買い物リストに入っている状態です。買い物リストに載せるのは、次に本当に使う材料だけでよいはずです。

## 今回の仮説

今回の仮説は次です。

> 採用済みdeltaだけをAI Task Packet Markdown / Verification Plan / Codex promptへ書き出し、却下・保留deltaをLearning Logへ戻せば、AIDD Control Planeは「改善判断」から「次回AI依頼の実入力生成」へ進める。

AIDD-Spec v0.1では、AI Task Packet、Verification Evidence、Review Record、Learning Log、Spec Improvementを往復させます。MVP 020は、この往復のうち `Delta Decision Review -> Adopted Delta Markdown Exporter -> 次回AI Task Packet` を画面化する回です。

## 実験内容

`experiments/aidd-control-plane-mvp-020/generated-repo` に、MVP 019を引き継いだNext.js + TypeScriptアプリとして次を追加しました。

- UIセクション：`Adopted Delta Markdown Exporter`
- empty / valid / failureの状態切替
- 採用済みdeltaだけをMarkdown exportへ含める
- Verification Plan追記、Codex prompt追記、rollback condition、review evidenceを表示
- 却下 / 保留deltaをLearning Log戻し対象として別表示
- Markdown section不足、verification command不足、rollback condition不足、review evidence不足、未採用delta混入の検出
- Unit / E2E / doctor / capture script

Codex CLIは今回も `codex: command not found` で実行できませんでした。そのため、Codex実装ステップの失敗ログを証跡として残し、Hermes側で実装と独立検証を行いました。

## 画面キャプチャ

### empty / initial：まだ書き出す採用済みdeltaがない

![MVP020 empty state](../assets/aidd-control-plane-mvp020-empty.png)

empty状態では、まだMarkdownへ書き出す採用済みdeltaがありません。空の画面にも「ここは次回AI Task Packetの差分を作る場所だ」と分かる説明を置きました。

### filled / valid：採用済みdeltaだけをMarkdownへ入れる

![MVP020 valid state](../assets/aidd-control-plane-mvp020-valid.png)

valid状態では、採用済みの `delta-mvp019-001` だけがMarkdown exportへ入ります。一方、保留の `delta-mvp019-002` と却下の `delta-mvp019-003` はLearning Logへ戻します。

ここが今回の重要点です。AIDD Control Planeは「学びを全部AIに投げるSaaS」ではなく、「次回依頼へ入れてよい学びだけを選び、検証コマンドつきで渡すSaaS」です。

### failure：未採用delta混入と証跡不足を検出する

![MVP020 failure state](../assets/aidd-control-plane-mvp020-failure.png)

failure状態では、次を検出します。

- Markdown section不足
- verification command不足
- rollback condition不足
- review evidence不足
- 未採用deltaの混入

「採用済みdeltaだけ」と言いながら却下deltaが混ざると、次回AI依頼はまた曖昧になります。MVP 020では、その混入をUIとE2Eで検出しました。

### terminal evidence：検証ログを画像として残す

![MVP020 terminal evidence](../assets/aidd-control-plane-mvp020-terminal-evidence.png)

terminal evidence画像も保存しました。note記事としては、説明よりも「実際に動かしたログ」が一次情報になります。

## 失敗 / 修正

今回の失敗は2つです。

1つ目は、Codex CLIが使えず、`codex exec --sandbox danger-full-access` が `command not found` になったことです。これは環境上の制約として `artifacts/terminal/00-codex-exec.txt` に残しました。

2つ目は、最初のE2Eで `delta-mvp019-002: deferred` が画面上に2箇所あり、Playwright strict modeで失敗したことです。修正では、単なる文字列検索ではなく、Learning Log戻し対象の `listitem` に絞って確認しました。

この失敗はAIDD Control Planeらしい学びです。「それっぽい文言がある」ではなく、「どの場所の、どのdeltaを見ているか」までテストで固定する必要があります。

## 検証ログ

独立検証として、次を個別に実行しました。

```text
pnpm install --frozen-lockfile: pass
pnpm run lint: pass
pnpm run typecheck: pass
pnpm run test: pass（37 tests）
pnpm run build: pass
pnpm run mock:doctor: pass
pnpm run test:e2e: pass（Chromium / Firefox / WebKit、45 tests）
pnpm run doctor:aidd: pass
pnpm run capture:mvp020: pass
```

E2Eは3ブラウザで45件通りました。

```text
Adopted Delta Markdown Exporterで採用済みdeltaだけをMarkdownへ書き出せる
45 passed
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| 採用済みdeltaだけを含む | Markdown exportに採用deltaだけが入るか | 却下・保留の改善を次回AI依頼へ混ぜないため |
| verification commandがある | 次回も同じ確認を実行できるか | 改善が雰囲気ではなく検証につながるため |
| rollback conditionがある | 失敗時に戻せるか | 悪いルールを固定化しないため |
| review evidenceがある | どのログやfindingから来た改善か | 根拠のない追記を防ぐため |
| Learning Log戻しがある | 却下・保留deltaが消えずに残るか | 後で再検討できるようにするため |
| 未採用delta混入を検出する | exportに不要なdeltaが入っていないか | AI Task Packetを迷わせないため |

## AIDD-Spec / AIDD Control Plane SaaSへの接続

MVP 020で、AIDD Control Planeの改善ループは次の形に近づきました。

```text
Verification Evidence
  -> Review Record
  -> Learning Log
  -> Spec Update Proposal Queue
  -> AI Task Packet Delta Apply Preview
  -> Delta Decision Review
  -> Adopted Delta Markdown Exporter
  -> 次回AI Task Packet / Codex prompt
```

AIDD Control Planeは、別のコーディングエージェントを作るSaaSではありません。AIへ渡す前後の情報を、誰でも再現できる形に整えるSaaSです。

noteで読まれる記事にするうえでも、このような一次情報は強いはずです。AI量産記事ではなく、実際に失敗し、画面を作り、E2Eで落ち、修正し、スクリーンショットとログを残した記録だからです。

## 次回

次回の自然な改善対象は、書き出したMarkdown差分をファイルとして保存し、次回AI Task Packet / CODEX_PROMPTへ反映するところです。

候補は次です。

- adopted delta exportをMarkdownファイルとして保存する
- before / afterのAI Task Packet差分を比較する
- CODEX_PROMPT.mdへの追記案を生成する
- 却下 / 保留deltaをLearning Logファイルへ戻す
- 複数プロジェクトで採用されたdeltaを一覧化する

まずは、今回のMarkdown exportを「画面で見える」だけでなく、「次回依頼ファイルに安全に反映する」段階へ進めるのがよさそうです。
