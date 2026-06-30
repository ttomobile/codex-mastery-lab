# AIDD Control Plane MVP 008：テスト結果を「証拠つき」にする Artifact Evidence Binder

> 2026-06-30 / Codex Mastery Lab  
> 対象: AIDD Control Plane SaaS化 / Verification Evidence / CI artifact / Playwright report / AIDD-Spec v0.1  
> 結果: **terminal log、screenshot、CI run URL、artifact URL、Playwright report URLを同じ検証単位として束ねる画面を追加した**

## 読者の悩み：テストが通った報告だけでは、あとから確認できない

AIに実装を頼むと、最後にこういう報告が返ってくることがある。

```text
lint、typecheck、test、build、E2Eはすべて通りました。
```

もちろん本当に通っていれば良い。でも、数日後に見返したときに、ログファイル、スクリーンショット、CI artifact、Playwright report が残っていないと、第三者は確認できない。これは家計簿で「今月は大丈夫」とだけ書いて、レシートを捨ててしまう状態に近い。

MVP 007では、失敗ログを Review Record / Learning Log / Next AI Task Packet Delta へ戻した。MVP 008では、その前提になる「証拠の束ね方」を作った。

## 今回の仮説

今回の仮説はこうだ。

```text
品質ゲートの実行結果
  -> terminal evidence
  -> screenshot evidence
  -> CI run URL
  -> CI artifact URL
  -> Playwright report URL
  -> Artifact Evidence Binder
  -> Review Record / Learning Log
```

AIDD Control Planeが単なるチェックリストではなく、検証証跡の置き場所まで扱えば、AIの「通りました」報告をあとから確認できる一次情報に変えられる。

## 実験内容

今回も `experiments/aidd-control-plane-mvp-008/generated-repo` に Next.js + TypeScript + pnpm のMVPを作り、Codex CLIで実装させたあと、こちらで独立検証した。

追加した主な機能は次の通り。

| 追加機能 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| Artifact Evidence Binder | terminal log、画像、CI URL、report URLが同じ実行単位で揃うか | 「テストは通ったらしい」を証拠つきにするため |
| empty / valid / failure 切替 | 証跡なし、証跡あり、壊れた証跡を見分けられるか | SaaSデモで品質状態を説明しやすくするため |
| URL形式チェック | CI run URL、artifact URL、Playwright report URLが壊れていないか | 後からクリックして確認できる証跡にするため |
| 古いログ検出 | generatedAtが古すぎないか | 前回のログを今回の成功証拠として使わないため |
| Review Finding連携 | 不足証跡を修正指示へ変換できるか | 次回のAI Task Packetへ戻すため |

## 初期状態：証跡なしを空白にしない

初期状態では、まだterminal evidenceもscreenshot evidenceもCI URLも登録されていない。画面では `Artifact Evidence Binder: empty` として表示し、どの証跡が足りないかを明示する。

![AIDD Control Plane MVP 008 初期画面](assets/aidd-control-plane-mvp008-empty.png)

ここで大事なのは、未登録を「何も表示しない」にしないことだ。初心者向けの開発SaaSでは、空欄は見落とされやすい。だから、empty stateそのものをレビュー対象にしている。

## valid状態：テスト成功と証跡確認済みは別に見る

validサンプルでは、lint、typecheck、test、build、e2e、doctor:aidd、3ブラウザE2Eに加えて、terminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLが揃う。

![AIDD Control Plane MVP 008 valid状態](assets/aidd-control-plane-mvp008-valid.png)

ポイントは、品質ゲートの成功と、証跡Binderのvalidを分けたことだ。

```text
テストが成功した
  !=
証跡が後から確認できる形で保存されている
```

AIDD-SpecでVerification Evidenceを重視するなら、この2つは分けて見える必要がある。

## failure state：壊れたURLと古いログをReview Findingへ戻す

failureサンプルでは、あえて次の問題を入れた。

- CI run URL が `not-a-ci-url`
- CI artifact URL が未登録
- Playwright report URL が壊れている
- screenshot evidence が未登録
- terminal evidence が古いログ扱い

![AIDD Control Plane MVP 008 failure状態](assets/aidd-control-plane-mvp008-failure.png)

画面では、これらがReview Findingになり、Next AI Task Packet Deltaへ戻る。

```text
CI run URLが壊れていますを修正し、terminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを同じ実行単位で束ねる
```

これにより、AIへの次回依頼が「証拠も残して」ではなく、「どの証拠が壊れていて、どこへ保存し、どのコマンドで再確認するか」まで具体化される。

## 検証ログ

独立検証として、次のコマンドを個別に実行し、`experiments/aidd-control-plane-mvp-008/artifacts/terminal/` に保存した。

| コマンド | 結果 |
| --- | --- |
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 16 tests passed |
| `pnpm run build` | pass。ただしNext.js ESLint plugin警告あり |
| `pnpm run test:e2e` | 24 passed / Chromium・Firefox・WebKit |
| `pnpm run doctor:aidd` | passed |

![AIDD Control Plane MVP 008 terminal evidence](assets/aidd-control-plane-mvp008-terminal-evidence.png)

Codex CLIは今回は実行できた。実装後の自己申告ではなく、こちらで上記コマンドを個別に再実行して確認した。

## 失敗と修正

大きな機能失敗はなかったが、注意点は2つあった。

1つ目は、build時にNext.js ESLint pluginの警告が出たこと。buildは成功しているが、品質スコアとしては警告を無視しない。今後のMVPでESLint設定も整理する余地がある。

2つ目は、CI URLはまだ実API連携ではなくサンプルURLであること。今回は「URL形式とBinder設計」までをMVP範囲にした。次に進むなら、GitHub Actionsの実run URLやartifact URLを取り込むところが自然だ。

## AIDD-Specへの接続

AIDD-Spec v0.1では、AI Task Packetだけでなく Verification Evidence / Review Record / Learning Log を一連の成果物として扱う。MVP 008は、そのうち Verification Evidence をSaaS画面で具体化した。

```text
AI Task Packet
  -> 実装
  -> Verification Evidence
     - terminal evidence
     - screenshot evidence
     - CI artifact
     - Playwright report
  -> Review Record
  -> Learning Log
```

これは、AIに渡す依頼書を良くするだけでは足りない、という学びでもある。実行後に何を残すかまで決めておかないと、レビュー可能な開発フローにならない。

## 読者がすぐ使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| terminal logを保存したか | lint/typecheck/test/build/e2eの実行結果が残っているか | あとから本当に実行したか確認するため |
| screenshotを保存したか | empty/valid/failureなど画面状態が残っているか | UIの状態設計を文章だけにしないため |
| CI run URLがあるか | GitHub Actionsなどの実行単位へ辿れるか | ローカル成功だけで完了扱いにしないため |
| CI artifact URLがあるか | coverageやPlaywright reportなどを取得できるか | 証跡を第三者レビュー可能にするため |
| report URLが壊れていないか | Playwright HTML reportなどを開けるか | E2Eの詳細を後から追えるようにするため |
| 古いログを使っていないか | 今回の実行ログかどうか | 前回の成功を今回の成功と誤認しないため |
| 不足証跡がAI Task Packet Deltaへ戻るか | 次回依頼に修正条件が入るか | 同じ証跡不足を繰り返さないため |

## SaaS化への接続

AIDD Control Planeは、コードを書くAIを置き換えるSaaSではない。むしろ、AIに渡す前の依頼書、AIが返した後の検証証跡、レビュー記録、次回改善をつなぐ場所だ。

MVP 008で見えた価値は次の通り。

- 「通りました」報告を証跡つきにする
- terminal logとスクリーンショットを同じ実行単位で扱う
- CI artifactやPlaywright reportのURLをVerification Evidenceへ入れる
- 壊れた証跡をReview Findingにする
- 不足証跡を次回AI Task Packet Deltaへ戻す

noteで読まれる一次情報としても、こうした画面、ログ、警告、制約が残っていることが重要だ。AI量産記事ではなく、実際に作って検証した人だけが書ける材料になる。

## まとめと次回

MVP 008では、Artifact Evidence Binderを追加し、terminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを束ねられるようにした。

今回の学びは次の通り。

- テスト成功と証跡確認済みは別の状態として扱うべき
- empty stateもレビュー対象にすると、証跡不足を見落としにくい
- 壊れたURLや古いログもReview Findingにできる
- Verification Evidenceは、AI駆動開発の再現性を支える中心成果物になる

次回は、サンプルURLではなくGitHub Actionsの実行結果やartifactを取り込む方向へ進めたい。
