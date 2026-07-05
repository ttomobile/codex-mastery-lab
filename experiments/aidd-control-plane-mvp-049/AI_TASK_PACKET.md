# AI Task Packet: AIDD Control Plane MVP 049

## 1. Product Brief

### 名前
Verification Run Detail Drilldown

### 解く課題
Codex Run Queue の1件について、`pnpm run lint` / `typecheck` / `test` / `build` / `test:e2e` / `doctor:aidd` を command別の明細として確認したい。AIの自己申告ではなく、exit code、duration、terminal log、artifact path、失敗分類、修正指示、3ブラウザ対象、必要スクリーンショットを1画面で確認し、Review Findingへ渡せる形にする。

### 非ゴール

- 実際にCodexを起動する機能は作らない
- 実ファイルのログアップロードやDB永続化はしない
- GitHub APIや外部CI連携はしない
- 英語UIにはしない

## 2. 主要ユーザーフロー

1. ユーザーが空状態を見る
2. サンプルのready run detailを読み込む
3. commit SHA、source queue item、run status、command別exit code、duration、artifact path、browser coverage、terminal/screenshot evidence、repair instructionを確認する
4. readyならReview Recordへ渡せる明細として表示する
5. failureサンプルでは不足・危険条件を日本語で一覧表示する
6. Review Finding draftには、失敗分類・修正指示・必要な上流情報・検証commandを出す

## 3. 状態設計

- empty: Verification Run Detail未作成。Run Queueの1件を選び、command別証跡を束ねる必要があることを表示
- ready: commit SHA、source queue item、run status、lint/typecheck/test/build/e2e/doctor:aiddのexit codeとartifact、Chromium / Firefox / WebKit、terminal/empty/valid/failure screenshot、AIDD-Spec接続が揃っている
- failure: 次を検出して止める
  - commit SHA不足
  - command別detail不足
  - exit code不足
  - artifact path不足
  - 失敗分類不足
  - 修正指示不足
  - Firefox除外
  - terminal evidence不足
  - failure screenshot不足
  - local path / host / private network URL混入
  - AIDD-Spec connection不足

## 4. 受け入れ条件

- UI文言、テスト名、サンプルデータは日本語
- Next.js + TypeScript + pnpm
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e` は Chromium / Firefox / WebKit
- `pnpm run doctor:aidd` はMVP049固有tokenと証跡条件を検査する
- `pnpm run capture:mvp049` で empty / ready / failure / terminal evidence 画像を生成する

## 5. Verification Evidence

保存先:

- `experiments/aidd-control-plane-mvp-049/artifacts/terminal/*.txt`
- `experiments/aidd-control-plane-mvp-049/artifacts/screenshots/*.png`
- repo root `assets/aidd-control-plane-mvp049-*.png`

## 6. AIDD-Spec接続

- `Verification Evidence` はcommand別の実行証跡を束ねる
- `Review Record` は failure category と repair instruction をfindingとして残す
- `Learning Log` は、繰り返し不足する証跡を次回packetへ戻す
- `AI Task Packet` は、次回修正に必要なcommandと証跡条件を明示する
