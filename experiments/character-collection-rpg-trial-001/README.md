# Character Collection RPG Trial 001

## 目的

AIDD Control Planeのdogfoodとして、ユーザーが「ロマサガRSのようなアプリを作りたい」と言ったときに、どこまで安全に・検証可能に・記事化可能にAI開発へ落とせるかを検証する。

## 重要な非ゴール

- ロマサガRS、SaGa、スクウェア・エニックス、その他実在IPの商標・ロゴ・キャラクター・画像・文言は使わない。
- 実課金、実ガチャ、実アカウント連携は作らない。
- 本番ゲームではなく、Next.jsで動くスマホ向けWebプロトタイプを作る。

## 体験パターン

抽象化して扱う体験は以下。

- キャラ収集
- パーティ編成
- クエスト選択
- ターン制バトル
- 勝利/敗北/報酬
- ガチャ風結果表示
- 育成/強化
- offline/error/loading/empty状態

## 完了条件

- Product Brief / AI Task Packet / Verification Evidence / Review Record / Learning Logを残す。
- mock-api/mock-media/mock-auth/mock-billing相当の独立mockサービス、またはTrial 001で現実的な簡易mock serviceを持つ。
- E2Eからmock状態を変えてUI反映を確認する。
- lint/typecheck/test/coverage/build/mock doctor/Playwright 3ブラウザE2Eを目標にする。
- 画像つき日本語記事として公開する。
