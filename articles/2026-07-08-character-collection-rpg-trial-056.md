# SagaForge Trial 056: 勝利後リザルト連鎖で「もう1周したい」育成ループへ寄せる

前回の Trial 055 では、起動直後の司令室に、上部資源、育成スタイル、5人編成、周回クエスト、予約戦術を束ねました。これは「どこを押せばよいか分からない」問題を少し減らしました。

ただし、ユーザー評価の「全然ロマサガRSとは程遠い」はまだ残っています。特に、勝利した後に能力値、技Rank、ピース、突破、交換、再戦が連鎖して見える気持ちよさが弱く、単に戦闘が終わるだけに見えました。

今回も実在IP・公式素材・商標・ロゴ・公式キャラ・公式文言・公式確率は使っていません。記事文脈ではロマサガRS的な期待差分と呼びますが、アプリ本体は非侵害のオリジナル表現です。

## 前回の何がロマサガRSから遠かったか

- ホームから出撃準備へ進めるようになったが、勝利後の報酬と育成の連鎖がまだ軽かった。
- 能力値アップ、技Rank、ピース、交換所、再戦が個別部品としてはあっても、1周の結果として一目で読みにくかった。
- 「周回したい理由」が、戦闘後の画面上で十分に押し出されていなかった。

## 今回どの差分を潰したか

1. **勝利後リザルト連鎖ボードを追加**
   - ホームと戦闘後に `Trial 056: 勝利後リザルト連鎖` を追加。
   - 能力値、技Rank、ピース、次の一手を4カードで表示します。

2. **1周結果を疑似再生できる操作を追加**
   - `1周結果を疑似再生` ボタンで、戦闘後リザルトをすぐ確認できます。
   - スタイルのHP、技Rank、ピース、記憶片、技書、贈り物が増えます。

3. **報酬を育成へ反映する導線を追加**
   - `報酬を育成へ反映` で、記憶片/技書を育成素材に変換し、育成画面へ移動します。
   - 勝利後に「育成へ戻る」「交換へ戻る」「再戦する」の判断が見えるようになりました。

## スクリーンショット

![Trial 056 ホームのリザルト連鎖](assets/2026-07-08-character-collection-rpg-trial-056-home.png)

![Trial 056 戦闘後リザルト連鎖](assets/2026-07-08-character-collection-rpg-trial-056-result.png)

![Trial 056 育成反映](assets/2026-07-08-character-collection-rpg-trial-056-training.png)

## 触れるプレイアブル

公開URL: PUBLIC_PLAYABLE_URL/sagaforge-app/index.html

ローカルの正本は `playables/sagaforge-app/index.html` です。`scripts/build_preview.py` により `preview/sagaforge-app/` へコピーされる状態を維持しました。

## 検証ログ

```text
node script parse: ok / Trial 056 marker found / resultLoopHome and resultLoopBattle found
python3 scripts/build_preview.py: Wrote 139 articles to preview
playwright local interaction: title=星紋遠征隊 SagaForge Trial 056 / homeLoop=4 / battleLoop=4 / trainingLog includes Trial 056
public URL: /sagaforge-app/index.html http=200
public asset: /sagaforge-app/assets/party-key-art.png http=200
public asset: /sagaforge-app/assets/battle-ruins.png http=200
public asset: /sagaforge-app/assets/crystal-guardian.png http=200
public asset: /sagaforge-app/assets/summon-altar.png http=200
```

## まだ遠い点

- 戦闘演出そのものはまだ軽く、連携時のカットイン、テンポ、敵行動の手応えは不足しています。
- スタイルごとの固有性は増えていますが、スタイル差で周回適性が大きく変わる感覚はさらに強化できます。
- ホーム告知、デイリー報酬受取、ミッション達成演出、ガチャ演出の段階的な気持ちよさはまだ薄いです。

## 次に潰す差分

次は **Trial 057: 戦闘テンポの強化** として、5人予約行動をより短いテンポで解決し、弱点、BP回復、OD/連携、ダメージポップ、勝利リザルトまでの流れをさらにスマホRPGらしくします。

## AIDD-Specへの学び

今回の差分は、AI Task Packet に「戦闘ができる」だけでなく、「戦闘後に何が増え、どの画面へ戻り、なぜもう1周したくなるのか」を書く必要がある、という学びです。料理で言えば、料理を出すだけでなく、食べ終わった後に次に何を選びたくなるかまで献立に含める感覚です。
