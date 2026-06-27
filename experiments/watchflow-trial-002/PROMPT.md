# WatchFlow Trial 002 Codex Prompt

あなたは `/path/to/project-root/experiments/watchflow-trial-002/generated-repo/` にある WatchFlow Trial 001 のNext.jsアプリを改善します。

## 絶対条件

- 変更は `/path/to/project-root/experiments/watchflow-trial-002/generated-repo/` 配下に閉じる。
- 既存の Trial 001 や articles/ は変更しない。
- README/docsに個人ユーザー名を含む絶対パスを書かない。公開向け表記は `/path/to/project-root/` にする。
- UI、テスト名、エラー文、README/docsは日本語ベース。
- YouTubeのロゴ、商標、実データ、実APIは使わない。独自名 WatchFlow のままにする。
- 生成後、可能な限り lint/typecheck/unit/build/E2E を実行し、結果を日本語で報告する。

## Trial 001の結果

Trial 001は 61/100。

合格したこと:

- Next.js App Router
- TypeScript strict
- mock API / mock media / auth / billing
- 動画詳細 / 検索 / コメント / チャンネル
- VideoPlayer Client Component
- Unit / Component Test
- Playwright E2E / Visual Regression
- GitHub Actions / Dependabot
- GDPR readiness doc

失点:

- package managerがnpm。チーム標準はpnpm。
- Playwright Firefoxが未導入でマルチブラウザ完全合格にならなかった。
- VideoPlayer.tsxに責務が集中している。
- mock-api / mock-media / mock-auth / mock-billingがNext.js Route Handler内に閉じており、docker-composeで独立制御できない。
- payment_failed、session_expired、offline、timeoutがユーザー体験として弱い。
- Design Systemのtokens/variants/components文書とカタログが弱い。
- axe検査とcoverage閾値がない。
- Unit Testが少ない。
- LCP対象posterに `loading="eager"` または優先表示の配慮がない。

## Trial 002の改善目標

### 1. Dependency Governance

- package managerをpnpmに固定する。
- `packageManager`、lockfile、セットアップ手順をpnpm前提に更新する。
- Node.js / Next.js / React / TypeScript の採用バージョン理由を `docs/decisions/` に追記する。
- 既存のNext.js 16 / React 19 / TypeScript 6を継続する場合は、そのリスクと理由を書く。安定版へ下げる場合も理由を書く。

### 2. Playwright Doctor / Multi Browser

- `scripts/doctor-playwright.mjs` を追加する。
- Chromium / Firefox / WebKit の実行ファイルが揃っているか事前確認する。
- 揃っていない場合に `pnpm exec playwright install` を案内する。
- READMEとGitHub Actionsにブラウザインストール手順を明記する。
- E2EはChromium/Firefox/WebKit前提を維持する。

### 3. VideoPlayer分割

`features/video/VideoPlayer.tsx` を責務分割する。

候補:

- `VideoPlayerShell.tsx`
- `PlayerControls.tsx`
- `CaptionsControl.tsx`
- `usePlayerStateMachine.ts`
- `mediaAdapter.ts`
- `playerErrors.ts`

要求:

- 再生/停止、シーク、音量/ミュート、字幕、失敗/リトライを維持する。
- 再生速度UIを追加する。
- 全画面またはPicture in Pictureは、ブラウザAPIが使える場合だけ安全に出す。
- keyboard操作のテストを増やす。

### 4. Mock Backend / Failure State

Route Handlerは維持してよいが、Trial 002ではdocker-composeで独立mock service化する準備を入れる。

最低限:

- `docker-compose.yml`
- `mocks/api/README.md`
- `mocks/media/README.md`
- `mocks/auth/README.md`
- `mocks/billing/README.md`
- 実装が重い場合は、独立serviceの契約と起動placeholderでもよい。ただしなぜplaceholderなのかdocsに書く。

画面上に以下の状態を出す:

- anonymous
- logged_in
- premium
- session_expired
- payment_failed
- offline
- timeout

E2Eで少なくとも3つ以上確認する。

### 5. Accessibility / Visual / Coverage

- `@axe-core/playwright` を導入し、基本ページでaxe検査を行う。
- coverage設定を追加する。初回閾値は低くてよいが、閾値を明記する。
- Unit Testを増やす。
  - format境界値
  - search filter
  - billing/auth display mapping
  - player error mapping
- Visual Regressionにモバイル、検索空状態、エラー状態を追加する。

### 6. Design System

- `docs/design-system.md` を追加する。
- tokens、colors、typography、spacing、radius、focus、motion、responsive breakpointsを書く。
- `app/design-system/page.tsx` のような簡易コンポーネントカタログを追加する。
- Button / StateView / VideoCard / PlayerControlsのvariantsが分かるようにする。

### 7. Performance warning

- LCP対象posterに対して `loading="eager"` またはNext.js Imageの `priority` 相当の扱いを行う。
- もし通常の `<video poster>` で解決できない場合は、warningの扱いと判断理由をdocsに書く。

## 期待する最終報告

- 変更したファイル概要
- 実行したコマンド
- 成功/失敗結果
- 残った制約
- Trial 002の自己採点案
