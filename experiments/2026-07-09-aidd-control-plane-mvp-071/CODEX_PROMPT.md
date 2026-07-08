# Codex Prompt: MVP071 Handoff Decision Ledger

あなたはAIDD Control PlaneのNext.js + TypeScript MVPを実装します。`generated-repo/` に自己完結したアプリを作ってください。

要件:

- 日本語UI、日本語テスト名、日本語docs。
- `Handoff Decision Ledger` 画面を実装する。
- 状態は empty / approved / held / blocked。
- approvedでは、source handoff receipt、decision owner、decision reason、approved execute_now、Codex command draft、verification commands、required evidence、rollback condition、AIDD-Spec接続を表示する。
- heldではhold reasonとLearning Log返却を表示する。
- blockedでは未承認、理由不足、3ブラウザ不足、evidence不足、local path/private host/private network URL混入を検出して表示する。
- approved execute_nowだけをCodex command draftへ入れ、deferやheld理由を混ぜない。
- `pnpm run lint`, `typecheck`, `test`, `build`, `test:e2e`, `doctor:aidd`, `capture:mvp071` を提供する。
- Playwrightは Chromium / Firefox / WebKit。
- capture scriptで initial / approved / blocked / terminal evidence画像を保存する。

実装後、自分の要約だけでなく、独立検証できるログが残る構成にしてください。
