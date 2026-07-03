# AI Task Packet: AIDD Control Plane MVP 031 Run Authorization Gate

## 1. 背景

AIDD Control Plane MVP 030では、採用済みbundleから生成されたAI Task Packet / Verification Plan / Codex promptをCodexへ渡す直前にpreflight reviewするExported Packet Preflight Reviewerを作った。次の自然な不足は、preflight validなpacketを実際のCodex run queueへ積む前の実行許可である。

## 2. 作るもの

`experiments/aidd-control-plane-mvp-031/generated-repo` に、既存Next.js + TypeScriptアプリを拡張し、Run Authorization Gateを追加する。

## 3. 受け入れ条件

- UIは日本語。
- empty / valid / failureの3状態を切り替えられる。
- valid状態では次を表示する。
  - authorization id
  - packet id
  - preflight status
  - approver
  - authorization reason
  - Codex command
  - sandbox mode
  - required verification commands（lint/typecheck/test/build/test:e2e/doctor:aidd）
  - browser projects（Chromium / Firefox / WebKit）
  - evidence paths
  - rollback plan
  - AIDD-Spec connections
- failure状態では次を検出する。
  - preflight failureまたは未承認packet
  - approver不足
  - authorization reason不足
  - dangerous command / unsafe target path
  - sandbox mode未指定または危険な説明不足
  - Firefox除外
  - shallow verification
  - local path / host / tailnet / private network URL混入
  - evidence path不足
  - rollback plan不足
  - AIDD-Spec接続不足
- ロジックは `src/lib/intake.ts` に型・生成関数・評価関数として追加する。
- app/page.tsxに操作UIを追加する。
- VitestでRun Authorization Gateのempty/valid/failureを検証する。
- Playwright E2Eで3状態を確認する。
- capture script `scripts/capture-mvp031.mjs` を追加する。
- package nameとcapture scriptをmvp031に更新する。

## 4. 検証コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp031
```

## 5. 期待する証跡

- `artifacts/terminal/*.txt`
- `artifacts/screenshots/aidd-control-plane-mvp031-empty.png`
- `artifacts/screenshots/aidd-control-plane-mvp031-valid.png`
- `artifacts/screenshots/aidd-control-plane-mvp031-failure.png`
- `artifacts/screenshots/aidd-control-plane-mvp031-terminal-evidence.png`

## 6. 実装上の注意

- 実サービスの商標・ロゴ・コピーは使わない。
- UI、テスト名、docsは日本語を優先する。
- local path、host名、tailnet、private network URLを公開文面に残さない。
- AIDD-Spec説明では建築/建物メタファーを使わない。
