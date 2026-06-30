#!/usr/bin/env python3
"""
Export file-type icons from Figma component set 24255:1839.

Uses flattened SVG exports from Figma MCP download_assets (not hand-composed).
"""
from __future__ import annotations

import os
import re
import urllib.request

BASE = os.path.join(
    os.path.dirname(__file__),
    "..",
    "pages",
    "assets",
    "envelope-settings",
    "file-icons",
)

# Figma file 9pfFiMwd0eC1EOMBOjDzsJ — component set 24255:1839 (variant frame exports)
FIGMA_EXPORTS = {
    "pdf": "https://www.figma.com/api/mcp/asset/7e823d8d-fdae-45b6-9d63-7a9dc05feff8",
    "ppt": "https://www.figma.com/api/mcp/asset/5c58bbd3-6700-4499-81a3-6581d0682c6d",
    "bmp": "https://www.figma.com/api/mcp/asset/30021442-ac10-4f1d-9361-42d01d9dc41b",
    "ofd": "https://www.figma.com/api/mcp/asset/dec44126-3235-43d7-b9fc-d10ad76aec12",
    "wps": "https://www.figma.com/api/mcp/asset/0e88fa99-5aad-4f6d-95d9-50ad430550c9",
    "jpg": "https://www.figma.com/api/mcp/asset/d8c7b2b2-c747-4427-b342-68ef8b989955",
    "xls": "https://www.figma.com/api/mcp/asset/c9bd434c-a22f-4f51-bebf-112ccf48dc9c",
    "doc": "https://www.figma.com/api/mcp/asset/18745287-7bdb-437b-881d-12d98dc71f91",
    "png": "https://www.figma.com/api/mcp/asset/bd357c79-ab70-47f2-a7a2-cffceba82058",
    "docx": "https://www.figma.com/api/mcp/asset/209398dd-32de-48d5-9ae8-898f6329927b",
    "jpeg": "https://www.figma.com/api/mcp/asset/488c735b-23c8-4b12-bdeb-13d026cfb71e",
    "html": "https://www.figma.com/api/mcp/asset/7348391e-9b73-44ef-9e9b-a7fb12a02622",
    "tiff": "https://www.figma.com/api/mcp/asset/8988db5e-59a1-4ace-a11f-c46ef38d4c6a",
    "xlsx": "https://www.figma.com/api/mcp/asset/63443dc6-2ec6-48e0-bb79-750f1aac3003",
}

FIGMA_NODE_IDS = {
    "pdf": "24255:1840",
    "ppt": "24255:1849",
    "bmp": "24255:1858",
    "ofd": "24255:1867",
    "wps": "24255:1876",
    "jpg": "24255:1885",
    "xls": "24255:1894",
    "doc": "24255:1903",
    "png": "24255:1912",
    "docx": "24255:1921",
    "jpeg": "24255:1930",
    "html": "24255:1939",
    "tiff": "24255:1948",
    "xlsx": "24255:1957",
}


def download(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request) as response:
        return response.read().decode("utf-8")


def sanitize_figma_export(svg_text: str) -> str:
    svg_text = re.sub(r'<rect width="90" height="90" fill="#F5F5F5"/>\s*', "", svg_text)

    group_match = re.search(r'(<g id="Group 3438">.*?</g>)', svg_text, re.DOTALL)
    defs_match = re.search(r"(<defs>.*?</defs>)", svg_text, re.DOTALL)
    if not group_match:
        return svg_text

    inner = group_match.group(1)
    defs = defs_match.group(1) if defs_match else ""

    return (
        '<svg viewBox="0 0 90 90" width="90" height="90" fill="none" '
        'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n'
        f"{inner}\n{defs}\n</svg>\n"
    )


def main() -> None:
    os.makedirs(BASE, exist_ok=True)

    for name, url in FIGMA_EXPORTS.items():
        raw = download(url)
        cleaned = sanitize_figma_export(raw)
        path = os.path.join(BASE, f"{name}.svg")
        with open(path, "w", encoding="utf-8") as handle:
            handle.write(cleaned)
        node_id = FIGMA_NODE_IDS.get(name, "?")
        print(f"wrote {name}.svg (Figma {node_id}, {len(cleaned)} bytes)")


if __name__ == "__main__":
    main()
