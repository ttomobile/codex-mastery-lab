# AI Task Packet v0.2: Performance Budget付き静的SaaSギャラリー

## スコープ
バイブ版と同じ小さな静的SaaSプロダクトギャラリーを、以下の場所に改善版として実装する。

```text
experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app/
```

HTML、CSS、素のJavaScriptだけを使う。依存パッケージはインストールしない。`fixed-app/` の外は変更しない。ただし `audit_static_performance.py` は読んでよい。

## 機能要件
- プロダクトの価値が伝わるヒーローセクションを作る。
- 6つの機能/プロダクトカードを置く。
- 導入効果やお客様の声のセクションを置く。
- 素のJavaScriptで小さなカテゴリ絞り込みを実装する。
- `python3 -m http.server` で配信できる静的ファイルとして動く。
- UI文言は日本語にする。

## Performance Budget契約
- `index.html + styles.css + app.js` の静的ファイル合計は32KB以下にする。
- `styles.css` は12KB以下、かつ360行以下にする。
- `app.js` は5KB以下にする。
- 外部ネットワーク資産を避ける。`http://`、`https://`、CSS `@import`、`url(...)` 参照を使わない。
- リモート画像ではなく、CSS、単純なインラインSVG、意味のあるHTMLを使う。
- 画像を使う場合、すべての `<img>` に明示的な `width` と `height` を付ける。折り返し以降の画像は `loading="lazy"` を使う。
- 重くなりやすい描画効果を抑える。過剰な `box-shadow`、`backdrop-filter`、`filter`、`transition`、`transform` 宣言を避ける。
- transitionを使う場合は、`@media (prefers-reduced-motion: reduce)` の代替を入れる。

## アセット方針
- サードパーティフォントを使わない。
- CDNを使わない。
- トラッキングピクセルやanalyticsを入れない。
- 装飾ビジュアルはローカルで軽量にする。

## 検証証拠
`fixed-app/` の中に短い `PERFORMANCE_BUDGET.md` を作り、以下を含める。
- 予算値。
- 実測サイズ。
- 実行したコマンド。
- 既知のトレードオフ。

可能であれば以下を実行する。

```bash
node --check experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app/app.js
python3 experiments/2026-06-27-performance-budget-vibe-gallery/audit_static_performance.py experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app
```

静的監査が合格すること。
