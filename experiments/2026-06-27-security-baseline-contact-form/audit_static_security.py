#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def check(results: list[tuple[bool, str]], condition: bool, message: str) -> None:
    results.append((condition, message))


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: audit_static_security.py <app_dir>")
        return 2

    app = Path(sys.argv[1])
    html = read(app / "index.html")
    js = read(app / "app.js")
    css = read(app / "styles.css")
    evidence = read(app / "SECURITY_PRIVACY.md")
    combined = "\n".join([html, js, css, evidence])
    results: list[tuple[bool, str]] = []

    check(results, bool(html and js and css), "Required app files exist: index.html, styles.css, app.js")
    check(results, '<form' in html and 'id="lead-form"' in html, "Lead form exists with stable id")
    check(results, 'type="email"' in html, "Email field uses type=email")
    check(results, 'required' in html, "Required fields are declared")
    check(results, 'maxlength=' in html, "Text inputs/textarea have explicit maxlength constraints")
    check(results, 'name="companySize"' in html and '<select' in html, "Company size is constrained by select options")
    check(results, 'name="budget"' in html and '<select' in html, "Budget is constrained by select options")
    check(results, 'name="privacyConsent"' in html and 'type="checkbox"' in html and 'required' in html, "Privacy consent checkbox is required before preview")
    check(results, 'data-classification' in html, "PII fields carry data-classification markers")
    check(results, 'aria-describedby' in html and ('privacy' in html.lower() or 'retention' in html.lower()), "Form fields reference privacy/retention help text")
    check(results, 'method=' in html or 'data-static-demo' in html, "Form explicitly declares static-demo/no-network behavior")
    check(results, 'innerHTML' not in js and 'insertAdjacentHTML' not in js and 'outerHTML' not in js, "User-controlled values are not rendered with HTML injection APIs")
    check(results, 'textContent' in js, "User-controlled preview is rendered with textContent or equivalent safe text API")
    check(results, not re.search(r'\b(fetch|XMLHttpRequest|sendBeacon)\b', js), "No network submission APIs are used in the static demo")
    check(results, not re.search(r'\b(localStorage|sessionStorage|indexedDB)\b', js), "PII is not persisted to browser storage")
    check(results, 'console.' not in js, "No console logging of form/PII data")
    check(results, bool(evidence), "SECURITY_PRIVACY.md evidence file exists")
    check(results, all(term in evidence.lower() for term in ['data classification', 'pii', 'retention', 'no network', 'verification']), "Security/privacy evidence covers classification, PII, retention, no-network, verification")

    total_bytes = sum((app / name).stat().st_size for name in ["index.html", "styles.css", "app.js"] if (app / name).exists())
    print(f"APP: {app}")
    print(f"SIZES: total_static_bytes={total_bytes} html={len(html.encode())} css={len(css.encode())} js={len(js.encode())}")
    failed = 0
    for ok, message in results:
        print(("PASS" if ok else "FAIL") + f": {message}")
        failed += 0 if ok else 1
    print(f"SUMMARY: {len(results) - failed} passed / {failed} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
