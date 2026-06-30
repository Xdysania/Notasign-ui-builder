# Components Index

这是 NotaSign **组件字典**（辅助索引），不是规范主入口。

- **主入口**：[notasign-spec-usage.md](./notasign-spec-usage.md)（怎么用规范）
- **组件长什么样**：[ui-kit.html](../ui-kit.html)（DOM 与视觉 SSOT）
- **AI 生成流程**：[.cursor/skills/notasign-ui-architect/SKILL.md](../.cursor/skills/notasign-ui-architect/SKILL.md)

生成页面时以 `ui-kit.html` 可见示例和 `notasign-design-system.css` 为准；本文件用于快速查 class、`data-*` 与 JS 依赖。

## Foundation Components

### Button

- Source: `notasign-design-system.css`, `ui-kit.html#button`
- Callable variants: table primary, table muted, dropdown button, filter reset, brand soft, fixed footer primary.
- HTML shape:

```html
<button type="button" class="ns-btn ns-btn--table ns-btn--table-primary">主操作</button>
<button type="button" class="ns-btn ns-btn--table ns-btn--table-muted">次操作</button>
<button type="button" class="ns-btn ns-btn--md ns-btn--brand-soft">配置账号</button>
<button type="button" class="ns-btn ns-btn--lg ns-btn--primary">保存</button>
<button type="button" class="ns-btn ns-btn--lg ns-btn--primary ns-btn--block ns-btn--dropdown">
  <span class="ns-btn__label">发起</span>
  <img class="ns-btn__chevron" src="..." width="16" height="16" alt="" />
</button>
```

- Core classes: `ns-btn`, `ns-btn--table`, `ns-btn--table-primary`, `ns-btn--table-muted`, `ns-btn--dropdown`, `ns-btn--filter-reset`, `ns-btn--brand-soft`, `ns-btn--primary`.
- Data attributes: dropdown demos and sidebar CTA use `data-flyout-trigger`.
- JS dependency: dropdown behavior currently lives in `ui-kit.js` demo code or business component code.
- Notes: pending button matrix examples are reference only and must not be copied into business templates.

### Icon

- Source: `ui-kit.html#icons`, `pages/assets/signing-list/`, `pages/assets/send-settings/`
- Callable assets: `签署列表图标 · Callable Assets` and `发送设置 / 管理侧栏图标 · Callable Assets`.
- HTML shape:

```html
<span class="ns-icon ns-icon--sm" role="img" aria-label="搜索">
  <img class="ns-icon__svg" src="pages/assets/signing-list/icon-search.svg" width="20" height="20" alt="" />
</span>
```

- Core classes: `ns-icon`, `ns-icon--sm`, `ns-icon--md`, `ns-icon--lg`, `ns-icon__svg`.
- Data attributes: icon registry entries expose `data-icon-slug`.
- JS dependency: none.
- Forbidden: `data-callable="false"`, `ns-kit-demo--disabled-library`, `ns-kit-icon-cell--missing`, placeholder icons, and any greyed icon library entries.

### Control Palette

- Source: `notasign-design-system.css`, `pages/envelope-editor.html`
- Callable use case: 签署控件拖拽面板，按参与方颜色渲染浅底控件卡片。
- HTML shape:

```html
<div class="ns-control-palette">
  <p class="ns-control-palette__hint">切换不同签署方，可为他们分别拖放需填写或签署的控件</p>
  <div class="ns-control-palette__list">
    <div class="ns-control-palette__item-wrap">
      <button class="ns-control-palette__item" type="button" draggable="true">
        <img class="ns-control-palette__icon" src="assets/envelope-editor/icon-signature.svg" width="16" height="16" alt="" />
        <span class="ns-control-palette__label">签名</span>
      </button>
    </div>
  </div>
</div>
```

- Core classes: `ns-control-palette`, `ns-control-palette__hint`, `ns-control-palette__list`, `ns-control-palette__item-wrap`, `ns-control-palette__item`, `ns-control-palette__icon`, `ns-control-palette__label`.
- Styling hooks: `--ns-control-palette-bg`, `--ns-control-palette-border`.
- JS dependency: none in the base component; pages may add `data-field-type`, `data-field-label`, `data-field-icon`.

### Tabs

- Source: `components/tabs.js`, `ui-kit.html#tabs`
- Callable variant: topbar tabs.
- HTML shape:

```html
<nav class="ns-tabs ns-tabs--topbar" aria-label="主导航" data-ns-tabs>
  <ul class="ns-tabs__list" role="tablist">
    <li class="ns-tabs__tab" role="presentation">
      <button type="button" class="ns-tabs__button ns-tabs__button--active is-active" role="tab" aria-selected="true">签署</button>
    </li>
  </ul>
</nav>
```

- Core classes: `ns-tabs`, `ns-tabs--topbar`, `ns-tabs__list`, `ns-tabs__tab`, `ns-tabs__button`.
- Data attributes: `data-ns-tabs`; JS sets `data-ns-tabs-ready`.
- JS dependency: `components/tabs.js`.
- Notes: generic tabs examples marked pending are not callable.

### Search Input

- Source: `components/input.js`, `ui-kit.html#input`
- HTML shape:

```html
<div class="ns-input--with-icon ns-input--search">
  <span class="ns-input__prefix" aria-hidden="true">
    <img src="assets/signing-list/icon-search.svg" width="20" height="20" alt="" />
  </span>
  <input class="ns-input" type="search" data-search-input />
  <button class="ns-input__clear" type="button" data-search-clear hidden></button>
</div>
```

- Core classes: `ns-input`, `ns-input--with-icon`, `ns-input--search`, `ns-input__prefix`, `ns-input__clear`.
- Data attributes: `data-search-input`, `data-search-clear`, `data-i18n-placeholder`, `data-i18n-label`.
- JS dependency: `components/input.js`.
- Tokens: `--ns-control-search-width` for list filter search width.

### Input & Textarea

- Source: `notasign-design-system.css`, `ui-kit.html#input`, `ui-kit.html#textarea`
- HTML shape:

```html
<input class="ns-input" type="text" placeholder="请输入" />
<textarea class="ns-input ns-textarea" placeholder="请输入"></textarea>
```

- Core classes: `ns-input`, `ns-input--lg`, `ns-input--error`, `ns-textarea`.
- Related pages: `pages/envelope-editor.html` property panel fields use `ns-input` and `ns-input ns-textarea`; page-local classes only adjust layout widths/heights.
- JS dependency: none for regular input/textarea.

### Select

- Source: `components/select.js`, `ui-kit.html#select`
- HTML shape:

```html
<div class="ns-select" data-ns-select data-value="last-6-months" data-default-value="last-6-months">
  <button type="button" class="ns-select__trigger" aria-haspopup="listbox" aria-expanded="false">
    <span class="ns-select__value">最近6个月发起</span>
    <img class="ns-select__chevron" src="assets/signing-list/icon-select-chevron.svg" width="16" height="16" alt="" />
  </button>
  <div class="ns-select__menu" role="listbox" hidden>
    <button type="button" class="ns-select__option is-selected" role="option" data-value="last-6-months" aria-selected="true">最近6个月发起</button>
  </div>
</div>
```

- Core classes: `ns-select`, `ns-select__trigger`, `ns-select__value`, `ns-select__chevron`, `ns-select__menu`, `ns-select__option`.
- Data attributes: `data-ns-select`, `data-value`, `data-default-value`, `data-placeholder`, `data-placeholder-key`.
- JS dependency: `components/select.js`.
- Tokens: `--ns-control-filter-select-width` for list filter select width.
- Notes: native `<select class="ns-select">` examples are pending and not callable.

### Checkbox

- Source: `notasign-design-system.css`, `ui-kit.html#checkbox`
- HTML shape:

```html
<label class="ns-check">
  <input class="ns-check__input" type="checkbox" checked />
  多选内容
</label>
```

- Core classes: `ns-check`, `ns-check__input`.
- States: unchecked, checked, indeterminate (`input.indeterminate = true`), disabled.
- Spec: control 14x14, text 14/lh22, gap 4.
- JS dependency: none for regular checked/disabled; indeterminate must be set through JavaScript.

### InputNumber

- Source: `notasign-design-system.css`, `ui-kit.html#input-number`
- HTML shape:

```html
<div class="ns-input-number">
  <input class="ns-input-number__input" type="text" inputmode="numeric" value="122" aria-label="数量" />
  <div class="ns-input-number__controls">
    <button type="button" class="ns-input-number__btn ns-input-number__btn--increase" aria-label="增加"></button>
    <button type="button" class="ns-input-number__btn ns-input-number__btn--decrease" aria-label="减少"></button>
  </div>
</div>
```

- Core classes: `ns-input-number`, `ns-input-number__input`, `ns-input-number__controls`, `ns-input-number__btn`.
- Spec: width 180px, height 40px, right stepper 40px, radius 2px, text 14/lh22.
- States: entered, placeholder, disabled.
- JS dependency: `components/input-number.js` via `NotaSignComponents.initInputNumbers`.

### Text Help Tip

- Source: `notasign-design-system.css`, `ui-kit.html#tooltip`
- HTML shape:

```html
<span class="ns-help-tip">
  <button type="button" class="ns-help-tip__trigger" aria-describedby="tip-id">
    <img src="assets/send-settings/icon-info.svg" width="16" height="16" alt="" />
  </button>
  <span class="ns-help-tip__bubble" id="tip-id" role="tooltip">邮箱将用于登录Nota Sign账号</span>
</span>
```

- Core classes: `ns-help-tip`, `ns-help-tip__trigger`, `ns-help-tip__bubble`.
- Spec: trigger area and icon both render 16x16; icon uses reduced default opacity; bubble background `--ns-color-text-table-header`, padding 8px, radius 4px, text 14/lh22, left arrow; bubble follows content width and wraps long text at max 360px.
- Use for field explanations. Do not place bare question-mark icons directly in business pages.
- JS dependency: none; hover and focus are CSS driven.

### Fixed Action Footer

- Source: `notasign-design-system.css`, `ui-kit.html#fixed-action-footer`
- HTML shape:

```html
<footer class="ns-fixed-action-footer">
  <button type="button" class="ns-btn ns-btn--lg ns-btn--primary">保存</button>
  <button type="button" class="ns-btn ns-btn--lg ns-btn--secondary">取消</button>
</footer>
```

- Core classes: `ns-fixed-action-footer`, `ns-fixed-action-footer--right`, `ns-fixed-action-footer--center`.
- Spec: padding 16px 24px, top border 1px, gap 12px, page background.
- Use for page-level bottom actions that stay outside the scrollable content area.
- JS dependency: none.

### Pagination

- Source: `components/pagination.js`, `ui-kit.html#pagination`
- Renderer:

```js
window.NotaSignComponents.renderPagination({
  assetBase: "pages/assets/signing-list",
  total: 99,
  pageSize: 10,
  currentPage: 1,
  pageSizes: [10, 20, 30],
});
```

- Core classes: `ns-app__pagination-bar`, `ns-app__pagination`, `ns-app__pagination-page`, `ns-app__pagination-arrow`, `ns-app__pagination-size`, `ns-app__pagination-jump-input`.
- Data attributes: `data-ns-pagination`, `data-page-size`, `data-current-page`, `data-total`, `data-pagination-prev`, `data-pagination-next`, `data-pagination-page`, `data-pagination-size-trigger`, `data-pagination-size-menu`, `data-pagination-page-size`.
- JS dependency: `components/pagination.js`.
- Event: dispatches `notasign:paginationchange` with `{ pageSize, currentPage }`.

### Table

- Source: `components/signing-table.js`, `notasign-design-system.css`, `pages/signing-list.css`
- Callable shape: signing list table renderer.
- Mount point:

```html
<div data-ns-business-signing-table data-asset-base="assets/signing-list"></div>
```

- Core classes: `ns-table-wrapper`, `ns-signing-table-wrapper`, `ns-table-container`, `ns-table-content`, `ns-table`, `ns-signing-table`, `ns-table-status`, `ns-app__table-more-btn`, `ns-app__flyout--table-more`.
- Data attributes: `data-ns-business-signing-table`, `data-page-size`, `data-current-page`, `data-total`, `data-flyout-trigger="table-more"`, `data-flyout="table-more"`.
- JS dependency: `components/signing-table.js`, `components/pagination.js`, `components/signing-footer.js`.
- Notes: older table demos with `data-foundation-status="pending"` are not callable.

## Business Components

### Topbar

- Source: `components/topbar.js`
- Mount point:

```html
<div data-ns-business-topbar data-active-tab="signing" data-asset-base="assets/signing-list"></div>
```

- Composes: Logo asset, Tabs, help flyout, user menu flyout.
- Core classes: `ns-app__topbar`, `ns-business-topbar`, `ns-app__brand`, `ns-app__main-nav`, `ns-app__help-btn`, `ns-app__user-trigger`, `ns-app__flyout--help`, `ns-app__flyout--user`.
- Data attributes: `data-ns-business-topbar`, `data-active-tab`, `data-asset-base`, `data-topbar-tab`, `data-ns-tabs`, `data-flyout-trigger`, `data-flyout`.
- JS dependency: `components/topbar.js`, `components/tabs.js`, `components/i18n.js`.

### Sidebar

Sidebar has two business variants. Use the variant that matches the page context, but treat both as one sidebar component family in UI Kit.

#### Signing Variant

- Source: `components/signing-sidebar.js`
- Mount point:

```html
<div data-ns-business-signing-sidebar data-active-item="all" data-asset-base="assets/signing-list"></div>
```

- Composes: dropdown button, sidebar nav links, callable signing-list icons.
- Core classes: `ns-app__sidebar`, `ns-business-signing-sidebar`, `ns-app__sidebar-cta-wrap`, `ns-app__sidebar-item`, `ns-app__sidebar-icon`, `ns-app__flyout--sidebar-cta`.
- Data attributes: `data-ns-business-signing-sidebar`, `data-active-item`, `data-asset-base`, `data-sidebar-item`, `data-flyout-trigger="sidebar-cta"`, `data-flyout="sidebar-cta"`.
- JS dependency: `components/signing-sidebar.js`, `components/i18n.js`.

#### Management Variant

- Source: `components/management-sidebar.js`
- Mount point:

```html
<div data-ns-business-management-sidebar data-active-item="send-settings" data-asset-base="assets/send-settings"></div>
```

- Composes: grouped section titles, sidebar links, icons.
- Core classes: `ns-app__sidebar`, `ns-business-management-sidebar`, `ns-app__sidebar-section`, `ns-app__sidebar-section-title`, `ns-app__sidebar-item`, `ns-app__sidebar-icon`.
- Data attributes: `data-ns-business-management-sidebar`, `data-asset-base`, `data-active-item`.
- JS dependency: `components/management-sidebar.js`, `components/i18n.js`.

### Signing Table

- Source: `components/signing-table.js`
- Mount point:

```html
<div data-ns-business-signing-table data-asset-base="assets/signing-list"></div>
```

- Composes: Table, Button, flyout, Pagination, SigningFooter.
- Data attributes: `data-ns-business-signing-table`, `data-asset-base`, `data-page-size`, `data-current-page`, `data-total`.
- Events: listens for `notasign:paginationchange`.
- JS dependency: `components/signing-table.js`, `components/pagination.js`, `components/signing-footer.js`, `components/i18n.js`.

### Signing Footer

- Source: `components/signing-footer.js`
- Mount point:

```html
<div data-ns-business-signing-footer data-asset-base="assets/signing-list"></div>
```

- Core classes: `ns-app__footer`, `ns-app__footer-lang`, `ns-app__flyout--footer-lang`, `ns-app__footer-copy`.
- Data attributes: `data-ns-business-signing-footer`, `data-asset-base`.
- JS dependency: `components/signing-footer.js`, `components/i18n.js`.
- Event: language option triggers `notasign:languagechange`.

## Typical Templates

### Send Settings Page

- Source: `pages/send-settings.html`, `pages/send-settings.css`, `pages/send-settings.js`
- Figma: node `23484:781`
- Dependencies:

```html
<link rel="stylesheet" href="../notasign-design-system.css" />
<link rel="stylesheet" href="send-settings.css" />
<script src="../components/i18n.js" defer></script>
<script src="../components/topbar.js" defer></script>
<script src="../components/management-sidebar.js" defer></script>
<script src="../components/tabs.js" defer></script>
<script src="../components/select.js" defer></script>
<script src="send-settings.js" defer></script>
```

- Mount order: Topbar (`data-nav-profile="admin"`), Sidebar management variant, settings form.
- Page-level classes: `ns-send-settings-page`, `ns-send-settings-form`, `ns-send-settings-form__section`.
- Asset bases: `assets/signing-list` (topbar), `assets/send-settings` (management sidebar).

### Signing List Page

- Source: `pages/signing-list.html`, `pages/signing-list.css`, `pages/signing-list.js`
- Dependencies:

```html
<link rel="stylesheet" href="../notasign-design-system.css" />
<link rel="stylesheet" href="signing-list.css" />
<script src="../components/i18n.js" defer></script>
<script src="../components/topbar.js" defer></script>
<script src="../components/signing-sidebar.js" defer></script>
<script src="../components/tabs.js" defer></script>
<script src="../components/input.js" defer></script>
<script src="../components/select.js" defer></script>
<script src="../components/pagination.js" defer></script>
<script src="../components/signing-table.js" defer></script>
<script src="../components/signing-footer.js" defer></script>
<script src="signing-list.js" defer></script>
```

- Mount order: Topbar, Sidebar signing variant, content filters, SigningTable.
- Page-level classes: `ns-app`, `ns-app__body`, `ns-app__content`, `ns-app__content-head`, `ns-app__filters`, `ns-app__select-wrap`.
- Asset base: `assets/signing-list` from the page, `pages/assets/signing-list` from UI Kit demos.
- List states: see `docs/templates/list-page-states.md`; mount `data-list-state` on table wrapper when implementing loading / empty / error.

## List Feedback (Empty / Spin / Alert)

- Source: `ui-kit.html#empty`, `#spin`, Alert 区块
- Use in list table area only; do not replace page chrome.
- Empty: `div.ns-empty` + `ns-empty__title` + `ns-empty__desc` + optional `ns-btn`
- Loading: `div.ns-spin` + `ns-spin__indicator`
- Error: `div.ns-alert.ns-alert--error` + `ns-alert__title` + `ns-alert__message`
- Callable: yes (documented in UI Kit, not pending)
