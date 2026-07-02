# Verification Evidence: Character Collection RPG Trial 004

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: "character-collection-rpg-trial-004"
series: "AIDD Control Plane Dogfood"
result: "passed"
product: "SagaForge Trial 004 backend persistence upgrade"
```

## Scope

Trial 003の画面内操作を、mock backendへ保存する契約へ進めた。編成交替、育成、召喚加入がPOST action経由でmock serviceへ反映され、リロード後も残ることを3ブラウザE2Eで検証した。

## Added Backend Persistence Contract

- `/actions/swap-party`: 編成交替をmock backendへ保存する。
- `/actions/train`: 育成結果をmock backendへ保存する。
- `/actions/recruit`: 召喚候補の名簿加入をmock backendへ保存する。
- `auth_anonymous` / `auth_premium`: 育成枠表示をmock auth stateで切り替える。
- `payment_failed`: 召喚加入をdisabledにして成功操作を止める。

## Non-infringement

- 実在IPの公式素材、ロゴ、キャラクター、文言は使っていない。
- キャラ収集、編成、ターン制バトル、育成、召喚、保存という体験パターンだけを抽象化した。
- auth / billingも独自mock状態であり、公式料金・確率・文言は扱っていない。

## Quality Gates

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm run lint` | pass | `artifacts/character-collection-rpg-trial-004/terminal/02-lint.txt` |
| `pnpm run typecheck` | pass | `03-typecheck.txt` |
| `pnpm run test` | pass, 11 tests | `04-test.txt` |
| `pnpm run test:coverage` | pass, 95.45% statements | `04b-coverage.txt` |
| `pnpm run build` | pass | `05-build.txt` |
| `pnpm run doctor:playwright` | pass, Chromium/Firefox/WebKit | `06-playwright-doctor.txt` |
| `pnpm run mock:doctor` | pass | `07-mock-doctor.txt` |
| Docker Compose mock start | pass, `/health` and `/state` verified | `07b-mock-docker-start.txt` |
| `pnpm run test:e2e` | pass, 24 tests / 3 browsers | `08-e2e.txt` |

## E2E Coverage Added

- `payment_failed`では失敗表示だけでなく、加入ボタンがdisabledになる。
- `auth_anonymous`と`auth_premium`で育成枠表示が切り替わる。
- 編成交替後にリロードしても、隊列に`リク`が残る。
- 育成後にリロードしても、`Lv.43`が残る。
- 召喚加入後にリロードしても、名簿数が`5名`のまま残る。

## Docker Compose Fix

Docker Compose経路でmock serverがコンテナ内`127.0.0.1`にlistenしており、ホストからhealth checkできない問題を発見した。`HOST=0.0.0.0`をcomposeから渡し、mock serverが`HOST`環境変数でlistenするように修正した。

## Captures

- `assets/2026-07-03-sagaforge-trial-004-party-persist.png`
- `assets/2026-07-03-sagaforge-trial-004-training-persist.png`
- `assets/2026-07-03-sagaforge-trial-004-premium-training.png`
- `assets/2026-07-03-sagaforge-trial-004-payment-block.png`
- `assets/2026-07-03-sagaforge-trial-004-terminal-evidence.png`

## Lesson

Trial 004で、AIDD Control PlaneのAI Task Packetには「backend persistence contract」が必要だと分かった。ユーザー操作は、押した直後に画面が変わるだけでは不十分で、mock backendに保存され、リロード後に読み戻せ、失敗状態では成功操作が止まるところまで検証対象にする。
