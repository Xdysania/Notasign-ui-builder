# NotaSign AI Prompt 模板

> 配合 **NotaSign UI 规范引用包** 使用：[ui-kit.html](../ui-kit.html) · [notasign-design-system.css](../notasign-design-system.css) · [notasign-spec-usage.md](./notasign-spec-usage.md) · [.cursor/skills/notasign-ui-architect/SKILL.md](../.cursor/skills/notasign-ui-architect/SKILL.md)

## 通用前缀（推荐每次附带）

```text
你是 NotaSign UI 规范架构师。请按以下规范引用顺序工作：

1. 读 ui-kit.html（仅非置灰、非 pending 示例）与 notasign-design-system.css
2. 读 docs/notasign-spec-usage.md 的调用边界与页面类型策略
3. 如果当前 AI 工具能读取 .cursor/skills/notasign-ui-architect/SKILL.md，请把它作为 AI 设计指令；如果不能读取，我会把其中内容粘贴给你

铁律：禁止内联 style、禁止新 hex、禁止自造 class；
业务组件只用 data-ns-business-* mount，禁止复制其内部 DOM；
基础组件从 UI Kit 复制 DOM 结构。
```

---

## 0. 从 PRD 生成任意页面（主模板）

```text
{粘贴通用前缀}

【PRD】
{产品需求描述：用户、目标、字段、操作、权限、异常态}

【交付】
- 判断页面类型（列表/设置/发起流程/详情/结果/弹层等）
- 输出 pages/{slug}.html、{slug}.css、{slug}.js（路径相对 Notasign-ui-builder）
- 列出用到的 UI Kit 锚点（如 #button #input）与 components/*.js
- 若无现成模板案例，用 UI Kit 组合；有则参考 docs/templates/

【约束】
- 所有可见文案 data-i18n*
- 补全 loading / empty / error 若 PRD 涉及数据加载
- 新增视觉 token 前先说明是否需沉淀进规范
```

---

## 1. 列表页

```text
{粘贴通用前缀}

页面类型：列表页
参考：docs/templates/list-page.md、pages/signing-list.html

【PRD】{业务名称、筛选条件、表格列、行字段、分页、侧栏项}

【交付】
- pages/{slug}.html|.css|.js
- mount：topbar、sidebar（或说明无侧栏）、table 业务组件
- 字段契约参考 list-page-data.md；状态参考 list-page-states.md

行字段示例：
- {field}: {说明}
- statusKey: {枚举}
```

---

## 2. 设置页

```text
{粘贴通用前缀}

页面类型：设置页

【PRD】
- 设置分组与表单项
- 默认值、校验规则、保存/取消
- 是否只读、是否需确认弹窗

【交付】
- 使用 ns-app 壳层 + main.ns-app__content
- 表单项从 ui-kit.html 复制 Input/Select/Switch 等结构
- 主操作 ns-btn--primary，次操作 ns-btn--muted
- 无对应 UI Kit 组件时，列出缺口并建议是否新增规范
```

---

## 3. 签署发起 / 多步流程页

```text
{粘贴通用前缀}

页面类型：流程/发起页

【PRD】
- 步骤与每步表单字段
- 上一步/下一步/提交
- 草稿、校验失败、提交成功跳转

【交付】
- 步骤条与表单区布局（查 UI Kit 是否有 Steps；无则说明组合方案）
- 底部或顶部固定主操作区
- 提交成功可用 ns-result 或跳转结果页
- 保留 data-* 便于后端绑定
```

---

## 4. 详情页

```text
{粘贴通用前缀}

页面类型：详情页

【PRD】
- 展示字段与格式
- 主操作/次要操作
- 是否含 Tab 子区

【交付】
- 信息区用规范 typography / 描述布局
- 操作按钮用 ns-btn 变体
- 需要编辑时说明跳转设置页或内联表单模式
```

---

## 5. 在现有页面上改需求

```text
{粘贴通用前缀}

只修改：{文件路径列表}

【需求】{具体改动}

【约束】
- 不破坏原有滚动契约与 mount 结构
- 不改 notasign-design-system.css 除非新增可复用 token（需同步 ui-kit）
```

---

## 6. 规范评审（不写代码）

```text
{粘贴通用前缀}

对照 NotaSign UI 规范引用包评审：{文件或目录}

输出：
1. 违反项（文件:行号或区块）
2. 应引用的 ui-kit 锚点或模板
3. 修复优先级（阻断/建议）
```

---

## 7. 新增 Token / 组件

```text
{粘贴通用前缀}

在规范中新增：{token 名或组件名}

同步更新：
- notasign-design-system.css
- ui-kit.html 可见样例
- docs/components.md
- 必要时 docs/foundation 或 docs/business README

业务页禁止先写死 hex。
```

---

## 推荐工作流

```text
1. 用「模板 0」+ PRD 生成初版页面
2. 浏览器打开 pages/{slug}.html 硬刷新验证
3. 用「模板 6」做规范评审
4. 列表页再对照 notasign-list-page-generation.mdc
5. 可复用模式确认后写入 docs/templates/
```

## 相关文档

| 文档 | 用途 |
| --- | --- |
| [notasign-spec-usage.md](./notasign-spec-usage.md) | 规范引用说明（主入口） |
| [components.md](./components.md) | 组件字典 |
| [templates/](./templates/) | 页面案例 |
