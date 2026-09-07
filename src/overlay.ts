// Everything that happens on the canvas: host detection, shell/canvas lifecycle,
// resize observation, canvas event binding, drawing, and sync scheduling.

import { STORE, STATE, clamp, toRel, fromRel, getSlideKey, ensureSlide, isReadOnly, effectiveMode, getLineWidthPx, getViewportWidth } from './store';
import { updateToolbar, hideEraserRing, updateEraserRing, refreshEraserRing, tUi } from './ui';
import type { SlideData } from './types';

type MarkRect = { x0: number; y0: number; x1: number; y1: number };
type DgsWidget = { id: string; x: number; y: number; w: number; h: number; spec?: string; language?: 'de' | 'en' };

let _markedRect: MarkRect | null = null;
let _draftRect: MarkRect | null = null;

let _overlayCallbacks: {
  submitMarkedRect: () => Promise<boolean>;
  shouldPromptDgsInsert: () => boolean;
} | null = null;

let _dgsPromptOpen = false;
let _dgsPlacementMode = false;
let _dgsPromptSuppressedUntil = 0;
let _lastPromptTs = 0;
let _lastPromptClusterKey = '';
let _nextDgsWidgetId = 1;

const DGS_WIDGET_W = 240;
const DGS_WIDGET_H = 180;

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

export function setOverlayCallbacks(cb: { submitMarkedRect: () => Promise<boolean>; shouldPromptDgsInsert: () => boolean }): void {
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

function currentWidgets(): DgsWidget[] {
  const slide = ensureSlide(getSlideKey()) as SlideData;
  const slideWithWidgets = slide as SlideData & { widgets?: DgsWidget[] };
  if (!Array.isArray(slideWithWidgets.widgets)) slideWithWidgets.widgets = [];
  return slideWithWidgets.widgets as DgsWidget[];
}

function getDgsLanguage(): 'de' | 'en' {
  try {
    const htmlLang = String(document.documentElement && document.documentElement.lang || '').trim().toLowerCase();
    const bodyLang = String(document.body && (document.body.getAttribute('lang') || document.body.getAttribute('data-language')) || '').trim().toLowerCase();
    const navLang = String((navigator && (navigator.language || (navigator.languages && navigator.languages[0]))) || '').trim().toLowerCase();
    const candidate = htmlLang || bodyLang || navLang;
    return candidate.startsWith('de') ? 'de' : 'en';
  } catch (_) {
    return 'en';
  }
}

function getDgsPromptEl(): HTMLElement | null {
  if (!STATE.shell) return null;
  return STATE.shell.querySelector('.lia-annot-dgs-prompt') as HTMLElement | null;
}

function setDgsPromptVisible(v: boolean): void {
  _dgsPromptOpen = !!v;
  const el = getDgsPromptEl();
  if (!el) return;

  if (_dgsPromptOpen) {
    const slide = ensureSlide(getSlideKey());
    const recentPens = slide.items
      .filter(function (it) {
        return it && it.kind === 'path' && it.tool === 'pen' && Array.isArray(it.points) && it.points.length >= 2;
      })
      .slice(-6);

    let xMin = Infinity;
    let yMin = Infinity;
    let xMax = -Infinity;
    let yMax = -Infinity;
    for (let i = 0; i < recentPens.length; i++) {
      const g = analyzePenPath(recentPens[i]);
      if (!g) continue;
      xMin = Math.min(xMin, g.xMin);
      yMin = Math.min(yMin, g.yMin);
      xMax = Math.max(xMax, g.xMax);
      yMax = Math.max(yMax, g.yMax);
    }

    if (isFinite(xMin) && isFinite(yMin) && isFinite(xMax) && isFinite(yMax) && STATE.cssW > 0 && STATE.cssH > 0) {
      const promptW = 280;
      const promptH = 110;
      const left = clamp(Math.round(xMax + 14), 12, Math.max(12, STATE.cssW - promptW - 12));
      const top = clamp(Math.round(yMin - 8), 12, Math.max(12, STATE.cssH - promptH - 12));
      el.style.left = left + 'px';
      el.style.top = top + 'px';
      el.style.bottom = 'auto';
    } else {
      el.style.left = '14px';
      el.style.bottom = '14px';
      el.style.top = 'auto';
    }
  }

  el.dataset.on = _dgsPromptOpen ? '1' : '0';
}

function getDgsCrosshairEl(): HTMLElement | null {
  if (!STATE.shell) return null;
  return STATE.shell.querySelector('.lia-annot-dgs-crosshair') as HTMLElement | null;
}

function setDgsCrosshairVisible(v: boolean): void {
  const el = getDgsCrosshairEl();
  if (!el) return;
  el.dataset.on = v ? '1' : '0';
}

function setDgsPlacementMode(v: boolean): void {
  _dgsPlacementMode = !!v;
  if (!_dgsPlacementMode) {
    setDgsCrosshairVisible(false);
  }
  syncOverlayInteractivity();
}

export function startDgsPlacementMode(): void {
  if (isReadOnly() || !STORE.ui.visible) return;
  ensureOverlay();
  setDgsPromptVisible(false);
  setDgsPlacementMode(true);
}

function updateDgsCrosshair(x: number, y: number): void {
  const el = getDgsCrosshairEl();
  if (!el || !STATE.shell || !_dgsPlacementMode) return;
  if (!isFinite(x) || !isFinite(y)) return;
  el.style.left = clamp(x, 0, Math.max(0, STATE.cssW)) + 'px';
  el.style.top = clamp(y, 0, Math.max(0, STATE.cssH)) + 'px';
  setDgsCrosshairVisible(true);
}

type PenGeom = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  pathLen: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  dirX: number;
  dirY: number;
  endToEnd: number;
  straightness: number;
  avgPerp: number;
  bendNearStart: number;
  bendNearEnd: number;
  endBacktrack: number;
  startBacktrack: number;
  isArrowLike: boolean;
  isLineLike: boolean;
  isHorizontal: boolean;
  isVertical: boolean;
};

function toAbsPoints(item: import('./types').PathItem): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  if (!item || !Array.isArray(item.points)) return out;

  let last: { x: number; y: number } | null = null;
  for (let i = 0; i < item.points.length; i++) {
    const p = fromRel(item.points[i]);
    if (!isFinite(p.x) || !isFinite(p.y)) continue;
    if (!last || Math.hypot(p.x - last.x, p.y - last.y) >= 1.5) {
      out.push({ x: p.x, y: p.y });
      last = { x: p.x, y: p.y };
    }
  }
  return out;
}

function analyzePenPath(item: import('./types').PathItem): PenGeom | null {
  if (!item || item.kind !== 'path' || item.tool !== 'pen' || !Array.isArray(item.points) || item.points.length < 2) return null;

  const pts = toAbsPoints(item);
  if (pts.length < 2) return null;

  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;
  let pathLen = 0;

  let prev = pts[0];
  xMin = Math.min(xMin, prev.x);
  xMax = Math.max(xMax, prev.x);
  yMin = Math.min(yMin, prev.y);
  yMax = Math.max(yMax, prev.y);

  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    pathLen += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
    xMin = Math.min(xMin, p.x);
    xMax = Math.max(xMax, p.x);
    yMin = Math.min(yMin, p.y);
    yMax = Math.max(yMax, p.y);
  }

  if (!isFinite(xMin) || !isFinite(yMin) || !isFinite(xMax) || !isFinite(yMax)) return null;

  const start = pts[0];
  const end = pts[pts.length - 1];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const endToEnd = Math.hypot(dx, dy);
  if (endToEnd < 1) return null;

  const dirX = dx / endToEnd;
  const dirY = dy / endToEnd;
  let perpSum = 0;
  for (let i = 0; i < pts.length; i++) {
    const vx = pts[i].x - start.x;
    const vy = pts[i].y - start.y;
    const perp = Math.abs(vx * dirY - vy * dirX);
    perpSum += perp;
  }
  const avgPerp = perpSum / Math.max(1, pts.length);
  const straightness = endToEnd / Math.max(1, pathLen);

  let bendNearStart = 0;
  let bendNearEnd = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const ax = pts[i].x - pts[i - 1].x;
    const ay = pts[i].y - pts[i - 1].y;
    const bx = pts[i + 1].x - pts[i].x;
    const by = pts[i + 1].y - pts[i].y;
    const la = Math.hypot(ax, ay);
    const lb = Math.hypot(bx, by);
    if (la < 1.2 || lb < 1.2) continue;

    const c = clamp((ax * bx + ay * by) / (la * lb), -1, 1);
    const angle = Math.acos(c) * 180 / Math.PI;
    if (angle < 18) continue;

    const t = i / (pts.length - 1);
    if (t < 0.35) bendNearStart++;
    else if (t > 0.65) bendNearEnd++;
  }

  let endBacktrack = 0;
  let startBacktrack = 0;
  let prevProj = 0;
  for (let i = 0; i < pts.length; i++) {
    const vx = pts[i].x - start.x;
    const vy = pts[i].y - start.y;
    const proj = (vx * dirX + vy * dirY) / Math.max(1e-6, endToEnd);
    if (i > 0) {
      const d = proj - prevProj;
      const t = i / Math.max(1, pts.length - 1);
      if (t > 0.6 && d < 0) endBacktrack += -d;
      if (t < 0.4 && d > 0) startBacktrack += d;
    }
    prevProj = proj;
  }

  const w = Math.max(1, xMax - xMin);
  const h = Math.max(1, yMax - yMin);
  const isHorizontal = w >= 20 && w >= h * 1.15;
  const isVertical = h >= 20 && h >= w * 1.15;
  const isLineLike =
    endToEnd >= 24 &&
    pathLen >= 28 &&
    straightness >= 0.40 &&
    (pathLen / Math.max(1, endToEnd)) <= 3.3 &&
    avgPerp <= Math.max(12, endToEnd * 0.24);
  const hasHeadBend = bendNearStart >= 1 || bendNearEnd >= 1;
  const hasBacktrack = endBacktrack >= 0.03 || startBacktrack >= 0.03;
  const isArrowLike =
    isLineLike &&
    endToEnd >= 28 &&
    pathLen >= 32 &&
    straightness >= 0.43 &&
    (hasHeadBend || hasBacktrack);

  return {
    xMin,
    xMax,
    yMin,
    yMax,
    w,
    h,
    cx: (xMin + xMax) * 0.5,
    cy: (yMin + yMax) * 0.5,
    pathLen,
    startX: start.x,
    startY: start.y,
    endX: end.x,
    endY: end.y,
    dirX,
    dirY,
    endToEnd,
    straightness,
    avgPerp,
    bendNearStart,
    bendNearEnd,
    endBacktrack,
    startBacktrack,
    isArrowLike,
    isLineLike,
    isHorizontal,
    isVertical
  };
}

function pointToSegmentDistance(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const vx = bx - ax;
  const vy = by - ay;
  const wx = px - ax;
  const wy = py - ay;
  const vv = vx * vx + vy * vy;
  if (vv <= 1e-6) return Math.hypot(px - ax, py - ay);
  const t = clamp((wx * vx + wy * vy) / vv, 0, 1);
  const qx = ax + t * vx;
  const qy = ay + t * vy;
  return Math.hypot(px - qx, py - qy);
}

function segmentDistance(
  ax: number, ay: number, bx: number, by: number,
  cx: number, cy: number, dx: number, dy: number
): number {
  return Math.min(
    pointToSegmentDistance(ax, ay, cx, cy, dx, dy),
    pointToSegmentDistance(bx, by, cx, cy, dx, dy),
    pointToSegmentDistance(cx, cy, ax, ay, bx, by),
    pointToSegmentDistance(dx, dy, ax, ay, bx, by)
  );
}

function lineIntersection(
  a1x: number, a1y: number, a2x: number, a2y: number,
  b1x: number, b1y: number, b2x: number, b2y: number
): { x: number; y: number } | null {
  const den = (a1x - a2x) * (b1y - b2y) - (a1y - a2y) * (b1x - b2x);
  if (Math.abs(den) < 1e-6) return null;
  const detA = a1x * a2y - a1y * a2x;
  const detB = b1x * b2y - b1y * b2x;
  const x = (detA * (b1x - b2x) - (a1x - a2x) * detB) / den;
  const y = (detA * (b1y - b2y) - (a1y - a2y) * detB) / den;
  return { x, y };
}

function strokeClusterKey(cluster: PenGeom[]): string {
  return cluster.map(function (g) {
    return [
      Math.round(g.cx),
      Math.round(g.cy),
      Math.round(g.endToEnd),
      Math.round(g.w),
      Math.round(g.h)
    ].join(':');
  }).join('|');
}

function areStrokeGeomsConnected(a: PenGeom, b: PenGeom): boolean {
  const centerDist = Math.hypot(a.cx - b.cx, a.cy - b.cy);
  if (centerDist <= 220) return true;
  return segmentDistance(a.startX, a.startY, a.endX, a.endY, b.startX, b.startY, b.endX, b.endY) <= 120;
}

function getTailConnectedStrokeGeoms(geoms: PenGeom[], maxTail: number): PenGeom[] {
  if (!geoms.length) return [];

  const tail: PenGeom[] = [geoms[geoms.length - 1]];

  for (let i = geoms.length - 2; i >= 0; i--) {
    const candidate = geoms[i];
    let connected = false;
    for (let j = 0; j < tail.length; j++) {
      if (areStrokeGeomsConnected(candidate, tail[j])) {
        connected = true;
        break;
      }
    }

    // Only a consecutive connected suffix is valid for triggering.
    if (!connected) break;

    tail.unshift(candidate);
    if (tail.length >= maxTail) break;
  }

  return tail;
}

function pointInExpandedSegmentBounds(
  x: number,
  y: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  padding: number
): boolean {
  return x >= Math.min(ax, bx) - padding && x <= Math.max(ax, bx) + padding &&
    y >= Math.min(ay, by) - padding && y <= Math.max(ay, by) + padding;
}

function pickTipAndInward(g: PenGeom, mode: 'right' | 'up'): {
  tipX: number;
  tipY: number;
  inwardX: number;
  inwardY: number;
  tipIsEnd: boolean;
} {
  const pickEnd = (mode === 'right')
    ? (g.endX >= g.startX)
    : (g.endY <= g.startY);

  const tipX = pickEnd ? g.endX : g.startX;
  const tipY = pickEnd ? g.endY : g.startY;
  const baseX = pickEnd ? g.startX : g.endX;
  const baseY = pickEnd ? g.startY : g.endY;
  const len = Math.max(1e-6, Math.hypot(baseX - tipX, baseY - tipY));

  return {
    tipX,
    tipY,
    inwardX: (baseX - tipX) / len,
    inwardY: (baseY - tipY) / len,
    tipIsEnd: pickEnd
  };
}

function hasArrowSignatureAtTip(axis: PenGeom, tipIsEnd: boolean): boolean {
  if (!axis.isArrowLike) return false;
  if (tipIsEnd) {
    return axis.bendNearEnd >= 2 || axis.endBacktrack >= 0.06;
  }
  return axis.bendNearStart >= 2 || axis.startBacktrack >= 0.06;
}

function findDetachedArrowCueNearTip(
  geoms: PenGeom[],
  axisA: PenGeom,
  axisB: PenGeom,
  tipX: number,
  tipY: number,
  inwardX: number,
  inwardY: number
): number {
  for (let i = 0; i < geoms.length; i++) {
    const g = geoms[i];
    if (g === axisA || g === axisB) continue;
    if (g.endToEnd < 4 || g.endToEnd > 80) continue;

    const dStart = Math.hypot(g.startX - tipX, g.startY - tipY);
    const dEnd = Math.hypot(g.endX - tipX, g.endY - tipY);
    const near = Math.min(dStart, dEnd);
    if (near > 58) continue;

    const mx = (g.startX + g.endX) * 0.5;
    const my = (g.startY + g.endY) * 0.5;
    const towardInward = (mx - tipX) * inwardX + (my - tipY) * inwardY;
    if (towardInward < -6) continue;

    return i;
  }
  return -1;
}

function looksLikeAxisSketch(): boolean {
  const slide = ensureSlide(getSlideKey());
  const allGeoms = slide.items
    .filter(function (it) { return it && it.kind === 'path' && it.tool === 'pen'; })
    .slice(-140)
    .map(function (it) { return analyzePenPath(it); })
    .filter((g): g is PenGeom => g !== null);

  if (allGeoms.length < 2) return false;
  const geoms = allGeoms.slice(-26);

  if (geoms.length < 2) return false;

  const cluster = getTailConnectedStrokeGeoms(geoms, 10);
  if (cluster.length < 2) return false;

  const clusterKey = strokeClusterKey(cluster);
  if (clusterKey && clusterKey === _lastPromptClusterKey) return false;

  const horizontalCandidates = cluster
    .map(function (g, index) { return { g: g, index: index }; })
    .filter(function (entry) {
      const g = entry.g;
      return g.isLineLike &&
        g.endToEnd >= 28 &&
        g.straightness >= 0.34 &&
        Math.abs(g.dirX) >= 0.72 &&
        Math.abs(g.dirY) <= 0.55 &&
        g.w >= g.h * 1.4;
    })
    .sort(function (a, b) { return b.index - a.index; });

  const verticalCandidates = cluster
    .map(function (g, index) { return { g: g, index: index }; })
    .filter(function (entry) {
      const g = entry.g;
      return g.isLineLike &&
        g.endToEnd >= 28 &&
        g.straightness >= 0.34 &&
        Math.abs(g.dirY) >= 0.72 &&
        Math.abs(g.dirX) <= 0.55 &&
        g.h >= g.w * 1.4;
    })
    .sort(function (a, b) { return b.index - a.index; });

  if (!horizontalCandidates.length || !verticalCandidates.length) return false;
  const maxH = Math.min(3, horizontalCandidates.length);
  const maxV = Math.min(3, verticalCandidates.length);

  for (let i = 0; i < maxH; i++) {
    for (let j = 0; j < maxV; j++) {
      const hEntry = horizontalCandidates[i];
      const vEntry = verticalCandidates[j];
      const h = hEntry.g;
      const v = vEntry.g;

      if (Math.abs(hEntry.index - vEntry.index) > 4) continue;

      const newestIndex = Math.max(hEntry.index, vEntry.index);
      if (newestIndex < cluster.length - 4) continue;

      const dotAbs = Math.abs(h.dirX * v.dirX + h.dirY * v.dirY);
      if (dotAbs > 0.78) continue;

      const intersection = lineIntersection(h.startX, h.startY, h.endX, h.endY, v.startX, v.startY, v.endX, v.endY);
      if (!intersection) continue;

      const hPadding = Math.max(16, Math.min(90, h.endToEnd * 0.22));
      const vPadding = Math.max(16, Math.min(90, v.endToEnd * 0.22));
      if (!pointInExpandedSegmentBounds(intersection.x, intersection.y, h.startX, h.startY, h.endX, h.endY, hPadding)) continue;
      if (!pointInExpandedSegmentBounds(intersection.x, intersection.y, v.startX, v.startY, v.endX, v.endY, vPadding)) continue;

      const hCenterDist = Math.hypot(intersection.x - h.cx, intersection.y - h.cy);
      const vCenterDist = Math.hypot(intersection.x - v.cx, intersection.y - v.cy);
      if (hCenterDist > Math.max(90, h.endToEnd * 0.38)) continue;
      if (vCenterDist > Math.max(90, v.endToEnd * 0.38)) continue;

      const rightTip = pickTipAndInward(h, 'right');
      const upTip = pickTipAndInward(v, 'up');

      const rightInlineArrow = hasArrowSignatureAtTip(h, rightTip.tipIsEnd);
      const rightCueIdx = findDetachedArrowCueNearTip(cluster, h, v, rightTip.tipX, rightTip.tipY, rightTip.inwardX, rightTip.inwardY);
      const rightArrow = rightInlineArrow || rightCueIdx >= 0;
      if (!rightArrow) continue;

      const upInlineArrow = hasArrowSignatureAtTip(v, upTip.tipIsEnd);
      const upCueIdx = findDetachedArrowCueNearTip(cluster, h, v, upTip.tipX, upTip.tipY, upTip.inwardX, upTip.inwardY);
      const upArrow = upInlineArrow || upCueIdx >= 0;
      if (!upArrow) continue;

      // A single detached mark must not satisfy both arrowheads.
      if (rightCueIdx >= 0 && upCueIdx >= 0 && rightCueIdx === upCueIdx) continue;

      _lastPromptClusterKey = clusterKey;

      return true;
    }
  }

  return false;
}

function maybePromptDgsInsert(): void {
  if (isReadOnly() || !STORE.ui.visible) return;
  if (_dgsPromptOpen || _dgsPlacementMode) return;
  if (!_overlayCallbacks || !_overlayCallbacks.shouldPromptDgsInsert || !_overlayCallbacks.shouldPromptDgsInsert()) return;
  if (Date.now() < _dgsPromptSuppressedUntil) return;
  if ((Date.now() - _lastPromptTs) < 120) return;

  // Called for its side effect: makes sure the slide entry exists before the
  // prompt can lead to a widget being placed on it.
  ensureSlide(getSlideKey());
  if (!looksLikeAxisSketch()) return;

  _lastPromptTs = Date.now();
  setDgsPromptVisible(true);
}

function getJxgGlobal(): Record<string, unknown> | null {
  const candidates: Array<Record<string, unknown>> = [];
  candidates.push(window as unknown as Record<string, unknown>);
  try { if (window.parent && window.parent !== window) candidates.push(window.parent as unknown as Record<string, unknown>); } catch (_) { }
  try { if (window.top && window.top !== window) candidates.push(window.top as unknown as Record<string, unknown>); } catch (_) { }

  for (let i = 0; i < candidates.length; i++) {
    const jxg = candidates[i].JXG as Record<string, unknown> | undefined;
    const jsx = jxg && (jxg.JSXGraph as Record<string, unknown> | undefined);
    if (jxg && jsx && typeof jsx.initBoard === 'function') return jxg;
  }
  return null;
}

type CoordApi = {
  parseCoordSpec: (spec: string) => {
    id: string;
    width: number;
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
    border: boolean;
  };
  loadStoredBoardState: (id: string) => { bbox: number[] } | null;
  prepareBoardContainer: (el: HTMLElement, width: number, ratio: number, preset: { bbox: number[] } | null) => void;
  createBoardDecorations: (board: unknown, cfg: unknown, neutral: string, accent: string) => void;
  wireBoard: (board: unknown, cfg: unknown, initialBbox: number[], initialRatio: number) => void;
  getNeutralColor: () => string;
  getAccentColor: () => string;
};

function getCoordGlobal(): CoordApi | null {
  const candidates: Array<Record<string, unknown>> = [];
  candidates.push(window as unknown as Record<string, unknown>);
  try { if (window.parent && window.parent !== window) candidates.push(window.parent as unknown as Record<string, unknown>); } catch (_) { }
  try { if (window.top && window.top !== window) candidates.push(window.top as unknown as Record<string, unknown>); } catch (_) { }

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i].__coord as Partial<CoordApi> | undefined;
    if (!c) continue;
    if (typeof c.parseCoordSpec !== 'function') continue;
    if (typeof c.prepareBoardContainer !== 'function') continue;
    if (typeof c.createBoardDecorations !== 'function') continue;
    if (typeof c.wireBoard !== 'function') continue;
    if (typeof c.getNeutralColor !== 'function') continue;
    if (typeof c.getAccentColor !== 'function') continue;
    if (typeof c.loadStoredBoardState !== 'function') continue;
    return c as CoordApi;
  }

  return null;
}

function callSetupDgs(uid: string, spec: string, language: 'de' | 'en'): void {
  const candidates: Array<Record<string, unknown>> = [];
  candidates.push(window as unknown as Record<string, unknown>);
  try { if (window.parent && window.parent !== window) candidates.push(window.parent as unknown as Record<string, unknown>); } catch (_) { }
  try { if (window.top && window.top !== window) candidates.push(window.top as unknown as Record<string, unknown>); } catch (_) { }

  for (let i = 0; i < candidates.length; i++) {
    const setup = candidates[i].__setupDGS as ((uid: string, spec: string, language?: string) => void) | undefined;
    if (typeof setup !== 'function') continue;
    try {
      setup(uid, spec, language);
      return;
    } catch (_) { }
  }
}

function renderFallbackAxes(host: HTMLElement): void {
  host.innerHTML = '<svg class="lia-annot-dgs-fallback" viewBox="0 0 240 180" preserveAspectRatio="none" aria-hidden="true">'
    + '<line x1="24" y1="90" x2="226" y2="90" class="axis"/>'
    + '<line x1="120" y1="160" x2="120" y2="14" class="axis"/>'
    + '<polygon points="226,90 214,84 214,96" class="arrow"/>'
    + '<polygon points="120,14 114,26 126,26" class="arrow"/>'
    + '</svg>';
}

function initWidgetBoard(el: HTMLElement): void {
  const boardHost = el.querySelector('.lia-annot-dgs-board') as HTMLElement | null;
  if (!boardHost || boardHost.dataset.init === '1') return;

  const coord = getCoordGlobal();
  const jxg = getJxgGlobal();
  const widgetId = String(el.dataset.id || Math.floor(Math.random() * 1e9));
  const boardId = 'lia-annot-dgs-board-' + widgetId;
  const language = getDgsLanguage();
  const spec = String(el.dataset.spec || boardId || '');

  let specNode = el.querySelector('.lia-annot-dgs-spec') as HTMLElement | null;
  if (!specNode) {
    specNode = document.createElement('span');
    specNode.className = 'lia-annot-dgs-spec';
    specNode.style.display = 'none';
    el.insertBefore(specNode, el.firstChild);
  }
  specNode.id = 'dgs-ui-' + widgetId;
  specNode.dataset.spec = spec;
  specNode.dataset.language = language;

  if (!jxg || !coord) {
    renderFallbackAxes(boardHost);
    boardHost.dataset.init = '1';
    return;
  }

  const jsx = jxg.JSXGraph as { initBoard: (id: string, cfg: Record<string, unknown>) => unknown };
  boardHost.id = boardId;

  try {
    const widthPx = Math.max(160, Math.round(boardHost.clientWidth || DGS_WIDGET_W));
    const cfg = coord.parseCoordSpec(
      'xmin=-7;xmax=7;ymin=-5;ymax=5;id=' + boardId + ';width=' + widthPx + ';1;1;1'
    );
    const initialBbox = [cfg.xmin, cfg.ymax, cfg.xmax, cfg.ymin];
    const initialRatio = (cfg.ymax - cfg.ymin) / Math.max(0.0001, (cfg.xmax - cfg.xmin));
    const presetState = coord.loadStoredBoardState(cfg.id);

    coord.prepareBoardContainer(boardHost, cfg.width, initialRatio, presetState);

    const board = jsx.initBoard(boardId, {
      axis: false,
      grid: false,
      showNavigation: false,
      showCopyright: false,
      boundingbox: presetState ? presetState.bbox.slice() : initialBbox.slice(),
      keepaspectratio: true,
      zoom: { enabled: cfg.border, wheel: cfg.border, needShift: false, factorX: 1.15, factorY: 1.15 },
      pan: { enabled: cfg.border, needShift: false, needTwoFingers: false },
      resize: { enabled: false }
    });

    coord.createBoardDecorations(board, cfg, coord.getNeutralColor(), coord.getAccentColor());
    coord.wireBoard(board, cfg, initialBbox, initialRatio);
    try {
      const state = window as unknown as { __boards?: Record<string, unknown> };
      state.__boards = state.__boards || {};
      state.__boards[boardId] = board as unknown;
    } catch (_) { }
    (boardHost as unknown as { __liaAnnotBoard?: unknown }).__liaAnnotBoard = board;

    callSetupDgs(widgetId, spec, language);
    setTimeout(function () { callSetupDgs(widgetId, spec, language); }, 0);
    setTimeout(function () { callSetupDgs(widgetId, spec, language); }, 120);
  } catch (_) {
    renderFallbackAxes(boardHost);
  }

  boardHost.dataset.init = '1';
}

function syncDgsWidgetsLayer(): void {
  if (!STATE.host) return;
  const host = STATE.host as HTMLElement;

  function isShellNode(node: Element | null): boolean {
    return !!(STATE.shell && node && node === STATE.shell);
  }

  function isWidgetNode(node: Element | null): boolean {
    return !!(node && node instanceof HTMLElement && node.classList.contains('lia-annot-dgs-widget'));
  }

  function flowChildren(): HTMLElement[] {
    return Array.from(host.children).filter(function (el): el is HTMLElement {
      if (isShellNode(el)) return false;
      if (isWidgetNode(el)) return false;
      return true;
    });
  }

  function findInsertAfter(y: number): HTMLElement | null {
    const children = flowChildren();
    let best: HTMLElement | null = null;
    let bestTop = -Infinity;
    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      const r = el.getBoundingClientRect();
      if (r.width < 24 || r.height < 12) continue;
      const top = r.top - host.getBoundingClientRect().top;
      const bottom = r.bottom - host.getBoundingClientRect().top;
      if (bottom <= y + 2 && top >= bestTop) {
        best = el;
        bestTop = top;
      }
    }
    return best;
  }

  const widgets = currentWidgets().slice().sort(function (a, b) { return a.y - b.y; });
  const keep: Record<string, boolean> = {};

  for (let i = 0; i < widgets.length; i++) {
    const w = widgets[i];
    keep[w.id] = true;
    const resolvedSpec = String(w.spec || ('lia-annot-dgs-board-' + w.id));
    const resolvedLanguage: 'de' | 'en' = w.language === 'de' ? 'de' : 'en';
    if (!w.spec) w.spec = resolvedSpec;
    if (!w.language) w.language = resolvedLanguage;
    let el = host.querySelector('.lia-annot-dgs-widget[data-id="' + w.id + '"]') as HTMLElement | null;
    if (!el) {
      el = document.createElement('div');
      el.className = 'lia-annot-dgs-widget';
      el.dataset.id = w.id;
      el.innerHTML = '<span class="lia-annot-dgs-spec" style="display:none;"></span><div class="lia-annot-dgs-board"></div>';
    }

    el.style.position = 'static';
    el.style.left = '';
    el.style.top = '';
    el.style.width = '100%';
    el.style.height = 'auto';
    el.style.margin = '18px 0';
    el.style.display = 'block';
    el.style.clear = 'both';

    el.dataset.spec = resolvedSpec;
    el.dataset.language = resolvedLanguage;
    const specNode = el.querySelector('.lia-annot-dgs-spec') as HTMLElement | null;
    if (specNode) {
      specNode.id = 'dgs-ui-' + w.id;
      specNode.dataset.spec = resolvedSpec;
      specNode.dataset.language = resolvedLanguage;
    }

    const anchor = findInsertAfter(w.y);
    if (anchor) {
      if (anchor.nextSibling !== el) anchor.parentNode!.insertBefore(el, anchor.nextSibling);
    } else if (STATE.shell && el.parentNode !== host) {
      host.insertBefore(el, STATE.shell);
    } else if (el.parentNode !== host) {
      host.appendChild(el);
    }

    initWidgetBoard(el);
  }

  const children = Array.from(host.querySelectorAll('.lia-annot-dgs-widget')) as HTMLElement[];
  for (let i = 0; i < children.length; i++) {
    const id = String(children[i].dataset.id || '');
    if (keep[id]) continue;
    children[i].remove();
  }
}

function placeDgsWidgetAt(x: number, y: number): void {
  const widgets = currentWidgets();
  const left = Math.round(x);
  const top = Math.round(y);
  const id = String(Date.now()) + '-' + String(_nextDgsWidgetId++);
  widgets.push({ id, x: left, y: top, w: DGS_WIDGET_W, h: DGS_WIDGET_H, spec: 'lia-annot-dgs-board-' + id, language: getDgsLanguage() });
  syncDgsWidgetsLayer();
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
    const finishedPath = STATE.activePath;

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

    if (finishedPath && finishedPath.tool === 'pen') {
      maybePromptDgsInsert();
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
    if (_dgsPlacementMode) {
      evt.preventDefault();
      evt.stopPropagation();
      placeDgsWidgetAt(p.x, p.y);
      setDgsPlacementMode(false);
      STORE.ui.mode = 'cursor';
      STORE.ui.panelOpen = false;
      setDgsPromptVisible(false);
      _lastPromptTs = 0;
      _dgsPromptSuppressedUntil = 0;
      updateToolbar();
      syncOverlayInteractivity();
      return;
    }
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
    if (_dgsPlacementMode) {
      evt.preventDefault();
      evt.stopPropagation();
      updateDgsCrosshair(p.x, p.y);
      return;
    }
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
  STATE.canvas.addEventListener('pointerleave', function () {
    STATE.lastPointer.inside = false;
    hideEraserRing();
    if (_dgsPlacementMode) setDgsCrosshairVisible(false);
  }, true);
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

    let dgsLayer = shell.querySelector('.lia-annot-dgs-layer') as HTMLElement | null;
    if (!dgsLayer) {
      dgsLayer = document.createElement('div');
      dgsLayer.className = 'lia-annot-dgs-layer';
      shell.appendChild(dgsLayer);
    }

    let dgsCrosshair = shell.querySelector('.lia-annot-dgs-crosshair') as HTMLElement | null;
    if (!dgsCrosshair) {
      dgsCrosshair = document.createElement('div');
      dgsCrosshair.className = 'lia-annot-dgs-crosshair';
      dgsCrosshair.dataset.on = '0';
      shell.appendChild(dgsCrosshair);
    }

    let dgsPrompt = shell.querySelector('.lia-annot-dgs-prompt') as HTMLElement | null;
    if (!dgsPrompt) {
      dgsPrompt = document.createElement('div');
      dgsPrompt.className = 'lia-annot-dgs-prompt';
      dgsPrompt.dataset.on = '0';
      dgsPrompt.innerHTML = ''
        + '<div class="lia-annot-dgs-prompt-title">Coordinate system sketch detected</div>'
        + '<div class="lia-annot-dgs-prompt-sub">Create a DGS coordinate system?</div>'
        + '<div class="lia-annot-dgs-prompt-actions">'
        + '  <button type="button" class="lia-annot-dgs-yes">Yes</button>'
        + '  <button type="button" class="lia-annot-dgs-no">No</button>'
        + '</div>';
      shell.appendChild(dgsPrompt);

      dgsPrompt.addEventListener('pointerdown', function (evt) { evt.preventDefault(); evt.stopPropagation(); }, true);
      dgsPrompt.addEventListener('click', function (evt) {
        const target = evt.target as Element | null;
        if (!target || !(target instanceof Element)) return;
        if (target.closest('.lia-annot-dgs-yes')) {
          evt.preventDefault();
          evt.stopPropagation();
          setDgsPromptVisible(false);
          setDgsPlacementMode(true);
          return;
        }
        if (target.closest('.lia-annot-dgs-no')) {
          evt.preventDefault();
          evt.stopPropagation();
          setDgsPromptVisible(false);
          _lastPromptTs = 0;
          _dgsPromptSuppressedUntil = Date.now() + 40;
          _lastPromptClusterKey = '';
        }
      }, true);
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

    if (!(document as unknown as { __liaAnnotDgsEscBound?: boolean }).__liaAnnotDgsEscBound) {
      document.addEventListener('keydown', function (evt: KeyboardEvent) {
        if (evt.key !== 'Escape') return;
        if (_dgsPlacementMode) {
          setDgsPlacementMode(false);
          return;
        }
        if (_dgsPromptOpen) {
          setDgsPromptVisible(false);
        }
      }, true);
      (document as unknown as { __liaAnnotDgsEscBound?: boolean }).__liaAnnotDgsEscBound = true;
    }
  } else {
    insertShellAfterHeader(host, STATE.shell!);
    STATE.canvas = STATE.shell!.querySelector('.lia-annot-canvas') as HTMLCanvasElement | null;
    STATE.eraserRing = STATE.shell!.querySelector('.lia-annot-eraser-ring') as HTMLElement | null;
  }

  if (slideChanged) {
    STATE.slideKey = slideKey;
    _lastPromptTs = 0;
    setDgsPromptVisible(false);
    setDgsPlacementMode(false);
    _lastPromptClusterKey = '';
  }
  syncDgsWidgetsLayer();
  syncOverlayInteractivity();
  syncRectButtons();
}

export function syncOverlayInteractivity(): void {
  const shells = Array.from(document.querySelectorAll('.lia-annot-shell')) as HTMLElement[];
  const mode = effectiveMode();
  const visible = !!STORE.ui.visible;
  if (_dgsPlacementMode && (!visible || isReadOnly())) _dgsPlacementMode = false;
  const placeMode = _dgsPlacementMode && visible && !isReadOnly();

  for (let i = 0; i < shells.length; i++) {
    const shell = shells[i];
    const canvas = shell.querySelector('.lia-annot-canvas') as HTMLElement | null;
    shell.dataset.mode = placeMode ? 'place' : 'cursor';
    shell.dataset.hidden = visible ? '0' : '1';
    shell.style.pointerEvents = 'none';
    shell.style.display = visible ? '' : 'none';
    if (canvas) {
      canvas.style.pointerEvents = 'none';
      canvas.style.touchAction = 'auto';
      canvas.style.cursor = 'default';
    }
  }

  if (!visible) {
    hideEraserRing();
    setDgsPromptVisible(false);
    setDgsCrosshairVisible(false);
    return;
  }
  if (!STATE.shell || !STATE.canvas) { hideEraserRing(); return; }

  STATE.shell.style.display = '';
  STATE.shell.dataset.hidden = '0';
  STATE.shell.dataset.mode = placeMode ? 'place' : mode;
  STATE.shell.style.pointerEvents = 'none';

  if (placeMode) {
    STATE.canvas.style.pointerEvents = 'auto';
    STATE.canvas.style.touchAction = 'none';
    STATE.canvas.style.cursor = 'crosshair';
  } else if (mode === 'pen' || mode === 'eraser' || mode === 'rect') {
    STATE.canvas.style.pointerEvents = 'auto';
    STATE.canvas.style.touchAction = 'none';
    STATE.canvas.style.cursor = 'crosshair';
  } else {
    STATE.canvas.style.pointerEvents = 'none';
    STATE.canvas.style.touchAction = 'auto';
    STATE.canvas.style.cursor = 'default';
  }

  if (mode === 'eraser' && !placeMode) { refreshEraserRing(); } else { hideEraserRing(); }
  if (!placeMode) setDgsCrosshairVisible(false);
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
