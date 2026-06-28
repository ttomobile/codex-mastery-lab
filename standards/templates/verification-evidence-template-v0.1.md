# Verification Evidence Template v0.1

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: ""
conformance_target: "L2|L3|L4"
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
