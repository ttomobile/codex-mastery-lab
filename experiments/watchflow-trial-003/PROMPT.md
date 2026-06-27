# WatchFlow Trial 003 Codex Prompt

あなたは `/path/to/project-root/experiments/watchflow-trial-003/generated-repo/` にある WatchFlow Trial 002 のNext.jsアプリを改善します。

実際の作業ディレクトリは `/path/to/project-root/experiments/watchflow-trial-003/generated-repo/` です。ただし、README/docs/logに個人ユーザー名を含む絶対パスを書かないでください。

## 絶対条件

- 変更は `/path/to/project-root/experiments/watchflow-trial-003/generated-repo/` 配下に閉じる。
- Trial 001/002やarticlesは変更しない。
- UI、テスト名、エラー文、README/docsは日本語ベース。
- YouTubeのロゴ、商標、実データ、実APIは使わない。
- pnpm前提を維持する。
- 可能な限り `pnpm run lint`、`pnpm run typecheck`、`pnpm run test`、`pnpm run test:coverage`、`pnpm run build`、`pnpm exec playwright test --project=chromium --project=webkit` を実行する。

## Trial 002結果

Trial 002は 75/100。

成功:

- pnpm固定
- Playwright doctor追加
- VideoPlayer分割
- session_expired/payment_failed/offline/timeout状態UI
- axe検査追加
- coverage追加
- Unit 17件
- Chromium/WebKitでE2E+Visual+axe 17件合格
- Design System doc/画面追加
- docker-composeとmock service README追加

残課題:

- Firefox実ブラウザ未導入。ただしこれは環境問題なので、今回はdoctor/CI説明の改善だけでよい。
- `act(...)` warningが残っている。
- axeでcolor-contrast ruleを無効化している。
- mock-api/mock-media/mock-auth/mock-billingがplaceholderで独立serviceとして動かない。
- media serverにRange request、slow stream、interrupted stream、404、500、subtitleなどの実障害再現がない。
- Product Parityがまだ弱い。

## Trial 003の改善目標

### 1. React act warningゼロ

- `features/video/VideoPlayer.test.tsx` の `act(...)` warningをなくす。
- warningを抑制するのではなく、ユーザー操作後の状態更新を正しく待つ。
- `pnpm run test` と `pnpm run test:coverage` のstderrにact warningが出ない状態を目指す。

### 2. axe color-contrast有効化

- E2Eのaxe検査から `disableRules(["color-contrast"])` を外す。
- 色やtokenを直して、基本ページでcolor contrastを含めてaxe合格させる。
- もし一部だけ合理的に除外するなら、理由をdocs/accessibility.mdに書く。ただし原則は有効化。

### 3. mock serviceを実体化

Route Handlerは残してよいが、docker-composeで独立mock serviceが起動できるようにする。

最低限:

- `mocks/api/package.json`
- `mocks/api/server.mjs`
- `mocks/media/package.json`
- `mocks/media/server.mjs`
- `mocks/auth/package.json`
- `mocks/auth/server.mjs`
- `mocks/billing/package.json`
- `mocks/billing/server.mjs`
- `docker-compose.yml` から各serviceを起動
- README/docsに起動手順

実装は軽量なNode http serverでよい。Express等の追加依存は避ける。

### 4. media server障害再現

`mocks/media/server.mjs` またはNext Route Handlerで以下を再現する。

- normal mp4
- 404
- 500
- slow response
- interrupted response
- Range request対応
- captions vtt

E2EまたはUnitで少なくともRange request、500、interruptedのどれか2つを確認する。

### 5. Product Parityを少し上げる

大きく作り込まなくてよいが、以下のうち最低3つを追加する。

- サイドナビ
- カテゴリレール
- 登録チャンネル
- 履歴
- プレイリスト
- 通知風UI

ホーム画面のYouTube風/動画サービス風の情報設計を少し強める。

### 6. docs更新

- `docs/testing.md` をTrial 003に合わせて更新。
- `docs/mock-services.md` を追加。
- `docs/accessibility.md` を追加。
- `docs/score-self-review.md` をTrial 003自己評価に更新。

## 期待する最終報告

- 変更概要
- 実行したコマンドと結果
- 残った制約
- Trial 003の自己採点案
