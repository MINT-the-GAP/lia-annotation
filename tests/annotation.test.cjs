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
  const board = page.locator('.lia-annot-dgs-board');
  assert.equal(await remove.count(), 1);
  assert.equal(await remove.evaluate(el => el.tagName), 'BUTTON');
  assert.equal(await remove.getAttribute('aria-label'), 'Remove coordinate system');
  const boardBox = await board.boundingBox();
  const removeBox = await remove.boundingBox();
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
