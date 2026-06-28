# Product Brief

## 名前

AIDD Control Plane MVP

## 解く課題

AIエージェントへ実装を頼む前に、Product Brief、AI Task Packet、Agent Runbook、Review、Learning Logを一つの流れで作れるようにする。

## 主要ユーザー

AI駆動開発の依頼内容、検証条件、レビュー記録を標準化したい開発者。

## 体験パターン

フォームで製品説明と契約条件を入力し、AI Task Packet、Runbook、検証要約、レビュー、学習ログを同じ画面で確認する。

## 非ゴール

- ログイン/ユーザー管理は作らない。
- 外部API送信はしない。
- DB接続はしない。
- localStorageは使わない。
- 実際にCodexプロセスは起動しない。
- 課金機能は作らない。

## 主要フロー

1. DashboardでAIDD-Specの流れと不足状態を確認する。
2. Product Brief Builderへプロジェクト名、課題、非ゴール、成功条件を入力する。
3. AI Task Packet Builderで状態契約、失敗契約、quality gateを整える。
4. Packet PreviewとAgent Runbookの生成結果を確認する。
5. Review DashboardとLearning Logへ結果と改善点を残す。
