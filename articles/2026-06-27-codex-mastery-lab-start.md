# Codexを「最強の開発相棒」に育てる：M4 Mac miniで始める継続検証ラボ

> 初回記事ドラフト / 2026-06-27  
> 対象環境: Apple M4 Mac mini / 16GB RAM / 256GB SSD / macOS 26.5.1 / Codex CLI 0.142.3

## この記事の位置づけ

今日から、Codex CLIを単なる「コードを書かせるツール」ではなく、**CTOレベルの開発判断を補助する継続的な開発OS**として使えるかを検証していく。

よくあるAIコーディング記事は、成功したデモだけを切り出しがちだ。だが、実際のシステム開発で重要なのは次の4点だ。

1. 失敗したときに壊れ方が予測できるか
2. 小さな差分に閉じ込められるか
3. テスト・ログ・レビューの導線を作れるか
4. 環境制約があるマシンで毎日回せるか

今回の環境は、M4 Mac mini、メモリ16GB、SSD 256GB。決して巨大なローカルLLMや重い並列ビルドを回し続けるためのマシンではない。だからこそ、現実的な開発者環境に近い。

## 今日の仮説

**仮説:** Codexを安定運用する第一歩は「賢いプロンプト」ではなく、作業単位をgit repo内の小さな実験に閉じ込め、毎回ログ・差分・検証結果を残す運用設計である。

## 実験環境

実測値は以下。

```text
OS: macOS 26.5.1
CPU: Apple M4
Memory: 16GB
Disk: 228GiB中 141GiB available
Codex: ~/bin/codex
Codex CLI: 0.142.3
Git: 2.50.1
Node: v22.23.1
npm: 10.9.8
Codex auth: ~/.codex/auth.json exists
```

## ラボの設計

今回、`~/codex-mastery-lab` という検証用repoを作った。

```text
codex-mastery-lab/
  README.md
  backlog.md
  experiments/
  articles/
  assets/
  logs/
  templates/
```

各日の実験は `experiments/YYYY-MM-DD-*` に閉じ込める。記事は `articles/` に保存する。図解やスクリーンショットは `assets/` に置く。

![Daily Operating Loop](../assets/daily-operating-loop.svg)

## 初回スモークテスト

Codexに渡したプロンプトはこれだけ。

```text
In this git repo, create experiments/000-smoke-test/RESULT.md with a concise report proving Codex can write a file. Do not modify anything else. Then exit.
```

実行コマンド:

```bash
codex exec --sandbox danger-full-access "In this git repo, create experiments/000-smoke-test/RESULT.md with a concise report proving Codex can write a file. Do not modify anything else. Then exit."
```

結果、Codexは指定ファイルだけを作成した。

```text
Created RESULT.md.
I only added the requested file.
tokens used: 4,845
```

作られたファイル:

```markdown
# Smoke Test Result

Codex successfully wrote this file at `experiments/000-smoke-test/RESULT.md`.

This proves the agent can create a requested file in the repository without modifying other files.
```

## CTO視点の観察

初回の学びは地味だが重要だ。

### 1. Codexには「小さく閉じた任務」が効く

今回の指示は、対象ファイル・目的・禁止事項・終了条件が明確だった。

- 対象: `experiments/000-smoke-test/RESULT.md`
- 目的: Codexがファイルを書けることを証明
- 禁止: 他ファイルを変更しない
- 終了: 作成後にexit

この形式は、実開発でもそのまま使える。

### 2. `danger-full-access` は強力だが、repo境界が重要

Hermes Gatewayのサービス文脈では、Codexの通常sandboxが環境差で失敗することがある。そのため今回は `--sandbox danger-full-access` を使った。

ただしこれは危険な設定なので、代わりに次のガードレールを置く。

- 必ず専用git repo / worktreeで実行する
- 実行前後に `git status` を見る
- 1プロンプト1目的にする
- 広範な変更を要求しない
- テストとdiff確認を完了条件に入れる

### 3. 記事化するなら「成功ログ」より「運用ログ」が価値になる

読者が知りたいのは、Codexがファイルを書けたという事実ではない。

本当に価値があるのは、以下のような運用知だ。

- どのsandbox設定が安定するか
- どこまで任せると壊れるか
- どの粒度でタスクを切るべきか
- 失敗ログをどう次のプロンプトに反映するか
- 16GBメモリ環境で並列実行はどこまで安全か

つまり、この連載の主役は「Codexの魔法」ではなく、**Codexを安全に使い倒すための開発システム**だ。

## 明日から使えるチェックリスト

Codexを業務利用する前に、最低限これを整える。

- [ ] Codex専用のgit repoまたはworktreeを作る
- [ ] 1タスク1プロンプトにする
- [ ] 変更対象ファイルを明記する
- [ ] 禁止事項を書く
- [ ] 終了条件を書く
- [ ] 実行後に `git status` と `git diff` を確認する
- [ ] 成功ログだけでなく失敗ログも保存する

## 次回予告

次回は、Codex CLIの3つの実行モードを比較する。

1. 通常の `codex exec`
2. `--full-auto`
3. `--sandbox danger-full-access`

観点は、安定性、速度、壊れ方、Hermesから呼び出したときの扱いやすさ。単なる機能比較ではなく、**実務でどのモードをどのリスク境界で使うべきか**まで整理する。
