# AIDD Control Plane MVP 009：CIの「通りました」を証拠に変える CI Artifact Importer

> 2026-06-30 / Codex Mastery Lab  
> 対象: AIDD Control Plane SaaS化 / CI Artifact / Verification Evidence / AIDD-Spec v0.1  
> 結果: **CI run、commit SHA、workflow、job、artifact、Playwright reportをVerification Evidenceへ取り込む画面を追加した**

## 読者の悩み：CI成功のスクショだけでは、あとから追えない

AIに実装を頼むと、最後に「CIも通りました」と書かれることがある。けれど、次の情報が揃っていないと、第三者は同じ判断を再確認できない。

- どのcommitで通ったのか
- どのworkflowを実行したのか
- lint / typecheck / test / build / e2e / doctor:aidd のjobは全部成功したのか
- coverage、playwright-report、test-results、terminal-evidenceのartifactは残ったのか
- Playwright report URLは後から開けるのか

これは「検査済み」とだけ書いたメモを残して、検査票とレシートを捨ててしまう状態に近い。MVP 008ではArtifact Evidence Binderを作った。MVP 009では、そのBinderへCI結果を取り込む入口を追加した。

## 今回の仮説

今回の仮説はこうだ。

```text
CI run summary
  -> commit SHA
  -> workflow / jobs
  -> coverage / playwright-report / test-results / terminal-evidence
  -> CI Artifact Importer
  -> Artifact Evidence Binder
  -> Review Record / Learning Log / Next AI Task Packet Delta
```

AIDD Control PlaneがCI結果を「URLの羅列」ではなく、検証単位として取り込めれば、AIの完了報告をレビュー可能な一次情報に変えられる。

## 実験内容

`experiments/aidd-control-plane-mvp-009/generated-repo` にNext.js + TypeScript + pnpmのMVPを作り、既存のProject Intake Wizard / Verification Run Tracker / Artifact Evidence BinderへCI Artifact Importerを追加した。

今回追加した主な機能は次の通り。

| 追加機能 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| CI Artifact Importer | commit SHA、workflow、job、artifactが揃うか | 「CI成功」の再確認に必要な情報を固定するため |
| empty / valid / failure切替 | 未登録、成功、壊れたCI証跡を見分けられるか | SaaSデモで不足を説明しやすくするため |
| commit SHA検証 | 短いSHAを成功証拠として扱っていないか | どの実装に対するCIか追跡するため |
| job検証 | lint/typecheck/test/build/e2e/doctor:aiddが全部成功したか | 一部jobだけ成功しても完了扱いにしないため |
| artifact検証 | coverage/playwright-report/test-results/terminal-evidenceが残ったか | 後から開ける証跡を残すため |

## 初期状態：CI証跡未登録を見える化する

初期状態では、CI run summaryがまだ登録されていない。画面ではArtifact Evidence Binderがemptyになり、CI Artifact Importerもemptyとして表示される。

![AIDD Control Plane MVP 009 初期画面](assets/aidd-control-plane-mvp009-empty.png)

空欄を空欄のままにしないことが重要だ。初心者向けの開発SaaSでは「何が足りないか」を画面が教える必要がある。

## valid状態：CI成功をcommitとartifactまで束ねる

validサンプルでは、run URL、commit SHA、workflow、6つの品質ゲートjob、4種類のartifact、Playwright report URLが揃う。

![AIDD Control Plane MVP 009 valid状態](assets/aidd-control-plane-mvp009-valid.png)

ここで大事なのは、CI成功を1つの緑チェックで終わらせないことだ。

```text
CIが緑だった
  !=
どのcommitで、どのjobが通り、どのartifactが残ったかを説明できる
```

AIDD-SpecのVerification Evidenceとして扱うなら、commit・job・artifact・reportを同じ検証単位に束ねる必要がある。

## failure state：短いSHA、失敗job、不足artifactを次回依頼へ戻す

failureサンプルでは、あえて次の問題を入れた。

- commit SHAが `abc123` で短すぎる
- CI run URLが壊れている
- test jobが失敗
- build jobが未実行
- playwright-report / test-results / terminal-evidence artifactが不足
- Playwright report URLが壊れている

![AIDD Control Plane MVP 009 failure状態](assets/aidd-control-plane-mvp009-failure.png)

これらはReview Findingになり、Next AI Task Packet Deltaへ戻る。つまり、次回AIへ「CIも確認して」ではなく、次のように具体的に頼める。

```text
commit SHA、workflow、job、artifact、Playwright report URLを同じ実行単位で束ねる。
失敗jobを修正し、pnpm run test:e2e && pnpm run doctor:aidd で再確認する。
```

## 検証ログ

独立検証として、次のコマンドを個別に実行し、`experiments/aidd-control-plane-mvp-009/artifacts/terminal/` に保存した。

| コマンド | 結果 |
| --- | --- |
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 18 tests passed |
| `pnpm run build` | pass。ただしNext.js ESLint plugin警告あり |
| `pnpm run test:e2e` | 24 passed / Chromium・Firefox・WebKit |
| `pnpm run doctor:aidd` | passed |

![AIDD Control Plane MVP 009 terminal evidence](assets/aidd-control-plane-mvp009-terminal-evidence.png)

## 失敗と修正

今回の失敗は2つあった。

1つ目は、Codex CLIがこの環境で見つからず、`codex: command not found` になったこと。今回はその事実を証跡として残し、実装は自律的に進めた。Codexの自己申告に頼らず、独立検証で品質を確認した。

2つ目は、最初のE2EでPlaywrightのbaseURLがサニタイズ用の仮ホスト名のまま残り、webServer待機がtimeoutしたこと。その後ループバックアドレスに修正し、さらにstrict modeで曖昧だったlocatorを直して、3ブラウザ24件を通した。

## AIDD-Specへの接続

AIDD-Spec v0.1では、AI Task PacketだけでなくVerification Evidence / Review Record / Learning Logを一連の成果物として扱う。MVP 009は、そのうちCI由来のVerification EvidenceをSaaS画面に落とした。

今回の標準更新は次の通り。

| AIDD-Spec要素 | MVP 009での具体化 |
| --- | --- |
| Verification Evidence | CI run URL、commit SHA、job、artifact、Playwright report URL |
| Review Record | 短いSHA、失敗job、不足artifactをfinding化 |
| Learning Log | 次回AI Task Packet DeltaへCI証跡不足を戻す |
| AI Task Packet | CI Artifact Importerの必須項目をpromptへ含める |

## SaaSへの接続

AIDD Control Planeは、別のコーディングエージェントを作るだけではない。AIに渡す前の依頼、実行後の証跡、レビュー、次回改善をつなぐSaaSにする。

MVP 009で見えた価値は次の通り。

- CI成功報告をcommit単位で追える
- job単位で「何が失敗したか」を説明できる
- artifact不足を品質スコアに反映できる
- 次回AI依頼が具体的になる

## 読者がすぐ使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| commit SHAが40文字で残っているか | どの実装に対するCIか | 後から差分を追うため |
| workflow名が残っているか | どのCI定義を使ったか | 手元実行とCI実行を分けるため |
| 全品質ゲートjobが成功しているか | 一部だけ通っていないか | 片手落ちの成功報告を防ぐため |
| coverage / playwright-report / test-results / terminal-evidenceがあるか | 証跡が開けるか | 第三者レビューに必要なため |
| Playwright report URLが有効か | E2Eの詳細を見られるか | 失敗時の原因調査に必要なため |
| failureがNext AI Task Packet Deltaへ戻るか | 次回依頼が具体化されるか | 同じ失敗を繰り返さないため |

## まとめと次回

MVP 009では、CI Artifact Importerを追加し、CI run、commit SHA、workflow、job、artifact、Playwright reportをVerification Evidenceへ取り込めるようにした。

次回は、今回まだ手入力/サンプル入力に留めたCI情報を、GitHub Actionsの実run URLやartifact一覧から取り込む方向へ進める。AIDD Control Planeを「誰でもベストに近いAI駆動開発フローと設計ドキュメントを作れるSaaS」に近づけるには、証跡の保存だけでなく、証跡の取得経路も標準化する必要がある。
