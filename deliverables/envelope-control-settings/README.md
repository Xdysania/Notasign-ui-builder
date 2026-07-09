# 复选框 / 单选框控件设置 — 独立交付包

信封编辑器中「复选框组」「单选框组」控件及其属性设置面板的独立演示包，可直接交给前端或 AI 集成。

## 环境依赖

| 需要 | 不需要 |
|------|--------|
| 现代浏览器 | Node.js / npm / 构建工具 |
| （推荐）静态文件服务器 | 后端 API |

```bash
cd deliverables/envelope-control-settings
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## 目录说明

| 文件/目录 | 说明 |
|-----------|------|
| `index.html` | 演示入口（仅复选框 + 单选框调色板） |
| `envelope-control-settings.css` | 编辑器样式（含组控件、属性面板） |
| `envelope-control-settings.js` | 全部交互逻辑 |
| `notasign-design-system.css` | 设计系统基础样式 |
| `components/input-number.js` | 尺寸步进器 |
| `components/select.js` | 属性面板下拉（预留） |
| `assets/envelope-editor/` | 控件图标 |

## 已实现能力

- 拖放创建复选框组 / 单选框组
- 属性面板：尺寸（10–32px）、选项增删、默认选中
- 复选框：多项可同时选中；单选框：互斥选中
- 画布双击切换/选中；选中项层级高于相邻项
- 参与方颜色、位置、必填、复制粘贴

## 关键 data-* 契约

| 区域 | 属性 |
|------|------|
| 调色板 | `data-field-type="checkbox|radio"` |
| 画布组 | `data-checkbox-group` / `data-radio-group` |
| 选项项 | `data-checkbox-item` / `data-radio-item` |
| 设置 | `data-field-checkbox-options`、`data-field-checkbox-size`、`data-field-radio-options`、`data-field-radio-size` |
| 属性面板 | `data-props-section="checkbox|radio"`、`data-props-checkbox-*`、`data-props-radio-*` |

## 源文件维护

- 演示页：`pages/envelope-control-settings-demo.html`
- 逻辑与样式：`pages/envelope-editor.js`、`pages/envelope-editor.css`
- 更新后运行：`bash scripts/export-envelope-control-settings-standalone.sh`
