# AI Task Packet: Character Collection RPG Trial 001

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: "character-collection-rpg-trial-001"
conformance_target: "L3"
series: "AIDD Control Plane Dogfood: キャラ収集RPGプロトタイプ"
product_brief:
  name: "SagaForge Trial 001"
  one_liner: "商標を使わず、キャラ収集RPGの体験パターンを抽象化したスマホ向けWebプロトタイプ"
  target_user: "キャラ収集、パーティ編成、ターン制バトル、育成が好きなユーザー"
  user_problem: "AIに『ロマサガRSみたいなアプリ』と頼むと、見た目だけで検証不能なプロトタイプになりやすい"
  key_features:
    - "ホーム画面"
    - "キャラクター一覧"
    - "パーティ編成"
    - "クエスト選択"
    - "ターン制バトル"
    - "勝利/敗北/報酬画面"
    - "ガチャ風結果表示"
    - "育成/強化画面"
  non_goals:
    - "ロマサガRS、SaGa、スクウェア・エニックス等の実在IP、商標、ロゴ、公式素材、公式文言の利用"
    - "実課金"
    - "本物のガチャ確率商用運用"
    - "実アカウント/実API連携"
    - "ネイティブアプリ/Unity実装"
system_contract:
  stack:
    - "Next.js"
    - "TypeScript"
    - "pnpm"
  mock_services:
    - "mock-api: roster, quests, rewards, network state"
    - "mock-media: visual/audio placeholder state"
    - "mock-auth: guest/member state"
    - "mock-billing: free/premium/payment failure state"
  required_scripts:
    - "pnpm run lint"
    - "pnpm run typecheck"
    - "pnpm run test"
    - "pnpm run test:coverage"
    - "pnpm run build"
    - "pnpm run doctor:playwright"
    - "pnpm run mock:doctor"
    - "pnpm run test:e2e"
experience_contract:
  screen_inventory:
    - "ホーム"
    - "キャラ一覧"
    - "編成"
    - "クエスト"
    - "バトル"
    - "ガチャ結果"
    - "育成"
    - "状態確認"
  state_contract:
    - "empty_roster"
    - "loading"
    - "success"
    - "offline"
    - "timeout"
    - "battle_win"
    - "battle_lose"
    - "party_invalid"
    - "gacha_result"
    - "payment_failed"
quality_gates:
  local:
    - "lint"
    - "typecheck"
    - "unit"
    - "coverage"
    - "build"
    - "mock:doctor"
    - "doctor:playwright"
    - "3-browser e2e if browsers are available"
verification_evidence:
  terminal_logs:
    - "01-install.txt"
    - "02-lint.txt"
    - "03-typecheck.txt"
    - "04-test.txt"
    - "04b-coverage.txt"
    - "05-build.txt"
    - "06-mock-doctor.txt"
    - "07-doctor-playwright.txt"
    - "08-e2e.txt"
  captures:
    - "home"
    - "party"
    - "battle"
    - "gacha"
    - "failure-state"
    - "terminal-evidence"
```

## Codexへの要望

- UI、テスト名、docsは日本語。
- 実在IPに似せすぎない。独自名 `SagaForge` / `星紋` / `幻晶` などを使う。
- スマホ幅で見やすい画面にする。
- E2Eがmock stateを制御して表示変化を確認できるようにする。
- 見た目だけでなく、状態契約と証跡を重視する。
