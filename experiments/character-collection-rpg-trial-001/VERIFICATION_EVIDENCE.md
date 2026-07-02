# Verification Evidence: Character Collection RPG Trial 001

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: "character-collection-rpg-trial-001"
series: "AIDD Control Plane Dogfood"
result: "passed_with_note"
product: "SagaForge Trial 001"
```

## Result

AIDD Control Planeで作ったAI Task Packetを使い、商標非利用のキャラ収集RPG風スマホWebプロトタイプをCodexで生成し、独立検証した。

## Quality Gates

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | pass | `artifacts/character-collection-rpg-trial-001/terminal/01-install.txt` |
| source/IP leak scan | pass | `source_leaks 0` |
| `pnpm run lint` | pass | `02-lint.txt` |
| `pnpm run typecheck` | pass | `03-typecheck.txt` |
| `pnpm run test` | pass, 5 tests | `04-test.txt` |
| `pnpm run test:coverage` | pass, statements 96.29% | `04b-coverage.txt` |
| `pnpm run build` | pass | `05-build.txt` |
| `pnpm run mock:doctor` | pass | `06-mock-doctor.txt` |
| `pnpm run doctor:playwright` | pass, Chromium/Firefox/WebKit | `07-doctor-playwright.txt` |
| `pnpm run test:e2e` | pass, 15 tests / 3 browsers | `08-e2e.txt` |

## E2E Coverage

- ホームから編成、遠征、戦闘、幻晶結果まで確認できる
- empty_rosterでは名簿の空状態を表示する
- party_invalidでは戦闘前に編成不備を表示する
- payment_failedでは幻晶画面に決済失敗を表示する
- 状態画面からofflineとtimeoutへ切り替えられる
- 上記をChromium / Firefox / WebKitで確認

## Captures

- `assets/2026-07-02-sagaforge-trial-001-home.png`
- `assets/2026-07-02-sagaforge-trial-001-party.png`
- `assets/2026-07-02-sagaforge-trial-001-battle.png`
- `assets/2026-07-02-sagaforge-trial-001-gacha.png`
- `assets/2026-07-02-sagaforge-trial-001-failure.png`
- `assets/2026-07-02-sagaforge-trial-001-terminal-evidence.png`

## Important Correction

Codex-generated Playwright config originally used port 3000. Another local Next app was already listening on port 3000, and Playwright reused the wrong server. We changed the E2E port to 3141 and reran Chromium plus 3-browser E2E successfully.

## Non-infringement

The implementation avoids real Romancing SaGa RS / SaGa / Square Enix names, logos, characters, official copy, official rates, and assets. It uses original names such as SagaForge / 星紋遠征隊.

## Next

Trial 002 should improve product depth: more battle decisions, roster filtering, training progression, and stronger mock-service separation while keeping the same AIDD evidence loop.
