# Product Brief: AIDD Control Plane MVP 003

## 目的

AIDD Control Plane MVP 003は、AIエージェント実行後に散らばりやすいVerification Evidenceを、ひとつの画面で確認できるEvidence Collector UIである。

## 解く問題

AIエージェントが「完了」と返しても、lint、typecheck、test、build、E2E、doctorのログ、スクリーンショット、CI URL、Playwright report、coverage reportが別々に残ると、レビュー担当が完了条件を判断しづらい。

## 主要ユーザー

- AI駆動開発の実験をレビューする人
- AIDD-SpecのEvidence / Learning Layerを運用する人
- ローカル実行結果をCI前の確認材料にしたい実装担当

## 主要フロー

1. Evidence Collector Dashboardでreadiness scoreを見る。
2. Command Log Collectorに必須コマンドログを入力する。
3. Screenshot Evidence CollectorにUI画像とterminal evidence画像のpathを入力する。
4. CI and Report LinksにCI run URL、Playwright report、coverage reportを入力する。
5. Verification Evidence Preview JSONで保存対象の形を確認する。
6. サンプル、必須ログ不足、スクリーンショット不足の各状態をボタンで確認する。

## 非ゴール

- 実ファイルアップロードはしない。
- 外部API送信はしない。
- DB接続はしない。
- GitHub API連携はしない。
- ログインは作らない。

## 成功条件

- サンプル証跡入力でreadiness scoreが100になり、overall statusがreadyになる。
- 必須ログ不足でmissing_logsが表示される。
- スクリーンショット不足でmissing_screenshotsが表示される。
- Preview JSONにcommand_logs、screenshots、reports、missing_evidenceが出る。
- doctor:aiddが必須UI token、状態、禁止API利用を検査する。
