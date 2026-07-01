# AIDD Control Plane MVP 012：CI run URLを貼った後の「証跡が取れたか」をmockで判断する

> 2026-07-01 / Codex Mastery Lab  
> 対象: AIDD Control Plane SaaS化 / Mock CI Evidence Connector / Verification Evidence / AIDD-Spec v0.1  
> 結果: **GitHub Actions風のCI run URLから、証跡取得のempty / valid / failure / timeoutを切り替えるMock CI Evidence Connectorを追加し、3ブラウザE2Eで確認した**

## 読者の悩み：CIのURLを貼っても、次に何を確認すべきか分からない

AI駆動開発では、最後に「CIが通りました」と報告されることが多い。けれど、note記事やレビューで本当に必要なのは、CIの成功ラベルだけではない。

たとえば次のような確認が残る。

- coverage artifactは保存されているか
- Playwright HTML reportを後から開けるか
- test-resultsやtraceは残っているか
- terminal evidenceは同じ実行単位に紐づいているか
- empty / valid / failureの画面キャプチャはあるか
- CI取得がタイムアウトした時に、手動で証跡を束ねる逃げ道があるか

MVP 011では、不足証跡を次回AI Task Packet差分へ戻すEvidence Gap Repair Plannerを作った。MVP 012では、その一歩手前として、**CI run URLを貼った後に、証跡取得が成功したのか、不足したのか、タイムアウトしたのかをUI上で判断する入口**を追加した。

## 今回の仮説

今回の仮説はこうだ。

```text
CI run URL
  -> owner / repo / run idの抽出
  -> jobs / artifacts / logsの取得計画
  -> 必須artifactの有無判定
  -> 不足またはtimeout時の修正指示
  -> Evidence Gap Repair Planner / AI Task Packet Deltaへ戻す
```

実GitHub APIにいきなり接続すると、token、権限、ネットワーク、artifact zip展開などの変数が増える。そこで今回は、料理の下ごしらえのように、まずローカルmockで「何が揃ったらOKか」「何が欠けたら修正依頼にするか」を固定した。

## 実験内容

`experiments/aidd-control-plane-mvp-012/generated-repo` に、Next.js + TypeScript + pnpmのMVPを追加した。前回までのProject Intake Wizard、Verification Run Tracker、Artifact Evidence Binder、CI Artifact Importer、GitHub Actions Artifact Fetch Plan、Evidence Gap Repair Plannerは残し、画面上部に **Mock CI Evidence Connector** を追加した。

今回のUIでは、次の4状態をボタンで切り替えられる。

| 状態 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| empty | CI run URL入力前に必要artifact一覧が見えるか | 入力前から完了条件を共有するため |
| valid | coverage / playwright-report / test-results / terminal evidence / screenshotsが揃うか | 「CI成功」ではなく「証跡が揃った」を確認するため |
| failure | 不足artifact、失敗job、短すぎるcommit SHAを修正指示へ変換できるか | AIへの再依頼を具体化するため |
| timeout | CI取得が止まった時に再試行と手動Binder fallbackを出せるか | 外部CI依存で作業が止まるのを避けるため |

非ゴールは、実GitHub API接続、OAuth/token保管、artifact zipのダウンロード、永続DBである。今回はSaaSの判断ロジックを見える化するmock段階に絞った。

## 画面キャプチャ

### empty / initial：CI run URL入力前に、必要な証跡を先に見せる

初期状態では、owner / repo / run id、commit SHA、workflow、jobs、artifactsが未取得として表示される。ここで大事なのは、ユーザーがURLを貼る前から「何を揃えるべきか」を理解できることだ。

![AIDD Control Plane MVP 012 empty状態](assets/aidd-control-plane-mvp012-empty.png)

### filled / ready：必須CI証跡が揃った状態

valid状態では、mockのCI run URL、owner / repo / run id、長いcommit SHA、成功job、7種類のartifactが表示される。

![AIDD Control Plane MVP 012 valid状態](assets/aidd-control-plane-mvp012-valid.png)

この状態で初めて、AIDD Control Planeは「CIが通った」ではなく「レビュー・記事化・再現確認に必要な証跡が揃った」と言える。

### failure / insufficient：不足artifactと失敗jobを修正指示に変える

failure状態では、playwright-report、test-results、screenshot artifactが不足し、commit SHAも短すぎる状態にした。画面は、不足内容をEvidence Gap Repair Plannerへ渡す修正指示とCodex prompt deltaに変換する。

![AIDD Control Plane MVP 012 failure状態](assets/aidd-control-plane-mvp012-failure.png)

### timeout：CI取得が止まった時の逃げ道を出す

timeout状態では、jobs APIとartifacts APIがタイムアウトした想定を表示する。ここでは「再試行」だけでなく、fallbackとして手動Artifact Evidence Binderへterminal evidenceを保存する方針を出した。

![AIDD Control Plane MVP 012 timeout状態](assets/aidd-control-plane-mvp012-timeout.png)

## 失敗/修正

今回の実装・記事化QAで見えた失敗と修正は次の通り。

| 観点 | 失敗またはリスク | 修正 |
| --- | --- | --- |
| 生成物のずれ | 生成直後はMVP 011の名前やcapture scriptが残っていた | package名、hero、capture script、doctor:aiddの検査対象をMVP 012へ更新した |
| UIの浅さ | READMEではMock CI Evidence Connectorを要求していたが、画面にはまだ出ていなかった | 画面上部にempty / valid / failure / timeoutを切り替えるConnectorを追加した |
| E2Eの曖昧なselector | 「証跡不足」ボタンが「証跡不足サンプルを適用」と衝突した | Playwrightで `exact: true` を指定し、意図したボタンだけを押すよう修正した |
| WebKit安定性 | 3ブラウザ連続実行でWebKitの終盤テストが一度timeoutした | ローカルretriesを1にし、再実行でChromium / Firefox / WebKitの27件通過を確認した |
| ローカル情報漏れ | terminal画像に実行環境の絶対パスが混ざるリスクがあった | capture scriptでホームディレクトリ表記を `HOME_DIR` に置換してから画像化した |

ここは重要な一次情報だ。AIが最初からMVP番号や証跡名を完全に揃えるとは限らない。だからこそAIDD Control Plane側で、名前、script、画像、preview分類、検証ログをまとめて点検する必要がある。

## 検証ログ

独立検証として、次のコマンドを個別に実行し、`experiments/aidd-control-plane-mvp-012/artifacts/terminal/` に保存した。

| コマンド | 結果 |
| --- | --- |
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 22 tests passed |
| `pnpm run build` | pass |
| `pnpm run doctor:aidd` | pass。12 files、7 scripts、状態契約、テンプレートを確認 |
| `pnpm run test:e2e` | 27 passed / Chromium・Firefox・WebKit |
| `pnpm run capture:mvp012` | empty / valid / failure / timeout / terminal evidence画像を保存 |

terminal evidence画像も保存した。

![AIDD Control Plane MVP 012 terminal evidence](assets/aidd-control-plane-mvp012-terminal-evidence.png)

E2Eでは、Mock CI Evidence Connectorのvalid / failure / timeout切り替えを3ブラウザで確認した。加えて、既存のProject Intake Wizard、Verification Run Tracker、Artifact Evidence Binder、Evidence Gap Repair Plannerの主要フローも引き続き確認している。

## 読者が使えるチェックリスト

自分のAI駆動開発でも、CI連携前に次のチェックリストを使える。

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| CI run URLからowner / repo / run idを抽出できるか | 後から同じCI実行を参照できるか | 証跡の出どころを曖昧にしないため |
| commit SHAは十分な長さか | どのコードを検証したか特定できるか | 短すぎるSHAでは再現確認が弱くなるため |
| jobsの成功/失敗を表示しているか | どの品質ゲートが壊れたか分かるか | 「CI失敗」だけでは修正依頼が曖昧になるため |
| 必須artifact一覧があるか | coverage、report、results、terminal、screenshotsが揃うか | 記事・レビュー・再現確認で一次証跡を使うため |
| timeout状態を設計しているか | 外部CI取得が止まった時の対応があるか | API障害で作業全体を止めないため |
| fallbackを用意しているか | 手動Evidence Binderへ戻れるか | 自動取得が失敗しても証跡保存を続けるため |
| Codex prompt deltaに戻しているか | 次回AI依頼が具体化されるか | 同じ曖昧な依頼を繰り返さないため |

## AIDD-Spec / AIDD Control Plane SaaSへの接続

MVP 012は、AIDD-Spec v0.1の中でも次のartifactへ接続する。

- Verification Evidence
- AI Task Packet
- Review Record
- Learning Log
- Test Plan
- Release Checklist
- Observability Plan

AIDD-Specの狙いは、AIに「いい感じに作って」と頼むことではない。旅行の持ち物リストのように、何を持ったか、何が足りないか、足りない時にどう補うかを共通化することだ。

AIDD Control Plane SaaSとして見ると、MVP 012は次の価値に近づいた。

```text
CI run URLを貼る
  -> mock connectorが証跡状態を判定する
  -> 不足またはtimeoutを修正指示に変える
  -> Evidence Gap Repair Plannerへ渡す
  -> 次回AI Task Packet Deltaへ戻す
```

まだ実GitHub API接続ではない。しかし、SaaSがユーザーへ見せるべき判断軸、失敗時の言葉、fallbackの導線はかなり具体化できた。

## 次回

次回以降は、MVP 012で作ったmock判断をより実運用に近づけたい。

- 実GitHub Actions URLの到達確認を安全なmock backend経由にする
- `/health`, `/state`, `/__control/state` を持つCI mock serviceを独立させる
- artifact一覧をUI手入力ではなくmock APIレスポンスから取得する
- token scope不足、404、rate limit、timeoutをE2Eから切り替える
- CI artifact保存のworkflow検査をAIDD Control Plane側で表示する

MVP 012で、AIDD Control Planeは「証跡不足を修理依頼へ変える」だけでなく、「CIから証跡を取りに行く入口」を持ち始めた。次は、このmock connectorを独立したmock backendに切り出し、よりSaaSらしい検証ループへ進める。
