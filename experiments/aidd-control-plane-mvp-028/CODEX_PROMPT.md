generated-repo/ に AIDD Control Plane MVP 028 を実装してください。

前提:
- Next.js + TypeScript + pnpm。
- UI、テスト名、docsは日本語。
- 既存MVP027の流れを壊さず、次段として `Diff Bundle Decision Ledger` を追加する。
- AIDD-Spec v0.1 と standards/aidd-control-plane-mvp-v0.1.md の Review Record / Verification Evidence / Learning Log / Rollback Plan に接続する。

実装内容:
1. src/lib/intake.ts に Decision Ledger の型、valid/empty/failureサンプル生成、評価関数を追加する。
2. app/page.tsx に日本語UIセクションを追加し、empty / valid / failure stateを見せる。
3. unit testを追加/更新し、未判断、理由不足、証跡不足、rollback未確認、local path/host混入、採用済みverification不足を検出する。
4. Playwright E2Eを追加/更新し、3ブラウザでMVP028表示と各状態を確認する。
5. scripts/doctor-aidd.mjs を更新し、MVP028の主要文言、AIDD-Spec接続、capture script、E2Eの存在を検査する。
6. scripts/capture-mvp028.mjs を追加し、empty / valid / failure / terminal evidence画像を `../artifacts/screenshots` とrepo root `assets/` に保存する。
7. package.jsonに `capture:mvp028` を追加する。

禁止:
- 実在サービスのロゴ、商標、実APIを使わない。
- ローカル絶対パス、host名、プライベートネットワーク名をUIや記事向け出力に混ぜない。
- Firefox/WebKitのE2Eを除外しない。

最後に実装後、自分ではなく呼び出し側が独立検証する前提で、変更概要だけを簡潔に出してください。
