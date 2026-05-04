// Everything the user sees: CSS injection, icons, toolbar HTML, toolbar updates,
// theme detection, and eraser ring helpers.

import { STORE, STATE, clamp, parseRgbNoRegex, luminance, getViewportWidth, isReadOnly, effectiveMode, currentSlide } from './store';
import { CSS } from './styles';

// ----- Theme -----

export function getThemeAccent(): string | null {
  try {
    const existing = document.querySelector('.lia-btn');
    if (existing) {
      const bg = getComputedStyle(existing).backgroundColor;
      if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return bg;
    }
    const probe = document.createElement('button');
    probe.className = 'lia-btn';
    probe.type = 'button';
    probe.textContent = 'x';
    probe.style.position = 'absolute';
    probe.style.left = '-9999px';
    probe.style.top = '-9999px';
    probe.style.visibility = 'hidden';
    (document.body || document.documentElement).appendChild(probe);
    const bg = getComputedStyle(probe).backgroundColor;
    probe.remove();
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return bg;
  } catch (_) { }
  return null;
}

export function applyThemeVars(): void {
  try {
    const root = document.documentElement;
    const bg = getComputedStyle(document.body || document.documentElement).backgroundColor
      || getComputedStyle(document.documentElement).backgroundColor;
    const rgb = parseRgbNoRegex(bg);
    const dark = rgb ? (luminance(rgb) < 0.5) : false;

    root.style.setProperty('--lia-annot-border', dark ? '#fff' : '#000');
    root.style.setProperty('--lia-annot-fg', dark ? '#fff' : '#000');

    const accent = getThemeAccent();
    if (accent) root.style.setProperty('--lia-annot-accent', accent);

    if (dark) {
      root.style.setProperty('--lia-annot-bg', 'rgba(28,28,28,0.96)');
      root.style.setProperty('--lia-annot-panel-bg', 'rgba(34,34,34,0.97)');
    } else {
      root.style.setProperty('--lia-annot-bg', 'rgba(255,255,255,0.96)');
      root.style.setProperty('--lia-annot-panel-bg', 'rgba(255,255,255,0.97)');
    }
  } catch (_) { }
}

// ----- CSS injection -----

export function ensureCss(): void {
  if (document.getElementById('__lia_annotation_css_v8')) return;
  const st = document.createElement('style');
  st.id = '__lia_annotation_css_v8';
  st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);
}

// ----- Icons -----

function iconCursor(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M5 3.5l8.8 10.8-4.1 1 1.9 5.4-2.6 1-1.9-5.4-3.9 2.2L5 3.5z" fill="none" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

function iconPen(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M4 20h4l10.2-10.2a2.2 2.2 0 0 0 0-3.1l-1.1-1.1a2.2 2.2 0 0 0-3.1 0L3.8 15.8 3 21z" fill="none" stroke-width="1.8" stroke-linejoin="round"/>
    <path class="ico-stroke" d="M13.2 6.8l4 4" fill="none" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;
}

function iconEraser(): string {
  return `<svg viewBox="-4 4 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M4 16.5l8.6-8.6a2 2 0 0 1 2.8 0l4.1 4.1a2 2 0 0 1 0 2.8L12.8 23H7.6L4 19.4a2 2 0 0 1 0-2.9z" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="ico-stroke" d="M8 23h8" fill="none" stroke-width="2" stroke-linecap="round"/>
    <path class="ico-stroke" d="M9.2 14.3l6.5 6.5" fill="none" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

function iconUndo(): string {
  return `<svg viewBox="-4 0 24 24" aria-hidden="true">
    <path d="M21 8H10.2V4L2 12l8.2 8v-4H21V8z" fill="var(--lia-annot-fg)"/>
    <rect x="10.2" y="10.6" width="10.8" height="2.8" rx="1.4" fill="var(--lia-annot-fg)"/>
  </svg>`;
}

function iconRedo(): string {
  return `<svg viewBox="-4 0 24 24" aria-hidden="true">
    <path d="M3 8h10.8V4l8.2 8-8.2 8v-4H3V8z" fill="var(--lia-annot-fg)"/>
    <rect x="3" y="10.6" width="10.8" height="2.8" rx="1.4" fill="var(--lia-annot-fg)"/>
  </svg>`;
}

export function iconEye(open: boolean): string {
  if (open) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path class="ico-stroke" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/>
      <circle cx="12" cy="12" r="3.2" class="ico-stroke"></circle>
    </svg>`;
  }
  return `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M3 3l18 18"/>
    <path class="ico-stroke" d="M2.5 12s3.5-6 9.5-6c1.8 0 3.3.5 4.6 1.2"/>
    <path class="ico-stroke" d="M21.5 12s-3.5 6-9.5 6c-1.8 0-3.4-.5-4.8-1.3"/>
  </svg>`;
}

// ----- Eraser ring -----

function getLiveEraserRingSize(): number {
  return Math.max(8, Number(STORE.ui.eraserWidth || 18));
}

export function hideEraserRing(): void {
  if (!STATE.eraserRing) return;
  STATE.eraserRing.dataset.on = '0';
}

export function updateEraserRing(x: number, y: number): void {
  if (!STATE.eraserRing) return;
  if (!STORE.ui.visible || isReadOnly() || effectiveMode() !== 'eraser') {
    hideEraserRing();
    return;
  }
  if (!isFinite(x) || !isFinite(y) || !isFinite(STATE.cssW) || !isFinite(STATE.cssH)) {
    hideEraserRing();
    return;
  }
  const size = getLiveEraserRingSize();
  STATE.eraserRing.style.width = size + 'px';
  STATE.eraserRing.style.height = size + 'px';
  STATE.eraserRing.style.left = clamp(x, 0, STATE.cssW) + 'px';
  STATE.eraserRing.style.top = clamp(y, 0, STATE.cssH) + 'px';
  STATE.eraserRing.dataset.on = '1';
}

export function refreshEraserRing(): void {
  if (!STATE.lastPointer || !STATE.lastPointer.inside) {
    hideEraserRing();
    return;
  }
  updateEraserRing(STATE.lastPointer.x, STATE.lastPointer.y);
}

// ----- Panel HTML -----

function getColors(): string[] {
  return [
    '#ff0000', '#ff7500', '#ffff00', '#ff00ff', '#0055ff',
    '#00ffff', '#00ff00', '#007500', '#000000', '#ffffff'
  ];
}

type UiLang = 'en' | 'de' | 'es';

type UiTextKey =
  | 'colors'
  | 'penWidth'
  | 'opacity'
  | 'eraser'
  | 'clearAll'
  | 'penWidthAria'
  | 'opacityAria'
  | 'eraserWidthAria'
  | 'colorAria'
  | 'readOnlyNote';

const UI_TEXT: Record<UiTextKey, Record<UiLang, string>> = {
  colors: {
    en: 'Colors',
    de: 'Farben',
    es: 'Colores'
  },
  penWidth: {
    en: 'Pen Width',
    de: 'Stiftbreite',
    es: 'Grosor del lápiz'
  },
  opacity: {
    en: 'Opacity',
    de: 'Deckkraft',
    es: 'Opacidad'
  },
  eraser: {
    en: 'Eraser',
    de: 'Radierer',
    es: 'Borrador'
  },
  clearAll: {
    en: 'Clear all',
    de: 'Alles löschen',
    es: 'Borrar todo'
  },
  penWidthAria: {
    en: 'Pen width',
    de: 'Stiftbreite',
    es: 'Grosor del lápiz'
  },
  opacityAria: {
    en: 'Opacity',
    de: 'Deckkraft',
    es: 'Opacidad'
  },
  eraserWidthAria: {
    en: 'Eraser width',
    de: 'Radierergröße',
    es: 'Tamaño del borrador'
  },
  colorAria: {
    en: 'Color',
    de: 'Farbe',
    es: 'Color'
  },
  readOnlyNote: {
    en: 'Freeze/read-only mode: drawing is locked, show/hide still works.',
    de: 'Freeze-/Nur-Lese-Modus: Zeichnen ist gesperrt, Anzeigen/Ausblenden funktioniert weiter.',
    es: 'Modo congelado/solo lectura: dibujar está bloqueado, mostrar/ocultar sigue funcionando.'
  }
};

function normalizeUiLang(raw: string | null | undefined): UiLang | null {
  if (!raw) return null;
  const cleaned = String(raw).trim().toLowerCase().replace(/_/g, '-');
  if (!cleaned) return null;
  const base = cleaned.split('-')[0];
  if (base === 'de' || base === 'es' || base === 'en') return base;
  return null;
}

function langFromHashSearch(): string {
  const hash = String(location.hash || '');
  const qIndex = hash.indexOf('?');
  return qIndex >= 0 ? hash.slice(qIndex + 1) : '';
}

let _cachedUiLang: UiLang | null = null;

function detectUiLang(): UiLang {
  if (_cachedUiLang) return _cachedUiLang;
  try {
    const search = new URLSearchParams(String(location.search || ''));
    const fromSearch = normalizeUiLang(search.get('language') || search.get('lang'));
    if (fromSearch) return _cachedUiLang = fromSearch;

    const hashSearch = new URLSearchParams(langFromHashSearch());
    const fromHash = normalizeUiLang(hashSearch.get('language') || hashSearch.get('lang'));
    if (fromHash) return _cachedUiLang = fromHash;

    const htmlLang = normalizeUiLang(document.documentElement && document.documentElement.lang);
    if (htmlLang) return _cachedUiLang = htmlLang;

    const bodyLang = normalizeUiLang(document.body && (document.body.getAttribute('lang') || document.body.getAttribute('data-language')));
    if (bodyLang) return _cachedUiLang = bodyLang;

    const navLang = normalizeUiLang((navigator && (navigator.language || (navigator.languages && navigator.languages[0]))) || '');
    if (navLang) return _cachedUiLang = navLang;
  } catch (_) { }
  return _cachedUiLang = 'en';
}

function t(lang: UiLang, key: UiTextKey): string {
  const entry = UI_TEXT[key];
  return (entry && entry[lang]) || entry.en;
}

function buildPenPanelHTML(lang: UiLang): string {
  const colorButtons = getColors().map(function (c) {
    return '<button class="lia-annot-color-item" type="button" data-color="' + c + '" aria-label="' + t(lang, 'colorAria') + ' ' + c + '" data-snapshot-admin="1" style="background:' + c + ';"></button>';
  }).join('');

  return `
    <div class="lia-annot-row">
      <span class="k">${t(lang, 'colors')}</span>
      <span class="lia-annot-color-grid">${colorButtons}</span>
    </div>
    <div class="lia-annot-row">
      <span class="k">${t(lang, 'penWidth')}</span>
      <input class="lia-annot-slider" type="range" min="1" max="24" step="1" value="${STORE.ui.width}" data-act="width" aria-label="${t(lang, 'penWidthAria')}" data-snapshot-admin="1">
      <span class="v" data-k="width">${STORE.ui.width}</span>
    </div>
    <div class="lia-annot-row">
      <span class="k">${t(lang, 'opacity')}</span>
      <input class="lia-annot-slider" type="range" min="0.1" max="1" step="0.05" value="${STORE.ui.alpha}" data-act="alpha" aria-label="${t(lang, 'opacityAria')}" data-snapshot-admin="1">
      <span class="v" data-k="alpha">${Math.round(Number(STORE.ui.alpha || 1) * 100)}%</span>
    </div>
    <div class="lia-annot-note" data-k="note"></div>
  `;
}

function buildEraserPanelHTML(lang: UiLang): string {
  return `
    <div class="lia-annot-row">
      <span class="k">${t(lang, 'eraser')}</span>
      <input class="lia-annot-slider" type="range" min="4" max="80" step="1" value="${STORE.ui.eraserWidth}" data-act="eraserWidth" aria-label="${t(lang, 'eraserWidthAria')}" data-snapshot-admin="1">
      <span class="v" data-k="eraserWidth">${STORE.ui.eraserWidth}</span>
    </div>
    <div class="lia-annot-row">
      <button class="lia-annot-danger" type="button" data-act="clear" data-snapshot-admin="1">${t(lang, 'clearAll')}</button>
    </div>
    <div class="lia-annot-note" data-k="note"></div>
  `;
}

// ----- Toolbar -----

// Imported lazily to avoid circular dependency: overlay/api call updateToolbar,
// updateToolbar calls ensureOverlay indirectly via ensureToolbar only for the element.
// The actual circular calls (requestRedraw, syncOverlayInteractivity, etc.) are
// passed in as callbacks from boot.ts.
let _callbacks: {
  requestRedraw: () => void;
  requestSync: () => void;
  syncOverlayInteractivity: () => void;
  ensureOverlay: () => void;
  doUndo: () => void;
  doRedo: () => void;
  clearSlide: () => void;
} | null = null;

export function setToolbarCallbacks(cb: typeof _callbacks): void {
  _callbacks = cb;
}

export function ensureToolbar(): HTMLElement {
  if (STATE.toolbar && STATE.toolbar.isConnected) return STATE.toolbar;

  const bar = document.createElement('div');
  bar.className = 'lia-annot-toolbar';
  bar.setAttribute('data-snapshot-admin', '1');

  bar.innerHTML = `
    <div class="lia-annot-actions" role="toolbar" aria-label="Annotation tools">
      <button class="lia-annot-btn" type="button" data-act="cursor" aria-label="Cursor" aria-pressed="false" title="Cursor" data-snapshot-admin="1">${iconCursor()}</button>
      <button class="lia-annot-btn" type="button" data-act="pen" aria-label="Pen" aria-pressed="false" title="Pen" data-snapshot-admin="1">${iconPen()}</button>
      <button class="lia-annot-btn" type="button" data-act="eraser" aria-label="Eraser" aria-pressed="false" title="Eraser" data-snapshot-admin="1">${iconEraser()}</button>
      <button class="lia-annot-btn" type="button" data-act="undo" aria-label="Undo" title="Undo" data-snapshot-admin="1">${iconUndo()}</button>
      <button class="lia-annot-btn" type="button" data-act="redo" aria-label="Redo" title="Redo" data-snapshot-admin="1">${iconRedo()}</button>
      <button class="lia-annot-btn" type="button" data-act="toggle" aria-label="Show/hide annotations" aria-pressed="true" title="Show/hide annotations" data-snapshot-admin="1">${iconEye(true)}</button>
    </div>
    <div class="lia-annot-panel" data-open="0"></div>
  `;

  (document.body || document.documentElement).appendChild(bar);

  bar.addEventListener('click', function (e) {
    const target = e.target as Element | null;
    const btn = target && target.closest ? target.closest('button[data-act]') as HTMLElement | null : null;
    const colorBtn = target && target.closest ? target.closest('button[data-color]') as HTMLElement | null : null;

    if (colorBtn) {
      e.preventDefault();
      e.stopPropagation();
      if (isReadOnly()) return;
      STORE.ui.color = String(colorBtn.getAttribute('data-color') || '#ff0000');
      updateToolbar();
      _callbacks?.requestRedraw();
      return;
    }

    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const act = String(btn.getAttribute('data-act') || '');

    if (act === 'toggle') {
      _callbacks?.ensureOverlay();
      STORE.ui.visible = !STORE.ui.visible;
      _callbacks?.syncOverlayInteractivity();
      updateToolbar();
      _callbacks?.requestRedraw();
      _callbacks?.requestSync();
      return;
    }
    if (act === 'cursor') {
      STORE.ui.mode = 'cursor';
      STORE.ui.panelOpen = false;
      _callbacks?.syncOverlayInteractivity();
      updateToolbar();
      return;
    }
    if (act === 'pen') {
      if (isReadOnly()) return;
      const same = (STORE.ui.mode === 'pen' && STORE.ui.panelMode === 'pen' && STORE.ui.panelOpen);
      STORE.ui.mode = 'pen';
      STORE.ui.panelMode = 'pen';
      STORE.ui.panelOpen = !same;
      _callbacks?.syncOverlayInteractivity();
      updateToolbar();
      return;
    }
    if (act === 'eraser') {
      if (isReadOnly()) return;
      const same = (STORE.ui.mode === 'eraser' && STORE.ui.panelMode === 'eraser' && STORE.ui.panelOpen);
      STORE.ui.mode = 'eraser';
      STORE.ui.panelMode = 'eraser';
      STORE.ui.panelOpen = !same;
      _callbacks?.syncOverlayInteractivity();
      updateToolbar();
      return;
    }
    if (act === 'undo') {
      if (isReadOnly()) return;
      _callbacks?.doUndo();
      return;
    }
    if (act === 'redo') {
      if (isReadOnly()) return;
      _callbacks?.doRedo();
      return;
    }
    if (act === 'clear') {
      if (isReadOnly()) return;
      _callbacks?.clearSlide();
      return;
    }
  }, true);

  bar.addEventListener('input', function (e) {
    const t = e.target as HTMLElement;
    if (!(t instanceof HTMLElement)) return;
    const act = String(t.getAttribute('data-act') || '');
    if (isReadOnly()) return;

    if (act === 'width') {
      STORE.ui.width = clamp(Number((t as HTMLInputElement).value), 1, 24);
      updateToolbar();
      return;
    }
    if (act === 'alpha') {
      STORE.ui.alpha = clamp(Number((t as HTMLInputElement).value), 0.1, 1);
      updateToolbar();
      return;
    }
    if (act === 'eraserWidth') {
      STORE.ui.eraserWidth = clamp(Number((t as HTMLInputElement).value), 4, 80);
      updateToolbar();
      return;
    }
  }, true);

  STATE.toolbar = bar;
  return bar;
}

export function updateToolbar(): void {
  const bar = ensureToolbar();
  const slide = currentSlide();
  const ro = isReadOnly();
  const lang = detectUiLang();

  const panel = bar.querySelector('.lia-annot-panel') as HTMLElement | null;
  if (panel) {
    const open = (STORE.ui.panelOpen && !ro) ? '1' : '0';
    const wantedMode = (STORE.ui.panelMode === 'eraser') ? 'eraser' : 'pen';
    const builtMode = String(panel.dataset.builtMode || '');
    const builtRo = String(panel.dataset.builtRo || '');
    const builtLang = String(panel.dataset.builtLang || '');

    panel.dataset.open = open;

    const needsRebuild =
      !panel.firstElementChild ||
      builtMode !== wantedMode ||
      builtRo !== String(ro ? 1 : 0) ||
      builtLang !== lang;

    if (needsRebuild) {
      if (wantedMode === 'eraser') {
        panel.innerHTML = buildEraserPanelHTML(lang);
      } else {
        panel.innerHTML = buildPenPanelHTML(lang);
      }
      panel.dataset.builtMode = wantedMode;
      panel.dataset.builtRo = String(ro ? 1 : 0);
      panel.dataset.builtLang = lang;
    }
  }

  const note = panel ? panel.querySelector('[data-k="note"]') : null;
  if (note) {
    note.textContent = ro
      ? t(lang, 'readOnlyNote')
      : '';
  }

  const btns = bar.querySelectorAll('.lia-annot-btn[data-act]');
  btns.forEach(function (btn) {
    const el = btn as HTMLButtonElement;
    const act = String(el.getAttribute('data-act') || '');
    el.dataset.active = '0';

    if (act === 'cursor' && STORE.ui.mode === 'cursor') el.dataset.active = '1';
    if (act === 'pen' && STORE.ui.mode === 'pen') el.dataset.active = '1';
    if (act === 'eraser' && STORE.ui.mode === 'eraser') el.dataset.active = '1';
    if (act === 'toggle') {
      el.dataset.active = STORE.ui.visible ? '1' : '0';
      el.innerHTML = iconEye(!!STORE.ui.visible);
    }

    // Keep aria-pressed in sync with the active state for mode and toggle buttons
    if (act === 'cursor' || act === 'pen' || act === 'eraser' || act === 'toggle') {
      el.setAttribute('aria-pressed', el.dataset.active === '1' ? 'true' : 'false');
    }

    if (act === 'undo') {
      el.disabled = ro || slide.items.length === 0;
    } else if (act === 'redo') {
      el.disabled = ro || slide.redo.length === 0;
    } else if (act === 'pen' || act === 'eraser') {
      el.disabled = ro;
    } else {
      el.disabled = false;
    }
  });

  if (panel) {
    const colorBtns = panel.querySelectorAll('.lia-annot-color-item');
    colorBtns.forEach(function (btn) {
      const el = btn as HTMLButtonElement;
      const c = String(el.getAttribute('data-color') || '');
      el.dataset.active = (c === String(STORE.ui.color || '')) ? '1' : '0';
      el.disabled = ro;
    });

    const clearBtn = panel.querySelector('.lia-annot-danger[data-act="clear"]') as HTMLButtonElement | null;
    if (clearBtn) clearBtn.disabled = ro || slide.items.length === 0;

    const widthSlider = panel.querySelector('input[data-act="width"]') as HTMLInputElement | null;
    const alphaSlider = panel.querySelector('input[data-act="alpha"]') as HTMLInputElement | null;
    const eraserSlider = panel.querySelector('input[data-act="eraserWidth"]') as HTMLInputElement | null;

    const wTxt = panel.querySelector('[data-k="width"]');
    const aTxt = panel.querySelector('[data-k="alpha"]');
    const eTxt = panel.querySelector('[data-k="eraserWidth"]');

    if (widthSlider && document.activeElement !== widthSlider) widthSlider.value = String(STORE.ui.width);
    if (alphaSlider && document.activeElement !== alphaSlider) alphaSlider.value = String(STORE.ui.alpha);
    if (eraserSlider && document.activeElement !== eraserSlider) eraserSlider.value = String(STORE.ui.eraserWidth);

    if (wTxt) wTxt.textContent = String(STORE.ui.width);
    if (aTxt) aTxt.textContent = Math.round(Number(STORE.ui.alpha || 1) * 100) + '%';
    if (eTxt) eTxt.textContent = String(STORE.ui.eraserWidth);
  }

  if (effectiveMode() === 'eraser' && STORE.ui.visible && !ro && STATE.lastPointer && STATE.lastPointer.inside) {
    refreshEraserRing();
  } else {
    hideEraserRing();
  }
}

export function syncToolbarPosition(): void {
  const bar = ensureToolbar();
  const host = getVisibleMainHostFn();
  if (!bar || !host) return;

  const viewportW = getViewportWidth();
  const gap = 8;

  const barRect = bar.getBoundingClientRect();
  const barW = Math.ceil(barRect.width || bar.offsetWidth || 44);

  const slideContainer =
    host.closest('.lia-slide__container') ||
    host.parentElement ||
    host;

  const containerRect = slideContainer.getBoundingClientRect();

  let left = Math.round(containerRect.left + gap);
  left = Math.max(8, left);
  left = Math.min(left, Math.max(8, viewportW - barW - 8));

  bar.style.left = left + 'px';
}

// getVisibleMainHost is in overlay.ts but toolbar needs it.
// We accept it as a late-bound function reference set by boot.ts.
let getVisibleMainHostFn: () => Element = () => document.body || document.documentElement;

export function setGetVisibleMainHost(fn: () => Element): void {
  getVisibleMainHostFn = fn;
}
