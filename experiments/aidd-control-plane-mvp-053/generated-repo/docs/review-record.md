# Review Record: MVP053

## 判断

AIDD Control Plane MVP053として、STOP/BRAKE時にAI Task Packetを自動縮小する提案を採用する。

## 理由

MVP052のRun Budget Gateでbrakeまたはstopになった後、次の行動が曖昧だと実装範囲が広がる。縮小後AI Task Packet提案に`keep_now`、`defer_next_increment`、`minimum_verification`、`fallback_action`、`resume_condition`、`evidence_paths`、`prompt_preview`を入れることで、停止後も再開可能な粒度を保てる。

## 確認

- ready / brake / stopの3ケースをUIで表示する。
- brake / stopでは縮小後AI Task Packet提案を表示する。
- local path、private host、private URLを公開前ブロックとして検出する。
- 提案内の表示は`WORKSPACE`または`HOME`へサニタイズする。
