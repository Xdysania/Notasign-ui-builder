# Foundation Components

> 规范主入口：[notasign-spec-usage.md](../notasign-spec-usage.md)

基础组件是页面和业务组件的最小可复用单元。它们的样式来自 `notasign-design-system.css`，结构来自 `ui-kit.html` 中非置灰、非建设中的示例。

## 当前可调用基础组件

| Component | Source | JS | 主要用途 |
| --- | --- | --- | --- |
| Button | `ui-kit.html#button` | 业务组件内处理 | 表格操作、发起下拉、筛选重置 |
| Icon | `ui-kit.html#icons` | 无 | 调用签署列表、发送设置与管理侧栏 SVG 资产 |
| Tabs | `ui-kit.html#tabs` | `components/tabs.js` | 顶栏导航 |
| Search Input | `ui-kit.html#input` | `components/input.js` | 筛选搜索框 |
| Select | `ui-kit.html#select` | `components/select.js` | 筛选下拉 |
| Checkbox | `ui-kit.html#checkbox` | 可选：indeterminate 需 JS 设置 | 多选设置项 |
| InputNumber | `ui-kit.html#input-number` | 页面自行绑定步进行为 | 数字输入与步进 |
| Text Help Tip | `ui-kit.html#tooltip` | 无 | 字段解释提示 |
| Fixed Action Footer | `ui-kit.html#fixed-action-footer` | 无 | 页面底部固定操作区 |
| Pagination | `components/pagination.js` | `components/pagination.js` | 列表分页 |
| Table | `components/signing-table.js` | `components/signing-table.js` | 签署列表表格形态 |

## 禁用边界

- `data-foundation-status="pending"` 的基础组件示例不可调用。
- `data-callable="false"` 或置灰图标库不可调用。
- `ns-kit-icon-cell--missing` 图标不可调用。
- 如需启用建设中组件，必须先补齐样式、交互、文档和调用规则。

## 维护要求

- 新增基础组件时，同步更新 `ui-kit.html`、`docs/components.md` 和本文件。
- 新增 `--ns-*` token 时，同步补 UI Kit 可见样例。
- 基础组件不得依赖典型页面里的页面级 class。
