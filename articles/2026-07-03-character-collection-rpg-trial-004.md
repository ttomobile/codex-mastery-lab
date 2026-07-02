# AIDD Control Plane Dogfood 004：キャラ収集RPGの操作をmock backendへ保存する

> 2026-07-03 / Codex Mastery Lab  
> 対象: AIDD Control Plane Dogfood / キャラ収集RPG / backend persistence contract  
> 結果: **編成・育成・召喚加入をmock backendへ保存し、auth / billing制御込みで24本の3ブラウザE2Eが通った**

## 前回の振り返り

Trial 003では、キャラ収集RPGプロトタイプに次の「操作すると変わる」要素を入れた。

```text
戦闘コマンド選択
編成交替
育成によるLv上昇
召喚結果の名簿加入
```

ただし、まだ弱点があった。

**画面内のstateは変わるが、mock backendへ保存されているとは言い切れない。**

ユーザーにとっては、操作後にリロードしたら戻ってしまうアプリは「遊べる」と感じにくい。AIDD Control PlaneがAI Task Packetへ変換する条件も、ボタンの反応だけでなく、保存先と再読込後の確認まで含める必要がある。

## 今回の仮説

AIに「RPGっぽくして」と頼むだけだと、UI内だけで状態を持つ実装になりやすい。

そこで今回は、AIDD Control Plane側の条件を次のように強めた。

```yaml
backend_persistence_contract:
  required_actions:
    - party_swap_saved_to_mock_backend
    - training_saved_to_mock_backend
    - gacha_recruit_saved_to_mock_backend
  required_controls:
    - auth_anonymous
    - auth_premium
    - billing_payment_failed_blocks_recruit
  verification:
    - reload_after_action_keeps_state
    - e2e_controls_mock_state
    - chromium_firefox_webkit_pass
```

初心者向けに言うと、これは「メモ帳に書いた内容が、閉じて開き直しても残るか」を確認するチェックリストに近い。画面で一瞬変わっただけではなく、保存したものをもう一度読み直して確認する。

## 実装したこと

今回の主な変更は4つ。

| 項目 | 追加したこと | E2Eで確認したこと |
| --- | --- | --- |
| 編成保存 | `/actions/swap-party` | リロード後も隊列に `リク` が残る |
| 育成保存 | `/actions/train` | リロード後も `Lv.43` が残る |
| 召喚加入保存 | `/actions/recruit` | リロード後も名簿が `5名` のまま |
| auth / billing制御 | `auth_anonymous`, `auth_premium`, `payment_failed` | premium表示切替、決済失敗時の加入ブロック |

## 編成交替をmock backendへ保存

![SagaForge Trial 004 編成保存](assets/2026-07-03-sagaforge-trial-004-party-persist.png)

Trial 003では、編成画面で `リク` と交替できた。今回は、交替をmock backendへPOSTし、リロード後にも残ることをE2Eで確認した。

```text
編成を開く
3枠目をリクと交替
ページをリロード
もう一度編成を開く
現在の隊列にリクが残っている
```

AIDD Control Planeの観点では、「ユーザー操作」は次の2段階で確認する必要がある。

1. 押した直後に画面が変わる
2. 再読込してもmock backendから同じ状態が返る

## 育成結果を保存

![SagaForge Trial 004 育成保存](assets/2026-07-03-sagaforge-trial-004-training-persist.png)

育成画面では、`強化` によって `アステル` が `Lv.42` から `Lv.43` へ変わる。

今回の追加点は、リロード後にも `Lv.43` が残ることだ。

```text
強化前: Lv.42
強化後: Lv.43
リロード後: Lv.43
```

これにより、「画面上で一時的に増えた」だけではなく、mock backend contractとして保存されたことを確認できる。

## authで育成枠を切り替える

![SagaForge Trial 004 プレミアム育成](assets/2026-07-03-sagaforge-trial-004-premium-training.png)

今回は `auth_anonymous` と `auth_premium` をmock scenarioへ追加した。

```text
auth_anonymous -> 通常育成枠
auth_premium   -> プレミアム育成枠が有効
```

これは本物の会員制度や公式文言を真似るためではない。  
**認証状態によって使える操作や表示が変わる** という、アプリ開発でよくある体験パターンを検証するためだ。

## billing失敗中は召喚加入を止める

![SagaForge Trial 004 決済失敗ブロック](assets/2026-07-03-sagaforge-trial-004-payment-block.png)

`payment_failed` のとき、幻晶画面では失敗パネルを出すだけでなく、加入ボタンを `加入不可` にして無効化した。

E2Eでは次を確認している。

```text
payment_failedへ切り替える
幻晶画面を開く
mock決済失敗メッセージが見える
加入不可ボタンがdisabledである
```

ここで大事なのは、失敗表示だけでは終わらせないことだ。失敗状態では、成功時の操作が止まる必要がある。

## Docker Compose経路の修正

今回、ひとつ実装上の不具合も見つかった。

mock serverはNode fallbackでは動いていたが、Docker Compose経路ではコンテナ内で `127.0.0.1` にlistenしていたため、ホスト側からhealth checkできなかった。

修正は次の通り。

```text
Docker Composeでは HOST=0.0.0.0 を渡す
mock serverは HOST環境変数を見てlistenする
```

これは、aidd-app-clone-lab skillの「Docker Compose優先、Node fallbackあり」という条項が効いた例だ。Node fallbackだけなら見逃していたが、Docker経路を証跡として確認したことで発見できた。

## 検証結果

![SagaForge Trial 004 terminal evidence](assets/2026-07-03-sagaforge-trial-004-terminal-evidence.png)

ローカル検証は以下の通り。

| command | result |
| --- | --- |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 11 tests passed |
| `pnpm run test:coverage` | pass / statements 95.45% |
| `pnpm run build` | pass |
| `pnpm run doctor:playwright` | Chromium / Firefox / WebKit OK |
| `pnpm run mock:doctor` | pass |
| Docker Compose mock start | pass / `/health` と `/state` OK |
| `pnpm run test:e2e` | 24 tests passed |

E2Eは8シナリオ × 3ブラウザ。

```text
Chromium
Firefox
WebKit
```

全部通った。

## AIDD Control Planeへ戻すルール

今回の学びは、AIDD Control PlaneのAI Task Packet生成に次のルールとして戻せる。

```yaml
backend_persistence_contract:
  action_is_not_complete_until:
    - immediate_ui_state_changes
    - mock_backend_accepts_action
    - reload_reads_back_changed_state
  failure_controls:
    - auth_state_changes_available_action
    - billing_failure_blocks_paid_action
  evidence:
    - unit_tests
    - mock_doctor
    - docker_compose_health
    - three_browser_e2e
```

ボタンがあるかどうかではなく、**押した後に保存され、読み直しても残り、失敗状態では止まるか** をAIへ先に渡す必要がある。

## 次回

Trial 005候補は次の通り。

```text
複数mock serviceへの再分割を進める
media failureを戦闘/召喚演出に反映する
a11y検査をE2Eへ追加する
root GitHub Actions workflowでartifact保存まで確認する
AIDD Control Plane側のAI Task Packetテンプレートへbackend persistence contractを追加する
```

今回で、キャラ収集RPGプロトタイプは「操作すると変わる」から「操作がmock backendへ保存される」へ進んだ。AIDD Control Planeの価値も、見た目の依頼を、保存・失敗制御・再読込確認まで含む検証可能なAI Task Packetへ変換するところにある。
