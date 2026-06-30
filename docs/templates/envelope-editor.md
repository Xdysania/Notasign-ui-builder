# 签署控件编辑模板案例 · 控件拖拽编辑

> **运行文件**：`pages/envelope-editor.html`  
> **Figma**：[主编辑页 node 23607:19666](https://www.figma.com/design/9pfFiMwd0eC1EOMBOjDzsJ/%E5%85%A8%E7%90%83%E7%AD%BE%E4%BA%A7%E5%93%81%E8%BF%AD%E4%BB%A3?node-id=23607-19666) / [属性浮窗 node 23607:19864](https://www.figma.com/design/9pfFiMwd0eC1EOMBOjDzsJ/%E5%85%A8%E7%90%83%E7%AD%BE%E4%BA%A7%E5%93%81%E8%BF%AD%E4%BB%A3?node-id=23607-19864) / [参与方颜色 node 20770:6496](https://www.figma.com/design/9pfFiMwd0eC1EOMBOjDzsJ/%E5%85%A8%E7%90%83%E7%AD%BE%E4%BA%A7%E5%93%81%E8%BF%AD%E4%BB%A3?node-id=20770-6496)

## 页面特征

- 顶部操作栏：关闭、上一步、提示标题、保存、发送
- 左侧控件栏：参与方选择、控件列表，控件可拖放到中间 PDF 画布
- 中间 PDF 画布：默认显示文档预览和一个已放置的手绘控件
- 右侧缩略图栏：展示文档和页码，顶部按钮可收起 / 展开
- 控件属性浮窗：点击画布控件后显示，可编辑必填、名称、提示、位置、引导文案、字体大小并删除控件
- 参与方切换：左侧控件颜色和后续放置控件颜色随参与方变化

## 骨架

```text
body.ns-envelope-editor-app
├── header.ns-envelope-editor-topbar
└── main.ns-envelope-editor[data-envelope-editor]
    ├── aside.ns-envelope-editor-tools
    ├── section.ns-envelope-editor-stage
    │   ├── .ns-envelope-editor-toolbar
    │   └── .ns-envelope-editor-canvas
    ├── aside.ns-envelope-editor-thumbs[data-thumbs]
    └── aside.ns-envelope-editor-props[data-props-panel]
```

## 脚本依赖

```html
<script src="../components/i18n.js" defer></script>
<script src="envelope-editor.js" defer></script>
```

## 基础组件

| 场景 | UI Kit 锚点 | 说明 |
| --- | --- | --- |
| 顶部操作按钮 | `#button` | `ns-btn ns-btn--lg ns-btn--primary` / `ns-btn--secondary` |
| 左侧控件面板 | `Control Palette` | `ns-control-palette` 基础组件，图标使用 `pages/assets/envelope-editor/` 内的 Figma SVG 资产 |
| 属性必填 | `#checkbox` | `label.ns-check` + `input.ns-check__input` |
| 字体大小 | `#select` | 当前用原生 select 表现属性编辑表单，后续可替换为 `div.ns-select[data-ns-select]` |

## 页面级交互

- `data-field-type` + `draggable="true"`：控件工具项
- `data-pdf-page`：拖放目标
- `data-placed-field`：已放置在 PDF 上的控件
- `data-party`：参与方颜色状态
- `data-thumbs-toggle`：右侧缩略图栏收起 / 展开
- `data-props-panel`：控件属性编辑浮窗

## 自检

- [ ] 页面内不依赖 Figma 临时资源；控件图标使用本地 Figma SVG 资产
- [ ] 参与方颜色集中在页面变量里，不散落到控件 DOM
- [ ] 拖放、点击控件、收起缩略图、删除控件可用
- [ ] 典型页预览通过 `ui-kit.html#envelope-editor` 访问
