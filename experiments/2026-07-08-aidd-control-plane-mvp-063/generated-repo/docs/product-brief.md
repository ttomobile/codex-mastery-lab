# Product Brief: AIDD Control Plane MVP063

## 対象体験

Run Queueに入ったCodex実行を、waiting / running / succeeded / failed / evidence_missing / emptyとして確認する。各状態で、実行コマンド、検証コマンド、ブラウザ範囲、terminal evidence、screenshot evidence、rollback plan、Review Record出力、Learning Log出力を見られるようにする。

## ユーザー課題

Codex実行がキューに入った後、失敗したのか、実行中なのか、成功したが証跡が足りないのかが混ざると、次のAI Task Packetへ戻す情報が曖昧になる。

## ゴール

- 6状態をUIで切り替えられる。
- succeededではterminal evidenceとscreenshot evidenceを含む完了材料を表示する。
- failed / evidence_missingでは何が足りないかをReview Findingとして出す。
- Chromium / Firefox / WebKitの3ブラウザE2E設定を維持する。
- `pnpm run lint`、`typecheck`、`test`、`build`、`test:e2e`、`doctor:aidd`、`capture:mvp063`を動かす。

## 非ゴール

- 実Codex API連携
- 実Run Queue永続化
- GitHub Actionsの実行結果取り込み
- 課金や認証のmock backend

## 主要フロー

1. Run Queue状態を選ぶ。
2. 実行コマンドと検証コマンドを確認する。
3. Chromium / Firefox / WebKitのブラウザ範囲を確認する。
4. terminal evidenceとscreenshot evidenceを確認する。
5. failed / evidence_missingではReview Findingの足りないものを確認する。
6. Review Record出力とLearning Log出力を次回作業へ戻す。
