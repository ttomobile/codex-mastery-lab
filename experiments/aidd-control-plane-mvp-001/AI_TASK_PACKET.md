# AI Task Packet: AIDD Control Plane MVP 001

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: "aidd-control-plane-mvp-001"
conformance_target: "L3"
product_brief:
  name: "AIDD Control Plane MVP"
  user_problem: "AIエージェントに実装を頼む前に、Product Brief、AI Task Packet、Runbook、Review、Learning Logを一つの流れで作りたい"
  target_pattern: "AI駆動開発ワークフロー管理SaaSのローカルMVP"
  intended_difference: "コード生成SaaSではなく、AIへ渡す入力と検証証跡を整えるControl Plane"
  non_goals:
    - "ログイン/ユーザー管理は作らない"
    - "外部API送信はしない"
    - "DB接続はしない。LocalStorageも使わず、画面上の状態だけで完結する"
    - "実際にCodexプロセスを起動しない。Runbook文字列を生成するだけ"
    - "課金機能は作らない"
scope:
  target_paths:
    - "generated-repo/"
  forbidden_paths:
    - "node_modules"
    - ".next"
    - "coverage"
    - "playwright-report"
    - "test-results"
  allowed_commands:
    - "pnpm install --frozen-lockfile"
    - "pnpm run lint"
    - "pnpm run typecheck"
    - "pnpm run test"
    - "pnpm run build"
    - "pnpm run test:e2e"
    - "pnpm run doctor:aidd"
experience_contract:
  screens:
    - "Dashboard: AIDD-Specの流れと現在のPacket状態を表示する"
    - "Project Brief Builder: プロジェクト名、課題、非ゴール、成功条件を入力する"
    - "AI Task Packet Builder: 状態契約、失敗契約、quality gateを入力する"
    - "Packet Preview: YAML風/Markdown風のAI Task Packetを表示する"
    - "Agent Runbook: Codexへ渡すコマンドと手順を表示する"
    - "Review Dashboard: スコア、判定、findings、remaining risksを入力する"
    - "Learning Log: what worked, what failed, spec updates neededを入力する"
  primary_flows:
    - "初期状態では不足項目を表示する"
    - "Product Briefを入力するとPacket Previewが更新される"
    - "非ゴールとquality gateが空の場合は警告が残る"
    - "必須項目が揃うとL3準備OKを表示する"
    - "Runbookにcodex execコマンド例が出る"
    - "ReviewとLearning Logの内容がVerification Evidence要約へ反映される"
  state_contract:
    empty:
      - "初期状態で入力不足の説明を出す"
    loading:
      - "Packet生成ボタンで短時間loadingを出す"
    success:
      - "必須項目が揃うとL3準備OKを出す"
    error:
      - "プロジェクト名/課題/quality gate不足時にエラーを出す"
    offline:
      - "外部送信なしのローカルMVPであることを表示する"
    timeout:
      - "Agent実行待ちが長い場合にRunbookだけ生成済みであることを表示する"
  failure_contract:
    api_failure:
      - "外部APIは使わず、API未接続を明示する"
    media_failure: []
    auth_failure:
      - "ログイン不要のローカルMVPであることを表示する"
    billing_failure:
      - "課金機能は非ゴールであることを表示する"
accessibility_contract:
  keyboard:
    - "すべての入力、タブ、ボタンはTabで到達できる"
    - "Enterでページ全体がreloadされない"
  labels:
    - "すべてのform controlにlabelを付ける"
  semantics:
    - "不足項目とfindingsはul/liで表示する"
    - "状態メッセージはaria-live=polite"
    - "主要領域はsection/aside/nav等の意味要素を使う"
  focus:
    - "エラー時はエラー概要へfocusできる"
  reduced_motion:
    - "prefers-reduced-motion対応"
mobile_contract:
  viewports:
    - "390px"
    - "768px"
    - "1280px"
  touch_targets: "主要ボタンは44px以上"
  overflow_policy: "横スクロールを発生させない。長いYAML/Runbookは折り返す"
system_contract:
  mock_services: []
  endpoints: []
  state_control: "UI上の状態切替でoffline/timeout/errorを再現する"
quality_gates:
  required_commands:
    - "pnpm run lint"
    - "pnpm run typecheck"
    - "pnpm run test"
    - "pnpm run build"
    - "pnpm run test:e2e"
    - "pnpm run doctor:aidd"
  required_artifacts:
    - "docs/product-brief.md"
    - "docs/review-record.md"
    - "docs/learning-log.md"
    - "docs/verification-evidence.md"
expected_output:
  files:
    - "Next.js App Router application"
    - "package.json with scripts"
    - "Playwright config and E2E test"
    - "Vitest/component tests or logic tests"
    - "scripts/doctor-aidd.mjs"
  docs:
    - "docs/product-brief.md"
    - "docs/review-record.md"
    - "docs/learning-log.md"
    - "docs/verification-evidence.md"
  tests:
    - "logic tests for packet completeness and generated runbook"
    - "E2E test for primary flow and state toggles"
verification_evidence:
  logs_to_save:
    - "artifacts/terminal/01-install.txt"
    - "artifacts/terminal/02-lint.txt"
    - "artifacts/terminal/03-typecheck.txt"
    - "artifacts/terminal/04-test.txt"
    - "artifacts/terminal/05-build.txt"
    - "artifacts/terminal/06-e2e.txt"
    - "artifacts/terminal/07-doctor-aidd.txt"
  reports_to_save:
    - "generated-repo/docs/verification-evidence.md"
review:
  score_rubric: "AIDD-Spec L3 MVP: 100 points"
  human_review_questions:
    - "SaaSの価値がAIコード生成ではなくControl Planeとして表現されているか"
    - "AI Task Packet生成が入力に連動しているか"
    - "Runbook/Review/Learning Logまで同じ画面で辿れるか"
    - "状態/失敗契約がUIとE2Eで検証されているか"
learning_log:
  required: true
```
