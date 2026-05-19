// Everything that happens on the canvas: host detection, shell/canvas lifecycle,
// resize observation, canvas event binding, drawing, and sync scheduling.

import { STORE, STATE, clamp, toRel, fromRel, getSlideKey, ensureSlide, isReadOnly, effectiveMode, getLineWidthPx, getViewportWidth } from './store';
import { updateToolbar, hideEraserRing, updateEraserRing, refreshEraserRing, tUi } from './ui';

type MarkRect = { x0: number; y0: number; x1: number; y1: number };

let _markedRect: MarkRect | null = null;
let _draftRect: MarkRect | null = null;

let _overlayCallbacks: {
  submitMarkedRect: () => Promise<boolean>;
} | null = null;

// Pinned quiz target: set via "Choose Quiz" button; overrides proximity search in api.ts.
let _pinnedQuizTarget: Element | null = null;
let _choosingQuiz = false;

export function getPinnedQuizTarget(): Element | null { return _pinnedQuizTarget; }
export function clearPinnedQuizTarget(): void { _pinnedQuizTarget = null; }

let _rectProgRAF = 0;
let _rectProgStart = 0;

function setRectProgress01(v: number): void {
  if (!STATE.shell) return;
  const wrap = STATE.shell.querySelector('.lia-annot-rect-progress') as HTMLElement | null;
  const fill = STATE.shell.querySelector('.lia-annot-rect-progfill') as HTMLElement | null;
  const txt = STATE.shell.querySelector('.lia-annot-rect-progtxt') as HTMLElement | null;
  if (!wrap || !fill || !txt) return;
  const p = Math.max(0, Math.min(1, Number(v)));
  fill.style.width = Math.round(p * 100) + '%';
  txt.textContent = Math.round(p * 100) + '%';
}

function showRectProgress(): void {
  if (!STATE.shell) return;
  const wrap = STATE.shell.querySelector('.lia-annot-rect-progress') as HTMLElement | null;
  if (!wrap) return;
  wrap.dataset.on = '1';
  setRectProgress01(0);
  syncRectButtons();
}

function hideRectProgress(): void {
  if (!STATE.shell) return;
  const wrap = STATE.shell.querySelector('.lia-annot-rect-progress') as HTMLElement | null;
  if (!wrap) return;
  wrap.dataset.on = '0';
  setRectProgress01(0);
}

function startRectProgressPseudo(): void {
  if (_rectProgRAF) {
    cancelAnimationFrame(_rectProgRAF);
    _rectProgRAF = 0;
  }
  showRectProgress();
  _rectProgStart = performance.now();
  const tick = function (): void {
    const t = performance.now() - _rectProgStart;
    let v = 0;
    if (t < 900) v = (t / 900) * 0.7;
    else if (t < 2200) v = 0.7 + ((t - 900) / 1300) * 0.2;
    else v = 0.9 + Math.min(0.08, ((t - 2200) / 5000) * 0.08);
    setRectProgress01(v);
    _rectProgRAF = requestAnimationFrame(tick);
  };
  _rectProgRAF = requestAnimationFrame(tick);
}

function stopRectProgress(final01: number): void {
  if (_rectProgRAF) {
    cancelAnimationFrame(_rectProgRAF);
    _rectProgRAF = 0;
  }
  setRectProgress01(final01);
  setTimeout(function () { hideRectProgress(); }, 250);
}

export function setOverlayCallbacks(cb: { submitMarkedRect: () => Promise<boolean> }): void {
  _overlayCallbacks = cb;
}

export function getMarkedRect(): { x: number; y: number; w: number; h: number } | null {
  if (!_markedRect) return null;
  const x = Math.min(_markedRect.x0, _markedRect.x1);
  const y = Math.min(_markedRect.y0, _markedRect.y1);
  const w = Math.max(1, Math.abs(_markedRect.x1 - _markedRect.x0));
  const h = Math.max(1, Math.abs(_markedRect.y1 - _markedRect.y0));
  return { x, y, w, h };
}

export function clearMarkedRect(): void {
  _markedRect = null;
  _draftRect = null;
  requestRedraw();
}

function isPickableInput(el: Element | null): boolean {
  if (!el) return false;
  if (el.matches('input, textarea')) return true;
  if (el.getAttribute('contenteditable') === 'true') return true;
  if (el.getAttribute('role') === 'textbox') return true;
  return false;
}

let _pickingClickHandler: ((e: MouseEvent) => void) | null = null;
let _pickingKeyHandler: ((e: KeyboardEvent) => void) | null = null;

export function exitQuizPickingMode(): void {
  _choosingQuiz = false;
  if (STATE.canvas) STATE.canvas.style.pointerEvents = '';
  document.documentElement.classList.remove('lia-annot-quiz-picking');
  if (_pickingClickHandler) { document.removeEventListener('click', _pickingClickHandler, true); _pickingClickHandler = null; }
  if (_pickingKeyHandler) { document.removeEventListener('keydown', _pickingKeyHandler, true); _pickingKeyHandler = null; }
  syncRectButtons();
}

function enterQuizPickingMode(): void {
  if (_choosingQuiz) return;
  _choosingQuiz = true;
  if (STATE.canvas) STATE.canvas.style.pointerEvents = 'none';
  document.documentElement.classList.add('lia-annot-quiz-picking');
  syncRectButtons();

  _pickingClickHandler = function (e: MouseEvent) {
    const target = e.target as Element | null;
    // Walk up to find a pickable input (in case user clicks label, etc.)
    let el: Element | null = target;
    while (el && el !== document.documentElement) {
      if (isPickableInput(el)) break;
      el = el.parentElement;
    }
    if (el && isPickableInput(el) && !el.closest('.lia-annot-shell')) {
      e.preventDefault();
      e.stopPropagation();
      _pinnedQuizTarget = el;
      exitQuizPickingMode();
    } else if (el && el.closest('.lia-annot-rect-choosequiz')) {
      // Handled by button's own click handler — do nothing here.
    } else {
      // Clicked outside any quiz field → cancel
      exitQuizPickingMode();
    }
  };

  _pickingKeyHandler = function (e: KeyboardEvent) {
    if (e.key === 'Escape') exitQuizPickingMode();
  };

  document.addEventListener('click', _pickingClickHandler, true);
  document.addEventListener('keydown', _pickingKeyHandler, true);
}

function syncRectButtons(): void {
  if (!STATE.shell) return;
  const submitBtn = STATE.shell.querySelector('.lia-annot-rect-submit') as HTMLButtonElement | null;
  const clearBtn = STATE.shell.querySelector('.lia-annot-rect-clear') as HTMLButtonElement | null;
  const chooseBtn = STATE.shell.querySelector('.lia-annot-rect-choosequiz') as HTMLButtonElement | null;
  const prog = STATE.shell.querySelector('.lia-annot-rect-progress') as HTMLElement | null;
  if (!submitBtn || !clearBtn || !prog) return;

  const rect = _markedRect;
  const canShow = !!rect && STORE.ui.visible && !isReadOnly() && effectiveMode() === 'rect';
  if (!canShow) {
    submitBtn.style.display = 'none';
    clearBtn.style.display = 'none';
    prog.style.display = 'none';
    if (chooseBtn) chooseBtn.style.display = 'none';
    return;
  }

  submitBtn.style.display = 'block';
  clearBtn.style.display = 'block';
  prog.style.display = '';

  const x = Math.min(rect!.x0, rect!.x1);
  const y = Math.min(rect!.y0, rect!.y1);
  const w = Math.max(1, Math.abs(rect!.x1 - rect!.x0));
  const h = Math.max(1, Math.abs(rect!.y1 - rect!.y0));

  const pad = 8;
  const gap = 8;
  const btnW = Math.max(110, submitBtn.offsetWidth || 140);
  const btnH = Math.max(28, submitBtn.offsetHeight || 32);
  const cls = Math.max(20, clearBtn.offsetWidth || 22);

  const submitLeft = clamp(x + w - btnW, pad, Math.max(pad, STATE.cssW - btnW - pad));
  const submitTop = clamp(y + h + gap, pad, Math.max(pad, STATE.cssH - btnH - pad));
  submitBtn.style.left = submitLeft + 'px';
  submitBtn.style.top = submitTop + 'px';

  const progH = Math.max(24, prog.offsetHeight || 26);
  prog.style.width = btnW + 'px';
  prog.style.left = submitLeft + 'px';
  prog.style.top = clamp(submitTop - progH - 6, pad, Math.max(pad, STATE.cssH - progH - pad)) + 'px';

  const clearLeft = clamp(x + w - cls * 0.5, pad, Math.max(pad, STATE.cssW - cls - pad));
  const clearTop = clamp(y - cls * 0.5, pad, Math.max(pad, STATE.cssH - cls - pad));
  clearBtn.style.left = clearLeft + 'px';
  clearBtn.style.top = clearTop + 'px';

  if (chooseBtn) {
    const chooseBtnH = Math.max(28, chooseBtn.offsetHeight || 32);
    chooseBtn.style.display = 'block';
    chooseBtn.style.width = btnW + 'px';
    chooseBtn.style.left = submitLeft + 'px';
    chooseBtn.style.top = clamp(submitTop + btnH + 4, pad, Math.max(pad, STATE.cssH - chooseBtnH - pad)) + 'px';
    // Reflect current state on label
    if (_choosingQuiz) {
      chooseBtn.textContent = '✕ ' + tUi('rectChooseCancel');
      chooseBtn.dataset.state = 'picking';
    } else if (_pinnedQuizTarget) {
      const label = (_pinnedQuizTarget as HTMLInputElement).placeholder
        || (_pinnedQuizTarget as HTMLInputElement).name
        || tUi('rectChosenFallback');
      chooseBtn.textContent = '✓ ' + label;
      chooseBtn.dataset.state = 'chosen';
    } else {
      chooseBtn.textContent = tUi('rectChooseQuiz');
      chooseBtn.dataset.state = '';
    }
  }
}

// ----- Host detection -----

export function getDirectHeader(host: Element): HTMLElement | null {
  if (!host) return null;
  const kids = host.children || [];
  for (let i = 0; i < kids.length; i++) {
    const el = kids[i];
    if (el && el.tagName && el.tagName.toLowerCase() === 'header') return el as HTMLElement;
  }
  return null;
}

export function findDirectChildByClass(parent: Element | null, cls: string): HTMLElement | null {
  if (!parent) return null;
  const kids = parent.children || [];
  for (let i = 0; i < kids.length; i++) {
    const el = kids[i] as HTMLElement;
    if (el.classList && el.classList.contains(cls)) return el;
  }
  return null;
}

export function isMainVisible(main: Element): boolean {
  if (!main) return false;
  if (main.hasAttribute('hidden')) return false;
  const cs = getComputedStyle(main);
  if (cs.display === 'none' || cs.visibility === 'hidden') return false;
  const r = main.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

export function getVisibleMainHost(): Element {
  const mains = Array.from(document.querySelectorAll('main'));
  for (let i = 0; i < mains.length; i++) {
    if (isMainVisible(mains[i])) return mains[i];
  }
  return mains[0] || document.querySelector('main') || document.body || document.documentElement;
}

// ----- Resize observer -----

export function disconnectResizeObserver(): void {
  try { if (STATE.resizeObserver) STATE.resizeObserver.disconnect(); } catch (_) { }
  STATE.resizeObserver = null;
}

export function bindResizeObserver(): void {
  disconnectResizeObserver();
  if (!STATE.host) return;
  try {
    STATE.resizeObserver = new ResizeObserver(function () { requestSync(); });
    STATE.resizeObserver.observe(STATE.host);
  } catch (_) { }
}

// ----- Shell insertion -----

function insertShellAfterHeader(host: Element, shell: HTMLElement): void {
  const header = getDirectHeader(host);
  if (header) {
    if (header.nextSibling !== shell) {
      if (shell.parentNode === host) shell.remove();
      if (header.nextSibling) host.insertBefore(shell, header.nextSibling);
      else host.appendChild(shell);
    }
    return;
  }
  if (host.firstChild !== shell) {
    if (shell.parentNode === host) shell.remove();
    if (host.firstChild) host.insertBefore(shell, host.firstChild);
    else host.appendChild(shell);
  }
}

// ----- Canvas event binding -----

export function bindCanvasEvents(): void {
  if (!STATE.canvas || STATE.canvas.__liaAnnotBound) return;
  STATE.canvas.__liaAnnotBound = true;

  function getLocalPos(evt: PointerEvent): { x: number; y: number } {
    const r = STATE.canvas!.getBoundingClientRect();
    const x = clamp(evt.clientX - r.left, 0, STATE.cssW);
    const y = clamp(evt.clientY - r.top, 0, STATE.cssH);
    return { x, y };
  }

  function rememberPointer(evt: PointerEvent): { x: number; y: number } {
    const p = getLocalPos(evt);
    STATE.lastPointer = { x: p.x, y: p.y, inside: true, pointerType: String(evt.pointerType || '') };
    return p;
  }

  function addPoint(path: import('./types').PathItem, x: number, y: number): void {
    if (!path || !Array.isArray(path.points)) return;
    const rel = toRel(x, y);
    const prev = path.points.length ? path.points[path.points.length - 1] : null;
    if (prev) {
      const dx = (rel.x - prev.x) * STATE.cssW;
      const dy = (rel.y - prev.y) * STATE.cssH;
      if (Math.hypot(dx, dy) < 0.8) return;
    }
    path.points.push(rel);
  }

  function finishStroke(evt: PointerEvent, keepMouseRing: boolean): void {
    if (STATE.drawing) {
      evt.preventDefault();
      evt.stopPropagation();
      try { STATE.canvas!.releasePointerCapture(evt.pointerId); } catch (_) { }
      STATE.drawing = false;
      STATE.activePath = null;
      requestRedraw();
      updateToolbar();
    }

    if (
      keepMouseRing &&
      evt.pointerType === 'mouse' &&
      STORE.ui.visible &&
      !isReadOnly() &&
      effectiveMode() === 'eraser'
    ) {
      const p = rememberPointer(evt);
      updateEraserRing(p.x, p.y);
    } else {
      STATE.lastPointer.inside = false;
      hideEraserRing();
    }
  }

  function startRectAt(x: number, y: number): void {
    _draftRect = { x0: x, y0: y, x1: x, y1: y };
  }

  function updateRectTo(x: number, y: number): void {
    if (!_draftRect) return;
    _draftRect.x1 = x;
    _draftRect.y1 = y;
  }

  function commitRect(): void {
    if (!_draftRect) return;
    const w = Math.abs(_draftRect.x1 - _draftRect.x0);
    const h = Math.abs(_draftRect.y1 - _draftRect.y0);
    if (w >= 6 && h >= 6) {
      _markedRect = { ..._draftRect };
    } else {
      _markedRect = null;
    }
    _draftRect = null;
  }

  STATE.canvas.addEventListener('pointerdown', function (evt: PointerEvent) {
    if (evt.pointerType === 'mouse' && evt.button !== 0) return;
    const p = rememberPointer(evt);
    if (!STORE.ui.visible || isReadOnly()) { hideEraserRing(); return; }
    const mode = effectiveMode();
    if (mode === 'eraser') { updateEraserRing(p.x, p.y); } else { hideEraserRing(); }
    if (mode === 'rect') {
      evt.preventDefault();
      evt.stopPropagation();
      startRectAt(p.x, p.y);
      try { STATE.canvas!.setPointerCapture(evt.pointerId); } catch (_) { }
      requestRedraw();
      return;
    }
    if (mode !== 'pen' && mode !== 'eraser') return;
    evt.preventDefault();
    evt.stopPropagation();
    if (STORE.ui.panelOpen) { STORE.ui.panelOpen = false; updateToolbar(); }
    const slide = ensureSlide(getSlideKey());
    const item: import('./types').PathItem = {
      kind: 'path',
      tool: mode,
      color: String(STORE.ui.color || '#ff0000'),
      width: (mode === 'eraser') ? Number(STORE.ui.eraserWidth || 18) : Number(STORE.ui.width || 3),
      alpha: (mode === 'eraser') ? 1 : Number(STORE.ui.alpha || 1),
      baseW: Math.max(1, STATE.cssW),
      points: [toRel(p.x, p.y)]
    };
    slide.items.push(item);
    slide.redo = [];
    STATE.activePath = item;
    STATE.drawing = true;
    try { STATE.canvas!.setPointerCapture(evt.pointerId); } catch (_) { }
    requestRedraw();
    updateToolbar();
  }, true);

  STATE.canvas.addEventListener('pointermove', function (evt: PointerEvent) {
    const p = rememberPointer(evt);
    if (!isReadOnly() && STORE.ui.visible && effectiveMode() === 'eraser') {
      updateEraserRing(p.x, p.y);
    } else {
      hideEraserRing();
    }
    if (_draftRect) {
      evt.preventDefault();
      evt.stopPropagation();
      updateRectTo(p.x, p.y);
      requestRedraw();
      return;
    }
    if (!STATE.drawing || !STATE.activePath) return;
    evt.preventDefault();
    evt.stopPropagation();
    addPoint(STATE.activePath, p.x, p.y);
    requestRedraw();
  }, true);

  STATE.canvas.addEventListener('pointerup', function (evt: PointerEvent) {
    if (_draftRect) {
      evt.preventDefault();
      evt.stopPropagation();
      try { STATE.canvas!.releasePointerCapture(evt.pointerId); } catch (_) { }
      commitRect();
      requestRedraw();
      updateToolbar();
      return;
    }
    finishStroke(evt, true);
  }, true);
  STATE.canvas.addEventListener('pointercancel', function (evt: PointerEvent) { finishStroke(evt, false); }, true);
  STATE.canvas.addEventListener('pointerleave', function () { STATE.lastPointer.inside = false; hideEraserRing(); }, true);
  STATE.canvas.addEventListener('contextmenu', function (evt: Event) { evt.preventDefault(); }, true);
}

// ----- Overlay lifecycle -----

export function ensureOverlay(): void {
  const host = getVisibleMainHost();
  const slideKey = getSlideKey();

  const hostChanged = (STATE.host !== host);
  const slideChanged = (STATE.slideKey !== slideKey);

  if (!STATE.shell || !STATE.shell.isConnected || hostChanged) {
    disconnectResizeObserver();
    STATE.host = host;
    STATE.slideKey = slideKey;
    host.classList.add('lia-annot-host');

    let shell = findDirectChildByClass(host, 'lia-annot-shell');
    if (!shell) {
      shell = document.createElement('div');
      shell.className = 'lia-annot-shell';
      shell.setAttribute('aria-hidden', 'true');
    }

    let canvas = shell.querySelector('.lia-annot-canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'lia-annot-canvas';
      canvas.setAttribute('aria-label', 'Annotation canvas');
      shell.appendChild(canvas);
    }

    let ring = shell.querySelector('.lia-annot-eraser-ring') as HTMLElement | null;
    if (!ring) {
      ring = document.createElement('span');
      ring.className = 'lia-annot-eraser-ring';
      ring.dataset.on = '0';
      shell.appendChild(ring);
    }

    let submitBtn = shell.querySelector('.lia-annot-rect-submit') as HTMLButtonElement | null;
    if (!submitBtn) {
      submitBtn = document.createElement('button');
      submitBtn.type = 'button';
      submitBtn.className = 'lia-annot-rect-submit';
      submitBtn.textContent = tUi('rectSubmit');
      submitBtn.style.display = 'none';
      shell.appendChild(submitBtn);
      submitBtn.addEventListener('pointerdown', function (evt) { evt.preventDefault(); evt.stopPropagation(); }, true);
      submitBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (!_overlayCallbacks || !_markedRect || STORE.ui.ocrBusy) return;
        startRectProgressPseudo();
        void _overlayCallbacks.submitMarkedRect()
          .then(function () {
            updateToolbar();
            stopRectProgress(1);
            syncRectButtons();
          })
          .catch(function () {
            stopRectProgress(1);
            syncRectButtons();
          });
      }, true);
    }

    let rectProg = shell.querySelector('.lia-annot-rect-progress') as HTMLElement | null;
    if (!rectProg) {
      rectProg = document.createElement('div');
      rectProg.className = 'lia-annot-rect-progress';
      rectProg.dataset.on = '0';
      rectProg.innerHTML = '<div class="lia-annot-rect-progbar"><div class="lia-annot-rect-progfill"></div></div><div class="lia-annot-rect-progtxt">0%</div>';
      shell.appendChild(rectProg);
      rectProg.addEventListener('pointerdown', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
      }, true);
    }

    let clearBtn = shell.querySelector('.lia-annot-rect-clear') as HTMLButtonElement | null;
    if (!clearBtn) {
      clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'lia-annot-rect-clear';
      clearBtn.setAttribute('aria-label', tUi('rectClearAria'));
      clearBtn.textContent = '×';
      clearBtn.style.display = 'none';
      shell.appendChild(clearBtn);
      clearBtn.addEventListener('pointerdown', function (evt) { evt.preventDefault(); evt.stopPropagation(); }, true);
      clearBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        clearMarkedRect();
      }, true);
    }

    let chooseQuizBtn = shell.querySelector('.lia-annot-rect-choosequiz') as HTMLButtonElement | null;
    if (!chooseQuizBtn) {
      chooseQuizBtn = document.createElement('button');
      chooseQuizBtn.type = 'button';
      chooseQuizBtn.className = 'lia-annot-rect-choosequiz';
      chooseQuizBtn.textContent = tUi('rectChooseQuiz');
      chooseQuizBtn.style.display = 'none';
      shell.appendChild(chooseQuizBtn);
      chooseQuizBtn.addEventListener('pointerdown', function (evt) { evt.preventDefault(); evt.stopPropagation(); }, true);
      chooseQuizBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (_choosingQuiz) {
          exitQuizPickingMode();
        } else {
          enterQuizPickingMode();
        }
      }, true);
    }

    insertShellAfterHeader(host, shell);
    STATE.shell = shell;
    STATE.canvas = canvas;
    STATE.eraserRing = ring;
    STATE.ctx = STATE.canvas ? STATE.canvas.getContext('2d', { willReadFrequently: true }) : null;

    bindCanvasEvents();
    bindResizeObserver();
  } else {
    insertShellAfterHeader(host, STATE.shell!);
    STATE.canvas = STATE.shell!.querySelector('.lia-annot-canvas') as HTMLCanvasElement | null;
    STATE.eraserRing = STATE.shell!.querySelector('.lia-annot-eraser-ring') as HTMLElement | null;
  }

  if (slideChanged) STATE.slideKey = slideKey;
  syncOverlayInteractivity();
  syncRectButtons();
}

export function syncOverlayInteractivity(): void {
  const shells = Array.from(document.querySelectorAll('.lia-annot-shell')) as HTMLElement[];
  const mode = effectiveMode();
  const visible = !!STORE.ui.visible;

  for (let i = 0; i < shells.length; i++) {
    const shell = shells[i];
    const canvas = shell.querySelector('.lia-annot-canvas') as HTMLElement | null;
    shell.dataset.mode = 'cursor';
    shell.dataset.hidden = visible ? '0' : '1';
    shell.style.pointerEvents = 'none';
    shell.style.display = visible ? '' : 'none';
    if (canvas) {
      canvas.style.pointerEvents = 'none';
      canvas.style.touchAction = 'auto';
      canvas.style.cursor = 'default';
    }
  }

  if (!visible) { hideEraserRing(); return; }
  if (!STATE.shell || !STATE.canvas) { hideEraserRing(); return; }

  STATE.shell.style.display = '';
  STATE.shell.dataset.hidden = '0';
  STATE.shell.dataset.mode = mode;
  STATE.shell.style.pointerEvents = 'none';

  if (mode === 'pen' || mode === 'eraser' || mode === 'rect') {
    STATE.canvas.style.pointerEvents = 'auto';
    STATE.canvas.style.touchAction = 'none';
    STATE.canvas.style.cursor = 'crosshair';
  } else {
    STATE.canvas.style.pointerEvents = 'none';
    STATE.canvas.style.touchAction = 'auto';
    STATE.canvas.style.cursor = 'default';
  }

  if (mode === 'eraser') { refreshEraserRing(); } else { hideEraserRing(); }
  syncRectButtons();
}

export function syncCanvasSize(): void {
  if (!STATE.host || !STATE.canvas || !STATE.ctx || !STATE.shell) return;
  STATE.dpr = window.devicePixelRatio || 1;

  const hostRect = STATE.host.getBoundingClientRect();
  const cssW = getViewportWidth();

  // Measure the visible slide area, not the full <main> scroll height.
  // Try .lia-slide or <section> inside the host first; fall back to the
  // host's bounding rect, then clip to window.innerHeight so the canvas
  // never balloons beyond the viewport on short slides.
  const slide = STATE.host.querySelector<HTMLElement>('.lia-slide, section');
  let cssH: number;
  if (slide) {
    const slideRect = slide.getBoundingClientRect();
    cssH = Math.max(1, Math.ceil(slideRect.height || 0));
  } else {
    cssH = Math.max(1, Math.ceil(hostRect.height || 0));
  }
  cssH = Math.min(cssH, window.innerHeight);

  const offsetLeft = Math.round(-hostRect.left);
  STATE.cssW = cssW;
  STATE.cssH = cssH;

  STATE.shell.style.left = offsetLeft + 'px';
  STATE.shell.style.top = '0px';
  STATE.shell.style.width = cssW + 'px';
  STATE.shell.style.height = cssH + 'px';
  STATE.canvas.style.width = cssW + 'px';
  STATE.canvas.style.height = cssH + 'px';

  const pxW = Math.max(1, Math.round(cssW * STATE.dpr));
  const pxH = Math.max(1, Math.round(cssH * STATE.dpr));
  if (STATE.canvas.width !== pxW) STATE.canvas.width = pxW;
  if (STATE.canvas.height !== pxH) STATE.canvas.height = pxH;

  refreshEraserRing();
  syncRectButtons();
}

export function requestSync(): void {
  if (STATE.syncRAF) return;
  STATE.syncRAF = requestAnimationFrame(function () {
    STATE.syncRAF = 0;
    ensureOverlay();
    syncCanvasSize();
    import('./ui').then(({ syncToolbarPosition }) => syncToolbarPosition());
    requestRedraw();
  });
}

// ----- Rendering -----

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha: number, erase: boolean): void {
  ctx.save();
  ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';
  ctx.globalAlpha = erase ? 1 : clamp(Number(alpha || 1), 0.05, 1);
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
  ctx.fillStyle = erase ? '#000' : String(color || '#000');
  ctx.fill();
  ctx.restore();
}

function drawItem(ctx: CanvasRenderingContext2D, item: import('./types').PathItem): void {
  if (!item || item.kind !== 'path' || !Array.isArray(item.points) || item.points.length === 0) return;

  const erase = (item.tool === 'eraser');
  const widthPx = getLineWidthPx(item);
  const alpha = clamp(Number(item.alpha || 1), 0.05, 1);
  const color = String(item.color || '#000');

  if (item.points.length === 1) {
    const p = fromRel(item.points[0]);
    drawDot(ctx, p.x, p.y, widthPx / 2, color, alpha, erase);
    return;
  }

  ctx.save();
  ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';
  ctx.globalAlpha = erase ? 1 : alpha;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = widthPx;
  ctx.strokeStyle = erase ? '#000' : color;

  // Quadratic Bézier smoothing: use midpoints between consecutive recorded
  // points as the curve endpoints, and each recorded point as the control
  // point. This produces a smooth curve that passes near all input points
  // without introducing overshoot.
  ctx.beginPath();
  const pts = item.points.map(fromRel);
  ctx.moveTo(pts[0].x, pts[0].y);
  if (pts.length === 2) {
    ctx.lineTo(pts[1].x, pts[1].y);
  } else {
    // Move to midpoint between first and second point
    ctx.lineTo((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2);
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      const my = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
    }
    // End at the last point
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
  }
  ctx.stroke();
  ctx.restore();
}

export function redrawNow(): void {
  if (!STATE.canvas || !STATE.ctx) return;
  const ctx = STATE.ctx;
  ctx.setTransform(STATE.dpr, 0, 0, STATE.dpr, 0, 0);
  ctx.clearRect(0, 0, STATE.cssW, STATE.cssH);
  if (!STORE.ui.visible) return;
  const slide = ensureSlide(STATE.slideKey || getSlideKey());
  for (let i = 0; i < slide.items.length; i++) {
    drawItem(ctx, slide.items[i]);
  }

  const drawRect = function (rect: MarkRect, committed: boolean): void {
    const x = Math.min(rect.x0, rect.x1);
    const y = Math.min(rect.y0, rect.y1);
    const w = Math.max(1, Math.abs(rect.x1 - rect.x0));
    const h = Math.max(1, Math.abs(rect.y1 - rect.y0));
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--lia-annot-accent').trim() || '#3b82f6';
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = committed ? 0.22 : 0.16;
    ctx.fillStyle = accent;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 0.95;
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = accent;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  };

  if (_markedRect) drawRect(_markedRect, true);
  if (_draftRect) drawRect(_draftRect, false);
  syncRectButtons();
}

export function requestRedraw(): void {
  if (STATE.redrawRAF) return;
  STATE.redrawRAF = requestAnimationFrame(function () {
    STATE.redrawRAF = 0;
    redrawNow();
    updateToolbar();
  });
}
