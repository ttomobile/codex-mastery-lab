# AIDD Control Plane MVP 001

## 目的

AIDD-Spec v0.1を、実際に誰でも辿れるSaaSワークフローへ落とし込む最初のNext.js MVPを作る。

## 今回の範囲

フルSaaSではなく、ローカルで動くMVPとして以下を実装する。

- Project作成
- AI Task Packet作成
- Agent Runbook生成
- Review Record作成
- Learning Log作成
- 必須項目不足のContract Checker

## 準拠目標

AIDD-Spec v0.1 `L3 Contract-Verified`

CI artifactまでは次の段階とし、今回はローカルで以下を通す。

- lint
- typecheck
- unit/component test
- build
- Playwright E2E Chromium
- AIDD contract checker

## 合格条件

- 日本語UI
- Next.js + TypeScript + pnpm
- Product Briefを入力できる
- AI Task Packet YAML/Markdownを生成できる
- 必須項目不足を表示できる
- Codexへ渡すRunbookを生成できる
- Review Record / Learning Logを作成できる
- `docs/product-brief.md`, `docs/review-record.md`, `docs/learning-log.md`, `docs/verification-evidence.md` がある
