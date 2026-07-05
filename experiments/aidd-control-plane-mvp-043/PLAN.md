# AIDD Control Plane MVP 043 実験計画

## テーマ
Review Record Receipt Synthesizer の次工程として、検証で見つかった不足を「次に実行する1つの修正インクリメント」に変換する **Review Finding Action Queue** を作る。

## 後工程からの逆算
後工程で必要なのは、Review Findingが出たあとに、次のCodex依頼が曖昧にならないこと。単にfindingを列挙するだけでは、優先度、実行可否、必要証跡、rollback、検証コマンドが散らばり、次回実行でまた迷う。

## 監査カテゴリ
1. Verification Evidence / Review Record接続
2. Operations / Maintenance
3. Build / Lint / Typecheck / Console

## 実験手順
1. MVP 042を元にMVP 043の小さなNext.jsアプリを作る。
2. Codexに日本語プロンプトでReview Finding Action Queueを実装させる。
3. empty / valid / failureの画面をブラウザでキャプチャする。
4. lint / typecheck / test / build / e2e / doctor:aiddを実行する。
5. 見つかった欠陥からAIDD-Spec標準と記事へ反映する。

## 成功条件
- UIは日本語で、Action Queueの状態が読める。
- validでは「execute_now / next_increment / learning_log」への振り分けが表示される。
- failureでは、優先度不足、検証コマンド不足、rollback不足、3ブラウザE2E不足、証跡不足、local path/host混入を検出する。
- 3ブラウザE2Eが通る。
- 証跡ログとスクリーンショットを保存する。
