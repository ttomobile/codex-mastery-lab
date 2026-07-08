# SagaForge Trial 055: 起動直後の司令室でホーム/スタイル/5人編成/周回判断を束ねる

前回までの SagaForge / 星紋遠征隊は、スタイルカード、5人編成、陣形、クエスト、BP/OD風バトル、召喚後の仕分け、周回デッキまで増えていました。けれど、ユーザー評価の「全然ロマサガRSとは程遠い」はまだ有効です。理由は、部品は増えても、起動直後にスマホRPGらしく「今日何を受け取り、誰を育て、どの5人で、どこを周回し、勝利後どこへ戻るか」を一目で判断する密度が弱かったからです。

今回も実在IP・公式素材・商標・ロゴ・公式キャラ・公式文言・公式確率は使っていません。記事文脈ではロマサガRS的な期待差分と呼びますが、アプリ本体は非侵害のオリジナル表現です。

## 前回の何が遠かったか

- ホームに機能カードは多いが、起動直後の最上段でスマホRPGの日課判断が完結しなかった。
- スタイル、5人編成、陣形、周回先、BP/OD予約は存在していたが、初見では別々の画面を探す必要があった。
- 「前より部品は増えた」が、「ホームから出撃準備へ入る手触り」がまだ一般的なファンタジーRPGの説明画面に近かった。

## 今回潰した差分

1. **起動直後の高密度ホーム**
   - `Trial 055: 起動直後のスマホRPG司令室` をホーム最上段に追加。
   - 今日の資源、育成スタイル、周回クエスト、予約戦術、勝利後の戻り先を1枚に束ねました。

2. **スタイル/5人編成/陣形の即時可視化**
   - 司令室内に5人編成ミニ表示を追加。
   - 陣形名、陣形補正、前衛/中衛/後衛、クエスト弱点を起動直後に読めます。

3. **ホームから周回準備へ入る操作**
   - `司令室から即出撃` ボタンを追加。
   - 育成候補を選び、周回デッキと5人予約を更新し、クエスト確認へ進みます。

## スクリーンショット

![Trial 055 ホーム司令室](assets/2026-07-08-character-collection-rpg-trial-055-home.png)

![Trial 055 司令室から周回確認へ](assets/2026-07-08-character-collection-rpg-trial-055-quest.png)

## 触れるプレイアブル

公開URL: PUBLIC_PLAYABLE_URL/sagaforge-app/index.html

ローカルの正本は `playables/sagaforge-app/index.html` です。`scripts/build_preview.py` により `preview/sagaforge-app/` へコピーされる状態を維持しました。

## 検証ログ

```text
node script parse: ok / Trial 055 marker found / mobileCommandBoard bindings found
python3 scripts/build_preview.py: Wrote 138 articles to preview
playwright local interaction: title=星紋遠征隊 SagaForge Trial 055 / commandBoard=5 / afterClick=クエスト
public URL: /sagaforge-app/index.html http=200
public asset: /sagaforge-app/assets/party-key-art.png http=200
public asset: /sagaforge-app/assets/battle-ruins.png http=200
public asset: /sagaforge-app/assets/crystal-guardian.png http=200
public asset: /sagaforge-app/assets/summon-altar.png http=200
```

## まだ遠い点

- 本物のスマホRPGにある、ホーム演出、告知バナー切替、デイリー報酬受取演出、育成結果の気持ちよさはまだ薄い。
- 戦闘はBP/OD/連携の構造を持つが、テンポ、演出、敵行動の見せ方はまだ軽い。
- スタイルごとの個性は増えたものの、スタイル差による戦術変化や周回適性の体感はさらに強められる。

## 次に潰す差分

次は **Trial 056: ホームから戦闘リザルトまでの1周を、報酬・能力値上昇・ピース突破候補が連鎖して見える形にする** 予定です。特に、勝利後の能力アップ、技Rank、ピース、交換、再戦をもっと「周回したくなる結果画面」に寄せます。

## AIDD-Specへの学び

今回の差分は、AIDD-Specの AI Task Packet に「画面がある」だけでなく「起動直後の主要判断がどこで完結するか」を書かないと、AIは部品を追加して満足しがちだという学びです。料理で言えば、材料名だけではなく、最初の一皿を何分でどう出すかまでレシピに書く必要があります。
