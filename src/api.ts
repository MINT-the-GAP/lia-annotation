// Everything exposed to the outside world: undo/redo/clear, freeze
// serialization helpers, export/import, setVisible/setReadOnly,
// and the window.__LIA_ANNOTATION__ global.

import type { Mode, Point, PathItem, SlideData } from './types';
import { STORE, STATE, copyJson, getSlideKey, ensureSlide, currentSlide } from './store';
import { ensureOverlay, syncOverlayInteractivity, requestSync, requestRedraw } from './overlay';
import { updateToolbar } from './ui';

// ----- Undo / Redo / Clear -----

export function doUndo(): void {
  const s = currentSlide();
  if (!s.items.length) return;
  s.redo.push(s.items.pop()!);
  requestRedraw();
  updateToolbar();
}

export function doRedo(): void {
  const s = currentSlide();
  if (!s.redo.length) return;
  s.items.push(s.redo.pop()!);
  requestRedraw();
  updateToolbar();
}

export function clearSlide(): void {
  const s = currentSlide();
  s.items = [];
  s.redo = [];
  requestRedraw();
  updateToolbar();
}

export function clearAllSlides(): void {
  STORE.slides = {};
  ensureSlide(getSlideKey());
  requestRedraw();
  updateToolbar();
}

// ----- Freeze helpers -----

export function roundFreezeNum(v: unknown): number | null {
  const n = Number(v);
  if (!isFinite(n)) return null;
  return Math.round(n * 10000) / 10000;
}

export function sanitizeFreezePoint(pt: unknown): Point | null {
  if (!pt || typeof pt !== 'object') return null;
  const obj = pt as Record<string, unknown>;
  const x = roundFreezeNum(obj.x);
  const y = roundFreezeNum(obj.y);
  if (x === null || y === null) return null;
  return { x, y };
}

export function sanitizeFreezeItem(item: unknown): PathItem | null {
  if (!item || typeof item !== 'object') return null;
  const obj = item as Record<string, unknown>;
  if (obj.kind !== 'path') return null;

  const pts = Array.isArray(obj.points)
    ? obj.points.map(sanitizeFreezePoint).filter((p): p is Point => p !== null)
    : [];
  if (!pts.length) return null;

  const tool = (obj.tool === 'eraser') ? 'eraser' : 'pen';
  const width = roundFreezeNum(obj.width);
  const alpha = roundFreezeNum(obj.alpha == null ? 1 : obj.alpha);
  const baseW = roundFreezeNum(obj.baseW);

  return {
    kind: 'path',
    tool: tool as Mode,
    color: String(obj.color || '#ff0000'),
    width: width === null ? 1 : width,
    alpha: alpha === null ? 1 : alpha,
    baseW: baseW === null ? 1 : baseW,
    points: pts
  };
}

export function sanitizeFreezeSlides(srcSlides: unknown): Record<string, SlideData> {
  const out: Record<string, SlideData> = {};
  if (!srcSlides || typeof srcSlides !== 'object') return out;
  const src = srcSlides as Record<string, unknown>;
  for (const k in src) {
    if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
    const slide = src[k];
    if (!slide || typeof slide !== 'object') continue;
    const slideObj = slide as Record<string, unknown>;
    const items = Array.isArray(slideObj.items)
      ? slideObj.items.map(sanitizeFreezeItem).filter((x): x is PathItem => x !== null)
      : [];
    if (!items.length) continue;
    out[String(k)] = { items, redo: [] };
  }
  return out;
}

export function hasFreezeData(): boolean {
  const slides = sanitizeFreezeSlides(STORE.slides);
  for (const k in slides) {
    if (Object.prototype.hasOwnProperty.call(slides, k)) return true;
  }
  return false;
}

// ----- Export / Import -----

export function exportState(): unknown {
  return copyJson({
    version: 'lia-annotation-v8',
    ui: { visible: !!STORE.ui.visible },
    slides: STORE.slides
  });
}

export function exportFreezeState(): unknown {
  return copyJson({
    version: 'lia-annotation-freeze-v1',
    ui: { visible: !!STORE.ui.visible },
    slides: sanitizeFreezeSlides(STORE.slides)
  });
}

export function importState(payload: unknown, opts?: { replace?: boolean }): boolean {
  const o = (opts && typeof opts === 'object') ? opts : {};
  const replace = (o.replace !== false);
  if (!payload || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;

  if (replace) STORE.slides = {};
  if (p.slides && typeof p.slides === 'object') {
    const srcSlides = p.slides as Record<string, unknown>;
    for (const k in srcSlides) {
      if (!Object.prototype.hasOwnProperty.call(srcSlides, k)) continue;
      const src = srcSlides[k] as Record<string, unknown>;
      if (!src || typeof src !== 'object') continue;
      STORE.slides[k] = {
        items: Array.isArray(src.items) ? copyJson(src.items) as PathItem[] : [],
        redo: Array.isArray(src.redo) ? copyJson(src.redo) as PathItem[] : []
      };
    }
  }
  if (p.ui && typeof p.ui === 'object') {
    const ui = p.ui as Record<string, unknown>;
    if (typeof ui.visible === 'boolean') STORE.ui.visible = ui.visible;
  }

  ensureSlide(getSlideKey());
  ensureOverlay();
  syncOverlayInteractivity();
  requestSync();
  requestRedraw();
  updateToolbar();
  return true;
}

export function importFreezeState(payload: unknown, opts?: { replace?: boolean }): boolean {
  const o = (opts && typeof opts === 'object') ? opts : {};
  const replace = (o.replace !== false);
  if (!payload || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;

  if (replace) STORE.slides = {};
  const slides = sanitizeFreezeSlides(p.slides);
  for (const k in slides) {
    if (!Object.prototype.hasOwnProperty.call(slides, k)) continue;
    STORE.slides[k] = { items: copyJson(slides[k].items) as PathItem[] || [], redo: [] };
  }
  if (p.ui && typeof p.ui === 'object') {
    const ui = p.ui as Record<string, unknown>;
    if (typeof ui.visible === 'boolean') STORE.ui.visible = ui.visible;
  }

  ensureSlide(getSlideKey());
  ensureOverlay();
  syncOverlayInteractivity();
  requestSync();
  requestRedraw();
  updateToolbar();
  return true;
}

export function setVisible(v: boolean): void {
  STORE.ui.visible = !!v;
  syncOverlayInteractivity();
  requestRedraw();
  updateToolbar();
}

export function setReadOnly(v: boolean | null): void {
  STORE.ui.forcedReadOnly = (v === null) ? null : !!v;
  syncOverlayInteractivity();
  updateToolbar();
}

// ----- Register global API -----

export function registerGlobalApi(): void {
  window.__LIA_ANNOTATION__ = {
    exportState,
    exportFreezeState,
    importState,
    importFreezeState,
    hasFreezeData,
    setVisible,
    toggleVisible: () => setVisible(!STORE.ui.visible),
    setReadOnly,
    clearSlide,
    clearAllSlides,
    refresh: function () { ensureOverlay(); requestSync(); updateToolbar(); },
    getStore: function () { return copyJson(STORE); },
    getSlideKey: function () { return getSlideKey(); }
  };

  window.__LIA_ANNOTATION_EXPORT__ = function () { return exportState(); };
  window.__LIA_ANNOTATION_IMPORT__ = function (payload, opts) { return importState(payload, opts); };
  window.__LIA_ANNOTATION_FREEZE_EXPORT__ = function () { return exportFreezeState(); };
  window.__LIA_ANNOTATION_FREEZE_IMPORT__ = function (payload, opts) { return importFreezeState(payload, opts); };
  window.__LIA_ANNOTATION_FREEZE_HAS_DATA__ = function () { return hasFreezeData(); };
}
