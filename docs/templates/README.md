# 典型页面案例（Templates）

> **定位**：加速参考，不是规范主入口。  
> 通用规则见 [notasign-spec-usage.md](../notasign-spec-usage.md)；组件见 [ui-kit.html](../../ui-kit.html)。

典型页面展示「多种业务组件在真实页面中的组合方式」。可以有页面级 CSS，但不应重新定义基础/业务组件的内部样式契约。

## 已有案例

| 案例 | 运行文件 | 说明文档 |
| --- | --- | --- |
| **签署列表** | `pages/signing-list.html` | [list-page.md](./list-page.md)、[list-page-data.md](./list-page-data.md)、[list-page-states.md](./list-page-states.md) |
| **发送设置** | `pages/send-settings.html` | [settings-page.md](./settings-page.md) |
| **信封设置** | `pages/envelope-settings.html` | [flow-page.md](./flow-page.md) |

列表页专项自检：`.cursor/rules/notasign-list-page-generation.mdc`

## 计划扩展（按 PRD 沉淀）

| 案例 | 状态 |
| --- | --- |
| 设置页 | 已有 [settings-page.md](./settings-page.md) · `pages/send-settings.html` |
| 签署发起 / 流程页 | 已有 [flow-page.md](./flow-page.md) · `pages/envelope-settings.html` |
| 详情页 | 待增 `detail-page.md` |

有 PRD 时可先用 [ai-prompts.md](../ai-prompts.md) 模板 0 生成，确认稳定后再写入本目录。

## 签署列表 · 依赖结构

```text
pages/signing-list.html
  ├─ ../notasign-design-system.css
  ├─ pages/signing-list.css
  ├─ components/i18n.js
  ├─ components/topbar.js
  ├─ components/signing-sidebar.js
  ├─ components/tabs.js
  ├─ components/input.js
  ├─ components/select.js
  ├─ components/pagination.js
  ├─ components/signing-table.js
  ├─ components/signing-footer.js
  └─ pages/signing-list.js
```

## Mount points（签署列表）

```html
<div data-ns-business-topbar data-active-tab="signing" data-asset-base="assets/signing-list"></div>
<div data-ns-business-signing-sidebar data-active-item="all" data-asset-base="assets/signing-list"></div>
<div data-ns-business-signing-table data-asset-base="assets/signing-list"></div>
```

## 新增案例要求

1. 可运行页面放在 `pages/<slug>.html|css|js`
2. 在本目录新增 `<type>-page.md`（骨架、数据、状态若有）
3. 更新本 README 表格
4. 新业务组件登记 [business/README.md](../business/README.md) 与 [components.md](../components.md)
5. 可复用 token / 组件先沉淀 UI Kit，再写业务页
