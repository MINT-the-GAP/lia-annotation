<!--
author:   MINT-the-GAP, Martin Lommatzsch, Jihad Hyadi
version:  1.0.2
language: en
edit: true
narrator: US English Female
comment:  Annotation overlay for LiaScript — pen, eraser, undo/redo toolbar for live presentations.

script:   ./dist/index.js

import: https://raw.githubusercontent.com/MINT-the-GAP/lia-canvas-ocr/main/README.md

import: https://raw.githubusercontent.com/liaTemplates/JSXGraph/main/README.md

import: https://raw.githubusercontent.com/MINT-the-GAP/lia-coordinate/refs/heads/main/README.md

-->

# LiaScript Annotation Plugin

          --{{0}}--
This plugin adds a fixed toolbar on the left side of every LiaScript slide.
Use it to draw freehand annotations with a pen, erase strokes, undo/redo, and
toggle the overlay on or off — all without leaving presentation mode.

If an OCR engine is loaded, the toolbar shows an extra OCR button for a
rectangle workflow in the style of lia-canvas-ocr:

1. Click OCR in the toolbar
2. Draw a rectangle around the handwritten solution
3. Click `Submit as Solution` near the rectangle

The selected area is recognized and inserted into the nearest answer field as
LaTeX.

When a hand-drawn coordinate-axis sketch is detected (rough horizontal +
vertical axis crossing), a small prompt can appear to create a DGS coordinate
system. If you confirm, the plugin switches to a crosshair placement mode and
you can place the coordinate system with one click.

__Try it on LiaScript:__
https://liascript.github.io/course/?https://raw.githubusercontent.com/MINT-the-GAP/lia-annotation/main/README.md

__See the project on GitHub:__
https://github.com/MINT-the-GAP/lia-annotation

           {{1}}
To use the plugin, import it in the header of your LiaScript course:

`import: https://raw.githubusercontent.com/MINT-the-GAP/lia-annotation/main/README.md`

Or pin to a specific version:

`import: https://raw.githubusercontent.com/MINT-the-GAP/lia-annotation/0.0.1/README.md`

## Toolbar

          --{{0}}--
The toolbar appears on the left edge of the viewport in presentation mode.

| Button | Action |
|--------|--------|
| Cursor | Disable drawing — interact with slide content normally |
| Pen    | Draw freehand strokes; the small dot shows the selected color; click again to open the pen options panel |
| Eraser | Erase strokes; click again to open the eraser options panel |
| Undo   | Undo the last stroke |
| Redo   | Redo the last undone stroke |
| OCR    | Submit latest handwritten annotation as solution (only visible if OCR is loaded) |
| Coord  | Place a coordinate system manually |
| Eye    | Show or hide all annotations on the current slide |

The pen follows the surface where a stroke starts. On an open
`lia-canvas-ocr` drawing area, the annotation pen activates and writes into
that canvas. Everywhere else, including over a coordinate system, it writes
to the annotation layer.

## OCR integration

          --{{0}}--
The OCR button appears automatically as soon as one of these providers is
available:

- `window.__LIA_TEX_OCR__`
- `window.__LIA_CANVAS_OCR__.ocr`

If you use lia-canvas-ocr, keep this import in your header:

`import: https://raw.githubusercontent.com/MINT-the-GAP/lia-canvas-ocr/main/README.md`

When OCR text is inserted into a quiz field, a compact TeX preview is shown
automatically (preview hides while the field is focused for editing).

The OCR/solution-selection button follows the same routing rule: start its
rectangle inside an open `lia-canvas-ocr` drawing area to use that canvas'
native selection and submit the result to its associated quiz. A rectangle
started elsewhere selects annotations as before.

## Sketch-to-DGS placement (experimental)

          --{{0}}--
The sketch recognition path is active again, but still experimental.
Only the newest connected stroke block is evaluated as a coordinate candidate,
so unrelated older strokes should no longer trigger the DGS prompt.

If JSXGraph (or `lia-coordinate`) is available, the plugin can convert a rough
axis sketch into a placed coordinate-system widget:

1. Draw a simple axis sketch with the pen (one horizontal and one vertical line)
2. Confirm the prompt `Create a DGS coordinate system?`
3. Place it via crosshair click

If no JSXGraph runtime is reachable, the plugin falls back to a static axis
preview widget.


---

Testquiz 1: Answer: 1234

[[  1234  ]] 

---

Testquiz 2: Answer: 5678

[[  5678  ]] 


## Pen options panel

          --{{0}}--
Click the pen button a second time to open the options panel.

- **Colors** — choose from 10 preset colors
- **Pen width** — slider from 1 to 24 px
- **Opacity** — slider from 10 % to 100 %

## Eraser options panel

          --{{0}}--
Click the eraser button a second time to open the options panel.

- **Eraser size** — slider from 4 to 80 px
- **Clear all** — remove every stroke on the current slide

## JavaScript API

          --{{0}}--
The plugin exposes a global `window.__LIA_ANNOTATION__` object for programmatic control.

```js
// Show or hide annotations
window.__LIA_ANNOTATION__.setVisible(true);
window.__LIA_ANNOTATION__.toggleVisible();

// Export / import full state (for persistence)
const state = window.__LIA_ANNOTATION__.exportState();
window.__LIA_ANNOTATION__.importState(state);

// Export / import a sanitised freeze snapshot
const freeze = window.__LIA_ANNOTATION__.exportFreezeState();
window.__LIA_ANNOTATION__.importFreezeState(freeze);

// Check whether any annotations have been drawn
window.__LIA_ANNOTATION__.hasFreezeData();

// Force read-only mode (null = auto-detect from CSS classes)
window.__LIA_ANNOTATION__.setReadOnly(true);

// Clear the current slide or all slides
window.__LIA_ANNOTATION__.clearSlide();
window.__LIA_ANNOTATION__.clearAllSlides();
```

Other templates can place an existing control in the annotation toolbar without
cloning it. The annotation plugin preserves the element's event listeners and
restores its original DOM position when it is unregistered. Hosted controls are
sorted by their numeric `order`. Generic controls appear after the native
show/hide-annotations button.

The established integration IDs have dedicated positions so the complete
toolbar keeps its intended workflow order: `lia-marker` is placed between Pen
and Eraser, while `lia-board-mode` is placed between Redo and the coordinate
tool. With both templates present, the visible order is Cursor, Pen, Marker,
Eraser, Undo, Redo, Font size, Coordinates and Show/hide annotations. The
optional OCR action remains between Coordinates and Show/hide when available.

```js
const button = document.querySelector('#my-template-button');

function attachToAnnotationToolbar(api) {
  if (button) api.registerToolbarControl('my-template', button, { order: 100 });
}

if (window.__LIA_ANNOTATION__) {
  attachToAnnotationToolbar(window.__LIA_ANNOTATION__);
} else {
  window.addEventListener('lia-annotation-toolbar-ready', event => {
    attachToAnnotationToolbar(event.detail);
  }, { once: true });
}
```

Templates should keep their normal standalone placement as a fallback when the
annotation API is unavailable. They can call
`unregisterToolbarControl('my-template')` to restore the recorded placement and
use `hasToolbarControl('my-template')` to inspect the registry. The ready event
only announces the generic hosting API; individual template integrations must
opt in explicitly.

## Implementation

          --{{0}}--
If you prefer not to use `import:`, copy the following block directly into
the header of your LiaScript document.

```markdown
script: https://cdn.jsdelivr.net/gh/MINT-the-GAP/lia-annotation@0.0.1/dist/index.js
```
