# Learning Log

対象はAIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdに接続するAIDD Control Plane MVP 008: Artifact Evidence Binder。

## 期待する学び

- Verification Evidenceをログ単体ではなくBinderとして扱うと、完了条件が明確になるか。
- CI run URL、CI artifact URL、Playwright report URLを束ねることで、レビュー時の探索コストが下がるか。
- failureをReview RecordからNext AI Task Packet Deltaへ戻す流れが、次回Codex依頼に使える粒度になるか。

## 実装メモ

- 永続化は使わず、Reactのローカルstateだけで決定的に動かす。
- 生成処理は`src/lib/intake.ts`の純粋関数に集約する。
- doctor:aiddでファイル、scripts、UIコピー、状態契約、禁止プリミティブ、Artifact Evidence Binder文言を確認する。
- Verification Run Trackerはゲート実行状態を扱い、Artifact Evidence BinderはReview RecordとLearning Logへ渡す証跡URLを束ねる。
- Artifact Evidence Binderのempty / valid / failureサンプルも`src/lib/intake.ts`のドメインロジックとして分離する。
- terminal evidenceとscreenshot evidenceに加え、CI run URL、CI artifact URL、Playwright report URLが揃らない場合はreadyにしない。
- 古いログはReview Findingとして扱い、Learning LogからNext AI Task Packet Deltaへ戻す。

## 次回改善候補

- 実GitHub Actions URLの到達確認をmock backend化する。
- artifactのファイル存在確認を追加する。
- Binderをユーザー入力で編集できるようにする。
- Review Recordのfindings入力とLearning Logのspec_updates_needed入力を編集可能にする。
