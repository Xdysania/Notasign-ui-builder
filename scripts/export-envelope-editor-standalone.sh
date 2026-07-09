#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/deliverables/envelope-editor"
ZIP="$ROOT/deliverables/envelope-editor.zip"

rm -rf "$DEST"
mkdir -p "$DEST/components" "$DEST/assets" "$DEST/assets/icons"

# 页面核心文件：原样复制，仅 HTML 入口做路径改写
cp "$ROOT/pages/envelope-editor.css" "$ROOT/pages/envelope-editor.js" "$DEST/"
cp "$ROOT/notasign-design-system.css" "$DEST/"
cp "$ROOT/components/i18n.js" "$ROOT/components/select.js" "$ROOT/components/input-number.js" "$DEST/components/"

cp -R "$ROOT/pages/assets/envelope-editor" "$DEST/assets/"
cp -R "$ROOT/pages/assets/signing-list" "$DEST/assets/"
cp "$ROOT/assets/icons/switch-off.svg" "$ROOT/assets/icons/switch-on.svg" "$DEST/assets/icons/" 2>/dev/null || true

sed \
  -e 's|href="../notasign-design-system.css"|href="notasign-design-system.css"|g' \
  -e 's|src="../components/|src="components/|g' \
  "$ROOT/pages/envelope-editor.html" > "$DEST/index.html"

python3 - "$DEST" << 'PY'
import re
import sys
from pathlib import Path

dest = Path(sys.argv[1])
missing = []
refs = set()

patterns = [
    re.compile(r'''(?:src|href)=["']([^"']+)["']'''),
    re.compile(r'''url\(["']?([^"')]+)["']?\)'''),
    re.compile(r'''["'](assets/[^"']+)["']'''),
]

for f in dest.rglob("*"):
    if f.suffix not in {".html", ".js", ".css"}:
        continue
    text = f.read_text(encoding="utf-8")
    for pattern in patterns:
        for m in pattern.finditer(text):
            ref = m.group(1).split("?")[0].split("#")[0]
            if not ref or ref.startswith(("http", "data:", "#", "mailto:")):
                continue
            if ref.startswith("./"):
                ref = ref[2:]
            refs.add(ref)

for ref in sorted(refs):
    if ref.startswith("fonts/"):
        continue
    if ref.endswith("-") or ref.endswith("/"):
        continue
    if not (dest / ref).exists():
        missing.append(ref)

if missing:
    print("Missing assets after export:", file=sys.stderr)
    for ref in missing:
        print(f"  - {ref}", file=sys.stderr)
    sys.exit(1)

print(f"Validated {len(refs)} local references")
PY

cat > "$DEST/README.md" << 'EOF'
# 控件拖拽编辑器 — 独立交付包

信封编辑器完整典型页（`pages/envelope-editor.*`）的原样副本，供前端开发参考与集成。

**说明：** 本目录由导出脚本自动生成，页面结构与交互逻辑与源文件一致，仅调整了静态资源相对路径，便于独立运行。

## 本地预览

```bash
cd deliverables/envelope-editor
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## 目录说明

| 文件/目录 | 说明 |
|-----------|------|
| `index.html` | 页面入口（对应 `pages/envelope-editor.html`） |
| `envelope-editor.css` | 页面样式 |
| `envelope-editor.js` | 页面交互逻辑 |
| `notasign-design-system.css` | 设计系统基础样式 |
| `components/` | Select、InputNumber、i18n |
| `assets/envelope-editor/` | 编辑器图标 |
| `assets/signing-list/` | 帮助、下拉箭头等共用图标 |

## 源文件维护

- 开发维护路径：`pages/envelope-editor.html`、`pages/envelope-editor.css`、`pages/envelope-editor.js`
- 更新交付包：`bash scripts/export-envelope-editor-standalone.sh`
EOF

if command -v zip >/dev/null 2>&1; then
  rm -f "$ZIP"
  (cd "$ROOT/deliverables" && zip -rq "envelope-editor.zip" "envelope-editor")
  echo "Created archive: $ZIP"
fi

echo "Exported standalone envelope-editor to: $DEST"
