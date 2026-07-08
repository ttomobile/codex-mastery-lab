# Product brief

## 対象体験

Publication Evidence QA Gateは、公開候補ダイジェストが公開できる状態かを判定するUIです。source digest id、article path、preview、asset copy、terminal evidence、initial screenshot、filled screenshot、failure screenshot、terminal evidence PNG、Chromium/Firefox/WebKit、console status、sanitization scan、Review Record、Learning Log、AI Task Packet delta、Codex prompt delta、publish checklistを同じ画面で確認します。

## 差別化したゴール

- `evaluatePublicationDigest`でempty / valid / failure / blockedを判定する。
- validでは公開候補ダイジェストとQA判定サマリーを表示する。
- blockedではlocal path / host / private network URL混入、Firefox除外、terminal evidence不足、記事観点不足、AIDD-Spec接続不足をReview Findingとして表示する。
- doctor:aiddで重要テキスト、3ブラウザ設定、capture script、公開危険文字列のfixture混入検査を行う。

## 非ゴール

- 実サービスの商標、ロゴ、コピーは扱わない。
- 実際の記事投稿APIや外部公開処理は扱わない。
- AIDD-Spec説明で建築や建物のメタファーは使わない。

## 主要ユーザーフロー

1. レビュー担当者がempty / valid / failure / blockedを選ぶ。
2. 公開候補のsource digest id、article path、preview、asset copy、terminal evidenceを確認する。
3. 3ブラウザ、console status、sanitization scan、publish checklistを確認する。
4. blockedならReview Findingを修正対象として読む。
5. validなら公開候補ダイジェストを記事化の入力として確認する。
