# Product Brief

## 体験

AIDD Control Plane MVP067は、Public Preview Smoke Verifierが検出した失敗を、次に実行できるReview Finding Action Queueへ変換する。

## ゴール

- broken URL、HTTP status、byte size、content typeからFindingを作る
- execute_now / next_increment / learning_logを分ける
- execute_nowだけをAI Task Packet patch previewとCodex prompt previewへ書き出す
- Chromium / Firefox / WebKit、terminal evidence image response、AIDD-Spec v0.1接続を確認する

## 非ゴール

- 実際のGitHub API連携はしない
- 外部preview URLへ本当にfetchしない
- 今回はRun Queue Intakeへの自動投入までは行わない
