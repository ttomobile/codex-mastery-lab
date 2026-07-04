# Product Brief: AIDD Control Plane MVP 032

## 体験

Codex Run Queueは、Run Authorization Gateで承認されたCodex実行を、実行待ち・実行中・成功・失敗・証跡不足として追跡する画面です。

## ゴール

- Run Authorization Gate valid由来のqueue itemだけを実行対象にする。
- 検証コマンド、Chromium / Firefox / WebKit、terminal / screenshot / playwright evidence、retry、rollback、AIDD-Spec接続をqueue itemごとに確認する。
- 危険command、Firefox除外、浅い検証、証跡不足、rollback不足をReview Findingへ変換する。

## 非ゴール

- 実際のCodexプロセス起動。
- Git commit / Pull Request作成。
- 外部LLM/API実行。

## 主要ユーザーフロー

1. `queue empty` で実行queue未生成を確認する。
2. `queue valid` でwaiting / running / succeededのqueueカードと検証・証跡・retry/rollbackを確認する。
3. `queue failure` でfailed / evidence_missing、危険command、Firefox除外、浅い検証、証跡不足、rollback不足を確認する。

## AIDD-Spec接続

AIDD-Spec v0.1 / AI Task Packet / Verification Evidence / Review Record / Learning Log / Rollback Plan。
