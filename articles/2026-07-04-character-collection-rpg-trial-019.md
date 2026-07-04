# AIDD Control Plane Dogfood 019：SagaForgeを「起動直後のスマホRPG拠点」へ寄せる

前回Trial 018では、勝利後の再戦、スタイルピース限界突破、5人連携順を入れた。これで「ボタンを押すとHPが少し変わる」段階からは離れたが、ユーザーがロマサガRS的なキャラ収集RPGに期待する体験から見ると、まだ足りない部分が残っていた。

## 前回の何がロマサガRSから遠かったか

ユーザー評価の「全然ロマサガRSとは程遠い」は正しい。Trial 018時点の不足は主に次の3つだった。

1. **ホームが拠点ではなく説明画面に見えた**  
   資源表示とイベントバナーはあったが、デイリー、プレゼント、遠征、イベント周回が同時に目に入るスマホRPGの情報密度には届いていなかった。
2. **遠征・デイリー・贈り物がプレイ循環に接続していなかった**  
   周回、育成、召喚は触れたが、起動直後に「何を受け取り、どこへ行くか」を判断する流れが弱かった。
3. **戦闘の敵構造がまだ薄かった**  
   Round、BP、OD、連携ログは入ったが、複数敵を狙う、横範囲で削る、単体/回復を使い分ける感覚が弱かった。

## 今回どの差分を潰したか

Trial 019では、記事より先にプレイアブルURLの体験を改善した。アプリ本体には実在IP名、公式素材、ロゴ、商標、公式文言、公式確率は入れていない。

- **ホームの情報密度を上げた**
  - 上部リソースにスタミナ、幻晶、遠征札、贈り物を維持。
  - ホームにイベント周回、遠征帰還、プレゼント、育成の導線を配置。
  - デイリー任務カードを追加し、受け取りで素材が増えるようにした。
- **遠征を追加した**
  - 遠征札で即時帰還。
  - 帰還時に訓練書、輝片、スタイル戦闘力上昇、デイリー達成へ接続。
- **育成に技覚醒を追加した**
  - Style Lv/限界突破だけでなく、覚醒段階をスタイルカードへ表示。
  - 覚醒で戦闘力が上がり、BPコスト軽減候補として戦闘テンポに接続。
- **戦闘を複数敵・ターゲット選択へ寄せた**
  - 敵カードを表示し、狙う敵を切り替え可能にした。
  - 単体、横範囲、回復、OD連携を分けた。
  - Roundごとに敵編成が変わるようにした。

![Trial 019 ホーム情報密度](assets/2026-07-04-character-collection-rpg-trial-019-home-density.png)

![Trial 019 遠征帰還](assets/2026-07-04-character-collection-rpg-trial-019-expedition-return.png)

![Trial 019 技覚醒と育成](assets/2026-07-04-character-collection-rpg-trial-019-awaken-training.png)

![Trial 019 複数敵バトル](assets/2026-07-04-character-collection-rpg-trial-019-multi-enemy-battle.png)

![Trial 019 召喚結果](assets/2026-07-04-character-collection-rpg-trial-019-gacha-style-pieces.png)

![Trial 019 失敗状態](assets/2026-07-04-character-collection-rpg-trial-019-failure-state.png)

## 検証ログ

今回の変更範囲は静的プレイアブルなので、`scripts/build_preview.py`でpreviewへコピーし、Playwrightで主要画面を開いてスクリーンショットとDOM状態を確認した。

```text
Wrote 70 articles to WORKSPACE/preview
screenshots captured: 2026-07-04-character-collection-rpg-trial-019-home-density.png, 2026-07-04-character-collection-rpg-trial-019-expedition-return.png, 2026-07-04-character-collection-rpg-trial-019-awaken-training.png, 2026-07-04-character-collection-rpg-trial-019-multi-enemy-battle.png, 2026-07-04-character-collection-rpg-trial-019-gacha-style-pieces.png, 2026-07-04-character-collection-rpg-trial-019-failure-state.png
evidence: {"title":"星紋遠征隊 SagaForge Trial 019","tabs":["ホーム","スタイル","育成","編成","周回","戦闘","召喚","状態"],"dailyCards":4,"enemyCards":2,"stamina":"54/80"}
verified: Trial 019 playable has dense home, daily/gift/expedition loop, awakening training, multi-enemy BP battle, style-piece gacha, failure state
```

公開前チェックとして、アプリ本体に実在IP名が混ざっていないこと、previewにローカルパスやホスト名を出していないことも確認した。

## まだ遠い点

まだ「本物の商用スマホRPGの手触り」には遠い。

- ホームのバナーやミッションは増えたが、イベント開催中/ログインボーナス/ショップ/交換所/お知らせの階層はまだ浅い。
- スタイルはカード情報としては増えたが、スタイル詳細、継承技、耐性、アビリティ発動条件は未実装。
- 戦闘は複数敵になったが、敵行動、状態異常、アビリティ発動、連携演出の段階差はまだ弱い。
- 召喚は10連結果とピース変換はあるが、演出の溜め、昇格、交換ポイント、天井相当の抽象化はまだない。

## 次に潰す差分

次回は、以下の1〜3点に絞る。

1. **スタイル詳細画面**：アビリティ、耐性、継承技、技覚醒コストを表示する。
2. **戦闘中のアビリティ発動**：ターン開始、攻撃時、被弾時、勝利時のログと小演出を入れる。
3. **イベント交換所/ミッション報酬**：周回報酬を交換所へ接続し、ホームの導線をさらにスマホRPGらしくする。

## AIDD-Specへの戻し

今回の学びは「見た目のファンタジー化」ではなく、**起動直後の行動候補と報酬循環をAI Task Packetに明記しないと、AIは説明画面を作りがち**という点だった。

次回のAI Task Packetには、次の受け入れ条件を追加する。

- ホームは機能説明ではなく、資源、イベント、デイリー、プレゼント、遠征、育成、召喚の状態を同時に見せる。
- 遠征、デイリー、贈り物は、素材・スタイル成長・周回導線のいずれかへ必ず接続する。
- 戦闘は単体/範囲/回復/連携の違いがログと数値に出る。

## 公開URL

プレイアブル版：`/sagaforge-app/index.html`
