# AI Task Packet: AIDD Control Plane MVP 061

## 1. 背景

MVP060では、Codex Run Queueの結果をVerification Run Detailとしてコマンド別に分解した。次に必要なのは、失敗詳細を次回AI実行へ戻す修理deltaへ変換する入口である。

## 2. 今回作るもの

`generated-repo/` のNext.jsアプリに **Evidence Repair Delta Generator** 画面を追加する。

Verification Run Detailの failed / timeout / evidence_missing を入力として、次を日本語で表示する。

- source_detail_id
- repair_delta_id
- failure_category
- AI Task Packet delta
- Codex prompt delta
- verification command
- rollback condition
- Learning Log note
- terminal evidence
- failure screenshot
- Chromium / Firefox / WebKit coverage
- AIDD-Spec接続
- Review Finding draft

## 3. 状態設計

### empty / initial

- source_detail_idがない。
- 「Verification Run Detailを選んでください」と表示する。
- 修理deltaを生成しない。

### valid

- failed / timeout / evidence_missingが修理deltaとして生成される。
- execute_now候補とnext_increment候補を分ける。
- AI Task Packet delta、Codex prompt delta、検証コマンド、rollback条件、Learning Log noteが見える。
- Chromium / Firefox / WebKitが維持されている。

### failure

次をReview Finding形式へ変換する。

- source detail不足
- 失敗分類不足
- 修正指示不足
- Firefox除外
- terminal/failure screenshot不足
- local path / host / private network URL混入

### repair_needed

- failed / timeout / evidence_missingを1件ずつ修理delta候補へ変換する。
- ただし次の1回で実行するものは最大1〜2件に絞る。
- next_increment / learning_logへ回す項目も明示する。

## 4. 日本語UI要件

- UI、ボタン、見出し、説明文、テスト名は日本語。
- AIDD-Spec v0.1とControl Plane MVP v0.1への接続を画面上に出す。
- 建築・建物メタファーは使わない。レシピ、健康診断、旅行の持ち物リストのような日常比喩なら可。

## 5. テスト要件

- Unit/component testでempty / valid / failure / repair_neededを確認。
- Playwright E2EでChromium / Firefox / WebKitの3ブラウザを対象にする。
- `pnpm run doctor:aidd` で必須証跡、AIDD-Spec接続、日本語UI、3ブラウザE2E設定を検査する。

## 6. 受け入れ条件

- `pnpm run lint` pass
- `pnpm run typecheck` pass
- `pnpm run test` pass
- `pnpm run build` pass
- `pnpm run test:e2e` pass
- `pnpm run doctor:aidd` pass
- Playwright等で empty / valid / failure / terminal evidence のスクリーンショットを保存できる。
