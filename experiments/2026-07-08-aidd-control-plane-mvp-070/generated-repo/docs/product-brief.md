# Product Brief: AIDD Control Plane MVP070

## 体験

ユーザーは、縮小済みAI Task PacketをCodexへ渡す直前に、execute_now、defer_next_increment、最低検証、3ブラウザ、証跡、rollback、AIDD-Spec接続を1枚のレシートとして確認する。

## ゴール

- execute_nowだけをCodex promptへ入れる。
- defer_next_incrementを次回送りとして見える化する。
- Firefox除外、failure screenshot不足、rollback不足、private URL混入をblockedにする。

## 非ゴール

- 実Codex API連携、GitHub API連携、DB永続化はしない。

## 主要フロー

1. emptyで不足項目を確認する。
2. validで手渡し可能なレシートを確認する。
3. blockedで危険なpromptと証跡不足を止める。
