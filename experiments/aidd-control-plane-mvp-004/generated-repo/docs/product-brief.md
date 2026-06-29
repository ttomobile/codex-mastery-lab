# Product Brief: AIDD Control Plane MVP 004

## 目的

AIDD Control Planeを初めて見るユーザーが、粗いアプリ案を入力するだけで、開発ブリーフ、AI依頼書、検証計画、準備状況レビューを理解できる状態にする。

## 対象ユーザー

- AIでWeb/mobileアプリを作りたい初心者
- Codexに依頼する前の設計ドキュメントを作りたい開発者
- チームでAI駆動開発の品質を揃えたいリードエンジニア

## 主要フロー

1. ユーザーがアプリ名、種別、対象ユーザー、課題を入力する。
2. 主要機能、非ゴール、外部連携を1行ずつ入力する。
3. 状態契約と品質ゲートをチェックボックスで選ぶ。
4. Product Brief、AI Task Packet、Verification Plan、Codex Promptが即時生成される。
5. Readiness Reviewで不足項目と次に聞くべき質問を確認する。

## 非ゴール

- 外部AI APIの呼び出し
- ログイン、課金、本番DB永続化
- GitHub Actions連携
- ブラウザ保存領域への永続化

## 成功条件

- 初期状態がemptyとして見える。
- 必須項目不足がinsufficientとして見える。
- 必須項目が揃うとreadyとして見える。
- 生成物に状態契約と品質ゲートが含まれる。
