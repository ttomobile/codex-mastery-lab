# AI Task Packet: AIDD Control Plane MVP 003

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: "aidd-control-plane-mvp-003"
conformance_target: "L3"
product_brief:
  name: "AIDD Control Plane MVP 003"
  user_problem: "AIエージェントが実装を完了したと言っても、lint/test/build/E2Eのログ、スクリーンショット、CI URLが散らばっていて確認しづらい。"
  target_pattern: "Verification Evidence Collector UI"
  intended_difference: "MVP 002のContract Checkerの次に、実行証跡をまとめてVerification Evidence JSONにする。"
  non_goals:
    - "実ファイルアップロードはしない"
    - "外部API送信はしない"
    - "DB接続はしない"
    - "GitHub API連携はしない"
    - "ログインは作らない"
experience_contract:
  screens:
    - name: "Evidence Collector Dashboard"
      purpose: "証跡収集の準備度を見る"
    - name: "Command Log Collector"
      purpose: "lint/typecheck/test/build/E2E/doctorのログを入力する"
    - name: "Screenshot Evidence Collector"
      purpose: "UIスクリーンショット、terminal evidence、report画像のURL/pathを入力する"
    - name: "CI and Report Links"
      purpose: "CI run URL、Playwright report、coverage reportを入力する"
    - name: "Verification Evidence Preview"
      purpose: "AIDD-Spec形式のVerification Evidence JSONを表示する"
  states:
    - "empty"
    - "partial"
    - "ready"
    - "missing_logs"
    - "missing_screenshots"
    - "offline"
  failure_contract:
    - "必須ログ不足を表示する"
    - "スクリーンショット不足を表示する"
    - "CI URL未入力をwarningとして表示する"
    - "外部API未接続を明示する"
implementation_contract:
  stack:
    - "Next.js App Router"
    - "TypeScript"
    - "pnpm"
    - "Vitest"
    - "Playwright Chromium"
  constraints:
    - "generated-repo/の中だけで完結する"
    - "UI copy/test/docsは日本語"
    - "fetch/XMLHttpRequest/WebSocket/localStorage/sessionStorageは禁止"
    - "画像URL/pathは文字列として扱うだけで実アップロードしない"
quality_gates:
  required_commands:
    - "pnpm install --frozen-lockfile"
    - "pnpm run lint"
    - "pnpm run typecheck"
    - "pnpm run test"
    - "pnpm run build"
    - "pnpm run test:e2e"
    - "pnpm run doctor:aidd"
acceptance_criteria:
  - "初期表示でEvidence Collector Dashboardが見える"
  - "サンプル証跡を入れるとreadiness scoreが100になる"
  - "必須ログを消すとmissing_logsになる"
  - "スクリーンショットを消すとmissing_screenshotsになる"
  - "Verification Evidence Previewにcommand_logs/screenshots/reportsが出る"
  - "doctor:aiddが必須UI token、状態、禁止APIを検査する"
```
