#!/usr/bin/env python3
"""Build notasign-icons.svg sprite and injectable partial."""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "icons-manifest.json"
OUT_DIR = ROOT / "assets" / "icons"
SPRITE = ROOT / "notasign-icons.svg"


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
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
        sid = item["slug"]
        symbols.append(
            f'  <symbol id="ns-icon-{sid}" viewBox="0 0 24 24">{body}</symbol>'
        )

    sprite = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">\n'
        + "\n".join(symbols)
        + "\n</svg>\n"
    )
    SPRITE.write_text(sprite, encoding="utf-8")
    print(f"Sprite: {len(symbols)} symbols → {SPRITE}")


if __name__ == "__main__":
    main()
