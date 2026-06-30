#!/usr/bin/env python3
"""Download Figma MCP assets, normalize SVGs, write manifest and sprite."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ICONS_DIR = ROOT / "assets" / "icons"
SYMBOLS_FILE = Path(__file__).parent / "icon-symbols.json"
URLS_FILE = Path(__file__).parent / "icon-urls.json"
MANIFEST_FILE = ROOT / "icons-manifest.json"
SPRITE_FILE = ROOT / "notasign-icons.svg"

SLUG_MAP: dict[str, str] = {
    "复制": "copy",
    "警告": "warning",
    "收起": "collapse",
    "提示": "info",
    "下载01": "download-01",
    "下载02": "download-02",
    "上传01": "upload-01",
    "上传02": "upload-02",
    "箭头-下": "arrow-down",
    "箭头-右": "arrow-right",
    "箭头-左": "arrow-left",
    "箭头-上": "arrow-up",
    "加载中": "loading",
    "搜索": "search",
    "筛选": "filter",
    "删除": "delete",
    "展开": "expand",
    "新增": "add",
    "客户01": "customer-01",
    "客户02": "customer-02",
    "账户01": "account-01",
    "账户02": "account-02",
    "账户03": "account-03",
    "链接": "link",
    "付款": "payment",
    "退款": "refund",
    "导出": "export",
    "价格01": "price-01",
    "文档01": "document-01",
    "刷新": "refresh",
    "销售01": "sales-01",
    "产品配置": "product-config",
    "套餐管理": "package-manage",
    "套餐02": "package-02",
    "订单管理": "order-manage",
    "订阅": "subscribe",
    "伙伴01": "partner-01",
    "下架": "off-shelf",
    "上架": "on-shelf",
    "费用": "fee",
    "不可见": "invisible",
    "更多": "more",
    "设置": "settings",
    "预览": "preview",
    "疑问": "question",
    "日期": "date",
    "排序": "sort",
    "关闭": "close",
    "成功": "success",
    "菜单": "menu",
    "动态": "activity",
    "首页": "home",
    "附件": "attachment",
    "应用": "app",
    "数据脉冲": "data-pulse",
    "火爆": "hot",
    "合作伙伴": "partners",
    "购买": "purchase",
    "签署": "sign",
    "切换": "switch",
    "设置2": "settings-2",
    "我收到的": "inbox",
    "编辑": "edit",
    "顺序设置": "order-settings",
    "打印": "print",
    "全屏": "fullscreen",
    "退出全屏": "exit-fullscreen",
    "二维码": "qrcode",
    "钥匙": "key",
    "垃圾桶": "trash",
    "图片": "image",
    "保存": "save",
    "撤回": "undo",
    "拒绝": "reject",
    "隐藏预览": "hide-preview",
    "安全": "security",
    "加入": "join",
    "待办": "todo",
    "扫码01": "scan-01",
    "发送": "send",
    "电脑": "computer",
    "添加成员": "add-member",
    "成员管理": "member-manage",
}


def parse_symbol_name(name: str) -> tuple[str, str]:
    m_type = re.search(r"类型=(线性|面性)", name)
    m_icon = re.search(r"icon名称=(.+)$", name)
    raw_type = m_type.group(1) if m_type else "线性"
    icon_label = m_icon.group(1).strip() if m_icon else name
    style = "linear" if raw_type == "线性" else "filled"
    return icon_label, style


def slugify(icon_label: str) -> str:
    return SLUG_MAP.get(icon_label, re.sub(r"[^\w\u4e00-\u9fff-]+", "-", icon_label).strip("-").lower() or "icon")


def normalize_svg(content: str) -> str:
    content = re.sub(
        r'fill="var\(--fill-0,\s*#262626\)"',
        'fill="currentColor"',
        content,
    )
    content = content.replace('fill="#262626"', 'fill="currentColor"')
    content = content.replace('stroke="#262626"', 'stroke="currentColor"')
    content = re.sub(r'fill="var\(--fill-0,\s*([^)]+)\)"', r'fill="\1"', content)
    if 'viewBox="0 0 24 24"' not in content and "<svg" in content:
        if re.search(r"<svg[^>]*viewBox=", content):
            pass
        else:
            content = re.sub(r"<svg\b", '<svg viewBox="0 0 24 24"', content, count=1)
    return content.strip()


def extract_inner_svg(svg: str) -> str:
    svg = re.sub(r"<\?xml[^?]*\?>", "", svg, flags=re.I)
    m = re.search(r"<svg[^>]*>(.*)</svg>", svg, re.S | re.I)
    if not m:
        return svg
    inner = m.group(1).strip()
    inner = re.sub(r'\s(width|height)="[^"]*"', "", inner)
    return inner


def curl_download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["curl", "-sfL", url, "-o", str(dest)], check=True)


def build_sprite(entries: list[dict]) -> str:
    symbols = []
    for e in sorted(entries, key=lambda x: (x["slug"], x["type"])):
        path = ROOT / e["file"]
        if not path.exists():
            continue
        inner = extract_inner_svg(path.read_text(encoding="utf-8"))
        sym_id = f"{e['slug']}-{e['type']}"
        symbols.append(f'  <symbol id="{sym_id}" viewBox="0 0 24 24">{inner}</symbol>')
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<svg xmlns="http://www.w3.org/2000/svg" '
        'xmlns:xlink="http://www.w3.org/1999/xlink" style="display:none">\n'
        + "\n".join(symbols)
        + "\n</svg>\n"
    )


def main() -> int:
    symbols = json.loads(SYMBOLS_FILE.read_text(encoding="utf-8"))
    urls_by_id: dict[str, str] = {}
    if URLS_FILE.exists():
        urls_by_id = json.loads(URLS_FILE.read_text(encoding="utf-8"))

    manifest: list[dict] = []
    failures: list[dict] = []
    saved = 0

    for sym in symbols:
        sid = sym["id"]
        icon_label, style = parse_symbol_name(sym["name"])
        slug = slugify(icon_label)
        filename = f"{slug}-{style}.svg"
        rel_file = f"assets/icons/{filename}"

        entry = {
            "id": sid,
            "name": sym["name"],
            "type": style,
            "slug": slug,
            "file": rel_file,
        }
        manifest.append(entry)

        url = urls_by_id.get(sid)
        if not url:
            failures.append({**entry, "error": "missing URL (Figma MCP rate limit)"})
            continue

        out_path = ICONS_DIR / filename
        try:
            curl_download(url, out_path)
            text = out_path.read_text(encoding="utf-8")
            if not text.lstrip().startswith("<"):
                failures.append({**entry, "error": "not SVG", "url": url})
                out_path.unlink(missing_ok=True)
                continue
            out_path.write_text(normalize_svg(text), encoding="utf-8")
            saved += 1
        except (subprocess.CalledProcessError, OSError) as exc:
            failures.append({**entry, "error": str(exc), "url": url})

    MANIFEST_FILE.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    SPRITE_FILE.write_text(build_sprite(manifest), encoding="utf-8")

    fail_path = ROOT / "scripts" / "icon-export-failures.json"
    fail_path.write_text(json.dumps(failures, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({
        "saved": saved,
        "total": len(symbols),
        "urls_available": len(urls_by_id),
        "failures_count": len(failures),
        "sprite": str(SPRITE_FILE),
        "manifest": str(MANIFEST_FILE),
    }, ensure_ascii=False, indent=2))
    return 0 if saved == len(symbols) else 1


if __name__ == "__main__":
    sys.exit(main())
