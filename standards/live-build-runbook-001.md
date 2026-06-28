# Live Build Runbook 001: AIDD-SpecからAIDD Control Planeへ

> 配信タイトル案: AIエージェント開発を「再現できるワークフロー」にする: AIDD-Spec v0.1からSaaS MVPまで

## 0. 正直な前提

このRunbookはライブ配信で辿る手順である。Hermes単体では配信開始操作はしない。配信開始はOBS/YouTube/X等の配信環境で人間が行う。

このRunbookが提供するもの:

- 配信で見せる順番
- 実行するコマンド
- 期待する画面/ログ
- 失敗した場合の説明
- 次にSaaSとして実装する機能

## 1. 配信の目的

視聴者に見せたいのは「AIに丸投げしたらすごいものができた」ではない。

見せたいのは次の流れである。

```text
AIDD-Spec
  -> AI Task Packet
  -> AI Agent Run
  -> Verification Evidence
  -> Review Record
  -> Learning Log
  -> SaaS MVP backlog
```

## 2. 配信前チェック

```bash
cd /path/to/codex-mastery-lab
git status --short
python3 scripts/build_preview.py
```

確認するURL:

```text
<preview-url>/index.html
```

## 3. Chapter 1: なぜSpecが必要か

見せるファイル:

```text
standards/aidd-spec-v0.1.md
```

話す要点:

- AIエージェントは速いが、入力が曖昧だと勝手に補完する
- AIDD-SpecはAI、人間、CI、レビューを同じ完了条件につなぐ
- 一発100点ではなく、100点へ収束する契約である

## 4. Chapter 2: AI Task Packetを見せる

見せるファイル:

```text
experiments/aidd-spec-v0.1-validation-001/AI_TASK_PACKET.md
```

話す要点:

- Product Brief
- Non-goals
- State Contract
- Failure Contract
- Accessibility Contract
- Quality Gates
- Verification Evidence

## 5. Chapter 3: Codexに渡す

実行コマンド:

```bash
cd /path/to/codex-mastery-lab
codex exec --sandbox danger-full-access "$(cat experiments/aidd-spec-v0.1-validation-001/CODEX_PROMPT.md)"
```

期待:

- `generated-repo/` が作られる
- 静的Webアプリが出る
- docsとcontract checkerが出る

## 6. Chapter 4: 独立検証する

実行コマンド:

```bash
cd experiments/aidd-spec-v0.1-validation-001/generated-repo
npm run lint:static
npm run test:contract
```

ログ保存:

```bash
mkdir -p ../artifacts/terminal
npm run lint:static 2>&1 | tee ../artifacts/terminal/01-lint-static.txt
npm run test:contract 2>&1 | tee ../artifacts/terminal/02-test-contract.txt
```

話す要点:

- AIの自己申告ではなく、証跡を見る
- 失敗したらSpecかPacketが足りなかったと考える

## 7. Chapter 5: SaaSにするなら何を作るか

見せるファイル:

```text
standards/aidd-control-plane-mvp-v0.1.md
```

最初に作る画面:

1. Product Brief Builder
2. AI Task Packet Builder
3. Packet Preview
4. Agent Runbook
5. Evidence Collector
6. Review Dashboard
7. Learning Log

## 8. Chapter 6: 次回予告

次回はAIDD Control Plane MVPの最初のNext.jsアプリを作る。

最初のAI Task Packet:

```text
standards/aidd-control-plane-mvp-v0.1.md
```

から、以下を生成する。

- `/projects/new`
- `/packets/new`
- `/packets/:id/runbook`
- `/packets/:id/review`

## 9. 配信後に残すもの

- 記事
- preview
- terminal logs
- Review Record
- Learning Log
- 次回のAI Task Packet
