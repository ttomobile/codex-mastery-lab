# AIDD Control Plane MVP 018：標準更新候補を「次回AI Task Packet差分」として採用前レビューする

前回のMVP 017では、Review FindingやLearning Logを`Spec Update Proposal Queue`に戻しました。失敗ログをただ眺めるのではなく、「どの標準のどの欄へ戻すか」「次回Codex promptに何を足すか」まで持たせた回です。

今回のMVP 018では、その次の詰まりを扱います。

> 標準更新候補はできた。でも、採用したら次回のAI Task Packetが具体的にどう変わるのかが見えない。

料理でいえば、「次は塩を足す」とメモしただけで、レシピのどの手順に、どれくらい、どんな確認方法で足すのかがまだ分からない状態です。AI駆動開発でも同じで、改善候補はAIへ渡す入力差分に変換できなければ、次回の品質改善につながりにくくなります。

## 読者の悩み

AI開発のふりかえりでは、次のようなメモが残りがちです。

- E2E証跡が足りなかった
- CI artifact保存が浅かった
- doctorコマンドが重要な条件を見ていなかった
- 次回はAI Task Packetに明記したい

しかし、ここで止まると「反省した気分」にはなっても、次回の依頼文はあまり変わりません。

AIDD Control PlaneをSaaSにするなら、改善候補を次回のAI Task Packet差分として見せ、採用前にレビューできる必要があります。つまり、学びを「次の依頼の変更点」として扱う画面です。

## 今回の仮説

今回の仮説は次です。

> Spec Update Proposalから、target packet section、before/after summary、追加acceptance criteria、追加verification command、Codex prompt patch、rollback conditionを持つ差分プレビューを生成できれば、AIDD Control Planeは「学びを標準へ戻す」だけでなく「次回AI依頼を安全に更新する」SaaSに近づく。

AIDD-Spec v0.1では、AI Task Packet、Verification Evidence、Review Record、Learning Log、Spec Improvementを往復させることを重視しています。MVP 018は、その往復のうち`Spec Improvement -> AI Task Packet Delta -> Verification Evidence`を画面化する小さな一歩です。

## 実験内容

`experiments/aidd-control-plane-mvp-018/generated-repo`に、MVP 017を引き継いだNext.js + TypeScriptアプリとして次を追加しました。

- UIセクション：`AI Task Packet Delta Apply Preview`
- empty / valid / failureの状態切替
- Spec Update Proposalから次回AI Task Packet差分を作る純粋関数
- `target packet section`
- `before summary` / `after summary`
- 追加acceptance criteria
- 追加verification commands
- Codex prompt patch
- rollback condition
- review checklist
- 不足項目をfailureとして検出するdoctor / unit / E2E
- `capture:mvp018`による画面証跡生成

MVP 017が「改善候補をQueueに載せる」回だとすれば、MVP 018は「その候補を採用したら、次回AIへの依頼がどう変わるかを確認する」回です。

## 画面キャプチャ

### empty / initial：まだ反映プレビューがない状態

![MVP018 empty state](../assets/aidd-control-plane-mvp018-empty.png)

初期状態では、まだAI Task Packet差分がありません。ここで重要なのは、空の画面でも「次に何を入れる場所なのか」が分かることです。AIDD Control Planeでは、空欄も品質gateの一部として扱います。

### filled / valid：標準更新候補を次回AI Task Packet差分へ変換する

![MVP018 valid state](../assets/aidd-control-plane-mvp018-valid.png)

valid状態では、Spec Update Proposalを採用した場合に、次回AI Task Packetのどの欄がどう変わるかを表示します。

特に今回は、次を同時に見えるようにしました。

- どのproposalが元になったか
- どのpacket sectionへ入るか
- 反映前と反映後の要約
- 追加するacceptance criteria
- 追加するverification command
- Codex prompt patch
- rollback condition
- review checklist

これにより、「改善候補を採用する」と言ったときに、何がAIへの入力へ入るのかを人間が確認できます。

### failure：差分プレビューそのものの不足を検出する

![MVP018 failure state](../assets/aidd-control-plane-mvp018-failure.png)

failure状態では、次の不足を検出します。

- 根拠finding不足
- target packet section不足
- verification command不足
- rollback condition不足

改善差分にも品質があります。根拠がない、入れる場所がない、確認コマンドがない、戻し条件がない状態でAI Task Packetへ採用すると、次回の依頼がかえって曖昧になります。

### terminal evidence：検証ログを画像として残す

![MVP018 terminal evidence](../assets/aidd-control-plane-mvp018-terminal-evidence.png)

terminal evidence画像も保存しました。note記事としては、単なる説明ではなく、実際に動かしたログと画面を残すことで一次情報になります。

## 失敗 / 修正

今回のCodex実装は、途中で同じdiff表示のまま長時間進まなくなりました。そこでCodexプロセスを停止し、生成済みの成果物をHermes側で独立検証しました。

これはAIDD-Specの観点では重要です。AIエージェントの自己申告ではなく、次を分けて確認しました。

- ファイル差分が本当に存在するか
- UI文言が実装されているか
- Unit / E2E / doctorが差分を見ているか
- 3ブラウザE2Eが通るか
- 証跡画像が保存されるか

また、証跡取得時に`pnpm run dev -- --hostname ...`の引数渡しがNext.js側でうまく解釈されませんでした。今回は`pnpm exec next dev -H 127.0.0.1 -p 3014`で開発サーバーを起動し、`pnpm run capture:mvp018`を実行しました。

この失敗もSaaS化の学びです。AIDD Control Planeには、証跡取得前に「対象URLが起動しているか」「起動コマンドが正しいか」を確認するdoctorがあると便利です。

## 検証ログ

独立検証として、Codexの自己申告ではなく次を個別に実行しました。

```text
pnpm install --frozen-lockfile: pass
pnpm run lint: pass
pnpm run typecheck: pass
pnpm run test: pass（31 tests）
pnpm run build: pass
pnpm run test:e2e: pass（Chromium / Firefox / WebKit、39 tests）
pnpm run doctor:aidd: pass
pnpm run capture:mvp018: pass
```

E2Eでは、MVP 018の追加テストを含めて39件が通りました。

```text
AI Task Packet Delta Apply Previewでempty valid failureを切り替え、Codex prompt patchを確認できる
39 passed
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| source proposalがある | どの失敗や学びから来た差分か | 根拠のない改善をAI Task Packetへ混ぜないため |
| target packet sectionがある | どの欄へ反映するか | レビュー時に変更箇所を追えるようにするため |
| before summaryがある | 反映前に何が足りなかったか | 差分の意味を人間が判断するため |
| after summaryがある | 反映後に何が改善されるか | 採用する価値を説明できるようにするため |
| added acceptance criteriaがある | 完了条件に何を足すか | 「直したつもり」を防ぐため |
| added verification commandsがある | 何で確認するか | AIへの依頼が実行証跡につながるため |
| Codex prompt patchがある | 次回AIに追加する依頼文があるか | 学びを実際のAI入力へ戻すため |
| rollback conditionがある | 採用を取り消す条件があるか | 悪い差分を固定化しないため |
| review checklistがある | 人間が採用前に見る観点があるか | 自動生成された差分をそのまま信じないため |

## SaaS / AIDD-Specへの接続

MVP 018で、AIDD Control Planeの改善ループは次の形に近づきました。

```text
Verification Evidence
  -> Review Record
  -> Learning Log
  -> Spec Update Proposal Queue
  -> AI Task Packet Delta Apply Preview
  -> 次回Codex prompt
  -> 次回Verification Evidence
```

AIDD Control Planeは、別のコーディングエージェントを作るSaaSではありません。AIに渡す前後の情報を、誰でも再現できる形に整えるSaaSです。

noteで読まれる記事にするうえでも、ここが強い一次情報になります。AI量産記事ではなく、実際に失敗し、画面を作り、ログを取り、次の標準入力へ戻した記録だからです。

## 次回

次回の改善対象は、差分プレビューをさらに運用に近づけることです。候補は次です。

- Proposalの承認 / 却下 / 保留ステータス
- 採用済み差分と未採用差分の一覧
- AI Task Packet Markdownへの反映プレビュー
- 実ファイル差分の生成前レビュー
- 同じ失敗が複数プロジェクトで起きているかの集計

まずは、AI Task Packet差分に「採用判断」を持たせ、誰が・いつ・なぜ採用したのかをReview Recordとして残すのが自然な次の一歩です。
