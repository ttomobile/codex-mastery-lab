# 「プレミアムにして」で膨らむCSSを、Performance Budgetから逆算してAI Task Packetに入れる

> 2026-06-27 / Codex Mastery Lab 日次ドラフト  
> 想定読了時間: 約10分  
> 種別: Experiment / Failure / Template

![Performance Budget reverse chain](../assets/2026-06-27-performance-budget-reverse-chain.svg)

## 操作キャプチャ

バイブコーディング版を実際にブラウザで操作したGIF。

![バイブコーディング版ギャラリーの操作GIF](../assets/2026-06-27-performance-vibe-demo.gif)

指示を見直した版を実際にブラウザで操作したGIF。

![指示見直し版ギャラリーの操作GIF](../assets/2026-06-27-performance-fixed-demo.gif)

## 前回の振り返り

前回はFAQ検索アプリを題材に、見た目が動いていてもアクセシビリティ上の関係が不足することを確認した。検索欄がどの結果リストを操作しているのか、no results状態がどう伝わるのか、キーボード操作で文脈が壊れないかを、最初からAIへ伝える必要があると分かった。

今回のテーマは性能である。見た目を良くする指示は便利だが、ファイルサイズ、装飾コスト、アニメーション配慮、証拠ファイルが抜けると、後から品質を判断しにくくなる。

## 今回やること

Codexに日本語で「プレミアムなSaaSギャラリー」を作らせる。ブラウザでバイブ版と修正版を操作し、GIFで比較する。そのうえで Performance Budget と Asset Policy をAI Task Packetへ戻す。

## 1. 今日の問い

前回は、雑に作ったFAQ検索アプリをアクセシビリティ観点で監査し、`aria-controls` やリストセマンティクスを AI Task Packet に戻した。今日の問いは性能である。

> Codexに「プレミアムでビジュアルなSaaSギャラリーを作って」と雑に頼むと、見た目は良くなる。しかし、後工程のPerformance / Lighthouse監査が必要とする予算・証拠・資産方針は成果物に残るのか？

料理でいえば、完成写真だけでは同じ味を再現できない。材料、分量、火加減、手順、失敗しやすいポイントが必要になる。Webアプリでも同じで、見た目だけでは足りない。AIが作ったUIを運用・監査できる共通説明書にするには、Performance Budget を前工程の仕様として渡す必要があるのではないか、という仮説を検証した。

## 2. 仮説

今回の仮説は次の通り。

> 「premium」「visual」という曖昧な指示は、CSSの肥大化、重い装飾、外部画像/CDN、motion配慮漏れを誘発しやすい。たとえ今回Codexが外部依存を避けても、Performance BudgetとAsset Policyを事前に渡さなければ、後工程で何を合格とするかが曖昧になる。

今回はM4 Mac mini / 16GB RAM / 256GB SSDの制約環境で回すため、LighthouseやPlaywrightの追加インストールはしない。代わりに、静的ファイルサイズ、CSS行数、外部参照、画像寸法、motion fallback、証拠ファイルの有無を監査する軽量スクリプトを作った。これはLighthouseの代替ではないが、「前工程へ戻すべき情報」を抽出するには十分である。

## 3. 実験環境

```text
2026-06-27 12:34:44 JST
ProductName:    macOS
ProductVersion: 26.5.1
BuildVersion:   25F80
Disk:           228Gi total / 140Gi available
Codex CLI:      codex-cli 0.142.3
```

実験ディレクトリ:

```text
/Users/tto/codex-mastery-lab/experiments/2026-06-27-performance-budget-vibe-gallery/
```

ログ:

```text
/Users/tto/codex-mastery-lab/experiments/2026-06-27-performance-budget-vibe-gallery/logs/
```

## 4. 実験計画

`PLAN.md` には、今回の監査カテゴリを次の3つに絞って書いた。

1. Performance / Lighthouse proxy
2. Dependency / Asset / Version Health
3. Build / Console / Verification Evidence

ここでの狙いは、単に小さなページを高速化することではない。後工程の監査で必要になる情報を、どの標準成果物へ戻すべきかを見ることである。

## 5. Codexへ渡した雑プロンプト

実際に渡したプロンプトはこれである。

```text
このgitリポジトリ内で、`experiments/2026-06-27-performance-budget-vibe-gallery/vibe-app` に小さな静的SaaSプロダクトギャラリーを作ってください。
HTML、CSS、素のJavaScriptだけを使ってください。日本語のプロダクト紹介ページとして、ヒーロー、6つの機能カード、簡単な図解、導入効果の声、小さな絞り込みUIを入れてください。
シンプルにしてください。依存パッケージはインストールしないでください。`vibe-app` ディレクトリの外は変更しないでください。完了したら終了してください。
```

実行コマンド:

```bash
codex exec --sandbox danger-full-access "このgitリポジトリ内で、experiments/2026-06-27-performance-budget-vibe-gallery/vibe-app に小さな静的SaaSプロダクトギャラリーを作ってください。HTML、CSS、素のJavaScriptだけを使ってください。日本語のプロダクト紹介ページとして、ヒーロー、6つの機能カード、簡単な図解、導入効果の声、小さな絞り込みUIを入れてください。シンプルにしてください。依存パッケージはインストールしないでください。vibe-app ディレクトリの外は変更しないでください。完了したら終了してください。"
```

Codexは `vibe-app` に3ファイルを作った。

```text
index.html  176 lines
styles.css  605 lines
app.js       31 lines
```

Codexの最終報告はこうだった。

```text
静的SaaSギャラリーを `vibe-app` に作りました。
ヒーロー、6つのビジュアルなプロダクトカード、導入効果の声、素のJavaScriptによるカテゴリ絞り込みを含めました。
依存パッケージはインストールせず、外部アセットも参照せず、変更は `vibe-app` 内に限定しました。
検証: 作成ファイル一式を確認し、http、@import、url(...) の外部参照がないことを確認しました。
```

ここで面白いのは、Codexがかなり良い判断をしていることだ。外部画像やCDNを使わず、CSSだけでビジュアルを作った。雑プロンプトとしては優秀である。しかし、後工程で見ると別の問題が出る。

## 6. 軽量な性能監査を作った

今回作った監査スクリプトは `audit_static_performance.py` である。チェック内容は次の通り。

- HTML / CSS / JS のサイズ
- 合計静的バイト数
- CSS行数
- 外部ネットワーク参照の有無
- `<img>` がある場合の `width` / `height` と `loading="lazy"`
- Performance Budgetの証拠ファイル有無
- `backdrop-filter` / `box-shadow` / `transition` / `transform` などの装飾コスト
- `prefers-reduced-motion` の有無
- consoleログの残存

実行コマンド:

```bash
node --check experiments/2026-06-27-performance-budget-vibe-gallery/vibe-app/app.js
python3 experiments/2026-06-27-performance-budget-vibe-gallery/audit_static_performance.py experiments/2026-06-27-performance-budget-vibe-gallery/vibe-app
```

結果:

```text
APP: experiments/2026-06-27-performance-budget-vibe-gallery/vibe-app
SIZES: html=6958 css=10154 js=906 total=18018 css_lines=605
合格: HTMLサイズが予算内 — 7512 <= 16000
合格: CSSサイズが予算内 — 10154 <= 12000
合格: JSサイズが予算内 — 906 <= 5000
合格: 静的ファイル合計サイズが予算内 — 18572 <= 32000
不合格: CSS行数がレビューしやすい範囲内 — 605 <= 360
合格: 外部ネットワーク資産を参照していない — found 0
不合格: Performance Budgetが成果物に文書化されている
不合格: 重くなりやすい視覚表現CSSが上限内 — found 20 tokens
不合格: 動き/transitionにprefers-reduced-motionの代替がある
合格: consoleログがJSに残っていない
```

ここで重要なのは、ファイルサイズ自体は合格していることだ。総量18KBなので、単純に「重い」とは言えない。しかしCSSが605行まで伸び、Performance Budgetの証拠がなく、motion fallbackもない。つまり、性能欠陥は「現在のページが遅い」ではなく、「後工程で継続監査できる共通説明書になっていない」ことにある。

![Performance Budget comparison](../assets/2026-06-27-performance-budget-comparison.svg)

## 7. 欠陥から理想状態を定義する

今回の代表findingをAIDD-Spec標準形式で書く。

```yaml
category: Performance / Lighthouse Proxy
finding: 小さな静的ページにもかかわらず、Performance Budgetの証拠がなく、CSSが605行まで増えていた。
severity: medium
observed_by: audit_static_performance.py
ideal_state: AI生成UIのTask Packetには、合計バイト数、CSS/JSサイズ、アセット取得方針、motion fallback、証跡ファイルなど、測定可能な予算が含まれている。
fix_instruction: AI Task PacketにPerformance Budget契約とAsset Policyを追加し、PERFORMANCE_BUDGET.md と静的監査出力を必須にする。
needed_upstream_info:
  - Performance Budget
  - Asset Policy
  - Rendering Strategy
  - Verification Evidence
standard_update:
  document: aidd-spec-ai-task-packet-standard-v0.1.md
  field: performance_budget_contract + asset_policy
codex_prompt_delta: |
  静的ファイル合計は32KB以下、CSSは12KB以下かつ360行以下、JSは5KB以下にする。外部アセット/CDN/url()を避ける。reduced-motion fallbackを入れ、実測サイズ付きのPERFORMANCE_BUDGET.mdを作る。
verification:
  command: python3 experiments/2026-06-27-performance-budget-vibe-gallery/audit_static_performance.py experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app
  expected: 合格
```

このfindingから逆算すると、AI Task Packetには少なくとも以下が必要になる。

- `performance_budget_contract.total_static_bytes`
- `performance_budget_contract.css_budget`
- `performance_budget_contract.js_budget`
- `performance_budget_contract.motion_policy`
- `asset_policy.external_network_assets`
- `asset_policy.image_dimensions_required`
- `asset_policy.font_policy`
- `verification_evidence.files_to_attach`

## 8. 改善版 AI Task Packet v0.2

次に、Codexへ改善版のTask Packetを渡した。要点は以下である。

```markdown
# AI Task Packet v0.2: Performance Budget付き静的SaaSギャラリー

## Performance Budget契約
- `index.html + styles.css + app.js` の静的ファイル合計は32KB以下にする。
- `styles.css` は12KB以下、かつ360行以下にする。
- `app.js` は5KB以下にする。
- 外部ネットワーク資産を避ける。`http://`、`https://`、CSS `@import`、`url(...)` 参照を使わない。
- リモート画像ではなく、CSS、単純なインラインSVG、意味のあるHTMLを使う。
- 重くなりやすい描画効果を上限内に抑える。
- transitionを使う場合は、`@media (prefers-reduced-motion: reduce)` の代替を入れる。

## 検証証拠
`fixed-app/` の中に短い `PERFORMANCE_BUDGET.md` を作り、予算値、実測サイズ、実行したコマンド、トレードオフを記録する。
```

実行コマンド:

```bash
codex exec --sandbox danger-full-access "experiments/2026-06-27-performance-budget-vibe-gallery/AI_TASK_PACKET_v0.2.md を読んで、その内容どおりに実装してください。変更は experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app 内に閉じ込めてください。依存パッケージはインストールしないでください。可能であれば検証コマンドを実行し、結果を報告してから終了してください。"
```

## 9. 修正後の結果

Codexは `fixed-app` に以下を作った。

```text
index.html
styles.css
app.js
PERFORMANCE_BUDGET.md
```

こちらでも検証を再実行した。

```text
APP: experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app
SIZES: html=4930 css=6742 js=796 total=12468 css_lines=349
合格: HTMLサイズが予算内 — 5514 <= 16000
合格: CSSサイズが予算内 — 6742 <= 12000
合格: JSサイズが予算内 — 796 <= 5000
合格: 静的ファイル合計サイズが予算内 — 13052 <= 32000
合格: CSS行数がレビューしやすい範囲内 — 349 <= 360
合格: 外部ネットワーク資産を参照していない — found 0
合格: Performance Budgetが成果物に文書化されている
合格: 重くなりやすい視覚表現CSSが上限内 — found 5 tokens
合格: 動き/transitionにprefers-reduced-motionの代替がある
合格: consoleログがJSに残っていない
```

HTTP配信も確認した。

```text
status 200
bytes 4930
content_type text/html
has title True
has gallery True
```

差分として大きいのは、単にCSSが短くなったことではない。`PERFORMANCE_BUDGET.md` が成果物として残ったことである。これにより、後工程のレビュー担当は「何を測ったのか」「どの予算を守ったのか」「どんなトレードオフを選んだのか」を再確認できる。

## 10. AIDD-Specへの反映

今回、標準仕様ファイルを更新した。

```text
/Users/tto/codex-mastery-lab/standards/aidd-spec-ai-task-packet-standard-v0.1.md
```

追加した主なフィールド:

```yaml
performance_budget_contract:
  total_static_bytes: string
  css_budget: string
  js_budget: string
  lighthouse_targets: []
  motion_policy: string
asset_policy:
  external_network_assets: string
  image_dimensions_required: boolean
  lazy_loading_policy: string
  font_policy: string
```

AIDD Control Planeにするなら、これはフォームになる。たとえば「ページ種別: ランディングページ」「想定端末: mobile first」「画像利用: あり/なし」「第三者CDN: 禁止/許可」「Lighthouse目標: 90以上」のように入力し、AI Task Packetと監査スクリプトを自動生成する。

## 11. CTO視点の考察

今回の学びは、AIが悪いコードを書いたという話ではない。むしろCodexは雑プロンプトでもかなり良い判断をした。外部依存なし、Vanilla JS、静的HTML、見た目もそれなりに成立していた。

危険なのは、良い判断が「偶然」に依存していることだ。ある日別のAI、別のモデル、別のプロンプトで同じ「premium visual」を渡したら、Unsplash画像、Google Fonts、重いアニメーション、外部analyticsが入り込むかもしれない。標準仕様は、AIの善意に頼らないためにある。

料理なら、盛り付け写真が美しくても、材料の分量や火加減が別途必要になる。AI駆動開発でも、見た目のUI指示とは別に、Performance BudgetとAsset Policyを説明書として渡す必要がある。

## 12. 明日から使えるチェックリスト

- AIに「premium」「visual」「rich」と言うなら、同時に予算を書く
- CSS/JS/総量の上限を書く
- 外部画像/CDN/フォントの許可方針を書く
- 画像を使うなら width/height と lazy loading を書く
- motionを使うなら `prefers-reduced-motion` を書く
- Lighthouse目標値だけでなく、Lite実験用の静的監査も用意する
- Codexの口頭報告ではなく、証拠ファイルを成果物に残す

## 13. 次回検証

次は、同じPerformance Budgetを「事前に渡す」だけでなく、実ブラウザのLighthouse/axe/Playwrightにどこまで軽量に接続できるかを試す。制約環境では重い依存を避ける必要があるため、まずは既存ブラウザの有無、追加インストールなしで取れるメトリクス、そしてAIDD Control Planeが自動保存すべきEvidenceの粒度を検証したい。
