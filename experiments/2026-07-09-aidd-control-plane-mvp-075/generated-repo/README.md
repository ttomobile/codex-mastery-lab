# AIDD Control Plane MVP075

Run Result Digest Publisherは、Codex Run Queue Status Trackerの実行結果を短い共有ダイジェストへ変換するNext.js + TypeScriptアプリです。UIは日本語で、`?state=empty|valid|failure|blocked` の4状態を切り替えます。

## 実行方法

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run doctor:aidd
pnpm run test:e2e
pnpm run capture:mvp075
```

開発表示:

```bash
pnpm run dev
```

## UI状態

- `empty`: source run未選択。次に必要な入力を表示する。
- `valid`: run outcome、score、terminal evidence、initial / filled / failure / terminal screenshot、Chromium / Firefox / WebKit coverage、console status、Review Record excerpt、Learning Log excerpt、AI Task Packet delta、Codex prompt delta、note article angle、publish readinessを1画面で表示する。
- `failure`: score根拠不足、Firefox未実行、console warn、terminal evidence不足をReview Findingとして表示する。
- `blocked`: local path / private host / private network URL混入を検出し、公開前に止める。

## AIDD-Spec接続

このMVPは、実行結果を次のAIDD要素へ渡すための表示単位を確認します。

- Verification Evidence: terminal evidence、screenshot、Chromium / Firefox / WebKit coverage
- Review Record: score根拠、console status、Review Finding
- Learning Log: 次回へ残す学びの短い抜粋
- AI Task Packet: 次回作業へ渡すdelta
- Codex prompt delta: 次回Codex実行へ入れる短い修正指示

## 静的確認

`pnpm run doctor:aidd`は、必須表示、3ブラウザ文言、local path / private host / private network URL混入の公開停止文言、capture scriptの出力名を確認します。

## capture

`pnpm run capture:mvp075`で以下を`assets/`へ保存します。

- `assets/aidd-control-plane-mvp075-empty.png`
- `assets/aidd-control-plane-mvp075-valid.png`
- `assets/aidd-control-plane-mvp075-failure.png`
- `assets/aidd-control-plane-mvp075-blocked.png`
