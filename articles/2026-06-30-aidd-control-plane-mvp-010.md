# AIDD Control Plane MVP 010：CIのURLから「何を取りに行くべきか」まで見える化する GitHub Actions Artifact Fetch Plan

> 2026-06-30 / Codex Mastery Lab  
> 対象: AIDD Control Plane SaaS化 / GitHub Actions / Verification Evidence / AIDD-Spec v0.1  
> 結果: **GitHub Actions run URLからowner、repo、run id、API endpoint、token scope、必要artifactを確認する画面を追加した**

## 読者の悩み：CIのURLを貼っても、証拠の取り方が曖昧なまま残る

AIに実装を頼むと、最後に「CIが通りました」と報告されることがある。MVP 009では、その報告をcommit SHA、workflow、job、artifact、Playwright report URLへ分解するCI Artifact Importerを作った。

ただ、まだ手入力だった。つまり次の疑問が残る。

- GitHub Actionsのrun URLから、どのリポジトリとrun idを見ればよいのか
- jobs一覧はどのendpointから取るのか
- artifacts一覧はどのendpointから取るのか
- logsはどこから取るのか
- tokenにはどの権限が必要なのか
- coverage / playwright-report / test-results / terminal-evidenceを本当に取りに行く計画になっているか

「CI URLを貼る」だけでは、検査票を探す場所がまだ曖昧だ。MVP 010では、URLから証跡取得計画を作る入口を追加した。

## 今回の仮説

今回の仮説はこうだ。

```text
GitHub Actions run URL
  -> owner / repo / run id
  -> jobs API / artifacts API / logs URL
  -> token scopes
  -> required artifacts
  -> Verification Evidence
  -> Review Record / Learning Log / Next AI Task Packet Delta
```

AIDD Control Planeがrun URLを「リンク」ではなく「証跡取得計画」として扱えれば、AIのCI成功報告を後から追える一次情報に近づけられる。

## 実験内容

`experiments/aidd-control-plane-mvp-010/generated-repo` に、Next.js + TypeScript + pnpmのMVPを作った。MVP 009のProject Intake Wizard / Verification Run Tracker / Artifact Evidence Binder / CI Artifact Importerを残し、その中にGitHub Actions Artifact Fetch Planを追加した。

今回追加した主な機能は次の通り。

| 追加機能 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| run URL parser | owner / repo / run idが抽出できるか | CI証跡を同じ実行単位に結びつけるため |
| API endpoint表示 | jobs / artifacts / logsの取得先が分かるか | 「どこを見たのか」をレビュー可能にするため |
| token scope確認 | actions:read / contents:readが揃うか | 権限不足で証跡取得が止まるのを事前に見つけるため |
| required artifacts確認 | coverage / playwright-report / test-results / terminal-evidenceを取りに行く計画か | CI成功だけでなく、後から開ける証跡を残すため |
| failure state | run id不足、token不足、artifact取得計画不足を出せるか | 次回AI依頼へ具体的に戻すため |

## 初期状態：URL未入力をemptyとして見せる

初期状態では、GitHub Actions run URLがまだない。画面ではArtifact Evidence BinderとCI Artifact Importerがemptyになり、GitHub Actions Artifact Fetch Planも未生成として見える。

![AIDD Control Plane MVP 010 初期画面](assets/aidd-control-plane-mvp010-empty.png)

初心者向けのSaaSでは、空欄をただ空欄にしないことが大事だ。「何が足りないか」を画面が教える必要がある。

## valid状態：run URLから取得計画まで見える

validサンプルでは、GitHub Actions run URLから次を表示する。

- owner
- repo
- run id
- run summary URL
- jobs API endpoint
- artifacts API endpoint
- logs URL
- actions:read / contents:read
- coverage / playwright-report / test-results / terminal-evidence

![AIDD Control Plane MVP 010 valid状態](assets/aidd-control-plane-mvp010-valid.png)

ここで重要なのは、CI成功を「緑のチェック」だけで扱わないことだ。

```text
CIが緑だった
  !=
どのrunから、どのjobとartifactを、どの権限で取得するか説明できる
```

AIDD-SpecのVerification Evidenceとして扱うなら、CI run、job、artifact、log、reportを同じ検証単位に束ねる必要がある。

## failure state：run id不足、権限不足、artifact不足を次回依頼へ戻す

failureサンプルでは、あえて次の問題を入れた。

- CI run URLが壊れている
- run idが抽出できない
- actions:read token scopeが不足
- playwright-report / terminal-evidenceの取得計画が不足
- commit SHAが短い
- test jobが失敗
- build jobが未実行

![AIDD Control Plane MVP 010 failure状態](assets/aidd-control-plane-mvp010-failure.png)

これらはReview Findingになり、Next AI Task Packet Deltaへ戻る。次回AIへは「CIも確認して」ではなく、次のように頼める。

```text
GitHub Actions run URLからowner / repo / run idを抽出し、
jobs API、artifacts API、logs URL、actions:read、contents:read、
coverage / playwright-report / test-results / terminal-evidenceを
Verification Evidenceとして束ねる。
```

## 検証ログ

独立検証として、次のコマンドを個別に実行し、`experiments/aidd-control-plane-mvp-010/artifacts/terminal/` に保存した。

| コマンド | 結果 |
| --- | --- |
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 20 tests passed |
| `pnpm run build` | pass。ただしNext.js ESLint plugin警告あり |
| `pnpm run test:e2e` | 24 passed / Chromium・Firefox・WebKit |
| `pnpm run doctor:aidd` | passed |

![AIDD Control Plane MVP 010 terminal evidence](assets/aidd-control-plane-mvp010-terminal-evidence.png)

## 失敗と修正

今回の失敗は3つあった。

1つ目は、Codex CLIがこの環境で見つからず、`codex: command not found` になったこと。これはMVP 009と同じ制約で、今回も証跡として扱い、実装後は独立検証で品質を確認した。

2つ目は、最初のGitHub Actions URL例が `owner/repo/actions/runs/id` の形になっておらず、validサンプルがfailureになったこと。URL例を `owner/repo/actions/runs/id` の形へ直し、unit testでowner / repo / run idを確認した。

3つ目は、Playwright E2Eで `playwright-report` が2箇所に表示され、strict modeで失敗したこと。これはテストが曖昧だったので、`.first()`で意図した可視要素を確認する形へ修正した。

## AIDD-Specへの接続

AIDD-Spec v0.1では、AI Task PacketだけでなくVerification Evidence / Review Record / Learning Logを一連の成果物として扱う。MVP 010は、CI由来のVerification Evidenceに「取得計画」を追加した。

| AIDD-Spec要素 | MVP 010での具体化 |
| --- | --- |
| Verification Evidence | GitHub Actions run URL、owner、repo、run id、API endpoint、token scope、required artifacts |
| Review Record | run id不足、token scope不足、artifact取得計画不足をfinding化 |
| Learning Log | 次回AI Task Packet Deltaへ証跡取得経路の不足を戻す |
| AI Task Packet | GitHub Actions Artifact Fetch Planの必須項目をpromptへ含める |

## SaaSへの接続

AIDD Control Planeは、別のコーディングエージェントを作るだけではない。AIに渡す前の依頼、実行後の証跡、レビュー、次回改善をつなぐSaaSにする。

MVP 010で見えた価値は次の通り。

- CI URLを貼ったあとに、何を取得すべきかが分かる
- GitHub API連携前でも、必要なendpointと権限を説明できる
- artifact不足を品質スコアに反映できる
- 次回AI依頼が「CIを見て」から「このendpointとartifactを確認して」へ具体化する

## 読者がすぐ使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| run URLが `owner/repo/actions/runs/id` 形式か | owner / repo / run idを抽出できるか | CI証跡を同じ実行単位に結びつけるため |
| jobs API endpointが残っているか | job結果を後から確認できるか | 一部jobだけ成功した状態を見逃さないため |
| artifacts API endpointが残っているか | artifact一覧を取得できるか | coverageやPlaywright reportを後から開けるようにするため |
| actions:read / contents:readが明示されているか | token権限が足りるか | 証跡取得が権限不足で止まるのを避けるため |
| required artifactsが4種類あるか | coverage / playwright-report / test-results / terminal-evidenceが揃うか | 第三者レビューに必要なため |
| failureがNext AI Task Packet Deltaへ戻るか | 次回依頼が具体化されるか | 同じ失敗を繰り返さないため |

## まとめと次回

MVP 010では、GitHub Actions Artifact Fetch Planを追加し、CI run URLからowner、repo、run id、jobs API、artifacts API、logs URL、token scope、required artifactsを確認できるようにした。

次回は、今回まだ「取得計画」に留めたGitHub Actions情報を、実run URLやartifact一覧の貼り付けデータから取り込む方向へ進める。AIDD Control Planeを「誰でもベストに近いAI駆動開発フローと設計ドキュメントを作れるSaaS」に近づけるには、証跡の保存だけでなく、証跡の取得・検証・次回改善への戻し方を標準化する必要がある。
