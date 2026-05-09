<!--
author:   MINT-the-GAP, Martin Lommatzsch, Jihad
version:  0.0.1
language: en
edit: true
narrator: US English Female
comment:  Annotation overlay for LiaScript — pen, eraser, undo/redo toolbar for live presentations.

script:   ./dist/index.js

import: https://raw.githubusercontent.com/MINT-the-GAP/lia-canvas-ocr/main/README.md

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
| Pen    | Draw freehand strokes; click again to open the pen options panel |
| Eraser | Erase strokes; click again to open the eraser options panel |
| Undo   | Undo the last stroke |
| Redo   | Redo the last undone stroke |
| OCR    | Submit latest handwritten annotation as solution (only visible if OCR is loaded) |
| Eye    | Show or hide all annotations on the current slide |

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

## Implementation

          --{{0}}--
If you prefer not to use `import:`, copy the following block directly into
the header of your LiaScript document.

```markdown
script: https://cdn.jsdelivr.net/gh/MINT-the-GAP/lia-annotation@0.0.1/dist/index.js
```
