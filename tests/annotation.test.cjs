const assert = require('node:assert/strict');
const { test, before, after } = require('node:test');
const { launchBrowser, openPage, reset, metrics, settle, clickTool, stroke, alphaAt } = require('./harness.cjs');

let browser;
before(async () => {
  browser = await launchBrowser();
  console.log(`Browser regression tests: ${browser.version()}`);
});
after(async () => { await browser?.close(); });

async function usingPage(t, options) {
  const page = await openPage(browser, options);
  t.after(async () => {
    const errors = [...page.testErrors];
    await page.close();
    assert.deepEqual(errors, [], 'browser execution errors');
  });
  return page;
}

async function assertQuiet(page, ms = 160) {
  await reset(page);
  await settle(page, ms);
  assert.deepEqual(await metrics(page), {
    raf: 0, frames: 0, paints: 0, pending: 0, mutations: 0, toolbarMutations: 0
  });
}

test('root-window lookup keeps registries in the local frame for a cross-origin parent', async t => {
  const page = await usingPage(t);
  assert.equal(await page.evaluate(() => {
    const local = {};
    const foreignParent = {};
    Object.defineProperty(local, 'parent', { value: foreignParent });
    Object.defineProperty(foreignParent, 'document', {
      get() { throw new DOMException('Blocked by the same-origin policy', 'SecurityError'); }
    });
    return window.__annotationTest.store.getRootWindow(local) === local;
  }), true);
});

test('external toolbar controls register, sort, survive rebuilds and restore without stealing events', async t => {
  const page = await usingPage(t, {
    beforeBoot: () => {
      window.__annotationReadyCount = 0;
      window.addEventListener('lia-annotation-toolbar-ready', event => {
        window.__annotationReadyCount++;
        window.__annotationReadyDetail = event.detail;
      });
    }
  });

  assert.deepEqual(await page.evaluate(() => ({
    register: typeof window.__LIA_ANNOTATION__.registerToolbarControl,
    unregister: typeof window.__LIA_ANNOTATION__.unregisterToolbarControl,
    has: typeof window.__LIA_ANNOTATION__.hasToolbarControl,
    readyCount: window.__annotationReadyCount,
    readyDetailMatches: window.__annotationReadyDetail === window.__LIA_ANNOTATION__,
    emptyChildren: document.querySelector('.lia-annot-external-actions').children.length,
    emptyDisplay: getComputedStyle(document.querySelector('.lia-annot-external-actions')).display,
    toggleBeforeExternal:
      document.querySelector('[data-act=toggle]').nextElementSibling ===
        document.querySelector('.lia-annot-external-actions'),
    externalIsLast: document.querySelector('.lia-annot-external-actions').nextElementSibling === null
  })), {
    register: 'function',
    unregister: 'function',
    has: 'function',
    readyCount: 1,
    readyDetailMatches: true,
    emptyChildren: 0,
    emptyDisplay: 'none',
    toggleBeforeExternal: true,
    externalIsLast: true
  });

  const registered = await page.evaluate(() => {
    const origin = document.createElement('div');
    origin.id = 'external-origin';
    const a = document.createElement('button');
    const b = document.createElement('button');
    const z = document.createElement('button');
    const anchor = document.createElement('span');
    a.id = 'external-a';
    a.className = 'lia-annot-btn';
    a.dataset.act = 'pen';
    b.id = 'external-b';
    z.id = 'external-z';
    anchor.id = 'external-anchor';
    origin.append(a, b, z, anchor);
    document.body.append(origin);
    window.__externalClicks = 0;
    a.addEventListener('click', () => window.__externalClicks++);

    const api = window.__LIA_ANNOTATION__;
    return {
      a: api.registerToolbarControl('a-control', a, { order: 10 }),
      b: api.registerToolbarControl('b-control', b, { order: 10 }),
      z: api.registerToolbarControl('z-control', z, { order: 20 }),
      duplicateId: api.registerToolbarControl('a-control', document.createElement('button')),
      duplicateElement: api.registerToolbarControl('other-control', a),
      repeated: api.registerToolbarControl('a-control', a)
    };
  });
  assert.deepEqual(registered, {
    a: true, b: true, z: true, duplicateId: false, duplicateElement: false, repeated: true
  });

  assert.deepEqual(await page.evaluate(() => {
    const api = window.__LIA_ANNOTATION__;
    const host = document.querySelector('.lia-annot-external-actions');
    document.querySelector('#external-a').click();
    api.setReadOnly(true);
    return {
      order: Array.from(host.children, element => element.getAttribute('data-lia-annotation-control')),
      clicks: window.__externalClicks,
      hosted: document.querySelector('#external-a').getAttribute('data-lia-annotation-hosted'),
      classed: document.querySelector('#external-a').classList.contains('lia-annot-external-control'),
      disabled: document.querySelector('#external-a').disabled,
      allRegistered: ['a-control', 'b-control', 'z-control'].every(id => api.hasToolbarControl(id))
    };
  }), {
    order: ['a-control', 'b-control', 'z-control'],
    clicks: 1,
    hosted: 'true',
    classed: true,
    disabled: false,
    allRegistered: true
  });

  await reset(page);
  await page.evaluate(() => {
    const api = window.__LIA_ANNOTATION__;
    const a = document.querySelector('#external-a');
    for (let i = 0; i < 10; i++) {
      api.registerToolbarControl('a-control', a, { order: 10 });
      window.__annotationTest.ui.updateToolbar();
    }
  });
  await settle(page);
  assert.equal((await metrics(page)).toolbarMutations, 0);

  assert.deepEqual(await page.evaluate(() => {
    const oldToolbar = document.querySelector('.lia-annot-toolbar');
    oldToolbar.remove();
    const newToolbar = window.__annotationTest.ui.ensureToolbar();
    return {
      replaced: oldToolbar !== newToolbar,
      controls: Array.from(newToolbar.querySelector('.lia-annot-external-actions').children, element => element.id),
      toggleBeforeExternal:
        newToolbar.querySelector('[data-act=toggle]').nextElementSibling ===
          newToolbar.querySelector('.lia-annot-external-actions'),
      externalIsLast:
        newToolbar.querySelector('.lia-annot-external-actions').nextElementSibling === null,
      aConnected: document.querySelector('#external-a').isConnected
    };
  }), {
    replaced: true,
    controls: ['external-a', 'external-b', 'external-z'],
    toggleBeforeExternal: true,
    externalIsLast: true,
    aConnected: true
  });

  assert.deepEqual(await page.evaluate(() => {
    const api = window.__LIA_ANNOTATION__;
    const results = [
      api.unregisterToolbarControl('a-control'),
      api.unregisterToolbarControl('b-control'),
      api.unregisterToolbarControl('z-control'),
      api.unregisterToolbarControl('missing-control')
    ];
    const origin = document.querySelector('#external-origin');
    const host = document.querySelector('.lia-annot-external-actions');
    return {
      results,
      restored: Array.from(origin.children, element => element.id),
      attributesRemoved: !origin.querySelector('#external-a').hasAttribute('data-lia-annotation-hosted') &&
        !origin.querySelector('#external-a').hasAttribute('data-lia-annotation-control'),
      classRemoved: !origin.querySelector('#external-a').classList.contains('lia-annot-external-control'),
      hostChildren: host.children.length,
      hostDisplay: getComputedStyle(host).display,
      noneRegistered: ['a-control', 'b-control', 'z-control'].every(id => !api.hasToolbarControl(id))
    };
  }), {
    results: [true, true, true, false],
    restored: ['external-a', 'external-b', 'external-z', 'external-anchor'],
    attributesRemoved: true,
    classRemoved: true,
    hostChildren: 0,
    hostDisplay: 'none',
    noneRegistered: true
  });
});

test('marker and board-mode controls occupy the requested native toolbar positions', async t => {
  const page = await usingPage(t);

  const initial = await page.evaluate(() => {
    const origin = document.createElement('div');
    origin.id = 'reserved-control-origin';
    const marker = document.createElement('button');
    marker.id = 'reserved-marker';
    const board = document.createElement('button');
    board.id = 'reserved-board';
    const anchor = document.createElement('span');
    anchor.id = 'reserved-anchor';
    origin.append(marker, board, anchor);
    document.body.append(origin);

    const api = window.__LIA_ANNOTATION__;
    const registered = [
      api.registerToolbarControl('lia-board-mode', board, { order: 200 }),
      api.registerToolbarControl('lia-marker', marker, { order: 100 })
    ];

    function flattened(visibleOnly) {
      const result = [];
      const actions = document.querySelector('.lia-annot-actions');
      for (const child of actions.children) {
        if (child.matches('.lia-annot-btn[data-act]')) {
          if (!visibleOnly || getComputedStyle(child).display !== 'none') {
            result.push(child.dataset.act);
          }
          continue;
        }
        if (child.matches('.lia-annot-external-slot')) {
          for (const control of child.children) {
            if (!visibleOnly || getComputedStyle(control).display !== 'none') {
              result.push(control.getAttribute('data-lia-annotation-control'));
            }
          }
        }
      }
      return result;
    }

    const pen = document.querySelector('[data-act=pen]');
    const eraser = document.querySelector('[data-act=eraser]');
    const undo = document.querySelector('[data-act=undo]');
    const redo = document.querySelector('[data-act=redo]');
    const coordinate = document.querySelector('[data-act=dgs-place]');
    const markerSlot = document.querySelector('[data-lia-annotation-slot=marker]');
    const boardSlot = document.querySelector('[data-lia-annotation-slot=board]');
    const fallbackSlot = document.querySelector('[data-lia-annotation-slot=fallback]');
    const rect = element => element.getBoundingClientRect();
    const penRect = rect(pen);
    const markerRect = rect(marker);
    const eraserRect = rect(eraser);
    const undoRect = rect(undo);
    const redoRect = rect(redo);
    const boardRect = rect(board);
    const coordinateRect = rect(coordinate);
    const markerStyle = getComputedStyle(markerSlot);
    const boardStyle = getComputedStyle(boardSlot);
    const boardDivider = getComputedStyle(boardSlot, '::before');

    return {
      registered,
      domOrder: flattened(false),
      visibleOrder: flattened(true),
      markerSlot: marker.parentElement?.getAttribute('data-lia-annotation-slot'),
      boardSlot: board.parentElement?.getAttribute('data-lia-annotation-slot'),
      neighbors: {
        penMarker: pen.nextElementSibling === markerSlot,
        markerEraser: markerSlot.nextElementSibling === eraser,
        redoBoard: redo.nextElementSibling === boardSlot,
        boardCoordinate: boardSlot.nextElementSibling === coordinate,
        eyeFallback: document.querySelector('[data-act=toggle]').nextElementSibling === fallbackSlot,
        fallbackLast: fallbackSlot.nextElementSibling === null
      },
      gaps: {
        penMarker: markerRect.top - penRect.bottom,
        markerEraser: eraserRect.top - markerRect.bottom,
        eraserUndo: undoRect.top - eraserRect.bottom,
        redoBoard: boardRect.top - redoRect.bottom,
        boardCoordinate: coordinateRect.top - boardRect.bottom
      },
      separators: {
        markerMargin: markerStyle.marginTop,
        markerBorder: markerStyle.borderTopWidth,
        boardMargin: boardStyle.marginTop,
        boardContent: boardDivider.content,
        boardHeight: boardDivider.height,
        undoContent: getComputedStyle(undo, '::before').content,
        undoHeight: getComputedStyle(undo, '::before').height
      },
      fallbackDisplay: getComputedStyle(fallbackSlot).display
    };
  });

  assert.deepEqual(initial.registered, [true, true]);
  assert.deepEqual(initial.domOrder, [
    'cursor', 'pen', 'lia-marker', 'eraser', 'undo', 'redo',
    'lia-board-mode', 'dgs-place', 'ocr-transfer', 'toggle'
  ]);
  assert.deepEqual(initial.visibleOrder, [
    'cursor', 'pen', 'lia-marker', 'eraser', 'undo', 'redo',
    'lia-board-mode', 'dgs-place', 'toggle'
  ]);
  assert.equal(initial.markerSlot, 'marker');
  assert.equal(initial.boardSlot, 'board');
  assert.deepEqual(initial.neighbors, {
    penMarker: true,
    markerEraser: true,
    redoBoard: true,
    boardCoordinate: true,
    eyeFallback: true,
    fallbackLast: true
  });
  assert.deepEqual(initial.gaps, {
    penMarker: 2,
    markerEraser: 2,
    eraserUndo: 8,
    redoBoard: 8,
    boardCoordinate: 2
  });
  assert.equal(initial.separators.markerMargin, '0px');
  assert.equal(initial.separators.markerBorder, '0px');
  assert.equal(initial.separators.boardMargin, '6px');
  assert.notEqual(initial.separators.boardContent, 'none');
  assert.equal(initial.separators.boardHeight, '1px');
  assert.notEqual(initial.separators.undoContent, 'none');
  assert.equal(initial.separators.undoHeight, '1px');
  assert.equal(initial.fallbackDisplay, 'none');

  assert.deepEqual(await page.evaluate(() => {
    const marker = document.querySelector('#reserved-marker');
    const board = document.querySelector('#reserved-board');
    const oldToolbar = document.querySelector('.lia-annot-toolbar');
    oldToolbar.remove();
    const newToolbar = window.__annotationTest.ui.ensureToolbar();
    return {
      replaced: oldToolbar !== newToolbar,
      sameMarker: marker === document.querySelector('#reserved-marker'),
      sameBoard: board === document.querySelector('#reserved-board'),
      markerSlot: marker.parentElement?.getAttribute('data-lia-annotation-slot'),
      boardSlot: board.parentElement?.getAttribute('data-lia-annotation-slot')
    };
  }), {
    replaced: true,
    sameMarker: true,
    sameBoard: true,
    markerSlot: 'marker',
    boardSlot: 'board'
  });

  assert.deepEqual(await page.evaluate(() => {
    const api = window.__LIA_ANNOTATION__;
    const results = [
      api.unregisterToolbarControl('lia-marker'),
      api.unregisterToolbarControl('lia-board-mode')
    ];
    const origin = document.querySelector('#reserved-control-origin');
    return {
      results,
      restored: Array.from(origin.children, element => element.id),
      markerDisplay: getComputedStyle(
        document.querySelector('[data-lia-annotation-slot=marker]')
      ).display,
      boardDisplay: getComputedStyle(
        document.querySelector('[data-lia-annotation-slot=board]')
      ).display
    };
  }), {
    results: [true, true],
    restored: ['reserved-marker', 'reserved-board', 'reserved-anchor'],
    markerDisplay: 'none',
    boardDisplay: 'none'
  });
});

test('unchanged theme and toolbar calls preserve all nodes and emit no mutations', async t => {
  const page = await usingPage(t);
  await page.evaluate(() => {
    const bar = window.__annotationTest.store.STATE.toolbar;
    window.__oldNodes = [...bar.querySelectorAll('*')].flatMap(node => [node, ...node.childNodes]);
    for (let i = 0; i < 12; i++) {
      window.__annotationTest.ui.applyThemeVars();
      window.__annotationTest.ui.updateToolbar();
      window.__annotationTest.ui.syncToolbarPosition();
    }
  });
  await settle(page);
  assert.equal((await metrics(page)).mutations, 0);
  assert.equal(await page.evaluate(() => window.__oldNodes.every(node => node.isConnected)), true);
  await page.evaluate(() => {
    document.querySelector('.lia-btn').remove();
    window.__annotationTest.ui.applyThemeVars();
  });
  await settle(page);
  await reset(page);
  await page.evaluate(() => {
    for (let i = 0; i < 8; i++) window.__annotationTest.ui.applyThemeVars();
  });
  await settle(page);
  assert.equal((await metrics(page)).mutations, 0, 'fallback theme probe is reused');
});

test('LiaScript modals and Classroom stay above the annotation toolbar', async t => {
  const page = await usingPage(t);
  const result = await page.evaluate(() => {
    const toolbar = document.querySelector('.lia-annot-toolbar');
    const panel = toolbar.querySelector('.lia-annot-panel');
    const box = toolbar.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const toolbarAtPoint = () => document.elementFromPoint(x, y)?.closest('.lia-annot-toolbar') === toolbar;
    const before = toolbarAtPoint();

    const modal = document.createElement('lia-modal');
    modal.className = 'lia-modal';
    modal.style.cssText = 'display:block;position:fixed;inset:0;z-index:9000;pointer-events:auto';
    modal.innerHTML = `
      <div class='lia-modal__outer' style='position:absolute;inset:0;background:rgba(0,0,0,.9)'></div>
      <div class='lia-modal__inner'><div class='lia-classroom'>Classroom</div></div>
    `;
    document.body.append(modal);
    const top = document.elementFromPoint(x, y);
    const classroomAbove = top?.closest('.lia-modal') === modal;
    const values = {
      before,
      classroomAbove,
      toolbarZ: getComputedStyle(toolbar).zIndex,
      panelZ: getComputedStyle(panel).zIndex,
      modalZ: getComputedStyle(modal).zIndex
    };
    modal.remove();
    values.after = toolbarAtPoint();
    return values;
  });

  assert.deepEqual(result, {
    before: true,
    classroomAbove: true,
    toolbarZ: '8990',
    panelZ: '1',
    modalZ: '9000',
    after: true
  });
});

test('idle, inactive scrolling and redundant sync/redraw do not rebuild or repaint', async t => {
  const page = await usingPage(t);
  await assertQuiet(page, 1400); // Includes the OCR availability polling interval.
  await page.evaluate(() => {
    window.__eye = document.querySelector('[data-act="toggle"] svg');
    window.__widthText = document.querySelector('[data-k="width"]').firstChild;
    for (let i = 0; i < 30; i++) {
      window.dispatchEvent(new Event('scroll'));
      window.__annotationTest.overlay.requestSync();
      window.__annotationTest.overlay.requestRedraw();
    }
  });
  await settle(page);
  const result = await metrics(page);
  assert.equal(result.toolbarMutations, 0);
  assert.equal(result.paints, 0);
  assert.ok(result.frames <= 1, `one frame should batch the requests, got ${result.frames}`);
  assert.equal(await page.evaluate(() =>
    window.__eye === document.querySelector('[data-act="toggle"] svg') &&
    window.__widthText === document.querySelector('[data-k="width"]').firstChild), true);
  await reset(page);
  await page.evaluate(() => window.scrollTo(0, 120));
  await settle(page);
  assert.equal((await metrics(page)).toolbarMutations, 0);
  assert.equal((await metrics(page)).paints, 0);
  await assertQuiet(page);
});

test('real geometry changes repaint once and preserve existing strokes', async t => {
  const page = await usingPage(t);
  await clickTool(page, 'pen');
  await stroke(page, [200, 220], [400, 220]);
  assert.ok(await alphaAt(page, 300, 220) > 0);
  await reset(page);
  await page.setViewportSize({ width: 1210, height: 800 });
  await settle(page, 180);
  const result = await metrics(page);
  assert.equal(result.paints, 1, 'resize invalidates the canvas once');
  assert.equal(await page.evaluate(() => window.__annotationTest.store.STATE.canvas.width), 1210);
  assert.ok(await alphaAt(page, 330, 220) > 0, 'relative stroke coordinates survive resize');
  await reset(page);
  await page.evaluate(() => {
    document.querySelector('main').style.marginLeft = '110px';
    window.__annotationTest.overlay.requestSync();
  });
  await settle(page);
  assert.equal((await metrics(page)).paints, 0, 'position-only changes preserve canvas pixels');
  assert.ok(await alphaAt(page, 330, 220) > 0);
});

test('drawing and erasing work in a slide area revealed by scrolling', async t => {
  const page = await usingPage(t, {
    afterContent: page => page.evaluate(() => {
      document.querySelector('.lia-slide').style.height = '1800px';
    })
  });
  const canvas = page.locator('.lia-annot-canvas');
  assert.equal(await canvas.evaluate(el => el.getBoundingClientRect().height), 1800);

  await clickTool(page, 'pen');
  await page.evaluate(() => window.scrollTo(0, 1000));
  await settle(page);
  await stroke(page, [200, 1200], [400, 1200]);
  assert.ok(await alphaAt(page, 300, 1200) > 0, 'the scrolled area accepts pen strokes');

  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page);
  await page.evaluate(() => window.scrollTo(0, 1000));
  await settle(page);
  assert.ok(await alphaAt(page, 300, 1200) > 0, 'the stroke stays in place after scrolling');

  await clickTool(page, 'eraser');
  await stroke(page, [300, 1170], [300, 1230]);
  assert.equal(await alphaAt(page, 300, 1200), 0, 'the scrolled area accepts erasing');
});

test('board mode height extension remains drawable', async t => {
  const page = await usingPage(t, {
    afterContent: page => page.evaluate(() => {
      const main = document.querySelector('main');
      main.classList.add('lia-slide__content');
      const container = document.createElement('div');
      container.className = 'lia-slide__container';
      main.before(container);
      container.append(main);
      const style = document.createElement('style');
      style.textContent = '.lia-slide__container > main.lia-slide__content::after {' +
        'content: ""; display: block; height: var(--lia-tff-slide-exit-space); pointer-events: none;}';
      document.head.append(style);
      document.documentElement.style.setProperty('--lia-tff-slide-exit-space', '0px');
    })
  });
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--lia-tff-slide-exit-space', '1000px');
  });
  await settle(page, 200);
  const dimensions = await page.evaluate(() => ({
    host: document.querySelector('main').getBoundingClientRect().height,
    slide: document.querySelector('.lia-slide').getBoundingClientRect().height,
    canvas: document.querySelector('.lia-annot-canvas').getBoundingClientRect().height
  }));
  assert.ok(dimensions.host > dimensions.slide + 500, 'board mode adds height after the slide');
  assert.ok(dimensions.canvas >= dimensions.host, 'the canvas covers the expanded host');

  await clickTool(page, 'pen');
  await page.evaluate(() => window.scrollTo(0, 1100));
  await settle(page);
  await stroke(page, [200, 1200], [400, 1200]);
  assert.ok(await alphaAt(page, 300, 1200) > 0, 'the added area accepts pen strokes');
});

test('fixed-height LiaScript scroller keeps overflowed board space drawable', async t => {
  const page = await usingPage(t, {
    afterContent: page => page.evaluate(() => {
      const main = document.querySelector('main');
      main.classList.add('lia-slide__content');
      main.style.margin = '0';
      main.style.height = '620px';

      const container = document.createElement('div');
      container.className = 'lia-slide__container';
      container.style.cssText = 'position:relative;height:640px;overflow-y:auto;margin:40px 80px;width:800px';
      main.before(container);
      container.append(main);

      main.dataset.testBoardSpacer = '';
      const boardStyle = document.createElement('style');
      boardStyle.dataset.testBoardSpacerStyle = '1';
      boardStyle.textContent = '.lia-slide__container > main.lia-slide__content::after {' +
        'content: attr(data-test-board-spacer); display: block; height: 1200px; pointer-events: none;}';
      document.head.append(boardStyle);

      window.__naturalBoardScrollHeight = container.scrollHeight;
    })
  });

  const dimensions = await page.evaluate(() => {
    const main = document.querySelector('main');
    const container = document.querySelector('.lia-slide__container');
    const canvas = document.querySelector('.lia-annot-canvas');
    return {
      mainRect: main.getBoundingClientRect().height,
      mainScroll: main.scrollHeight,
      containerScroll: container.scrollHeight,
      naturalContainerScroll: window.__naturalBoardScrollHeight,
      canvas: canvas.getBoundingClientRect().height
    };
  });
  assert.ok(
    dimensions.mainScroll > dimensions.mainRect + 500,
    'board spacer overflows the fixed-height main: ' + JSON.stringify(dimensions)
  );
  assert.ok(dimensions.canvas >= dimensions.mainScroll, 'the canvas covers main scrollHeight, not only its border box');
  assert.ok(dimensions.containerScroll <= dimensions.naturalContainerScroll + 1, 'the overlay does not grow the scroller');

  await clickTool(page, 'pen');
  await page.locator('.lia-slide__container').evaluate(el => { el.scrollTop = 1000; });
  await settle(page);
  await stroke(page, [200, 1200], [400, 1200]);
  assert.ok(await alphaAt(page, 300, 1200) > 0, 'overflowed board space accepts pen strokes');

  await page.evaluate(() => {
    document.querySelector('[data-test-board-spacer-style]').remove();
    window.__annotationTest.overlay.requestSync(true);
  });
  await settle(page);
  assert.ok(
    await page.locator('.lia-annot-canvas').evaluate(el => el.getBoundingClientRect().height) <= 640,
    'the canvas shrinks again after the overflowed board space is removed'
  );
});

test('annotation pen and quiz selection delegate to a live canvas while coordinate boards stay annotatable', async t => {
  const page = await usingPage(t, {
    beforeBoot: () => {
      window.__LIA_TEX_OCR__ = { recognize: async () => 'unused' };
    }
  });

  await page.evaluate(() => {
    const slide = document.querySelector('.lia-slide');
    slide.style.position = 'relative';
    slide.insertAdjacentHTML('beforeend', `
      <span class='lia-draw-block'
        style='position:absolute;left:30px;top:60px;width:320px;height:220px'>
        <span class='lia-draw-wrap' style='position:relative;display:block;width:320px;height:180px'>
          <button class='lia-color-btn' type='button' data-active='0' hidden></button>
          <button class='lia-rect-btn' type='button' data-active='0' hidden></button>
          <span class='lia-tool-menu' data-open='0' hidden>
            <button type='button' data-act='close'>Close</button>
          </span>
          <canvas class='lia-draw' data-ready='1' width='320' height='180'
            style='display:block;width:320px;height:180px;touch-action:none'></canvas>
        </span>
        <button class='native-submit' type='button' hidden
          style='position:absolute;left:120px;top:188px;z-index:2'>Submit</button>
      </span>
      <div class='test-coordinate-board'
        style='position:absolute;left:390px;top:60px;width:320px;height:180px;background:#eef'></div>
    `);

    const block = slide.querySelector('.lia-draw-block');
    const wrap = block.querySelector('.lia-draw-wrap');
    const canvas = wrap.querySelector('.lia-draw');
    const pen = wrap.querySelector('.lia-color-btn');
    const rect = wrap.querySelector('.lia-rect-btn');
    const menu = wrap.querySelector('.lia-tool-menu');
    const submit = block.querySelector('.native-submit');
    const native = window.__nativeCanvas = {
      tool: 'eraser',
      downs: 0,
      moves: 0,
      ups: 0,
      selections: 0,
      penActivations: 0,
      rectActivations: 0
    };

    const selectTool = next => {
      native.tool = next;
      pen.dataset.active = next === 'pen' ? '1' : '0';
      rect.dataset.active = next === 'rect' ? '1' : '0';
    };
    pen.addEventListener('click', () => {
      native.penActivations++;
      selectTool('pen');
      menu.dataset.open = '1';
    });
    rect.addEventListener('click', () => {
      native.rectActivations++;
      selectTool('rect');
      menu.dataset.open = '1';
    });
    menu.querySelector('[data-act=close]').addEventListener('click', () => {
      menu.dataset.open = '0';
    });
    canvas.addEventListener('pointerdown', event => {
      native.downs++;
      native.downTool = native.tool;
      try { canvas.setPointerCapture(event.pointerId); } catch (_) { }
    });
    canvas.addEventListener('pointermove', event => {
      if (event.buttons) native.moves++;
    });
    canvas.addEventListener('pointerup', event => {
      native.ups++;
      if (native.tool === 'rect') {
        native.selections++;
        submit.hidden = false;
      }
      try { canvas.releasePointerCapture(event.pointerId); } catch (_) { }
    });
    submit.addEventListener('click', () => {
      const quiz = document.querySelector('#quiz');
      quiz.value = 'canvas solution';
      quiz.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const coordinate = slide.querySelector('.test-coordinate-board');
    window.__coordinateDowns = 0;
    coordinate.addEventListener('pointerdown', () => { window.__coordinateDowns++; });
    window.__annotationTest.overlay.requestSync(true);
  });
  await settle(page, 180);

  await clickTool(page, 'pen');
  const nativeBox = await page.locator('.lia-draw').boundingBox();
  await page.mouse.move(nativeBox.x + 30, nativeBox.y + 40);
  await page.mouse.down();
  await page.mouse.move(nativeBox.x + 180, nativeBox.y + 100, { steps: 8 });
  await page.mouse.up();
  await settle(page);

  assert.deepEqual(await page.evaluate(() => ({
    tool: window.__nativeCanvas.downTool,
    downs: window.__nativeCanvas.downs,
    moves: window.__nativeCanvas.moves > 0,
    ups: window.__nativeCanvas.ups,
    penActivations: window.__nativeCanvas.penActivations,
    menuOpen: document.querySelector('.lia-tool-menu').dataset.open,
    annotationItems: window.__LIA_ANNOTATION__.getStore().slides['#1'].items.length
  })), {
    tool: 'pen',
    downs: 1,
    moves: true,
    ups: 1,
    penActivations: 1,
    menuOpen: '0',
    annotationItems: 0
  });

  await clickTool(page, 'ocr-transfer');
  await page.mouse.move(nativeBox.x + 50, nativeBox.y + 35);
  await page.mouse.down();
  await page.mouse.move(nativeBox.x + 230, nativeBox.y + 135, { steps: 6 });
  await page.mouse.up();
  await settle(page);
  assert.deepEqual(await page.evaluate(() => ({
    tool: window.__nativeCanvas.downTool,
    selections: window.__nativeCanvas.selections,
    rectActivations: window.__nativeCanvas.rectActivations,
    menuOpen: document.querySelector('.lia-tool-menu').dataset.open,
    annotationRect: window.__annotationTest.overlay.getMarkedRect()
  })), {
    tool: 'rect',
    selections: 1,
    rectActivations: 1,
    menuOpen: '0',
    annotationRect: null
  });
  await page.locator('.native-submit').click();
  assert.equal(await page.locator('#quiz').inputValue(), 'canvas solution');

  await clickTool(page, 'pen');
  const coordinateBox = await page.locator('.test-coordinate-board').boundingBox();
  await page.mouse.move(coordinateBox.x + 30, coordinateBox.y + 40);
  await page.mouse.down();
  await page.mouse.move(coordinateBox.x + 220, coordinateBox.y + 120, { steps: 8 });
  await page.mouse.up();
  await settle(page);

  assert.deepEqual(await page.evaluate(() => ({
    coordinateDowns: window.__coordinateDowns,
    annotationItems: window.__LIA_ANNOTATION__.getStore().slides['#1'].items.length,
    annotationPoints: window.__LIA_ANNOTATION__.getStore().slides['#1'].items[0]?.points.length || 0
  })), {
    coordinateDowns: 0,
    annotationItems: 1,
    annotationPoints: 9
  });
});

test('pen button mirrors the selected color across updates, themes and rebuilds', async t => {
  const page = await usingPage(t);
  const dot = page.locator('[data-act="pen"] .lia-annot-pen-color');

  assert.equal(await dot.count(), 1);
  assert.equal(await dot.getAttribute('aria-hidden'), 'true');
  assert.deepEqual(await dot.evaluate(element => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      background: style.backgroundColor,
      width: rect.width,
      height: rect.height,
      radius: style.borderRadius,
      shadow: style.boxShadow
    };
  }), {
    background: 'rgb(255, 0, 0)',
    width: 8,
    height: 8,
    radius: '999px',
    shadow: 'none'
  });

  await clickTool(page, 'pen');
  await page.locator('.lia-annot-color-item[data-color="#0055ff"]').click();
  assert.equal(await page.evaluate(() => window.__LIA_ANNOTATION__.getStore().ui.color), '#0055ff');
  assert.equal(
    await dot.evaluate(element => getComputedStyle(element).backgroundColor),
    'rgb(0, 85, 255)'
  );

  await page.evaluate(() => {
    window.__penColorDot = document.querySelector('.lia-annot-pen-color');
    document.documentElement.classList.add('dark');
  });
  await settle(page);
  assert.equal(await page.evaluate(() =>
    window.__penColorDot === document.querySelector('.lia-annot-pen-color')), true);
  assert.equal(
    await dot.evaluate(element => getComputedStyle(element).backgroundColor),
    'rgb(0, 85, 255)'
  );

  await reset(page);
  await page.evaluate(() => {
    for (let i = 0; i < 10; i++) window.__annotationTest.ui.updateToolbar();
  });
  await settle(page);
  assert.equal((await metrics(page)).toolbarMutations, 0);

  await page.evaluate(() => {
    document.querySelector('.lia-annot-toolbar').remove();
    window.__LIA_ANNOTATION__.refresh();
  });
  assert.equal(await dot.count(), 1);
  assert.equal(
    await dot.evaluate(element => getComputedStyle(element).backgroundColor),
    'rgb(0, 85, 255)'
  );
});

test('drawing, erasing, sliders and undo/redo keep pixels and button state in sync', async t => {
  const page = await usingPage(t);
  await clickTool(page, 'pen');
  const width = page.locator('input[data-act="width"]');
  await width.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await width.inputValue(), '4');
  assert.equal(await page.locator('[data-k="width"]').textContent(), '4');
  await page.evaluate(() => {
    const alpha = document.querySelector('input[data-act="alpha"]');
    alpha.value = '0.5';
    alpha.dispatchEvent(new Event('input', { bubbles: true }));
    window.__eye = document.querySelector('[data-act="toggle"] svg');
  });
  assert.equal(await page.locator('[data-k="alpha"]').textContent(), '50%');
  await stroke(page, [200, 240], [400, 240]);
  const inkAlpha = await alphaAt(page, 300, 240);
  assert.ok(inkAlpha > 100 && inkAlpha < 160, `opacity applied to stroke: ${inkAlpha}`);
  assert.equal(await page.locator('[data-act="undo"]').isDisabled(), false);
  assert.equal(await page.locator('[data-act="redo"]').isDisabled(), true);
  assert.equal(await page.evaluate(() => window.__eye === document.querySelector('[data-act="toggle"] svg')), true);
  await clickTool(page, 'eraser');
  await page.evaluate(() => {
    const input = document.querySelector('input[data-act="eraserWidth"]');
    input.value = '30'; input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  assert.equal(await page.locator('[data-k="eraserWidth"]').textContent(), '30');
  await stroke(page, [300, 205], [300, 275]);
  assert.equal(await alphaAt(page, 300, 240), 0);
  assert.ok(await alphaAt(page, 230, 240) > 0);
  await clickTool(page, 'undo');
  await settle(page);
  assert.equal(await alphaAt(page, 300, 240), inkAlpha);
  assert.equal(await page.locator('[data-act="redo"]').isDisabled(), false);
  await clickTool(page, 'redo');
  await settle(page);
  assert.equal(await alphaAt(page, 300, 240), 0);
  await clickTool(page, 'undo');
  await clickTool(page, 'undo');
  await settle(page);
  assert.equal(await alphaAt(page, 230, 240), 0);
  assert.equal(await page.locator('[data-act="undo"]').isDisabled(), true);
});

test('keyboard visibility, read-only transitions and slide binding remain correct', async t => {
  const page = await usingPage(t);
  await page.locator('[data-act="pen"]').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('[data-act="pen"]').getAttribute('aria-pressed'), 'true');
  await stroke(page, [200, 220], [400, 220]);
  await page.evaluate(() => { window.__eye = document.querySelector('[data-act="toggle"] svg'); });
  await page.locator('[data-act="toggle"]').focus();
  await page.keyboard.press('Space');
  await settle(page);
  assert.equal(await page.locator('[data-act="toggle"]').getAttribute('aria-pressed'), 'false');
  assert.equal(await alphaAt(page, 300, 220), 0);
  assert.equal(await page.evaluate(() => window.__eye.isConnected), false);
  await page.keyboard.press('Space');
  await settle(page);
  assert.ok(await alphaAt(page, 300, 220) > 0);
  await page.evaluate(() => {
    window.__slider = document.querySelector('[data-act="width"]');
    window.__annotationTest.api.setReadOnly(true);
  });
  assert.equal(await page.locator('[data-act="pen"]').isDisabled(), true);
  assert.equal(await page.evaluate(() => window.__slider === document.querySelector('[data-act="width"]')), true);
  await page.evaluate(() => window.__annotationTest.api.setReadOnly(false));
  assert.equal(await page.locator('[data-act="pen"]').isDisabled(), false);
  await page.evaluate(() => { location.hash = '#2'; });
  await settle(page, 650);
  assert.equal(await alphaAt(page, 300, 220), 0);
  assert.equal(await page.locator('[data-act="undo"]').isDisabled(), true);
  await page.evaluate(() => { location.hash = '#1'; });
  await settle(page, 650);
  assert.ok(await alphaAt(page, 300, 220) > 0);
  assert.equal(await page.locator('[data-act="undo"]').isDisabled(), false);
});

test('OCR availability, pending recognition, quiz submission and preview stay reliable', async t => {
  const page = await usingPage(t, { beforeBoot: () => {
    window.__ocrPending = [];
    window.__LIA_TEX_OCR__ = { recognize: () => new Promise(resolve => window.__ocrPending.push(resolve)) };
    window.__katexRenders = 0;
    window.katex = { render(text, node) { window.__katexRenders++; node.textContent = text; } };
  } });
  assert.equal(await page.locator('[data-act="ocr-transfer"]').isVisible(), true);
  await clickTool(page, 'pen');
  await stroke(page, [200, 220], [400, 220]);
  await clickTool(page, 'ocr-transfer');
  await stroke(page, [180, 190], [420, 250]);
  await page.evaluate(() => {
    window.__ocrResult = window.__annotationTest.api.transferToNearestQuiz();
  });
  await page.waitForFunction(() => window.__ocrPending.length === 3);
  assert.equal(await page.locator('[data-act="ocr-transfer"]').isDisabled(), true);
  assert.equal(await page.locator('[data-act="ocr-transfer"]').getAttribute('data-busy'), '1');
  await page.evaluate(() => window.__ocrPending.splice(0).forEach(resolve => resolve('x=2')));
  assert.equal(await page.evaluate(() => window.__ocrResult), true);
  assert.equal(await page.locator('#quiz').inputValue(), 'x=2');
  assert.equal(await page.locator('[data-act="ocr-transfer"]').getAttribute('data-busy'), '0');
  await page.evaluate(() => {
    const { STORE } = window.__annotationTest.store;
    STORE.ui.panelMode = 'ocr'; STORE.ui.panelOpen = true; STORE.ui.ocrDraft = 'x=2';
    window.__annotationTest.ui.updateToolbar();
  });
  await settle(page);
  await reset(page);
  const renders = await page.evaluate(() => window.__katexRenders);
  await page.evaluate(() => {
    for (let i = 0; i < 10; i++) window.__annotationTest.ui.updateToolbar();
  });
  await settle(page);
  assert.equal((await metrics(page)).toolbarMutations, 0);
  assert.equal(await page.evaluate(() => window.__katexRenders), renders, 'same preview does not rerender');
  await page.locator('[data-act="ocr-input"]').fill('');
  assert.equal(await page.locator('[data-act="ocr-submit"]').isDisabled(), true);
  await page.locator('[data-act="ocr-input"]').fill('x=3');
  assert.equal(await page.locator('[data-act="ocr-submit"]').isDisabled(), false);
  await page.evaluate(() => {
    window.__annotationTest.store.STORE.ui.ocrFailed = true;
    window.__annotationTest.ui.updateToolbar();
  });
  assert.match(await page.locator('[data-k="ocrHint"]').textContent(), /fail|recogn/i);
  await page.evaluate(() => { delete window.__LIA_TEX_OCR__; });
  await settle(page, 1250);
  assert.equal(await page.locator('[data-act="ocr-transfer"]').isVisible(), false);
  assert.equal(await page.locator('.lia-annot-canvas').evaluate(canvas => canvas.style.pointerEvents), 'none');
});

test('OCR drafts containing closing textarea markup remain literal and stable', async t => {
  const page = await usingPage(t, { beforeBoot: () => {
    window.katex = { render(text, node) { node.textContent = text; } };
  } });
  const draft = '</textarea><span id="ocr-injected">unexpected</span> & < >';
  await page.evaluate(value => {
    const { STORE } = window.__annotationTest.store;
    STORE.ui.panelMode = 'ocr'; STORE.ui.panelOpen = true; STORE.ui.ocrDraft = value;
    window.__annotationTest.ui.updateToolbar();
  }, draft);
  await settle(page);
  assert.equal(await page.locator('[data-act="ocr-input"]').inputValue(), draft);
  assert.equal(await page.locator('#ocr-injected').count(), 0);
  await reset(page);
  await page.evaluate(() => { for (let i = 0; i < 10; i++) window.__annotationTest.ui.updateToolbar(); });
  await settle(page);
  assert.equal((await metrics(page)).toolbarMutations, 0);
  assert.equal(await page.locator('[data-act="ocr-input"]').inputValue(), draft);
});

test('external class/style themes are applied and updates settle after own CSS writes', async t => {
  const page = await usingPage(t);
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await settle(page);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--lia-annot-fg').trim()), '#fff');
  await assertQuiet(page);
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--test-accent', 'rgb(210, 40, 70)');
  });
  await settle(page);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--lia-annot-accent').trim()), 'rgb(210, 40, 70)');
  await page.evaluate(() => { document.body.style.backgroundColor = 'rgb(255, 255, 255)'; });
  await settle(page);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--lia-annot-fg').trim()), '#000');
  await assertQuiet(page);
});

test('an external theme mutation triggered during annotation CSS writes is retained', async t => {
  const page = await usingPage(t);
  await page.evaluate(() => {
    const original = CSSStyleDeclaration.prototype.setProperty;
    let changed = false;
    CSSStyleDeclaration.prototype.setProperty = function (name, value, priority) {
      const result = original.call(this, name, value, priority);
      if (!changed && this === document.documentElement.style && name.startsWith('--lia-annot-') && document.documentElement.classList.contains('dark')) {
        changed = true;
        // A synchronous cooperating theme adapter changes an external input while
        // annotation itself is writing its output variables.
        document.documentElement.className = 'alternate';
        original.call(this, '--test-accent', 'rgb(13, 80, 120)');
      }
      return result;
    };
    document.documentElement.classList.add('dark');
  });
  await settle(page, 250);
  assert.deepEqual(await page.evaluate(() => ({
    theme: document.documentElement.className,
    fg: getComputedStyle(document.documentElement).getPropertyValue('--lia-annot-fg').trim(),
    accent: getComputedStyle(document.documentElement).getPropertyValue('--lia-annot-accent').trim()
  })), { theme: 'alternate', fg: '#000', accent: 'rgb(13, 80, 120)' });
  await assertQuiet(page);
});

test('CSS serialization is idempotent and restores values after external changes', async t => {
  const page = await usingPage(t);
  await page.evaluate(() => {
    const { setStyle } = window.__annotationTest.dom;
    const node = document.createElement('span');
    node.id = 'style-normalization'; document.body.appendChild(node);
    setStyle(node, 'margin', '18px 0');
    setStyle(node, 'left', '1.23456789px');
  });
  await settle(page);
  await reset(page);
  await page.evaluate(() => {
    const { setStyle } = window.__annotationTest.dom;
    const node = document.getElementById('style-normalization');
    for (let i = 0; i < 10; i++) {
      setStyle(node, 'margin', '18px 0');
      setStyle(node, 'left', '1.23456789px');
    }
  });
  await settle(page);
  assert.equal((await metrics(page)).mutations, 0);
  await page.evaluate(() => {
    const { setStyle } = window.__annotationTest.dom;
    const node = document.getElementById('style-normalization');
    node.style.margin = '0px';
    node.style.setProperty('left', '5px', 'important');
    setStyle(node, 'margin', '18px 0');
    setStyle(node, 'left', '1.23456789px');
  });
  assert.deepEqual(await page.evaluate(() => {
    const node = document.getElementById('style-normalization');
    return { margin: node.style.margin, left: Number.parseFloat(node.style.left), priority: node.style.getPropertyPriority('left') };
  }), { margin: '18px 0px', left: 1.23457, priority: '' });
});

test('pointer bursts share one frame, duplicate points skip paints, and DPR invalidates pixels', async t => {
  const page = await usingPage(t);
  await clickTool(page, 'pen');
  await clickTool(page, 'pen');
  await page.evaluate(() => {
    const { STATE } = window.__annotationTest.store;
    const rect = STATE.canvas.getBoundingClientRect();
    window.__pointer = (type, x) => STATE.canvas.dispatchEvent(new PointerEvent(type, {
      bubbles: true, pointerId: 7, pointerType: 'pen', button: 0, buttons: type === 'pointerup' ? 0 : 1,
      clientX: rect.left + x, clientY: rect.top + 180
    }));
    window.__pointer('pointerdown', 400);
  });
  await settle(page);
  await reset(page);
  await page.evaluate(() => { for (let x = 401; x <= 450; x++) window.__pointer('pointermove', x); });
  await settle(page);
  let result = await metrics(page);
  assert.equal(result.frames, 1);
  assert.equal(result.paints, 1);
  assert.equal(result.toolbarMutations, 0);
  assert.ok(await alphaAt(page, 430, 180) > 0);
  await reset(page);
  await page.evaluate(() => { for (let i = 0; i < 20; i++) window.__pointer('pointermove', 450); });
  await settle(page);
  result = await metrics(page);
  assert.equal(result.paints, 0);
  assert.equal(result.toolbarMutations, 0);
  await page.evaluate(() => window.__pointer('pointerup', 450));
  await settle(page);
  await reset(page);
  await page.evaluate(() => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
    window.dispatchEvent(new Event('resize'));
  });
  await settle(page);
  assert.equal((await metrics(page)).paints, 1);
  assert.equal(await page.evaluate(() => window.__annotationTest.store.STATE.canvas.width), 2200);
  assert.ok(await alphaAt(page, 430, 180) > 0);
});

test('transparent body inherits the root theme background', async t => {
  const page = await usingPage(t);
  await page.evaluate(() => {
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'rgb(20, 20, 20)';
  });
  await settle(page);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--lia-annot-fg').trim()), '#fff');
  await page.evaluate(() => { document.documentElement.style.backgroundColor = 'rgb(250, 250, 250)'; });
  await settle(page);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--lia-annot-fg').trim()), '#000');
  await assertQuiet(page);
});


test('DGS placement, repeated refresh, same-ID reposition and clear preserve widget lifecycle', async t => {
  const page = await usingPage(t);
  await clickTool(page, 'dgs-place');
  assert.equal(await page.locator('.lia-annot-shell').getAttribute('data-mode'), 'place');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.lia-annot-shell').getAttribute('data-mode'), 'cursor');
  await clickTool(page, 'dgs-place');
  const box = await page.locator('.lia-annot-canvas').boundingBox();
  await page.mouse.click(box.x + 700, box.y + 300);
  await settle(page, 200);
  assert.equal(await page.locator('.lia-annot-dgs-widget').count(), 1);
  assert.equal(await page.locator('.lia-annot-shell').getAttribute('data-mode'), 'cursor');
  await page.evaluate(() => {
    const payload = window.__LIA_ANNOTATION__.getStore();
    const first = payload.slides['#1'].widgets[0];
    first.y = 1000;
    payload.slides['#1'].widgets.push({ ...first, id: first.id + '-second', y: 1100 });
    window.__LIA_ANNOTATION__.importState(payload);
    window.__dgsWidget = document.querySelector('.lia-annot-dgs-widget');
    window.__dgsContents = window.__dgsWidget.firstChild;
  });
  await settle(page);
  assert.equal(await page.locator('.lia-annot-dgs-widget').count(), 2);
  await reset(page);
  await page.evaluate(() => {
    for (let i = 0; i < 8; i++) {
      window.__LIA_ANNOTATION__.refresh();
      window.dispatchEvent(new Event('scroll'));
    }
  });
  await settle(page);
  assert.equal((await metrics(page)).mutations, 0);
  assert.equal(await page.evaluate(() => window.__dgsContents === window.__dgsWidget.firstChild), true);
  await page.evaluate(() => {
    const payload = window.__LIA_ANNOTATION__.getStore();
    payload.slides['#1'].widgets[0].y = 1000;
    window.__LIA_ANNOTATION__.importState(payload);
  });
  await settle(page);
  assert.equal(await page.evaluate(() => window.__dgsWidget.previousElementSibling.matches('section')), true);
  await page.evaluate(() => {
    const payload = window.__LIA_ANNOTATION__.getStore();
    payload.slides['#1'].widgets[0].y = 0;
    window.__LIA_ANNOTATION__.importState(payload);
  });
  await settle(page);
  assert.equal(await page.evaluate(() => window.__dgsWidget.nextElementSibling.matches('section')), true);
  assert.equal(await page.evaluate(() => window.__dgsContents === window.__dgsWidget.firstChild), true);
  await page.evaluate(() => window.__LIA_ANNOTATION__.clearSlide());
  await settle(page);
  assert.equal(await page.locator('.lia-annot-dgs-widget').count(), 0);
  await assertQuiet(page);
});

test('DGS close button removes state and disposes the live coordinate board', async t => {
  const page = await usingPage(t, {
    beforeBoot: () => {
      window.__dgsCleanup = { coord: [], dgs: [], regression: [], freed: [] };
      window.__disposeDGSForBoard = id => window.__dgsCleanup.dgs.push(id);
      window.__disposeRegressionForBoard = id => window.__dgsCleanup.regression.push(id);
      window.JXG = {
        JSXGraph: {
          initBoard: id => ({
            id,
            __coordCleanup: () => window.__dgsCleanup.coord.push(id)
          }),
          freeBoard: board => window.__dgsCleanup.freed.push(board.id)
        }
      };
      window.__coord = {
        parseCoordSpec: spec => {
          const id = (String(spec).match(/(?:^|;)id=([^;]+)/) || [])[1] || 'test-board';
          return { id, width: 240, xmin: -7, xmax: 7, ymin: -5, ymax: 5, border: false };
        },
        loadStoredBoardState: () => null,
        prepareBoardContainer: () => {},
        createBoardDecorations: () => {},
        wireBoard: (board, cfg) => {
          window.__boards = window.__boards || {};
          window.__boards[cfg.id] = board;
        },
        getNeutralColor: () => '#222',
        getAccentColor: () => '#0aa'
      };
      window.__setupDGS = () => {};
    }
  });

  await clickTool(page, 'dgs-place');
  const canvasBox = await page.locator('.lia-annot-canvas').boundingBox();
  await page.mouse.click(canvasBox.x + 500, canvasBox.y + 300);
  await settle(page, 200);

  const remove = page.locator('.lia-annot-dgs-remove');
  const frame = page.locator('.lia-annot-dgs-frame');
  const board = page.locator('.lia-annot-dgs-board');
  assert.equal(await remove.count(), 1);
  assert.equal(await remove.evaluate(el => el.tagName), 'BUTTON');
  assert.equal(await remove.getAttribute('aria-label'), 'Remove coordinate system');
  const frameBox = await frame.boundingBox();
  const boardBox = await board.boundingBox();
  const removeBox = await remove.boundingBox();
  assert.ok(frameBox.width > boardBox.width + 100, 'the close-button frame leaves room to widen the board');
  assert.ok(removeBox.y < boardBox.y, 'close button sits outside the board at the top');
  assert.ok(removeBox.x + removeBox.width / 2 <= boardBox.x + 2, 'close button sits at the board left edge');
  assert.ok(removeBox.x + removeBox.width < boardBox.x + boardBox.width - 24, 'close button leaves the board resize corner clear');

  await page.evaluate(() => window.__LIA_ANNOTATION__.setReadOnly(true));
  assert.equal(await remove.isVisible(), false, 'close button is hidden in read-only mode');
  await page.evaluate(() => window.__LIA_ANNOTATION__.setReadOnly(false));
  assert.equal(await remove.isVisible(), true);

  const boardId = await board.getAttribute('id');
  assert.equal(await page.evaluate(id => !!window.__boards?.[id], boardId), true);
  await remove.click();
  await settle(page, 200);

  assert.equal(await page.locator('.lia-annot-dgs-widget').count(), 0);
  assert.equal(await page.evaluate(() => window.__LIA_ANNOTATION__.getStore().slides['#1'].widgets.length), 0);
  assert.deepEqual(await page.evaluate(id => ({
    coord: window.__dgsCleanup.coord,
    dgs: window.__dgsCleanup.dgs,
    regression: window.__dgsCleanup.regression,
    freed: window.__dgsCleanup.freed,
    registered: !!window.__boards?.[id]
  }), boardId), {
    coord: [boardId],
    dgs: [boardId],
    regression: [boardId],
    freed: [boardId],
    registered: false
  });
});


test('OCR preview recovers after a failed KaTeX load without rebuilding unchanged output', async t => {
  const page = await usingPage(t);
  const failedLoad = page.waitForEvent('requestfailed', {
    predicate: request => request.url().endsWith('/katex.mjs')
  });
  await page.evaluate(() => {
    const { STORE } = window.__annotationTest.store;
    STORE.ui.panelMode = 'ocr'; STORE.ui.panelOpen = true; STORE.ui.ocrDraft = 'x^2';
    window.__annotationTest.ui.updateToolbar();
  });
  await failedLoad;
  await settle(page);
  assert.equal(await page.locator('[data-k="ocrPreview"]').textContent(), 'x^2');
  await page.evaluate(() => {
    window.__lateRenders = 0;
    window.katex = { render(source, target) {
      window.__lateRenders++;
      const rendered = document.createElement('span');
      rendered.className = 'rendered-late'; rendered.textContent = source;
      target.replaceChildren(rendered);
    } };
    window.__annotationTest.ui.updateToolbar();
  });
  assert.equal(await page.locator('[data-k="ocrPreview"] .rendered-late').textContent(), 'x^2');
  assert.equal(await page.evaluate(() => window.__lateRenders), 1);
  await settle(page);
  await reset(page);
  await page.evaluate(() => { for (let i = 0; i < 10; i++) window.__annotationTest.ui.updateToolbar(); });
  await settle(page);
  assert.equal((await metrics(page)).toolbarMutations, 0);
  assert.equal(await page.evaluate(() => window.__lateRenders), 1);
});
