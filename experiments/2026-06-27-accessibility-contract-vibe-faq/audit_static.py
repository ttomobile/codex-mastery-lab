#!/usr/bin/env python3
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.tags = []
        self.inputs = {}
        self.labels_for = set()
        self.ids = set()
        self.live_regions = []
        self.faq_items = 0
        self.ul_ids = set()
        self.decorative_icons = []

    def handle_starttag(self, tag, attrs):
        attr = dict(attrs)
        self.tags.append((tag, attr))
        if "id" in attr:
            self.ids.add(attr["id"])
        if tag == "input" and "id" in attr:
            self.inputs[attr["id"]] = attr
        if tag == "label" and "for" in attr:
            self.labels_for.add(attr["for"])
        if attr.get("aria-live") == "polite":
            self.live_regions.append(attr)
        if tag == "ul" and "id" in attr:
            self.ul_ids.add(attr["id"])
        if tag == "li" and self.stack and self.stack[-1][0] == "ul" and self.stack[-1][1].get("id") == "faq-list":
            self.faq_items += 1
        if tag == "svg":
            self.decorative_icons.append(attr)
        self.stack.append((tag, attr))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                return


def check(name, passed, failures):
    print(f"{'PASS' if passed else 'FAIL'}: {name}")
    if not passed:
        failures.append(name)


def main():
    if len(sys.argv) != 2:
        print("usage: audit_static.py FIXED_APP_DIR", file=sys.stderr)
        return 2

    root = Path(sys.argv[1])
    html = (root / "index.html").read_text(encoding="utf-8")
    css = (root / "styles.css").read_text(encoding="utf-8")
    js = (root / "app.js").read_text(encoding="utf-8")

    parser = AuditParser()
    parser.feed(html)
    search = parser.inputs.get("faq-search", {})
    describedby = set(search.get("aria-describedby", "").split())
    failures = []

    check("HTML lang exists", bool(re.search(r"<html[^>]+lang=", html)), failures)
    check("Search input has visible label", "faq-search" in parser.labels_for, failures)
    check("Search input controls faq-list", search.get("aria-controls") == "faq-list", failures)
    check("Search input references helper text", "search-help" in describedby and "search-help" in parser.ids, failures)
    check("Search input references result status", "result-status" in describedby and "result-status" in parser.ids, failures)
    check("Search input references no-result status", "no-results" in describedby and "no-results" in parser.ids, failures)
    check("Result count live region exists", bool(parser.live_regions), failures)
    check("FAQ collection uses ul/list semantics", "faq-list" in parser.ul_ids, failures)
    check("FAQ item data count >= 8", len(re.findall(r"question:\s*[\"']", js)) >= 8, failures)
    check("FAQ toggles use buttons", bool(re.search(r"createElement\([\"']button[\"']\)", js)), failures)
    check("Form submit is prevented in JS", "preventDefault()" in js and bool(re.search(r"[\"']submit[\"']\s*,", js)), failures)
    check("CSS includes focus-visible rule", ":focus-visible" in css, failures)
    check("Decorative SVG icons are hidden", all(icon.get("aria-hidden") == "true" and icon.get("focusable") == "false" for icon in parser.decorative_icons), failures)
    check("No dependency import statements", "import " not in js and "require(" not in js, failures)

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
