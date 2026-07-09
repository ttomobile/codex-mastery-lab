次のAI Task Packetに従って、AIDD Control Plane MVP081 Dispatch Receipt History Comparatorを実装してください。

実装先は `experiments/2026-07-09-aidd-control-plane-mvp-081/generated-repo/` です。Next.js + TypeScript + pnpmで、日本語UI、日本語テスト名にしてください。

重要要件:
- `?state=empty|valid|improved|regression|blocked` で状態切替。
- 複数のDispatch Receipt履歴を比較し、score推移、再発finding、改善finding、効いたRepair Action、次回AI Task Packet deltaを表示。
- blockedでは private URL / local path / host名 / Firefox除外 / terminal evidence不足 / failure screenshot不足 / AIDD-Spec接続不足 / execute_now以外混入を止める。
- prompt previewにはexecute_nowのみを入れ、next_incrementとlearning_logは分ける。
- `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` を通す。
- PlaywrightはChromium / Firefox / WebKit。
- capture scriptでempty/valid/improved/regression/blocked/terminal evidenceのPNGを保存。

Codexの自己申告ではなく、実装後に独立検証される前提で、補助scriptもlint/typecheck対象にしてください。
