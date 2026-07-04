# AI Task Packet: AIDD Control Plane MVP 037

## 1. Product Brief

AIDD Control Planeに「Repair Delta Priority Decision Workspace」を追加する。MVP 036で生成したrepair deltaを、次回の1インクリメントへ採用する前に、優先順位・判断・証跡・rollback条件をレビューできるようにする。

## 2. 背景

失敗ログからAI Task Packet deltaを作れても、全部を次回依頼に入れると焦点がぼやける。AIDD-SpecではReview RecordとLearning Logを通して、どの改善を今すぐ実施するか、どれを保留するかを明示する必要がある。

## 3. 実装範囲

- `src/lib/intake.ts`
  - `RepairDeltaPriorityDecisionWorkspace`系の型、empty/valid/failure factory、evaluatorを追加
  - valid sampleはMVP 036のrepair deltaを入力として、adopt / defer / rejectを混在させる
  - accepted deltaだけにnext packet section / Codex prompt patch / verification commandを持たせる
  - failure sampleは未判断、理由不足、証跡不足、rollback不足、Firefox除外、local path/host/tailnet混入を含める
- `app/page.tsx`
  - 「Repair Delta Priority Decision Workspace」セクションを追加
  - `priority empty` / `priority valid` / `priority failure` の操作ボタンを追加
  - status、findings、採用済みdelta、保留/却下delta、次回packet previewを日本語で表示
- `tests/intake.test.ts`
  - 日本語名のunit testを追加
- Playwright E2E
  - empty / valid / failure状態を3ブラウザで確認
- `scripts/doctor-aidd.mjs`
  - MVP 037固有の実装・テスト・E2E・日本語UI文言を検査
- capture script
  - empty / valid / failure / terminal evidence画像を生成

## 4. 非ゴール

- 実際のGitHub API連携はしない
- repair deltaを実ファイルへ自動適用しない
- AIエージェント実行キューを増やさない

## 5. 受け入れ条件

- 採用済みdeltaだけが次回AI Task Packet / Codex promptへ進むことがUIとテストで分かる
- 未判断・理由不足・証跡不足・rollback不足・Firefox除外・local path/host/tailnet混入をfailureとして検出する
- 表示文言、テスト名、記事は日本語を基本にする
- AIDD-Spec v0.1とControl Plane MVP標準への接続がUIとdoctorで確認できる

## 6. 検証コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```
