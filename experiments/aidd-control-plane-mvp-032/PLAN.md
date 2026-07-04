# PLAN: AIDD Control Plane MVP 032 / Codex Run Queue

## 今日の問い
Run Authorization Gateでvalidになった実行許可を、Codex Run Queueとして並べると、実行待ち・実行中・成功・失敗・証跡不足をAI実行の前後でレビューできるか。

## 後工程からの逆算
- 後工程: Review Record / Learning Log / Verification Evidenceが、どのCodex実行がどの状態で終わったかを必要とする。
- 欠陥仮説: 実行許可だけでは、queue投入後の状態、ログ、artifact、retry、rollbackが散らばる。
- 逆算される前工程: AI Task Packetに queue item id、source authorization id、status model、required evidence、retry/rollback policy を含める。

## 監査カテゴリ
1. Operations / Maintenance: 実行状態と証跡不足を追えるか
2. Requirement Fit: Run Authorization GateからRun Queueへ接続できているか
3. Build / Lint / Console: Next.js/TS/テスト/E2Eが通るか

## 実施手順
1. MVP031をベースにMVP032専用ディレクトリへコピーする。
2. Codexへ日本語プロンプトでCodex Run Queue追加を依頼する。
3. lint/typecheck/test/build/e2e/doctor/captureを実行し、terminal evidenceを保存する。
4. スクリーンショットをassetsへコピーし、記事・標準・outline・backlog・previewを更新する。
