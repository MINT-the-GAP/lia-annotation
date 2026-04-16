(function () {

  function getRootWindow(): Window {
    let w: Window = window;
    try { while ((w as any).parent && (w as any).parent !== w) w = (w as any).parent; } catch (e) { }
    return w;
  }

  const ROOT = getRootWindow() as any;
  const DOC_ID: string = document.baseURI || location.href || 'doc';
  const REGKEY = '__LIA_ANNOTATION_REG_V8__';

  ROOT[REGKEY] = ROOT[REGKEY] || { docs: {} };
  if (ROOT[REGKEY].docs[DOC_ID]) return;
  ROOT[REGKEY].docs[DOC_ID] = true;

  const STOREKEY = '__LIA_ANNOTATION_STORE_V8__';
  ROOT[STOREKEY] = ROOT[STOREKEY] || {
    slides: {} as Record<string, SlideData>,
    ui: {
      mode: 'cursor' as Mode,
      visible: true,
      panelOpen: false,
      panelMode: 'pen' as PanelMode,
      color: '#ff0000',
      width: 3,
      alpha: 1,
      eraserWidth: 18,
      forcedReadOnly: null as boolean | null
    }
  };

  type Mode = 'cursor' | 'pen' | 'eraser';
  type PanelMode = 'pen' | 'eraser';

  interface Point { x: number; y: number; }

  interface PathItem {
    kind: 'path';
    tool: Mode;
    color: string;
    width: number;
    alpha: number;
    baseW: number;
    points: Point[];
  }

  interface SlideData {
    items: PathItem[];
    redo: PathItem[];
  }

  interface UiState {
    mode: Mode;
    visible: boolean;
    panelOpen: boolean;
    panelMode: PanelMode;
    color: string;
    width: number;
    alpha: number;
    eraserWidth: number;
    forcedReadOnly: boolean | null;
  }

  interface Store {
    slides: Record<string, SlideData>;
    ui: UiState;
  }

  const STORE: Store = ROOT[STOREKEY];

  interface State {
    host: Element | null;
    shell: HTMLElement | null;
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    slideKey: string | null;
    cssW: number;
    cssH: number;
    dpr: number;
    drawing: boolean;
    activePath: PathItem | null;
    syncRAF: number;
    redrawRAF: number;
    resizeObserver: ResizeObserver | null;
    toolbar: HTMLElement | null;
    eraserRing: HTMLElement | null;
    lastPointer: { x: number; y: number; inside: boolean; pointerType: string; };
  }

  const STATE: State = {
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

  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------
  function clamp(v: number, a: number, b: number): number {
    return Math.max(a, Math.min(b, v));
  }

  function copyJson<T>(x: T): T | null {
    try { return JSON.parse(JSON.stringify(x)); }
    catch (_) { return null; }
  }

  function parseRgbNoRegex(s: string): [number, number, number] | null {
    const str = String(s || '');
    const i0 = str.indexOf('(');
    const i1 = str.indexOf(')');
    if (i0 < 0 || i1 < 0) return null;
    const parts = str.slice(i0 + 1, i1).split(',').map(v => Number(String(v).trim()));
    if (parts.length < 3) return null;
    if (!isFinite(parts[0]) || !isFinite(parts[1]) || !isFinite(parts[2])) return null;
    return [parts[0], parts[1], parts[2]];
  }

  function luminance(rgb: [number, number, number]): number {
    const arr = rgb.map(v => v / 255).map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    return 0.2126 * arr[0] + 0.7152 * arr[1] + 0.0722 * arr[2];
  }

  function getViewportWidth(): number {
    return Math.max(
      1,
      window.innerWidth || 0,
      document.documentElement ? document.documentElement.clientWidth || 0 : 0
    );
  }

  function getCurrentHash(): string {
    const h = String(location.hash || '').trim();
    return h || '#1';
  }

  function getSlideKey(): string {
    return getCurrentHash();
  }

  function ensureSlide(key: string): SlideData {
    STORE.slides[key] = STORE.slides[key] || { items: [], redo: [] };
    return STORE.slides[key];
  }

  function currentSlide(): SlideData {
    return ensureSlide(getSlideKey());
  }

  function toRel(x: number, y: number): Point {
    return {
      x: STATE.cssW > 0 ? x / STATE.cssW : 0,
      y: STATE.cssH > 0 ? y / STATE.cssH : 0
    };
  }

  function fromRel(pt: Point): Point {
    return {
      x: (pt && isFinite(pt.x)) ? pt.x * STATE.cssW : 0,
      y: (pt && isFinite(pt.y)) ? pt.y * STATE.cssH : 0
    };
  }

  function getDirectHeader(host: Element): HTMLElement | null {
    if (!host) return null;
    const kids = host.children || [];
    for (let i = 0; i < kids.length; i++) {
      const el = kids[i];
      if (el && el.tagName && el.tagName.toLowerCase() === 'header') return el as HTMLElement;
    }
    return null;
  }

  function findDirectChildByClass(parent: Element | null, cls: string): HTMLElement | null {
    if (!parent) return null;
    const kids = parent.children || [];
    for (let i = 0; i < kids.length; i++) {
      const el = kids[i] as HTMLElement;
      if (el.classList && el.classList.contains(cls)) return el;
    }
    return null;
  }

  function isMainVisible(main: Element): boolean {
    if (!main) return false;
    if (main.hasAttribute('hidden')) return false;
    const cs = getComputedStyle(main);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = main.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function getVisibleMainHost(): Element {
    const mains = Array.from(document.querySelectorAll('main'));
    for (let i = 0; i < mains.length; i++) {
      if (isMainVisible(mains[i])) return mains[i];
    }
    return mains[0] || document.querySelector('main') || document.body || document.documentElement;
  }

  function isReadOnly(): boolean {
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

  function effectiveMode(): Mode {
    if (!STORE.ui.visible) return 'cursor';
    if (isReadOnly()) return 'cursor';
    return STORE.ui.mode || 'cursor';
  }

  function getThemeAccent(): string | null {
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

  function applyThemeVars(): void {
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

  function getLineWidthPx(item: PathItem): number {
    const baseW = Math.max(1, Number(item && item.baseW) || STATE.cssW || 1);
    const curW = Math.max(1, STATE.cssW || 1);
    const w = Math.max(0.75, Number(item && item.width) || 1);
    return Math.max(0.75, w * (curW / baseW));
  }

  function getLiveEraserRingSize(): number {
    return Math.max(8, Number(STORE.ui.eraserWidth || 18));
  }

  function hideEraserRing(): void {
    if (!STATE.eraserRing) return;
    STATE.eraserRing.dataset.on = '0';
  }

  function updateEraserRing(x: number, y: number): void {
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

  function refreshEraserRing(): void {
    if (!STATE.lastPointer || !STATE.lastPointer.inside) {
      hideEraserRing();
      return;
    }
    updateEraserRing(STATE.lastPointer.x, STATE.lastPointer.y);
  }

  // ---------------------------------------------------------
  // CSS
  // ---------------------------------------------------------
  function ensureCss(): void {
    if (document.getElementById('__lia_annotation_css_v8')) return;
    const st = document.createElement('style');
    st.id = '__lia_annotation_css_v8';
    st.textContent = `
    :root{
      --lia-annot-border:#000;
      --lia-annot-fg:#000;
      --lia-annot-accent:#0b5fff;
      --lia-annot-bg: rgba(255,255,255,0.96);
      --lia-annot-panel-bg: rgba(255,255,255,0.97);
    }

    .lia-annot-toolbar{
      position: fixed;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10030;
      display: inline-flex;
      flex-direction: column;
      gap: 6px;
      padding: 5px;
      margin: 0;
      box-sizing: border-box;
      border: 2px solid var(--lia-annot-border);
      border-radius: 10px;
      background: var(--lia-annot-bg);
      backdrop-filter: blur(6px);
    }

    .lia-annot-actions{
      display: inline-flex;
      flex-direction: column;
      gap: 5px;
      align-items: center;
    }

    .lia-annot-btn{
      width: 28px;
      height: 28px;
      padding: 0;
      border: 2px solid var(--lia-annot-border);
      border-radius: 999px;
      background: transparent;
      color: var(--lia-annot-fg);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      line-height: 0;
    }

    .lia-annot-btn[data-active="1"]{
      border-color: var(--lia-annot-accent);
      outline: 2px solid var(--lia-annot-accent);
      outline-offset: 2px;
    }

    .lia-annot-btn[disabled]{
      opacity: .35;
      cursor: not-allowed;
    }

    .lia-annot-btn svg{
      width: 19px;
      height: 19px;
      display: block;
      margin: 0;
      overflow: visible;
    }

    .lia-annot-btn[data-act="cursor"] svg{ transform: translateX(4.5px); }
    .lia-annot-btn[data-act="pen"] svg{ transform: translateX(1px); }
    .lia-annot-btn[data-act="eraser"] svg{ transform: translateX(-4px); }
    .lia-annot-btn[data-act="undo"] svg{ transform: translateX(-4px); }
    .lia-annot-btn[data-act="redo"] svg{ transform: translateX(-3px); }
    .lia-annot-btn[data-act="toggle"] svg{ transform: translateX(1px); }

    .lia-annot-btn .ico-stroke{
      stroke: var(--lia-annot-fg);
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .lia-annot-btn .ico-fill{
      fill: var(--lia-annot-fg);
    }

    .lia-annot-panel{
      position: absolute;
      left: 44px;
      top: 0;
      z-index: 10031;
      display: none;
      grid-template-columns: 1fr;
      gap: 10px;
      width: min(300px, calc(100vw - 70px));
      padding: 9px 10px;
      box-sizing: border-box;
      border: 2px solid var(--lia-annot-border);
      border-radius: 10px;
      background: var(--lia-annot-panel-bg);
      backdrop-filter: blur(6px);
    }

    .lia-annot-panel[data-open="1"]{
      display: grid;
    }

    .lia-annot-row{
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .lia-annot-row .k{
      min-width: 6.8em;
      font-weight: 800;
      opacity: .85;
    }

    .lia-annot-row .v{
      min-width: 3.2em;
      text-align: right;
      font-weight: 850;
    }

    .lia-annot-slider{
      width: min(180px, 45vw);
    }

    .lia-annot-color-grid{
      display: grid;
      grid-template-columns: repeat(5, 22px);
      gap: 10px;
      align-items: center;
    }

    .lia-annot-color-item{
      width: 22px;
      height: 22px;
      border-radius: 999px;
      border: 2px solid var(--lia-annot-border);
      box-sizing: border-box;
      cursor: pointer;
      user-select: none;
      background: transparent;
    }

    .lia-annot-color-item[data-active="1"]{
      outline: 2px solid var(--lia-annot-border);
      outline-offset: 2px;
    }

    .lia-annot-note{
      font-weight: 750;
      opacity: .8;
      font-size: .95em;
    }

    .lia-annot-danger{
      width: auto;
      min-height: 30px;
      padding: 6px 10px;
      border-radius: 999px;
      border: 2px solid var(--lia-annot-border);
      background: transparent;
      color: var(--lia-annot-fg);
      font-weight: 850;
      cursor: pointer;
    }

    html, body{
      overflow-x: hidden !important;
    }

    .lia-slide__container{
      overflow-x: hidden !important;
    }

    .lia-annot-host{
      position: relative !important;
      overflow-x: clip !important;
      overflow-y: visible !important;
    }

    .lia-annot-shell{
      position: absolute;
      top: 0;
      z-index: 500;
      background: transparent;
      pointer-events: none;
    }

    .lia-annot-shell[data-hidden="1"]{
      display: none;
    }

    .lia-annot-canvas{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: block;
      background: transparent;
      pointer-events: none;
    }

    .lia-annot-eraser-ring{
      position: absolute;
      left: 0;
      top: 0;
      width: 12px;
      height: 12px;
      border-radius: 999px;
      box-sizing: border-box;
      border: 2px solid var(--lia-annot-accent);
      background: transparent;
      box-shadow: 0 0 0 1px var(--lia-annot-border);
      pointer-events: none;
      display: none;
      z-index: 501;
      transform: translate(-50%, -50%);
    }

    .lia-annot-eraser-ring[data-on="1"]{
      display: block;
    }

    .lia-annot-shell[data-mode="pen"] .lia-annot-canvas,
    .lia-annot-shell[data-mode="eraser"] .lia-annot-canvas{
      pointer-events: auto;
    }
    `;
    (document.head || document.documentElement).appendChild(st);
  }

  // ---------------------------------------------------------
  // Icons
  // ---------------------------------------------------------
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

  function iconEye(open: boolean): string {
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

  // ---------------------------------------------------------
  // Toolbar panel content
  // ---------------------------------------------------------
  function getColors(): string[] {
    return [
      '#ff0000', '#ff7500', '#ffff00', '#ff00ff', '#0055ff',
      '#00ffff', '#00ff00', '#007500', '#000000', '#ffffff'
    ];
  }

  function buildPenPanelHTML(): string {
    const colorButtons = getColors().map(function (c) {
      return '<button class="lia-annot-color-item" type="button" data-color="' + c + '" aria-label="Color ' + c + '" data-snapshot-admin="1" style="background:' + c + ';"></button>';
    }).join('');

    return `
      <div class="lia-annot-row">
        <span class="k">Colors</span>
        <span class="lia-annot-color-grid">${colorButtons}</span>
      </div>
      <div class="lia-annot-row">
        <span class="k">Pen width</span>
        <input class="lia-annot-slider" type="range" min="1" max="24" step="1" value="${STORE.ui.width}" data-act="width" aria-label="Pen width" data-snapshot-admin="1">
        <span class="v" data-k="width">${STORE.ui.width}</span>
      </div>
      <div class="lia-annot-row">
        <span class="k">Opacity</span>
        <input class="lia-annot-slider" type="range" min="0.1" max="1" step="0.05" value="${STORE.ui.alpha}" data-act="alpha" aria-label="Opacity" data-snapshot-admin="1">
        <span class="v" data-k="alpha">${Math.round(Number(STORE.ui.alpha || 1) * 100)}%</span>
      </div>
      <div class="lia-annot-note" data-k="note"></div>
    `;
  }

  function buildEraserPanelHTML(): string {
    return `
      <div class="lia-annot-row">
        <span class="k">Eraser</span>
        <input class="lia-annot-slider" type="range" min="4" max="80" step="1" value="${STORE.ui.eraserWidth}" data-act="eraserWidth" aria-label="Eraser width" data-snapshot-admin="1">
        <span class="v" data-k="eraserWidth">${STORE.ui.eraserWidth}</span>
      </div>
      <div class="lia-annot-row">
        <button class="lia-annot-danger" type="button" data-act="clear" data-snapshot-admin="1">Clear all</button>
      </div>
      <div class="lia-annot-note" data-k="note"></div>
    `;
  }

  // ---------------------------------------------------------
  // Toolbar
  // ---------------------------------------------------------
  function ensureToolbar(): HTMLElement {
    if (STATE.toolbar && STATE.toolbar.isConnected) return STATE.toolbar;

    const bar = document.createElement('div');
    bar.className = 'lia-annot-toolbar';
    bar.setAttribute('data-snapshot-admin', '1');

    bar.innerHTML = `
      <div class="lia-annot-actions">
        <button class="lia-annot-btn" type="button" data-act="cursor" aria-label="Cursor" data-snapshot-admin="1">${iconCursor()}</button>
        <button class="lia-annot-btn" type="button" data-act="pen" aria-label="Pen" data-snapshot-admin="1">${iconPen()}</button>
        <button class="lia-annot-btn" type="button" data-act="eraser" aria-label="Eraser" data-snapshot-admin="1">${iconEraser()}</button>
        <button class="lia-annot-btn" type="button" data-act="undo" aria-label="Undo" data-snapshot-admin="1">${iconUndo()}</button>
        <button class="lia-annot-btn" type="button" data-act="redo" aria-label="Redo" data-snapshot-admin="1">${iconRedo()}</button>
        <button class="lia-annot-btn" type="button" data-act="toggle" aria-label="Show/hide annotations" data-snapshot-admin="1">${iconEye(true)}</button>
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
        requestRedraw();
        return;
      }

      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const act = String(btn.getAttribute('data-act') || '');

      if (act === 'toggle') {
        ensureOverlay();
        STORE.ui.visible = !STORE.ui.visible;
        syncOverlayInteractivity();
        updateToolbar();
        requestRedraw();
        requestSync();
        return;
      }
      if (act === 'cursor') {
        STORE.ui.mode = 'cursor';
        STORE.ui.panelOpen = false;
        syncOverlayInteractivity();
        updateToolbar();
        return;
      }
      if (act === 'pen') {
        if (isReadOnly()) return;
        const same = (STORE.ui.mode === 'pen' && STORE.ui.panelMode === 'pen' && STORE.ui.panelOpen);
        STORE.ui.mode = 'pen';
        STORE.ui.panelMode = 'pen';
        STORE.ui.panelOpen = !same;
        syncOverlayInteractivity();
        updateToolbar();
        return;
      }
      if (act === 'eraser') {
        if (isReadOnly()) return;
        const same = (STORE.ui.mode === 'eraser' && STORE.ui.panelMode === 'eraser' && STORE.ui.panelOpen);
        STORE.ui.mode = 'eraser';
        STORE.ui.panelMode = 'eraser';
        STORE.ui.panelOpen = !same;
        syncOverlayInteractivity();
        updateToolbar();
        return;
      }
      if (act === 'undo') {
        if (isReadOnly()) return;
        doUndo();
        return;
      }
      if (act === 'redo') {
        if (isReadOnly()) return;
        doRedo();
        return;
      }
      if (act === 'clear') {
        if (isReadOnly()) return;
        clearSlide();
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

  function updateToolbar(): void {
    const bar = ensureToolbar();
    const slide = currentSlide();
    const ro = isReadOnly();

    const panel = bar.querySelector('.lia-annot-panel') as HTMLElement | null;
    if (panel) {
      const open = (STORE.ui.panelOpen && !ro) ? '1' : '0';
      const wantedMode = (STORE.ui.panelMode === 'eraser') ? 'eraser' : 'pen';
      const builtMode = String(panel.dataset.builtMode || '');
      const builtRo = String(panel.dataset.builtRo || '');

      panel.dataset.open = open;

      const needsRebuild =
        !panel.firstElementChild ||
        builtMode !== wantedMode ||
        builtRo !== String(ro ? 1 : 0);

      if (needsRebuild) {
        if (wantedMode === 'eraser') {
          panel.innerHTML = buildEraserPanelHTML();
        } else {
          panel.innerHTML = buildPenPanelHTML();
        }
        panel.dataset.builtMode = wantedMode;
        panel.dataset.builtRo = String(ro ? 1 : 0);
      }
    }

    const note = panel ? panel.querySelector('[data-k="note"]') : null;
    if (note) {
      note.textContent = ro
        ? 'Freeze/read-only mode: drawing is locked, show/hide still works.'
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

  function syncToolbarPosition(): void {
    const bar = ensureToolbar();
    const host = getVisibleMainHost();
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

  // ---------------------------------------------------------
  // Overlay
  // ---------------------------------------------------------
  function disconnectResizeObserver(): void {
    try { if (STATE.resizeObserver) STATE.resizeObserver.disconnect(); } catch (_) { }
    STATE.resizeObserver = null;
  }

  function bindResizeObserver(): void {
    disconnectResizeObserver();
    if (!STATE.host) return;
    try {
      STATE.resizeObserver = new ResizeObserver(function () { requestSync(); });
      STATE.resizeObserver.observe(STATE.host);
    } catch (_) { }
  }

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

  function bindCanvasEvents(): void {
    if (!STATE.canvas || (STATE.canvas as any).__liaAnnotBound) return;
    (STATE.canvas as any).__liaAnnotBound = true;

    function getLocalPos(evt: PointerEvent): Point {
      const r = STATE.canvas!.getBoundingClientRect();
      const x = clamp(evt.clientX - r.left, 0, STATE.cssW);
      const y = clamp(evt.clientY - r.top, 0, STATE.cssH);
      return { x, y };
    }

    function rememberPointer(evt: PointerEvent): Point {
      const p = getLocalPos(evt);
      STATE.lastPointer = { x: p.x, y: p.y, inside: true, pointerType: String(evt.pointerType || '') };
      return p;
    }

    function addPoint(path: PathItem, x: number, y: number): void {
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
      const slide = currentSlide();
      const item: PathItem = {
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

  function ensureOverlay(): void {
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

  function syncOverlayInteractivity(): void {
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

  function syncCanvasSize(): void {
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

  function requestSync(): void {
    if (STATE.syncRAF) return;
    STATE.syncRAF = requestAnimationFrame(function () {
      STATE.syncRAF = 0;
      ensureOverlay();
      syncCanvasSize();
      syncToolbarPosition();
      requestRedraw();
    });
  }

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------
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

  function drawItem(ctx: CanvasRenderingContext2D, item: PathItem): void {
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

  function redrawNow(): void {
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

  function requestRedraw(): void {
    if (STATE.redrawRAF) return;
    STATE.redrawRAF = requestAnimationFrame(function () {
      STATE.redrawRAF = 0;
      redrawNow();
      updateToolbar();
    });
  }

  // ---------------------------------------------------------
  // State ops
  // ---------------------------------------------------------
  function doUndo(): void {
    const s = currentSlide();
    if (!s.items.length) return;
    s.redo.push(s.items.pop()!);
    requestRedraw();
    updateToolbar();
  }

  function doRedo(): void {
    const s = currentSlide();
    if (!s.redo.length) return;
    s.items.push(s.redo.pop()!);
    requestRedraw();
    updateToolbar();
  }

  function clearSlide(): void {
    const s = currentSlide();
    s.items = [];
    s.redo = [];
    requestRedraw();
    updateToolbar();
  }

  function clearAllSlides(): void {
    STORE.slides = {};
    ensureSlide(getSlideKey());
    requestRedraw();
    updateToolbar();
  }

  // ---------------------------------------------------------
  // Freeze helpers
  // ---------------------------------------------------------
  function roundFreezeNum(v: unknown): number | null {
    const n = Number(v);
    if (!isFinite(n)) return null;
    return Math.round(n * 10000) / 10000;
  }

  function sanitizeFreezePoint(pt: unknown): Point | null {
    if (!pt || typeof pt !== 'object') return null;
    const obj = pt as Record<string, unknown>;
    const x = roundFreezeNum(obj.x);
    const y = roundFreezeNum(obj.y);
    if (x === null || y === null) return null;
    return { x, y };
  }

  function sanitizeFreezeItem(item: unknown): PathItem | null {
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

  function sanitizeFreezeSlides(srcSlides: unknown): Record<string, SlideData> {
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

  function hasFreezeData(): boolean {
    const slides = sanitizeFreezeSlides(STORE.slides);
    for (const k in slides) {
      if (Object.prototype.hasOwnProperty.call(slides, k)) return true;
    }
    return false;
  }

  // ---------------------------------------------------------
  // Export / Import API
  // ---------------------------------------------------------
  function exportState(): unknown {
    return copyJson({
      version: 'lia-annotation-v8',
      ui: { visible: !!STORE.ui.visible },
      slides: STORE.slides
    });
  }

  function exportFreezeState(): unknown {
    return copyJson({
      version: 'lia-annotation-freeze-v1',
      ui: { visible: !!STORE.ui.visible },
      slides: sanitizeFreezeSlides(STORE.slides)
    });
  }

  function importState(payload: unknown, opts?: { replace?: boolean }): boolean {
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

  function importFreezeState(payload: unknown, opts?: { replace?: boolean }): boolean {
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

  function setVisible(v: boolean): void {
    STORE.ui.visible = !!v;
    syncOverlayInteractivity();
    requestRedraw();
    updateToolbar();
  }

  function setReadOnly(v: boolean | null): void {
    STORE.ui.forcedReadOnly = (v === null) ? null : !!v;
    syncOverlayInteractivity();
    updateToolbar();
  }

  // ---------------------------------------------------------
  // Global API
  // ---------------------------------------------------------
  (window as any).__LIA_ANNOTATION__ = {
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

  (window as any).__LIA_ANNOTATION_EXPORT__ = function () { return exportState(); };
  (window as any).__LIA_ANNOTATION_IMPORT__ = function (payload: unknown, opts?: { replace?: boolean }) { return importState(payload, opts); };
  (window as any).__LIA_ANNOTATION_FREEZE_EXPORT__ = function () { return exportFreezeState(); };
  (window as any).__LIA_ANNOTATION_FREEZE_IMPORT__ = function (payload: unknown, opts?: { replace?: boolean }) { return importFreezeState(payload, opts); };
  (window as any).__LIA_ANNOTATION_FREEZE_HAS_DATA__ = function () { return hasFreezeData(); };

  // ---------------------------------------------------------
  // Boot
  // ---------------------------------------------------------
  function boot(): void {
    ensureCss();
    applyThemeVars();
    ensureToolbar();
    ensureSlide(getSlideKey());
    ensureOverlay();
    syncToolbarPosition();
    updateToolbar();

    setTimeout(function () { ensureOverlay(); requestSync(); }, 0);
    setTimeout(function () { ensureOverlay(); requestSync(); }, 80);
    setTimeout(function () { ensureOverlay(); requestSync(); }, 250);
    setTimeout(function () { ensureOverlay(); requestSync(); }, 700);
  }

  window.addEventListener('resize', function () { applyThemeVars(); ensureToolbar(); requestSync(); });
  window.addEventListener('hashchange', function () {
    ensureSlide(getSlideKey());
    ensureOverlay();
    updateToolbar();
    setTimeout(function () { ensureOverlay(); requestSync(); }, 40);
    setTimeout(function () { ensureOverlay(); requestSync(); }, 180);
    setTimeout(function () { ensureOverlay(); requestSync(); }, 500);
  });
  window.addEventListener('scroll', function () { requestSync(); }, true);
  document.addEventListener('input', function () { requestSync(); }, true);
  document.addEventListener('change', function () { requestSync(); }, true);

  const themeMo = new MutationObserver(function () { applyThemeVars(); updateToolbar(); requestRedraw(); });
  try {
    themeMo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
  } catch (_) { }

  boot();

})();
