# Verification Evidence Template v0.1

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: ""
conformance_target: "L2|L3|L4|Lite"
agent:
  name: ""
  command: ""
  started_at: ""
  completed_at: ""
input:
  ai_task_packet: ""
  referenced_standards: []
outputs:
  files_created: []
  files_modified: []
quality_gates:
  - command: ""
    expected: ""
    exit_code: null
    log_file: ""
artifacts:
  screenshots: []
  reports: []
  coverage: []
  ci_runs: []
review:
  score: null
  passed: false
  findings: []
  remaining_risks: []
learning_log:
  what_worked: []
  what_failed: []
  spec_updates_needed: []
```

## Evidenceとして認めるもの

- 実行ログ
- test/coverage/build/E2E結果
- CI URLとconclusion
- artifact名とサイズ
- screenshot/GIF
- Review Record
- Learning Log

チャット上の「できました」はEvidenceではない。

## Verification Evidence Lite v0.2 追記

> 2026-07-03 の `verification-evidence-lite-001` 実験で、雑なバイブコーディング版は「E2Eが1本通った」ことは示せたが、受け入れ条件ID、証拠保存先、残リスク、再確認コマンドが不足した。後工程のレビューと記事化から逆算し、Lite版にも最低限の証跡セットを必須化する。

### Liteで必須にするフィールド

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: ""
conformance_target: "Lite"
acceptance_criteria:
  - id: "AC-001"
    user_action: ""
    expected_result: ""
    evidence_command: ""
quality_gates:
  - command: "pnpm run typecheck"
    exit_code: null
    log_file: ""
  - command: "pnpm run lint"
    exit_code: null
    log_file: ""
  - command: "pnpm run build"
    exit_code: null
    log_file: ""
  - command: "pnpm run test:e2e"
    exit_code: null
    log_file: ""
artifacts:
  screenshots_or_gifs: []
  console_log: ""
  diff_summary: ""
residual_risks:
  - ""
review_result:
  passed: false
  reviewer_note: ""
```

### Lite acceptance criteriaの書き方

- `AC-001` のようなIDを付ける。
- 操作、期待結果、証拠コマンドを同じ行に置く。
- E2Eテスト名にもIDを含める。
- 1本の大きなE2Eにまとめず、後から失敗原因を読める粒度へ分ける。
- 対象外の品質（例: CI、3ブラウザ、mock backend、実機スクリーンリーダー）は残リスクに書く。

### AI Task Packetへ追加するプロンプト断片

```text
Verification Evidence Liteとして、受け入れ条件ごとにIDを付け、操作、期待結果、証拠コマンド、保存するログ/スクリーンショット/GIF、残リスクを docs/ に残してください。Playwrightテスト名にも受け入れ条件IDを含め、pnpm run doctor:evidence で証跡ファイルとIDの存在を確認できるようにしてください。
```

### Evidenceとして認めないもの

- チャット上の「できました」だけ
- コマンド名だけでexit codeやログパスがない記録
- どの受け入れ条件を確認したか分からないスクリーンショット
- 失敗時の残リスクが書かれていない成功報告

### SaaS化した場合の入力/自動検査

AIDD Control Planeでは、Liteタスク完了時に次を自動チェックする。

1. Acceptance Criteria ID が存在するか
2. 各IDに evidence command があるか
3. 実行ログのファイルパスが存在するか
4. screenshot/GIF または代替証跡が存在するか
5. 残リスクが空欄のままになっていないか
6. Review Findingから次回AI Task Packetへのdeltaが作れるか
