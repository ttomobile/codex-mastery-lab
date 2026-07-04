# Codex Prompt: AIDD Control Plane MVP 035

あなたはAIDD Control PlaneのNext.js/TypeScript実装担当です。`generated-repo/` に、MVP035 Verification Run Detailを実装してください。

## 実装内容
- Codex Run Queue itemをVerification Run Detailへ展開する型・生成関数・評価関数を追加してください。
- UIに `Verification Run Detail` セクションを追加し、`detail empty` / `detail valid` / `detail failure` で切り替えられるようにしてください。
- 日本語UI、日本語テスト名、日本語サンプルデータを維持してください。
- valid状態ではcommand別exit code、artifact path、失敗分類、修正指示、3ブラウザ証跡、terminal/screenshot/playwright evidence、Review Finding draftを表示してください。
- failure状態ではartifact path不足、Firefox除外、command別detail不足、失敗分類不足、修正指示不足、証跡不足、AIDD-Spec接続不足を表示してください。

## 必須検証
以下を個別に実行し、terminal evidenceへ保存してください。
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run mock:doctor

## 禁止
- Firefox除外で完了扱いにしない。
- local path、host名、tailnet、private network URLを公開記事やpreviewへ混入させない。
- runtime生成物をcommitしない。
