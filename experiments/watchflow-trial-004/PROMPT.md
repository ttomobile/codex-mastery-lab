# WatchFlow Trial 004 Codex Prompt

あなたは `/path/to/project-root/experiments/watchflow-trial-004/generated-repo/` にある WatchFlow Trial 003 のNext.jsアプリを改善します。

実際の作業ディレクトリは `/path/to/project-root/experiments/watchflow-trial-004/generated-repo/` です。ただし、README/docs/logに個人ユーザー名を含む絶対パスを書かないでください。

## 絶対条件

- 変更は `/path/to/project-root/experiments/watchflow-trial-004/generated-repo/` 配下に閉じる。
- Trial 001/002/003やarticlesは変更しない。
- UI、テスト名、エラー文、README/docsは日本語ベース。
- YouTubeのロゴ、商標、実データ、実APIは使わない。
- pnpm前提を維持する。
- 可能な範囲で以下を実行し、結果を報告する。
  - `pnpm install --frozen-lockfile`
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `pnpm run test`
  - `pnpm run test:coverage`
  - `pnpm run build`
  - `pnpm exec playwright test --project=chromium --project=webkit`

## Trial 003結果

Trial 003は **84/100**。

成功:

- pnpm固定
- React `act(...)` warning解消
- color-contrast込みaxe合格
- Unit 20件
- coverage: Statements 66.41%、Branches 61.49%、Functions 55.69%、Lines 70.22%
- Chromium/WebKitでE2E+Visual+axe 17件合格
- mock-api/mock-media/mock-auth/mock-billingの独立Node service追加
- media serviceにRange/500/interrupted/slow/caption追加
- Product Parityとしてサイドナビ、カテゴリ、登録チャンネル、履歴、プレイリスト、通知風UI追加

残課題:

- LCP対象poster warningが残っている。
- 独立mock serviceをE2Eの実依存として使っていない。
- mock servicesにE2Eから状態変更するAPIがない。
- CI上のFirefox/Artifact証跡がない。
- License / 公開README / CI artifact導線が弱い。
- 課金、履歴、プレイリストはまだUI中心で、実データ操作が浅い。

## Trial 004の改善目標

### 1. LCP poster warningを消す

Playwright実行時に出ていた以下の警告を消す。

```text
Image with src "/api/media/poster?v=vf-003" was detected as the Largest Contentful Paint (LCP). Please add the `loading="eager"` property if this image is above the fold.
```

対応方針:

- above the foldの主要poster画像に `priority` または `loading="eager"` 相当を設定。
- Next.js Imageの正しい使い方に沿う。
- E2Eログで同warningが出ない状態を目指す。

### 2. E2Eをdocker-compose mock services依存に切り替える

Trial 003では独立mock serviceを作ったが、E2EはまだNext.js Route Handler中心だった。
Trial 004では、E2Eからmock servicesを実依存として使う導線を作る。

最低限:

- `docker-compose.yml` のservicesを維持/改善。
- `scripts/start-mock-services.mjs` または同等の起動/health check scriptを追加。
- `scripts/stop-mock-services.mjs` またはcleanupを追加。
- `playwright.config.ts` のwebServerまたはglobal setupでmock service起動を組み込む。
- Dockerがない環境でもCI/ローカルが完全に詰まらないよう、Node直接起動fallbackを用意する。
- E2Eで少なくとも1本はmock-mediaまたはmock-auth/billingの独立serviceに触っていることを検証する。

Docker依存で実行が難しい場合は、Node直接起動で同じserviceを使う形でもよい。重要なのは「Next Route Handlerだけでなく独立serviceをE2Eの実依存にする」こと。

### 3. mock servicesに状態変更APIを追加

E2Eから状態を切り替えられるAPIを追加する。

対象:

- auth: anonymous / logged_in / premium / session_expired
- billing: free / premium / payment_failed
- media: normal / slow / not_found / failure / interrupted
- network: online / offline / timeout 相当

最低限:

- `POST /state` または `POST /__control/state` のようなcontrol endpoint。
- `GET /state` で現在状態を確認。
- E2Eから状態を設定して画面に反映されることを確認。
- control endpointはmock service専用で、本番API扱いにしないことをREADME/docsへ明記。

### 4. CI artifact/Firefox証跡の改善

ローカルFirefoxが未導入でも、CI側でFirefoxを走らせる前提を強める。

最低限:

- `.github/workflows/ci.yml` を確認/改善。
- `pnpm exec playwright install --with-deps` 相当をCIに入れる。
- HTML report、test-results、coverageをartifactとしてupload。
- READMEかdocs/testing.mdにCI上でFirefoxを含めて確認する方針を書く。

### 5. License / 公開README強化

Public Repo Operationsの点を上げる。

- `LICENSE` を追加。MITでよい。
- ルートREADMEを公開repo向けに更新。
- セットアップ、検証、E2E、mock services、既知の制約を書く。
- 実API/実個人情報/YouTube商標を使わない方針を書く。

### 6. Product Parityの実データ操作を少し増やす

UIだけだった履歴/プレイリスト/課金状態のうち、最低1つを操作できるようにする。

候補:

- 「後で見る」プレイリストへ追加/解除
- 視聴履歴に追加されるmock
- premium限定表示のロック/解除
- 通知を既読にする

テストで少なくとも1つ確認する。

## docs更新

- `docs/testing.md`
- `docs/mock-services.md`
- `docs/score-self-review.md`
- 必要なら `docs/public-repo.md` を追加

## 期待する最終報告

- 変更概要
- 実行したコマンドと結果
- 残った制約
- Trial 004自己採点案
