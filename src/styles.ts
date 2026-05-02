// All CSS for the lia-annotation plugin, injected at runtime via ensureCss() in ui.ts.

export const CSS = `
  :root {
    --lia-annot-border: rgba(0,0,0,0.12);
    --lia-annot-fg: #1a1a1a;
    --lia-annot-accent: #3b82f6;
    --lia-annot-bg: rgba(255,255,255,0.92);
    --lia-annot-panel-bg: rgba(255,255,255,0.97);
    --lia-annot-hover-bg: rgba(0,0,0,0.06);
    --lia-annot-shadow: 0 4px 24px rgba(0,0,0,0.13), 0 1.5px 6px rgba(0,0,0,0.07);
    --lia-annot-panel-shadow: 0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07);
  }

  /* ---- Toolbar shell ---- */

  .lia-annot-toolbar {
    position: fixed;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10030;
    display: inline-flex;
    flex-direction: column;
    gap: 0;
    padding: 6px 5px;
    margin: 0;
    box-sizing: border-box;
    border: 1px solid var(--lia-annot-border);
    border-radius: 16px;
    background: var(--lia-annot-bg);
    backdrop-filter: blur(12px) saturate(1.4);
    box-shadow: var(--lia-annot-shadow);
    font-size: 14px;
  }

  .lia-annot-actions {
    display: inline-flex;
    flex-direction: column;
    gap: 2px;
    align-items: center;
  }

  /* ---- Toolbar buttons ---- */

  .lia-annot-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: var(--lia-annot-fg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    line-height: 0;
    transition: background 0.15s, color 0.15s, transform 0.1s;
  }

  .lia-annot-btn:hover:not([disabled]) {
    background: var(--lia-annot-hover-bg);
  }

  .lia-annot-btn:active:not([disabled]) {
    transform: scale(0.92);
  }

  .lia-annot-btn[data-active="1"] {
    background: var(--lia-annot-accent);
    color: #fff;
  }

  .lia-annot-btn[data-active="1"] .ico-stroke {
    stroke: #fff;
  }

  .lia-annot-btn[data-active="1"] path,
  .lia-annot-btn[data-active="1"] rect {
    fill: #fff;
  }

  .lia-annot-btn[disabled] {
    opacity: .3;
    cursor: not-allowed;
  }

  .lia-annot-btn svg {
    width: 18px;
    height: 18px;
    display: block;
    margin: 0;
    overflow: visible;
  }

  /* Icon nudges — each icon has slightly different optical weight */
  .lia-annot-btn[data-act="cursor"] svg { transform: translateX(4.5px); }
  .lia-annot-btn[data-act="pen"]    svg { transform: translateX(1px); }
  .lia-annot-btn[data-act="eraser"] svg { transform: translateX(-4px); }
  .lia-annot-btn[data-act="undo"]   svg { transform: translateX(-4px); }
  .lia-annot-btn[data-act="redo"]   svg { transform: translateX(-3px); }
  .lia-annot-btn[data-act="toggle"] svg { transform: translateX(1px); }

  .lia-annot-btn .ico-stroke {
    stroke: var(--lia-annot-fg);
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .lia-annot-btn .ico-fill {
    fill: var(--lia-annot-fg);
  }

  /* Divider between mode buttons and action buttons */
  .lia-annot-btn[data-act="undo"] {
    margin-top: 6px;
  }
  .lia-annot-btn[data-act="undo"]::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 4px;
    right: 4px;
    height: 1px;
    background: var(--lia-annot-border);
  }

  /* ---- Settings panel ---- */

  .lia-annot-panel {
    position: absolute;
    left: 46px;
    top: 0;
    z-index: 10031;
    display: none;
    grid-template-columns: 1fr;
    gap: 12px;
    width: min(280px, calc(100vw - 70px));
    padding: 12px 14px;
    box-sizing: border-box;
    border: 1px solid var(--lia-annot-border);
    border-radius: 14px;
    background: var(--lia-annot-panel-bg);
    backdrop-filter: blur(12px) saturate(1.4);
    box-shadow: var(--lia-annot-panel-shadow);
    font-size: 14px;
  }

  .lia-annot-panel[data-open="1"] {
    display: grid;
  }

  .lia-annot-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .lia-annot-row .k {
    min-width: 6em;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: .5;
  }

  .lia-annot-row .v {
    min-width: 3em;
    text-align: right;
    font-weight: 600;
    font-size: 13px;
    opacity: .7;
  }

  .lia-annot-slider {
    flex: 1;
    min-width: 0;
    width: min(160px, 40vw);
    accent-color: var(--lia-annot-accent);
  }

  .lia-annot-color-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .lia-annot-color-item {
    width: 20px;
    height: 20px;
    border-radius: 999px;
    border: 1.5px solid rgba(0,0,0,0.15);
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    background: transparent;
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .lia-annot-color-item:hover {
    transform: scale(1.15);
  }

  .lia-annot-color-item[data-active="1"] {
    box-shadow: 0 0 0 2.5px var(--lia-annot-accent);
    transform: scale(1.15);
  }

  .lia-annot-note {
    font-weight: 500;
    opacity: .6;
    font-size: .95em;
  }

  .lia-annot-danger {
    width: auto;
    min-height: 28px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid rgba(220,50,50,0.35);
    background: rgba(220,50,50,0.07);
    color: #c0392b;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .lia-annot-danger:hover {
    background: rgba(220,50,50,0.14);
  }

  /* ---- Layout overflow guards ---- */

  html, body {
    overflow-x: hidden !important;
  }

  .lia-slide__container {
    overflow-x: hidden !important;
  }

  /* ---- Annotation overlay ---- */

  .lia-annot-host {
    position: relative !important;
    overflow-x: clip !important;
    overflow-y: visible !important;
  }

  .lia-annot-shell {
    position: absolute;
    top: 0;
    z-index: 500;
    background: transparent;
    pointer-events: none;
  }

  .lia-annot-shell[data-hidden="1"] {
    display: none;
  }

  .lia-annot-canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: block;
    background: transparent;
    pointer-events: none;
  }

  /* ---- Eraser cursor ring ---- */

  .lia-annot-eraser-ring {
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

  .lia-annot-eraser-ring[data-on="1"] {
    display: block;
  }

  /* Enable pointer events on canvas when drawing/erasing */
  .lia-annot-shell[data-mode="pen"]    .lia-annot-canvas,
  .lia-annot-shell[data-mode="eraser"] .lia-annot-canvas {
    pointer-events: auto;
  }
`;
