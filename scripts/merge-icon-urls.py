#!/usr/bin/env python3
"""Merge id->url entries into scripts/icon-urls.json (symbol order)."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SYMBOLS = ROOT / "icon-symbols.json"
URLS = ROOT / "icon-urls.json"


def main() -> int:
    patch = json.loads(sys.stdin.read())
    urls = json.loads(URLS.read_text(encoding="utf-8")) if URLS.exists() else {}
    urls.update(patch)
    symbols = json.loads(SYMBOLS.read_text(encoding="utf-8"))
    ordered = {s["id"]: urls[s["id"]] for s in symbols if s["id"] in urls}
    URLS.write_text(json.dumps(ordered, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    missing = sum(1 for s in symbols if s["id"] not in ordered)
    print(f"{len(ordered)}/{len(symbols)} urls, {missing} missing")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
