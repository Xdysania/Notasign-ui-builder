/**
 * 发送设置典型页 — 顶栏/侧栏/选择器/数字输入交互
 */
(function () {
  function initForceReadToggle(root) {
    root.querySelectorAll("[data-force-read-toggle]").forEach(function (toggle) {
      if (toggle.getAttribute("data-force-read-toggle-ready") === "true") return;
      var targetId = toggle.getAttribute("aria-controls");
      var options = targetId ? document.getElementById(targetId) : root.querySelector("[data-force-read-options]");
      if (!options) return;

      function sync() {
        if (toggle.checked) {
          options.removeAttribute("hidden");
        } else {
          options.setAttribute("hidden", "");
        }
      }

      toggle.addEventListener("change", sync);
      sync();
      toggle.setAttribute("data-force-read-toggle-ready", "true");
    });
  }

  function initPageComponents() {
    if (window.NotaSignComponents && window.NotaSignComponents.initTabs) {
      window.NotaSignComponents.initTabs(document);
    }
    if (window.NotaSignComponents && window.NotaSignComponents.initSelects) {
      window.NotaSignComponents.initSelects(document);
    }
    initForceReadToggle(document);
    if (window.NotaSignComponents && window.NotaSignComponents.initInputNumbers) {
      window.NotaSignComponents.initInputNumbers(document);
    }
  }

  initPageComponents();
  window.addEventListener("notasign:languagechange", initPageComponents);
})();
