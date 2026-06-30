/**
 * Notasign UI Kit — 单页面板路由 + 右侧本篇目录
 */
(function () {
  var DEFAULT_PANEL = "overview";

  var docFrame = document.getElementById("kit-doc-frame");
  var viewport = document.getElementById("kit-viewport");
  var anchorAside = document.getElementById("kit-anchor");
  var anchorNav = document.getElementById("kit-anchor-nav");
  var panels = document.querySelectorAll(".ns-kit-panel");

  var anchorObserver = null;
  var anchorClickLock = false;

  function markAnchorTarget(el) {
    if (!el) return;
    el.classList.add("ns-kit-anchor-target");
  }

  function setDocTocVisible(visible) {
    if (docFrame) docFrame.classList.toggle("has-doc-toc", visible);
    if (!anchorAside) return;
    if (visible) {
      anchorAside.removeAttribute("hidden");
    } else {
      anchorAside.setAttribute("hidden", "");
    }
  }

  function buildAnchorNav(panel) {
    if (!anchorNav || !panel) return;

    if (panel.classList.contains("ns-kit-panel--page-preview")) {
      setDocTocVisible(false);
      anchorNav.innerHTML = "";
      if (anchorObserver) {
        anchorObserver.disconnect();
        anchorObserver = null;
      }
      return;
    }

    setDocTocVisible(false);
    anchorNav.innerHTML = "";
    if (anchorObserver) {
      anchorObserver.disconnect();
      anchorObserver = null;
    }

    var entries = [];

    var h1 = panel.querySelector(".ns-kit-page-header h1, .ns-text-page-title");
    if (h1) {
      var overviewId = panel.id + "-anchor-overview";
      if (!h1.id) h1.id = overviewId;
      markAnchorTarget(h1);
      entries.push({ level: 1, text: "概述", id: h1.id });
    }

    panel.querySelectorAll(".ns-kit-catalog__group").forEach(function (group, i) {
      var titleEl = group.querySelector(".ns-kit-catalog__group-title");
      if (!titleEl) return;
      var id = panel.id + "-anchor-catalog-" + i;
      group.id = id;
      markAnchorTarget(group);
      entries.push({ level: 1, text: titleEl.textContent.trim(), id: id });
    });

    var demos = panel.querySelectorAll(".ns-kit-demo");
    var demoLabels = [];
    demos.forEach(function (demo, i) {
      var labelEl = demo.querySelector(".ns-kit-demo__label");
      if (!labelEl) return;
      var demoId = panel.id + "-anchor-demo-" + i;
      demo.id = demoId;
      markAnchorTarget(demo);
      demoLabels.push({ text: labelEl.textContent.trim(), id: demoId });
    });

    if (demoLabels.length > 1) {
      entries.push({ level: 1, text: "演示区块", id: null, isGroup: true });
      demoLabels.forEach(function (item) {
        entries.push({ level: 2, text: item.text, id: item.id });
      });
    } else if (demoLabels.length === 1) {
      entries.push({ level: 1, text: demoLabels[0].text, id: demoLabels[0].id });
    }

    if (!entries.length) {
      setDocTocVisible(false);
      return;
    }

    renderAnchorList(entries);
    setDocTocVisible(true);
    bindAnchorLinks();
    initAnchorSpy(entries);
  }

  function renderAnchorList(entries) {
    var list = document.createElement("ul");
    list.className = "ns-kit-anchor__list";
    list._currentSublist = null;

    entries.forEach(function (entry) {
      if (entry.isGroup) {
        var groupLi = document.createElement("li");
        groupLi.className = "ns-kit-anchor__item";
        var groupSpan = document.createElement("span");
        groupSpan.className = "ns-kit-anchor__link ns-kit-anchor__link--group";
        groupSpan.textContent = entry.text;
        groupLi.appendChild(groupSpan);

        var sub = document.createElement("ul");
        sub.className = "ns-kit-anchor__sublist";
        groupLi.appendChild(sub);
        list.appendChild(groupLi);
        list._currentSublist = sub;
        return;
      }

      var li = document.createElement("li");
      li.className =
        entry.level === 2 ? "ns-kit-anchor__item ns-kit-anchor__item--child" : "ns-kit-anchor__item";

      if (entry.id) {
        var a = document.createElement("a");
        a.className = "ns-kit-anchor__link";
        a.href = "#";
        a.textContent = entry.text;
        a.setAttribute("data-anchor-id", entry.id);
        li.appendChild(a);
      } else {
        var span = document.createElement("span");
        span.className = "ns-kit-anchor__link ns-kit-anchor__link--group";
        span.textContent = entry.text;
        li.appendChild(span);
      }

      if (entry.level === 2 && list._currentSublist) {
        list._currentSublist.appendChild(li);
      } else {
        list._currentSublist = null;
        list.appendChild(li);
      }
    });

    anchorNav.appendChild(list);
  }

  function setActiveAnchorLink(id) {
    if (!anchorNav) return;
    anchorNav.querySelectorAll(".ns-kit-anchor__link[data-anchor-id]").forEach(function (link) {
      var active = link.getAttribute("data-anchor-id") === id;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function bindAnchorLinks() {
    if (!anchorNav) return;
    anchorNav.querySelectorAll(".ns-kit-anchor__link[data-anchor-id]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var id = link.getAttribute("data-anchor-id");
        var target = document.getElementById(id);
        if (!target || !viewport) return;
        anchorClickLock = true;
        setActiveAnchorLink(id);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(function () {
          anchorClickLock = false;
        }, 600);
      });
    });
  }

  function initAnchorSpy(entries) {
    if (!viewport) return;

    var targets = entries
      .filter(function (entry) {
        return entry.id;
      })
      .map(function (entry) {
        return document.getElementById(entry.id);
      })
      .filter(Boolean);

    if (!targets.length) return;

    anchorObserver = new IntersectionObserver(
      function (observations) {
        if (anchorClickLock) return;
        var visible = observations
          .filter(function (o) {
            return o.isIntersecting;
          })
          .sort(function (a, b) {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });
        if (visible.length) {
          setActiveAnchorLink(visible[0].target.id);
        }
      },
      {
        root: viewport,
        rootMargin: "-72px 0px -55% 0px",
        threshold: [0, 0.1, 0.5, 1],
      }
    );

    targets.forEach(function (target) {
      anchorObserver.observe(target);
    });
  }

  function setActive(panelId) {
    var id = panelId || DEFAULT_PANEL;
    var found = false;
    var activeLink = null;
    var activePanel = null;

    panels.forEach(function (panel) {
      var isActive = panel.id === "panel-" + id;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
      if (isActive) {
        found = true;
        activePanel = panel;
      }
    });

    if (!found && panels.length) {
      activePanel = document.getElementById("panel-" + DEFAULT_PANEL);
      if (activePanel) {
        activePanel.classList.add("is-active");
        activePanel.hidden = false;
        id = DEFAULT_PANEL;
      }
    }

    document.querySelectorAll("[data-panel]").forEach(function (link) {
      var active = link.getAttribute("data-panel") === id;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
        if (!activeLink || link.closest(".ns-kit-nav")) activeLink = link;
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (activeLink && activeLink.closest(".ns-kit-nav")) {
      activeLink.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    if (activePanel) {
      document.title = (activePanel.getAttribute("data-title") || "Notasign UI Kit") + " — Notasign UI Kit";
      buildAnchorNav(activePanel);
      window.requestAnimationFrame(function () {
        if (window.NotaSignComponents && window.NotaSignComponents.refreshTabs) {
          window.NotaSignComponents.refreshTabs(activePanel);
        }
      });
      if (viewport) {
        viewport.scrollTop = 0;
      }
    }

    if (history.replaceState) {
      history.replaceState(null, "", "#" + id);
    } else {
      location.hash = id;
    }
  }

  function initFromHash() {
    var hash = (location.hash || "").replace(/^#/, "");
    if (!hash) {
      setActive(DEFAULT_PANEL);
      return;
    }
    if (document.getElementById("panel-" + hash)) {
      setActive(hash);
    }
  }

  function annotateFoundationStatus() {
    var foundationBlock = Array.prototype.slice.call(document.querySelectorAll(".ns-kit-nav__block")).find(function (block) {
      var category = block.querySelector(".ns-kit-nav__category");
      return category && category.textContent.trim() === "基础组件";
    });
    if (!foundationBlock) return;

    foundationBlock.querySelectorAll(".ns-kit-nav__link[data-panel]").forEach(function (link) {
      var panelId = link.getAttribute("data-panel");
      var status =
        panelId === "tabs" ||
        panelId === "button" ||
        panelId === "input" ||
        panelId === "select" ||
        panelId === "checkbox" ||
        panelId === "input-number" ||
        panelId === "tooltip" ||
        panelId === "fixed-action-footer" ||
        panelId === "table" ||
        panelId === "pagination"
          ? "ready"
          : "pending";
      link.setAttribute("data-foundation-status", status);
      if (status === "pending") {
        link.setAttribute("title", "建设中，后续逐步完善");
      }

      var panel = document.getElementById("panel-" + panelId);
      if (panel) panel.setAttribute("data-foundation-status", status);
    });
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest("[data-panel]");
    if (!link) return;
    e.preventDefault();
    setActive(link.getAttribute("data-panel"));
  });

  var CATALOG_PREVIEW_PANELS = {
    button: true,
    colors: true,
    typography: true,
    "typography-component": true,
    icons: true,
    input: true,
    textarea: true,
    select: true,
    table: true,
    modal: true,
    tabs: true,
    switch: true,
    "business-topbar": true,
    "business-signing-footer": true,
  };

  var CATALOG_RELATIONS = {
    checkbox: "关联：发送设置、控件拖拽编辑；用于设置项与控件属性必填项",
    "input-number": "关联：发送设置；用于签署期限、强制阅读秒数",
    tooltip: "关联：发送设置；用于电子印章、e-Meterai、强制阅读说明",
    "fixed-action-footer": "关联：发送设置；用于底部保存操作栏",
    "business-sidebar": "关联：签署列表、发送设置；签署侧栏 / 管理侧栏两种形态",
    "send-settings": "组合：Sidebar 业务组件；Checkbox、InputNumber、Text Help Tip、Fixed Action Footer",
    "envelope-settings": "组合：Upload、Input、Select、Checkbox、Switch；用于创建信封与收件人配置",
    "envelope-editor": "组合：Button、Checkbox、Select；控件拖放、参与方颜色、PDF 画布、属性浮窗",
  };

  function parseNavLinkLabel(text) {
    var t = (text || "").trim();
    var match = t.match(/^(\S+)\s+(.+)$/);
    if (match) return { en: match[1], zh: match[2], full: t };
    return { en: t, zh: "", full: t };
  }

  function createCatalogCard(navLink) {
    var panelId = navLink.getAttribute("data-panel");
    if (!panelId || panelId === "overview") return null;

    var label = parseNavLinkLabel(navLink.textContent);
    var card = document.createElement("a");
    card.className = "ns-kit-catalog-card";
    card.href = "#" + panelId;
    card.setAttribute("data-panel", panelId);
    var relation = CATALOG_RELATIONS[panelId] || "";
    card.setAttribute("data-search", (label.full + " " + relation).toLowerCase());
    if (navLink.hasAttribute("data-foundation-status")) {
      card.setAttribute("data-foundation-status", navLink.getAttribute("data-foundation-status"));
    }

    var head = document.createElement("div");
    head.className = "ns-kit-catalog-card__head";
    var en = document.createElement("span");
    en.className = "ns-kit-catalog-card__en";
    en.textContent = label.en;
    head.appendChild(en);
    if (label.zh) {
      var zh = document.createElement("span");
      zh.className = "ns-kit-catalog-card__zh";
      zh.textContent = label.zh;
      head.appendChild(zh);
    }
    if (card.getAttribute("data-foundation-status") === "pending") {
      var status = document.createElement("span");
      status.className = "ns-kit-catalog-card__status";
      status.textContent = "建设中";
      head.appendChild(status);
    }
    card.appendChild(head);

    var art = document.createElement("div");
    art.className = "ns-kit-catalog-card__art ns-kit-catalog-card__art--" + panelId;
    if (!CATALOG_PREVIEW_PANELS[panelId]) {
      art.classList.add("ns-kit-catalog-card__art--default");
    }
    art.setAttribute("aria-hidden", "true");
    card.appendChild(art);

    if (relation) {
      var relationEl = document.createElement("p");
      relationEl.className = "ns-kit-catalog-card__relation";
      relationEl.textContent = relation;
      card.appendChild(relationEl);
    }

    return card;
  }

  function appendCatalogGroup(container, title, navLinks) {
    var items = [];
    navLinks.forEach(function (link) {
      var card = createCatalogCard(link);
      if (card) items.push(card);
    });
    if (!items.length) return;

    var group = document.createElement("section");
    group.className = "ns-kit-catalog__group";

    var head = document.createElement("div");
    head.className = "ns-kit-catalog__group-head";

    var heading = document.createElement("h2");
    heading.className = "ns-kit-catalog__group-title";
    heading.textContent = title;

    var count = document.createElement("span");
    count.className = "ns-kit-catalog__group-count";
    count.textContent = String(items.length);

    head.appendChild(heading);
    head.appendChild(count);
    group.appendChild(head);

    var grid = document.createElement("ul");
    grid.className = "ns-kit-catalog__grid";
    items.forEach(function (card) {
      var li = document.createElement("li");
      li.appendChild(card);
      grid.appendChild(li);
    });
    group.appendChild(grid);
    container.appendChild(group);
  }

  function buildComponentCatalog() {
    var container = document.getElementById("kit-catalog-groups");
    var navBody = document.getElementById("kit-nav-body");
    if (!container || !navBody) return;

    container.innerHTML = "";

    navBody.querySelectorAll(".ns-kit-nav__block").forEach(function (block) {
      var categoryEl = block.querySelector(".ns-kit-nav__category");
      var sections = block.querySelectorAll(":scope > .ns-kit-nav__section");

      if (sections.length) {
        sections.forEach(function (section) {
          var titleSpan = section.querySelector(".ns-kit-nav__section-title span");
          var title = titleSpan ? titleSpan.textContent.trim() : "未分类";
          var links = section.querySelectorAll(".ns-kit-nav__link[data-panel]");
          appendCatalogGroup(container, title, links);
        });
        return;
      }

      var links = block.querySelectorAll(
        ":scope > .ns-kit-nav__list .ns-kit-nav__link[data-panel]:not([data-panel='overview'])"
      );
      if (!links.length) return;

      var title = categoryEl ? categoryEl.textContent.trim() : "其他";
      appendCatalogGroup(container, title, links);
    });

  }

  function initCatalogSearch() {
    var input = document.getElementById("kit-catalog-search");
    var groupsRoot = document.getElementById("kit-catalog-groups");
    var emptyEl = document.getElementById("kit-catalog-empty");
    if (!input || !groupsRoot) return;

    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var visibleCards = 0;

      groupsRoot.querySelectorAll(".ns-kit-catalog__group").forEach(function (group) {
        var groupVisible = 0;
        group.querySelectorAll(".ns-kit-catalog-card").forEach(function (card) {
          var hay = card.getAttribute("data-search") || "";
          var show = !q || hay.indexOf(q) !== -1;
          card.classList.toggle("is-hidden", !show);
          if (show) groupVisible += 1;
        });
        group.classList.toggle("is-hidden", groupVisible === 0);
        if (groupVisible) visibleCards += groupVisible;
      });

      if (emptyEl) {
        emptyEl.hidden = visibleCards > 0 || !q;
      }
    });
  }

  function initDropdownButtonDemos() {
    document.querySelectorAll("[data-ns-dropdown-button-demo]").forEach(function (wrap) {
      var trigger = wrap.querySelector("[data-flyout-trigger]");
      var flyout = wrap.querySelector("[data-flyout]");
      if (!trigger || !flyout || wrap.getAttribute("data-ns-dropdown-ready") === "true") return;

      function open() {
        wrap.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        flyout.removeAttribute("hidden");
      }

      function close() {
        wrap.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        flyout.setAttribute("hidden", "");
      }

      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (wrap.classList.contains("is-open")) {
          close();
        } else {
          open();
        }
      });

      flyout.addEventListener("click", function (e) {
        if (e.target.closest('[role="menuitem"]')) {
          e.preventDefault();
          close();
        }
      });

      document.addEventListener("click", function (e) {
        if (!wrap.contains(e.target)) close();
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") close();
      });

      wrap.setAttribute("data-ns-dropdown-ready", "true");
    });
  }

  function initPaginationDemos() {
    document.querySelectorAll("[data-ns-pagination-demo]").forEach(function (root) {
      if (!window.NotaSignComponents || !window.NotaSignComponents.renderPagination) return;
      root.innerHTML = window.NotaSignComponents.renderPagination({
        assetBase: "pages/assets/signing-list",
        total: 99,
        pageSize: Number(root.getAttribute("data-page-size") || 10),
        currentPage: Number(root.getAttribute("data-current-page") || 1),
        pageSizes: [10, 20, 30],
      });
      if (window.NotaSignComponents.initPagination) {
        window.NotaSignComponents.initPagination(root);
      }
      if (root.getAttribute("data-ns-pagination-demo-ready") === "true") return;
      root.addEventListener("notasign:paginationchange", function (event) {
        var detail = event.detail || {};
        root.setAttribute("data-page-size", String(detail.pageSize || 10));
        root.setAttribute("data-current-page", String(detail.currentPage || 1));
        initPaginationDemos();
      });
      root.setAttribute("data-ns-pagination-demo-ready", "true");
    });
  }

  function initResizableDemos() {
    document.querySelectorAll(".ns-kit-demo--sidebar-preview, .ns-kit-demo--signing-table-preview").forEach(function (demo) {
      if (demo.getAttribute("data-ns-resizable-demo-ready") === "true") return;

      var handle = document.createElement("div");
      handle.className = "ns-kit-demo-resize-handle";
      handle.setAttribute("role", "separator");
      handle.setAttribute("aria-orientation", "horizontal");
      handle.setAttribute("aria-label", "拖动调整预览高度");
      handle.setAttribute("tabindex", "0");
      demo.appendChild(handle);

      function clamp(value) {
        var styles = window.getComputedStyle(demo);
        var min = parseFloat(styles.minHeight) || 240;
        var max = parseFloat(styles.maxHeight) || 1000;
        return Math.max(min, Math.min(max, value));
      }

      function setHeight(value) {
        demo.style.height = clamp(value) + "px";
      }

      function startDrag(event) {
        if (event.button != null && event.button !== 0) return;
        event.preventDefault();

        var startY = event.clientY;
        var startHeight = demo.getBoundingClientRect().height;
        demo.classList.add("is-resizing");
        document.body.style.cursor = "ns-resize";
        document.body.style.userSelect = "none";

        function onMove(moveEvent) {
          setHeight(startHeight + moveEvent.clientY - startY);
        }

        function onUp() {
          demo.classList.remove("is-resizing");
          document.body.style.removeProperty("cursor");
          document.body.style.removeProperty("user-select");
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        }

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      }

      function onKeydown(event) {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        event.preventDefault();
        var delta = event.key === "ArrowUp" ? -24 : 24;
        setHeight(demo.getBoundingClientRect().height + delta);
      }

      handle.addEventListener("mousedown", startDrag);
      handle.addEventListener("keydown", onKeydown);
      demo.setAttribute("data-ns-resizable-demo-ready", "true");
    });
  }

  function initIndeterminateChecks(root) {
    (root || document).querySelectorAll(".ns-check__input[data-indeterminate]").forEach(function (input) {
      if (input.getAttribute("data-ns-indeterminate-ready") === "true") return;

      input.indeterminate = true;
      input.addEventListener("change", function () {
        input.indeterminate = false;
      });

      input.setAttribute("data-ns-indeterminate-ready", "true");
    });
  }

  window.addEventListener("hashchange", initFromHash);
  annotateFoundationStatus();
  buildComponentCatalog();
  if (window.NotaSignComponents && window.NotaSignComponents.initTabs) {
    window.NotaSignComponents.initTabs(document);
  }
  if (window.NotaSignComponents && window.NotaSignComponents.initInputClearButtons) {
    window.NotaSignComponents.initInputClearButtons(document);
  }
  if (window.NotaSignComponents && window.NotaSignComponents.initSelects) {
    window.NotaSignComponents.initSelects(document);
  }
  initIndeterminateChecks(document);
  if (window.NotaSignComponents && window.NotaSignComponents.initInputNumbers) {
    window.NotaSignComponents.initInputNumbers(document);
  }
  initPaginationDemos();
  window.addEventListener("notasign:languagechange", function () {
    if (window.NotaSignComponents && window.NotaSignComponents.initTabs) {
      window.NotaSignComponents.initTabs(document);
    }
    if (window.NotaSignComponents && window.NotaSignComponents.initSelects) {
      window.NotaSignComponents.initSelects(document);
    }
    initIndeterminateChecks(document);
    initPaginationDemos();
  });
  initCatalogSearch();
  initDropdownButtonDemos();
  initResizableDemos();
  initFromHash();
})();
