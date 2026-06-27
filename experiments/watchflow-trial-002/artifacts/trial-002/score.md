# WatchFlow Trial 002 採点

## 総合点

```text
75 / 100
```

Trial 001の61点から、検証可能性・依存管理・状態表現・コンポーネント分解が改善した。

## 実行結果

| コマンド | 結果 | メモ |
|---|---:|---|
| `pnpm install --frozen-lockfile` | 合格 | pnpm 10.24.0、lockfile再現 |
| `pnpm run lint` | 合格 | 最終実行でwarningなし |
| `pnpm run typecheck` | 合格 | exit 0 |
| `pnpm run test` | 合格 | 5 files / 17 tests passed。ただしReact `act(...)` warningあり |
| `pnpm run test:coverage` | 合格 | Statements 63.02%、Branches 54.78%、Functions 53.62%、Lines 68.48% |
| `pnpm run build` | 合格 | Next.js production build成功 |
| `pnpm run doctor:playwright` | 期待通り不合格 | Chromium/WebKit OK、Firefox不足を検出 |
| `pnpm exec playwright test --project=chromium --project=webkit` | 合格 | 17 tests passed。E2E/Visual/axe含む |

## 採点

| カテゴリ | 配点 | Trial 002 | 理由 |
|---|---:|---:|---|
| Product Parity | 10 | 6 | 状態ページとデザインシステムは増えたが、動画サービス固有の購読/履歴/通知/プレイリストはまだ弱い |
| Video Experience | 12 | 8 | VideoPlayer分割、再生速度、字幕、PiP/全画面の安全な入口が入った。実ストリーミングやbuffer可視化は未達 |
| Network / State Handling | 10 | 8 | session_expired/payment_failed/offline/timeoutが実画面とE2Eに入った |
| Mock Backend Contracts | 8 | 6 | docker-composeと各mock READMEが入ったが、独立serviceはplaceholder寄り |
| Technical Foundation / Dependency Governance | 10 | 8 | pnpm固定、lockfile、doctor、ADR更新。Next/React/TSは攻めた版のまま |
| Next.js Architecture Fitness | 10 | 8 | App Router、Route Handler、design-system/states追加。Server/Client境界バグを修正済み |
| Component Architecture | 8 | 7 | VideoPlayerをShell/Controls/Captions/state machine/adapter/errorsへ分割 |
| Design System | 8 | 6 | docs/design-systemとカタログ画面を追加。Storybook相当やvariant網羅は未達 |
| Accessibility | 8 | 7 | axe検査をE2Eに追加し、Chromium/WebKitで合格。color-contrastは無効化中 |
| E2E / Visual / Unit | 13 | 8 | Unit 17件、coverage、Chromium Visual 5件、Chromium/WebKit E2E 17件。Firefoxは未実行 |
| Public Repo Operations | 6 | 3 | CI/Dependabotはあるが、Trial 002で実CI未確認。Licenseや公開運用は未強化 |
| **合計** | **100** | **75** | Trial 001から+14点 |

## 主な改善

- npmからpnpmへ移行。
- Playwright doctorを追加し、Firefox不足を明示的に検出。
- VideoPlayerを責務分割。
- 再生速度、字幕、全画面/PiPの入口を追加。
- session_expired、payment_failed、offline、timeoutの状態画面を追加。
- axe検査をE2Eへ追加。
- coverage閾値とcoverage reportを追加。
- Unit Testが5件から17件へ増加。
- Visual Regressionにモバイル、検索空状態、エラー状態を追加。
- docs/design-systemと簡易カタログ画面を追加。
- docker-composeとmock service READMEを追加。

## 残った失点

1. Firefoxの実ブラウザ取得がまだ完了していない。
2. docker-composeのmock serviceはplaceholderで、実APIとして分離されていない。
3. `act(...)` warningが残っている。
4. color-contrastのaxe ruleを無効化しており、アクセシビリティ100点とは言えない。
5. 動画再生はまだローカルmp4中心で、range/低帯域/途中切断/buffer量可視化が弱い。
6. WatchFlowのProduct ParityはまだYouTube風の回遊体験に届いていない。
7. CIは設定済みだが実GitHub Actions結果はまだない。

## Trial 003へ戻すAI Task Packet差分

- Firefox install問題を切り分ける。できない場合はbrowser cacheを再利用する方針、またはCIでのFirefox証拠を取得する。
- `act(...)` warningをゼロにする。
- axeのcolor-contrast ruleを有効化し、必要ならデザインtokenを修正する。
- mock-api/mock-media/mock-auth/mock-billingを本当に独立Node serviceとして実装し、docker-composeで起動する。
- media serverにRange request、slow stream、interrupted stream、404、500、subtitleを実装する。
- VideoPlayerにbuffered range表示、再生速度テスト、keyboard shortcutテストを追加する。
- Product Parityとして、サイドナビ、カテゴリレール、登録チャンネル、履歴、プレイリスト、通知風UIを追加する。
- CI artifactと公開READMEをより実運用寄りにする。
