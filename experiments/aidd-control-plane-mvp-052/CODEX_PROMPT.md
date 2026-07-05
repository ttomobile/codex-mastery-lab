次のAI Task Packetに従って、AIDD Control Plane MVP052を実装してください。

- 対象: experiments/aidd-control-plane-mvp-052/generated-repo/
- スタック: Next.js + TypeScript + pnpm
- UI/テスト/docsは日本語を基本にする
- テーマ: Codex Run Budget Gate
- AIDD-Spec v0.1 と standards/aidd-control-plane-mvp-v0.1.md に接続する

必須:
1. empty / ready / failure の3状態を切り替えられるUIを作る。
2. readyではCodex実行予算が安全で、採用済みdeltaだけをprompt previewへ進める。
3. failureでは利用枠過多、停止条件不足、fallback不足、Firefox除外、証跡不足、local path混入を検出する。
4. Vitestで判定ロジックをテストする。
5. PlaywrightでChromium / Firefox / WebKitのE2Eを通す。
6. doctor:aiddでMVP052固有文言、3ブラウザ設定、画像名、AIDD-Spec接続を確認する。
7. capture:mvp052で empty / ready / failure / terminal evidence のPNGを生成し、repo rootのassets/にもコピーする。

完了後、pnpm install --frozen-lockfile / lint / typecheck / test / build / test:e2e / doctor:aidd の実行結果を保存してください。
