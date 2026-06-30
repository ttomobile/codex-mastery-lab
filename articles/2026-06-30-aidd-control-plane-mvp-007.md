# AIDD Control Plane MVP 007：失敗ログを次回のAI依頼書へ戻す Review & Learning Log

> 2026-06-30 / Codex Mastery Lab  
> 対象: AIDD Control Plane SaaS化 / Review Record / Learning Log / AI Task Packet Delta / AIDD-Spec v0.1  
> 結果: **Verification Runの失敗・証跡不足を、Review Findingと次回AI Task Packet Deltaへ自動変換できるようにした**

## 読者の悩み：テスト失敗を「直して」で終わらせると、同じ穴がまた出る

MVP 006では、AI Task Packetと検証ログをつなぐ Verification Run Tracker を作った。これで、lint、typecheck、test、build、E2E、doctor:aiddが未実行なのか、成功なのか、失敗なのか、証跡不足なのかを画面で見られるようになった。

でも、それだけではまだ足りない。

```text
テストが落ちた
  -> どの観点の失敗か分からない
  -> AIには「直して」とだけ頼む
  -> 次回も同じ証跡不足が起きる
```

AI駆動開発では、失敗ログはレシートのようなものだ。捨てるためではなく、次回の買い物メモをよくするために使う。今回のMVP 007では、Verification Run Trackerの結果を Review Record と Learning Log に変換し、次回のAI依頼書へ戻す導線を作った。

## 今回の仮説

今回の仮説はこうだ。

```text
Verification Run Tracker
  -> Review Record
  -> Learning Log
  -> Next AI Task Packet Delta
  -> 次回Codex Prompt
```

この流れが画面で見えれば、AIの失敗を単なる赤い表示ではなく、次の依頼文を改善する材料として扱える。

## 実験内容

Codex CLIを呼び出す予定だったが、このcron実行環境では `codex` コマンドが見つからなかった。そのため、今回は `CODEX_PROMPT.md` を作成したうえで、同じ受け入れ条件を人間側エージェント実装として進め、独立検証を全て実行した。

追加した主な機能は次の通り。

| 追加機能 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| Review Score | 検証結果を点数で見られるか | 「なんとなく良さそう」を避けるため |
| Review Findings | 失敗をカテゴリ、重大度、修正指示に分けられるか | 次のAI依頼に具体的な修正条件を渡すため |
| needed upstream information | どの上流情報が足りなかったか | AIDD-Specテンプレート改善へ戻すため |
| Learning Log | 何が効いて、何が失敗したか | その場限りの修正で終わらせないため |
| Next AI Task Packet Delta | 次回依頼書へ足す文を作れるか | 同じ失敗を繰り返さないため |

## 初期状態：未実行もレビュー対象にする

初期画面では、まだ何も実行していないため Review & Learning Log は fail になる。

![AIDD Control Plane MVP 007 初期画面](assets/aidd-control-plane-mvp007-empty.png)

ここで重要なのは、未実行を空白にしないことだ。MVP 007では、未実行ゲートもReview Findingとして表示する。

```text
lintが未実行
修正指示: pnpm run lintを実行し、terminal evidenceへ保存する
needed upstream information: Test Plan / Verification Evidence
verification command: pnpm run lint
```

初心者向けのSaaSでは、「まだやっていないこと」を目立つ場所に出す必要がある。チェックリストで未チェック項目が見えないと、確認した気になってしまうからだ。

## 成功状態：passでも残リスクと次回改善案を出す

成功サンプルでは、全品質ゲート、3ブラウザE2E、terminal evidence、screenshot evidenceが揃う。Review Scoreは100になり、review passになる。

![AIDD Control Plane MVP 007 ready状態](assets/aidd-control-plane-mvp007-ready.png)

ただし、成功でも何も残さないわけではない。今回の画面では、CI連携前の残リスクや、次回はGitHub Actionsのartifact URLもVerification Evidenceに入れる、という改善案を出す。

これはAIDD Control Planeらしい振る舞いだと思う。合格したら終わりではなく、次にもっと再現性を上げるためのメモを残す。

## failure state：失敗をAI Task Packet Deltaへ変換する

失敗サンプルでは、e2e、doctor:aidd、WebKit E2Eを失敗にした。

![AIDD Control Plane MVP 007 failure状態](assets/aidd-control-plane-mvp007-failure.png)

画面には次のようなReview Findingが出る。

```text
high / 検証: e2eが失敗
修正指示: WebKitで証跡確認に失敗しました。修正後にpnpm run test:e2eを再実行する
needed upstream information: Acceptance Criteria Matrix / Test Plan
verification command: pnpm run test:e2e
```

そして Learning Log は、これを Next AI Task Packet Delta に変換する。

```text
次回のCodex Prompt Delta:
- WebKitで証跡確認に失敗しました。修正後にpnpm run test:e2eを再実行する。
- 修正後はReview RecordとLearning Logを更新し、失敗が次回依頼へ戻ったことを確認する。
```

これにより、「E2E落ちたから直して」ではなく、「どのブラウザで、どの証跡が、どの上流情報不足として失敗したか」を次回のAI依頼に戻せる。

## 証跡不足：コマンド成功でも完了にしない

証跡不足サンプルでは、コマンドは成功しているが、evidence fileやterminal evidenceが不足している状態にした。

![AIDD Control Plane MVP 007 証跡不足状態](assets/aidd-control-plane-mvp007-evidence-missing.png)

AI開発でよくあるのは、最後の報告だけが残り、実行ログやスクリーンショットが残らないことだ。MVP 007では、証跡不足もReview Findingになり、次回のAI Task Packet Deltaに「ログを保存する」条件として戻る。

## 検証ログ

独立検証として、次のコマンドを個別に実行した。

| コマンド | 結果 |
| --- | --- |
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 13 tests passed |
| `pnpm run build` | pass。ただしNext.js ESLint plugin警告あり |
| `pnpm run test:e2e` | 24 passed / Chromium・Firefox・WebKit |
| `pnpm run doctor:aidd` | passed |

![AIDD Control Plane MVP 007 terminal evidence](assets/aidd-control-plane-mvp007-terminal-evidence.png)

Codex CLI自体は `codex: command not found` で実行できなかった。これは今回の制約として記録する。一方で、生成予定だったAI Task Packet、Codex Prompt、実装、検証、記事化、preview更新まではこのcron内で実施した。

## AIDD-Specへの接続

今回のMVP 007で、AIDD-Spec v0.1の次の成果物がSaaS画面上でつながった。

```text
AI Task Packet
  -> Verification Evidence
  -> Review Record
  -> Learning Log
  -> AI Task Packet Delta
```

AIDD-Specの目的は、AIに完璧な一文プロンプトを投げることではない。料理のレシピを改善するように、失敗した手順、足りなかった材料、次回の注意点を残し、次の実行で再現性を上げることだ。

## 読者がすぐ使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| 失敗ログにカテゴリがあるか | 検証失敗、証跡不足、ブラウザ差分などを分ける | 「直して」だけの曖昧な依頼を避けるため |
| 修正指示が具体的か | 何を直し、どのコマンドで再確認するか | AIと人間レビュアーが同じ完了条件を見られるため |
| needed upstream informationがあるか | どの事前情報が足りなかったか | 次回のProduct BriefやTest Planを改善するため |
| Learning Logにwhat failedが残るか | 同じ失敗を再利用可能な知識にする | 失敗をその場限りで消さないため |
| Next AI Task Packet Deltaがあるか | 次回依頼へ足す文が生成されているか | AI駆動開発の品質を回ごとに上げるため |

## SaaS化への接続

AIDD Control Planeは、単なるコード生成SaaSではない。今回のMVPで、次の価値が少し見えた。

- AIの実行結果を採点する
- 失敗をReview Findingに分類する
- 失敗から必要な上流情報を推定する
- 次回のAI Task Packet Deltaを作る
- Learning LogをAIDD-Spec改善へ戻す

noteで読まれる記事にするなら、AIが量産した一般論よりも、こうした実験ログ、スクリーンショット、失敗、修正、検証結果のほうが強い。実験した本人しか書けない一次情報だからだ。

## まとめと次回

MVP 007では、Verification Run Trackerの結果を Review Record / Learning Log / Next AI Task Packet Delta へつなげた。

今回の学びは次の通り。

- 検証失敗は、画面に出すだけでは足りない
- 失敗には、修正指示、必要な上流情報、再検証コマンドが必要
- 成功時も残リスクと次回改善案を出すと、SaaSの価値が伝わりやすい
- Codex CLIが実行できない環境制約も、証跡として残すべき一次情報になる

次回は、実ファイルとして保存されたterminal evidenceやscreenshot evidenceをSaaS側が存在確認し、artifact URLやCI結果と結びつける方向へ進めたい。
