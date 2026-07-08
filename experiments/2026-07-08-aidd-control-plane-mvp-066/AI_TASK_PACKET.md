# AI Task Packet: AIDD Control Plane MVP 066 Public Preview Smoke Verifier

## 1. 背景

MVP065では、Run Result Digestをnote/preview公開へ進める前に、記事・画像・terminal evidence・3ブラウザ・console・サニタイズ・AIDD-Spec接続を確認するPublication Evidence QA Gateを作った。次の不足は、Markdownやローカルファイル上では存在しているように見える画像が、実際のpreview HTTP経路で読めるかを検査すること。

## 2. 今回のインクリメント

`generated-repo/` を Next.js + TypeScript の日本語UIとして更新し、**Public Preview Smoke Verifier** を実装する。これは公開previewのHTMLと画像・terminal evidence画像をHTTP smoke checkとして確認し、ready / failure / blocked / empty で判定する画面である。

## 3. ユーザー価値

記事を公開した後に「画像が表示されない」「terminal evidence画像だけ404」「previewでは見えるが公開経路では0 byte」という事故を、公開直前のチェックリストで止められる。AI量産記事ではなく、一次情報記事の信頼性を保つための最後の健康チェックにする。

## 4. 必須UI状態

- empty: smoke対象のpreview候補が未選択。古いURLを誤検査しない。
- valid: HTML、initial/filled/failure/terminal evidence画像、CSS/asset copy、AIDD-Spec接続がすべてHTTP 200かつ非ゼロbyte。
- failure: 一部assetが404/0 byte/timeout。原因、修正指示、再実行コマンド、次回deltaが残っている。
- blocked: local path / host / private network URL、Firefox除外、terminal evidence不足、public URL未指定、サニタイズ未完了などをブロック理由として出す。

## 5. 必須データ項目

- smoke run id
- article path
- preview URL/path
- checked URLs
- response status
- byte size
- content type
- latency ms
- required screenshots: empty / valid / failure / terminal evidence
- terminal evidence image response
- browser coverage Chromium / Firefox / WebKit
- console status
- sanitization scan result
- Review Finding draft
- Learning Log note
- AI Task Packet delta
- Codex prompt delta
- rerun command

## 6. 品質ゲート

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e` は Chromium / Firefox / WebKit を対象にする
- `pnpm run doctor:aidd`
- capture scriptで empty / valid / failure / blocked / terminal evidence をPNG保存

## 7. テスト要件

- 日本語テスト名を使う。
- domain関数で ready / failure / blocked / empty の判定をunit testする。
- E2Eで4状態の見出し、HTTP status/byte size、失敗asset、再実行コマンド、3ブラウザ表示、サニタイズ結果を確認する。

## 8. AIDD-Spec接続

- Verification Evidence: public preview HTTP response, asset response, terminal screenshot response, browser coverage
- Review Record: smoke失敗理由、修正指示、severity
- Learning Log: 次回AI Task Packet delta / Codex prompt delta
- Release Checklist: 公開previewが読めることの最終確認

## 9. 非ゴール

- 実際のnote API投稿はしない。
- 外部インターネット上の本番URLを叩かない。今回はfixture drivenなURL/responseでUIと判定を作る。
- 実ファイル削除など破壊的cleanupはしない。
