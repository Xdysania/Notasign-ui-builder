# 列表页案例 · 数据字段（List Page Data Contract）

> **案例文档**，非规范主入口。主入口：[notasign-spec-usage.md](../notasign-spec-usage.md)

> **用途**：前后端对接、AI 生成 mock 数据、业务 table 组件入参时，统一字段命名与类型。  
> **基准实现**：`components/signing-table.js` 中 `DEFAULT_ROWS` 与 `renderSigningTable()`。

## 列表级参数（页面 / 表格 mount）

挂在 `[data-ns-business-*-table]` 或传入 `render*Table(options)`：

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `total` | number | `99` | 符合条件的总条数（非当前页条数） |
| `pageSize` | number | `10` | 每页条数 |
| `currentPage` | number | `1` | 当前页，从 1 开始 |
| `assetBase` | string | — | 图标路径前缀，如 `assets/signing-list` |

分页变更后由 `pagination.js` 派发 `notasign:paginationchange`，detail 同 `{ pageSize, currentPage }`。表格组件应据此切片 `rows` 并回写 `data-*` 属性。

## 筛选区参数（页面 form）

签署列表当前约定（可扩展，但新增筛选项须同步 i18n key）：

| 字段 | DOM / 行为 | 示例值 |
| --- | --- | --- |
| `search` | `input[data-search-input]` | 用户输入的关键词 |
| `timeRange` | `data-ns-select`，`data-value` | `last-6-months` \| `last-3-months` \| `last-1-month` |
| `status` | `data-ns-select`，可选 placeholder | `filling` \| `signing` \| `completed` 等 |

重置按钮：`type="reset"` 的 `ns-btn--filter-reset`，恢复 select 默认值与清空搜索。

## 行数据 `rows[]`（签署列表）

每一行对象建议形状：

```ts
interface SigningListRow {
  /** 完整标题，用于 title 与无障碍 */
  subject: string;
  /** 可选；表格单元格展示用，超长已截断 */
  displaySubject?: string;
  /** 状态机 key，驱动主按钮、状态点、更多菜单类型 */
  statusKey: SigningStatusKey;
  /** 展示用签署方文案（已格式化字符串） */
  parties: string;
  /** 发起时间，展示字符串（后端格式化或前端 locale） */
  startedAt: string;
  /** 最后更新时间 */
  updatedAt: string;
}
```

### `statusKey` 枚举（签署列表）

| statusKey | 状态文案 i18n | 主操作 | 更多菜单类型 |
| --- | --- | --- | --- |
| `filling` | `status.filling` | 填写 (`action.fill`) | `progress` |
| `signing` | `status.signing` | 签署 (`action.sign`) | `progress` |
| `draft` | （草稿） | 编辑 (`action.edit`) | `edit` |
| `completed` | `status.completed` | 查看 (`action.view`) | `completed` |
| `expired` | （已过期） | 查看 (`action.view`) | `completed` |

状态圆点 class：`ns-table-status__dot--{normal|success|warning|...}`，由 `STATUS_DOT[statusKey]` 映射。

## 列与字段对应（签署列表）

| 列（UI） | 行字段 | 备注 |
| --- | --- | --- |
| 主题 | `subject` / `displaySubject` | `ns-table__cell--name` |
| 状态 | `statusKey` → i18n 文案 | `ns-table-status` |
| 签署方 | `parties` | `ns-table__cell--meta` |
| 发起时间 | `startedAt` | |
| 最后更新 | `updatedAt` | |
| 操作 | 由 `statusKey` 推导 | 主按钮 + `table-more` 飞窗 |

## 新业务列表如何扩展

复制本契约时，在页面 PR 或 `docs/components.md` 增加一节 **「XXX List Row」**：

1. **固定保留**：`total`、`pageSize`、`currentPage`、分页事件名不变。  
2. **行对象**：用业务语义命名（如 `templateName` 不要叫 `subject`，除非列就是主题）。  
3. **状态**：统一用 `statusKey` + i18n 表，不要混用中文 status 字符串判断。  
4. **操作列**：主操作与更多菜单仍走 `statusKey` 或显式 `primaryActionKey`。  
5. **mock**：AI 生成至少 3 种 `statusKey` 的行，覆盖主按钮与 more 菜单差异。

### 扩展示例（合同模板列表 — 草案）

```ts
interface TemplateListRow {
  name: string;
  displayName?: string;
  statusKey: "draft" | "published" | "archived";
  owner: string;
  updatedAt: string;
}
```

## AI / 开发自检（本步）

- [ ] 行对象字段名与列含义一一对应，无「魔法字符串」状态判断  
- [ ] `total` 表示全量条数，分页只切 `rows` 不改变 `total` 语义  
- [ ] 时间字段约定为展示字符串或 ISO8601 二选一，并在组件注释写明  
- [ ] 筛选 `data-value` 与后端枚举文档一致  
- [ ] 新列表已在 `docs/components.md` 登记 row 形状

## 相关文档

- [list-page.md](./list-page.md) — 页面骨架  
- [list-page-states.md](./list-page-states.md) — 空态 / 加载 / 错误  
- [../notasign-spec-usage.md](../notasign-spec-usage.md) — 规范引用说明
