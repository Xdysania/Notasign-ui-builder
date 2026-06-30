# 列表页案例 · 骨架说明（List Page Template）

> **定位**：`docs/templates/` 下的**案例文档**，不是规范主入口。  
> 主入口：[notasign-spec-usage.md](../notasign-spec-usage.md) · 组件：[ui-kit.html](../../ui-kit.html)

> **用途**：新建「后台列表类页面」时，按本文骨架拼装。参考实现：`pages/signing-list.html`。

## 何时使用

满足以下多数条件时，使用本模板，而不是从零搭页面：

- 左侧有模块导航（侧栏）
- 主区有页面标题 + 筛选 + 数据表格 + 底部分页
- 整页高度固定视口，仅表格区域内部滚动
- 顶栏为全局导航（Logo、Tab、帮助、用户）

典型例子：签署列表、合同列表、模板列表、审批列表。

## 页面结构（自上而下）

```text
body.ns-app
├── [data-ns-business-topbar]          ← 业务组件渲染，禁止手写顶栏 DOM
└── .ns-app__body
    ├── [data-ns-business-*-sidebar]   ← 侧栏业务组件 mount
    └── main.ns-app__content
        ├── header.ns-app__content-head
        │   ├── h1.ns-app__page-title
        │   └── form.ns-app__filters   ← 搜索 + 下拉筛选 + 重置
        └── [data-ns-business-*-table] ← 表格 + 分页 + 页脚（组件内组合）
```

## 最小 HTML 骨架

复制时只改 **mount 属性**、**i18n key**、**资产路径**；不要复制 Topbar / Sidebar / Table 组件内部的 DOM。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>页面标题 — NotaSign</title>
  <link rel="stylesheet" href="../notasign-design-system.css" />
  <link rel="stylesheet" href="<page-name>.css" />
  <!-- 脚本顺序见下文「依赖脚本顺序」 -->
</head>
<body class="ns-app">
  <div data-ns-business-topbar data-active-tab="signing" data-asset-base="assets/<page>/"></div>

  <div class="ns-app__body">
    <div data-ns-business-signing-sidebar data-active-item="all" data-asset-base="assets/<page>/"></div>

    <main class="ns-app__content" id="main">
      <header class="ns-app__content-head">
        <h1 class="ns-app__page-title ns-i18n-ellipsis" data-i18n="page.title">页面标题</h1>

        <form class="ns-app__filters" role="search" aria-label="列表筛选">
          <!-- 搜索：见 docs/components.md → Search Input -->
          <!-- 筛选 Select：见 docs/components.md → Select -->
          <!-- 重置：class="ns-btn ns-btn--filter-reset" -->
        </form>
      </header>

      <div data-ns-business-signing-table data-asset-base="assets/<page>/"></div>
    </main>
  </div>
</body>
</html>
```

## 区域职责

| 区域 | 类名 / mount | 谁负责 | 说明 |
| --- | --- | --- | --- |
| 视口壳 | `body.ns-app` | 页面 CSS | `height: 100vh`，`overflow: hidden`，禁止 body 滚动 |
| 顶栏 | `data-ns-business-topbar` | `topbar.js` | `data-active-tab` 指定当前 Tab |
| 主体行 | `.ns-app__body` | 页面 CSS | `flex` 横排：侧栏 + 主内容 |
| 侧栏 | `data-ns-business-*-sidebar` | 对应 `components/*.js` | `data-active-item` 当前菜单项 |
| 主内容 | `main.ns-app__content` | 页面 CSS + 设计系统 | 纵向 flex 列 |
| 标题区 | `.ns-app__content-head` | 页面 HTML | 标题 + 筛选，**不滚动** |
| 筛选 | `.ns-app__filters` | 页面 HTML | 复用 Input / Select 结构 |
| 表格区 | `data-ns-business-*-table` | 业务 table 组件 | 内含表格滚动、分页、页脚 |

## 依赖脚本顺序（defer）

与 `signing-list.html` 保持一致；新增页面可删减未用到的组件脚本，但 **i18n 必须最先**：

```text
components/i18n.js
components/topbar.js
components/<sidebar>.js
components/tabs.js          ← 顶栏 Tab 需要
components/input.js         ← 搜索框需要
components/select.js        ← 筛选下拉需要
components/pagination.js    ← 表格分页需要
components/<table>.js
components/<footer>.js      ← 若表格组件内渲染 footer
pages/<page>.js             ← 页面级初始化（语言、事件监听）
```

## 页面级 CSS 边界（`pages/<page>.css`）

**允许**：

- `html, body.ns-app` 视口与 `overflow: hidden`
- `.ns-app__body`、`.ns-app__content` 的 flex / `min-height: 0` 滚动契约
- 筛选区横向排列、列宽等**页面专属**布局
- 表格列宽、行高等**该列表独有**样式（优先 token，避免硬编码 hex）

**禁止**：

- 重写 `ns-btn`、`ns-input`、`ns-select`、`ns-table` 等基础组件内部样式
- 复制业务组件内部 DOM 再在页面 CSS 里针对性 hack
- 新 hex / 随意新 class（应先沉淀 token + UI Kit）

### 滚动契约（必守）

否则会出现底部白条、分页错位、菜单被裁切：

```css
.ns-app__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

.ns-app__content {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.ns-app__content > [data-ns-business-*-table] {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}
```

表格数据行滚动发生在 `.ns-table-container`（由 table 组件 / 设计系统约定），不是 `body`。

## 筛选区约定

- 搜索：`ns-input--with-icon ns-input--search` + `data-search-input` / `data-search-clear`
- 时间 / 状态等：`.ns-app__select-wrap` 包裹 `data-ns-select`
- 重置：`ns-btn ns-btn--filter-reset`，`type="reset"`
- 宽度 token：`--ns-control-search-width`、`--ns-control-filter-select-width`（见设计系统）

## 业务组件 mount 属性

| 属性 | 示例 | 含义 |
| --- | --- | --- |
| `data-asset-base` | `assets/signing-list` | 页面内图标 SVG 相对路径（相对 `pages/`） |
| `data-active-tab` | `signing` | 顶栏当前 Tab |
| `data-active-item` | `all` | 侧栏当前项 |
| `data-page-size` / `data-current-page` / `data-total` | 表格 mount 或组件内默认 | 分页状态 |

分页变更事件：`notasign:paginationchange`，detail：`{ pageSize, currentPage }`。

## 新建列表页检查项（本步）

生成或评审新列表页时，先对照：

- [ ] 使用 `body.ns-app` + 顶栏 mount + `.ns-app__body` 结构
- [ ] 侧栏、表格均为 **mount point**，未粘贴组件内部 HTML
- [ ] 标题与筛选在 `.ns-app__content-head`，表格 mount 在其后
- [ ] 页面 CSS 含 `min-height: 0` 滚动契约
- [ ] 脚本顺序正确，且包含实际用到的 `components/*.js`
- [ ] 可见文案有 `data-i18n` / `data-i18n-placeholder`
- [ ] 未调用 UI Kit 中 pending / 禁止调用示例

## 参考实现

| 文件 | 说明 |
| --- | --- |
| `pages/signing-list.html` | 标准列表页 HTML |
| `pages/signing-list.css` | 布局与滚动 |
| `pages/signing-list.js` | 页面初始化 |
| `docs/components.md` | 各组件 DOM / data 属性字典 |

## 相关文档

| 文档 | 用途 |
| --- | --- |
| [list-page-data.md](./list-page-data.md) | 行数据与分页字段 |
| [list-page-states.md](./list-page-states.md) | 空态 / 加载 / 错误 |
| [../notasign-spec-usage.md](../notasign-spec-usage.md) | 规范引用说明 |
| [../ai-prompts.md](../ai-prompts.md) | Prompt 模板 |
| `.cursor/rules/notasign-list-page-generation.mdc` | 列表页自检 |
