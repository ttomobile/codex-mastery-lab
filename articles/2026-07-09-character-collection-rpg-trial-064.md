# SagaForge Trial 064: 日課ホームからスタイル育成・5人編成・Round戦闘を1本につなぐ

前回までのSagaForgeは、ユーザーから見て「一般的なファンタジーRPGの部品が増えた」状態に寄りがちだった。特に、スマホのキャラ収集RPGで期待される **ログイン直後の情報密度、スタイル単位の育成判断、5人編成、イベント周回、Round/BP/OD風の戦闘、勝利後の報酬戻り** が、まだ別々のカードに見えていた。

Trial 064では、記事化より先に `playables/sagaforge-app/index.html` を更新し、ホーム内に「今日の1周」を判断する司令室カードを追加した。実在IP・公式素材・商標・ロゴ・公式文言・公式確率は使わず、体験パターンだけを非侵害の形で抽象化している。

公開プレイアブル:

- `PUBLIC_PLAYABLE_URL/sagaforge-app/index.html`

## 前回の何が遠かったか

| 遠かった点 | なぜ弱いか | Trial 064での対応 |
|---|---|---|
| ホームの情報が多いだけで、日課判断として連動しきっていない | スマホRPGでは、ログイン直後に資源、イベント、育成、編成、出撃先、報酬戻り先まで一気に判断したい | Trial 064司令室カードに、イベント日課・スタイル育成・5人陣形・戦闘テンポ・10連/ピース・勝利後戻り先を集約 |
| スタイル/編成/クエスト/戦闘が別画面の説明に見える | 「どのスタイルを育てるから、どの5人で、どのRoundをどう解くか」が1本の操作列になっていない | 「今日の1周を開始」ボタンで育成対象、陣形、クエスト、BP/OD予約をまとめて戦闘へ送る |
| 勝利後の報酬が次の育成に戻る感覚が薄い | 収集RPGらしさは、勝って終わりではなく、ピース・技Rank・素材を育成/再戦へ戻す循環にある | 「Roundを短縮解決」→「報酬を育成へ」で、記憶片・技書・ピースを育成ログへ反映 |

## 今回潰した差分

### 1. ホームを日課司令室に寄せた

![Trial 064 home](../assets/2026-07-09-character-collection-rpg-trial-064-home.png)

追加した `Trial 064: 日課ホームから遠征隊式の1周判断へ` では、次の6枚を同時に見せる。

- イベント日課: 消費スタミナ、推奨戦力、弱点、出撃可否
- スタイル育成: レアリティ、ロール、武器、属性、Style Lv、技Rank、ピース
- 5人陣形: 陣形名、総戦闘力、前衛/中衛/後衛
- 戦闘テンポ: Round、BP、OD、連携率、予約技
- 10連/ピース: 交換Pt、突破候補
- 勝利後戻り先: 育成・交換・再戦のどこへ戻るか

### 2. 日課操作を押すと、周回準備が変わる

![Trial 064 daily](../assets/2026-07-09-character-collection-rpg-trial-064-daily.png)

`日課をまとめる` は、贈り物/素材の受取、育成3周デッキ、5人予約技、BP/OD判断をまとめて更新する。単なる説明テキストではなく、次に押すべき `今日の1周を開始` へ接続する。

### 3. Roundを短縮解決し、勝利後の戻り先を作った

![Trial 064 battle result](../assets/2026-07-09-character-collection-rpg-trial-064-battle-result.png)

`今日の1周を開始` で戦闘へ入り、`Roundを短縮解決` で、能力値・技Rank・ピース・記憶片を更新する。ここでは「ボタンを押すとHPが少し変わる」ではなく、勝利後にホーム/育成/交換へ戻る理由を作ることを優先した。

### 4. 報酬を育成へ戻した

![Trial 064 training](../assets/2026-07-09-character-collection-rpg-trial-064-training.png)

`報酬を育成へ` によって、記憶片と技書を育成素材へ変換し、Style Lv/技Rank候補のログを残す。これで、戦闘結果が育成画面の次の判断へ戻る。

## 検証ログ

![Trial 064 terminal evidence](../assets/2026-07-09-character-collection-rpg-trial-064-terminal-evidence.png)

今回の変更範囲では、次を確認した。

```text
Trial 064 playable capture
- title: 星紋遠征隊 SagaForge Trial 064
- trial064-card: 6
- trial064-step: 5
- trainingLog includes: Trial 064
- visible app text does not include protected inspiration names

Preview build
- scripts/build_preview.py completed
- preview/sagaforge-app/index.html copied from playables/sagaforge-app/index.html

Public URL checks
- /sagaforge-app/index.html -> http=200
- /sagaforge-app/assets/party-key-art.png -> http=200
- /sagaforge-app/assets/battle-ruins.png -> http=200
- /sagaforge-app/assets/crystal-guardian.png -> http=200
- /sagaforge-app/assets/summon-altar.png -> http=200
```

## AIDD-Specへの戻し方

今回の差分は、AIDD-SpecのAI Task Packetに次のように戻せる。

```yaml
observed_gap: ホーム/スタイル/編成/クエスト/戦闘/報酬が別々の説明カードに見える
needed_upstream_info:
  - Daily Loop Contract
  - Style Growth Contract
  - Formation and Sortie Contract
  - Battle Tempo Contract
  - Post Victory Return Contract
prompt_delta: |
  ホームには、ログイン直後の資源、イベントクエスト、育成スタイル、5人編成、BP/OD予約、勝利後の戻り先を1枚で判断できる司令室を置く。
  ボタン操作で、育成対象・陣形・周回先・戦闘予約・勝利報酬が実際に変化することをPlaywrightで検証する。
verification:
  - capture playable screenshot
  - assert trial cards and steps exist
  - assert reward-to-training log updates
  - assert protected IP names are absent from app text
```

## まだ遠い点

- 戦闘演出はまだカード/ログ中心で、攻撃順・追撃・OD演出の見た目が弱い。
- スタイル一覧の所持/未所持、同一キャラ別スタイル、継承技の悩ましさはまだ浅い。
- クエストマップはあるが、イベント章を進めて高難度や周回先が解放される感覚は弱い。
- ガチャ演出は段階表示されるが、結果から編成・育成・再戦へ戻る圧がまだ足りない。

## 次に潰す差分

次回は、**戦闘中の5人行動をもっとスマホRPGらしい演出密度にする**。具体的には、Round開始、敵複数体、技名カットイン、BP消費、OD/連携ゲージ、ダメージポップ、勝利報酬の表示を、今より短い操作で連続して見えるようにする。

今回のまとめ: Trial 064は、前回まで散っていた部品を「今日の1周」という日課操作へ寄せた。まだ本格的な演出や深い育成判断には遠いが、ホームからスタイル育成・5人編成・クエスト・Round戦闘・勝利後報酬へつながる構造は一段近づいた。
