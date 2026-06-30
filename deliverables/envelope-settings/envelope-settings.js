/**
 * 信封设置典型页交互
 */
(function () {
  /** Figma 20770:5906 — recipient left accent bar color cycle (10 slots) */
  var ACCENT_SEQUENCE = [
    "lilac",
    "sky",
    "mint",
    "peach",
    "periwinkle",
    "orchid",
    "teal",
    "rose",
    "periwinkle",
    "coral",
  ];
  var INITIAL_RECIPIENT_COUNT = 3;

  function initSelects(root) {
    if (window.NotaSignComponents && window.NotaSignComponents.initSelects) {
      window.NotaSignComponents.initSelects(root || document);
    }
  }

  function initCollapseTriggers(root) {
    (root || document).querySelectorAll("[data-collapse-trigger]").forEach(function (trigger) {
      if (trigger.getAttribute("data-collapse-ready") === "true") return;
      var targetId = trigger.getAttribute("data-collapse-target");
      var target = targetId ? document.getElementById(targetId) : null;
      if (!target) {
        var panel = trigger.parentElement && trigger.parentElement.querySelector(".ns-envelope-settings-subcard__panel");
        if (panel) target = panel;
      }
      if (!target) {
        var verifySection = trigger.closest(".ns-envelope-settings-subcard--verify");
        if (verifySection) target = verifySection.querySelector(".ns-envelope-settings-subcard__body");
      }
      if (!target) {
        var readingSection = trigger.closest(".ns-envelope-settings-subcard--reading");
        if (readingSection) target = readingSection.querySelector(".ns-envelope-settings-subcard__body");
      }
      if (!target) return;

      trigger.addEventListener("click", function () {
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (expanded) {
          target.setAttribute("hidden", "");
        } else {
          target.removeAttribute("hidden");
        }
      });

      trigger.setAttribute("data-collapse-ready", "true");
    });
  }

  function ensureRecipientId(card) {
    if (!card) return "";
    var existing = card.getAttribute("data-recipient-id");
    if (existing) return existing;

    var maxId = 0;
    document.querySelectorAll("[data-recipient-card][data-recipient-id]").forEach(function (item) {
      maxId = Math.max(maxId, parseInt(item.getAttribute("data-recipient-id"), 10) || 0);
    });
    var nextId = String(maxId + 1);
    card.setAttribute("data-recipient-id", nextId);
    return nextId;
  }

  function parseRecipientOrder(input) {
    if (!input) return 1;
    var order = parseInt(String(input.value || "").replace(/\D/g, ""), 10);
    return order > 0 ? order : 1;
  }

  function setRecipientOrderInput(card, order) {
    var input = card && card.querySelector("[data-recipient-index]");
    if (input) input.value = String(order);
  }

  function normalizeRecipientOrderInput(input) {
    if (!input) return 1;
    var order = parseRecipientOrder(input);
    input.value = String(order);
    return order;
  }

  function sortRecipientsByOrder() {
    var list = document.querySelector("[data-recipient-list]");
    if (!list || !list.classList.contains("is-sequential")) return;

    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-recipient-card]"));
    if (cards.length <= 1) return;

    var ranked = cards.map(function (card, index) {
      return {
        card: card,
        order: parseRecipientOrder(card.querySelector("[data-recipient-index]")),
        index: index,
      };
    });

    ranked.sort(function (a, b) {
      if (a.order !== b.order) return a.order - b.order;
      return a.index - b.index;
    });

    ranked.forEach(function (item) {
      list.appendChild(item.card);
    });
  }

  function getMaxRecipientOrder(list, excludeCard) {
    var max = 0;
    if (!list) return max;
    list.querySelectorAll("[data-recipient-card]").forEach(function (card) {
      if (card === excludeCard) return;
      max = Math.max(max, parseRecipientOrder(card.querySelector("[data-recipient-index]")));
    });
    return max;
  }

  function createRecipientCard(withVerify) {
    var cardTemplate = document.getElementById("recipient-card-template");
    var verifyTemplate = document.getElementById("recipient-verify-template");
    if (!cardTemplate) return null;

    var card = cardTemplate.content.cloneNode(true);
    if (withVerify && verifyTemplate) {
      var slot = card.querySelector("[data-recipient-verify-slot]");
      if (slot) {
        slot.appendChild(verifyTemplate.content.cloneNode(true));
      }
    }

    return card;
  }

  function mountRecipients() {
    var list = document.querySelector("[data-recipient-list]");
    if (!list || list.getAttribute("data-recipients-ready") === "true") return;

    list.innerHTML = "";
    for (var i = 0; i < INITIAL_RECIPIENT_COUNT; i++) {
      var card = createRecipientCard(i === 0);
      if (!card) continue;
      list.appendChild(card);
      var mounted = list.lastElementChild;
      if (mounted) setRecipientOrderInput(mounted, i + 1);
    }

    list.setAttribute("data-recipients-ready", "true");
  }

  function updateRecipientIndexes() {
    document.querySelectorAll("[data-recipient-card]").forEach(function (card, index) {
      var recipientId = ensureRecipientId(card);
      var accent = ACCENT_SEQUENCE[index % ACCENT_SEQUENCE.length];
      card.setAttribute("data-accent", accent);
      card.setAttribute("data-recipient-drag-id", recipientId);

      var signatureSection = card.querySelector(".ns-envelope-settings-subcard--signature");
      if (signatureSection) {
        var signatureTargetId = "recipient-" + recipientId + "-signature";
        var signatureToggle = signatureSection.querySelector("[data-collapse-trigger]");
        var signaturePanel = signatureSection.querySelector(".ns-envelope-settings-subcard__body");
        if (signatureToggle) signatureToggle.setAttribute("data-collapse-target", signatureTargetId);
        if (signaturePanel) signaturePanel.id = signatureTargetId;
      }

      var verifySection = card.querySelector(".ns-envelope-settings-subcard--verify");
      if (verifySection) {
        var verifyTargetId = "recipient-" + recipientId + "-verify";
        var verifyToggle = verifySection.querySelector("[data-collapse-trigger]");
        var verifyPanel = verifySection.querySelector(".ns-envelope-settings-subcard__body");
        if (verifyToggle) verifyToggle.setAttribute("data-collapse-target", verifyTargetId);
        if (verifyPanel) verifyPanel.id = verifyTargetId;
      }

      var readingSection = card.querySelector(".ns-envelope-settings-subcard--reading");
      if (readingSection) {
        var readingTargetId = "recipient-" + recipientId + "-reading";
        var readingToggle = readingSection.querySelector("[data-collapse-trigger]");
        var readingPanel = readingSection.querySelector(".ns-envelope-settings-subcard__body");
        if (readingToggle) readingToggle.setAttribute("data-collapse-target", readingTargetId);
        if (readingPanel) readingPanel.id = readingTargetId;
      }

      syncRecipientCustomMenuItems(card);
    });
  }

  function syncRecipientDragState() {
    var list = document.querySelector("[data-recipient-list]");
    var toggle = document.querySelector("[data-sequential-sign-toggle]");
    if (!list) return;
    var enabled = toggle ? toggle.checked : list.classList.contains("is-sequential");
    list.querySelectorAll("[data-recipient-card]").forEach(function (card) {
      card.setAttribute("draggable", enabled ? "true" : "false");
    });
  }

  function moveRecipientCard(card, referenceCard, insertBefore) {
    var list = document.querySelector("[data-recipient-list]");
    if (!list || !card || card === referenceCard) return;

    if (!referenceCard) {
      setRecipientOrderInput(card, getMaxRecipientOrder(list, card) + 1);
      list.appendChild(card);
    } else {
      var targetOrder = parseRecipientOrder(referenceCard.querySelector("[data-recipient-index]"));
      setRecipientOrderInput(card, targetOrder);
      if (insertBefore) list.insertBefore(card, referenceCard);
      else list.insertBefore(card, referenceCard.nextSibling);
    }

    sortRecipientsByOrder();
    updateRecipientIndexes();
  }

  function initRecipientDragReorder() {
    var list = document.querySelector("[data-recipient-list]");
    if (!list || list.getAttribute("data-recipient-drag-ready") === "true") return;

    var draggedCard = null;

    list.addEventListener("dragstart", function (event) {
      if (!list.classList.contains("is-sequential")) return;
      if (!event.target.closest("[data-recipient-drag-handle]")) {
        event.preventDefault();
        return;
      }

      draggedCard = event.target.closest("[data-recipient-card]");
      if (!draggedCard) return;

      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(
        "text/plain",
        draggedCard.getAttribute("data-recipient-drag-id") || ""
      );

      window.requestAnimationFrame(function () {
        draggedCard.classList.add("is-dragging");
      });
    });

    list.addEventListener("dragover", function (event) {
      if (!list.classList.contains("is-sequential") || !draggedCard) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      list.querySelectorAll("[data-recipient-card].is-drag-over").forEach(function (card) {
        card.classList.remove("is-drag-over");
      });

      var targetCard = event.target.closest("[data-recipient-card]");
      if (targetCard && targetCard !== draggedCard) {
        targetCard.classList.add("is-drag-over");
      }
    });

    list.addEventListener("drop", function (event) {
      if (!list.classList.contains("is-sequential") || !draggedCard) return;
      event.preventDefault();

      var targetCard = event.target.closest("[data-recipient-card]");
      if (targetCard && targetCard !== draggedCard) {
        var rect = targetCard.getBoundingClientRect();
        moveRecipientCard(draggedCard, targetCard, event.clientY < rect.top + rect.height / 2);
      } else if (!targetCard) {
        moveRecipientCard(draggedCard, null, false);
      }

      list.querySelectorAll("[data-recipient-card].is-drag-over").forEach(function (card) {
        card.classList.remove("is-drag-over");
      });
    });

    list.addEventListener("dragend", function () {
      if (draggedCard) draggedCard.classList.remove("is-dragging");
      draggedCard = null;
      list.querySelectorAll("[data-recipient-card].is-drag-over").forEach(function (card) {
        card.classList.remove("is-drag-over");
      });
    });

    list.setAttribute("data-recipient-drag-ready", "true");
  }

  function bindRecipientOrderInputs(root) {
    (root || document).querySelectorAll("[data-recipient-index]").forEach(function (input) {
      if (input.getAttribute("data-order-ready") === "true") return;

      function applyOrder() {
        var card = input.closest("[data-recipient-card]");
        var list = document.querySelector("[data-recipient-list]");
        if (!card || !list || !list.classList.contains("is-sequential")) return;

        normalizeRecipientOrderInput(input);
        sortRecipientsByOrder();
        updateRecipientIndexes();
      }

      input.addEventListener("input", function () {
        input.value = input.value.replace(/\D/g, "");
      });

      input.addEventListener("blur", applyOrder);

      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          input.blur();
        }
      });

      input.setAttribute("data-order-ready", "true");
    });
  }

  function syncRecipientCustomMenuItems(card) {
    if (!card) return;
    var hasVerify = !!card.querySelector(".ns-envelope-settings-subcard--verify");
    var hasReading = !!card.querySelector(".ns-envelope-settings-subcard--reading");
    card.querySelectorAll("[data-recipient-custom-action]").forEach(function (item) {
      var action = item.getAttribute("data-recipient-custom-action");
      item.disabled = (action === "verify" && hasVerify) || (action === "reading" && hasReading);
    });
  }

  function closeRecipientCustomMenu(wrapper) {
    if (!wrapper) return;
    var trigger = wrapper.querySelector("[data-recipient-custom-trigger]");
    var menu = wrapper.querySelector(".ns-envelope-settings-recipient-custom__menu");
    wrapper.classList.remove("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    if (menu) menu.setAttribute("hidden", "");
  }

  function closeAllRecipientCustomMenus(except) {
    document.querySelectorAll("[data-recipient-custom]").forEach(function (wrapper) {
      if (wrapper !== except) closeRecipientCustomMenu(wrapper);
    });
  }

  function mountIdentityVerification(card) {
    var slot = card.querySelector("[data-recipient-verify-slot]");
    var verifyTemplate = document.getElementById("recipient-verify-template");
    if (!slot || !verifyTemplate || card.querySelector(".ns-envelope-settings-subcard--verify")) return false;

    slot.appendChild(verifyTemplate.content.cloneNode(true));
    updateRecipientIndexes();
    initCollapseTriggers(card);
    bindVerifySections(card);
    syncVerifyDeliveryLink(card);
    syncRecipientCustomMenuItems(card);
    return true;
  }

  function mountReadingRequirement(card) {
    var slot = card.querySelector("[data-recipient-reading-slot]");
    var readingTemplate = document.getElementById("recipient-reading-template");
    if (!slot || !readingTemplate || card.querySelector(".ns-envelope-settings-subcard--reading")) return false;

    slot.appendChild(readingTemplate.content.cloneNode(true));
    updateRecipientIndexes();
    initCollapseTriggers(card);
    bindReadingSections(card);
    syncRecipientCustomMenuItems(card);
    return true;
  }

  function syncReadingFixedTime(section) {
    if (!section) return;
    var toggle = section.querySelector("[data-reading-fixed-time-toggle]");
    var fields = section.querySelector("[data-reading-fixed-time-fields]");
    if (!toggle || !fields) return;
    fields.hidden = !toggle.checked;
  }

  function bindReadingSections(root) {
    (root || document).querySelectorAll(".ns-envelope-settings-subcard--reading").forEach(function (section) {
      if (section.getAttribute("data-reading-ready") === "true") return;

      var removeButton = section.querySelector("[data-remove-reading]");
      if (removeButton) {
        removeButton.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          removeReadingRequirement(section);
        });
      }

      var fixedTimeToggle = section.querySelector("[data-reading-fixed-time-toggle]");
      if (fixedTimeToggle) {
        fixedTimeToggle.addEventListener("change", function () {
          syncReadingFixedTime(section);
        });
        syncReadingFixedTime(section);
      }

      initInputNumbers(section);
      section.setAttribute("data-reading-ready", "true");
    });
  }

  function bindRecipientCustomMenus(root) {
    (root || document).querySelectorAll("[data-recipient-custom]").forEach(function (wrapper) {
      if (wrapper.getAttribute("data-recipient-custom-ready") === "true") return;

      var trigger = wrapper.querySelector("[data-recipient-custom-trigger]");
      var menu = wrapper.querySelector(".ns-envelope-settings-recipient-custom__menu");
      var card = wrapper.closest("[data-recipient-card]");
      if (!trigger || !menu || !card) return;

      trigger.addEventListener("click", function (event) {
        event.stopPropagation();
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        if (expanded) {
          closeRecipientCustomMenu(wrapper);
          return;
        }
        closeAllRecipientCustomMenus(wrapper);
        syncRecipientCustomMenuItems(card);
        wrapper.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        menu.removeAttribute("hidden");
      });

      menu.querySelectorAll("[data-recipient-custom-action]").forEach(function (item) {
        item.addEventListener("click", function (event) {
          event.stopPropagation();
          if (item.disabled) return;
          var action = item.getAttribute("data-recipient-custom-action");
          if (action === "verify") mountIdentityVerification(card);
          if (action === "reading") mountReadingRequirement(card);
          closeRecipientCustomMenu(wrapper);
        });
      });

      syncRecipientCustomMenuItems(card);
      wrapper.setAttribute("data-recipient-custom-ready", "true");
    });
  }

  function initRecipientCustomMenuGlobal() {
    if (document.documentElement.getAttribute("data-envelope-custom-menu-bound") === "true") return;
    document.addEventListener("click", function () {
      closeAllRecipientCustomMenus();
      document.querySelectorAll("[data-verify-select].is-open").forEach(closeVerifySelect);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeAllRecipientCustomMenus();
    });
    document.documentElement.setAttribute("data-envelope-custom-menu-bound", "true");
  }

  function bindRecipientRemove(root) {
    (root || document).querySelectorAll("[data-remove-recipient]").forEach(function (button) {
      if (button.getAttribute("data-remove-ready") === "true") return;

      button.addEventListener("click", function () {
        var list = document.querySelector("[data-recipient-list]");
        var card = button.closest("[data-recipient-card]");
        if (!list || !card) return;
        if (list.querySelectorAll("[data-recipient-card]").length <= 1) return;
        card.remove();
        updateRecipientIndexes();
      });

      button.setAttribute("data-remove-ready", "true");
    });
  }

  function syncVerifyDeliveryLink(card) {
    if (!card) return;
    var verifySection = card.querySelector(".ns-envelope-settings-subcard--verify");
    if (!verifySection) return;

    var emailToggle = card.querySelector('[data-delivery-toggle="email"]');
    var phoneToggle = card.querySelector('[data-delivery-toggle="phone"]');
    var emailInput = verifySection.querySelector("[data-verify-email-input]");
    var phoneInput = verifySection.querySelector("[data-verify-phone-input]");

    if (emailInput && emailToggle) {
      if (emailToggle.checked) emailInput.setAttribute("hidden", "");
      else emailInput.removeAttribute("hidden");
    }
    if (phoneInput && phoneToggle) {
      if (phoneToggle.checked) phoneInput.setAttribute("hidden", "");
      else phoneInput.removeAttribute("hidden");
    }
  }

  function syncDeliveryFields(card) {
    if (!card) return;
    var emailToggle = card.querySelector('[data-delivery-toggle="email"]');
    var phoneToggle = card.querySelector('[data-delivery-toggle="phone"]');
    var emailField = card.querySelector("[data-recipient-email-field]");
    var phoneField = card.querySelector("[data-recipient-phone-field]");

    if (emailField && emailToggle) {
      if (emailToggle.checked) emailField.removeAttribute("hidden");
      else emailField.setAttribute("hidden", "");
    }
    if (phoneField && phoneToggle) {
      if (phoneToggle.checked) phoneField.removeAttribute("hidden");
      else phoneField.setAttribute("hidden", "");
    }
    syncVerifyDeliveryLink(card);
  }

  function bindDeliveryMethodToggles(root) {
    (root || document).querySelectorAll("[data-recipient-card]").forEach(function (card) {
      if (card.getAttribute("data-delivery-ready") === "true") return;

      function sync() {
        syncDeliveryFields(card);
      }

      var emailToggle = card.querySelector('[data-delivery-toggle="email"]');
      var phoneToggle = card.querySelector('[data-delivery-toggle="phone"]');
      if (emailToggle) emailToggle.addEventListener("change", sync);
      if (phoneToggle) phoneToggle.addEventListener("change", sync);
      sync();
      card.setAttribute("data-delivery-ready", "true");
    });
  }

  function createCcCard() {
    var template = document.getElementById("task-cc-card-template");
    if (!template || !template.content || !template.content.firstElementChild) return null;
    return template.content.firstElementChild.cloneNode(true);
  }

  function bindCcRemove(root) {
    if (!root) root = document;
    root.querySelectorAll("[data-remove-cc]").forEach(function (btn) {
      if (btn.getAttribute("data-remove-ready") === "true") return;
      btn.addEventListener("click", function () {
        var card = btn.closest("[data-task-cc-card]");
        if (card) card.remove();
      });
      btn.setAttribute("data-remove-ready", "true");
    });
  }

  function bindAddCcRecipient() {
    var addButton = document.querySelector("[data-add-cc-recipient]");
    var list = document.querySelector("[data-task-cc-list]");
    if (!addButton || !list || addButton.getAttribute("data-add-ready") === "true") return;

    addButton.addEventListener("click", function () {
      var card = createCcCard();
      if (!card) return;
      list.appendChild(card);
      bindCcRemove(card);
      var nameInput = card.querySelector("[data-cc-name]");
      if (nameInput) nameInput.focus();
    });

    addButton.setAttribute("data-add-ready", "true");
  }

  function bindAddRecipient() {
    var addButton = document.querySelector("[data-add-recipient]");
    var list = document.querySelector("[data-recipient-list]");
    if (!addButton || !list || addButton.getAttribute("data-add-ready") === "true") return;

    addButton.addEventListener("click", function () {
      var card = createRecipientCard(false);
      if (!card) return;
      list.appendChild(card);
      var mounted = list.lastElementChild;
      if (mounted) setRecipientOrderInput(mounted, getMaxRecipientOrder(list, mounted) + 1);
      sortRecipientsByOrder();
      updateRecipientIndexes();
      syncRecipientDragState();
      initSelects(list);
      initCollapseTriggers(list);
      bindRecipientRemove(list);
      bindRecipientOrderInputs(list);
      bindDeliveryMethodToggles(list);
      bindSignatureSections(list);
      bindVerifySections(list);
      bindReadingSections(list);
      bindRecipientCustomMenus(list);
    });

    addButton.setAttribute("data-add-ready", "true");
  }

  var UPLOAD_GRID_COLUMNS = 4;
  var UPLOAD_ACCEPT_EXT = ["doc", "docx", "pdf", "png", "jpg", "jpeg"];

  function getUploadDropSpan(fileCount) {
    var remainder = fileCount % UPLOAD_GRID_COLUMNS;
    if (remainder === 0) return UPLOAD_GRID_COLUMNS;
    return UPLOAD_GRID_COLUMNS - remainder;
  }
  var UPLOAD_MAX_SIZE = 50 * 1024 * 1024;
  var UPLOAD_ICON = "assets/envelope-settings/icon-upload.svg";
  var UPLOAD_CLOSE_ICON = "assets/envelope-editor/icon-close.svg";
  var UPLOAD_PREVIEW_ICON = "assets/envelope-settings/icon-upload-preview-figma.svg";
  var UPLOAD_RETRY_ICON = "assets/envelope-settings/icon-upload-retry-figma.svg";
  var UPLOAD_REMOVE_ICON = "assets/envelope-settings/icon-upload-remove-figma.svg";

  function getUploadExt(name) {
    var parts = name.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  }

  function validateUploadFile(file) {
    var ext = getUploadExt(file.name);
    if (UPLOAD_ACCEPT_EXT.indexOf(ext) === -1) return "不支持该文件格式";
    if (file.size > UPLOAD_MAX_SIZE) return "文件大小不能超过 50M";
    return null;
  }

  var UPLOAD_FILE_ICON_BASE = "assets/envelope-settings/file-icons/";
  var UPLOAD_FILE_ICONS = {
    pdf: "pdf.svg",
    doc: "doc.svg",
    docx: "docx.svg",
    png: "png.svg",
    jpg: "jpg.svg",
    jpeg: "jpeg.svg",
    xls: "xls.svg",
    xlsx: "xlsx.svg",
    wps: "wps.svg",
    ppt: "ppt.svg",
    ofd: "ofd.svg",
    html: "html.svg",
    tiff: "tiff.svg",
    tif: "tiff.svg",
    bmp: "bmp.svg"
  };

  function getUploadFileIconSrc(ext) {
    var file = UPLOAD_FILE_ICONS[ext];
    return UPLOAD_FILE_ICON_BASE + (file || "pdf.svg");
  }

  function getUploadFileLabel(ext) {
    if (ext === "doc") return "DOC";
    if (ext === "docx") return "DOCX";
    if (ext === "pdf") return "PDF";
    if (ext === "png") return "PNG";
    if (ext === "jpg") return "JPG";
    if (ext === "jpeg") return "JPEG";
    if (ext === "xls") return "XLS";
    if (ext === "xlsx") return "XLSX";
    if (ext === "wps") return "WPS";
    if (ext === "ppt") return "PPT";
    if (ext === "ofd") return "OFD";
    if (ext === "html") return "HTML";
    if (ext === "tiff" || ext === "tif") return "TIFF";
    if (ext === "bmp") return "BMP";
    return (ext || "FILE").toUpperCase();
  }

  function initUploadArea() {
    var board = document.querySelector("[data-envelope-upload]");
    var input = document.getElementById("envelope-settings-upload");
    if (!board || !input || board.getAttribute("data-upload-ready") === "true") return;

    var inner = board.querySelector("[data-upload-board]");
    if (!inner) return;

    var files = new Map();
    var nextId = 1;
    var timers = new Map();

    function clearTimer(id) {
      var timer = timers.get(id);
      if (timer) {
        window.clearInterval(timer);
        timers.delete(id);
      }
    }

    function revokeEntryUrl(entry) {
      if (entry && entry.objectUrl) {
        URL.revokeObjectURL(entry.objectUrl);
        entry.objectUrl = null;
      }
    }

    function removeFile(id) {
      clearTimer(id);
      var entry = files.get(id);
      if (!entry) return;
      revokeEntryUrl(entry);
      files.delete(id);
      render();
    }

    function simulateUpload(id) {
      var entry = files.get(id);
      if (!entry) return;

      var validationError = validateUploadFile(entry.file);
      if (validationError) {
        entry.status = "error";
        entry.progress = 0;
        entry.error = validationError;
        entry.errorType = "validation";
        render();
        return;
      }

      clearTimer(id);
      revokeEntryUrl(entry);
      entry.status = "uploading";
      entry.progress = 0;
      entry.error = null;
      entry.errorType = null;
      render();

      var shouldFail = /fail|error|失败/i.test(entry.file.name);
      var timer = window.setInterval(function () {
        var current = files.get(id);
        if (!current || current.status !== "uploading") {
          clearTimer(id);
          return;
        }

        current.progress = Math.min(100, current.progress + (shouldFail ? 8 : 14));
        updateCardProgress(id);

        if (current.progress >= 100) {
          clearTimer(id);
          if (shouldFail) {
            current.status = "error";
            current.error = "上传失败";
            current.errorType = "upload";
          } else {
            current.status = "success";
            current.errorType = null;
            current.objectUrl = URL.createObjectURL(current.file);
          }
          render();
        }
      }, 120);

      timers.set(id, timer);
    }

    function addFiles(fileList) {
      Array.prototype.forEach.call(fileList || [], function (file) {
        var error = validateUploadFile(file);
        var id = String(nextId++);
        var entry = {
          id: id,
          file: file,
          status: error ? "error" : "uploading",
          progress: 0,
          error: error,
          errorType: error ? "validation" : null,
          objectUrl: null
        };
        files.set(id, entry);
        if (!error) simulateUpload(id);
      });
      render();
    }

    function bindDropZone(zone) {
      ["dragenter", "dragover"].forEach(function (type) {
        zone.addEventListener(type, function (event) {
          event.preventDefault();
          zone.classList.add("is-dragover");
        });
      });

      zone.addEventListener("dragleave", function (event) {
        event.preventDefault();
        zone.classList.remove("is-dragover");
      });

      zone.addEventListener("drop", function (event) {
        event.preventDefault();
        zone.classList.remove("is-dragover");
        if (event.dataTransfer && event.dataTransfer.files) {
          addFiles(event.dataTransfer.files);
        }
      });
    }

    function bindUploadCardHover(card) {
      if (!card || card.getAttribute("data-hover-bound") === "true") return;

      card.addEventListener("mouseenter", function () {
        card.classList.add("is-card-hovered");
      });
      card.addEventListener("mouseleave", function () {
        card.classList.remove("is-card-hovered");
      });
      card.setAttribute("data-hover-bound", "true");
    }

    function createDropZone(options) {
      var isEmpty = !options || options.mode === "empty";
      var span = options && options.span ? options.span : 1;
      var isSingleCell = !isEmpty && span === 1;

      var zone = document.createElement("label");
      zone.className =
        "ns-envelope-settings-upload-drop" +
        (isEmpty ? " ns-envelope-settings-upload-drop--empty" : " ns-envelope-settings-upload-drop--append");
      if (isSingleCell) zone.classList.add("ns-envelope-settings-upload-drop--cell");
      if (!isEmpty) zone.style.gridColumn = "span " + String(span);
      zone.setAttribute("for", "envelope-settings-upload");

      var intro = document.createElement("div");
      intro.className = "ns-envelope-settings-upload-drop__intro";

      var icon = document.createElement("img");
      icon.className = "ns-envelope-settings-upload-drop__icon";
      icon.src = UPLOAD_ICON;
      icon.width = 64;
      icon.height = 64;
      icon.alt = "";

      var title = document.createElement("p");
      title.className = "ns-envelope-settings-upload-drop__title";
      title.textContent = isSingleCell ? "点击上传" : "点击或拖拽文件到此处上传";

      intro.appendChild(icon);
      intro.appendChild(title);
      zone.appendChild(intro);

      if (!isSingleCell) {
        var hint = document.createElement("p");
        hint.className = "ns-envelope-settings-upload-drop__hint";
        hint.textContent =
          "支持doc、docx、pdf、png、jpg、jpeg格式 , 文件 ≤50M 注意：不能直接修改后缀名.doc 为.docx,否则会出错";
        zone.appendChild(hint);
      }

      bindDropZone(zone);
      return zone;
    }

    function createActionButton(label, iconSrc, onClick, modifier) {
      var button = document.createElement("button");
      button.type = "button";
      button.className =
        "ns-envelope-settings-upload-card__action" + (modifier ? " ns-envelope-settings-upload-card__action--" + modifier : "");
      button.setAttribute("aria-label", label);
      var img = document.createElement("img");
      img.src = iconSrc;
      img.width = 24;
      img.height = 24;
      img.alt = "";
      button.appendChild(img);
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      });
      return button;
    }

    function updateCardProgress(id) {
      var card = inner.querySelector('[data-upload-id="' + id + '"]');
      var entry = files.get(id);
      if (!card || !entry) return;
      var fill = card.querySelector(".ns-envelope-settings-upload-card__progress-fill");
      var label = card.querySelector(".ns-envelope-settings-upload-card__progress-label");
      if (fill) fill.style.width = String(entry.progress) + "%";
      if (label) label.textContent = String(entry.progress) + "%";
    }

    function createCard(entry) {
      var ext = getUploadExt(entry.file.name);
      var card = document.createElement("article");
      card.className = "ns-envelope-settings-upload-card";
      card.setAttribute("data-upload-id", entry.id);

      if (entry.status === "uploading") card.classList.add("is-uploading");
      if (entry.status === "error") card.classList.add("is-error");
      if (entry.status === "success") card.classList.add("is-success");

      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "ns-envelope-settings-upload-card__remove";
      remove.setAttribute("aria-label", "删除文件");
      var removeIcon = document.createElement("img");
      removeIcon.src = entry.status === "success" ? UPLOAD_REMOVE_ICON : UPLOAD_CLOSE_ICON;
      removeIcon.width = entry.status === "success" ? 24 : 12;
      removeIcon.height = entry.status === "success" ? 24 : 12;
      removeIcon.alt = "";
      remove.appendChild(removeIcon);
      remove.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        removeFile(entry.id);
      });
      card.appendChild(remove);

      var body = document.createElement("div");
      body.className = "ns-envelope-settings-upload-card__body";

      if (entry.status === "uploading" || entry.status === "error") {
        var status = document.createElement("p");
        status.className =
          "ns-envelope-settings-upload-card__status " +
          (entry.status === "error"
            ? "ns-envelope-settings-upload-card__status--error"
            : "ns-envelope-settings-upload-card__status--uploading");
        status.textContent = entry.status === "error" ? entry.error || "上传失败" : "上传中";
        body.appendChild(status);

        var progress = document.createElement("div");
        progress.className = "ns-envelope-settings-upload-card__progress";

        var track = document.createElement("div");
        track.className = "ns-envelope-settings-upload-card__progress-track";
        var fill = document.createElement("div");
        fill.className =
          "ns-envelope-settings-upload-card__progress-fill" +
          (entry.status === "error" ? " ns-envelope-settings-upload-card__progress-fill--error" : "");
        fill.style.width = String(entry.progress) + "%";
        track.appendChild(fill);

        var progressLabel = document.createElement("span");
        progressLabel.className = "ns-envelope-settings-upload-card__progress-label";
        progressLabel.textContent = String(entry.progress) + "%";

        progress.appendChild(track);
        progress.appendChild(progressLabel);
        body.appendChild(progress);
      }

      var fileIconImage = document.createElement("img");
      fileIconImage.className = "ns-envelope-settings-upload-card__file-icon";
      fileIconImage.src = getUploadFileIconSrc(ext);
      fileIconImage.width = 64;
      fileIconImage.height = 64;
      fileIconImage.alt = getUploadFileLabel(ext);
      body.appendChild(fileIconImage);

      var name = document.createElement("p");
      name.className = "ns-envelope-settings-upload-card__name";
      name.textContent = entry.file.name;
      name.title = entry.file.name;
      body.appendChild(name);
      card.appendChild(body);

      if (entry.status === "success") {
        var hover = document.createElement("div");
        hover.className = "ns-envelope-settings-upload-card__hover";

        var actions = document.createElement("div");
        actions.className = "ns-envelope-settings-upload-card__hover-actions";
        actions.appendChild(
          createActionButton(
            "预览",
            UPLOAD_PREVIEW_ICON,
            function () {
              if (!entry.objectUrl) entry.objectUrl = URL.createObjectURL(entry.file);
              window.open(entry.objectUrl, "_blank", "noopener,noreferrer");
            },
            "preview"
          )
        );

        actions.appendChild(
          createActionButton(
            "重新上传",
            UPLOAD_RETRY_ICON,
            function () {
              simulateUpload(entry.id);
            },
            "retry"
          )
        );
        hover.appendChild(actions);
        card.appendChild(hover);
      } else {
        var overlay = document.createElement("div");
        overlay.className = "ns-envelope-settings-upload-card__overlay";

        if (entry.status === "error" && entry.errorType === "upload") {
          overlay.appendChild(
            createActionButton("重试", UPLOAD_RETRY_ICON, function () {
              simulateUpload(entry.id);
            })
          );
        } else if (entry.status === "uploading") {
          overlay.appendChild(
            createActionButton("取消", UPLOAD_CLOSE_ICON, function () {
              removeFile(entry.id);
            })
          );
        }

        card.appendChild(overlay);
      }

      return card;
    }

    function render() {
      inner.innerHTML = "";
      var entries = Array.from(files.values());
      var hasFiles = entries.length > 0;

      board.classList.toggle("has-files", hasFiles);

      if (!hasFiles) {
        inner.appendChild(createDropZone({ mode: "empty" }));
        return;
      }

      entries.forEach(function (entry) {
        var card = createCard(entry);
        inner.appendChild(card);
        bindUploadCardHover(card);
      });
      inner.appendChild(createDropZone({ mode: "append", span: getUploadDropSpan(entries.length) }));
    }

    input.addEventListener("change", function () {
      if (input.files && input.files.length) addFiles(input.files);
      input.value = "";
    });

    inner.addEventListener("dragover", function (event) {
      event.preventDefault();
    });

    inner.addEventListener("drop", function (event) {
      event.preventDefault();
      inner.querySelectorAll(".ns-envelope-settings-upload-drop.is-dragover").forEach(function (zone) {
        zone.classList.remove("is-dragover");
      });
      if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
        addFiles(event.dataTransfer.files);
      }
    });

    render();
    board.setAttribute("data-upload-ready", "true");
  }

  function removeIdentityVerification(section) {
    if (!section) return;
    var card = section.closest("[data-recipient-card]");
    section.remove();
    if (card) syncRecipientCustomMenuItems(card);
  }

  function removeReadingRequirement(section) {
    if (!section) return;
    var card = section.closest("[data-recipient-card]");
    section.remove();
    if (card) syncRecipientCustomMenuItems(card);
  }

  function initRecipientSectionRemoves() {
    if (document.documentElement.getAttribute("data-envelope-section-removes-bound") === "true") return;

    document.addEventListener("click", function (event) {
      var removeVerifyTrigger = event.target.closest("[data-remove-verify]");
      if (removeVerifyTrigger) {
        event.preventDefault();
        event.stopPropagation();
        removeIdentityVerification(removeVerifyTrigger.closest(".ns-envelope-settings-subcard--verify"));
        return;
      }

      var removeReadingTrigger = event.target.closest("[data-remove-reading]");
      if (removeReadingTrigger) {
        event.preventDefault();
        event.stopPropagation();
        removeReadingRequirement(removeReadingTrigger.closest(".ns-envelope-settings-subcard--reading"));
      }
    });

    document.documentElement.setAttribute("data-envelope-section-removes-bound", "true");
  }

  var VERIFY_OPTION_LABELS = {
    "access-code": "访问码",
    identity: "Nota Sign身份核验",
    email: "邮箱核验",
    "sms-otp": "短信"
  };

  function closeVerifySelect(select) {
    if (!select) return;
    var trigger = select.querySelector(".ns-envelope-settings-verify-select__trigger");
    var menu = select.querySelector(".ns-envelope-settings-verify-select__menu");
    select.classList.remove("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    if (menu) menu.setAttribute("hidden", "");
  }

  function setVerifySelectValue(select, value) {
    if (!select) return;
    var label = VERIFY_OPTION_LABELS[value] || VERIFY_OPTION_LABELS.identity;
    select.setAttribute("data-value", value);
    var valueEl = select.querySelector(".ns-envelope-settings-verify-select__value");
    if (valueEl) valueEl.textContent = label;
    select.querySelectorAll(".ns-envelope-settings-verify-select__option").forEach(function (option) {
      var active = option.getAttribute("data-value") === value;
      option.classList.toggle("is-selected", active);
      option.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function bindVerifySelect(select) {
    if (!select || select.getAttribute("data-verify-select-ready") === "true") return;
    var section = select.closest(".ns-envelope-settings-subcard--verify");
    var trigger = select.querySelector(".ns-envelope-settings-verify-select__trigger");
    var menu = select.querySelector(".ns-envelope-settings-verify-select__menu");
    if (!trigger || !menu || !section) return;

    trigger.addEventListener("click", function (event) {
      event.stopPropagation();
      if (select.classList.contains("is-open")) {
        closeVerifySelect(select);
        return;
      }
      document.querySelectorAll("[data-verify-select].is-open").forEach(function (other) {
        if (other !== select) closeVerifySelect(other);
      });
      select.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      menu.removeAttribute("hidden");
    });

    select.querySelectorAll(".ns-envelope-settings-verify-select__option").forEach(function (option) {
      option.addEventListener("click", function (event) {
        event.stopPropagation();
        setVerifySelectValue(select, option.getAttribute("data-value") || "identity");
        syncVerifyPanel(section);
        syncVerifyHead(section);
        closeVerifySelect(select);
      });
    });

    setVerifySelectValue(
      select,
      select.getAttribute("data-value") || select.getAttribute("data-default-value") || "identity"
    );
    select.setAttribute("data-verify-select-ready", "true");
  }

  function syncVerifyPanel(section) {
    if (!section) return;
    var select = section.querySelector("[data-verify-select]");
    if (!select) return;

    var value = select.getAttribute("data-value") || "identity";
    section.querySelectorAll("[data-verify-panel]").forEach(function (panel) {
      var active = panel.getAttribute("data-verify-panel") === value;
      if (active) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    });
    syncVerifyDeliveryLink(section.closest("[data-recipient-card]"));
  }

  function syncVerifyHead(section) {
    if (!section) return;
    var toggle = section.querySelector("[data-collapse-trigger]");
    var title = section.querySelector("[data-verify-title]");
    var valueEl = section.querySelector("[data-verify-select] .ns-envelope-settings-verify-select__value");
    if (!toggle || !title) return;

    var value = valueEl ? valueEl.textContent.trim() : "Nota Sign身份核验";
    var expanded = toggle.getAttribute("aria-expanded") === "true";
    title.textContent = expanded ? "身份核验：" : "身份核验：" + value;
    toggle.setAttribute("aria-label", expanded ? "收起身份核验" : "展开身份核验");
  }

  function bindVerifySections(root) {
    (root || document).querySelectorAll(".ns-envelope-settings-subcard--verify").forEach(function (section) {
      if (section.getAttribute("data-verify-ready") === "true") return;

      var toggle = section.querySelector("[data-collapse-trigger]");
      if (toggle) {
        toggle.addEventListener("click", function () {
          window.setTimeout(function () {
            syncVerifyHead(section);
          }, 0);
        });
      }

      section.querySelectorAll("[data-verify-select]").forEach(function (select) {
        bindVerifySelect(select);
      });

      var copyButton = section.querySelector("[data-copy-access-code]");
      if (copyButton) {
        copyButton.addEventListener("click", function () {
          var input = section.querySelector("[data-access-code-input]");
          if (!input || !input.value) return;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(input.value);
          }
        });
      }

      var removeButton = section.querySelector("[data-remove-verify]");
      if (removeButton) {
        removeButton.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          removeIdentityVerification(section);
        });
      }

      syncVerifyPanel(section);
      syncVerifyHead(section);
      section.setAttribute("data-verify-ready", "true");
    });
  }

  function syncSignatureHead(section) {
    if (!section) return;
    var toggle = section.querySelector("[data-collapse-trigger]");
    var title = section.querySelector("[data-signature-title]");
    var valueEl = section.querySelector("[data-signature-select] .ns-select__value");
    if (!toggle || !title) return;

    var value = valueEl ? valueEl.textContent.trim() : "电子签名";
    var expanded = toggle.getAttribute("aria-expanded") === "true";
    title.textContent = expanded ? "签名类型" : "签名类型：" + value;
    toggle.setAttribute("aria-label", expanded ? "收起签名类型" : "展开签名类型");
  }

  function bindSignatureSections(root) {
    (root || document).querySelectorAll(".ns-envelope-settings-subcard--signature").forEach(function (section) {
      if (section.getAttribute("data-signature-ready") === "true") return;

      var toggle = section.querySelector("[data-collapse-trigger]");
      if (toggle) {
        toggle.addEventListener("click", function () {
          window.setTimeout(function () {
            syncSignatureHead(section);
          }, 0);
        });
      }

      section.querySelectorAll("[data-signature-select] .ns-select__option").forEach(function (option) {
        option.addEventListener("click", function () {
          window.setTimeout(function () {
            syncSignatureHead(section);
          }, 0);
        });
      });

      syncSignatureHead(section);
      section.setAttribute("data-signature-ready", "true");
    });
  }

  function syncSequentialSign() {
    var toggle = document.querySelector("[data-sequential-sign-toggle]");
    var list = document.querySelector("[data-recipient-list]");
    if (!toggle || !list) return;
    list.classList.toggle("is-sequential", toggle.checked);
    if (toggle.checked) {
      sortRecipientsByOrder();
      updateRecipientIndexes();
    }
    syncRecipientDragState();
  }

  function initSequentialSignToggle() {
    var toggle = document.querySelector("[data-sequential-sign-toggle]");
    if (!toggle || toggle.getAttribute("data-sequential-ready") === "true") return;
    toggle.addEventListener("change", syncSequentialSign);
    syncSequentialSign();
    toggle.setAttribute("data-sequential-ready", "true");
  }

  function initInputNumbers(root) {
    if (window.NotaSignComponents && window.NotaSignComponents.initInputNumbers) {
      window.NotaSignComponents.initInputNumbers(root || document);
    }
  }

  function bindCharCounters(root) {
    (root || document).querySelectorAll("[data-char-counter]").forEach(function (wrap) {
      if (wrap.getAttribute("data-char-counter-ready") === "true") return;

      var input = wrap.querySelector("input, textarea");
      var counter = wrap.querySelector("[data-char-counter-value]");
      var max = parseInt(wrap.getAttribute("data-char-max"), 10) || 0;
      if (!input || !counter || !max) return;

      function sync() {
        counter.textContent = String(input.value.length) + "/" + String(max);
      }

      input.addEventListener("input", sync);
      sync();
      wrap.setAttribute("data-char-counter-ready", "true");
    });
  }

  function initForm() {
    var form = document.getElementById("envelope-settings-form");
    if (!form || form.getAttribute("data-form-ready") === "true") return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
    form.setAttribute("data-form-ready", "true");
  }

  function initPage() {
    mountRecipients();
    updateRecipientIndexes();
    initSequentialSignToggle();
    bindDeliveryMethodToggles(document);
    bindSignatureSections(document);
    initSelects(document);
    initInputNumbers(document);
    bindCharCounters(document);
    bindVerifySections(document);
    bindReadingSections(document);
    bindRecipientCustomMenus(document);
    initRecipientCustomMenuGlobal();
    initRecipientSectionRemoves();
    initCollapseTriggers(document);
    bindRecipientRemove(document);
    bindRecipientOrderInputs(document);
    bindAddRecipient();
    bindAddCcRecipient();
    initRecipientDragReorder();
    syncRecipientDragState();
    initUploadArea();
    initForm();
  }

  initPage();
  window.addEventListener("notasign:languagechange", initPage);
})();
