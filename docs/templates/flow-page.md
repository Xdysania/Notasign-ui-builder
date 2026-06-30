# 流程页模板案例 · 信封设置

> **运行文件**：`pages/envelope-settings.html`  
> **Figma**：[node 24238:9960](https://www.figma.com/design/9pfFiMwd0eC1EOMBOjDzsJ/%E5%85%A8%E7%90%83%E7%AD%BE%E4%BA%A7%E5%93%81%E8%BF%AD%E4%BB%A3?node-id=24238-9960)

## 页面特征

- 顶部为轻量流程操作栏：关闭、标题、直接发送、下一步
- 主内容为白底卡片栈：上传文档、收件人配置、任务信息
- 收件人区域由重复卡片组成，包含序号、联系人信息、签名类型、身份核验与删除动作
- 页面级脚本负责折叠区展开/收起、拖拽上传态、动态添加/删除收件人
- 整页承载创建信封流程，不依赖业务侧栏 mount point

## 骨架

```text
body.ns-envelope-settings-app
└── .ns-envelope-settings-shell
    ├── header.ns-envelope-settings-topbar
    └── main.ns-envelope-settings-main
        └── form.ns-envelope-settings-form
            ├── section.ns-envelope-settings-panel（上传文档）
            ├── section.ns-envelope-settings-panel（添加收件人）
            ├── section.ns-envelope-settings-panel（任务信息）
            └── .ns-envelope-settings-footer
```

## 脚本依赖

```html
<script src="../components/i18n.js" defer></script>
<script src="../components/select.js" defer></script>
<script src="envelope-settings.js" defer></script>
```

## 基础组件

| 场景 | UI Kit 锚点 | 说明 |
| --- | --- | --- |
| 主次按钮 | `#button` | 顶部「直接发送 / 下一步」与底部 CTA |
| 输入框 | `#input` | 收件人姓名、邮箱、手机号 |
| 多选框 | `#checkbox` | 文档数、顺序签署、送达方式 |
| 下拉 | `#select` | 国家区号、身份核验方式 |
| 开关 | `#switch` | 是否允许核验人更改姓名 |
| 文本域 | `#textarea` | 任务信息附言 |
| 上传区 | `#overview` / 设计系统 Upload | `label.ns-upload` 作为拖拽上传承载体 |

## 页面级 class（仅布局）

- `ns-envelope-settings-shell`
- `ns-envelope-settings-topbar`
- `ns-envelope-settings-panel`
- `ns-envelope-settings-recipient-card`
- `ns-envelope-settings-subcard`
- `ns-envelope-settings-task`

## 自检

- [ ] 无内联样式，视觉全部基于设计系统 token 与页面级布局 class
- [ ] 上传区、收件人区、任务信息区均可独立折叠或交互，不影响基础组件内部样式
- [ ] 新增收件人后序号、强调色和折叠 target id 会同步更新
- [ ] 典型页预览通过 `ui-kit.html#envelope-settings` 访问
