#!/usr/bin/env python3
"""Lightweight static audit for dependency-free contact API experiments."""
from __future__ import annotations

import re
import sys
from pathlib import Path


def check(results, condition, message):
    results.append((bool(condition), message))


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: audit_contact_api.py <api-dir>")
        return 2

    app = Path(sys.argv[1])
    server = app / "server.js"
    evidence = app / "SECURITY_OPERATIONS.md"
    code = server.read_text(encoding="utf-8") if server.exists() else ""
    evidence_text = evidence.read_text(encoding="utf-8") if evidence.exists() else ""
    combined = (code + "\n" + evidence_text).lower()
    results = []

    check(results, server.exists(), "server.js exists")
    check(results, 'require("http")' in code or "require('http')" in code, "uses built-in http module")
    check(results, "express" not in code and "require(\"express\")" not in code, "no Express or external web framework dependency")
    check(results, "GET" in code and "/health" in code, "GET /health is implemented")
    check(results, "POST" in code and "/api/contact" in code, "POST /api/contact is implemented")
    check(results, "application/json" in code.lower(), "requires or returns application/json")
    check(results, "MAX_BODY_BYTES" in code and re.search(r"1024\s*\*\s*(16|32|64)", code), "request body size limit is explicit and small")
    check(results, re.search(r"name\.length\s*>\s*\d+", code) and re.search(r"message\.length\s*>\s*\d+", code), "field length validation exists")
    check(results, "email" in code and re.search(r"/\^.*@.*\$/", code, re.S), "email validation exists")

    # API security/abuse controls expected from the improved packet.
    check(results, "x-csrf-token" in combined or "csrf" in combined, "CSRF or browser-origin protection is documented/implemented")
    check(results, "origin" in combined and ("allowlist" in combined or "allowed_origins" in combined or "allowed origin" in combined), "Origin allowlist policy exists")
    check(results, "rate" in combined and "limit" in combined and ("429" in code or "too many" in combined), "rate limit with 429 behavior exists")
    check(results, "requestid" in code.lower() or "request-id" in combined or "crypto.randomuuid" in code.lower(), "request id is generated or propagated")
    check(results, "audit" in combined and "log" in combined, "audit logging policy exists")
    check(results, "console.log" not in code or re.search(r"console\.log\([^)]*(requestId|method|url|status|audit)", code, re.I | re.S), "console logging avoids direct PII payload dumping")
    check(results, "retention" in combined and ("no persistence" in combined or "not persist" in combined or "memory" in combined), "retention/no-persistence policy exists")
    check(results, "data classification" in combined and "pii" in combined, "data classification covers PII")
    check(results, "error contract" in combined or "error response" in combined, "error response contract is documented")
    check(results, evidence.exists(), "SECURITY_OPERATIONS.md evidence file exists")
    check(results, "verification" in evidence_text.lower() and "node --check" in evidence_text.lower(), "evidence file contains verification commands/results")

    passed = sum(1 for ok, _ in results if ok)
    failed = len(results) - passed
    print(f"APP: {app}")
    if server.exists():
        print(f"SIZES: server_js_bytes={server.stat().st_size}")
    for ok, message in results:
        print(("PASS" if ok else "FAIL") + f": {message}")
    print(f"SUMMARY: {passed} passed / {failed} failed")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
