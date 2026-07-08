# SagaForge Trial 054: 目的別「周回デッキ」でホーム/スタイル/クエスト/戦闘を1枚につなぐ

公開プレイアブル: [星紋遠征隊 SagaForge](sagaforge-app/index.html)

## 前回の何がロマサガRSから遠かったか

前回 Trial 053 では、初回30秒で「ホーム資源 → スタイル → 5人編成 → クエスト → 予約連携 → 勝利後育成」へ進める導線を足した。これは汎用ファンタジーRPGからは前進したが、まだ次の弱さが残っていた。

- 機能カードは増えたが、「今日は何目的でどこを周回するか」というスマホRPGらしい日課判断が薄い。
- スタイル育成対象、陣形、クエスト、5人予約技、勝利後の戻り先が別々の説明として見え、1つの作戦として選びにくい。
- 初回導線はあるが、2回目以降の周回・ピース回収・OD連携狙いを選ぶ体験がまだ弱い。

## 今回どの差分を潰したか

Trial 054 では、プレイアブル版に **目的別 周回デッキ** を追加した。

![Trial 054 home](../assets/2026-07-08-character-collection-rpg-trial-054-home.png)

追加したデッキは次の3種類。

| デッキ | 目的 | まとめて変わるもの |
|---|---|---|
| 育成3周デッキ | 基礎能力と技Rankを安定して伸ばす | 対象スタイル、NORMALクエスト、陣形、5人予約、3周予約 |
| ピース回収デッキ | 未所持/限界突破候補のピースを集める | VERY HARD系クエスト、OD寄り陣形、召喚Pt補助、記録帳への戻り先 |
| OD連携デッキ | BPを貯めて五連カットイン風テンポを狙う | HARDクエスト、堅守陣形、OD初期値、5人予約技、戦闘テンポリール |

これにより、単に「クエストを選ぶ」ではなく、**スタイル育成目的 → クエスト → 5人編成/陣形 → 予約技 → 勝利後の育成/交換** が1枚のカードとして触れるようになった。

![Trial 054 battle](../assets/2026-07-08-character-collection-rpg-trial-054-battle.png)

## 実装メモ

プレイアブル `playables/sagaforge-app/index.html` に以下を追加した。

- ホームの `Trial 054: 目的別 周回デッキ` パネル
- クエスト画面の `Trial 054: クエスト別 周回デッキ` パネル
- `loopDecks` データ構造
- `renderLoopDecks()`
- `applyLoopDeck(id)`
- 初回30秒導線の3番目を「5人編成」から「周回デッキ」へ変更

今回も、実在IP・公式素材・商標・ロゴ・キャラ・公式文言・公式確率はアプリ本体へ入れていない。記事の文脈ではユーザー評価を説明するために参照するが、アプリは非侵害の抽象体験として維持している。

## 検証

保存ログ:

- `experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-054/terminal/preview-and-js-smoke.log`
- `experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-054/terminal/generated-repo-gates.log`
- `experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-054/terminal/public-url-check.log`

実行した主な確認:

```text
python3 scripts/build_preview.py
node --check extracted-playable-script
Playwright smoke: ホーム表示、周回デッキ表示、ピース回収デッキ操作、戦闘画面表示
curl public playable URL: http=200
curl key asset URL: http=200
```

## まだ遠い点

- デッキを選んでも、敵編成や報酬テーブルがまだ十分に複雑ではない。
- 周回デッキの結果予測はカード表示中心で、実際の周回速度・AUTO継続・リザルト演出はまだ軽い。
- スタイル別の別衣装/別ロール比較はあるが、長期育成の手触りはまだ浅い。

## 次に潰す差分

次は **Trial 055: 周回デッキ選択後のリザルト演出と再戦テンポ** を優先したい。

- デッキごとに勝利リザルトの見た目を変える。
- 3周AUTO後に、ピース・技Rank・能力値・交換候補をまとめたリザルト演出を強化する。
- 「再戦」「育成」「交換」「召喚」へ戻るボタンを、選んだデッキの目的に合わせて並び替える。

## 公開URL

- プレイアブル: `PUBLIC_PREVIEW_URL/sagaforge-app/index.html`
