# API Failure State Evidence

## 概要

`fixed-app` は、日本語UIの静的な読書ログ同期ビューアです。API境界は `script.js` の `requestReadingLogs` に分離し、UI描画は安全なDOM APIで行います。外部ネットワーク資産は使っていません。

## 確認した失敗状態

- オフライン: `scenario=offline` のラジオボタンで「オフラインのため同期できません」を表示し、再試行ボタンを残します。
- タイムアウト: `scenario=timeout` では `AbortController` と `setTimeout` により「タイムアウトしました」を表示します。
- サーバーエラー: `scenario=server-error` では 500 相当のサーバーエラーとして日本語メッセージを表示します。
- 再試行: 現在選ばれている `data-scenario` / `scenario` のまま再試行ボタンで再読み込みできます。

## recovery 方針

エラー時も検索入力と既存データは保持します。利用者は検索語や読書メモを再入力せずに、状態を成功へ戻して再試行できます。

## 検証コマンド

```bash
node --check experiments/2026-06-29-api-failure-state/fixed-app/script.js
python3 experiments/2026-06-29-api-failure-state/audit_api_failure_state.py experiments/2026-06-29-api-failure-state/fixed-app
```

## 既知制約

- 静的プロトタイプのため、実API通信や永続保存は行いません。
- タイムアウトはデモ用に短い待ち時間で発生させています。
- 検索は現在保持している読書ログのタイトル、著者、メモだけを対象にします。
