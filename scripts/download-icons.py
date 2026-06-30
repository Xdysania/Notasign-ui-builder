#!/usr/bin/env python3
"""Download and normalize icons from Figma MCP asset URLs in icons-urls.json."""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "icons-manifest.json"
URLS = ROOT / "icons-urls.json"
OUT_DIR = ROOT / "assets" / "icons"
SPRITE = ROOT / "notasign-icons.svg"


def normalize_svg(content: str) -> str:
    content = re.sub(
        r'fill="var\(--fill-0,\s*#262626\)"',
        'fill="currentColor"',
        content,
    )
    content = content.replace('fill="#262626"', 'fill="currentColor"')
    content = content.replace('stroke="#262626"', 'stroke="currentColor"')
    if 'viewBox=' not in content and 'width="24"' not in content:
        content = content.replace("<svg ", '<svg width="24" height="24" ', 1)
    if "viewBox=" not in content:
        content = re.sub(
            r"<svg([^>]*?)>",
            r'<svg\1 viewBox="0 0 24 24">',
            content,
            count=1,
        )
    return content.strip()


def download(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "NotasignIconBuilder/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")


def build_sprite(manifest: list[dict]) -> None:
    symbols: list[str] = []
    for item in manifest:
        path = OUT_DIR / item["file"]
        if not path.exists():
            continue
        inner = path.read_text(encoding="utf-8")
        m = re.search(r"<svg[^>]*>(.*)</svg>", inner, re.S | re.I)
        if not m:
            continue
        body = m.group(1).strip()
        sid = item["slug"].replace(" ", "-")
        symbols.append(
            f'  <symbol id="ns-icon-{sid}" viewBox="0 0 24 24">{body}</symbol>'
        )
    if not symbols:
        return
    sprite = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">\n'
        + "\n".join(symbols)
        + "\n</svg>\n"
    )
    SPRITE.write_text(sprite, encoding="utf-8")


def main() -> int:
    if not MANIFEST.exists():
        print("Missing icons-manifest.json", file=sys.stderr)
        return 1
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    by_id = {i["id"]: i for i in manifest}

    urls: dict[str, str] = {}
    if URLS.exists():
        urls = json.loads(URLS.read_text(encoding="utf-8"))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ok = skip = fail = 0
    for item in manifest:
        dest = OUT_DIR / item["file"]
        if dest.exists() and dest.stat().st_size > 0:
            skip += 1
            continue
        url = urls.get(item["id"])
        if not url:
            fail += 1
            continue
        try:
            svg = normalize_svg(download(url))
            dest.write_text(svg, encoding="utf-8")
            ok += 1
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL {item['id']} {item['name']}: {exc}", file=sys.stderr)
            fail += 1

    build_sprite(manifest)
    print(f"download ok={ok} skip={skip} missing_url_or_fail={fail} total={len(manifest)}")
    return 0 if fail == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
