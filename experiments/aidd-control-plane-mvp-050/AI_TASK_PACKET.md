# AI Task Packet: AIDD Control Plane MVP 050

## 1. Product Brief

### 名前
Evidence Repair Delta Generator

### 解く課題
Verification Run Detailで `failed` / `evidence_missing` / `timeout` が見つかっても、そのままでは次回のCodex依頼が「直して」になりがちである。失敗分類、理想状態、修正指示、必要な上流情報、AI Task Packet delta、Codex prompt delta、検証command、rollback条件、Learning Logを1画面で生成し、次の実行へ渡せる形にする。

### 非ゴール

- 実際にCodexを起動しない
- DB永続化や外部CI連携はしない
- 実ログをアップロードしない
- 英語UIにはしない

## 2. 主要ユーザーフロー

1. ユーザーが空状態を見る
2. サンプルのVerification Run Detail findingsを読み込む
3. failed / evidence_missing / timeout を含むfindingがdelta候補に変換される
4. 各deltaに優先度、根拠、修正指示、Codex prompt delta、検証command、rollback条件、Learning Log案が表示される
5. readyなら「次回AI Task Packetへ追記可能」と表示する
6. failureサンプルでは不足・危険条件を日本語で一覧表示する

## 3. 状態設計

- empty: まだVerification Run Detail findingを読み込んでいない。次回packetへ戻す材料がない
- ready: finding、優先度、AI Task Packet delta、Codex prompt delta、検証command、rollback条件、Learning Log、AIDD-Spec接続、公開可能な証跡名が揃っている
- failure: 次を検出して止める
  - finding ID不足
  - 失敗分類不足
  - 優先度不足
  - AI Task Packet delta不足
  - Codex prompt delta不足
  - 検証command不足
  - rollback条件不足
  - Learning Log不足
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
- `pnpm run doctor:aidd` はMVP050固有token、AIDD-Spec接続、画像生成scriptを検査する
- `pnpm run capture:mvp050` で empty / ready / failure / terminal evidence 画像を生成する

## 5. Verification Evidence

保存先:

- `experiments/aidd-control-plane-mvp-050/artifacts/terminal/*.txt`
- `experiments/aidd-control-plane-mvp-050/artifacts/screenshots/*.png`
- repo root `assets/aidd-control-plane-mvp050-*.png`

## 6. AIDD-Spec接続

- `Verification Evidence` は失敗状態と不足証跡を示す
- `Review Record` はfindingとして理想状態と修正指示を残す
- `AI Task Packet` は次回実行に必要なdeltaを受け取る
- `Learning Log` は「なぜこのdeltaが必要になったか」を保存する
