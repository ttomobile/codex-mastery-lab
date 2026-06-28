# AIDD-Spec v0.1

> AI-Driven Development Standard Specification  
> AIエージェントと人間が同じ説明を読み、同じ完了条件でWeb/モバイルシステムを作るための標準仕様。

## Status

- Version: `0.1.0-draft`
- Scope: Web / mobile app development with AI agents
- Primary validation target: Codex Mastery Lab experiments
- Language: 日本語を第一読者向け説明言語とする
- Normative keywords: MUST / SHOULD / MAY

## 0. この仕様が解く問題

AIエージェントに「こういうアプリを作って」と頼むと、かなりの速度で見た目や機能の土台は出る。しかし、実務で必要な情報はしばしば抜ける。

- 何を作らないか
- どの状態を持つか
- 失敗時に何を表示するか
- APIやmockはどこまで再現するか
- どのブラウザで検証するか
- CIで何を証跡として残すか
- 人間がどの基準でレビューするか
- 次のAI実行にどの学びを戻すか

AIDD-Specは、これらをAIエージェントへ渡す前段成果物として標準化する。

## 1. 目的

AIDD-Specの目的は、AI駆動開発で使う成果物を標準化し、以下を実現することである。

1. AIエージェントが実装範囲を誤解しない
2. 人間レビュー担当が期待値を確認できる
3. テストとCIが同じ完了条件を検証できる
4. 失敗ログから仕様を改善できる
5. 複数アプリ/複数AIエージェントで比較可能な実験ができる

AIDD-Specは、単なるプロンプト集ではない。AIに渡す入力、AIが出すべき出力、検証証跡、レビュー記録、学習ログをつなぐ標準である。

## 2. 適用範囲

### 2.1 対象

AIDD-Spec v0.1は以下を対象にする。

- Webアプリ
- モバイルWeb
- モバイルアプリの仕様前段
- SaaS MVP
- AIエージェントによる実装/修正/検証
- 人間によるレビューと運用判断

### 2.2 対象外

v0.1では以下を対象外とする。

- 大規模基幹システム全体の完全標準化
- 法規制準拠の最終保証
- 特定クラウド/特定AIベンダーへの依存
- UIデザインそのもののブランドガイドライン
- AIエージェントの内部推論手順

## 3. 用語

| 用語 | 定義 |
| --- | --- |
| Product Brief | 何を作るか、誰のためか、何を作らないかを示す短い製品説明 |
| AI Task Packet | AIエージェントに渡す、実装単位の標準入力 |
| State Contract | empty/loading/error/success/offline/timeoutなど状態の約束 |
| Failure Contract | media/auth/billing/APIなど失敗状態の約束 |
| Verification Evidence | 実行ログ、CI、artifact、スクリーンショットなど完了証拠 |
| Review Record | 人間またはAIレビュアーの判断記録 |
| Learning Log | 失敗・修正・次回のSpec改善点を残す記録 |
| Conformance Level | AIDD-Specへの準拠度合い |
| Control Plane | AIDD-Spec成果物の生成、検証、蓄積、改善を支援するSaaS |

## 4. 成果物モデル

AIDD-Spec v0.1では、成果物を7層に分ける。

### 4.1 Product Layer

| Artifact | Required | 目的 |
| --- | --- | --- |
| Product Brief | MUST | 作るもの/作らないものを固定する |
| Target User / JTBD | SHOULD | 誰のどの用事を解くかを明確にする |
| Success Metrics | SHOULD | 何を成功とするか決める |

### 4.2 Requirement Layer

| Artifact | Required | 目的 |
| --- | --- | --- |
| Acceptance Criteria Matrix | MUST | 受け入れ条件をテスト可能にする |
| Non-Goal List | MUST | AIの勝手な拡張を防ぐ |
| Edge Case Catalog | SHOULD | 境界条件を先に渡す |

### 4.3 Experience Layer

| Artifact | Required | 目的 |
| --- | --- | --- |
| Screen Inventory | MUST | 必要画面を列挙する |
| State Contract | MUST | empty/loading/error/success等を固定する |
| Failure Contract | MUST | API/media/auth/billing等の失敗を固定する |
| Accessibility Contract | MUST | キーボード/ラベル/セマンティクスを固定する |
| Mobile Interaction Contract | SHOULD | モバイル表示・タッチ・キーボードを固定する |
| Copy Contract | SHOULD | UI文言、エラー文言、ヘルプ文言を固定する |

### 4.4 System Layer

| Artifact | Required | 目的 |
| --- | --- | --- |
| System Boundary | MUST | AIが触ってよい範囲を決める |
| API Contract | SHOULD | UIとAPIの境界を決める |
| Mock Backend Contract | MUST for agent experiments | E2Eから状態を制御可能にする |
| Permission Matrix | SHOULD | 権限差をテスト可能にする |

### 4.5 Non-Functional Layer

| Artifact | Required | 目的 |
| --- | --- | --- |
| Security Baseline | MUST | XSS/CSRF/secrets/PII等を先に制約する |
| Privacy/Data Classification | MUST when user data exists | データ扱いを曖昧にしない |
| Performance Budget | SHOULD | 後から重さに気づくのを防ぐ |
| Observability Plan | SHOULD | ログ/監視/失敗調査の入口を作る |

### 4.6 Implementation Layer

| Artifact | Required | 目的 |
| --- | --- | --- |
| AI Task Packet | MUST | AIへの実装入力 |
| Test Plan | MUST | どの証拠で完了とするか決める |
| Release Checklist | SHOULD | 公開前判断を標準化する |

### 4.7 Evidence / Learning Layer

| Artifact | Required | 目的 |
| --- | --- | --- |
| Verification Evidence | MUST | 実行証拠を保存する |
| Review Record | MUST | 人間/AIの判断を保存する |
| Learning Log | MUST | 次回Specへ戻す学びを保存する |

## 5. AI Task Packet標準構造

AI Task Packetは、AIエージェントが実装する最小作業単位である。v0.1では次の構造をMUSTとする。

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: string
conformance_target: L0|L1|L2|L3|L4
product_brief:
  name: string
  user_problem: string
  target_pattern: string
  non_goals: []
scope:
  target_paths: []
  forbidden_paths: []
  allowed_commands: []
experience_contract:
  screens: []
  primary_flows: []
  state_contract:
    empty: []
    loading: []
    success: []
    error: []
    offline: []
    timeout: []
  failure_contract:
    api_failure: []
    media_failure: []
    auth_failure: []
    billing_failure: []
accessibility_contract:
  keyboard: []
  labels: []
  semantics: []
  focus: []
  reduced_motion: []
mobile_contract:
  viewports: []
  touch_targets: string
  overflow_policy: string
system_contract:
  mock_services: []
  endpoints: []
  state_control: string
quality_gates:
  required_commands: []
  required_artifacts: []
expected_output:
  files: []
  docs: []
  tests: []
verification_evidence:
  logs_to_save: []
  reports_to_save: []
review:
  score_rubric: string
  human_review_questions: []
learning_log:
  required: true
```

## 6. Verification Evidence標準

AIエージェントの「完了しました」は証拠ではない。v0.1では、次をVerification Evidenceとして扱う。

| Evidence | Required | 例 |
| --- | --- | --- |
| Command log | MUST | lint/typecheck/test/build/E2Eのstdout |
| CI result | SHOULD / L4 MUST | GitHub Actions URL, conclusion |
| Test report | SHOULD | Playwright HTML report, coverage |
| Screenshot/GIF | SHOULD | 主要画面、失敗状態 |
| Artifact list | SHOULD | CI artifact名とサイズ |
| Review Record | MUST | score, pass/fail, remaining risk |
| Learning Log | MUST | 次回Specに戻す改善点 |

## 7. Conformance Levels

AIDD-Spec v0.1では準拠度を5段階で定義する。

| Level | 名前 | 条件 |
| --- | --- | --- |
| L0 | Vibe Output | AIが生成しただけ。検証証拠なし |
| L1 | Buildable | 構文/型/buildなど最低限が通る |
| L2 | Testable | unit/E2Eまたは静的監査で主要条件を検証できる |
| L3 | Contract-Verified | 状態/失敗/API/mockを契約として検証できる |
| L4 | CI-Evidenced | CI success、artifact、review、learning logが揃う |

WatchFlow/StudyStream/DrillSwipeのような公開実験はL4を目標とする。短時間の検証実験やライブ配信中のMVPはL2またはL3を目標にしてよい。

## 8. Review Process

レビューは次の順に行う。

1. AI Task PacketがAIDD-Spec構造を満たすか
2. 出力がscopeを守ったか
3. 必須artifactが存在するか
4. quality gatesが実行されたか
5. 状態/失敗が検証されたか
6. CIまたはローカル証跡が残ったか
7. 残リスクとLearning Logが書かれたか

レビュー結果はReview Recordとして保存する。

## 9. AIDD Control Plane SaaS要件

AIDD Control Planeは、AIにコードを書かせるSaaSではない。主価値は、AIDD-Spec成果物を生成・検証・蓄積・改善することである。

MVPは次を提供する。

1. AI Task Packet Builder
2. Conformance Checker
3. Verification Evidence Uploader
4. Review Record Dashboard
5. Learning LogからSpec改善案を作る機能
6. Agent Runbook Generator

## 10. 実験による検証基準

AIDD-Specが機能したと言うには、少なくとも次を示す必要がある。

1. Spec準拠入力を作る
2. AIエージェントへ渡す
3. 出力artifactを検査する
4. 非準拠点をReview Recordへ記録する
5. Learning LogをSpecへ戻す
6. 別パターンでも再試行する

今回のWatchFlow/StudyStream/DrillSwipeは、この流れの初期証拠である。ただし、一発で100点を保証するものではない。

## 11. v0.1の非目標

- すべての業界/全規模システムに即適用できる完全標準ではない
- 一発で100点を保証しない
- AIエージェントの品質差を消さない
- 法務/セキュリティの最終承認を置き換えない

## 12. v0.2へ向けた課題

1. Lite/Full profileの分離
2. coverage thresholdの標準化
3. モバイルアプリ固有のcontract追加
4. SaaS上のJSON Schema化
5. 複数AIエージェント比較
6. ライブ配信で追える短時間ワークフロー化
