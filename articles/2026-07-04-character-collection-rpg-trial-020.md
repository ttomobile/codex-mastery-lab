# AIDD Control Plane Dogfood 020：SagaForgeを「周回で育つスマホRPGループ」へ寄せる

前回Trial 019では、ホームの情報密度、デイリー、プレゼント、遠征、複数敵バトルを追加した。これで「一般的なファンタジーRPGの説明画面」からは一歩進んだが、ユーザーがロマサガRS的な体験に期待する構造から見ると、まだ決定的に弱いところがあった。

## 前回の何がロマサガRSから遠かったか

ユーザー評価の「全然ロマサガRSとは程遠い」を、今回も出発点にした。Trial 019時点で遠かったのは主に次の3点。

1. **陣形が固定に近かった**  
   5人編成と前衛/中衛/後衛は見えたが、陣形を選ぶ、補正を見る、初期BP/OD/行動順が変わる、という判断が弱かった。
2. **クエストが「一覧から出撃」止まりだった**  
   消費スタミナと推奨戦力はあったが、章、難易度、Wave数、周回対象というスマホRPGの読み取り情報がまだ薄かった。
3. **戦闘後の育成実感が足りなかった**  
   勝利報酬は出たが、周回で能力値が伸び、技Rankが上がり、同じクエストを再戦する循環が弱かった。

## 今回どの差分を潰したか

今回は記事より先に `playables/sagaforge-app/index.html` を更新し、触れるプレイアブル版の体験をTrial 020へ進めた。アプリ本体には実在IP名、公式素材、ロゴ、商標、公式文言、公式確率は入れていない。

- **陣形切替を追加**
  - 「流星の楔」「疾風の列」「堅守の盾」の3種類を用意。
  - 陣形ごとに補正、初期BP、初期OD、総戦闘力、行動順が変わる。
  - 編成画面で選択中/変更が見えるようにした。
- **クエストを章・難易度・Waveつきにした**
  - `第1章 ... NORMAL/HARD`、`外伝 ... VERY HARD`、育成クエストを表示。
  - Wave数、消費スタミナ、推奨戦力、初回/周回報酬を同じカードで読める。
  - 前回クエストの周回予約ボタンを追加した。
- **勝利後の能力値アップと再戦導線を追加**
  - 勝利時に5人分の `HP+ / 腕力+ / 知力+ / 技Rank+1` を表示。
  - 報酬カードに周回回数、ピース、素材、贈り物を表示。
  - `同じクエストを再戦` と `育成へ` を勝利画面に並べた。

![Trial 020 陣形選択](assets/2026-07-04-character-collection-rpg-trial-020-party-formation.png)

![Trial 020 クエスト一覧](assets/2026-07-04-character-collection-rpg-trial-020-quest-list.png)

![Trial 020 勝利後の能力値アップ](assets/2026-07-04-character-collection-rpg-trial-020-battle-growth.png)

![Trial 020 失敗状態](assets/2026-07-04-character-collection-rpg-trial-020-failure.png)

## 検証ログ

変更範囲は静的プレイアブルなので、preview生成、Playwright操作、スクリーンショット取得、公開URLのHTTP確認を行った。

```text
Wrote 72 articles to WORKSPACE/preview
Playwright local verification:
- title: 星紋遠征隊 SagaForge Trial 020
- opened 編成 and selected 疾風の列
- opened 周回 and selected 第1章 裂光の丘 1-5 HARD
- executed battle commands until 能力値アップ card appeared
- opened 状態 and triggered 決済失敗
growth cards: 1
```

公開URL確認では、プレイアブルHTMLと主要画像がHTTP 200で返ることを確認した。

```text
https://PUBLIC_PREVIEW/sagaforge-app/index.html -> http=200
https://PUBLIC_PREVIEW/sagaforge-app/assets/party-key-art.png -> http=200
https://PUBLIC_PREVIEW/sagaforge-app/assets/battle-ruins.png -> http=200
https://PUBLIC_PREVIEW/sagaforge-app/assets/crystal-guardian.png -> http=200
https://PUBLIC_PREVIEW/sagaforge-app/assets/summon-altar.png -> http=200
```

## まだ遠い点

まだ本物の商用スマホRPGの手触りには遠い。

- スタイル詳細に、耐性、アビリティ、継承技、技覚醒ツリーがない。
- バトル中の敵行動、状態異常、ターン開始/攻撃時/勝利時アビリティ発動がない。
- 連携演出はログ中心で、カットイン、段階的な演出昇格、テンポ調整が弱い。
- 周回報酬が交換所、ミッション、イベントポイント、スタイルピース目標へまだ接続していない。
- ホームにショップ、交換所、お知らせ、ログインボーナス、イベント期間表示の階層がない。

## 次に潰す差分

次回は、次の1〜3点に絞る。

1. **スタイル詳細**：アビリティ、耐性、継承技、技覚醒コストをカード一覧から開けるようにする。
2. **バトル中アビリティ**：ターン開始、攻撃時、被弾時、勝利時に小ログと数値変化を出す。
3. **イベント交換所**：周回報酬を交換所へ接続し、ホームのイベント導線に戻す。

## AIDD-Specへの戻し

今回の学びは、AI Task Packetに「5人編成」「Round」「BP/OD」とだけ書いても、まだ体験は浅くなりやすいということだった。スマホRPGらしさを出すには、**周回で何が増え、次にどの画面へ戻り、どの判断が変わるか**まで受け入れ条件に入れる必要がある。

次回以降のAI Task Packetには、次を追加する。

- 陣形は複数用意し、補正、初期BP/OD、行動順、総戦闘力へ反映する。
- クエストは章、難易度、Wave、消費、推奨戦力、初回/周回報酬を表示する。
- 勝利後は報酬だけでなく、能力値アップ、技Rank、スタイルピース、再戦、育成導線を同時に出す。

## 公開URL

プレイアブル版：`/sagaforge-app/index.html`
