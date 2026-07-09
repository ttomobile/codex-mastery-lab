あなたはAIDD Control Plane MVP085を実装するCodexです。

作業ディレクトリは `experiments/2026-07-10-aidd-control-plane-mvp-085/generated-repo` です。既存のMVP084実装を土台に、次を満たすNext.js + TypeScriptアプリへ変更してください。

# 実装するもの

Final Receipt Failure Handoff Queue

MVP084のPublic Preview Smoke Final Receiptで見つかったfailure / blockedを、次の1回で実行するaction queueへ変換するUIです。

# 状態

`?state=empty|queued|blocked|exported`

- empty: final receiptはあるがaction item未生成。
- queued: broken URL、HTTP status、byte size、content type、latency msをReview Finding actionへ変換済み。
- blocked: private URL、local path、host名、Firefox未確認、terminal evidence不足、failure screenshot不足、rollback不足、AIDD-Spec接続不足で停止。
- exported: execute_nowだけがAI Task Packet patchとCodex prompt previewへ入る。next_incrementとlearning_logは混ぜない。

# 必須表示

- 日本語UI。
- source receipt id / broken URL / HTTP status / byte size / content type / latency ms。
- finding category / severity / lane / priority reason。
- execute_now / next_increment / learning_log の分離。
- AI Task Packet patch / Codex prompt patch / Codex prompt preview。
- verification commands: lint / typecheck / test / build / test:e2e / doctor:aidd。
- required evidence: terminal evidence / empty / queued / blocked / exported / failure screenshot / Playwright report。
- Chromium / Firefox / WebKit coverage。
- terminal evidence status、failure screenshot status、console status、sanitization scan、rollback condition、AIDD-Spec connection。
- Review Finding YAMLとLearning Log。

# 検証補助

- `pnpm run doctor:aidd` が上記要件を静的に検査すること。
- `pnpm run test:e2e` はChromium / Firefox / WebKitで4状態を確認すること。
- `pnpm run capture:mvp085` で empty / queued / blocked / exported / terminal evidence PNGを `assets/` と `artifacts/screenshots/` に保存すること。

# 注意

- UI文言、テスト名、READMEは日本語中心。
- 実ネットワークアクセスや実Codex投入はしない。fixtureで表現する。
- local path、host名、private URLを公開用UI・記事用assetへ混ぜない。
- Next.js/TypeScript/ESLint/Vitest/Playwrightの既存構成を保つ。
