#!/usr/bin/env python3
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "ui-kit.html"
html = path.read_text(encoding="utf-8")
start = html.index('    <aside class="ns-kit-nav"')
end = html.index('    </aside>', start) + len('    </aside>')

new_nav = r'''    <aside class="ns-kit-nav" id="kit-nav" aria-label="组件目录">
      <motion class="ns-kit-nav__head">
        <a class="ns-kit-nav__brand" href="#overview" data-panel="overview">Notasign UI Kit</a>
      </motion>
      <nav class="ns-kit-nav__body" id="kit-nav-body">
        <motion class="ns-kit-nav__block">
          <ul class="ns-kit-nav__list">
            <li><a class="ns-kit-nav__link ns-kit-nav__link--overview" href="#overview" data-panel="overview">Overview 总览</a></li>
          </ul>
        </motion>
        <motion class="ns-kit-nav__block">
          <h2 class="ns-kit-nav__category">基本元素</h2>
          <ul class="ns-kit-nav__list">
            <li><a class="ns-kit-nav__link" href="#colors" data-panel="colors">Colors 色彩</a></li>
            <li><a class="ns-kit-nav__link" href="#typography" data-panel="typography">Typography 字体</a></li>
            <li><a class="ns-kit-nav__link" href="#spacing-scale" data-panel="spacing-scale">Spacing 间距</a></li>
            <li><a class="ns-kit-nav__link" href="#radius" data-panel="radius">Radius 圆角</a></li>
            <li><a class="ns-kit-nav__link" href="#shadows" data-panel="shadows">Shadow 阴影</a></li>
            <li><a class="ns-kit-nav__link" href="#icons" data-panel="icons">Icons 图标</a></li>
          </ul>
        </motion>
        <motion class="ns-kit-nav__block">
          <h2 class="ns-kit-nav__category">基础组件</h2>
          <motion class="ns-kit-nav__section">
            <h3 class="ns-kit-nav__section-title"><span>通用</span></h3>
            <ul class="ns-kit-nav__list">
              <li><a class="ns-kit-nav__link" href="#button" data-panel="button">Button 按钮</a></li>
              <li><a class="ns-kit-nav__link" href="#typography-component" data-panel="typography-component">Typography 排版</a></li>
              <li><a class="ns-kit-nav__link" href="#icon-button" data-panel="icon-button">IconButton 图标按钮</a></li>
            </ul>
          </motion>
          <motion class="ns-kit-nav__section">
            <h3 class="ns-kit-nav__section-title"><span>布局</span></h3>
            <ul class="ns-kit-nav__list">
              <li><a class="ns-kit-nav__link" href="#topbar" data-panel="topbar">TopBar 顶栏</a></li>
              <li><a class="ns-kit-nav__link" href="#sidebar-menu" data-panel="sidebar-menu">Sidebar 侧栏</a></li>
            </ul>
          </motion>
          <motion class="ns-kit-nav__section">
            <h3 class="ns-kit-nav__section-title"><span>导航</span></h3>
            <ul class="ns-kit-nav__list">
              <li><a class="ns-kit-nav__link" href="#breadcrumb" data-panel="breadcrumb">Breadcrumb 面包屑</a></li>
              <li><a class="ns-kit-nav__link" href="#pagination" data-panel="pagination">Pagination 分页</a></li>
              <li><a class="ns-kit-nav__link" href="#steps" data-panel="steps">Steps 步骤条</a></li>
              <li><a class="ns-kit-nav__link" href="#tabs" data-panel="tabs">Tabs 标签页</a></li>
              <li><a class="ns-kit-nav__link" href="#dropdown" data-panel="dropdown">Dropdown 下拉菜单</a></li>
            </ul>
          </motion>
          <motion class="ns-kit-nav__section">
            <h3 class="ns-kit-nav__section-title"><span>数据录入</span></h3>
            <ul class="ns-kit-nav__list">
              <li><a class="ns-kit-nav__link" href="#input" data-panel="input">Input 输入框</a></li>
              <li><a class="ns-kit-nav__link" href="#textarea" data-panel="textarea">Textarea 多行输入</a></li>
              <li><a class="ns-kit-nav__link" href="#select" data-panel="select">Select 选择器</a></li>
              <li><a class="ns-kit-nav__link" href="#input-number" data-panel="input-number">InputNumber 数字输入</a></li>
              <li><a class="ns-kit-nav__link" href="#radio" data-panel="radio">Radio 单选框</a></li>
              <li><a class="ns-kit-nav__link" href="#checkbox" data-panel="checkbox">Checkbox 复选框</a></li>
              <li><a class="ns-kit-nav__link" href="#switch" data-panel="switch">Switch 开关</a></li>
              <li><a class="ns-kit-nav__link" href="#datepicker" data-panel="datepicker">DatePicker 日期选择</a></li>
              <li><a class="ns-kit-nav__link" href="#upload" data-panel="upload">Upload 上传</a></li>
            </ul>
          </motion>
          <motion class="ns-kit-nav__section">
            <h3 class="ns-kit-nav__section-title"><span>数据展示</span></h3>
            <ul class="ns-kit-nav__list">
              <li><a class="ns-kit-nav__link" href="#form" data-panel="form">Form 表单</a></li>
              <li><a class="ns-kit-nav__link" href="#table" data-panel="table">Table 表格</a></li>
              <li><a class="ns-kit-nav__link" href="#list" data-panel="list">List 列表</a></li>
              <li><a class="ns-kit-nav__link" href="#card" data-panel="card">Card 卡片</a></li>
              <li><a class="ns-kit-nav__link" href="#avatar" data-panel="avatar">Avatar 头像</a></li>
              <li><a class="ns-kit-nav__link" href="#tag" data-panel="tag">Tag 标签</a></li>
              <li><a class="ns-kit-nav__link" href="#badge" data-panel="badge">Badge 徽标</a></li>
              <li><a class="ns-kit-nav__link" href="#collapse" data-panel="collapse">Collapse 折叠面板</a></li>
              <li><a class="ns-kit-nav__link" href="#tooltip" data-panel="tooltip">Tooltip 文字提示</a></li>
              <li><a class="ns-kit-nav__link" href="#tree" data-panel="tree">Tree 树形控件</a></li>
            </ul>
          </motion>
          <motion class="ns-kit-nav__section">
            <h3 class="ns-kit-nav__section-title"><span>反馈</span></h3>
            <ul class="ns-kit-nav__list">
              <li><a class="ns-kit-nav__link" href="#alert" data-panel="alert">Alert 警告提示</a></li>
              <li><a class="ns-kit-nav__link" href="#message" data-panel="message">Message 全局提示</a></li>
              <li><a class="ns-kit-nav__link" href="#modal" data-panel="modal">Modal 对话框</a></li>
              <li><a class="ns-kit-nav__link" href="#drawer" data-panel="drawer">Drawer 抽屉</a></li>
              <li><a class="ns-kit-nav__link" href="#popover" data-panel="popover">Popover 气泡</a></li>
              <li><a class="ns-kit-nav__link" href="#popconfirm" data-panel="popconfirm">Popconfirm 确认框</a></li>
              <li><a class="ns-kit-nav__link" href="#spin" data-panel="spin">Spin 加载中</a></li>
              <li><a class="ns-kit-nav__link" href="#skeleton" data-panel="skeleton">Skeleton 骨架屏</a></li>
              <li><a class="ns-kit-nav__link" href="#empty" data-panel="empty">Empty 空状态</a></li>
              <li><a class="ns-kit-nav__link" href="#result" data-panel="result">Result 结果页</a></li>
            </ul>
          </motion>
        </motion>
        <motion class="ns-kit-nav__block">
          <h2 class="ns-kit-nav__category">业务组件</h2>
          <ul class="ns-kit-nav__list">
            <li><a class="ns-kit-nav__link" href="#business" data-panel="business">Business 业务组件</a></li>
          </ul>
        </motion>
      </nav>
    </aside>'''

new_nav = new_nav.replace("<motion", "<motion").replace("</motion>", "</motion>")
# STOP - I keep writing motion in the file. Use only div in the raw string.
