# AIDD Control Plane Dogfood 002：画像素材と戦闘シーンを入れて、キャラ収集RPGを“遊べそう”に近づける

> 2026-07-02 / Codex Mastery Lab  
> 対象: AIDD Control Plane Dogfood / キャラ収集RPG / visual asset contract  
> 結果: **完全オリジナル画像素材を追加し、戦闘・編成・召喚画面の密度を上げても、15本の3ブラウザE2Eは維持できた**

## 前回の課題

前回 Trial 001 では、AIDD Control Planeを使って、キャラ収集RPGの体験パターンをAI Task Packetに落とし込んだ。

できたことは多い。

```text
ホーム
名簿
編成
遠征
戦闘
幻晶結果
育成
失敗状態
mock service
3ブラウザE2E
```

ただし、見た目はまだ「検証用UI」だった。

ユーザーが言ったように、キャラ収集RPGとして見るなら、画像素材と戦闘シーンが弱い。

そこで今回は、実在IPには寄せず、**スマホRPGとしての視覚密度** に寄せる。

## 今回の方針

守る線引きは明確にした。

```text
本物に寄せるもの:
  - 画面密度
  - 戦闘背景
  - 敵の存在感
  - 召喚演出
  - キャラ編成のビジュアル感
  - HPバーやスキル演出

寄せないもの:
  - 実在IPのロゴ
  - 公式キャラ
  - 公式画像
  - 公式文言
  - 公式UIの完全コピー
```

つまり、目標は「ロマサガRSのコピー」ではない。  
**キャラ収集型スマホRPGとして、一目で遊べそうに見えること** だ。

## 追加したオリジナル画像素材

今回、完全オリジナル素材を4種類作った。

```text
party-key-art.png       隊員キービジュアル
battle-ruins.png        戦闘背景
crystal-guardian.png    敵ボス
summon-altar.png        召喚/ガチャ演出背景
```

これらを `public/game-assets/` に配置し、Next.jsアプリから参照した。

## ホーム画面

![SagaForge Trial 002 ホーム](assets/2026-07-02-sagaforge-trial-002-home.png)

ホーム画面では、隊員キービジュアルを入れた。

前回は文字とカード中心だったが、今回は「このゲームの顔」になる画像を置いたことで、かなりスマホRPGらしくなった。

## 編成画面

![SagaForge Trial 002 編成](assets/2026-07-02-sagaforge-trial-002-party.png)

編成画面にも隊員ビジュアルを入れた。

ここで重要なのは、ただ画像を貼っただけではなく、既存の状態契約を壊していないこと。

```text
party_invalid
readiness score
出撃可能/不可能
```

はそのまま残している。

見た目を強くしても、検証できるUIであることは維持した。

## 戦闘シーン

![SagaForge Trial 002 戦闘](assets/2026-07-02-sagaforge-trial-002-battle.png)

今回一番大きく変えたのは戦闘シーン。

追加したもの：

```text
戦闘背景
敵ボス画像
味方パーティアイコン
スキル演出ラベル
隊列HPバー
敵HPバー
戦闘ログ
勝利/敗北バナー
```

これで、前回の「戦闘結果カード」から、かなりゲーム画面に近づいた。

ただし、E2Eが見るポイントは変えていない。

```text
battle_win で勝利表示が出る
party_invalid で戦闘前に編成不備が出る
```

見た目を増やしても、テストは状態契約を見る。  
ここがAIDD Control Planeらしいところだ。

## 召喚/ガチャ風画面

![SagaForge Trial 002 召喚](assets/2026-07-02-sagaforge-trial-002-gacha.png)

幻晶画面には召喚背景を追加した。

ここでも本物の課金や確率は扱わない。

扱うのは、あくまで：

```text
召喚風UI
結果カード
payment_failed状態
```

という検証可能な範囲だけ。

## 失敗状態

![SagaForge Trial 002 失敗状態](assets/2026-07-02-sagaforge-trial-002-failure.png)

失敗状態も維持した。

「本物っぽくする」と成功画面ばかり作りたくなる。  
でもAIDD-Spec的には、失敗状態こそ外してはいけない。

今回も `party_invalid` はE2Eで確認している。

## 検証ログ

![SagaForge Trial 002 terminal evidence](assets/2026-07-02-sagaforge-trial-002-terminal-evidence.png)

検証結果：

| command | result |
| --- | --- |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 5 tests passed |
| `pnpm run build` | pass |
| `pnpm run mock:doctor` | pass |
| `pnpm run test:e2e` | 15 tests passed |

E2Eは前回と同じく、5シナリオ × 3ブラウザ。

```text
Chromium
Firefox
WebKit
```

全部通った。

## 今回分かったこと

AIDD Control Planeには、次の項目が必要だ。

```text
visual asset contract
```

つまり、AI Task Packetにこう書くべき。

```text
必要な画像素材:
  - ホーム用キービジュアル
  - 編成用隊員ビジュアル
  - 戦闘背景
  - 敵ボス画像
  - 召喚演出背景

画像の制約:
  - 実在IPを使わない
  - ロゴ/公式キャラ/公式素材を使わない
  - 体験パターンだけ抽象化する

画面での使い方:
  - 戦闘画面は背景・敵・味方・HP・ログを同時に見せる
  - 召喚画面は演出背景と結果カードを分ける
  - 失敗状態は画像追加後も残す
```

今回の改善は、AIDD Control Plane側にも戻せる。

## 次回

次は、見た目だけでなく操作感を増やす。

Trial 003候補：

```text
戦闘中のコマンド選択
スキル選択
編成入れ替え
育成で数値が変わる
召喚結果を名簿へ反映する
```

今回で、プロトタイプは「検証用UI」から「遊べそうなスマホRPG」に一段近づいた。
