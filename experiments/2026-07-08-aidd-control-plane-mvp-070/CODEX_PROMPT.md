あなたはAIDD Control Plane MVP070を実装する。`generated-repo/`にNext.js + TypeScriptアプリを作り、MVP069の「縮小後packet」をCodexへ渡す直前のShrunk Packet Handoff Receipt UIにする。

必須:
- UI、テスト名、サンプルデータは日本語。
- 状態はempty / valid / blocked。
- validはexecute_now、defer_next_increment、minimum verification、Chromium/Firefox/WebKit、required evidence、rollback、AIDD-Spec接続、Codex prompt previewを表示。
- blockedはFirefox除外、failure screenshot不足、rollback不足、private URL混入を止める。
- Codex prompt previewにdefer_next_incrementを混ぜない。
- pnpm scripts: lint/typecheck/test/build/test:e2e/doctor:aidd/capture:mvp070。
- Playwrightは3ブラウザ。
- captureはinitial/filled/failure/terminal evidence PNGをassetsとartifacts/screenshotsへ保存。
- local path、private host、private network URLを入れない。
