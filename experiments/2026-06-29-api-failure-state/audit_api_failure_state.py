#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path


def check(name: str, ok: bool, results: list[tuple[str, bool]]) -> None:
    results.append((name, ok))
    print(("合格" if ok else "不合格") + f": {name}")


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: audit_api_failure_state.py <app-dir>", file=sys.stderr)
        return 2
    app = Path(sys.argv[1])
    html = (app / "index.html").read_text(encoding="utf-8") if (app / "index.html").exists() else ""
    css_path = app / "style.css" if (app / "style.css").exists() else app / "styles.css"
    css = css_path.read_text(encoding="utf-8") if css_path.exists() else ""
    js = (app / "script.js").read_text(encoding="utf-8") if (app / "script.js").exists() else ""
    evidence = (app / "API_FAILURE_STATE_EVIDENCE.md").read_text(encoding="utf-8") if (app / "API_FAILURE_STATE_EVIDENCE.md").exists() else ""
    combined = html + "\n" + css + "\n" + js

    results: list[tuple[str, bool]] = []
    check("index.html / style.css / script.js が存在する", bool(html and css and js), results)
    check("日本語UIで lang=ja と viewport がある", 'lang="ja"' in html and 'name="viewport"' in html, results)
    check("API境界が関数として分離されている", re.search(r'function\s+(fetch|load|request|sync)', js, re.I) is not None or re.search(r'const\s+(fetch|load|request|sync)\w*\s*=\s*async', js, re.I) is not None, results)
    check("loading / empty / success / error の状態文言がある", all(word in combined for word in ["読み込み", "まだ", "同期", "エラー"]), results)
    check("offline 状態を扱う", "offline" in combined.lower() or "オフライン" in combined, results)
    check("timeout 状態を扱う", "timeout" in combined.lower() or "タイムアウト" in combined, results)
    check("server error / API失敗 状態を扱う", "server" in combined.lower() or "500" in combined or "API失敗" in combined or "サーバー" in combined, results)
    check("AbortController または明示的なタイムアウト制御がある", "AbortController" in js or "setTimeout" in js and "timeout" in js.lower(), results)
    check("再試行ボタンまたは retry 導線がある", "retry" in combined.lower() or "再試行" in combined or "もう一度" in combined, results)
    check("状態切替用のテスト/デモ制御がある", "data-scenario" in combined or "scenario" in combined.lower() or "__control" in combined, results)
    check("aria-live で状態変化を伝える", "aria-live" in html, results)
    check("エラー時に検索入力や既存データを消さない方針がある", "保持" in combined or "残す" in combined or "preserve" in combined.lower(), results)
    check("外部ネットワーク資産を使っていない", "http://" not in combined and "https://" not in combined, results)
    check("console.log で利用者入力を出していない", "console.log" not in js, results)
    check("API_FAILURE_STATE_EVIDENCE.md がある", bool(evidence), results)
    check("証拠ファイルに失敗状態/検証コマンド/既知制約がある", all(s in evidence for s in ["オフライン", "タイムアウト", "サーバーエラー", "再試行", "検証コマンド", "既知制約"]), results)

    passed = sum(ok for _, ok in results)
    failed = len(results) - passed
    print(f"SUMMARY: {passed} passed / {failed} failed")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
