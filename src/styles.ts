// All CSS for the lia-annotation plugin, injected at runtime via ensureCss() in ui.ts.

export const CSS = `
  :root {
    --lia-annot-border: #000;
    --lia-annot-fg: #000;
    --lia-annot-accent: #0b5fff;
    --lia-annot-bg: rgba(255, 255, 255, 0.96);
    --lia-annot-panel-bg: rgba(255, 255, 255, 0.97);
  }

  /* ---- Toolbar shell ---- */

  .lia-annot-toolbar {
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

  .lia-annot-actions {
    display: inline-flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
  }

  /* ---- Toolbar buttons ---- */

  .lia-annot-btn {
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

  .lia-annot-btn[data-active="1"] {
    border-color: var(--lia-annot-accent);
    outline: 2px solid var(--lia-annot-accent);
    outline-offset: 2px;
  }

  .lia-annot-btn[disabled] {
    opacity: .35;
    cursor: not-allowed;
  }

  .lia-annot-btn svg {
    width: 19px;
    height: 19px;
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

  /* ---- Settings panel ---- */

  .lia-annot-panel {
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
    min-width: 6.8em;
    font-weight: 800;
    opacity: .85;
  }

  .lia-annot-row .v {
    min-width: 3.2em;
    text-align: right;
    font-weight: 850;
  }

  .lia-annot-slider {
    width: min(180px, 45vw);
  }

  .lia-annot-color-grid {
    display: grid;
    grid-template-columns: repeat(5, 22px);
    gap: 10px;
    align-items: center;
  }

  .lia-annot-color-item {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 2px solid var(--lia-annot-border);
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    background: transparent;
  }

  .lia-annot-color-item[data-active="1"] {
    outline: 2px solid var(--lia-annot-border);
    outline-offset: 2px;
  }

  .lia-annot-note {
    font-weight: 750;
    opacity: .8;
    font-size: .95em;
  }

  .lia-annot-danger {
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
