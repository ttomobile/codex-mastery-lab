# PLAN: Security Baseline Contact Form Experiment

## Theme
雑なバイブコーディングで作った静的リード獲得/問い合わせフォームを Security / Privacy / Verification Evidence 観点で監査し、後工程から AI Task Packet に必要な Security Baseline と Data Classification を逆算する。

## Today's question
Codexに「小さなSaaS問い合わせフォームをいい感じに作って」とだけ渡したとき、入力値検証、PIIの扱い、XSS耐性、外部送信方針、証拠ファイルは成果物に残るか。

## Hypothesis
フォームUIは見た目が成立しやすい一方で、後工程のセキュリティ監査が必要とする「どのデータがPIIか」「保存してよいか」「DOMへ入力値を挿入する時はtextContentか」「送信先/ログ/保持期間は何か」が抜けやすい。これらは後からレビューで指摘するのではなく、AI Task Packetの Security Contract / Privacy Contract / Verification Evidence に最初から入れるべきである。

## Scope
- Experiment root: `/Users/tto/codex-mastery-lab/experiments/2026-06-27-security-baseline-contact-form/`
- Vibe app: `vibe-app/`
- Fixed app: `fixed-app/`
- No dependency installation.
- HTML/CSS/vanilla JS only.

## Audit categories
1. Security / Vulnerability
2. Privacy / Data Classification
3. Build / Console / Verification Evidence

## Steps
1. Save environment and git status.
2. Ask Codex to create a tiny static lead/contact form with a submission preview/history.
3. Run lightweight static security audit.
4. Record findings in AIDD-Spec standard format.
5. Create AI Task Packet v0.3 with Security Baseline and Privacy Contract.
6. Ask Codex to implement fixed version.
7. Re-run audit and compare.
8. Create SVG diagrams.
9. Update AIDD-Spec standard, book outline, backlog, and daily article draft.

## Verification commands
```bash
node --check experiments/2026-06-27-security-baseline-contact-form/vibe-app/app.js
python3 experiments/2026-06-27-security-baseline-contact-form/audit_static_security.py experiments/2026-06-27-security-baseline-contact-form/vibe-app
node --check experiments/2026-06-27-security-baseline-contact-form/fixed-app/app.js
python3 experiments/2026-06-27-security-baseline-contact-form/audit_static_security.py experiments/2026-06-27-security-baseline-contact-form/fixed-app
```
