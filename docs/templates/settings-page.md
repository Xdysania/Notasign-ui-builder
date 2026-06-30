# 设置页模板案例 · 发送设置

> **运行文件**：`pages/send-settings.html`  
> **Figma**：[node 23484:781](https://www.figma.com/design/9pfFiMwd0eC1EOMBOjDzsJ/%E5%85%A8%E7%90%83%E7%AD%BE%E4%BA%A7%E5%93%81%E8%BF%AD%E4%BB%A3?node-id=23484-781)

## 页面特征

- 顶栏激活「管理」Tab（三 Tab 导航，无首页）
- 左侧管理侧栏分组导航（管理 / 费用 / 集成）
- 主内容为分组设置表单：Checkbox、Select、InputNumber、主按钮保存
- 强制阅读为条件展开模块：未勾选「启用强制阅读」时隐藏子设置，勾选后展示阅读到最后一页、固定阅读时间与允许发起人调整等选项
- 条款确认弹窗模块复用 Checkbox 与 Text Help Tip，提示说明提交前条款确认规则
- 主内容区纵向滚动，底部操作栏固定

## 骨架

```text
body.ns-app
├── [data-ns-business-topbar]          data-active-tab="admin" data-nav-profile="admin"
└── .ns-app__body
    ├── [data-ns-business-management-sidebar]   data-active-item="send-settings"
    └── main.ns-app__content.ns-send-settings-page
        ├── .ns-send-settings-page__scroll
        │   ├── 页面标题
        │   └── form.ns-send-settings-form（分组 section）
        └── footer.ns-send-settings-page__footer（保存）
```

## 脚本依赖

```html
<script src="../components/i18n.js" defer></script>
<script src="../components/topbar.js" defer></script>
<script src="../components/management-sidebar.js" defer></script>
<script src="../components/tabs.js" defer></script>
<script src="../components/select.js" defer></script>
<script src="../components/input-number.js" defer></script>
<script src="send-settings.js" defer></script>
```

## Mount points

```html
<div data-ns-business-topbar data-active-tab="admin" data-nav-profile="admin" data-asset-base="assets/signing-list"></div>
<div data-ns-business-management-sidebar data-active-item="send-settings" data-asset-base="assets/send-settings"></div>
```

## 基础组件

| 场景 | UI Kit 锚点 | 说明 |
| --- | --- | --- |
| 复选框 | `#checkbox` | `label.ns-check` + `input.ns-check__input` |
| 下拉 | `#select` | `div.ns-select[data-ns-select]` |
| 数字输入 | `#input-number` | `div.ns-input-number` |
| 文本解释 | `#tooltip` | `span.ns-help-tip` + `button.ns-help-tip__trigger` + `span.ns-help-tip__bubble` |
| 固定操作栏 | `#fixed-action-footer` | `footer.ns-fixed-action-footer` |
| 主按钮 | `#button` | `ns-btn ns-btn--lg ns-btn--primary`（40px） |

## 页面级 class（仅布局）

- `ns-send-settings-page` / `__scroll`
- `ns-send-settings-form` / `__section` / `__nested` / `__select-wrap`
- 发送设置页字段宽度：Select 使用 `--ns-send-settings-select-width: 425px`；InputNumber 使用基础组件默认宽度

## 自检

- [ ] 顶栏、管理侧栏为 mount point，未复制内部 DOM
- [ ] `data-nav-profile="admin"` 使顶栏仅显示签署/模板/管理
- [ ] 文案均有 `data-i18n*`
- [ ] `body` 无纵向滚动；`.ns-send-settings-page__scroll` 承担滚动
- [ ] 无内联 style、无硬编码 Hex
