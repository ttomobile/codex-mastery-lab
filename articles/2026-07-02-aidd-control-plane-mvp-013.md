# AIDD Control Plane MVP 013：CI証跡判断をUI内mockから独立mock serviceへ切り出そうとして分かった境界線

> 2026-07-02 / Codex Mastery Lab
> 対象: AIDD Control Plane SaaS化 / Independent Mock CI Service / Verification Evidence / AIDD-Spec v0.1
> 結果: **empty / valid / failure / timeoutの画面証跡は取得できた。一方で、独立mock service契約とE2Eの一部は未達で、次回AI Task Packetへ戻すべき失敗が明確になった**

## 読者の悩み：CI連携をUIだけでmockしていると、どこまで本物に近いのか分からない

AI駆動開発で「CI証跡を確認するSaaS」を作る時、最初は画面内のサンプル状態だけでも説明できる。MVP 012では、CI run URLを貼った後の `empty / valid / failure / timeout` をUI上で切り替え、必要artifactが揃ったかどうかを判断できるようにした。

ただし、そこで次の疑問が残った。

- UI内部の固定データを切り替えているだけでは、外部CI連携に近づいていると言えるのか
- E2Eは本当に外部状態を操作しているのか
- `/health`、`/state`、`/__control/state` のようなサービス契約を先に固定できているか
- timeoutやrate limitのような外部依存の失敗を、UIから独立して再現できるか
- 「通ったコマンド」だけでなく「本来の契約を満たしたか」をレビューできているか

MVP 013の狙いは、ここを一段進めて、**CI証跡判断をUI内mockから独立したMock CI Serviceへ切り出すこと**だった。

## 今回の仮説

今回の仮説はこうだ。

```text
UI内の固定サンプル
  -> 独立Mock CI Service
  -> /health /state /__control/state
  -> E2Eから状態変更
  -> UIが取得結果を反映
  -> 不足・timeout・rate limitをAI Task Packet Deltaへ戻す
```

実GitHub APIに進む前に、家計簿で固定費を先に分けるように、「外部サービスが返す状態」と「UIが表示する判断」を分離したかった。これができると、AIDD Control Plane SaaSは将来、GitHub Actions、GitLab CI、CircleCIなどに広げる時も、まず共通の証跡契約で評価できる。

## 実験内容

`experiments/aidd-control-plane-mvp-013/generated-repo` を対象に、次のAI Task Packetを渡した。

- `mocks/ci-service` にNode fallbackのmock serviceを実装する
- mock serviceは `/health`, `/state`, `/__control/state` を持つ
- `pnpm run mock:start`, `pnpm run mock:stop`, `pnpm run mock:doctor` を追加する
- UIはmock service由来の `empty / valid / failure / timeout / rate_limit` を表示する
- E2Eから `/__control/state` を叩いて状態を変え、画面反映を確認する
- timeoutとrate limitでは、再試行、手動Evidence Binder fallback、次回AI Task Packet Deltaを表示する
- `lint / typecheck / test / build / test:e2e / doctor:aidd / mock:doctor` を検証ログとして保存する
- empty / filled / failure / terminal evidence画像を保存する

つまり、MVP 013は「見た目の機能追加」ではなく、**UIと外部CI状態の境界を検証する回**だった。

## 画面キャプチャ

### empty / initial：CI証跡取得前に、必要な確認項目を先に見せる

初期画面では、Mock CI Evidence Connectorが入力待ちとして表示され、Verification Run Tracker、Artifact Evidence Binder、CI Artifact Importer、Evidence Gap Repair Plannerが続く。ユーザーはURLを貼る前から、何が証跡として必要かを確認できる。

![AIDD Control Plane MVP 013 empty initial](assets/aidd-control-plane-mvp013-empty-initial.png)

### filled / ready：必須証跡が揃った想定を表示する

filled / readyでは、必須artifact、terminal evidence、screenshot evidence、3ブラウザE2E成功、Review passが揃った想定を表示する。MVP 012からの価値である「CIが通った」ではなく「レビューできる証跡が揃った」を引き続き見せられている。

![AIDD Control Plane MVP 013 filled ready](assets/aidd-control-plane-mvp013-filled-ready.png)

### failure / insufficient：不足証跡と壊れたCI情報を修正指示へ変える

failure / insufficientでは、壊れたCI run URL、短すぎるcommit SHA、不足artifact、失敗job、token scope不足などを表示し、Review FindingとNext AI Task Packet Deltaへ戻す。これはAIDD Control Planeの中心価値である「失敗を次の依頼へ変換する」部分だ。

![AIDD Control Plane MVP 013 failure insufficient](assets/aidd-control-plane-mvp013-failure-insufficient.png)

### timeout / fallback：外部CI取得が止まった時の逃げ道を見せる

timeoutでは、jobs / artifacts取得が止まった想定を表示し、再試行と手動Artifact Evidence Binder fallbackを出す。外部CI連携では、APIが遅い、権限が足りない、一時的に制限される、といった失敗が普通に起こる。だから「待つ」だけでなく「手元の証跡を束ねて先へ進む」導線が必要になる。

![AIDD Control Plane MVP 013 timeout fallback](assets/aidd-control-plane-mvp013-timeout-fallback.png)

### terminal evidence：成功と失敗を同じ記事に残す

今回のterminal evidenceは、成功だけでなく未達も含む。これは記事として弱点ではなく、AIDD-Specにとって重要な一次情報である。

![AIDD Control Plane MVP 013 terminal evidence](assets/aidd-control-plane-mvp013-terminal-evidence.png)

## 失敗/修正

今回もっとも大事だったのは、**MVP 013の狙いに対して生成物が途中でMVP 012相当に戻ってしまったこと**だ。

| 観点 | 観測した失敗または未達 | 修正方針 |
| --- | --- | --- |
| 独立mock service | `mock:doctor` が存在せず、`ERR_PNPM_NO_SCRIPT Missing script: mock:doctor` になった | `mocks/ci-service/server.mjs`、`mock:start`、`mock:stop`、`mock:doctor` を必須化する |
| package識別 | `package.json` のnameが `aidd-control-plane-mvp-012` のままだった | MVP番号、script名、capture名をdoctor:aiddで検査する |
| capture script | `capture:mvp012` はあるが、`capture:mvp013` がscript登録されていない | 証跡画像の命名とscript名をMVPごとに揃える |
| E2E | `pnpm run test:e2e` はChromiumの3件目でtimeoutし、27件完走しなかった | 失敗testのselectorまたは待機条件を修正し、3ブラウザで再実行する |
| docs | `generated-repo/docs/product-brief.md` と `learning-log.md` がMVP 011の内容のままだった | docsのMVP番号と今回の目的をdoctor:aiddの検査対象に入れる |
| 契約検証 | E2Eが `/__control/state` を叩く形になっていない | UIボタン操作だけでなく、mock service制御APIから状態変更するtestを追加する |
| rate limit | READMEでは `rate_limit` を要求したが、画面・E2Eの中心はtimeoutまでだった | `rate_limit` を状態契約に追加し、token scope / wait / retry計画を表示する |

ここでの学びは、AIへの依頼文に「mock serviceを作る」と書くだけでは不十分ということだ。チェックリストのように、**存在すべきファイル、script、HTTP endpoint、E2Eの操作方法、doctorで検査する項目**まで上流artifactに入れる必要がある。

## 検証ログ

独立検証として、`experiments/aidd-control-plane-mvp-013/artifacts/terminal/` にログを保存した。

| コマンド | 結果 | 一次情報としての意味 |
| --- | --- | --- |
| `pnpm run lint` | pass | ESLintは警告0で通過 |
| `pnpm run typecheck` | pass | TypeScript型検査は通過 |
| `pnpm run test` | pass。22 tests passed | 純粋関数レベルの状態判定は壊れていない |
| `pnpm run build` | pass | Next.js buildは成功 |
| `pnpm run doctor:aidd` | pass | ただしMVP 012相当のscript検査が残っており、MVP 013契約の深い検査ではない |
| `pnpm run mock:doctor` | fail。script missing | 独立mock service契約が未達であることを確認 |
| `pnpm run test:e2e` | fail。Chromium 3件目でtimeout | 3ブラウザE2E完走は未達 |
| 画像capture | pass | empty / ready / failure / timeout / terminal evidence画像は保存済み |

この結果から、MVP 013は「完成したmock service」ではなく、**mock serviceへ進むために、何をdoctorとE2Eで強制すべきかが明確になった回**と見るのが正しい。

## 読者が使えるチェックリスト

AIに「CI連携をmockで作って」と依頼する時は、次の表をそのまま使える。

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| mock serviceはUIと別プロセスか | 画面内の固定サンプルではないか | 外部CI連携に進む前の境界を作るため |
| `/health` があるか | serviceが起動しているか | E2Eやdoctorが安全に前提確認するため |
| `/state` があるか | 現在のCI証跡状態を取得できるか | UIが外部状態を読む形にするため |
| `/__control/state` があるか | testから状態を決定的に変更できるか | failureやtimeoutを手作業なしで再現するため |
| `mock:start / mock:stop / mock:doctor` があるか | 起動、停止、診断を標準化できるか | 人間とAIの両方が同じ手順で確認するため |
| E2Eがcontrol APIを叩いているか | UIボタンだけの確認になっていないか | サービス契約と画面反映を同時に検証するため |
| timeout / rate limitがあるか | 外部依存の失敗を扱えるか | 本番CI連携で避けられない失敗に備えるため |
| docsのMVP番号が合っているか | 古い成果物の流用が残っていないか | 記事化・レビュー時の混乱を防ぐため |
| doctorが今回の契約を検査しているか | 「通ったけど浅い検査」になっていないか | 品質ゲートを実質的なものにするため |

## AIDD-Spec / AIDD Control Plane SaaSへの接続

MVP 013は未達を含むが、AIDD-Specにとって重要な更新点がある。

```yaml
category: Mock Backend Contract
finding: Independent Mock CI Service was requested but mock:doctor script was missing
severity: high
observed_by: terminal log
ideal_state: UI-independent mock service exposes /health, /state, /__control/state and is verified by mock:doctor and E2E
fix_instruction: Add mocks/ci-service, mock:start, mock:stop, mock:doctor, and Playwright tests that control state through /__control/state
needed_upstream_info:
  - Mock Backend Contract
  - Verification Evidence
  - AI Task Packet
standard_update:
  document: AIDD Control Plane MVP Contract
  field: ci_evidence_connector.requires_independent_mock_service
codex_prompt_delta: |
  UI内の固定サンプルではなく、mocks/ci-serviceを別プロセスとして実装する。/health、/state、/__control/stateを持たせ、E2Eは/__control/stateでempty / valid / failure / timeout / rate_limitを切り替えて画面反映を確認する。
verification:
  command: pnpm run mock:doctor && pnpm run test:e2e
  expected: pass
```

AIDD Control Plane SaaSとして見ると、今回の失敗はむしろ価値がある。SaaSは「開発が成功した時だけ表示するツール」ではなく、次のように不足を分類して戻す必要がある。

```text
AIが生成したMVP
  -> doctorで契約未達を検出
  -> E2Eで再現不能な状態を検出
  -> docsの古さを検出
  -> Review Findingへ変換
  -> 次回AI Task Packet Deltaを生成
```

この流れは、AIDD-SpecのVerification Evidence、Review Record、Learning Log、AI Task Packetを実際に使う場面そのものだ。

## 次回

次回のMVP 014では、MVP 013で見えた未達をそのままAI Task Packetへ戻す。

- `mocks/ci-service/server.mjs` を追加する
- `/health`、`/state`、`/__control/state` を実装する
- `empty / valid / failure / timeout / rate_limit` をservice側の状態として持つ
- UIはserviceから状態をfetchして表示する
- Playwrightは `/__control/state` を叩いて状態を変更する
- `mock:start / mock:stop / mock:doctor` を追加する
- `doctor:aidd` はMVP番号、script名、docs、mock service、E2Eのcontrol API利用を検査する
- docsのProduct Brief、Review Record、Learning LogをMVP 014用に更新する

MVP 013は、予定していた独立mock serviceの完成回ではなかった。しかし、AIDD Control Planeに必要な「浅い成功を見抜く検査項目」ははっきりした。次回はこの失敗を、より強いMock Backend Contractとして実装へ戻す。
