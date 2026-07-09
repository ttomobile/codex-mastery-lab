# AI Task Packet: Run Result Digest Publisher MVP075

## 目的
AIDD Control Planeの小さなNext.js + TypeScriptアプリとして、Codex Run Queue Status Trackerの実行結果を短い共有ダイジェストへ変換する画面を作る。

## 実装ディレクトリ
experiments/2026-07-09-aidd-control-plane-mvp-075/generated-repo/

## UI要件（日本語）
- `?state=empty|valid|failure|blocked` で状態を切り替える。
- empty: source runが未選択で、次に必要な入力を表示する。
- valid: run outcome、score、terminal evidence、initial/filled/failure/terminal screenshot、Chromium/Firefox/WebKit coverage、console status、Review Record excerpt、Learning Log excerpt、AI Task Packet delta、Codex prompt delta、note article angle、publish readinessを1画面で表示する。
- failure: score根拠不足、Firefox未実行、console warn、terminal evidence不足などをReview Findingとして表示する。
- blocked: local path / private host / private network URL混入を検出し、公開前に止める。
- すべて日本語UI。商標・公式ロゴ・実在サービスコピーは使わない。

## 品質ゲート
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run doctor:aidd
- pnpm run test:e2e（Chromium / Firefox / WebKit）
- pnpm run capture:mvp075

## 追加要件
- Playwrightで4状態を確認する。
- doctor:aiddで必須表示、3ブラウザ文言、local path/private URLブロック文言を検査する。
- capture scriptでPNGをassetsへ保存する。
- READMEに実行方法とAIDD-Spec接続を書く。
