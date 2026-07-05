# CODEX PROMPT: AIDD Control Plane MVP 050

あなたはCodex Mastery Labの実装担当です。`experiments/aidd-control-plane-mvp-050/generated-repo/` の既存Next.js + TypeScriptアプリを、MVP049からMVP050へ変更してください。

## 実装するもの

AIDD Control Planeの **Evidence Repair Delta Generator** を実装します。Verification Run Detailで見つかった `failed` / `evidence_missing` / `timeout` のfindingを、次回AI Task Packet delta、Codex prompt delta、検証command、rollback条件、Learning Logへ変換する日本語UIです。

## 必須状態

- empty: finding未読込。次回packetへ戻す材料がないことを説明
- ready: 3つ以上のdelta候補を表示
  - failed: 例 `pnpm run test:e2e` がFirefoxでtimeout
  - evidence_missing: failure screenshotが不足
  - timeout: mock backend health checkが遅延
- failure: finding ID不足、失敗分類不足、優先度不足、AI Task Packet delta不足、Codex prompt delta不足、検証command不足、rollback条件不足、Learning Log不足、local path/host/private network URL混入、AIDD-Spec connection不足を検出

## UI要件

- UI文言は日本語
- 画面内に `AIDD Control Plane MVP050` と `Evidence Repair Delta Generator` を表示
- readyでは各deltaに以下を表示
  - finding ID
  - 失敗分類
  - 優先度
  - 理想状態
  - 修正指示
  - AI Task Packet delta
  - Codex prompt delta
  - verification command
  - rollback condition
  - Learning Log案
  - AIDD-Spec接続
- failureではReview Finding draft風に不足を一覧化
- local pathやprivate URLを含む危険サンプルを検出して、日本語で公開前ブロック理由を表示

## テスト/スクリプト

既存構成を更新し、次を通してください。

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`（Chromium / Firefox / WebKit）
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp050`

`doctor:aidd` はMVP050固有token、AIDD-Spec接続、capture script、E2E 3ブラウザ設定、local pathブロック文言を確認してください。

`capture:mvp050` は `artifacts/screenshots/` に次のPNGを作ってください。

- `aidd-control-plane-mvp050-empty.png`
- `aidd-control-plane-mvp050-ready.png`
- `aidd-control-plane-mvp050-failure.png`
- `aidd-control-plane-mvp050-terminal-evidence.png`

## 注意

- 商標や実サービスのロゴは使わない
- runtime生成物はコミット対象にしない
- Codexの自己申告ではなく、後でHermes側が独立検証する
