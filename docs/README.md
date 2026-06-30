# NotaSign UI Builder 文档导航

运行时代码仍在仓库根目录（`ui-kit.html`、`pages/`、`components/`），本目录只做说明与索引。

## NotaSign UI 规范引用包

| 部分 | 文件 |
| --- | --- |
| 活体规范 HTML | [ui-kit.html](../ui-kit.html) + [notasign-design-system.css](../notasign-design-system.css) |
| **使用说明 MD** | **[notasign-spec-usage.md](./notasign-spec-usage.md)** ← 人类 / AI 主入口 |
| AI 设计指令 | [.cursor/skills/notasign-ui-architect/SKILL.md](../.cursor/skills/notasign-ui-architect/SKILL.md)（Cursor 可自动调用，其他 AI 可复制内容使用） |

一句话：组件长什么样看 **ui-kit.html**；怎么用看 **notasign-spec-usage.md**；AI 怎么从 PRD 做页面看 **AI 设计指令**。

## 辅助索引

| 文档 | 用途 |
| --- | --- |
| [components.md](./components.md) | 组件字典（class、data 属性、JS 依赖） |
| [templates/README.md](./templates/README.md) | 典型页面**案例**（列表页等） |
| [ai-prompts.md](./ai-prompts.md) | 可复制 Prompt |
| [foundation/README.md](./foundation/README.md) | 基础组件归档 |
| [business/README.md](./business/README.md) | 业务组件归档 |

## 仓库结构

```text
Notasign-ui-builder/
  ui-kit.html                  # 活体规范
  notasign-design-system.css   # token + 样式 SSOT
  components/                    # 行为与业务组件 JS
  pages/                         # 可运行页面
  docs/                          # 本目录
  .cursor/skills/                # Cursor 存放位置；内容可复制给其他 AI
  .cursor/rules/                 # 生成红线与专项自检
```

## Cursor 规则（可选自动匹配）

- `notasign-html-coder.mdc` — HTML 红线
- `notasign-design-token-documentation.mdc` — 新增 token 须同步 UI Kit
- `notasign-list-page-generation.mdc` — 列表页专项自检

## 调用边界（摘要）

- 只使用 UI Kit **非置灰、非 pending** 示例。
- 业务组件用 **mount point**，不复制内部 DOM。
- 新增 token / 组件 / 模板须同步 UI Kit 与 `components.md`。

详见 [notasign-spec-usage.md](./notasign-spec-usage.md)。
