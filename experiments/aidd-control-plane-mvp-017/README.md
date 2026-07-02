# AIDD Control Plane MVP 017: Spec Update Proposal Queue

MVP 017は、MVP 016のCI Workflow Artifact Auditorで見つけた不足を、単発の修正指示で終わらせず、AIDD-Spec / Control Plane標準へ戻す「Spec Update Proposal Queue」として管理する。

## 目的

AI駆動開発では、失敗ログやReview Findingが残っても、次回の標準・テンプレート・AI Task Packetに反映されないことが多い。MVP 017では、Review Finding、Learning Log、CI/証跡不足を、優先度つきのSpec Update Proposalへ変換し、どの標準文書・テンプレート・Codex prompt deltaに戻すかをUI、doctor、E2Eで確認する。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- Review Record
- Learning Log
- Spec Improvement
- AI Task Packet
- Verification Evidence

## 完了条件

- `generated-repo/`のMVP名をMVP 017へ更新する
- UIに「Spec Update Proposal Queue」を追加する
- empty / valid / failureの3状態を日本語で表示する
- Review Findingから、対象標準文書、更新field、優先度、受け入れ条件、Codex prompt delta、検証コマンドを生成する
- `doctor:aidd`がSpec Update Proposal Queueに必要な文言・状態・テストを検査する
- 日本語Unit/E2Eを追加・更新する
- `capture:mvp017`でempty/valid/failure/terminal evidence画像を保存する
- 個別検証ログを`artifacts/terminal/`へ保存する
