# AIDD Control Plane MVP082: Smoke Receipt Repair Action Planner

Preview Smoke Receipt Binderで見つかったfailure / blockedを、次の1回で実行するRepair Actionへ変換するNext.js実験です。

## 状態

- `?state=empty`: Smoke Receipt未選択
- `?state=planned`: 壊れたterminal evidence画像を1回のexecute_nowへ変換
- `?state=failure`: HTTP 404 / 0 byte / content type mismatchをReview Findingへ変換
- `?state=blocked`: private URL、local path、Firefox除外、証跡不足、AIDD-Spec接続不足で停止

## AIDD-Spec接続

- Verification Evidence: terminal evidence、screenshot evidence、preview HTTP smokeを同じ検証単位で扱う
- Review Record: broken URL、category、severity、lane、priority reasonをFindingとして保存する
- Learning Log: 次回AI Task Packet deltaとCodex prompt patchへ戻す

## 検証

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp082
```
