# AIDD-Spec: AI Task Packet Standard v0.1

> 後工程の監査・レビュー・運用から逆算して、CodexなどのAI実装エージェントへ渡す最小実装単位を標準化する。

## 1. 目的

AI Task Packet は、AIに「何を作るか」を伝えるだけのプロンプトではない。

これは、後工程のレビュー担当・テスト担当・アクセシビリティ監査・運用担当が必要とする情報を、実装前にAIへ渡すための小さな設計図面である。

## 2. 必須フィールド

```yaml
task_id: string
scope:
  target_paths: []
  forbidden_paths: []
product_intent: string
functional_requirements: []
non_goals: []
acceptance_criteria: []
state_design:
  empty: string
  loading: string
  error: string
  success: string
accessibility_contract:
  labels: []
  relationships: []
  collection_semantics: []
  keyboard_interactions: []
  focus_evidence: []
security_contract:
  data_classification: string
  input_validation: []
quality_gate:
  required_commands: []
  expected_results: []
verification_evidence:
  files_to_attach: []
  logs_to_save: []
prompt_delta_log:
  previous_failure: string
  added_instruction: string
```

## 3. 今日の実験から追加した項目

### 3.1 `accessibility_contract.relationships`

検索UIや動的フィルタUIでは、視覚的に近くに配置されているだけでは不十分である。
AI Task Packetには、支援技術が読める関係性を明記する。

例:

```yaml
accessibility_contract:
  relationships:
    - search_input controls faq-list via aria-controls
    - search_input is described by helper text, live result status, and no-result status via aria-describedby
    - result status uses aria-live="polite" and includes query context
```

### 3.2 `accessibility_contract.collection_semantics`

動的に生成されるカード一覧は、`div` の羅列になりやすい。
FAQ、検索結果、通知、メニューなど、コレクションとして読ませるべきUIは、前工程で明示する。

例:

```yaml
accessibility_contract:
  collection_semantics:
    - FAQ results must be rendered as <ul id="faq-list"> and <li> items
    - If custom elements are used, provide equivalent role="list" and role="listitem"
```

### 3.3 `accessibility_contract.keyboard_interactions`

フォーム内のライブ検索では、Enterキーの挙動が仕様になっていないと、AIはブラウザ既定動作に任せる可能性がある。

例:

```yaml
accessibility_contract:
  keyboard_interactions:
    - Typing filters results live
    - Pressing Enter in the search input must not reload or navigate
    - FAQ toggles must be real buttons or equivalent keyboard-operable controls
```

### 3.4 `quality_gate.required_commands`

UIが小さくても、最低限の検証証拠を要求する。
依存追加が重い場合は、軽量な静的監査でもよい。

例:

```yaml
quality_gate:
  required_commands:
    - node --check path/to/app.js
    - python3 path/to/audit_static.py path/to/app
  expected_results:
    - JavaScript syntax check exits 0
    - Static accessibility contract audit exits 0
```

## 4. AI Task Packetテンプレート Lite

```markdown
# AI Task Packet: <task name>

## Scope

- Target paths:
- Forbidden paths:
- Dependencies policy:

## Product intent

## Functional requirements

## Non-goals

## State design

- Empty:
- Loading:
- Error:
- Success:

## Accessibility Contract

- Visible labels:
- Programmatic relationships:
- Collection semantics:
- Keyboard interactions:
- Focus evidence:
- Live regions:

## Quality Gate

Run these commands and include results:

```bash
<command 1>
<command 2>
```

## Verification Evidence

- Files changed:
- Commands run:
- Logs saved:
- Known limitations:
```

## 5. Control Plane機能仮説

AIDD Control Planeでは、AI Task Packetを自由記述ではなくフォームとして生成する。

- UI種別を「検索」「一覧」「フォーム」「認証」「決済」などから選ぶ
- UI種別に応じて Accessibility Contract の必須項目を自動提示する
- `aria-controls` / `aria-describedby` / live region / list semantics を静的監査する
- Codex実行ログ、監査結果、修正プロンプトを Learning Log に自動保存する

## 6. 今日の検証結果との対応

2026-06-27 の FAQ検索アプリ実験では、雑プロンプト版で以下が抜けた。

- FAQ一覧のリストセマンティクス
- 検索欄と結果領域の `aria-controls`
- 検索欄とヘルプ/結果/未検出状態の `aria-describedby`
- Enterキーでフォーム送信を抑止する仕様
- `:focus-visible` によるキーボードフォーカス証拠
- 再実行可能な静的監査コマンド

AI Task Packet v0.1にこれらを事前に入れると、fixed-appでは静的監査がすべてPASSした。
