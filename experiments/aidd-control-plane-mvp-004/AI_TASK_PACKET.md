# AI Task Packet: AIDD Control Plane MVP 004

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: "aidd-control-plane-mvp-004"
conformance_target: "L3"
product_brief:
  name: "AIDD Control Plane MVP 004"
  user_problem: "AIDD Control Planeの意味が初見ユーザーに伝わらない。ユーザーは何を入力すれば良い開発フローと設計ドキュメントが作れるのか分からない。"
  target_user:
    - "AIでWeb/mobileアプリを作りたい初心者"
    - "Codex/Claudeに依頼する前の設計ドキュメントを作りたい開発者"
    - "チームでAI駆動開発の品質を揃えたいリードエンジニア"
  non_goals:
    - "実際に外部AI APIを呼ぶこと"
    - "ログインや課金の実装"
    - "本番DB永続化"
    - "GitHub Actions連携"
  success_criteria:
    - "ユーザーが作りたいアプリを入力できる"
    - "Product Briefが生成される"
    - "AI Task Packetが生成される"
    - "検証計画が生成される"
    - "Codex Promptが生成される"
    - "不足している設計観点が見える"
experience_contract:
  screens:
    - "Project Intake Wizard"
    - "Generated Product Brief"
    - "Generated AI Task Packet"
    - "Verification Plan"
    - "Codex Prompt"
    - "Readiness Review"
  states:
    - "empty"
    - "draft"
    - "ready"
    - "insufficient"
  required_copy:
    - "何を作りたいですか？"
    - "誰のどんな問題を解決しますか？"
    - "作らないものを決める"
    - "必要な検証を選ぶ"
    - "AIに渡す依頼書を生成"
quality_gates:
  - "pnpm install --frozen-lockfile"
  - "pnpm run lint"
  - "pnpm run typecheck"
  - "pnpm run test"
  - "pnpm run build"
  - "pnpm run test:e2e"
  - "pnpm run doctor:aidd"
expected_output:
  app: "Next.js + TypeScript static local app"
  docs:
    - "docs/product-brief.md"
    - "docs/verification-plan.md"
    - "docs/review-record.md"
    - "docs/learning-log.md"
  tests:
    - "unit tests for intake generation"
    - "E2E tests for empty/draft/ready/insufficient states"
```

## 必須機能

1. Project Intake Wizard
   - アプリ名
   - アプリ種別（Webアプリ、モバイルアプリ、業務ツール、コンテンツサービス、EC/予約、その他）
   - 対象ユーザー
   - 解決したい問題
   - 主要機能
   - 非ゴール
   - 外部連携
   - 状態設計
   - 品質目標

2. Generator
   - Product Brief markdown
   - AI Task Packet YAML/markdown
   - Verification Plan
   - Codex Prompt
   - Readiness Review

3. Readiness Review
   - ready / insufficient を表示
   - missing_fields を表示
   - recommended_next_questions を表示

4. Safety / offline contract
   - 外部通信禁止
   - localStorage/sessionStorage禁止
   - すべてローカルstateで動く

## note記事での読者価値

この記事では、AIDD Control Planeが「よく分からない内部ツール」から、「作りたいアプリを入力すると設計書とAI依頼書が出るSaaS」に変わる瞬間を説明する。

読者に渡すチェックリスト:

- AIに頼む前に最低限聞くべき質問
- Product Briefに必要な項目
- AI Task Packetに必要な項目
- 検証計画に必要な項目
