# WatchFlow Trial 003 採点

## 総合点

```text
84 / 100
```

Trial 002の75点から+9点。

## 実行結果

| コマンド | 結果 | メモ |
|---|---:|---|
| `pnpm install --frozen-lockfile` | 合格 | exit 0 |
| `pnpm run lint` | 合格 | exit 0 |
| `pnpm run typecheck` | 合格 | exit 0 |
| `pnpm run test` | 合格 | 6 files / 20 tests passed。act warningなし |
| `pnpm run test:coverage` | 合格 | Statements 66.41%、Branches 61.49%、Functions 55.69%、Lines 70.22% |
| `pnpm run build` | 合格 | Next.js build成功 |
| `pnpm run doctor:playwright` | 期待通り不合格 | Firefox不足を検出。Chromium/WebKitはOK |
| `pnpm exec playwright test --project=chromium --project=webkit` | 合格 | 17 tests passed。color-contrast込みaxe |

## 採点

| カテゴリ | 配点 | Trial 003 | 理由 |
|---|---:|---:|---|
| Product Parity | 10 | 8 | サイドナビ、カテゴリ、登録チャンネル、履歴、プレイリスト、通知風UIを追加 |
| Video Experience | 12 | 9 | Range/500/interruptedのmedia service test追加。LCP warningは残る |
| Network / State Handling | 10 | 8 | 状態UIは維持。mock service外部切替は未完 |
| Mock Backend Contracts | 8 | 7 | 独立Node http serviceを追加。E2Eの実依存切替はまだ |
| Technical Foundation | 10 | 8 | pnpm/coverage/doctor維持。Firefox環境は未解決 |
| Next.js Architecture | 10 | 8 | Next側は安定。外部mockとの接続設定は次回課題 |
| Component Architecture | 8 | 7 | VideoPlayer分割を維持。さらなる状態機械テスト余地あり |
| Design System | 8 | 7 | contrast対応と情報設計改善。Storybook相当は未達 |
| Accessibility | 8 | 8 | color-contrast除外なしでaxe合格 |
| E2E / Visual / Unit | 13 | 10 | Unit 20件、coverage、Chromium/WebKit 17件合格。Firefox未完 |
| Public Repo Operations | 6 | 4 | mock services docs追加。CI実行証跡/Licenseは未完 |
| **合計** | **100** | **84** | 80点台到達 |

## 主な改善

- React `act(...)` warningが消えた。
- axeのcolor-contrast除外を外してもChromium/WebKitで合格。
- mock-api/mock-media/mock-auth/mock-billingの独立Node serviceを追加。
- mock-mediaにRange request、500、interrupted、slow、captionを実装。
- media service testを追加。
- ホームにサイドナビ、カテゴリ、登録チャンネル、履歴、プレイリスト、通知風UIを追加。

## 残課題

- Firefox実ブラウザはまだローカルにない。
- LCP対象poster warningが残っている。
- 独立mock serviceをE2Eの実依存として使う切替が未完。
- CI上でFirefox含む証跡をまだ取得していない。
- 課金・履歴・プレイリストはまだUI中心で、権限制御やデータ操作は浅い。

## Trial 004へ戻す差分

- LCP poster warningを消す。
- E2Eをdocker-compose mock services依存に切り替える。
- Firefoxはローカルで無理ならGitHub Actions上の実行証跡を取る。
- mock servicesに状態変更APIを追加し、E2Eからauth/billing/network/media状態を切り替える。
- CI artifact、License、公開READMEを強化する。
