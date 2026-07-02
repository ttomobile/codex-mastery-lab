あなたはAIDD Control Plane MVPを実装するCodexです。

作業ディレクトリは `experiments/aidd-control-plane-mvp-017/generated-repo` です。既存のMVP 016実装を壊さずに、MVP 017として「Spec Update Proposal Queue」を追加してください。

必須要件:

1. package名、画面のMVP表記、capture scriptをMVP 017へ更新する。
2. UIに `Spec Update Proposal Queue` セクションを追加する。
3. empty / valid / failureの切替を用意する。
4. valid状態では、Review FindingやLearning Logから次を含む標準更新候補を表示する:
   - finding
   - ideal state
   - needed upstream info
   - target standard document
   - target field
   - priority
   - acceptance criteria
   - codex prompt delta
   - verification command
5. failure状態では、対象文書・acceptance criteria・verification command・prompt delta不足を日本語で検出する。
6. `src/lib/intake.ts`等に評価関数を追加し、日本語Unitテストを追加する。
7. `doctor:aidd`にMVP 017の必須文言・script・E2E/capture確認を追加する。
8. Playwright E2EでMVP 017セクション、empty/valid/failure状態、標準更新候補、Codex prompt deltaを確認する。
9. `scripts/capture-mvp017.mjs`を追加し、次の画像を保存する:
   - `../artifacts/screenshots/aidd-control-plane-mvp017-empty.png`
   - `../artifacts/screenshots/aidd-control-plane-mvp017-valid.png`
   - `../artifacts/screenshots/aidd-control-plane-mvp017-failure.png`
   - `../artifacts/screenshots/aidd-control-plane-mvp017-terminal-evidence.png`
10. `pnpm run lint`, `typecheck`, `test`, `build`, `test:e2e`, `doctor:aidd`が通る状態にする。

日本語UI、日本語テスト名、日本語記事化を前提にしてください。YouTubeや実サービスの商標・ロゴ・コピーは使わないでください。建築/建物メタファーは使わないでください。
