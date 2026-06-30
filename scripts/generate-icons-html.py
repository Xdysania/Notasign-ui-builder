#!/usr/bin/env python3
"""Generate icon grid HTML fragment for ui-kit from icons-manifest.json."""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "icons-manifest.json"
OUT_DIR = ROOT / "assets" / "icons"
PARTIAL = ROOT / "partials" / "icons-grid.html"


def render_icon(item: dict) -> str:
    path = OUT_DIR / item["file"]
    label = f'{item["name"]} ({item["type"]})'
    if path.exists():
        svg = path.read_text(encoding="utf-8").strip()
        svg = re.sub(
            r"<svg",
            '<svg class="ns-icon__svg" focusable="false" aria-hidden="true"',
            svg,
            count=1,
        )
        if 'width=' not in svg[:120]:
            svg = svg.replace("<svg ", '<svg width="1em" height="1em" ', 1)
        inner = svg
        state = ""
    else:
        inner = '<span class="ns-icon__placeholder" aria-hidden="true"></span>'
        state = " ns-kit-icon-cell--missing"
    return (
        f'<li class="ns-kit-icon-cell{state}">'
        f'<span class="ns-icon ns-icon--md" role="img" aria-label="{label}">{inner}</span>'
        f'<span class="ns-kit-icon-cell__name">{item["name"]}</span>'
        f'<span class="ns-kit-token-ref" data-icon-slug="{item["slug"]}" hidden '
        f'aria-hidden="true">{item["slug"]}</span>'
        "</li>"
    )


def section(title: str, items: list[dict]) -> str:
    cells = "\n".join(f"                  {render_icon(i)}" for i in items)
    return (
        f'                <h4 class="ns-kit-icon-group__title">{title}</h4>\n'
        f'                <ul class="ns-kit-icon-grid" role="list">\n'
        f"{cells}\n"
        f"                </ul>\n"
    )


def main() -> None:
    items = json.loads(MANIFEST.read_text(encoding="utf-8"))
    line_items = [i for i in items if i["style"] == "line"]
    fill_items = [i for i in items if i["style"] == "fill"]
    have = sum(1 for i in items if (OUT_DIR / i["file"]).exists())

    html = (
        "                <p class=\"ns-kit-section-lead\">"
        "Figma <code>3424:8511</code> · 24×24px · "
        f"{len(line_items)} 线性 + {len(fill_items)} 面性。"
        "已导出 <strong>"
        f"{have}/{len(items)}</strong> 个 SVG；"
        "运行 <code>FIGMA_ACCESS_TOKEN=… python3 scripts/export-icons-figma-api.py</code> 可补全。"
        "</p>\n"
        + section("线性图标", line_items)
        + section("面性图标", fill_items)
    )
    PARTIAL.parent.mkdir(parents=True, exist_ok=True)
    PARTIAL.write_text(html, encoding="utf-8")
    print(f"Wrote {PARTIAL} ({have} icons with SVG files)")


if __name__ == "__main__":
    main()
