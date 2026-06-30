# 列表页案例 · 状态规范（List Page States）

> **案例文档**，非规范主入口。主入口：[notasign-spec-usage.md](../notasign-spec-usage.md)

> **用途**：列表页补全加载、空数据、筛选无结果、错误等反馈时，统一组件选择与挂载位置。  
> **组件来源**：`ui-kit.html` → Spin / Skeleton / Empty / Alert（Result 仅用于整页结果，不替代表格区空态）。

## 状态一览

| 状态 key | 触发条件 | 展示区域 | 推荐组件 | 签署列表现状 |
| --- | --- | --- | --- | --- |
| `loading` | 首屏或翻页/筛选请求进行中 | 表格区 `.ns-table-container` 内居中 | `ns-spin` 或 `ns-skeleton` | 未实现（mock 直出数据） |
| `ready` | 有数据且请求成功 | 表格 + 分页 | 正常 `ns-table` | ✅ 默认 |
| `empty` | 无任何业务数据（新用户/模块未使用） | 同上，替换表格主体 | `ns-empty` | 未实现 |
| `filter-empty` | 有数据但当前筛选/搜索无匹配 | 同上 | `ns-empty`（文案不同） | 未实现 |
| `error` | 列表接口失败 | 筛选区下方或表格区顶部 | `ns-alert--error` + 重试按钮 | 未实现 |
| `forbidden` | 无列表权限 | 主内容区居中 | `ns-empty` 或 `ns-result` | 未实现 |

## 挂载位置（必守）

状态只出现在 **表格业务区**，不要盖住顶栏、侧栏、页面标题和筛选表单。

```text
main.ns-app__content
├── header.ns-app__content-head     ← 始终可见
└── [data-ns-business-*-table]
    └── .ns-signing-table-wrapper
        ├── .ns-table-container      ← loading / empty / error 主要落点
        │   ├── .ns-list-state       ← 可选包裹层（见下文 data 约定）
        │   ├── .ns-empty | .ns-spin | .ns-alert
        │   └── .ns-table-content > table   ← ready 时显示
        └── 分页条                      ← ready 且 total>0 时显示；empty 可隐藏
```

**滚动**：空态/加载态容器仍需遵守 [list-page.md](./list-page.md) 的 `min-height: 0`；居中可用 flex：

```css
/* 仅页面级或设计系统沉淀；AI 生成时优先复用已有 class */
.ns-table-container--state {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  min-height: 0;
}
```

若该 class 尚未入库，生成页面时先用结构占位，并标注需沉淀到 `notasign-design-system.css`。

## 组件 DOM（从 UI Kit 复制）

### 加载中 `loading`

```html
<div class="ns-spin" role="status" aria-live="polite">
  <span class="ns-spin__indicator" aria-hidden="true"></span>
  <span data-i18n="state.loading">加载中</span>
</div>
```

首屏也可用骨架屏（`ui-kit.html#skeleton`）模拟表格行，但禁止与真实 `tbody` 混排。

### 无数据 `empty`

```html
<div class="ns-empty">
  <h3 class="ns-empty__title" data-i18n="state.empty.title">暂无合同</h3>
  <p class="ns-empty__desc" data-i18n="state.empty.desc">发起签署后将在此展示</p>
  <button type="button" class="ns-btn ns-btn--md ns-btn--primary" data-i18n="state.empty.action">发起签署</button>
</div>
```

### 筛选无结果 `filter-empty`

结构同 `ns-empty`，文案必须区分「从未有数据」：

| 节点 | i18n 示例 key | 示例文案 |
| --- | --- | --- |
| title | `state.filterEmpty.title` | 未找到相关任务 |
| desc | `state.filterEmpty.desc` | 请调整搜索词或筛选条件 |
| action（可选） | `state.filterEmpty.reset` | 重置筛选 → `ns-btn--filter-reset` 逻辑 |

### 错误 `error`

```html
<div class="ns-alert ns-alert--error" role="alert">
  <div class="ns-alert__content">
    <h4 class="ns-alert__title" data-i18n="state.error.title">加载失败</h4>
    <p class="ns-alert__message" data-i18n="state.error.desc">请稍后重试</p>
  </div>
</div>
<button type="button" class="ns-btn ns-btn--md ns-btn--primary" data-i18n="state.error.retry">重试</button>
```

### 无权限 `forbidden`

优先 `ns-empty`（无插图也可），标题说明无权限；**不要**用表格 more 菜单或假数据行填充。

## 数据驱动约定

在表格 mount 或 `.ns-signing-table-wrapper` 上增加：

| 属性 | 值 | 行为 |
| --- | --- | --- |
| `data-list-state` | `loading` \| `ready` \| `empty` \| `filter-empty` \| `error` \| `forbidden` | 切换展示块 |
| `aria-busy` | `true` when loading | 无障碍 |

**显示规则**：

- `loading`：隐藏 `<table>` 与分页，显示 `ns-spin`（或 skeleton）
- `ready`：显示表格与分页；`total === 0` 且无筛选 → 视为 `empty`
- `ready` + 有筛选/搜索 + `rows.length === 0` → `filter-empty`
- `error` / `forbidden`：隐藏表格与分页，显示对应反馈

业务组件（如 `signing-table.js`）后续应在 `renderSigningTable` 内根据 `options.state` 或接口结果分支，**禁止**在页面 HTML 里手写一整套假表格再切换 display。

## 分页与状态的组合

| 状态 | 分页条 | `data-total` |
| --- | --- | --- |
| `ready` 且 total > 0 | 显示 | 实际总数 |
| `empty` | 隐藏 | `0` |
| `filter-empty` | 隐藏 | `0`（当前页无行，不等于全库无数据） |
| `loading` | 隐藏 | 保持上次或 `0` |
| `error` | 隐藏 | 不更新 |

## i18n 键名建议（列表通用）

```text
state.loading
state.empty.title / state.empty.desc / state.empty.action
state.filterEmpty.title / state.filterEmpty.desc
state.error.title / state.error.desc / state.error.retry
state.forbidden.title / state.forbidden.desc
```

页面级 key 可加前缀，如 `signing.state.empty.title`，但同一页面内须统一。

## AI 生成要求

1. 需求里若提到「空状态 / 加载 / 报错」，必须在表格区写出对应 DOM，并设 `data-list-state`。
2. 不得用纯文字 div 代替 `ns-empty` / `ns-alert` / `ns-spin`。
3. 不得在 `empty` 态仍渲染 10 行 mock 表格。
4. 主操作按钮（如「发起签署」）须使用 UI Kit 已有 `ns-btn` 变体。
5. 新状态样式若需复用，先沉淀到设计系统，再改业务组件。

## 自检（本步）

- [ ] 六种状态均有明确触发条件与组件选择
- [ ] 空态/加载/错误不遮挡筛选区
- [ ] 文案全部带 `data-i18n`
- [ ] `filter-empty` 与 `empty` 文案不同
- [ ] 未使用 UI Kit 置灰 / pending 示例

## 相关文档

- [list-page.md](./list-page.md) · [list-page-data.md](./list-page-data.md)
- [../notasign-spec-usage.md](../notasign-spec-usage.md) · [../ai-prompts.md](../ai-prompts.md)
- 实现跟进：在 `signing-table.js` 增加 `data-list-state` 分支（可选）
