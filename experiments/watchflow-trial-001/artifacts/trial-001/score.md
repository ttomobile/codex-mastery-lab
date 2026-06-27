# WatchFlow Trial 001 採点

## 総合点

```text
61 / 100
```

## 実行結果

| コマンド | 結果 | メモ |
|---|---:|---|
| `npm audit --audit-level=moderate` | 合格 | 0 vulnerabilities |
| `npm run lint` | 合格 | exit 0 |
| `npm run typecheck` | 合格 | exit 0 |
| `npm run test` | 合格 | 2 files / 5 tests passed。ただしReact `act(...)` warningあり |
| `npm run build` | 合格 | Next.js production build成功 |
| `npm run test:e2e` | 一部不合格 | Chromium/WebKitは合格。Firefoxは実行環境のブラウザ未インストールで失敗 |
| `npx playwright test --project=chromium --project=webkit` | 合格 | 8 tests passed |
| `npx playwright install firefox` | 未完了 | 600秒timeout。Trial 002でCI/ローカルセットアップ改善対象 |

## 100点ルーブリック採点

| カテゴリ | 配点 | Trial 001 | 理由 |
|---|---:|---:|---|
| Product Parity | 10 | 5 | ホーム、検索、動画詳細、コメント、チャンネルはあるが、サイドナビ、購読、履歴、ショート、プレイリスト、通知などは弱い |
| Video Experience | 12 | 7 | poster、再生/停止、シーク、音量、字幕track、失敗/リトライはある。再生速度、全画面、PiP、実ストリーミング、字幕切替UIはない |
| Network / State Handling | 10 | 6 | 検索空状態、メディア失敗、遅延、404、retryはある。offline、timeout、session expired、payment failedの画面反映は限定的 |
| Mock Backend Contracts | 8 | 5 | Route HandlerでAPI/auth/billing/mediaはあるが、docker-composeや独立mock service、テストからの状態制御はない |
| Technical Foundation / Dependency Governance | 10 | 6 | Node/npm/lockfile/pinning/ADRはある。pnpmではなくnpm、Next 16/React 19/TS 6など攻めた採用で実務標準との整合確認が必要 |
| Next.js Architecture Fitness | 10 | 7 | App Router、Route Handler、loading/error/not-found、Client VideoPlayer分離は良い。API境界やキャッシュ/Server Component戦略は浅い |
| Component Architecture | 8 | 6 | feature/ui/lib分離あり。VideoPlayerが165行で責務がやや集中。状態機械やplayer adapterは未分離 |
| Design System | 8 | 4 | 独自見た目とCSS variablesはあるが、design token文書、variant体系、コンポーネントカタログはない |
| Accessibility | 8 | 5 | aria-label、role、button名、caption trackはある。体系的axe検査、focus order、contrast証拠、keyboard網羅は不足 |
| E2E / Visual / Unit | 13 | 6 | Unit/Component/E2E/Visualあり。Firefox未実行、テスト数が少ない、VisualはChromium中心、coverage未取得 |
| Public Repo Operations | 6 | 4 | GitHub Actions、Dependabot、README、docsあり。公開用license、artifact運用の実CI確認、商標注意の強化が必要 |
| **合計** | **100** | **61** | 初回としてはかなり多く作ったが、100点には程遠い |

## 主な失点

1. Firefox実行環境が未完了で、マルチブラウザ完全合格にならなかった。
2. 動画プレイヤーはあるが、本物の動画サービスらしい再生速度、全画面、PiP、字幕切替、buffer量表示、実ストリーミング制御がない。
3. mock-api / mock-media / mock-auth / mock-billing はNext.js Route Handler内で完結しており、docker-composeで独立制御できない。
4. payment_failed、session_expired、offline、timeoutなどの状態はデータ/APIとして存在しても、ユーザー体験として十分に表現されていない。
5. 関連動画欄は存在するが、初期表示の画面密度や情報設計が弱く、YouTube風の回遊体験には遠い。
6. `VideoPlayer.tsx` に再生状態、UI、イベント処理が集中しており、100点基準では状態機械やadapterに分けたい。
7. Design SystemはCSS中心で、tokens/variants/componentsの証跡が不足している。
8. Unit Testは5件だけで、検索、権限、課金、API error mapping、GDPR utility、format境界値を十分に見ていない。
9. VitestでReact `act(...)` warningが出ている。
10. LCP対象画像に `loading="eager"` 推奨warningが出ている。
11. npm採用は再現性として悪くないが、チーム標準のpnpm指定からはズレている。
12. Next.js 16.2.9、React 19.2.7、TypeScript 6.0.3など、かなり新しい組み合わせを選んでおり、実務採用の安定性評価が必要。

## Trial 002へ戻すAI Task Packet差分

- package managerはpnpm固定にする。
- Next.js/React/TypeScriptのバージョンは、実務安定版を明示し、採用理由をADRに書かせる。
- Playwright browsers installをセットアップ手順とCIに明記し、Firefox未導入で落ちない事前チェックを入れる。
- mock serviceはRoute Handlerだけでなく、docker-composeで `mock-api` / `mock-media` / `mock-auth` / `mock-billing` を分ける。
- VideoPlayerを `player state machine`、`media adapter`、`controls`、`captions` に分解する。
- payment_failed、session_expired、offline、timeoutを実画面とE2Eで確認する。
- Visual Regressionにモバイル、検索結果、エラー状態、watch pageを含める。
- axeによるアクセシビリティ検査をE2Eへ追加する。
- coverage閾値を設定し、Unit Test対象をformat/search/permission/error mappingへ広げる。
- design-system文書とコンポーネントカタログを作る。
