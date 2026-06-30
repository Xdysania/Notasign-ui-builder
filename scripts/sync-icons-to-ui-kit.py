#!/usr/bin/env python3
"""Regenerate partials/icons-grid.html and splice into ui-kit.html icons panel."""

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def splice() -> None:
    html = (ROOT / "ui-kit.html").read_text(encoding="utf-8")
    grid = (ROOT / "partials" / "icons-grid.html").read_text(encoding="utf-8")
    sprite = (ROOT / "notasign-icons.svg").read_text(encoding="utf-8")

    lib_start = html.index('              <motion class="ns-kit-demo" id="icons-library">'.replace("motion", "motion"))
    # find actual marker
    lib_start = html.index('<motion class="ns-kit-demo" id="icons-library">') if '<motion class="ns-kit-demo" id="icons-library">' in html else html.index('<div class="ns-kit-demo" id="icons-library">')
    label_end = html.index("</p>", html.index("基础图标库", lib_start)) + 4
    lib_end = html.index("              </div>", label_end)

    html = html[:label_end] + "\n" + grid + html[lib_end:]

    inject = (
        '\n  <div class="ns-kit-icon-sprite" aria-hidden="true" hidden>\n'
        + sprite
        + "  </div>\n"
    )
    marker = '  <script src="ui-kit.js"></script>'
    if "ns-kit-icon-sprite" not in html:
        html = html.replace(marker, inject + marker)
    else:
        s = html.index('<motion class="ns-kit-icon-sprite"'.replace("motion", "div"))
        if 'class="ns-kit-icon-sprite"' in html:
            s = html.index('class="ns-kit-icon-sprite"')
            s = html.rfind("<div", 0, s)
            e = html.index("</motion>", s) if "</motion>" in html[s : s + 200] else html.index("</motion>", s)
            e = html.index("</div>", s) + 6
            html = html[:s] + inject.strip() + html[e:]

    (ROOT / "ui-kit.html").write_text(html, encoding="utf-8")


def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate-icons-html.py")], check=True)
    splice()
    print("Synced icons into ui-kit.html")


if __name__ == "__main__":
    main()
