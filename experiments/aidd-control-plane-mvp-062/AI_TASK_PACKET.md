# AI Task Packet: AIDD Control Plane MVP 062

## 1. 背景

MVP061では、Verification Run Detailの failed / timeout / evidence_missing を Evidence Repair Delta に変換した。次に必要なのは、生成された修理deltaを全部そのまま次回Codex promptへ入れず、採用 / 保留 / 却下として判断し、採用済みだけを安全に次へ進めることである。

## 2. 今回作るもの

`generated-repo/` のNext.jsアプリに **Repair Delta Priority Decision Workspace** 画面を追加する。

Evidence Repair Delta を入力として、次を日本語で表示する。

- source_repair_delta_id
- decision: adopt / hold / reject
- priority_reason
- decision_owner
- review_evidence
- rollback_condition
- next_packet_section
- Codex prompt patch
- Verification Evidence接続
- Review Record接続
- Learning Log接続
- AIDD-Spec接続

## 3. 状態設計

### empty / initial

- repair deltaがない。
- 「判断する修理deltaを選んでください」と表示する。
- 次回packetへ進めない。

### valid

- 1件以上のrepair deltaを採用 / 保留 / 却下として判断できる。
- 採用済みdeltaだけが次回AI Task Packet patchとCodex prompt patchに入る。
- 保留 / 却下deltaはLearning Logへ戻す。
- Chromium / Firefox / WebKitが検証条件に含まれる。

### failure

次をReview Finding形式へ変換する。

- 未判断
- 理由不足
- 証跡不足
- rollback不足
- Firefox除外
- 未採用delta混入
- local path / host / private network URL混入

### decision_needed

- 採用候補が複数ある場合、次の1回で実行するdeltaを最大1〜2件に絞る。
- `adopt_now` / `hold_next_increment` / `reject_to_learning_log` のlaneを表示する。
- Codex prompt previewには `adopt_now` だけを入れる。

## 4. 日本語UI要件

- UI、ボタン、見出し、説明文、テスト名は日本語。
- AIDD-Spec v0.1とControl Plane MVP v0.1への接続を画面上に出す。
- 建築・建物メタファーは使わない。料理レシピ、健康診断、旅行の持ち物リストのような日常比喩なら可。

## 5. テスト要件

- Unit/component testでempty / valid / failure / decision_neededを確認。
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
