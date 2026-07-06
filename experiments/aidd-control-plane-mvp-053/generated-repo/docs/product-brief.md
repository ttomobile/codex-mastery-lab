# Product Brief: AIDD Control Plane MVP053

## 体験

MVP052のRun Budget Gateでready / brake / stopを判断した後、brakeまたはstopになったAI Task Packetを人が手で削る前に、次に実行できる最小単位へ自動縮小する提案を表示する。

## 差別化したゴール

- ready / brake / stopの3ケースを日本語UIで比較できる。
- brake / stopでは「縮小後AI Task Packet提案」を必ず表示する。
- 提案には`keep_now`、`defer_next_increment`、`minimum_verification`、`fallback_action`、`resume_condition`、`evidence_paths`、`prompt_preview`を含める。
- local path、private host、private URLを公開前ブロックとして検出する。
- 縮小提案の表示では、検出した値を`WORKSPACE`または`HOME`へサニタイズする。

## 非ゴール

- 実際のCI実行や外部サービス連携はしない。
- 実サービスの商標、ロゴ、コピーは使わない。
- AIによる自動実行までは行わず、提案表示と検証に絞る。

## 主要ユーザーフロー

1. ユーザーがreadyケースを開き、縮小提案が不要であることを確認する。
2. ユーザーがbrakeケースへ切り替え、公開前ブロックと縮小後AI Task Packet提案を確認する。
3. ユーザーがstopケースへ切り替え、fallback actionとresume conditionで停止後の再開条件を確認する。
4. doctor:aiddと3ブラウザE2Eで、MVP053固有token、縮小提案、sanitize、画像名を確認する。
