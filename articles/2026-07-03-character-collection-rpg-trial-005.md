# AIDD Control Plane Dogfood 005：RPGプロトタイプを4つのmock serviceとaxe検査まで進める

> 2026-07-03 / Codex Mastery Lab  
> 対象: AIDD Control Plane Dogfood / キャラ収集ターン制RPG / mock service分割・media failure・a11y  
> 結果: **mock-api / mock-media / mock-auth / mock-billingを分け、media failureとaxe検査込みで30本の3ブラウザE2Eが通った**

## 前回の振り返り

Trial 004では、編成交替・育成・召喚加入をmock backendへ保存し、リロード後にも残ることを確認した。

ただし、まだAIDD Control PlaneのAI Task Packetとしては弱い点があった。

```text
- mock serviceが1プロセスに寄っていた
- media failureが画面に出ていなかった
- E2Eにaxeアクセシビリティ検査が入っていなかった
```

キャラ収集RPG風の見た目を作るだけなら1つのmockで十分に見える。しかし、AIDD-Specの実験としては「APIは元気だがmediaだけ失敗する」「billingだけ失敗する」のように、原因を分けて確認できる必要がある。

## 今回の仮説

AIに「失敗状態も作って」と頼むだけだと、1つのエラーパネルで全部をまとめやすい。

そこで今回は、AIDD Control Plane側の条件を次のように強めた。

```yaml
multi_mock_contract:
  services:
    - mock-api: catalog/state/action persistence
    - mock-media: battle/gacha visual asset state
    - mock-auth: anonymous/premium training state
    - mock-billing: payment_failed recruit blocking
  required_endpoints:
    - /health
    - /state
    - /__control/state
  failure_state:
    - media_failure must not break core battle/gacha information
  accessibility:
    - axe check on key screens in Chromium/Firefox/WebKit matrix
```

初心者向けに言うと、これは「冷蔵庫、財布、鍵、スマホ」を1つのチェック欄にせず、旅行前の持ち物リストとして分けて確認するようなものだ。全部を「準備OK」にまとめると、何が足りないのか分からない。

## 実装したこと

| 項目 | 追加したこと | E2Eで確認したこと |
| --- | --- | --- |
| mock service分割 | `mock-api`, `mock-media`, `mock-auth`, `mock-billing`をDocker Compose / Node fallbackで起動 | 4 serviceの`/health`と`/state`が通る |
| media failure | `media_failure` scenarioを追加 | 戦闘・幻晶でmedia失敗を表示し、HP/ログ/結果カードは残る |
| axe検査 | `@axe-core/playwright`を追加 | 主要画面で重大なaxe違反がない |
| 3ブラウザE2E | 8本から10本へ増加 | Chromium / Firefox / WebKitで合計30本pass |

## 4つのmock serviceへ分ける

![SagaForge Trial 005 service state](assets/2026-07-03-sagaforge-trial-005-state-services.png)

今回、mock起動を次の4 serviceへ分けた。

```text
mock-api      : 4100
mock-media    : 4101
mock-auth     : 4102
mock-billing  : 4103
```

各serviceは最低限、次のエンドポイントを持つ。

```text
/health
/state
/__control/state
```

UIは引き続き`mock-api`を入口にしているが、状態画面には`api / media / auth / billing`の個別状態が見える。これにより、AIDD Control Planeは「画面が壊れている」ではなく「mediaだけ壊れている」「billingだけ失敗している」と説明しやすくなる。

Docker Compose経路も確認した。

```text
api: mock-api OK scenario=success
media: mock-media OK scenario=success
auth: mock-auth OK scenario=success
billing: mock-billing OK scenario=success
```

## media failureでもゲーム進行情報を残す

![SagaForge Trial 005 media battle](assets/2026-07-03-sagaforge-trial-005-media-battle.png)

`media_failure`では、戦闘背景や敵演出のmock media取得に失敗した扱いにした。

ただし、画面全体を真っ白にしない。E2Eでは次を確認している。

```text
戦闘画面:
- mock media取得に失敗した説明が見える
- HPと戦闘ログは残る
- 操作可能な戦闘コマンドは残る
```

これは、実アプリの障害対応でも重要だ。画像や演出が落ちても、ユーザーが「何が起きたか」を読める状態にする。

## 召喚演出も結果カードを残す

![SagaForge Trial 005 media gacha](assets/2026-07-03-sagaforge-trial-005-media-gacha.png)

幻晶画面でも同じ方針にした。

```text
召喚演出のmock media取得に失敗しました。
結果カードだけ安全に表示します。
```

派手な演出がなくても、結果カードと名簿状態は確認できる。AIDD Control PlaneのAI Task Packetでは、media failureを「全部止める」ではなく「本当に必要な情報を残す」と書くべきだと分かった。

## axeアクセシビリティ検査をE2Eへ入れる

今回はPlaywrightに`@axe-core/playwright`を追加し、主要画面を巡回してaxeを実行した。

対象画面は次の通り。

```text
ホーム
編成
戦闘
幻晶
育成
状態
```

`color-contrast`はOS/レンダリング差分の影響が出やすいため、今回の機能E2Eでは無効化し、構造的な重大違反を優先している。これは「見た目を点数化しない」という意味ではなく、CIで安定して確認する対象を分けるための判断だ。

## 検証結果

![SagaForge Trial 005 terminal evidence](assets/2026-07-03-sagaforge-trial-005-terminal-evidence.png)

ローカル検証は以下の通り。

| command | result |
| --- | --- |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 11 tests passed |
| `pnpm run test:coverage` | pass / statements 95.45% |
| `pnpm run build` | pass |
| `pnpm run doctor:playwright` | Chromium / Firefox / WebKit OK |
| `pnpm run mock:doctor` | pass / 4 service health確認 |
| Docker Compose mock start | pass / 4 service health確認 |
| `pnpm run test:e2e` | 30 tests passed |

E2Eは10シナリオ × 3ブラウザ。

```text
Chromium
Firefox
WebKit
```

全部通った。

## AIDD Control Planeへ戻すルール

今回の学びは、次回以降のAI Task Packet生成ルールへ戻せる。

```yaml
service_failure_contract:
  do_not_merge_all_failures_into_one_error:
    - api
    - media
    - auth
    - billing
  media_failure:
    required_ui:
      - visible_failure_reason
      - core_game_state_still_readable
      - battle_log_or_result_cards_remain
  verification:
    - each_service_health_and_state
    - docker_compose_path
    - node_fallback_path
    - axe_on_key_screens
    - chromium_firefox_webkit_e2e
```

AIDD Control Planeがやるべきことは、「RPGっぽい画面を作る」だけではない。作りたいアプリを、mock service、失敗状態、保存、アクセシビリティ、3ブラウザ検証へ分解してAIへ渡すことだ。

## 次回

Trial 006候補は次の通り。

```text
- root GitHub Actions workflowでこのRPG dogfoodをCI artifact付きで回す
- mock service間の状態同期ルールをより厳密にする
- AIDD Control Plane側のAI Task Packetテンプレートにmulti_mock_contractを取り込む
- media failure以外に、auth timeout / billing retry / api offlineの個別復旧導線を追加する
```
