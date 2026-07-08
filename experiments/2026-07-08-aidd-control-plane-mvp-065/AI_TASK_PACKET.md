# AI Task Packet: AIDD Control Plane MVP 065 Publication Evidence QA Gate

## 1. 背景

MVP064ではCodex Run Queueの結果を共有Markdownダイジェストへ変換した。しかし、note/preview公開前には、記事内画像、terminal evidence、3ブラウザE2E、console確認、サニタイズ、AIDD-Spec接続が揃っているかを別ゲートで止める必要がある。

## 2. 今回のインクリメント

`generated-repo/` を Next.js + TypeScript の日本語UIとして更新し、**Publication Evidence QA Gate** を実装する。これはRun Result Digestを公開する直前に、記事・preview・画像・terminal証跡の公開準備を ready / blocked / failure / empty で判定する画面である。

## 3. ユーザー価値

AIで記事を量産するのではなく、実験した本人しか出せない一次情報を壊さず公開するために、リンク切れ・証跡不足・ローカル環境名混入・浅い検証を公開前に発見できる。

## 4. 必須UI状態

- empty: 公開候補ダイジェストが未選択。古い記事を誤公開しない。
- valid: 記事、preview、initial/filled/failure/terminal画像、3ブラウザE2E、console確認、サニタイズ、AIDD-Spec接続が揃っている。
- failure: 検証失敗またはpreview画像欠落があるが、原因・修正指示・次回deltaが残っている。
- blocked: local path / host / private network URL、Firefox除外、terminal evidence不足、記事観点不足などが公開ブロック理由として出る。

## 5. 必須データ項目

- source digest id
- article path
- preview URL/path
- referenced assets
- copied preview assets
- terminal evidence image
- initial / filled / failure screenshots
- Chromium / Firefox / WebKit coverage
- console status
- sanitization scan result
- Review Record excerpt
- Learning Log excerpt
- AI Task Packet delta
- Codex prompt delta
- publish checklist

## 6. 品質ゲート

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e` は Chromium / Firefox / WebKit を対象にする
- `pnpm run doctor:aidd`
- capture scriptで empty / valid / failure / blocked / terminal evidence をPNG保存

## 7. テスト要件

- 日本語テスト名を使う。
- domain関数で ready / blocked / failure / empty の判定をunit testする。
- E2Eで4状態の見出し、公開ブロック理由、3ブラウザ表示、サニタイズ結果を確認する。

## 8. AIDD-Spec接続

- Verification Evidence: terminal, screenshot, preview asset existence, browser coverage
- Review Record: 公開ブロック理由、修正指示、severity
- Learning Log: 次回AI Task Packet delta / Codex prompt delta
- Release Checklist: 公開前の画像・証跡・サニタイズ確認

## 9. 非ゴール

- 実際のnote API投稿はしない。
- 実GitHub Actions API連携はしない。今回はfixture drivenなUI/判定に留める。
- 実ファイル削除など破壊的cleanupはしない。
