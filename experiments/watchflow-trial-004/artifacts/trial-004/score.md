# WatchFlow Trial 004 採点

## 総合点

```text
91 / 100
```

Trial 003の84点から+7点。90点台に到達。

## 実行結果

| コマンド | 結果 | メモ |
|---|---:|---|
| `pnpm install --frozen-lockfile` | 合格 | exit 0 |
| `pnpm run lint` | 合格 | exit 0 |
| `pnpm run typecheck` | 合格 | exit 0 |
| `pnpm run test` | 合格 | 6 files / 21 tests passed。act warningなし |
| `pnpm run test:coverage` | 合格 | Statements 67.35%、Branches 64.28%、Functions 54.87%、Lines 71.08% |
| `pnpm run build` | 合格 | Next.js build成功 |
| `pnpm run doctor:playwright` | 期待通り不合格 | Firefox不足を検出。Chromium/WebKitはOK |
| `pnpm exec playwright test --project=chromium --project=webkit` | 合格 | 23 tests passed。Node fallbackでmock servicesを実依存化 |

## 採点

| カテゴリ | 配点 | Trial 004 | 理由 |
|---|---:|---:|---|
| Product Parity | 10 | 9 | 後で見るの追加/解除操作が入り、UIだけでなく操作可能になった |
| Video Experience | 12 | 10 | LCP poster warningがE2Eログから消え、mock-media failureもE2Eで確認 |
| Network / State Handling | 10 | 9 | control endpointでauth/billing/network/media状態をE2Eから変更できる |
| Mock Backend Contracts | 8 | 8 | 独立mock serviceをE2E実依存化。Docker失敗時Node fallbackも確認 |
| Technical Foundation | 10 | 9 | pnpm/coverage/doctor/CI artifact/Playwright install整備。Firefoxローカルだけ未解決 |
| Next.js Architecture | 10 | 9 | external mock boundaryが入り、Route Handlerだけに閉じない構成になった |
| Component Architecture | 8 | 7 | VideoPlayer分割維持。大幅追加はなし |
| Design System | 8 | 7 | Trial 003水準を維持。Storybook相当は未達 |
| Accessibility | 8 | 8 | color-contrast込みaxe合格を維持 |
| E2E / Visual / Unit | 13 | 12 | Unit 21件、Chromium/WebKit 23件合格、mock service state操作も確認。Firefoxローカル未完 |
| Public Repo Operations | 6 | 5 | LICENSE、公開README、CI artifact強化。実CI run証跡は未取得 |
| **合計** | **100** | **91** | 90点台到達 |

## 主な改善

- LCP poster warningがE2Eログから消えた。
- `mock:start` / `mock:stop` を追加し、Docker Compose優先、Docker daemonなしならNode直接起動へfallbackするようにした。
- E2Eで独立mock serviceの `/__control/state` を叩き、画面反映を確認できるようにした。
- mock-media failureを動画画面で確認するE2Eを追加。
- 「後で見る」追加/解除をE2Eで確認。
- CIで `pnpm exec playwright install --with-deps` とartifact uploadを追加。
- `LICENSE` と公開repo向けREADMEを追加。

## 残課題

- ローカルFirefox実行環境はまだ未導入。
- Docker daemonが起動していないため、今回はNode fallback経由でmock servicesを確認した。
- CI workflowは整備されたが、GitHub Actionsの実run証跡はまだ見ていない。
- 課金/履歴/プレイリストの永続データ操作はまだ限定的。
- coverageのFunctionsは54.87%で、まだ100点品質には届かない。

## Trial 005へ戻す差分

- GitHub Actionsを実際に走らせ、Firefox込みのCI証跡を取得する。
- Docker daemonありの環境でdocker-compose mock services pathも確認する。
- coverage thresholdを段階的に導入する。
- 履歴削除、プレイリスト永続化、premium権限制御をUIだけでなくデータ操作として実装する。
- READMEにCI badgeや記事リンクを追加する。
