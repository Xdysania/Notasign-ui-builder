#!/usr/bin/env python3
"""
Export all icons from Figma via REST Images API (batch SVG).
Requires: FIGMA_ACCESS_TOKEN environment variable.

Usage:
  FIGMA_ACCESS_TOKEN=figd_xxx python3 scripts/export-icons-figma-api.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

FILE_KEY = "fQbAjhOvIXjhidoft9Fuc0"
ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "icons-manifest.json"
URLS = ROOT / "icons-urls.json"
OUT_DIR = ROOT / "assets" / "icons"
BATCH = 40


def normalize_svg(content: str) -> str:
    content = re.sub(
        r'fill="var\(--fill-0,\s*#262626\)"',
        'fill="currentColor"',
        content,
    )
    content = content.replace('fill="#262626"', 'fill="currentColor"')
    content = content.replace('stroke="#262626"', 'stroke="currentColor"')
    if "viewBox=" not in content:
        content = re.sub(
            r"<svg([^>]*?)>",
            r'<svg\1 viewBox="0 0 24 24" width="24" height="24">',
            content,
            count=1,
        )
    return content.strip()


def api_get(token: str, path: str, params: dict | None = None) -> dict:
    q = f"?{urllib.parse.urlencode(params)}" if params else ""
    url = f"https://api.figma.com/v1{path}{q}"
    req = urllib.request.Request(
        url,
        headers={"X-Figma-Token": token},
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode())


def download(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "NotasignIconExport/1.0"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read().decode("utf-8", errors="replace")


def main() -> int:
    token = os.environ.get("FIGMA_ACCESS_TOKEN", "").strip()
    if not token:
        print(
            "Set FIGMA_ACCESS_TOKEN (Figma → Settings → Personal access tokens)",
            file=sys.stderr,
        )
        return 1

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    by_id = {i["id"]: i for i in manifest}
    ids = [i["id"] for i in manifest]
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    url_map: dict[str, str] = {}
    if URLS.exists():
        url_map.update(json.loads(URLS.read_text(encoding="utf-8")))

    for i in range(0, len(ids), BATCH):
        chunk = ids[i : i + BATCH]
        print(f"Requesting batch {i // BATCH + 1} ({len(chunk)} icons)...")
        data = api_get(
            token,
            f"/images/{FILE_KEY}",
            {"ids": ",".join(chunk), "format": "svg"},
        )
        images = data.get("images") or {}
        for nid, svg_url in images.items():
            if not svg_url:
                print(f"  missing URL for {nid}", file=sys.stderr)
                continue
            url_map[nid] = svg_url
            item = by_id[nid]
            dest = OUT_DIR / item["file"]
            try:
                dest.write_text(normalize_svg(download(svg_url)), encoding="utf-8")
                print(f"  ok {item['file']}")
            except Exception as exc:  # noqa: BLE001
                print(f"  fail {item['file']}: {exc}", file=sys.stderr)
        time.sleep(0.5)

    URLS.write_text(json.dumps(url_map, ensure_ascii=False, indent=2), encoding="utf-8")

    import subprocess

    subprocess.run([sys.executable, str(ROOT / "scripts" / "download-icons.py")], check=False)
    subprocess.run([sys.executable, str(ROOT / "scripts" / "build-icon-sprite.py")], check=False)
    count = len(list(OUT_DIR.glob("*.svg")))
    print(f"Done: {count}/{len(manifest)} SVG files in assets/icons/")
    return 0 if count == len(manifest) else 2


if __name__ == "__main__":
    raise SystemExit(main())
