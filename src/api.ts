// Everything exposed to the outside world: undo/redo/clear, freeze
// serialization helpers, export/import, setVisible/setReadOnly,
// and the window.__LIA_ANNOTATION__ global.

import type { Mode, Point, PathItem, SlideData, LiaTexOcrEngine } from './types';
import { STORE, STATE, ROOT, clamp, copyJson, getSlideKey, ensureSlide, currentSlide, isReadOnly, getLineWidthPx, fromRel } from './store';
import { ensureOverlay, syncOverlayInteractivity, requestSync, requestRedraw, getMarkedRect, getVisibleMainHost, getPinnedQuizTarget, startDgsPlacementMode } from './overlay';
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
  s.widgets = [];
  requestRedraw();
  updateToolbar();
}

export function clearAllSlides(): void {
  STORE.slides = {};
  ensureSlide(getSlideKey());
  requestRedraw();
  updateToolbar();
}

// ----- OCR integration -----

type BBox = { x: number; y: number; w: number; h: number };
type AnnotationSource = { box: BBox; paths: PathItem[] };

function pickOcrEngine(host: unknown): LiaTexOcrEngine | null {
  if (!host || typeof host !== 'object') return null;

  const obj = host as Record<string, unknown>;

  const tex = obj.__LIA_TEX_OCR__ as LiaTexOcrEngine | undefined;
  if (tex && typeof tex.recognize === 'function') return tex;

  const canvasGlobal = obj.__LIA_CANVAS_OCR__ as Record<string, unknown> | undefined;
  const canvasOcr = canvasGlobal && (canvasGlobal.ocr as LiaTexOcrEngine | undefined);
  if (canvasOcr && typeof canvasOcr.recognize === 'function') return canvasOcr;

  return null;
}

function getOcrEngine(): LiaTexOcrEngine | null {
  const own = pickOcrEngine(window);
  if (own) return own;

  try {
    const rootCandidate = pickOcrEngine(ROOT as unknown as Window);
    if (rootCandidate) return rootCandidate;
  } catch (_) { }

  try {
    const parentCandidate = window.parent && window.parent !== window
      ? pickOcrEngine(window.parent as unknown as Window)
      : null;
    if (parentCandidate) return parentCandidate;
  } catch (_) { }

  try {
    const topCandidate = window.top && window.top !== window
      ? pickOcrEngine(window.top as unknown as Window)
      : null;
    if (topCandidate) return topCandidate;
  } catch (_) { }

  return null;
}

export function isOcrAvailable(): boolean {
  return !!getOcrEngine();
}

export function shouldPromptDgsInsert(): boolean {
  return false;
}

function getPathBBox(item: PathItem): BBox | null {
  if (!item || item.kind !== 'path' || item.tool !== 'pen' || !Array.isArray(item.points) || !item.points.length) return null;

  let xMin = Infinity;
  let yMin = Infinity;
  let xMax = -Infinity;
  let yMax = -Infinity;

  for (let i = 0; i < item.points.length; i++) {
    const pt = fromRel(item.points[i]);
    if (!isFinite(pt.x) || !isFinite(pt.y)) continue;
    if (pt.x < xMin) xMin = pt.x;
    if (pt.y < yMin) yMin = pt.y;
    if (pt.x > xMax) xMax = pt.x;
    if (pt.y > yMax) yMax = pt.y;
  }

  if (!isFinite(xMin) || !isFinite(yMin) || !isFinite(xMax) || !isFinite(yMax)) return null;

  const pad = Math.max(2, getLineWidthPx(item) * 0.8);
  return {
    x: xMin - pad,
    y: yMin - pad,
    w: Math.max(1, (xMax - xMin) + 2 * pad),
    h: Math.max(1, (yMax - yMin) + 2 * pad)
  };
}

function unionBox(a: BBox | null, b: BBox | null): BBox | null {
  if (!a) return b;
  if (!b) return a;
  const x0 = Math.min(a.x, b.x);
  const y0 = Math.min(a.y, b.y);
  const x1 = Math.max(a.x + a.w, b.x + b.w);
  const y1 = Math.max(a.y + a.h, b.y + b.h);
  return { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
}

function boxDistance(a: BBox, b: BBox): number {
  const ax0 = a.x;
  const ay0 = a.y;
  const ax1 = a.x + a.w;
  const ay1 = a.y + a.h;
  const bx0 = b.x;
  const by0 = b.y;
  const bx1 = b.x + b.w;
  const by1 = b.y + b.h;

  const dx = Math.max(0, Math.max(bx0 - ax1, ax0 - bx1));
  const dy = Math.max(0, Math.max(by0 - ay1, ay0 - by1));
  return Math.hypot(dx, dy);
}

function getRecentAnnotationSource(): AnnotationSource | null {
  const slide = currentSlide();
  if (!slide || !Array.isArray(slide.items) || !slide.items.length) return null;

  const recent: Array<{ item: PathItem; box: BBox }> = [];
  for (let i = slide.items.length - 1; i >= 0; i--) {
    const item = slide.items[i];
    const box = getPathBBox(item);
    if (!box) continue;
    recent.push({ item, box });
    if (recent.length >= 18) break;
  }

  if (!recent.length) return null;

  const selected: Array<{ item: PathItem; box: BBox }> = [recent[0]];
  let cluster: BBox | null = recent[0].box;

  for (let i = 1; i < recent.length; i++) {
    if (!cluster) break;
    if (boxDistance(cluster, recent[i].box) > 120) break;
    selected.push(recent[i]);
    cluster = unionBox(cluster, recent[i].box);
  }

  if (!cluster) return null;
  return {
    box: cluster,
    paths: selected.map(v => v.item)
  };
}

function renderAnnotationSourceToCanvas(source: AnnotationSource): HTMLCanvasElement | null {
  if (!source || !source.box || !Array.isArray(source.paths) || !source.paths.length) return null;

  const pad = 16;
  const rawW = Math.max(1, Math.ceil(source.box.w + 2 * pad));
  const rawH = Math.max(1, Math.ceil(source.box.h + 2 * pad));

  const maxSide = Math.max(rawW, rawH);
  const scale = Math.max(1, Math.min(3, maxSide < 380 ? (380 / maxSide) : 1));

  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(rawW * scale));
  c.height = Math.max(1, Math.round(rawH * scale));
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, rawW, rawH);
  ctx.strokeStyle = '#000';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 1;

  const offX = source.box.x - pad;
  const offY = source.box.y - pad;

  for (let i = 0; i < source.paths.length; i++) {
    const item = source.paths[i];
    if (!item || !Array.isArray(item.points) || !item.points.length) continue;

    const widthPx = Math.max(1.1, getLineWidthPx(item));
    ctx.lineWidth = widthPx;
    ctx.beginPath();

    const p0 = fromRel(item.points[0]);
    const x0 = p0.x - offX;
    const y0 = p0.y - offY;

    if (item.points.length === 1) {
      ctx.arc(x0, y0, widthPx / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      continue;
    }

    ctx.moveTo(x0, y0);
    for (let j = 1; j < item.points.length; j++) {
      const p = fromRel(item.points[j]);
      ctx.lineTo(p.x - offX, p.y - offY);
    }
    ctx.stroke();
  }

  return c;
}

function isElementVisible(el: Element): boolean {
  if (!el || !(el instanceof Element) || !el.isConnected) return false;
  const r = el.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return false;
  const cs = getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden') return false;
  return true;
}

function isEditableInputField(el: Element): boolean {
  if (!el || !(el instanceof Element)) return false;
  if (!isElementVisible(el)) return false;
  if (el.closest('.lia-annot-toolbar, .lia-annot-panel')) return false;

  if (el.matches('input')) {
    const input = el as HTMLInputElement;
    const type = String(input.type || 'text').toLowerCase();
    if (input.disabled || input.readOnly) return false;
    return type === 'text' || type === 'search' || type === 'url' || type === 'email' || type === 'tel' || type === 'number';
  }

  if (el.matches('textarea')) {
    const area = el as HTMLTextAreaElement;
    return !area.disabled && !area.readOnly;
  }

  if (el.getAttribute('contenteditable') === 'true') return true;
  if (el.getAttribute('role') === 'textbox' && el.getAttribute('aria-readonly') !== 'true') return true;
  return false;
}

function getQuizInputCandidates(): Element[] {
  const host = getVisibleMainHost();
  const selector = 'input[type="text"], input:not([type]), textarea, [contenteditable="true"], [role="textbox"]';

  const hostNodes = host
    ? Array.from(host.querySelectorAll(selector))
    : [];

  const fallbackNodes = hostNodes.length
    ? []
    : Array.from(document.querySelectorAll(selector));

  return (hostNodes.length ? hostNodes : fallbackNodes).filter(isEditableInputField);
}

function isLikelyQuizField(el: Element): boolean {
  const quizLike = el.closest(
    '.quiz, .lia-quiz, .lia-question, .lia-exercise, [class*="quiz"], [class*="exercise"], [id*="quiz"]'
  );
  return !!quizLike;
}

function findNearestQuizInputForSource(source: AnnotationSource): Element | null {
  if (!source || !source.box || !STATE.canvas) return null;
  const candidates = getQuizInputCandidates();
  if (!candidates.length) return null;

  const r = STATE.canvas.getBoundingClientRect();
  const ax = r.left + source.box.x + source.box.w / 2;
  const ay = r.top + source.box.y + source.box.h / 2;

  let best: Element | null = null;
  let bestDist = Infinity;

  for (let i = 0; i < candidates.length; i++) {
    const cr = candidates[i].getBoundingClientRect();
    const cx = cr.left + cr.width / 2;
    const cy = cr.top + cr.height / 2;
    const d = Math.hypot(cx - ax, cy - ay);
    if (d < bestDist) {
      bestDist = d;
      best = candidates[i];
    }
  }

  return best;
}

function findNearestQuizInputForBox(box: BBox): Element | null {
  if (!box || !STATE.canvas) return null;
  const candidates = getQuizInputCandidates();
  if (!candidates.length) return null;

  const preferred = candidates.filter(isLikelyQuizField);
  const pool = preferred.length ? preferred : candidates;

  const r = STATE.canvas.getBoundingClientRect();
  const ax = r.left + box.x + box.w / 2;
  const ay = r.top + box.y + box.h / 2;

  let best: Element | null = null;
  let bestDist = Infinity;

  for (let i = 0; i < pool.length; i++) {
    const cr = pool[i].getBoundingClientRect();
    const cx = cr.left + cr.width / 2;
    const cy = cr.top + cr.height / 2;
    const d = Math.hypot(cx - ax, cy - ay);
    if (d < bestDist) {
      bestDist = d;
      best = pool[i];
    }
  }

  return best;
}

function renderMarkedRectToCanvas(box: BBox): HTMLCanvasElement | null {
  if (!box || !STATE.canvas) return null;
  const dpr = STATE.dpr || window.devicePixelRatio || 1;

  const pad = 12;
  const sxCss = clamp(Math.floor(box.x - pad), 0, STATE.cssW);
  const syCss = clamp(Math.floor(box.y - pad), 0, STATE.cssH);
  const exCss = clamp(Math.ceil(box.x + box.w + pad), 0, STATE.cssW);
  const eyCss = clamp(Math.ceil(box.y + box.h + pad), 0, STATE.cssH);

  const swCss = Math.max(1, exCss - sxCss);
  const shCss = Math.max(1, eyCss - syCss);

  const sx = Math.round(sxCss * dpr);
  const sy = Math.round(syCss * dpr);
  const sw = Math.max(1, Math.round(swCss * dpr));
  const sh = Math.max(1, Math.round(shCss * dpr));

  const out = document.createElement('canvas');
  out.width = sw;
  out.height = sh;
  const ctx = out.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(STATE.canvas, sx, sy, sw, sh, 0, 0, out.width, out.height);

  // Normalize to black ink on white background for OCR robustness.
  const img = ctx.getImageData(0, 0, out.width, out.height);
  const data = img.data;
  for (let i = 0; i < data.length; i += 4) {
    const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    const v = lum < 210 ? 0 : 255;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  return out;
}

function applyValueToField(el: Element, value: string): boolean {
  const v = String(value == null ? '' : value);

  try {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.focus();
      el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
      ensureTexPreviewForField(el);
      return true;
    }

    if (el.getAttribute('contenteditable') === 'true' || el.getAttribute('role') === 'textbox') {
      (el as HTMLElement).focus();
      el.textContent = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      ensureTexPreviewForField(el);
      return true;
    }
  } catch (_) { }

  return false;
}

function cleanOcrText(s: unknown): string {
  let t = String(s == null ? '' : s).trim();
  if (!t) return '';
  if (t.startsWith('$$') && t.endsWith('$$')) t = t.slice(2, -2).trim();
  if (t.startsWith('$') && t.endsWith('$')) t = t.slice(1, -1).trim();
  if (t.startsWith('\\[') && t.endsWith('\\]')) t = t.slice(2, -2).trim();
  // Strip bare [...] wrapper that texify2 sometimes emits as a delimiter artifact.
  // Only strip when it is the outermost wrapper (not when brackets are part of math content).
  if (t.startsWith('[') && t.endsWith(']')) {
    const inner = t.slice(1, -1).trim();
    // Heuristic: if the inner part contains no unmatched '[' it was just a wrapper.
    let depth = 0;
    let isWrapper = true;
    for (const ch of inner) {
      if (ch === '[') depth++;
      else if (ch === ']') { if (depth === 0) { isWrapper = false; break; } depth--; }
    }
    if (isWrapper) t = inner;
  }
  // Strip leading/trailing \left[ ... \right] when used purely as outer delimiters.
  if (t.startsWith('\\left[') && t.endsWith('\\right]')) t = t.slice(6, -7).trim();
  t = t.replace(/\s+/g, ' ').trim();
  if (t.startsWith('\\mathrm{') && t.endsWith('}')) {
    t = t.slice(8, -1).replace(/~/g, '').trim();
  }
  t = normalizeTimesVsX(t);
  return t;
}

function normalizeTimesVsX(input: string): string {
  let s = String(input || '');
  if (s.indexOf('\\div') !== -1) s = s.replace(/\s*\\div\s*/g, ':');
  if (s.indexOf('\\times') === -1) return s;

  let out = '';
  let i = 0;
  while (i < s.length) {
    const at = s.indexOf('\\times', i);
    if (at < 0) {
      out += s.slice(i);
      break;
    }

    out += s.slice(i, at);

    let before = at - 1;
    while (before >= 0 && s[before] === ' ') before--;
    let after = at + 6;
    while (after < s.length && s[after] === ' ') after++;

    const prev = before >= 0 ? s[before] : '';
    const next = after < s.length ? s[after] : '';
    const isDigit = function (c: string): boolean { return c >= '0' && c <= '9'; };
    const isLower = function (c: string): boolean { return c >= 'a' && c <= 'z'; };

    if (isDigit(prev) && isDigit(next)) out += '\\cdot';
    else if (isLower(prev) || isLower(next)) out += 'x';
    else out += '\\cdot';

    i = at + 6;
  }

  return out;
}

function parseOcrResultText(result: unknown): string {
  if (typeof result === 'string') return cleanOcrText(result);
  if (result && typeof result === 'object') {
    const obj = result as Record<string, unknown>;
    const out = obj.text ?? obj.latex ?? obj.output ?? obj.result;
    if (typeof out === 'string') return cleanOcrText(out);
  }
  return '';
}

let _katexLoadPromise: Promise<unknown> | null = null;
let _lastOcrTarget: Element | null = null;
let _preferredModelReady = false;

async function ensurePreferredOcrModel(ocr: LiaTexOcrEngine): Promise<void> {
  if (_preferredModelReady) return;
  if (!ocr || typeof ocr.setModel !== 'function') {
    _preferredModelReady = true;
    return;
  }

  const current = String(ocr.model || '').trim().toLowerCase();
  if (current.includes('texify2')) {
    _preferredModelReady = true;
    return;
  }

  try {
    await ocr.setModel('Xenova/texify2');
  } catch (_) { }
  _preferredModelReady = true;
}

function normalizeSize(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const maxSide = Math.max(canvas.width, canvas.height);
  let scale = 1;
  if (maxSide < 420) scale = 420 / maxSide;
  if (maxSide > 1400) scale = 1400 / maxSide;
  if (Math.abs(scale - 1) < 0.06) return canvas;

  const out = document.createElement('canvas');
  out.width = Math.max(1, Math.round(canvas.width * scale));
  out.height = Math.max(1, Math.round(canvas.height * scale));
  const ctx = out.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0, out.width, out.height);
  return out;
}

function addPadding(canvas: HTMLCanvasElement, px: number): HTMLCanvasElement {
  const p = Math.max(0, Math.round(px));
  const out = document.createElement('canvas');
  out.width = canvas.width + p * 2;
  out.height = canvas.height + p * 2;
  const ctx = out.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, p, p);
  return out;
}

function darkenInk(canvas: HTMLCanvasElement, factor: number): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0);
  const img = ctx.getImageData(0, 0, out.width, out.height);
  const data = img.data;
  const f = Math.max(1, factor);
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    if (lum < 240) {
      data[i] = Math.max(0, Math.min(255, Math.round(data[i] / f)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(data[i + 1] / f)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(data[i + 2] / f)));
    }
  }
  ctx.putImageData(img, 0, 0);
  return out;
}

function preprocessOcrCanvas(src: HTMLCanvasElement): HTMLCanvasElement {
  const c0 = document.createElement('canvas');
  c0.width = Math.max(1, src.width | 0);
  c0.height = Math.max(1, src.height | 0);
  const x0 = c0.getContext('2d', { willReadFrequently: true });
  if (!x0) return src;

  x0.fillStyle = '#fff';
  x0.fillRect(0, 0, c0.width, c0.height);
  x0.drawImage(src, 0, 0);

  const img = x0.getImageData(0, 0, c0.width, c0.height);
  const d = img.data;
  const W = c0.width;
  const H = c0.height;
  const thr = 200;

  const bin = new Uint8Array(W * H);
  for (let i = 0, p = 0; p < bin.length; p++, i += 4) {
    bin[p] = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) < thr ? 1 : 0;
  }

  let xMin = W;
  let yMin = H;
  let xMax = -1;
  let yMax = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!bin[y * W + x]) continue;
      if (x < xMin) xMin = x;
      if (y < yMin) yMin = y;
      if (x > xMax) xMax = x;
      if (y > yMax) yMax = y;
    }
  }

  if (xMax < 0) return c0;

  const pad = 18;
  xMin = Math.max(0, xMin - pad);
  yMin = Math.max(0, yMin - pad);
  xMax = Math.min(W - 1, xMax + pad);
  yMax = Math.min(H - 1, yMax + pad);

  const cw = Math.max(1, xMax - xMin + 1);
  const ch = Math.max(1, yMax - yMin + 1);

  const c1 = document.createElement('canvas');
  c1.width = cw;
  c1.height = ch;
  const x1 = c1.getContext('2d', { willReadFrequently: true });
  if (!x1) return c0;

  const out1 = x1.createImageData(cw, ch);
  const od = out1.data;
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const v = bin[(yMin + y) * W + (xMin + x)] ? 0 : 255;
      const i = (y * cw + x) * 4;
      od[i] = v;
      od[i + 1] = v;
      od[i + 2] = v;
      od[i + 3] = 255;
    }
  }
  x1.putImageData(out1, 0, 0);

  const target = 512;
  const m = Math.max(cw, ch);
  let scale = target / m;
  if (scale < 0.75) scale = 0.75;
  if (scale > 3.5) scale = 3.5;

  const c2 = document.createElement('canvas');
  c2.width = Math.max(1, Math.round(cw * scale));
  c2.height = Math.max(1, Math.round(ch * scale));
  const x2 = c2.getContext('2d', { willReadFrequently: true });
  if (!x2) return c1;
  x2.fillStyle = '#fff';
  x2.fillRect(0, 0, c2.width, c2.height);
  x2.imageSmoothingEnabled = true;
  x2.drawImage(c1, 0, 0, c2.width, c2.height);

  return c2;
}

function mathLooksIncomplete(text: string): boolean {
  const t = String(text || '').trim();
  if (!t) return true;
  if (/[+\-*/=,:;\\]$/.test(t)) return true;
  if (/[{[(]$/.test(t)) return true;

  let curly = 0;
  let square = 0;
  let round = 0;
  let escaped = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '{') curly++;
    else if (ch === '}') curly--;
    else if (ch === '[') square++;
    else if (ch === ']') square--;
    else if (ch === '(') round++;
    else if (ch === ')') round--;
  }

  return curly !== 0 || square !== 0 || round !== 0;
}

function scoreLatex(text: string): number {
  const t = String(text || '').trim();
  if (!t) return -9999;
  if (mathLooksIncomplete(t)) return t.length - 5000;
  return t.length;
}

async function recognizeWithVoting(ocr: LiaTexOcrEngine, crop: HTMLCanvasElement): Promise<string> {
  const opts = {
    max_new_tokens: 128,
    do_sample: false,
    temperature: 0,
    __silent: true
  };

  let varA = normalizeSize(preprocessOcrCanvas(crop));
  let varB = normalizeSize(addPadding(preprocessOcrCanvas(crop), 20));
  let varC = normalizeSize(preprocessOcrCanvas(darkenInk(crop, 1.35)));

  const [rawA, rawB, rawC] = await Promise.all([
    ocr.recognize(varA, opts).catch(() => ''),
    ocr.recognize(varB, opts).catch(() => ''),
    ocr.recognize(varC, opts).catch(() => '')
  ]);

  const a = parseOcrResultText(rawA);
  const b = parseOcrResultText(rawB);
  const c = parseOcrResultText(rawC);

  const sa = scoreLatex(a);
  const sb = scoreLatex(b);
  const sc = scoreLatex(c);
  if (sa >= sb && sa >= sc) return a;
  if (sb >= sc) return b;
  return c;
}

function ensureKatexLoaded(): Promise<unknown> {
  const root = ROOT as unknown as Window & { katex?: unknown; KaTeX?: unknown };
  const own = window as Window & { katex?: unknown; KaTeX?: unknown };
  const existing = own.katex || root.katex || own.KaTeX || root.KaTeX;
  if (existing && typeof (existing as Record<string, unknown>).render === 'function') {
    return Promise.resolve(existing);
  }

  if (_katexLoadPromise) return _katexLoadPromise;

  _katexLoadPromise = (async function () {
    const doc = root.document || document;
    if (!doc.getElementById('__lia_annot_katex_css_v1')) {
      const link = doc.createElement('link');
      link.id = '__lia_annot_katex_css_v1';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';
      (doc.head || doc.documentElement).appendChild(link);
    }

    const mod = await (new Function('u', 'return import(u)'))('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.mjs');
    const katex = (mod as Record<string, unknown>).default || mod;
    if (!katex || typeof (katex as Record<string, unknown>).render !== 'function') {
      throw new Error('KaTeX render not available');
    }

    try { if (!root.katex) root.katex = katex; } catch (_) { }
    try { if (!own.katex) own.katex = katex; } catch (_) { }
    return katex;
  })();

  return _katexLoadPromise;
}

function readFieldValue(el: Element | null): string {
  try {
    if (!el) return '';
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return String(el.value || '');
    if (el.getAttribute('contenteditable') === 'true' || el.getAttribute('role') === 'textbox') {
      return String((el as HTMLElement).textContent || '');
    }
  } catch (_) { }
  return '';
}

function renderLatexPreview(target: HTMLElement, latex: string): void {
  const src = cleanOcrText(latex);
  target.innerHTML = '';
  if (!src) return;

  const root = ROOT as unknown as Window & { katex?: unknown; KaTeX?: unknown };
  const own = window as Window & { katex?: unknown; KaTeX?: unknown };
  const katex = own.katex || root.katex || own.KaTeX || root.KaTeX;

  try {
    if (katex && typeof (katex as Record<string, unknown>).render === 'function') {
      (katex as { render: (s: string, t: HTMLElement, o: Record<string, unknown>) => void })
        .render(src, target, { throwOnError: false, displayMode: false });
      return;
    }
  } catch (_) { }

  target.textContent = src;
  ensureKatexLoaded().then(function (loaded) {
    if (!target.isConnected) return;
    target.innerHTML = '';
    try {
      (loaded as { render: (s: string, t: HTMLElement, o: Record<string, unknown>) => void })
        .render(src, target, { throwOnError: false, displayMode: false });
    } catch (_) {
      target.textContent = src;
    }
  }).catch(function () {
    if (!target.isConnected) return;
    target.textContent = src;
  });
}

function ensureTexPreviewForField(el: Element): void {
  if (!isEditableInputField(el)) return;
  const host = el as HTMLElement;

  if ((host as unknown as { __liaAnnotTexReady?: boolean }).__liaAnnotTexReady) {
    const sync = (host as unknown as { __liaAnnotTexSync?: () => void }).__liaAnnotTexSync;
    if (sync) sync();
    return;
  }

  const box = document.createElement('span');
  box.className = 'lia-annot-tex-preview';
  box.dataset.on = '0';
  box.innerHTML = '<span class="lia-annot-tex-preview-math"></span><span class="lia-annot-tex-preview-hint">TeX</span>';

  host.insertAdjacentElement('afterend', box);

  const hasQuizStateColor = function (node: Element): boolean {
    const cls = node.classList;
    if (!cls) return false;
    if (cls.contains('is-success')) return true;
    if (cls.contains('is-failure')) return true;
    if (cls.contains('is-warning')) return true;
    if (cls.contains('is-partial')) return true;
    if (cls.contains('is-resolved')) return true;
    if (node.getAttribute('aria-invalid') === 'true') return true;
    return false;
  };

  const isUsableCssColor = function (v: string): boolean {
    const s = String(v || '').trim().toLowerCase();
    if (!s || s === 'transparent') return false;
    if (s === 'rgba(0, 0, 0, 0)' || s === 'rgba(0,0,0,0)') return false;
    return true;
  };

  const syncBorder = function (): void {
    box.style.removeProperty('--lia-annot-tex-preview-border');
    if (!hasQuizStateColor(host)) return;
    let border = '';
    try {
      const cs = getComputedStyle(host);
      border = cs.borderTopColor || cs.borderColor || cs.outlineColor || '';
    } catch (_) { }
    if (!isUsableCssColor(border)) return;
    box.style.setProperty('--lia-annot-tex-preview-border', border);
  };

  try {
    const mo = new MutationObserver(function () { syncBorder(); });
    mo.observe(host, { attributes: true, attributeFilter: ['class', 'style', 'aria-invalid'] });
    (host as unknown as { __liaAnnotTexBorderMo?: MutationObserver }).__liaAnnotTexBorderMo = mo;
  } catch (_) { }

  syncBorder();

  const math = box.querySelector('.lia-annot-tex-preview-math') as HTMLElement | null;

  const sync = function () {
    const value = readFieldValue(host).trim();
    syncBorder();
    if (!value || document.activeElement === host) {
      box.dataset.on = '0';
      box.style.display = 'none';
      host.style.display = '';
      return;
    }
    box.dataset.on = '1';
    box.style.display = 'inline-flex';
    host.style.display = 'none';
    if (math) renderLatexPreview(math, value);
  };

  box.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    host.style.display = '';
    try {
      host.focus();
      if (host instanceof HTMLInputElement || host instanceof HTMLTextAreaElement) host.select();
    } catch (_) { }
  });

  host.addEventListener('input', sync);
  host.addEventListener('change', sync);
  host.addEventListener('focus', sync);
  host.addEventListener('blur', function () { setTimeout(sync, 0); });

  (host as unknown as { __liaAnnotTexReady?: boolean }).__liaAnnotTexReady = true;
  (host as unknown as { __liaAnnotTexSync?: () => void }).__liaAnnotTexSync = sync;

  sync();
}

function getMarkedRectAndTarget(): { box: BBox; target: Element } | null {
  const marked = getMarkedRect();
  if (!marked) return null;
  const box: BBox = { x: marked.x, y: marked.y, w: marked.w, h: marked.h };
  // Prefer user-pinned target; fall back to proximity search.
  const pinned = getPinnedQuizTarget();
  const target = (pinned && isEditableInputField(pinned)) ? pinned : findNearestQuizInputForBox(box);
  if (!target) return null;
  return { box, target };
}

export async function recognizeLatestAnnotationText(): Promise<string | null> {
  if (STORE.ui.ocrBusy) return null;
  if (isReadOnly() || !STORE.ui.visible) return null;

  const ocr = getOcrEngine();
  if (!ocr || typeof ocr.recognize !== 'function') return null;
  await ensurePreferredOcrModel(ocr);

  const pair = getMarkedRectAndTarget();
  if (!pair) return null;

  _lastOcrTarget = pair.target;
  const crop = renderMarkedRectToCanvas(pair.box);
  if (!crop) return null;

  STORE.ui.ocrBusy = true;
  updateToolbar();

  try {
    const text = await recognizeWithVoting(ocr, crop);
    return text || null;
  } catch (_) {
    return null;
  } finally {
    STORE.ui.ocrBusy = false;
    updateToolbar();
  }
}

export function submitOcrTextToNearestQuiz(text: string): boolean {
  const cleaned = cleanOcrText(text);
  if (!cleaned) return false;

  let target = (_lastOcrTarget && isEditableInputField(_lastOcrTarget)) ? _lastOcrTarget : null;
  if (!target) {
    const pair = getMarkedRectAndTarget();
    if (!pair) return false;
    target = pair.target;
  }

  const ok = applyValueToField(target, cleaned);
  if (ok) _lastOcrTarget = target;
  return ok;
}

export async function transferToNearestQuiz(): Promise<boolean> {
  const text = await recognizeLatestAnnotationText();
  if (!text) return false;
  return submitOcrTextToNearestQuiz(text);
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

function sanitizeWidget(widget: unknown): { id: string; x: number; y: number; w: number; h: number; spec?: string; language?: 'de' | 'en' } | null {
  if (!widget || typeof widget !== 'object') return null;
  const obj = widget as Record<string, unknown>;
  const id = String(obj.id || '').trim();
  if (!id) return null;
  const x = Number(obj.x);
  const y = Number(obj.y);
  const w = Number(obj.w);
  const h = Number(obj.h);
  if (!isFinite(x) || !isFinite(y) || !isFinite(w) || !isFinite(h)) return null;
  const spec = String(obj.spec || '').trim();
  const languageRaw = String(obj.language || '').trim().toLowerCase();
  return {
    id,
    x: Math.max(0, Math.round(x)),
    y: Math.max(0, Math.round(y)),
    w: Math.max(120, Math.round(w)),
    h: Math.max(90, Math.round(h)),
    spec: spec || undefined,
    language: languageRaw === 'de' ? 'de' : languageRaw === 'en' ? 'en' : undefined
  };
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
        redo: Array.isArray(src.redo) ? copyJson(src.redo) as PathItem[] : [],
        widgets: Array.isArray(src.widgets)
          ? src.widgets.map(sanitizeWidget).filter((w): w is { id: string; x: number; y: number; w: number; h: number } => w !== null)
          : []
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
    isOcrAvailable,
    recognizeLatestAnnotationText,
    submitOcrTextToNearestQuiz,
    transferToNearestQuiz,
    startDgsPlacementMode,
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
