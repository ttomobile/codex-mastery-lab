# Review Record: MVP054

## 判断

AIDD Control Plane MVP054として、縮小版AI Task Packetを次回実行へ渡す前のハンドオフレシートを採用する。

## 理由

MVP053のShrink Plannerが作った縮小計画は、受け渡し時点で公開可能性と検証条件を確認する必要がある。縮小版ハンドオフレシートに`source_shrink_plan_id`、`execute_now`、`defer_next_increment`、`minimum_verification`、`codex_prompt_preview`、`required_evidence`、`rollback_condition`、`aidd_spec_connections`を入れることで、次回実行へ渡してよい状態かを判定できる。

## 確認

- empty / valid / blockedの3ケースをUIで表示する。
- validでは縮小版ハンドオフレシートを表示する。
- blockedでは公開前ブロック5種類と修正指示を表示する。
- local path、private host、private network URLの表示は`WORKSPACE`または`HOME`へサニタイズする。
