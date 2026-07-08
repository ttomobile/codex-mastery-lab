# Product brief

## 対象体験

Run Result Digest Publisherは、Codex実行の後段でレビュー担当者とnote読者に渡せる短いMarkdownダイジェストを作るUIです。source run id、run outcome、score、terminal evidence、initial/filled/failure/terminal screenshot、Chromium/Firefox/WebKit coverage、console status、Review Record、Learning Log、AI Task Packet delta、note article angle、publish readinessを同じ画面で確認します。

## 差別化したゴール

- validでは共有用Markdown、次回AI Task Packet delta、Codex prompt delta、Verification Evidence checklistを即座に表示する。
- blockedではsource run id不足、terminal evidence不足、failure screenshot不足、Firefox除外、console error/warn未確認、local path/host/private network URL混入、Learning Log接続不足、note記事観点不足をReview Findingとして表示する。
- empty / valid / failure / blockedを明示的に切り替える。

## 非ゴール

- 実サービスの商標、ロゴ、コピーは扱わない。
- 実際の記事投稿APIや外部公開処理は扱わない。
- MVP063のRun Queueを再実装しない。

## 主要ユーザーフロー

1. レビュー担当者が状態を選ぶ。
2. 実行結果と証跡を確認する。
3. blockedならReview Findingを修正対象として読む。
4. validなら共有用Markdownと次回差分をコピー元として確認する。
