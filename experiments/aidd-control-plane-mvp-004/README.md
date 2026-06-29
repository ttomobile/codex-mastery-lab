# AIDD Control Plane MVP 004

## 目的

AIDD Control Planeを「内部部品の集合」から、ユーザーが意味を理解できるSaaSに近づける。

MVP 004では、ユーザーが「作りたいアプリ」を入力すると、次の成果物が生成される Project Intake Wizard を作る。

- Product Brief
- AI Task Packet
- 検証計画
- Codex用プロンプト
- 不足している設計観点

## 背景

MVP 001〜003では、Workflow UI / JSON Contract Checker / Evidence Collectorを作った。
ただし、ユーザー入口がないため、初見では「何のためのSaaSか」が伝わりにくい。

今回のMVPでは、最初にユーザーへ質問し、その回答からベストに近い開発フローと設計ドキュメントを生成する。

## 成功条件

- Project Intake Wizardでアプリ種別、対象ユーザー、解決したい問題、必要機能、非ゴール、外部連携、品質目標を入力できる
- 入力からProduct Briefを生成できる
- 入力からAI Task Packetを生成できる
- 入力から検証計画を生成できる
- 入力からCodex Promptを生成できる
- 不足している設計観点を表示できる
- empty / draft / ready / insufficient の状態をUIで確認できる
- lint/typecheck/test/build/E2E/doctor:aiddが通る
