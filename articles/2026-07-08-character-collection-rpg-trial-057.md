# SagaForge Trial 057: 戦闘テンポ短縮で5人予約を「押して気持ちよい」流れへ寄せる

前回の Trial 056 では、勝利後に能力値、技Rank、ピース、交換、再戦がつながるリザルト連鎖を追加しました。これで「勝って終わり」から「もう1周する理由」へ少し近づきました。

ただし、ユーザー評価の「全然ロマサガRSとは程遠い」はまだ残っています。特に戦闘中の気持ちよさが、長いログと多数の説明カードに散っており、5人がテンポよく動くスマホRPGらしい体験にはまだ遠い状態でした。

今回も実在IP・公式素材・商標・ロゴ・公式キャラ・公式文言・公式確率は使っていません。記事文脈ではロマサガRS的な期待差分と呼びますが、アプリ本体は非侵害のオリジナル表現です。

## 前回の何がロマサガRSから遠かったか

- 勝利後リザルトは増えたが、戦闘中の「予約→弱点→連携→結果」のテンポがまだログ依存だった。
- 5人予約、BP、OD、弱点、追撃、リザルトが別々の説明欄に分散し、短時間で気持ちよく読めなかった。
- 「ボタンを押すとHPが少し変わる」段階からは進んだが、5人が一斉に動く感覚はまだ弱かった。

## 今回どの差分を潰したか

1. **戦闘テンポ短縮ボードを追加**
   - ホームと戦闘画面に `Trial 057: 戦闘テンポ短縮` を追加。
   - 5人予約を「号令準備、前衛起点、弱点差込、連携追撃、結果戻り」の5ステップに圧縮しました。

2. **テンポ重視で出撃準備する導線を追加**
   - ホームから `テンポ重視で出撃準備` を押すと、OD寄りの戦術プリセット、3周予約、OD上昇をまとめて戦闘へ接続します。
   - 単なる説明ではなく、すぐ戦闘画面でテンポリールを触れます。

3. **テンポ連携の実行ボタンを追加**
   - 戦闘中に `テンポ連携を実行` を押すと、敵勢HP、OD、弱点ミッション、戦闘ログがまとめて更新されます。
   - BP超過時は1枠を通常攻撃へ寄せる調整も入れ、ただ失敗で止まらないようにしました。

## スクリーンショット

![Trial 057 ホームの戦闘テンポ導線](assets/2026-07-08-character-collection-rpg-trial-057-home-tempo.png)

![Trial 057 戦闘テンポ準備](assets/2026-07-08-character-collection-rpg-trial-057-battle-ready.png)

![Trial 057 テンポ連携実行後](assets/2026-07-08-character-collection-rpg-trial-057-battle-tempo.png)

## 触れるプレイアブル

公開URL: PUBLIC_PLAYABLE_URL/sagaforge-app/index.html

ローカルの正本は `playables/sagaforge-app/index.html` です。`scripts/build_preview.py` により `preview/sagaforge-app/` へコピーされる状態を維持しました。

## 検証ログ

```text
node --check /tmp/sagaforge-script.js: ok
playwright local interaction: title=星紋遠征隊 SagaForge Trial 057 / homeRail=5 / battleRail=5 / summary includes STEP 5/5
python3 scripts/build_preview.py: Wrote 141 articles to preview
public URL: /sagaforge-app/index.html http=200
public asset: /sagaforge-app/assets/party-key-art.png http=200
public asset: /sagaforge-app/assets/battle-ruins.png http=200
public asset: /sagaforge-app/assets/crystal-guardian.png http=200
public asset: /sagaforge-app/assets/summon-altar.png http=200
```

## まだ遠い点

- 5ステップのカード化はできたが、実際のアニメーション、SE、カットイン、速度調整はまだ簡易的です。
- スタイル固有技ごとの見た目差や、敵の複数行動に対するリアクションはまだ薄いです。
- ホーム、ガチャ、育成、戦闘が一通りつながってきた一方で、周回を何十回も続けたくなる報酬設計はまだ浅いです。

## 次に潰す差分

次は **Trial 058: スタイル固有性と技演出差** として、スタイルごとに違う技演出カード、弱点適性、Rank上昇、継承候補をより強く出し、同じ5人編成でも「どのスタイルを使うか」が戦闘テンポに影響する状態へ寄せます。

## AIDD-Specへの学び

AI Task Packet に「ターン制バトル」と書くだけでは足りません。料理のレシピで言えば、材料名だけでなく、どの順番で火を入れると食感がよくなるかまで書く必要があります。今回の差分は、戦闘についても「入力、解決順、演出粒度、リザルト戻り先」を上流で指定する必要がある、という学びです。
