# Verification Evidence: Character Collection RPG Trial 002

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: "character-collection-rpg-trial-002"
series: "AIDD Control Plane Dogfood"
result: "passed"
product: "SagaForge Trial 002 visual upgrade"
```

## Scope

Trial 001のキャラ収集RPGプロトタイプに、完全オリジナルの画像素材を追加し、戦闘・編成・ガチャ画面をスマホ向けRPGらしい密度へ寄せた。

## Non-infringement

- 実在IPの公式素材、ロゴ、キャラクター、文言は使っていない。
- 画像素材は新規生成したオリジナル素材。
- 体験パターンは「キャラ収集・編成・ターン制バトル・召喚演出」へ抽象化した。

## Added Assets

Generated original art assets were copied into:

- `generated-repo/public/game-assets/party-key-art.png`
- `generated-repo/public/game-assets/battle-ruins.png`
- `generated-repo/public/game-assets/crystal-guardian.png`
- `generated-repo/public/game-assets/summon-altar.png`

## Quality Gates

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm run lint` | pass | `artifacts/character-collection-rpg-trial-002/terminal/02-lint.txt` |
| `pnpm run typecheck` | pass | `03-typecheck.txt` |
| `pnpm run test` | pass, 5 tests | `04-test.txt` |
| `pnpm run build` | pass | `05-build.txt` |
| `pnpm run mock:doctor` | pass | `06-mock-doctor.txt` |
| `pnpm run test:e2e` | pass, 15 tests / 3 browsers | `08-e2e.txt` |

## E2E Coverage

The existing functional contract still passed after visual upgrade:

- ホームから編成、遠征、戦闘、幻晶結果まで確認できる
- empty_rosterでは名簿の空状態を表示する
- party_invalidでは戦闘前に編成不備を表示する
- payment_failedでは幻晶画面に決済失敗を表示する
- 状態画面からofflineとtimeoutへ切り替えられる
- Chromium / Firefox / WebKit 全通過

## Captures

- `assets/2026-07-02-sagaforge-trial-002-home.png`
- `assets/2026-07-02-sagaforge-trial-002-party.png`
- `assets/2026-07-02-sagaforge-trial-002-battle.png`
- `assets/2026-07-02-sagaforge-trial-002-gacha.png`
- `assets/2026-07-02-sagaforge-trial-002-failure.png`
- `assets/2026-07-02-sagaforge-trial-002-terminal-evidence.png`

## Lesson

視覚密度を上げるだけなら、既存の状態契約を壊さずに改善できた。AIDD Control Plane側には、今後「visual asset contract」を追加し、生成アプリがどの画像素材をどの画面で使うべきかをAI Task Packetで明示するべき。
