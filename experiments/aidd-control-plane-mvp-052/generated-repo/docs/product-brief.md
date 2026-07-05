# Product Brief: Codex Run Budget Gate

## 対象体験

AIDD Control Planeで採用済みRepair DeltaをCodexへ渡す直前に、実行予算、停止条件、fallback action、3ブラウザ検証を確認する。

## ゴール

- go / brake / stopを実行前に判断する
- 採用済みdeltaだけをCodex promptへ渡す
- 利用枠過多や停止条件不足ならCodex実行を止める
- Verification Evidence / Review Record / Learning Logへ判断を残す

## 非ゴール

- Codex CLIそのものの利用枠を外部APIで変更しない
- 実サービスの認証や課金に接続しない
- AIの自動実装品質を保証しない

## 主要ユーザーフロー

1. empty: 実行候補packetがないため停止する
2. ready: 利用枠、停止条件、fallback action、Chromium / Firefox / WebKitを確認してgoにする
3. failure: primary/secondary usage過多、停止条件不足、証跡不足、local path混入を検出しstopにする
