# AIDD Control Plane MVP 009: CI Artifact Importer

MVP 008では、terminal evidence / screenshot evidence / CI URL / Playwright report URLをArtifact Evidence Binderとして束ねた。MVP 009では、その次段として、GitHub ActionsなどのCI実行結果をユーザーが貼り付け、Verification Evidence Binderへ取り込める「CI Artifact Importer」を作る。

## 目的

AIが「CIも通りました」と報告したときに、run URL、commit SHA、workflow名、artifact名、Playwright report URL、失敗ジョブを同じ検証単位で確認できるようにする。

## 対象

- 実装先: `experiments/aidd-control-plane-mvp-009/generated-repo`
- 接続先: `standards/aidd-spec-v0.1.md`, `standards/aidd-control-plane-mvp-v0.1.md`
- UI/テスト/docs: 日本語

## MVP範囲

- CI run summaryの手入力/サンプル切替
- empty / valid / failure state
- run URL、commit SHA、artifact URL、Playwright report URLの形式検証
- workflow / job / artifactの不足検出
- Review Finding / Learning Log / Next AI Task Packet Deltaへの反映
- Playwrightでempty、valid、failureをキャプチャ

## 非ゴール

- GitHub APIの実認証連携
- artifactファイルの実ダウンロード
- 本番DB永続化
