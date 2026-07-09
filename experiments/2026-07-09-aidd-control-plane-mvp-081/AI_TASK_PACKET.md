# AI Task Packet: AIDD Control Plane MVP081 Dispatch Receipt History Comparator

## 1. 目的

AIDD Control PlaneのMVP081として、MVP080で作ったRun Queue Dispatch Receiptを複数件の履歴として比較し、同じ失敗が減ったか、どのRepair Actionが効いたか、次回AI Task Packetへ戻すdeltaは何かを確認できる画面を作る。

## 2. 対象

- 実装先: `experiments/2026-07-09-aidd-control-plane-mvp-081/generated-repo/`
- 技術: Next.js + TypeScript + pnpm
- UI/テスト/記事: 日本語
- 接続標準:
  - `standards/aidd-spec-v0.1.md`
  - `standards/aidd-control-plane-mvp-v0.1.md`

## 3. 受け入れ条件

1. `?state=empty|valid|improved|regression|blocked` で状態を切り替えられる。
2. emptyでは比較対象Receiptが未選択であること、必要入力、次の操作を表示する。
3. validでは3件以上のReceipt履歴を表示し、各Receiptのrun outcome、score、terminal evidence、screenshot evidence、browser coverage、console status、repair actionを表示する。
4. improvedでは、同じfindingが減ったこと、効いたRepair Action、score改善、次回AI Task Packet deltaを表示する。
5. regressionでは、再発finding、失敗分類、必要なupstream情報、Review Finding YAML、rollback条件を表示する。
6. blockedでは、private URL/local path/host名、Firefox除外、terminal evidence不足、failure screenshot不足、AIDD-Spec接続不足、execute_now以外混入を公開前ブロックとして表示する。
7. 比較結果から、`execute_now` だけを含むCodex prompt previewを表示し、`next_increment` と `learning_log` は別欄に分離する。
8. `pnpm run doctor:aidd` が上記状態、3ブラウザ、証跡、サニタイズ、AIDD-Spec接続を検査する。
9. Playwright E2EはChromium / Firefox / WebKitで実行し、日本語のテスト名にする。
10. 画像証跡用にempty/valid/improved/regression/blocked/terminal evidenceをcapture scriptで保存できる。

## 4. 品質ゲート

個別に実行して `artifacts/terminal/*.txt` へ保存する。

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 5. 完了証跡

- `artifacts/screenshots/mvp081-empty.png`
- `artifacts/screenshots/mvp081-valid.png`
- `artifacts/screenshots/mvp081-improved.png`
- `artifacts/screenshots/mvp081-regression.png`
- `artifacts/screenshots/mvp081-blocked.png`
- `artifacts/screenshots/mvp081-terminal-evidence.png`
- 同名を `assets/` とrepo root `assets/` にも保存
- note向け記事 `articles/2026-07-09-aidd-control-plane-mvp-081.md`
