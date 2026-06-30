# 信封设置页 — 独立交付包

创建信封流程中的「上传文档 + 收件人配置」典型页面，可直接交给前端或 AI 集成。

## 环境依赖（几乎没有）

| 需要 | 不需要 |
|------|--------|
| 现代浏览器 | Node.js / npm / pnpm |
| （可选）任意静态文件服务器 | Webpack / Vite / React / Vue |
| | 后端 API（Demo 可离线运行） |
| | 数据库、环境变量、构建步骤 |

**技术栈：** 纯静态 `HTML + CSS + 原生 JavaScript`，无框架、无打包。

双击 `index.html` 通常也能看布局和大部分交互；上传预览等建议用本地服务：

```bash
cd deliverables/envelope-settings
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## 给接手 AI / 开发的阅读顺序

1. **`index.html`** — 页面结构；`<template>` 内是收件人卡片、身份核验、抄送人等克隆模板
2. **`envelope-settings.css`** — 页面专用样式（类名前缀 `ns-envelope-settings-`）
3. **`envelope-settings.js`** — 全部交互逻辑（约 1300 行，IIFE 包裹，入口 `initPage()`）
4. **`notasign-design-system.css`** — 通用组件样式（按钮、输入框、Select、Switch 等，类名前缀 `ns-`）
5. **`components/select.js`**、`input-number.js` — 下拉与数字步进器，挂到 `window.NotaSignComponents`

**关键 `data-*` 钩子：**

| 属性 | 作用 |
|------|------|
| `data-envelope-upload` | 上传区 |
| `data-recipient-list` / `data-add-recipient` | 收件人列表与添加 |
| `data-add-cc-recipient` / `data-task-cc-list` | 抄送人 |
| `data-collapse-trigger` | 折叠面板 |
| `data-ns-select` | 自定义下拉（由 select.js 初始化） |

**Demo 已实现 / 需业务接入：**

- ✅ 上传 UI、进度模拟、预览、删除、收件人增删、拖拽排序、折叠、表单校验展示
- ❌ 真实上传 API、提交信封、顺序预览、电子印章、国际化文案（i18n 已引入但未绑文案）

## 目录说明

| 文件/目录 | 说明 |
|-----------|------|
| `index.html` | 页面入口 |
| `envelope-settings.css` | 页面样式 |
| `envelope-settings.js` | 页面交互（上传、收件人、折叠等） |
| `notasign-design-system.css` | 设计系统基础样式 |
| `components/` | Select、InputNumber、i18n 组件脚本 |
| `assets/envelope-settings/` | 页面图标、文件类型图标 |
| `assets/envelope-editor/` | 关闭按钮等共用图标 |
| `assets/send-settings/` | 提示信息图标 |
| `assets/icons/` | Switch 开关图标 |

## 已实现交互（Demo）

- 文档上传（拖拽/点击）、进度、预览、重传、删除
- 动态添加/删除收件人、顺序签署、拖拽排序
- 发送方式（邮箱/手机）、区号下拉、自定义菜单（身份核验/阅读要求）
- 签名类型、身份核验、阅读要求折叠面板
- 抄送人添加/删除
- 任务信息：主题/备注字数统计、签署期限、提醒频率

## 集成说明

- 表单提交、真实上传 API、顺序预览、电子印章等按钮为占位，需接入业务逻辑
- 源文件维护路径：`pages/envelope-settings.*`；更新后重新运行 `scripts/export-envelope-settings-standalone.sh`
