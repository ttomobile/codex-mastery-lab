# AIDD Control Plane Dogfood 006：RPGプロトタイプをroot CI artifactへ載せる

> 2026-07-03 / Codex Mastery Lab  
> 対象: AIDD Control Plane Dogfood / キャラ収集ターン制RPG / root GitHub Actions・証跡artifact  
> 結果: **generated repoを壊さず、root `.github/workflows` からcoverage / playwright-report / test-results / terminal evidenceを保存するCIを追加した**

## 前回の振り返り

Trial 005では、キャラ収集ターン制RPGプロトタイプのmock backendを次の4 serviceへ分けた。

```text
mock-api
mock-media
mock-auth
mock-billing
```

それぞれに`/health`、`/state`、`/__control/state`を持たせ、media failure、premium training、billing failed、axe検査を3ブラウザE2Eで確認できるところまで進めた。

ただし、100点アプリクローン実験の条件としては、まだ重要な穴があった。CI workflowがroot `.github/workflows/` に置かれ、検証結果のartifactが保存される状態になっていないと、ローカルで通っただけのプロトタイプで止まってしまう。

## 今回の目的

Trial 006では、アプリ本体を広げずに検証面を固めることにした。

```text
- 既存の generated-repo を壊さない
- root .github/workflows にRPG dogfood用CI workflowを置く
- coverage / playwright-report / test-results をartifact保存する
- terminal evidenceもartifact保存する
- 記事とpreviewの連載順へTrial 006を追加する
```

実在IP、ロゴ、公式文言は使わず、RPG風の体験パターンだけを抽象化したプロトタイプとして扱う。

## 追加したCI

追加したworkflowは`Character Collection RPG Trial 006 CI`。

対象ディレクトリは既存のまま、次をworking directoryにしている。

```text
experiments/character-collection-rpg-trial-001/generated-repo
```

実行するgateは次の通り。

```text
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run doctor:playwright
pnpm run mock:doctor
pnpm run test:e2e
```

Playwrightは既存設定のChromium / Firefox / WebKitを使う。Firefoxの遅延を吸収するため、既存の`playwright.config.ts`では`timeout: 120_000`、`expect: 90_000`、`workers: 1`、local retryが設定済みだったので、CI側ではその設定を尊重した。

## 保存するartifact

CIでは次の4種類を保存する。

| artifact | 保存元 |
| --- | --- |
| coverage | `experiments/character-collection-rpg-trial-001/generated-repo/coverage/` |
| playwright-report | `experiments/character-collection-rpg-trial-001/generated-repo/playwright-report/` |
| test-results | `experiments/character-collection-rpg-trial-001/generated-repo/test-results/` |
| terminal evidence | `experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-006/terminal/` |

terminal evidenceはCI上でも`tee`で残す。ローカル検証でも同じTrial 006ディレクトリへログを保存するため、後から「どのgateが通ったか」を追いやすい。

## ローカル検証

ローカルでは次のログを保存した。

```text
experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-006/terminal/
```

| command | result |
| --- | --- |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 11 tests passed |
| `pnpm run test:coverage` | pass / statements 95.45%、branches 63.15%、functions 100%、lines 97.22% |
| `pnpm run build` | pass |
| `pnpm run doctor:playwright` | Chromium / Firefox / WebKit OK |
| `pnpm run mock:doctor` | pass / Docker Compose確認、Node fallback起動、4 service health確認 |
| `pnpm run test:e2e` | 30 tests passed / Chromium・Firefox・WebKit |

E2Eは10シナリオを3ブラウザで実行した。

```text
30 passed (58.6s)
```

最後に`pnpm run mock:stop`も実行し、E2Eで起動したDocker Compose mock serviceを停止した。

## 今回の意味

Trial 006で増えたのは、派手な画面ではない。むしろ、ユーザーから見えるゲーム機能はほぼ触っていない。

重要なのは、AIDD Control Planeが作ったプロトタイプを「見た目が動く」から「第三者がCI artifactで確認できる」へ進めたことだ。

```yaml
dogfood_ci_contract:
  source:
    - do_not_break_existing_generated_repo
  required_gates:
    - lint
    - typecheck
    - unit_test
    - coverage
    - build
    - playwright_doctor
    - mock_doctor
    - chromium_firefox_webkit_e2e
  required_artifacts:
    - coverage
    - playwright_report
    - test_results
    - terminal_evidence
```

この条件がroot CIにあると、次回以降のRPG dogfood改善も、画面追加だけでなく検証証跡込みで判断できる。

## 次回

Trial 007では、CI成功結果をGitHub Actions上で確認し、artifactの中身まで記事へ反映する。余力があれば、api offline、auth timeout、billing retryを個別復旧できる画面状態として追加する。
