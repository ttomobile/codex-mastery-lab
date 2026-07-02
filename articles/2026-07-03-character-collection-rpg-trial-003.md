# AIDD Control Plane Dogfood 003：キャラ収集RPGに「操作すると変わる」を入れる

> 2026-07-03 / Codex Mastery Lab  
> 対象: AIDD Control Plane Dogfood / キャラ収集RPG / user-action contract  
> 結果: **戦闘コマンド、編成交替、育成、召喚加入を追加し、18本の3ブラウザE2Eが通った**

## 前回の振り返り

Trial 002では、完全オリジナルの画像素材を入れて、キャラ収集RPGプロトタイプの画面密度を上げた。

できたことは次の通り。

```text
ホーム用キービジュアル
編成用隊員ビジュアル
戦闘背景
敵ボス画像
召喚背景
失敗状態の維持
3ブラウザE2Eの維持
```

ただし、まだ弱点があった。

**見た目は遊べそうだが、操作感は薄い。**

そこで今回は、AIDD Control PlaneがAI Task Packetへ渡すべき条件として、`user-action contract` を追加する。

## 今回の仮説

アプリの品質をAIへ頼むとき、「画面を作って」だけでは足りない。

キャラ収集RPGなら、少なくとも次のような操作が必要になる。

```text
戦闘でコマンドを選ぶ
編成で隊員を入れ替える
育成で数値が上がる
召喚結果を名簿へ反映する
```

これは本物のIPを真似る話ではない。  
**ユーザー操作が状態に反映される体験パターン** を、商標非利用で検証する話だ。

## 実装した操作

今回追加した操作は4つ。

| 画面 | 追加した操作 | 検証したこと |
| --- | --- | --- |
| 戦闘 | `通常攻撃` / `防御` / `星紋技` | 選択中コマンドと戦闘ログが変わる |
| 編成 | 控え隊員との交替 | 隊列表示に `リク` が入る |
| 育成 | `強化` | Lv.42がLv.43へ上がる |
| 幻晶 | `名簿に迎える` | 名簿が4名から5名へ増える |

## 戦闘コマンド

![SagaForge Trial 003 戦闘コマンド](assets/2026-07-03-sagaforge-trial-003-battle-command.png)

戦闘画面に、3つのコマンドを追加した。

```text
通常攻撃
防御
星紋技
```

`星紋技` を押すと、選択中表示とログが変わる。

ここで大事なのは、単なるボタン追加ではなく、E2Eで次を確認していること。

```text
選択中: 星紋技
星紋技を選択: 敵へ...点、被害...点の予測。
```

つまり、UIイベントが実際の画面状態へ反映されている。

## 編成交替

![SagaForge Trial 003 編成交替](assets/2026-07-03-sagaforge-trial-003-party-swap.png)

編成画面では、控え隊員 `リク` と交替できるようにした。

E2Eでは、3枠目の交替ボタンを押したあと、隊列表示に `リク` が入ることを確認している。

```text
現在の隊列: アステル / ミナト / リク
```

これにより、編成画面は「見せるだけ」から「入れ替えを試せる」画面になった。

## 育成

![SagaForge Trial 003 育成](assets/2026-07-03-sagaforge-trial-003-training.png)

育成画面では、`強化` ボタンでレベルと戦力が上がる。

E2Eでは、`アステル` の表示が次のように変わることを確認した。

```text
Lv.42
↓
Lv.43
```

この小さな変化が重要だ。  
AIにアプリを作らせると、「強化ボタンはあるが何も変わらない」状態になりやすい。AIDD Control Plane側では、ボタンの存在だけでなく、押した後の状態変化まで条件にする必要がある。

## 召喚結果を名簿へ反映

![SagaForge Trial 003 召喚加入](assets/2026-07-03-sagaforge-trial-003-gacha-recruit.png)

幻晶画面では、召喚結果の先頭候補を `名簿に迎える` できるようにした。

E2Eでは、名簿数が変わることを確認している。

```text
現在の名簿: 4名
↓
現在の名簿: 5名
```

今回も本物の課金、公式確率、公式キャラは扱っていない。  
扱ったのは、あくまで「結果を所持リストへ反映する」という体験パターンだけだ。

## 検証結果

![SagaForge Trial 003 terminal evidence](assets/2026-07-03-sagaforge-trial-003-terminal-evidence.png)

ローカル検証は以下の通り。

| command | result |
| --- | --- |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 9 tests passed |
| `pnpm run test:coverage` | pass / statements 95.23% |
| `pnpm run build` | pass |
| `pnpm run doctor:playwright` | Chromium / Firefox / WebKit OK |
| `pnpm run mock:doctor` | Docker Compose経路でpass |
| `pnpm run test:e2e` | 18 tests passed |

E2Eは6シナリオ × 3ブラウザ。

```text
Chromium
Firefox
WebKit
```

全部通った。

## AIDD Control Planeへ戻すルール

今回の学びは、`user-action contract` としてAIDD Control Planeへ戻せる。

```yaml
user_action_contract:
  required_actions:
    - battle_command_selection
    - party_member_swap
    - training_level_up
    - gacha_result_to_roster
  verification:
    - action_changes_visible_state
    - e2e_controls_action
    - failure_states_remain_available
    - three_browser_matrix_passes
```

初心者向けに言うと、これは「ボタンを置いたか」ではなく、**押したあとに何が変わるかを書くチェックリスト** だ。

## 次回

次の課題は、画面内stateから一歩進めること。

Trial 004候補：

```text
mock backendへ編成保存
mock backendへ育成結果保存
リロード後も名簿追加が残る
auth anonymous / premiumで使える操作を変える
課金失敗時に召喚加入を止める
```

今回で、プロトタイプは「見た目が遊べそう」から「操作すると変わる」へ進んだ。AIDD Control Planeの価値も、見た目の指示ではなく、検証可能な操作契約をAI Task Packetへ変換するところにある。
