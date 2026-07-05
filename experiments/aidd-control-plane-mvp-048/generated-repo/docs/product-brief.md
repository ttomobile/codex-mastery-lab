# Product Brief: AIDD Control Plane MVP 048

## 体験

One-Run Execution Readiness Gateは、Review Finding Action Queueから選ばれた`execute_now`をCodex実行へ渡す直前に確認するSaaS画面です。次回計画やLearning Log更新を同じ実行に混ぜず、1回の実行に必要なcommand、sandbox、検証、証跡、停止条件、AIDD-Spec接続だけを確認します。

## ゴール

- empty / ready / blockedの3状態を表示する。
- readyでは`execute_now` 1件だけをCodex command previewへ表示する。
- blockedでは危険command、検証不足、Firefox除外、terminal evidence不足、failure screenshot不足、rollback stop condition不足、公開不可情報混入、AIDD-Spec connection不足を日本語で表示する。
- AIDD-Spec v0.1、Verification Evidence、Review Record、Learning Logへの接続を利用者が確認できるようにする。

## 非ゴール

- 実際のCodexプロセス起動。
- 外部APIや実リポジトリへの書き込み。
- Review Finding Action Queue自体の優先順位決定。

## 主要ユーザーフロー

1. emptyで実行前入力がまだないことを確認する。
2. readyで`execute_now` 1件のsource queue id、sandbox、検証コマンド、Codex command previewを確認する。
3. blockedで実行前に止めるべきReview Findingを確認し、Review RecordやLearning Logへ戻す。
