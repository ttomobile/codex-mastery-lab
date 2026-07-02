# Verification Evidence: Character Collection RPG Trial 003

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: "character-collection-rpg-trial-003"
series: "AIDD Control Plane Dogfood"
result: "passed"
product: "SagaForge Trial 003 interaction upgrade"
```

## Scope

Trial 002のオリジナル画像素材・状態契約を維持したまま、操作感を増やした。今回は「見た目が遊べそう」から一段進め、画面内でユーザー操作の結果が即時に変わることを検証した。

## Added Interaction Contract

- 戦闘: `通常攻撃` / `防御` / `星紋技` のコマンド選択と予測ログ。
- 編成: 控え隊員との交替操作と隊列表示。
- 育成: `強化` ボタンによるレベル・戦力上昇。
- 幻晶: 召喚結果の先頭候補を名簿へ迎える操作。

## Non-infringement

- 実在IPの公式素材、ロゴ、キャラクター、文言は使っていない。
- 体験パターンはキャラ収集・編成・ターン制バトル・召喚演出・育成へ抽象化した。
- 追加操作もすべて独自の名称・数値・UIコピーで実装した。

## Quality Gates

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm run lint` | pass | `artifacts/character-collection-rpg-trial-003/terminal/02-lint.txt` |
| `pnpm run typecheck` | pass | `03-typecheck.txt` |
| `pnpm run test` | pass, 9 tests | `04-test.txt` |
| `pnpm run test:coverage` | pass, 95.23% statements | `04b-coverage.txt` |
| `pnpm run build` | pass | `05-build.txt` |
| `pnpm run doctor:playwright` | pass, Chromium/Firefox/WebKit | `06-playwright-doctor.txt` |
| `pnpm run mock:doctor` | pass, Docker Compose path verified | `07-mock-doctor.txt` |
| `pnpm run test:e2e` | pass, 18 tests / 3 browsers | `08-e2e.txt` |

## E2E Coverage Added

既存5シナリオに加えて、以下のユーザー操作シナリオを3ブラウザで追加した。

- 戦闘で `星紋技` を選択すると、選択中表示とログが変わる。
- 編成で3枠目を控え隊員 `リク` と交替できる。
- 育成で `アステル` のLv.42がLv.43へ上がる。
- 幻晶で `aurora` の候補を名簿へ迎え、4名から5名へ増える。

## Captures

- `assets/2026-07-03-sagaforge-trial-003-battle-command.png`
- `assets/2026-07-03-sagaforge-trial-003-party-swap.png`
- `assets/2026-07-03-sagaforge-trial-003-training.png`
- `assets/2026-07-03-sagaforge-trial-003-gacha-recruit.png`
- `assets/2026-07-03-sagaforge-trial-003-terminal-evidence.png`

## Lesson

Trial 003で、AIDD Control PlaneのAI Task Packetには「persistent/user-action contract」が必要だと分かった。画面が豪華でも、操作が状態へ反映されなければプロトタイプは静止画に近い。次回以降は、mock backendへ保存される永続操作と、リロード後の再現性を検証対象に加える。
