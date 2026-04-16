// Everything that happens on the canvas: host detection, shell/canvas lifecycle,
// resize observation, canvas event binding, drawing, and sync scheduling.

import { STORE, STATE, clamp, toRel, fromRel, getSlideKey, ensureSlide, isReadOnly, effectiveMode, getLineWidthPx, getViewportWidth } from './store';
import { updateToolbar, hideEraserRing, updateEraserRing, refreshEraserRing } from './ui';

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

  STATE.canvas.addEventListener('pointerdown', function (evt: PointerEvent) {
    if (evt.pointerType === 'mouse' && evt.button !== 0) return;
    const p = rememberPointer(evt);
    if (!STORE.ui.visible || isReadOnly()) { hideEraserRing(); return; }
    const mode = effectiveMode();
    if (mode === 'eraser') { updateEraserRing(p.x, p.y); } else { hideEraserRing(); }
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
    if (!STATE.drawing || !STATE.activePath) return;
    evt.preventDefault();
    evt.stopPropagation();
    addPoint(STATE.activePath, p.x, p.y);
    requestRedraw();
  }, true);

  STATE.canvas.addEventListener('pointerup', function (evt: PointerEvent) { finishStroke(evt, true); }, true);
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

  if (mode === 'pen' || mode === 'eraser') {
    STATE.canvas.style.pointerEvents = 'auto';
    STATE.canvas.style.touchAction = 'none';
    STATE.canvas.style.cursor = 'crosshair';
  } else {
    STATE.canvas.style.pointerEvents = 'none';
    STATE.canvas.style.touchAction = 'auto';
    STATE.canvas.style.cursor = 'default';
  }

  if (mode === 'eraser') { refreshEraserRing(); } else { hideEraserRing(); }
}

export function syncCanvasSize(): void {
  if (!STATE.host || !STATE.canvas || !STATE.ctx || !STATE.shell) return;
  STATE.dpr = window.devicePixelRatio || 1;

  const hostRect = STATE.host.getBoundingClientRect();
  const cssW = getViewportWidth();
  const cssH = Math.max(1, Math.ceil(Math.max(
    (STATE.host as HTMLElement).scrollHeight || 0,
    (STATE.host as HTMLElement).clientHeight || 0,
    hostRect.height || 0
  )));

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

  ctx.beginPath();
  const p0 = fromRel(item.points[0]);
  ctx.moveTo(p0.x, p0.y);
  for (let i = 1; i < item.points.length; i++) {
    const p = fromRel(item.points[i]);
    ctx.lineTo(p.x, p.y);
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
}

export function requestRedraw(): void {
  if (STATE.redrawRAF) return;
  STATE.redrawRAF = requestAnimationFrame(function () {
    STATE.redrawRAF = 0;
    redrawNow();
    updateToolbar();
  });
}
