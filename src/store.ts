// ROOT/STORE/STATE singletons, dedup guard, and pure helper functions
// that operate only on STORE/STATE and primitive browser APIs.

import type { Mode, Point, PathItem, SlideData, Store, State } from './types';

type RootWindow = Window & { [key: string]: unknown };

function getRootWindow(): RootWindow {
  let w = window as unknown as RootWindow;
  try {
    while (w.parent && w.parent !== (w as unknown as Window)) {
      w = w.parent as unknown as RootWindow;
    }
  } catch (_) { }
  return w;
}

export const ROOT: RootWindow = getRootWindow();
export const DOC_ID: string = document.baseURI || location.href || 'doc';
const REGKEY = '__LIA_ANNOTATION_REG_V8__';
const STOREKEY = '__LIA_ANNOTATION_STORE_V8__';

ROOT[REGKEY] = ROOT[REGKEY] || { docs: {} };
const _reg = ROOT[REGKEY] as { docs: Record<string, boolean> };
export const IS_DUPLICATE: boolean = !!_reg.docs[DOC_ID];
_reg.docs[DOC_ID] = true;

ROOT[STOREKEY] = ROOT[STOREKEY] || {
  slides: {} as Record<string, SlideData>,
  ui: {
    mode: 'cursor' as Mode,
    visible: true,
    panelOpen: false,
    panelMode: 'pen' as 'pen',
    color: '#ff0000',
    width: 3,
    alpha: 1,
    eraserWidth: 18,
    ocrBusy: false,
    ocrDraft: '',
    ocrFailed: false,
    forcedReadOnly: null as boolean | null
  }
};

export const STORE: Store = ROOT[STOREKEY] as Store;
if (typeof STORE.ui.ocrBusy !== 'boolean') STORE.ui.ocrBusy = false;
if (typeof STORE.ui.ocrDraft !== 'string') STORE.ui.ocrDraft = '';
if (typeof STORE.ui.ocrFailed !== 'boolean') STORE.ui.ocrFailed = false;

export const STATE: State = {
  host: null,
  shell: null,
  canvas: null,
  ctx: null,
  slideKey: null,
  cssW: 0,
  cssH: 0,
  dpr: window.devicePixelRatio || 1,
  drawing: false,
  activePath: null,
  syncRAF: 0,
  redrawRAF: 0,
  resizeObserver: null,
  toolbar: null,
  eraserRing: null,
  lastPointer: { x: 0, y: 0, inside: false, pointerType: '' }
};

// ----- Pure helpers -----

export function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

export function copyJson<T>(x: T): T | null {
  try { return JSON.parse(JSON.stringify(x)); }
  catch (_) { return null; }
}

export function parseRgbNoRegex(s: string): [number, number, number] | null {
  const str = String(s || '');
  const i0 = str.indexOf('(');
  const i1 = str.indexOf(')');
  if (i0 < 0 || i1 < 0) return null;
  const parts = str.slice(i0 + 1, i1).split(',').map(v => Number(String(v).trim()));
  if (parts.length < 3) return null;
  if (!isFinite(parts[0]) || !isFinite(parts[1]) || !isFinite(parts[2])) return null;
  return [parts[0], parts[1], parts[2]];
}

export function luminance(rgb: [number, number, number]): number {
  const arr = rgb.map(v => v / 255).map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * arr[0] + 0.7152 * arr[1] + 0.0722 * arr[2];
}

export function getViewportWidth(): number {
  return Math.max(
    1,
    window.innerWidth || 0,
    document.documentElement ? document.documentElement.clientWidth || 0 : 0
  );
}

export function getCurrentHash(): string {
  const h = String(location.hash || '').trim();
  return h || '#1';
}

export function getSlideKey(): string {
  return getCurrentHash();
}

export function ensureSlide(key: string): SlideData {
  STORE.slides[key] = STORE.slides[key] || { items: [], redo: [], widgets: [] };
  if (!Array.isArray((STORE.slides[key] as SlideData).widgets)) {
    (STORE.slides[key] as SlideData).widgets = [];
  }
  return STORE.slides[key];
}

export function currentSlide(): SlideData {
  return ensureSlide(getSlideKey());
}

export function toRel(x: number, y: number): Point {
  return {
    x: STATE.cssW > 0 ? x / STATE.cssW : 0,
    y: STATE.cssH > 0 ? y / STATE.cssH : 0
  };
}

export function fromRel(pt: Point): Point {
  return {
    x: (pt && isFinite(pt.x)) ? pt.x * STATE.cssW : 0,
    y: (pt && isFinite(pt.y)) ? pt.y * STATE.cssH : 0
  };
}

export function isReadOnly(): boolean {
  if (STORE.ui.forcedReadOnly === true) return true;
  if (STORE.ui.forcedReadOnly === false) return false;
  const body = document.body;
  if (!body) return false;
  return (
    body.classList.contains('lia-snapshot-mode') ||
    body.classList.contains('lia-shared-freeze-link') ||
    body.classList.contains('lia-freeze-mode')
  );
}

export function effectiveMode(): Mode {
  if (!STORE.ui.visible) return 'cursor';
  if (isReadOnly()) return 'cursor';
  return STORE.ui.mode || 'cursor';
}

export function getLineWidthPx(item: PathItem): number {
  const baseW = Math.max(1, Number(item && item.baseW) || STATE.cssW || 1);
  const curW = Math.max(1, STATE.cssW || 1);
  const w = Math.max(0.75, Number(item && item.width) || 1);
  return Math.max(0.75, w * (curW / baseW));
}
