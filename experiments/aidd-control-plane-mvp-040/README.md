# AIDD Control Plane MVP 040: Codex Run Start Receipt Auditor

## 目的

MVP 039のOne-Run Handoff Pack Reviewerで作った「次の1回の手渡しパック」を、実際にCodexへ渡した直後の実行開始レシートとして記録・監査する。

AIDD Control Planeは、AIへ投げる前の確認だけでなく、投げた瞬間に「何を、どの条件で、どの証跡置き場に向けて開始したか」を残す必要がある。これにより、Codexの自己申告ではなく、後続の独立検証と記事化に接続できる。

## AIDD-Spec接続

- `standards/aidd-spec-v0.1.md`
  - AI Task Packet
  - Verification Evidence
  - Review Record
  - Learning Log
- `standards/aidd-control-plane-mvp-v0.1.md`
  - One-Run Handoff Pack Reviewer
  - Run Authorization Gate
  - Codex Run Queue
  - Verification Run Detail

## 今回の1インクリメント

- `generated-repo/` に Codex Run Start Receipt Auditor を追加する。
- empty / valid / failure の3状態をUI、unit test、E2E、doctor、capture scriptで検証する。
- valid状態では、handoff pack id、Codex command、sandbox mode、started at、operator、evidence root、required verification commands、required screenshots、rollback stop condition、AIDD-Spec connectionsを表示する。
- failure状態では、handoff不足、危険なcommand、sandbox未指定、evidence root不足、3ブラウザ不足、terminal/failure screenshot不足、rollback不足、local path/host/private network URL混入を検出する。

## 非ゴール

- 実際のCodexプロセス起動はしない。
- GitHub ActionsやDB永続化は追加しない。
- 認証・課金は追加しない。

## 独立検証

各コマンドを個別に実行し、`artifacts/aidd-control-plane-mvp-040/terminal/*.txt` に保存する。

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp040
```
