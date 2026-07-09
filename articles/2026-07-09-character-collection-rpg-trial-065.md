# SagaForge Trial 065: ホーム起点のランチャーでスタイル・5人編成・クエスト・Round戦闘をつなぐ

前回までのSagaForgeは、ユーザー評価の「ロマサガRSとは程遠い」に対して、ホームの情報密度、スタイル単位の育成、5人編成、クエスト、Round/BP/OD風の戦闘、勝利後報酬を少しずつ増やしてきた。ただし、まだ **ホームで押した操作が下部ナビをまたいで各画面へ進み、最終的にRound戦闘と報酬へ到達する手触り** が弱かった。

Trial 065では、記事化より先に `playables/sagaforge-app/index.html` を更新し、ホームに「下部ナビをまたぐ日課クエストランチャー」を追加した。実在IP・公式素材・商標・ロゴ・公式文言・公式確率は使わず、スマホのキャラ収集RPGで期待される体験パターンだけを非侵害の形で抽象化している。

公開プレイアブル:

- `/sagaforge-app/index.html`

## 前回の何がまだ遠かったか

- ホームは濃くなったが、スタイル・編成・クエスト・戦闘が「同じ日課の進行」として見えにくかった。
- スタイルカードや5人編成は存在するが、ホームのボタンから実際にそこへ移動して判断する導線が弱かった。
- Round/BP/OD風の戦闘はあるが、ホーム起点の1操作が報酬まで到達する実感がまだ薄かった。

## 今回潰した差分

| 差分 | Trial 065の対応 |
|---|---|
| ホームから画面遷移が弱い | 5ノードの進行レールを追加し、ホーム→スタイル→5人編成→クエスト→Round/報酬の到達段階を可視化した |
| スタイルカードが独立して見える | 「スタイル確認へ」ボタンで育成主役のスタイル詳細へ遷移し、Lv・技Rank・ピース・継承を確認できるようにした |
| 編成と戦闘がつながりにくい | 「5人編成へ」で陣形変更・前衛/中衛/後衛・予約技を更新し、「Round戦闘へ」で短縮勝利と報酬カードまで進めるようにした |

## スクリーンショット

![Trial 065 home](../assets/2026-07-09-character-collection-rpg-trial-065-home.png)

![Trial 065 battle result](../assets/2026-07-09-character-collection-rpg-trial-065-battle-result.png)

![Trial 065 terminal evidence](../assets/2026-07-09-character-collection-rpg-trial-065-terminal-evidence.png)

## 実装メモ

- `playables/sagaforge-app/index.html` のタイトルを Trial 065 に更新。
- ホームに `trial065` パネル、5ノード進行レール、判断カード、4つの遷移ボタンを追加。
- `trial065State()` / `renderTrial065()` / `trial065Launch()` を追加。
- `renderAll()` に `renderTrial065()` を組み込み、既存のホーム/スタイル/編成/クエスト/戦闘データと同期。
- `scripts/build_preview.py` に Trial 065 の記事順と画像コピー対象を追加。

## 検証ログ抜粋

```text
python3 scripts/build_preview.py
Wrote 154 articles to preview

node --check extracted-sagaforge-script.js
# exit=0

local preview checks
/sagaforge-app/index.html -> http=200
/sagaforge-app/assets/party-key-art.png -> http=200
/sagaforge-app/assets/battle-ruins.png -> http=200
/sagaforge-app/assets/crystal-guardian.png -> http=200
/sagaforge-app/assets/summon-altar.png -> http=200
```

## まだ遠い点

- 本物の運営型スマホRPGのようなイベント切替、スタイル別の細かい成長差、複数Roundの演出密度はまだ粗い。
- 召喚演出はカード分類中心で、演出段階・期待感・重複ピース変換の気持ちよさはさらに増やせる。
- バトルは短縮勝利ボタンで体験を見せている段階で、敵行動・複数Wave・OD発動条件の駆け引きはまだ簡略化されている。

## 次に潰す差分

次回は、**バトル内の5人コマンド予約をよりスマホRPGらしい戦闘テンポへ寄せる**。具体的には、Round開始時の敵弱点表示、BP回復、OD/連携の溜まり方、勝利後のスタイル成長カードを、より少ないタップで読めるようにする。
