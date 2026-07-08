# AIDD Control Plane MVP066

Public Preview Smoke Verifierは、MVP065 Publication Evidence QA Gateの後段で、公開preview HTMLとassetsがHTTP経路で読めるかをempty / valid / failure / blockedで判定するNext.js/TypeScriptアプリです。smoke run id、article path、preview URL/path、checked URLs、HTTP status、byte size、content type、latency ms、terminal evidence image response、Chromium/Firefox/WebKit、console status、sanitization scan、Review Finding、Learning Log、AI Task Packet delta、Codex prompt delta、rerun commandを同じ画面で確認します。

画面ではAIDD-Spec v0.1、AIDD Control Plane MVP v0.1、Verification Evidence、Release Checklistへの接続文言も表示します。

## Commands

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp066`

## States

- `empty`: 公開preview smokeの入力待ち。
- `valid`: 公開preview HTMLとassetのHTTP証跡、3ブラウザ、console、sanitization scan、接続文言がそろった状態。
- `failure`: 失敗assetを検出し、HTTP status、byte size、content type、latency msを保持する状態。
- `blocked`: HTTP経路未確認、private URL混入、Firefox未確認、terminal evidence image response不足、AIDD-Spec接続不足をReview Findingとして表示する状態。
