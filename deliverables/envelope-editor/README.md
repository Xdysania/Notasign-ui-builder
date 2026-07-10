# 控件拖拽编辑器 — 独立交付包

信封编辑器完整典型页（`pages/envelope-editor.*`）的原样副本，供前端开发参考与集成。

**说明：** 本目录由导出脚本自动生成，页面结构与交互逻辑与源文件一致，仅调整了静态资源相对路径，便于独立运行。

## 本地预览

```bash
cd deliverables/envelope-editor
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## 目录说明

| 文件/目录 | 说明 |
|-----------|------|
| `index.html` | 页面入口（对应 `pages/envelope-editor.html`） |
| `envelope-editor.css` | 页面样式 |
| `envelope-editor.js` | 页面交互逻辑 |
| `handwrite-modal.css` / `handwrite-modal.js` | 手绘弹窗样式与交互 |
| `notasign-design-system.css` | 设计系统基础样式 |
| `components/` | Select、InputNumber、i18n |
| `assets/envelope-editor/` | 编辑器图标 |
| `assets/signing-list/` | 帮助、下拉箭头等共用图标 |

## 源文件维护

- 开发维护路径：`pages/envelope-editor.html`、`pages/envelope-editor.css`、`pages/envelope-editor.js`、`pages/handwrite-modal.*`
- 更新交付包：`bash scripts/export-envelope-editor-standalone.sh`
