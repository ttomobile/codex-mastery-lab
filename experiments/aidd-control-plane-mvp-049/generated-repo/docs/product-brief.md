# Product Brief: AIDD Control Plane MVP 049

## 体験

Verification Run Detail Drilldownは、Codex Run Queueの1件をcommand別の検証明細として読むSaaS画面です。`lint`、`typecheck`、`test`、`build`、`test:e2e`、`doctor:aidd`のexit code、duration、terminal log path、artifact path、失敗分類、修正指示を1画面で確認し、Review Finding draftへ渡します。

## ゴール

- empty / ready / failureの3状態を表示する。
- readyではsource queue item、source run status、commit SHA、6つのcommand別detail、Chromium / Firefox / WebKit coverage、terminal / empty / ready / failure screenshot evidenceを表示する。
- failureではcommit SHA不足、command別detail不足、exit code不足、artifact path不足、失敗分類不足、修正指示不足、Firefox除外、terminal evidence不足、failure screenshot不足、公開不可情報混入、AIDD-Spec connection不足を日本語で表示する。
- AIDD-Spec v0.1、Verification Evidence、Review Record、Learning Logへの接続を確認できるようにする。

## 非ゴール

- 実際のCodex実行。
- ログファイルのアップロードやDB永続化。
- 外部CI、GitHub API、課金機能との接続。

## 主要ユーザーフロー

1. emptyでRun Queue item未選択の状態を見る。
2. readyでcommit SHAとcommand別Verification Run Detailを確認する。
3. failureで不足項目をReview Finding draftとして読み、必要な上流情報と検証commandを確認する。
