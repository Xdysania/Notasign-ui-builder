/**
 * 签署列表典型页 — 顶栏/侧栏/表格更多 浮层 hover / focus 交互
 */
(function () {

  function initFlyoutWraps() {
    document.querySelectorAll(".ns-app__flyout-wrap").forEach(function (wrap) {
      if (wrap.getAttribute("data-ns-table-more-ready") === "true") return;
      var trigger = wrap.querySelector("[data-flyout-trigger]");
      var flyout = wrap.querySelector("[data-flyout]");
      if (!trigger || !flyout) return;

      var closeTimer = null;
      var isClickOnly = trigger.getAttribute("data-flyout-trigger") === "table-more";

      function cancelClose() {
        if (closeTimer) {
          window.clearTimeout(closeTimer);
          closeTimer = null;
        }
      }

      function open() {
        cancelClose();
        wrap.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        flyout.removeAttribute("hidden");
      }

      function close() {
        wrap.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        flyout.setAttribute("hidden", "");
      }

      function isPointerInside() {
        return wrap.matches(":hover") || flyout.matches(":hover");
      }

      function scheduleClose() {
        if (closeTimer) window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(function () {
          closeTimer = null;
          if (!isPointerInside()) close();
        }, 50);
      }

      function onPointerLeave(e) {
        var next = e.relatedTarget;
        if (next && (wrap.contains(next) || flyout.contains(next))) return;
        scheduleClose();
      }

      if (isClickOnly) {
        trigger.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (wrap.classList.contains("is-open")) {
            close();
          } else {
            open();
          }
        });

        document.addEventListener("click", function (e) {
          if (!wrap.contains(e.target)) close();
        }, true);

        wrap.addEventListener("mouseenter", cancelClose);
        flyout.addEventListener("mouseenter", cancelClose);
      } else {
        wrap.addEventListener("mouseenter", open);
        flyout.addEventListener("mouseenter", open);
        wrap.addEventListener("focusin", open);

        wrap.addEventListener("mouseleave", onPointerLeave);
        flyout.addEventListener("mouseleave", onPointerLeave);

        wrap.addEventListener("focusout", function (e) {
          if (!wrap.contains(e.relatedTarget)) scheduleClose();
        });
      }
    });
  }

  function initPageComponents() {
    if (window.NotaSignComponents && window.NotaSignComponents.initTabs) {
      window.NotaSignComponents.initTabs(document);
    }
    initFlyoutWraps();
    if (window.NotaSignComponents && window.NotaSignComponents.initInputClearButtons) {
      window.NotaSignComponents.initInputClearButtons(document);
    }
    if (window.NotaSignComponents && window.NotaSignComponents.initSelects) {
      window.NotaSignComponents.initSelects(document);
    }
  }

  initPageComponents();
  window.addEventListener("notasign:languagechange", initPageComponents);
})();
