#!/usr/bin/env python3
"""Hide CSS token variable names from ui-kit surface copy; keep data-token on elements."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "ui-kit.html"

TOKEN_LABELS: dict[str, str] = {
    "--ns-font-family": "系统字体栈",
    "--ns-font-size-xs": "辅助字号",
    "--ns-font-size-sm": "正文字号",
    "--ns-font-size-md": "导航字号",
    "--ns-font-size-lg": "页面标题字号",
    "--ns-line-height-xs": "辅助行高",
    "--ns-line-height-sm": "正文行高",
    "--ns-line-height-md": "导航行高",
    "--ns-line-height-lg": "标题行高",
    "--ns-font-weight-regular": "常规字重",
    "--ns-font-weight-medium": "中等字重",
    "--ns-font-weight-semibold": "半粗字重",
    "--ns-letter-spacing-sidebar": "侧栏字间距",
    "--ns-letter-spacing-title": "标题字间距",
    "--ns-radius-xs": "极小圆角",
    "--ns-radius-sm": "小圆角",
    "--ns-radius-lg": "大圆角",
    "--ns-radius-xl": "特大圆角",
    "--ns-radius-full": "圆形",
    "--ns-shadow-subtle": "轻阴影",
    "--ns-shadow-dropdown": "下拉阴影",
    "--ns-shadow-float": "浮层阴影",
    "--ns-shadow-modal": "对话框阴影",
    "--ns-z-dropdown": "下拉层级",
    "--ns-z-modal": "对话框层级",
    "--ns-z-tooltip": "提示层级",
    "--ns-duration-fast": "快速动效",
    "--ns-duration-normal": "常规动效",
    "--ns-duration-slow": "慢速动效",
    "--ns-transition-fast": "快速过渡",
    "--ns-topbar-height": "顶栏高度",
    "--ns-sidebar-width": "侧栏宽度",
    "--ns-color-bg-icon": "图标默认色",
    "--ns-color-text-primary": "正文色",
    "--ns-color-bg-sidebar": "侧栏背景",
    "--ns-color-bg-page": "页面背景",
    "--ns-color-brand": "品牌主色",
    "--ns-color-success": "成功色",
    "--ns-color-warning": "警告色",
    "--ns-color-error": "错误色",
    "--ns-color-border": "描边色",
    "--ns-color-border-selected": "选中描边",
    "--ns-table-header-height": "表头行高",
    "--ns-table-row-height-lg": "大行高",
    "--ns-table-cell-padding-x/y": "单元格内边距",
    "--ns-color-table-row-border": "行分隔线",
    "--ns-color-text-table-header": "表头文字色",
}

COLOR_USAGE: dict[str, str] = {
    "--ns-color-brand": "默认",
    "--ns-color-brand-hover": "悬浮",
    "--ns-color-brand-active": "按下",
    "--ns-color-brand-200": "浅色阶",
    "--ns-color-brand-300": "深色阶",
    "--ns-color-neutral-100": "主文案",
    "--ns-color-neutral-200": "次文案",
    "--ns-color-neutral-300": "辅助文案",
    "--ns-color-neutral-400": "禁用文案",
    "--ns-color-neutral-500": "描边",
    "--ns-color-neutral-600": "浅底",
    "--ns-color-neutral-700": "白底",
    "--ns-color-bg-sidebar": "侧栏背景",
    "--ns-color-bg-subtle": "浅灰底",
    "--ns-color-bg-page": "页面底",
    "--ns-color-bg-disabled": "禁用底",
    "--ns-color-bg-control-bordered": "描边控件底",
    "--ns-color-bg-control-dark": "深色控件底",
    "--ns-color-success": "成功",
    "--ns-color-success-hover": "成功·悬浮",
    "--ns-color-success-active": "成功·按下",
    "--ns-color-warning": "警告",
    "--ns-color-warning-hover": "警告·悬浮",
    "--ns-color-warning-active": "警告·按下",
    "--ns-color-error": "错误",
    "--ns-color-error-hover": "错误·悬浮",
    "--ns-color-error-active": "错误·按下",
}

SPEC_SPLIT = re.compile(r'(<p class="ns-kit-doc__spec">.*?</p>)', re.DOTALL)


def label_for(token: str) -> str:
    if token in TOKEN_LABELS:
        return TOKEN_LABELS[token]
    if token in COLOR_USAGE:
        return COLOR_USAGE[token]
    if token.startswith("--ns-spacing-"):
        return f"{token.replace('--ns-spacing-', '')}px 间距"
    if token.startswith("--ns-space-"):
        return "兼容别名"
    return token.removeprefix("--ns-").replace("-", " ")


def hidden_token(token: str, attr: str = "data-token") -> str:
    return (
        f'<span class="ns-kit-token-ref" {attr}="{token}" hidden '
        f'aria-hidden="true">{token}</span>'
    )


def transform_surface(text: str) -> str:
    text = text.replace("色块内标注 CSS 变量与 Hex。", "色块内标注 Hex。")
    text = text.replace("命名 / 使用方式 / 变量三列", "命名 / 使用方式 / 间距示意三列")
    text = re.sub(r"\s*·\s*Token\b", "", text)
    text = text.replace('<th scope="col">Token</th>', '<th scope="col">规格</th>')
    text = text.replace('<th scope="row">Token</th>', "")
    text = text.replace(
        '<th scope="col">Token（新）</th><th scope="col">别名（旧）</th>',
        "",
    )
    text = text.replace('<th scope="col">变量</th>', '<th scope="col">示意</th>')

    text = re.sub(
        r'<span class="ns-kit-color-scale__token">(--ns-[^<]+)</span>',
        lambda m: hidden_token(m.group(1))
        + (
            f'<span class="ns-kit-color-scale__usage">{COLOR_USAGE[m.group(1)]}</span>'
            if m.group(1) in COLOR_USAGE
            else ""
        ),
        text,
    )

    text = re.sub(r"<code>--ns-spacing-(\d+)</code>\s*(\d+px)", r"\2", text)

    text = re.sub(
        r'<code class="ns-kit-icon-cell__token">([^<]+)</code>',
        lambda m: hidden_token(m.group(1), "data-icon-slug"),
        text,
    )

    text = re.sub(
        r"<tr><td><code>(--ns-[\w-]+)</code></td>",
        lambda m: f'<tr data-token="{m.group(1)}"><td>{label_for(m.group(1))}</td>',
        text,
    )

    text = re.sub(r"<td><code>--ns-color-[\w-]+</code></td>", "", text)
    text = re.sub(
        r"<td><code>--ns-spacing-[\w-]+</code></td><td><code>--ns-space-[\w-]+</code></td>",
        "",
        text,
    )

    text = re.sub(
        r'<tr><th scope="row">规格</th><td><code>--ns-font-family</code></td></tr>\s*',
        "",
        text,
    )

    text = re.sub(
        r"<code>(--ns-[\w-]+)</code>\s*·\s*",
        lambda m: hidden_token(m.group(1)),
        text,
    )

    text = re.sub(
        r"<th scope=\"row\">([^<]+)</th><td><code>(--ns-[\w-]+)</code>\s*·\s*",
        lambda m: f'<th scope="row">{m.group(1)}</th><td data-token="{m.group(2)}">',
        text,
    )

    text = re.sub(
        r"<code>(--ns-[\w-]+)</code>",
        lambda m: hidden_token(m.group(1)) + label_for(m.group(1)),
        text,
    )

    text = re.sub(
        r'<span class="ns-kit-radius-card__usage">'
        r'<span class="ns-kit-token-ref"[^>]*>--ns-radius-[\w-]+</span>[^<]*<br>',
        '<span class="ns-kit-radius-card__usage">',
        text,
    )

    text = re.sub(
        r"<tr><td>行分隔</td><td><code>--ns-color-table-row-border</code></td></tr>",
        '<tr data-token="--ns-color-table-row-border"><td>行分隔</td><td>表格行分隔线色</td></tr>',
        text,
    )

    text = re.sub(r"<code>--ns-[\w-]+</code>", "", text)
    text = text.replace("Token / 值", "规格 / 值")
    text = text.replace("Token / Class", "规格 / Class")

    return text


def main() -> None:
    raw = HTML_PATH.read_text(encoding="utf-8")
    parts = SPEC_SPLIT.split(raw)
    out: list[str] = []
    for i, part in enumerate(parts):
        out.append(part if i % 2 == 1 else transform_surface(part))
    result = "".join(out)
    HTML_PATH.write_text(result, encoding="utf-8")
    remaining = len(re.findall(r"<code>--ns-", result))
    print(f"Updated {HTML_PATH}")
    print(f"Remaining visible <code>--ns-*</code> outside spec: {remaining}")


if __name__ == "__main__":
    main()
