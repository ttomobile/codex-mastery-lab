# AIDD Control Plane Dogfood 021：SagaForgeにスタイル詳細・アビリティ・交換所を足す

Trial 020では、5人編成、陣形切替、章/難易度つきクエスト、勝利後の能力値アップ、再戦導線まで入れた。これで「ただHPが少し変わるだけ」からは進んだが、ユーザーが期待するキャラ収集スマホRPGの手触りから見ると、まだ薄い層が残っていた。

## 前回の何がロマサガRSから遠かったか

ユーザー評価の「全然ロマサガRSとは程遠い」を、引き続き改善の起点にした。Trial 020時点で遠かったのは次の3点。

1. **スタイルカードが一覧表示止まりだった**  
   レアリティ、ロール、武器、属性、Lv、技Rankは見えたが、耐性、アビリティ、継承技、覚醒コストを見る判断がなかった。
2. **バトルが数値操作中心だった**  
   BP/OD/複数スキルは入ったが、ターン中にアビリティが発動してテンポが変わる感覚が弱かった。
3. **周回報酬の使い道が浅かった**  
   勝利報酬に記憶片や素材は出たが、交換所や育成資源へつながる導線がまだ弱かった。

## 今回どの差分を潰したか

今回は記事より先に `playables/sagaforge-app/index.html` をTrial 021へ更新した。アプリ本体には実在IP名、公式素材、ロゴ、商標、公式文言、公式確率を入れていない。

- **スタイル詳細を追加**
  - スタイルカードをタップすると、耐性、アビリティ、継承技、覚醒状態が表示される。
  - 「キャラを見る」ではなく「どのスタイルを育てるか」を判断する画面に寄せた。
- **戦闘中アビリティ発動ログを追加**
  - スキル使用時に `星紋鼓舞: BP+1 / OD+8` などの発動ログが出る。
  - 勝利時にも記憶片増加のアビリティログを残す設計にした。
- **イベント交換所を追加**
  - 下部ナビに `交換` を追加。
  - 記憶片をSS輝片、訓練書、スタイルピース、スタミナ回復へ交換できる。
  - 周回報酬が育成と再出撃に戻る流れを明示した。

![Trial 021 ホーム](assets/2026-07-04-character-collection-rpg-trial-021-home.png)

![Trial 021 スタイル詳細](assets/2026-07-04-character-collection-rpg-trial-021-style-detail.png)

![Trial 021 バトル中アビリティ](assets/2026-07-04-character-collection-rpg-trial-021-battle-ability.png)

![Trial 021 交換所](assets/2026-07-04-character-collection-rpg-trial-021-exchange.png)

![Trial 021 失敗状態](assets/2026-07-04-character-collection-rpg-trial-021-failure.png)

## 検証ログ

変更範囲は静的プレイアブルなので、プレビュー生成、Playwright操作、スクリーンショット取得、公開URLのHTTP確認を行った。

```text
Wrote 73 articles to WORKSPACE/preview
Playwright local verification:
- title: 星紋遠征隊 SagaForge Trial 021
- style detail includes: true true true
- ability log visible: 7
- exchange log: SS輝片x5を交換。育成/出撃資源に反映しました。
- failure: 幻晶購入のmock決済が失敗しました。残高は増やしません。
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

まだ本物の商用スマホRPGの体験密度には遠い。

- スタイル詳細は表示だけで、継承技の付け替えや覚醒ツリーの分岐操作がない。
- アビリティはログ中心で、発動条件、重複、状態異常、敵行動との噛み合いが弱い。
- 交換所は素材交換だけで、イベントポイント累計、限定報酬、交換上限、優先度判断がない。
- バトル演出はまだカットイン、連携順の演出、敵行動の緊張感が足りない。
- ホームにお知らせ、ショップ、ログインボーナス、イベント期間、未受取バッジの階層が不足している。

## 次に潰す差分

次回は、次の1〜3点に絞る。

1. **継承技の付け替え**：スタイル詳細から継承技を選び、BPコストと行動候補を変える。
2. **敵行動と状態異常**：敵複数体が攻撃し、毒/スタン/防御低下などをログと数値へ反映する。
3. **イベント交換の優先度判断**：交換上限、限定ピース、累計ポイント報酬を追加し、周回目的を強める。

## AIDD-Specへの戻し

今回の学びは、AI Task Packetに「スタイル育成」「BP/OD」「周回報酬」とだけ書いても、画面同士の循環が浅くなりやすいということだった。スマホRPGらしさを出すには、**カード詳細で判断し、戦闘で発動し、報酬を交換し、育成へ戻る**という一連の変化を受け入れ条件に入れる必要がある。

次回以降のAI Task Packetには、次を追加する。

- スタイル詳細は、耐性、アビリティ、継承技、覚醒/突破コストを表示する。
- 戦闘中は、スキル結果だけでなくアビリティ発動とBP/OD変化をログに残す。
- 周回報酬は、交換所、育成素材、再出撃資源へ接続する。

## 公開URL

プレイアブル版：`/sagaforge-app/index.html`
