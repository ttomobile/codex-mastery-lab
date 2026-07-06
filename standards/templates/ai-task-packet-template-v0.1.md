# AI Task Packet Template v0.1

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: ""
conformance_target: "L2"
product_brief:
  name: ""
  user_problem: ""
  target_pattern: ""
  intended_difference: ""
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
  touch_targets: ""
  overflow_policy: ""
system_contract:
  mock_services: []
  endpoints: []
  state_control: ""
api_failure_state_contract:
  boundary_function: ""
  scenarios: []
  timeout_policy: ""
  retry_policy: ""
  state_preservation_policy: ""
  user_message_contract: ""
quality_gates:
  required_commands: []
  required_artifacts: []
execution_budget:
  usage_band_policy: "go / brake / stop"
  max_runtime_minutes: null
  stop_conditions: []
  fallback_action: ""
  shrink_when_brake_or_stop:
    keep_now: []
    defer_next_increment: []
    minimum_verification: []
    resume_condition: ""
    evidence_paths: []
    prompt_preview_policy: "sanitize local paths and private hosts before publishing"
playwright_e2e_contract:
  target_browsers: []
  launch_url: ""
  state_scenarios: []
  preserved_inputs: []
  recovery_flows: []
  negative_tests: []
  config_policy: ""
expected_output:
  files: []
  docs: []
  tests: []
verification_evidence:
  logs_to_save: []
  reports_to_save: []
review:
  score_rubric: ""
  human_review_questions: []
learning_log:
  required: true
```

## 書き方の原則

- AIに任せたいことより、AIに勝手に決めさせたくないことを明確に書く。
- happy pathだけでなく、empty/loading/error/offline/timeoutを入れる。
- 「確認する」ではなく、実行コマンドと期待結果を書く。
- 出力ファイル名を指定する。
- 完了時に残す証跡を指定する。
- 実行前にgo / brake / stopを判断し、brake/stop時は縮小後AI Task Packetを提示する。
- 縮小提案には、今やること、次回へ送ること、最低限の検証、再開条件、公開用にサニタイズした証跡pathを含める。
