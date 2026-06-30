# Review Record

## レビュー対象

- AIDD Control Plane MVP 008: Artifact Evidence Binder
- AIDD-Spec v0.1 / standards/aidd-control-plane-mvp-v0.1.md

## 判定基準

- Product Brief、AI Task Packet、Verification Plan、Codex Prompt、Readiness ReviewがUIで確認できる。
- Verification Run TrackerがUIで確認できる。
- Artifact Evidence BinderがUIで確認できる。
- readiness statusがempty/draft/ready/insufficientを表現できる。
- terminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを同じ実行単位で表示できる。
- empty / valid / failureサンプルを切り替えられる。
- failureでは壊れたURL、不足証跡、古いログがReview Findingsへ入る。
- failureの修正指示がNext AI Task Packet DeltaとCodex Prompt Deltaへ戻る。
- Verification Evidence、Review Record、Learning LogがAIDD-Spec v0.1接続として生成物に含まれる。
- 実装が外部通信とブラウザ保存領域に依存しない。

## 現時点のレビュー

- Status: 実装後にローカルゲートで確認する。
- Remaining risk: CI URLはサンプル文字列であり、実CIの到達確認は次MVP以降で扱う。
- Human review question: 初見ユーザーが「ゲート成功」と「Binder valid」の違いを理解できるか。

## MVP 008追加

- Artifact Evidence Binderでterminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを束ねる。
- 壊れたURL、不足証跡、古いログをReview Findingとして返す。
- Review FindingをLearning LogとNext AI Task Packet Deltaへ戻す。
