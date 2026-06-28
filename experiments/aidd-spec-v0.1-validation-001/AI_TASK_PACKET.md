# AI Task Packet: IssueBrief Lite

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: "aidd-spec-v0.1-validation-001"
conformance_target: "L2"
product_brief:
  name: "IssueBrief Lite"
  user_problem: "小さな開発タスクをAIへ渡す前に、目的・非ゴール・状態・検証条件を1画面で整理したい"
  target_pattern: "軽量なタスク受付/レビュー用Webフォーム"
  intended_difference: "単なるフォームではなく、AIDD-Spec入力の不足を可視化する"
  non_goals:
    - "外部API送信はしない"
    - "ログインは作らない"
    - "DB保存はしない"
    - "フレームワークやbuild toolは使わない"
scope:
  target_paths:
    - "generated-repo/index.html"
    - "generated-repo/styles.css"
    - "generated-repo/app.js"
    - "generated-repo/package.json"
    - "generated-repo/scripts/static-contract-check.mjs"
    - "generated-repo/docs/product-brief.md"
    - "generated-repo/docs/review-record.md"
    - "generated-repo/docs/learning-log.md"
  forbidden_paths:
    - "node_modules"
    - ".next"
    - "dist"
  allowed_commands:
    - "npm run lint:static"
    - "npm run test:contract"
experience_contract:
  screens:
    - "入力画面: タスク名、ユーザー課題、非ゴール、検証コマンド、証跡メモを入力できる"
    - "レビュー画面: 不足しているAIDD-Spec項目を表示する"
  primary_flows:
    - "ユーザーがタスク名と課題を入力し、プレビューでAI Task Packet風の要約を見る"
    - "非ゴールが空の場合は警告を表示する"
    - "検証コマンドが空の場合は警告を表示する"
  state_contract:
    empty:
      - "初期状態では入力を促す説明を表示する"
    loading:
      - "解析中ボタンで短時間のloading表示を出す"
    success:
      - "必須項目が揃うと送信準備OKを表示する"
    error:
      - "タスク名またはユーザー課題が空ならエラーを表示する"
    offline:
      - "オフライン切替ボタンで外部送信しない設計であることを表示する"
    timeout:
      - "タイムアウト切替ボタンで検証待ちが長引いた場合の文言を表示する"
  failure_contract:
    api_failure:
      - "外部APIを使わないため、API未接続として説明する"
    media_failure: []
    auth_failure:
      - "ログイン不要で使えることを明記する"
    billing_failure:
      - "課金機能は非ゴールであることを明記する"
accessibility_contract:
  keyboard:
    - "すべての入力とボタンはTabで到達できる"
    - "Enterでページ全体がreloadされない"
  labels:
    - "すべてのform controlにlabelを付ける"
  semantics:
    - "不足項目はul/liで表示する"
    - "状態メッセージはaria-live=politeで通知する"
  focus:
    - "エラー時はエラー概要へfocusできる"
  reduced_motion:
    - "アニメーションはprefers-reduced-motionで抑制する"
mobile_contract:
  viewports:
    - "390px"
    - "768px"
  touch_targets: "主要ボタンは44px以上"
  overflow_policy: "横スクロールを発生させない"
system_contract:
  mock_services: []
  endpoints: []
  state_control: "UI上の状態切替ボタンでoffline/timeout/errorを再現する"
quality_gates:
  required_commands:
    - "npm run lint:static"
    - "npm run test:contract"
  required_artifacts:
    - "docs/review-record.md"
    - "docs/learning-log.md"
expected_output:
  files:
    - "index.html"
    - "styles.css"
    - "app.js"
    - "package.json"
    - "scripts/static-contract-check.mjs"
  docs:
    - "docs/product-brief.md"
    - "docs/review-record.md"
    - "docs/learning-log.md"
  tests:
    - "static contract checker verifies labels, aria-live, ul/li shortage list, offline/timeout controls, and no external network APIs"
verification_evidence:
  logs_to_save:
    - "artifacts/terminal/01-lint-static.txt"
    - "artifacts/terminal/02-test-contract.txt"
  reports_to_save:
    - "generated-repo/docs/review-record.md"
review:
  score_rubric: "AIDD-Spec L2 Lite: 100 points"
  human_review_questions:
    - "AIは指定ファイルを揃えたか"
    - "状態設計はUIで確認できるか"
    - "不足項目をレビューできるか"
    - "検証コマンドは実行可能か"
learning_log:
  required: true
```
