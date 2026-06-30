# Business Components

> 规范主入口：[notasign-spec-usage.md](../notasign-spec-usage.md)

业务组件由基础组件组合而成，通常通过 `components/*.js` 渲染到一个 data attribute mount point。典型页面应调用 mount point，不复制业务组件内部 HTML。

## 当前业务组件

| Component | Mount point | Source JS | 组合依赖 |
| --- | --- | --- | --- |
| Topbar | `[data-ns-business-topbar]` | `components/topbar.js` | Logo, Tabs, help flyout, user menu |
| Sidebar | `[data-ns-business-signing-sidebar]` / `[data-ns-business-management-sidebar]` | `components/signing-sidebar.js` / `components/management-sidebar.js` | Signing variant: CTA + task nav; management variant: grouped nav |
| SigningTable | `[data-ns-business-signing-table]` | `components/signing-table.js` | Table, Button, flyout, Pagination, Footer |
| SigningFooter | `[data-ns-business-signing-footer]` | `components/signing-footer.js` | footer language flyout |

## 依赖顺序

典型页面中建议按以下顺序加载脚本：

```html
<script src="../components/i18n.js" defer></script>
<script src="../components/topbar.js" defer></script>
<script src="../components/signing-sidebar.js" defer></script>
<script src="../components/management-sidebar.js" defer></script>
<script src="../components/tabs.js" defer></script>
<script src="../components/input.js" defer></script>
<script src="../components/select.js" defer></script>
<script src="../components/pagination.js" defer></script>
<script src="../components/signing-table.js" defer></script>
<script src="../components/signing-footer.js" defer></script>
```

## 规则

- 业务组件内部可以使用基础组件 class，但典型页面不应复制业务组件生成的内部 DOM。
- 业务组件需要资产时，统一从 `data-asset-base` 读取。
- 国际化文案通过 `components/i18n.js` 和 `data-i18n*` 处理。
- 业务组件如果新增 data attributes，必须同步更新 `docs/components.md`。
