/**
 * 信封编辑器手绘签署弹窗交互。
 */
(function () {
  var overlay = document.getElementById("handwriteModalOverlay");
  var closeBtn = document.getElementById("handwriteModalClose");
  var canvas = document.getElementById("handwriteCanvas");
  var canvasInner = document.getElementById("handwriteCanvasInner");
  if (!overlay || !canvas || !canvasInner) return;

  var ctx = canvas.getContext("2d");
    var btnConfirm = document.getElementById('hwBtnConfirm');
    var btnUndo = document.getElementById('hwBtnUndo');
    var btnClear = document.getElementById('hwBtnClear');
    var toolbarRight = document.getElementById('handwriteToolbarRight');
    var isDrawing = false;
    var brushColor = '#000000';
    var brushLineWidth = 2;
    var undoStack = [];
    var MAX_UNDO = 30;
    var hasDrawing = false;

    function resizeCanvas() {
      var rect = canvasInner.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function restoreState(dataUrl) {
      var img = new Image();
      img.onload = function() {
        var rect = canvasInner.getBoundingClientRect();
        var dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = dataUrl;
    }

    function saveState() {
      undoStack.push(canvas.toDataURL());
      if (undoStack.length > MAX_UNDO) undoStack.shift();
    }

    function enterDrawingState() {
      if (hasDrawing) return;
      hasDrawing = true;
      btnConfirm.classList.remove('is-disabled');
      btnUndo.style.display = 'flex';
      btnClear.style.display = 'flex';
    }

    function resetToInitialState() {
      hasDrawing = false;
      btnConfirm.classList.add('is-disabled');
      btnUndo.style.display = 'none';
      btnClear.style.display = 'none';
    }

    btnUndo.style.display = 'none';
    btnClear.style.display = 'none';

    var activePointerId = null;
    var globalDrawListenersBound = false;

    function getPos(e) {
      var rect = canvas.getBoundingClientRect();
      var clientX = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      var clientY = e.clientY != null ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function onGlobalPointerMove(e) {
      if (!isDrawing) return;
      if (activePointerId != null && e.pointerId !== activePointerId) return;
      if (e.pointerType === "mouse" && e.buttons === 0) {
        endDraw(e);
        return;
      }
      draw(e);
    }

    function onGlobalPointerEnd(e) {
      if (!isDrawing) return;
      if (activePointerId != null && e.pointerId !== activePointerId) return;
      endDraw(e);
    }

    function bindGlobalDrawListeners() {
      if (globalDrawListenersBound) return;
      globalDrawListenersBound = true;
      window.addEventListener("pointermove", onGlobalPointerMove, true);
      window.addEventListener("pointerup", onGlobalPointerEnd, true);
      window.addEventListener("pointercancel", onGlobalPointerEnd, true);
    }

    function unbindGlobalDrawListeners() {
      if (!globalDrawListenersBound) return;
      globalDrawListenersBound = false;
      window.removeEventListener("pointermove", onGlobalPointerMove, true);
      window.removeEventListener("pointerup", onGlobalPointerEnd, true);
      window.removeEventListener("pointercancel", onGlobalPointerEnd, true);
    }

    /**
     * 取消进行中的笔画，不写入撤销栈。
     */
    function cancelActiveStroke() {
      if (!isDrawing) return;
      isDrawing = false;
      activePointerId = null;
      unbindGlobalDrawListeners();
      ctx.beginPath();
    }

    /**
     * 自适应模式下开始书写后隐藏弹窗引导文案。
     */
    function hideAdaptiveGuideText() {
      var field = window._currentHandwriteField;
      if (!field || getFieldHandwriteMode(field) !== "adaptive") return;
      var guideTextEl = document.getElementById("handwriteGuideText");
      if (guideTextEl) guideTextEl.classList.add("is-hidden");
    }

    function startDraw(e) {
      if (isDrawing) return;
      if (e.pointerType === "mouse") {
        if (e.button !== 0) return;
        if (e.buttons === 0) return;
      }
      isDrawing = true;
      activePointerId = e.pointerId != null ? e.pointerId : null;
      bindGlobalDrawListeners();
      hideAdaptiveGuideText();
      var pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushLineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      var pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    /**
     * 结束当前笔画（仅在实际松开指针时触发，移出画布不结束）。
     * @param {PointerEvent} [e]
     */
    function endDraw(e) {
      if (!isDrawing) return;
      isDrawing = false;
      activePointerId = null;
      unbindGlobalDrawListeners();
      ctx.beginPath();
      saveState();
      enterDrawingState();
    }

    canvas.addEventListener("pointerdown", function(e) {
      e.preventDefault();
      startDraw(e);
    });

    // Color swatches
    var colorSwatches = overlay.querySelectorAll('.color-swatch-outer');
    colorSwatches.forEach(function(swatch) {
      swatch.addEventListener('click', function() {
        colorSwatches.forEach(function(s) { s.classList.remove('is-active'); s.setAttribute('aria-checked', 'false'); });
        this.classList.add('is-active');
        this.setAttribute('aria-checked', 'true');
        brushColor = this.getAttribute('data-color');
      });
    });

    // Brush sizes
    var sizeButtons = overlay.querySelectorAll('.brush-size-btn');
    sizeButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        sizeButtons.forEach(function(b) { b.classList.remove('is-active'); b.setAttribute('aria-checked', 'false'); });
        this.classList.add('is-active');
        this.setAttribute('aria-checked', 'true');
        brushLineWidth = parseInt(this.getAttribute('data-line-width'), 10);
      });
    });

    btnClear.addEventListener('click', function() {
      var rect = canvasInner.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      undoStack = [];
      saveState();
      resetToInitialState();
      var field = window._currentHandwriteField;
      if (field && getFieldHandwriteMode(field) === "adaptive") {
        syncModalGuideText(field);
      }
    });

    btnUndo.addEventListener('click', function() {
      if (undoStack.length <= 1) return;
      undoStack.pop();
      restoreState(undoStack[undoStack.length - 1]);
      if (undoStack.length <= 1) {
        resetToInitialState();
        var field = window._currentHandwriteField;
        if (field && getFieldHandwriteMode(field) === "adaptive") {
          syncModalGuideText(field);
        }
      }
    });

    btnConfirm.addEventListener('click', function() {
      if (btnConfirm.classList.contains('is-disabled')) return;
      applyHandwriteToField();
      closeModal();
    });

    document.getElementById('hwBtnCancel').addEventListener('click', function() {
      closeModal();
    });

    closeBtn.addEventListener('click', function() {
      closeModal();
    });

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (undoStack.length <= 1) return;
        undoStack.pop();
        restoreState(undoStack[undoStack.length - 1]);
        if (undoStack.length <= 1) resetToInitialState();
      }
    });

    function getFieldHandwriteMode(field) {
      return field ? field.getAttribute("data-field-handwrite-mode") || "adaptive" : "adaptive";
    }

    /**
     * 按绘制模式布局弹窗画布：自适应签名铺满可用区域，原位批注按控件比例缩放。
     * @param {HTMLElement|null} field
     * @param {HTMLElement|null} modal
     * @returns {string}
     */
    function layoutHandwriteCanvas(field, modal) {
      var mode = getFieldHandwriteMode(field);
      var isAdaptive = mode === "adaptive";
      var canvasWrap = modal ? modal.querySelector(".handwrite-modal__canvas-wrap") : null;

      if (modal) modal.classList.toggle("handwrite-modal--adaptive-canvas", isAdaptive);
      canvasInner.classList.toggle("handwrite-modal__canvas-inner--adaptive", isAdaptive);
      if (canvasWrap) canvasWrap.classList.toggle("handwrite-modal__canvas-wrap--adaptive", isAdaptive);

      if (!field || !modal) {
        canvasInner.style.backgroundImage = "none";
        return mode;
      }

      if (isAdaptive) {
        canvasInner.style.width = "";
        canvasInner.style.height = "";
        canvasInner.style.backgroundImage = "none";
        return mode;
      }

      var fieldRect = field.getBoundingClientRect();
      var fieldW = fieldRect.width;
      var fieldH = fieldRect.height;
      var availW = 568;
      var availH = 320;
      var scale = Math.min(availW / fieldW, availH / fieldH);
      var canvasW = Math.round(fieldW * scale);
      var canvasH = Math.round(fieldH * scale);

      canvasInner.style.width = canvasW + "px";
      canvasInner.style.height = canvasH + "px";
      return mode;
    }

    /**
     * 按画布与控件比例同步弹窗引导文案展示。
     * @param {HTMLElement|null} field
     */
    function syncModalGuideText(field) {
      var guideTextEl = document.getElementById("handwriteGuideText");
      if (!guideTextEl) return;

      var guide = field ? field.getAttribute("data-field-handwrite-guide") || "" : "";
      guideTextEl.textContent = guide;
      guideTextEl.classList.toggle("is-hidden", !guide);

      var baseFontSize = parseInt(field ? field.getAttribute("data-field-handwrite-font-size") || "14" : "14", 10);
      if (!Number.isFinite(baseFontSize) || baseFontSize <= 0) baseFontSize = 14;

      var fontSize = baseFontSize;
      if (field && canvasInner) {
        var fieldW = field.offsetWidth || 1;
        var fieldH = field.offsetHeight || 1;
        var canvasW = canvasInner.offsetWidth || fieldW;
        var canvasH = canvasInner.offsetHeight || fieldH;
        var scale = Math.min(canvasW / fieldW, canvasH / fieldH);
        if (!Number.isFinite(scale) || scale <= 0) scale = 1;
        fontSize = Math.round(baseFontSize * scale);
        if (getFieldHandwriteMode(field) === "adaptive") {
          fontSize = Math.max(fontSize, 24);
        }
        fontSize = Math.min(fontSize, 48);
      }

      guideTextEl.style.fontSize = fontSize + "px";
    }

    function openModal() {
      var field = window._currentHandwriteField;
      var modal = document.querySelector(".handwrite-modal");

      var mode = layoutHandwriteCanvas(field, modal);

      cancelActiveStroke();

      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");

      function finishCanvasSetup() {
        resizeCanvas();
        syncModalGuideText(field);
        undoStack = [];
        saveState();
        resetToInitialState();
        if (mode !== "adaptive") {
          captureBackground();
        }
      }

      if (mode === "adaptive") {
        requestAnimationFrame(finishCanvasSetup);
      } else {
        finishCanvasSetup();
      }
    }

    function closeModal() {
      cancelActiveStroke();
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      var modal = document.querySelector(".handwrite-modal");
      if (modal) modal.classList.remove("handwrite-modal--adaptive-canvas");
      canvasInner.classList.remove("handwrite-modal__canvas-inner--adaptive");
      canvasInner.style.width = "";
      canvasInner.style.height = "";
      var canvasWrap = modal ? modal.querySelector(".handwrite-modal__canvas-wrap") : null;
      if (canvasWrap) canvasWrap.classList.remove("handwrite-modal__canvas-wrap--adaptive");
    }

    function applyHandwriteToField() {
      var field = window._currentHandwriteField;
      if (!field) return;
      var dataUrl = canvas.toDataURL('image/png');

      var body = field.querySelector('.ns-envelope-editor-field__body');
      if (!body) return;

      var img = body.querySelector('.ns-envelope-editor-field__handwrite-image');
      if (!img) {
        img = document.createElement('img');
        img.className = 'ns-envelope-editor-field__handwrite-image';
        img.alt = '';
        img.draggable = false;
        body.appendChild(img);
      }
      img.src = dataUrl;
      img.classList.add('is-visible');

      var guide = body.querySelector('[data-handwrite-guide]');
      if (guide) guide.classList.add('is-hidden');

      // 隐藏左侧图标
      var icon = body.querySelector('.ns-envelope-editor-field__icon');
      if (icon) icon.style.display = 'none';

      var label = body.querySelector('.ns-envelope-editor-field__label');
      if (label) label.style.display = 'none';

      var guideTextEl = document.getElementById('handwriteGuideText');
      if (guideTextEl) guideTextEl.classList.add('is-hidden');
    }

    function captureBackground() {
      var field = window._currentHandwriteField;
      if (!field) return;
      var page = field.closest('[data-pdf-page]');
      if (!page) return;

      // 临时标识，用于在 clone 中定位对应元素
      var captureId = 'capture-' + Date.now();
      field.setAttribute('data-capture', captureId);
      page.setAttribute('data-capture', captureId + '-page');

      var cropCoords = null;

      html2canvas(page, {
        scale: 2,
        backgroundColor: null,
        onclone: function (clonedDoc) {
          var canvasCol = clonedDoc.querySelector('.ns-envelope-editor-canvas-column');
          if (canvasCol) {
            canvasCol.style.zoom = '1';
            canvasCol.style.transform = 'none';
          }

          var clonedField = clonedDoc.querySelector('[data-capture="' + captureId + '"]');
          var clonedPage = clonedDoc.querySelector('[data-capture="' + (captureId + '-page') + '"]');

          if (clonedField && clonedPage) {
            cropCoords = {
              x: clonedField.offsetLeft,
              y: clonedField.offsetTop,
              width: clonedField.offsetWidth,
              height: clonedField.offsetHeight
            };
          }

          clonedDoc.querySelectorAll('.ns-envelope-editor-field').forEach(function (el) {
            el.style.display = 'none';
          });
        }
      }).then(function (screenshot) {
        field.removeAttribute('data-capture');
        page.removeAttribute('data-capture');

        if (!cropCoords) {
          canvasInner.style.backgroundImage = 'none';
          return;
        }

        var cropCanvas = document.createElement('canvas');
        cropCanvas.width = Math.round(cropCoords.width * 2);
        cropCanvas.height = Math.round(cropCoords.height * 2);
        var cropCtx = cropCanvas.getContext('2d');
        cropCtx.drawImage(
          screenshot,
          cropCoords.x * 2, cropCoords.y * 2, cropCoords.width * 2, cropCoords.height * 2,
          0, 0, cropCanvas.width, cropCanvas.height
        );
        canvasInner.style.backgroundImage = 'url(' + cropCanvas.toDataURL('image/jpeg', 0.92) + ')';
        canvasInner.style.backgroundSize = '100% 100%';
        canvasInner.style.backgroundPosition = 'center';
      }).catch(function () {
        field.removeAttribute('data-capture');
        page.removeAttribute('data-capture');
        canvasInner.style.backgroundImage = 'none';
      });
    }

    window.openHandwriteModal = openModal;
    window.syncHandwriteModalGuideText = syncModalGuideText;
})();
