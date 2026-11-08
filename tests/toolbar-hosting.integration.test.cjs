'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { launchBrowser } = require('./harness.cjs');
const {
  injectLocalBundle,
  inspectLocalBundles,
  isExplicitLocalIntegration,
  publicBundleManifest,
  readLocalBundles
} = require('./integration/local-toolbar-bundles.cjs');

const fixture = fs.readFileSync(
  path.join(__dirname, 'integration', 'toolbar-hosting.fixture.html'),
  'utf8'
);
const allOrders = [
  ['annotation', 'marker', 'board-mode'],
  ['annotation', 'board-mode', 'marker'],
  ['marker', 'annotation', 'board-mode'],
  ['marker', 'board-mode', 'annotation'],
  ['board-mode', 'annotation', 'marker'],
  ['board-mode', 'marker', 'annotation']
];
const interactionOrders = [
  ['annotation', 'marker', 'board-mode'],
  ['board-mode', 'marker', 'annotation']
];
const standaloneOrders = [
  ['marker', 'board-mode'],
  ['board-mode', 'marker']
];
const explicitIntegration = isExplicitLocalIntegration();
const availability = inspectLocalBundles();
const skipReason = !explicitIntegration && availability.issues.length
  ? 'local real-bundle toolbar integration skipped: ' + availability.issues.join('; ')
  : false;

function closeTo(actual, expected, tolerance = 1) {
  return Math.abs(actual - expected) <= tolerance;
}

async function installProbe(page) {
  await page.evaluate(() => {
    const metrics = {
      rafRequests: 0,
      rafFrames: 0,
      totalMutations: 0,
      toolbarMutations: 0,
      buttonMutations: 0,
      panelStyleMutations: 0,
      hostedAttributeMutations: 0
    };
    const pending = new Set();
    const nativeRAF = window.requestAnimationFrame.bind(window);
    const nativeCancelRAF = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = callback => {
      metrics.rafRequests++;
      let id = 0;
      id = nativeRAF(time => {
        pending.delete(id);
        metrics.rafFrames++;
        callback(time);
      });
      pending.add(id);
      return id;
    };
    window.cancelAnimationFrame = id => {
      pending.delete(id);
      nativeCancelRAF(id);
    };

    const observer = new MutationObserver(records => {
      metrics.totalMutations += records.length;
      for (const record of records) {
        const target = record.target.nodeType === Node.ELEMENT_NODE
          ? record.target
          : record.target.parentElement;
        if (!target) continue;
        const toolbar = document.querySelector('.lia-annot-toolbar');
        if (toolbar && (target === toolbar || toolbar.contains(target))) {
          metrics.toolbarMutations++;
        }
        if (target.matches?.('#lia-hl-btn, #lia-tff-btn-v2') ||
            target.closest?.('#lia-hl-btn, #lia-tff-btn-v2')) {
          metrics.buttonMutations++;
        }
        if (record.type === 'attributes' && record.attributeName === 'style' &&
            target.matches?.('#lia-hl-panel, #lia-tff-panel-v2')) {
          metrics.panelStyleMutations++;
        }
        if (record.type === 'attributes' &&
            record.attributeName === 'data-lia-annotation-hosted') {
          metrics.hostedAttributeMutations++;
        }
      }
    });
    observer.observe(document.documentElement, {
      subtree: true,
      attributes: true,
      childList: true,
      characterData: true
    });

    const unhandled = [];
    window.addEventListener('unhandledrejection', event => {
      const reason = event.reason;
      unhandled.push(String(reason?.stack || reason?.message || reason));
    });

    function resetMetrics() {
      observer.takeRecords();
      for (const key of Object.keys(metrics)) metrics[key] = 0;
    }
    function readMetrics() {
      return { ...metrics, pendingRAF: pending.size };
    }
    window.__toolbarProbe = {
      originals: {},
      unhandled,
      resetMetrics,
      readMetrics
    };
  });
}

async function waitForBundle(page, name) {
  if (name === 'annotation') {
    await page.waitForFunction(() =>
      !!window.__LIA_ANNOTATION__ &&
      !!document.querySelector('.lia-annot-toolbar')
    );
    return;
  }
  if (name === 'marker') {
    await page.waitForFunction(() =>
      !!window.__HLDBG &&
      !!document.getElementById('lia-hl-btn') &&
      !!document.getElementById('lia-hl-panel') &&
      document.querySelectorAll('.hl-swatch').length >= 6
    );
    await page.evaluate(() => {
      window.__toolbarProbe.originals.marker =
        document.getElementById('lia-hl-btn');
    });
    return;
  }
  await page.waitForFunction(() => {
    const button = document.getElementById('lia-tff-btn-v2');
    return !!window.__LIA_TFF_REG_V2__ &&
      !!button &&
      !!document.getElementById('lia-tff-panel-v2') &&
      !!document.getElementById('lia-tff-slider-v2') &&
      getComputedStyle(button).display !== 'none';
  });
  await page.evaluate(() => {
    window.__toolbarProbe.originals.boardMode =
      document.getElementById('lia-tff-btn-v2');
  });
}

async function openScenario(browser, bundles, order) {
  const context = await browser.newContext({
    viewport: { width: 1100, height: 800 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', error => pageErrors.push(error.stack || error.message));
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await page.route('**/*', route => {
    if (route.request().url() === 'http://annotation.test/') {
      return route.fulfill({ contentType: 'text/html', body: fixture });
    }
    return route.abort();
  });
  await page.goto('http://annotation.test/');
  await installProbe(page);

  for (const name of order) {
    await injectLocalBundle(page, bundles, name);
    await waitForBundle(page, name);
  }

  const hasAnnotation = order.includes('annotation');
  if (hasAnnotation) {
    await page.waitForFunction(() => {
      const api = window.__LIA_ANNOTATION__;
      const marker = document.getElementById('lia-hl-btn');
      const board = document.getElementById('lia-tff-btn-v2');
      return !!api &&
        api.hasToolbarControl?.('lia-marker') === true &&
        api.hasToolbarControl?.('lia-board-mode') === true &&
        marker?.parentElement?.classList.contains('lia-annot-external-actions') &&
        board?.parentElement?.classList.contains('lia-annot-external-actions');
    });
  } else {
    await page.waitForFunction(() =>
      !!document.getElementById('lia-hl-btn') &&
      !!document.getElementById('lia-tff-btn-v2')
    );
  }
  await page.waitForTimeout(950);

  return {
    context,
    page,
    pageErrors,
    consoleErrors,
    async close() { await context.close(); }
  };
}

async function assertNoRuntimeErrors(scenario) {
  const unhandled = await scenario.page.evaluate(() =>
    window.__toolbarProbe.unhandled.slice()
  );
  assert.deepEqual(scenario.pageErrors, [], 'page errors');
  assert.deepEqual(scenario.consoleErrors, [], 'console errors');
  assert.deepEqual(unhandled, [], 'unhandled rejections');
}

async function hostedSnapshot(page) {
  return page.evaluate(() => {
    const marker = document.getElementById('lia-hl-btn');
    const board = document.getElementById('lia-tff-btn-v2');
    const markerPanel = document.getElementById('lia-hl-panel');
    const boardPanel = document.getElementById('lia-tff-panel-v2');
    const slider = document.getElementById('lia-tff-slider-v2');
    const host = document.querySelector('.lia-annot-external-actions');
    const eye = document.querySelector('.lia-annot-btn[data-act=toggle]');
    const api = window.__LIA_ANNOTATION__;
    const markerStyle = getComputedStyle(marker);
    const boardStyle = getComputedStyle(board);
    const markerIcon = marker.querySelector('.icon');
    const markerDot = marker.querySelector('.dot');
    const smallGlyph = board.querySelector('.tffA-small');
    const bigGlyph = board.querySelector('.tffA-big');
    const markerIconRect = markerIcon.getBoundingClientRect();
    const markerDotRect = markerDot.getBoundingClientRect();
    const markerDotStyle = getComputedStyle(markerDot);
    const markerRect = marker.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    const smallGlyphRect = smallGlyph.getBoundingClientRect();
    const bigGlyphRect = bigGlyph.getBoundingClientRect();
    const smallGlyphStyle = getComputedStyle(smallGlyph);
    const bigGlyphStyle = getComputedStyle(bigGlyph);
    marker.focus();
    const markerFocused = document.activeElement === marker;
    board.focus();
    const boardFocused = document.activeElement === board;
    return {
      loaded: window.__localToolbarBundlesLoaded.slice(),
      apiTypes: [
        typeof api.registerToolbarControl,
        typeof api.unregisterToolbarControl,
        typeof api.hasToolbarControl
      ],
      apiHasMarker: api.hasToolbarControl('lia-marker'),
      apiHasBoard: api.hasToolbarControl('lia-board-mode'),
      markerCount: document.querySelectorAll('#lia-hl-btn').length,
      boardCount: document.querySelectorAll('#lia-tff-btn-v2').length,
      sameMarker: marker === window.__toolbarProbe.originals.marker,
      sameBoard: board === window.__toolbarProbe.originals.boardMode,
      sameHost: marker.parentElement === host && board.parentElement === host,
      hostBeforeEye: host.nextElementSibling === eye,
      eyeIsLast: eye.nextElementSibling === null,
      hostChildren: Array.from(host.children, element =>
        element.getAttribute('data-lia-annotation-control')),
      markerHosted: marker.getAttribute('data-lia-annotation-hosted'),
      boardHosted: board.getAttribute('data-lia-annotation-hosted'),
      markerControl: marker.getAttribute('data-lia-annotation-control'),
      boardControl: board.getAttribute('data-lia-annotation-control'),
      markerClass: marker.classList.contains('lia-annot-external-control'),
      boardClass: board.classList.contains('lia-annot-external-control'),
      markerPanelInToolbar: !!markerPanel.closest('.lia-annot-toolbar'),
      boardPanelInToolbar: !!boardPanel.closest('.lia-annot-toolbar'),
      sliderInBoardPanel: slider.parentElement === boardPanel ||
        boardPanel.contains(slider),
      inlineSlotCount: document.querySelectorAll('#lia-tff-inline-slot-v2').length,
      markerDock: document.documentElement.getAttribute('data-lia-tff-marker-dock'),
      markerLeft: document.documentElement.style.getPropertyValue('--lia-tff-marker-left'),
      markerTop: document.documentElement.style.getPropertyValue('--lia-tff-marker-top'),
      inlineWidth: document.documentElement.style.getPropertyValue('--lia-tff-inline-width'),
      markerLayout: {
        width: markerRect.width,
        height: markerRect.height,
        position: markerStyle.position,
        left: markerStyle.left,
        top: markerStyle.top,
        display: markerStyle.display
      },
      boardLayout: {
        width: boardRect.width,
        height: boardRect.height,
        position: boardStyle.position,
        left: boardStyle.left,
        top: boardStyle.top,
        display: boardStyle.display
      },
      markerIcon: {
        width: markerIconRect.width,
        height: markerIconRect.height
      },
      markerDot: {
        width: markerDotRect.width,
        height: markerDotRect.height,
        display: markerDotStyle.display,
        opacity: markerDotStyle.opacity,
        background: markerDotStyle.backgroundColor
      },
      boardGlyphs: {
        small: parseFloat(smallGlyphStyle.fontSize),
        big: parseFloat(bigGlyphStyle.fontSize),
        smallWidth: smallGlyphRect.width,
        smallHeight: smallGlyphRect.height,
        bigWidth: bigGlyphRect.width,
        bigHeight: bigGlyphRect.height,
        smallVisibility: smallGlyphStyle.visibility,
        bigVisibility: bigGlyphStyle.visibility,
        smallOpacity: smallGlyphStyle.opacity,
        bigOpacity: bigGlyphStyle.opacity
      },
      markerLabel: marker.getAttribute('aria-label') || marker.title,
      boardLabel: board.getAttribute('aria-label') || board.title,
      markerFocused,
      boardFocused,
      markerDisabled: marker.disabled,
      boardDisabled: board.disabled
    };
  });
}

function assertHostedSnapshot(snapshot, order) {
  assert.deepEqual(snapshot.loaded, order, 'each real bundle loads exactly once in order');
  assert.deepEqual(snapshot.apiTypes, ['function', 'function', 'function']);
  assert.equal(snapshot.apiHasMarker, true);
  assert.equal(snapshot.apiHasBoard, true);
  assert.equal(snapshot.markerCount, 1);
  assert.equal(snapshot.boardCount, 1);
  assert.equal(snapshot.sameMarker, true, 'marker keeps original HTMLElement identity');
  assert.equal(snapshot.sameBoard, true, 'board-mode keeps original HTMLElement identity');
  assert.equal(snapshot.sameHost, true);
  assert.equal(snapshot.hostBeforeEye, true, 'template controls sit immediately before the visibility toggle');
  assert.equal(snapshot.eyeIsLast, true, 'visibility toggle remains the final toolbar control');
  assert.deepEqual(snapshot.hostChildren, ['lia-marker', 'lia-board-mode']);
  assert.equal(snapshot.markerHosted, 'true');
  assert.equal(snapshot.boardHosted, 'true');
  assert.equal(snapshot.markerControl, 'lia-marker');
  assert.equal(snapshot.boardControl, 'lia-board-mode');
  assert.equal(snapshot.markerClass, true);
  assert.equal(snapshot.boardClass, true);
  assert.equal(snapshot.markerPanelInToolbar, false);
  assert.equal(snapshot.boardPanelInToolbar, false);
  assert.equal(snapshot.sliderInBoardPanel, true);
  assert.equal(snapshot.inlineSlotCount, 0);
  assert.equal(snapshot.markerDock, null);
  assert.equal(snapshot.markerLeft, '');
  assert.equal(snapshot.markerTop, '');
  assert.equal(snapshot.inlineWidth, '');

  for (const layout of [snapshot.markerLayout, snapshot.boardLayout]) {
    assert.equal(closeTo(layout.width, 32), true, 'hosted control width is 32px');
    assert.equal(closeTo(layout.height, 32), true, 'hosted control height is 32px');
    assert.equal(layout.position, 'relative');
    assert.equal(['auto', '0px'].includes(layout.left), true);
    assert.equal(['auto', '0px'].includes(layout.top), true);
    assert.notEqual(layout.display, 'none');
  }
  assert.equal(closeTo(snapshot.markerIcon.width, 18), true);
  assert.equal(closeTo(snapshot.markerIcon.height, 18), true);
  assert.equal(snapshot.markerDot.width > 0, true);
  assert.equal(snapshot.markerDot.height > 0, true);
  assert.notEqual(snapshot.markerDot.display, 'none');
  assert.notEqual(snapshot.markerDot.opacity, '0');
  assert.notEqual(snapshot.markerDot.background, 'rgba(0, 0, 0, 0)');
  assert.equal(snapshot.boardGlyphs.small > 0 && snapshot.boardGlyphs.small <= 15, true);
  assert.equal(snapshot.boardGlyphs.big > 0 && snapshot.boardGlyphs.big <= 20, true);
  assert.equal(snapshot.boardGlyphs.smallWidth > 0, true);
  assert.equal(snapshot.boardGlyphs.smallHeight > 0, true);
  assert.equal(snapshot.boardGlyphs.bigWidth > 0, true);
  assert.equal(snapshot.boardGlyphs.bigHeight > 0, true);
  assert.equal(snapshot.boardGlyphs.smallVisibility, 'visible');
  assert.equal(snapshot.boardGlyphs.bigVisibility, 'visible');
  assert.notEqual(snapshot.boardGlyphs.smallOpacity, '0');
  assert.notEqual(snapshot.boardGlyphs.bigOpacity, '0');
  assert.equal(snapshot.markerLabel.length > 0, true);
  assert.equal(snapshot.boardLabel.length > 0, true);
  assert.equal(snapshot.markerFocused, true);
  assert.equal(snapshot.boardFocused, true);
  assert.equal(snapshot.markerDisabled, false);
  assert.equal(snapshot.boardDisabled, false);
}

async function exerciseIdempotence(page) {
  await page.evaluate(() => {
    const api = window.__LIA_ANNOTATION__;
    const probe = window.__toolbarProbe;
    probe.nativeAnnotationButton =
      document.querySelector('.lia-annot-btn[data-act="pen"]');
    probe.registerCalls = 0;
    const nativeRegister = api.registerToolbarControl;
    api.registerToolbarControl = function () {
      probe.registerCalls++;
      return nativeRegister.apply(api, arguments);
    };
    for (let i = 0; i < 5; i++) api.refresh();
    for (let i = 0; i < 5; i++) {
      window.dispatchEvent(new CustomEvent('lia-annotation-toolbar-ready', {
        detail: api
      }));
    }
    const content = document.createElement('span');
    content.textContent = ' ordinary peer-template tick';
    document.getElementById('course-text').append(content);
    window.dispatchEvent(new Event('resize'));
  });
  await page.waitForTimeout(600);
  const result = await page.evaluate(() => ({
    registerCalls: window.__toolbarProbe.registerCalls,
    nativeButtonStable: window.__toolbarProbe.nativeAnnotationButton ===
      document.querySelector('.lia-annot-btn[data-act="pen"]'),
    markerStable: window.__toolbarProbe.originals.marker ===
      document.getElementById('lia-hl-btn'),
    boardStable: window.__toolbarProbe.originals.boardMode ===
      document.getElementById('lia-tff-btn-v2'),
    markerCount: document.querySelectorAll('#lia-hl-btn').length,
    boardCount: document.querySelectorAll('#lia-tff-btn-v2').length,
    order: Array.from(
      document.querySelector('.lia-annot-external-actions').children,
      element => element.getAttribute('data-lia-annotation-control')
    )
  }));
  assert.equal(result.registerCalls, 0, 'ready bursts and ordinary ticks do not re-register');
  assert.equal(result.nativeButtonStable, true);
  assert.equal(result.markerStable, true);
  assert.equal(result.boardStable, true);
  assert.equal(result.markerCount, 1);
  assert.equal(result.boardCount, 1);
  assert.deepEqual(result.order, ['lia-marker', 'lia-board-mode']);
}

async function assertPanelGeometry(page, buttonId, panelId) {
  await page.evaluate(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
  const geometry = await page.evaluate(ids => {
    const button = document.getElementById(ids.button).getBoundingClientRect();
    const panel = document.getElementById(ids.panel).getBoundingClientRect();
    const viewport = window.visualViewport;
    return {
      button: button.toJSON(),
      panel: panel.toJSON(),
      left: viewport?.offsetLeft || 0,
      top: viewport?.offsetTop || 0,
      width: viewport?.width || document.documentElement.clientWidth,
      height: viewport?.height || document.documentElement.clientHeight
    };
  }, { button: buttonId, panel: panelId });
  const expectedLeft = Math.max(
    geometry.left + 8,
    Math.min(
      geometry.button.left,
      geometry.left + geometry.width - geometry.panel.width - 8
    )
  );
  let expectedTop = geometry.button.bottom + 10;
  if (expectedTop + geometry.panel.height + 8 >
      geometry.top + geometry.height) {
    expectedTop = geometry.button.top - geometry.panel.height - 10;
  }
  expectedTop = Math.max(
    geometry.top + 8,
    Math.min(
      expectedTop,
      geometry.top + geometry.height - geometry.panel.height - 8
    )
  );
  assert.equal(closeTo(geometry.panel.left, expectedLeft, 1.5), true);
  assert.equal(closeTo(geometry.panel.top, expectedTop, 1.5), true);
  assert.equal(geometry.panel.left >= geometry.left + 7, true);
  assert.equal(geometry.panel.top >= geometry.top + 7, true);
  assert.equal(
    geometry.panel.right <= geometry.left + geometry.width - 7,
    true
  );
  assert.equal(
    geometry.panel.bottom <= geometry.top + geometry.height - 7,
    true
  );
}

async function runHostedInteractions(page) {
  await page.locator('.lia-annot-btn[data-act="pen"]').click();
  await page.waitForFunction(() =>
    window.__LIA_ANNOTATION__.getStore().ui.mode === 'pen'
  );
  await page.locator('.lia-annot-btn[data-act="cursor"]').click();
  await page.waitForFunction(() =>
    window.__LIA_ANNOTATION__.getStore().ui.mode === 'cursor'
  );

  const marker = page.locator('#lia-hl-btn');
  const markerDotBefore = await page.locator('#lia-hl-dot').evaluate(element =>
    getComputedStyle(element).backgroundColor
  );
  await marker.click();
  await page.waitForFunction(() =>
    document.body.classList.contains('lia-hl-panel-open')
  );
  await assertPanelGeometry(page, 'lia-hl-btn', 'lia-hl-panel');
  await page.locator('.hl-swatch[data-hl="green"]').click();
  await page.waitForFunction(() =>
    !document.body.classList.contains('lia-hl-panel-open') &&
    document.querySelector('.hl-swatch[data-hl="green"]').classList.contains('active')
  );
  const markerDotAfter = await page.locator('#lia-hl-dot').evaluate(element =>
    getComputedStyle(element).backgroundColor
  );
  assert.notEqual(markerDotAfter, markerDotBefore);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() =>
    !document.body.classList.contains('lia-hl-active')
  );

  await page.waitForTimeout(280);
  await marker.focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() =>
    document.body.classList.contains('lia-hl-panel-open')
  );
  await page.keyboard.press('Escape');
  await page.waitForFunction(() =>
    !document.body.classList.contains('lia-hl-panel-open')
  );

  await page.waitForTimeout(280);
  await marker.focus();
  await page.keyboard.press('Space');
  await page.waitForFunction(() =>
    document.body.classList.contains('lia-hl-panel-open')
  );
  await page.keyboard.press('Escape');
  await page.waitForFunction(() =>
    !document.body.classList.contains('lia-hl-panel-open')
  );

  const board = page.locator('#lia-tff-btn-v2');
  await board.click();
  await page.waitForFunction(() =>
    document.body.classList.contains('lia-tff-panel-open')
  );
  await assertPanelGeometry(page, 'lia-tff-btn-v2', 'lia-tff-panel-v2');
  await page.locator('#lia-tff-slider-v2').evaluate(slider => {
    slider.value = '31';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForFunction(() =>
    localStorage.getItem('lia-tff-font-px-v2') === '31' &&
    document.documentElement.style.getPropertyValue('--lia-tff-font') === '31px'
  );
  await page.keyboard.press('Escape');
  await page.waitForFunction(() =>
    !document.body.classList.contains('lia-tff-panel-open')
  );

  await board.focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() =>
    document.body.classList.contains('lia-tff-panel-open')
  );
  await page.keyboard.press('Escape');
  await board.focus();
  await page.keyboard.press('Space');
  await page.waitForFunction(() =>
    document.body.classList.contains('lia-tff-panel-open')
  );
  await page.locator('#outside-target').click();
  await page.waitForFunction(() =>
    !document.body.classList.contains('lia-tff-panel-open')
  );

  const readOnly = await page.evaluate(() => {
    const api = window.__LIA_ANNOTATION__;
    api.setReadOnly(true);
    const result = {
      annotationDisabled:
        document.querySelector('.lia-annot-btn[data-act="pen"]').disabled,
      markerDisabled: document.getElementById('lia-hl-btn').disabled,
      boardDisabled: document.getElementById('lia-tff-btn-v2').disabled
    };
    api.setReadOnly(false);
    return result;
  });
  assert.deepEqual(readOnly, {
    annotationDisabled: true,
    markerDisabled: false,
    boardDisabled: false
  });
}

async function rebuildToolbar(page, order) {
  const result = await page.evaluate(() => {
    const oldToolbar = document.querySelector('.lia-annot-toolbar');
    const marker = document.getElementById('lia-hl-btn');
    const board = document.getElementById('lia-tff-btn-v2');
    oldToolbar.remove();
    window.__LIA_ANNOTATION__.refresh();
    return {
      toolbarReplaced: oldToolbar !== document.querySelector('.lia-annot-toolbar'),
      markerSame: marker === document.getElementById('lia-hl-btn'),
      boardSame: board === document.getElementById('lia-tff-btn-v2')
    };
  });
  assert.deepEqual(result, {
    toolbarReplaced: true,
    markerSame: true,
    boardSame: true
  });
  await page.waitForFunction(() => {
    const host = document.querySelector('.lia-annot-external-actions');
    return host &&
      document.getElementById('lia-hl-btn')?.parentElement === host &&
      document.getElementById('lia-tff-btn-v2')?.parentElement === host;
  });
  await page.waitForTimeout(500);
  assertHostedSnapshot(await hostedSnapshot(page), order);

  await page.locator('#lia-hl-btn').click();
  await page.waitForFunction(() =>
    document.body.classList.contains('lia-hl-panel-open')
  );
  await page.keyboard.press('Escape');
  await page.locator('#lia-tff-btn-v2').click();
  await page.waitForFunction(() =>
    document.body.classList.contains('lia-tff-panel-open')
  );
  await page.keyboard.press('Escape');
}

async function standaloneSnapshot(page) {
  return page.evaluate(() => {
    const marker = document.getElementById('lia-hl-btn');
    const board = document.getElementById('lia-tff-btn-v2');
    const slot = document.getElementById('lia-tff-inline-slot-v2');
    const markerRect = marker.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    const separated = markerRect.right <= boardRect.left ||
      boardRect.right <= markerRect.left;
    const gap = markerRect.right <= boardRect.left
      ? boardRect.left - markerRect.right
      : markerRect.left - boardRect.right;
    return {
      annotationApi: typeof window.__LIA_ANNOTATION__,
      markerCount: document.querySelectorAll('#lia-hl-btn').length,
      boardCount: document.querySelectorAll('#lia-tff-btn-v2').length,
      markerParent: marker.parentElement?.id,
      boardParent: board.parentElement?.id,
      slotAfterToc: slot?.previousElementSibling?.id === 'lia-btn-toc',
      markerHosted: marker.hasAttribute('data-lia-annotation-hosted'),
      boardHosted: board.hasAttribute('data-lia-annotation-hosted'),
      markerDock: document.documentElement.getAttribute('data-lia-tff-marker-dock'),
      markerLeft: document.documentElement.style.getPropertyValue('--lia-tff-marker-left'),
      inlineWidth: document.documentElement.style.getPropertyValue('--lia-tff-inline-width'),
      markerWidth: markerRect.width,
      boardWidth: boardRect.width,
      separated,
      gap,
      markerPanelExists: !!document.getElementById('lia-hl-panel'),
      boardPanelExists: !!document.getElementById('lia-tff-panel-v2')
    };
  });
}

function assertStandaloneSnapshot(snapshot) {
  assert.equal(snapshot.annotationApi, 'undefined');
  assert.equal(snapshot.markerCount, 1);
  assert.equal(snapshot.boardCount, 1);
  assert.equal(snapshot.markerParent, 'lia-hl-ui-overlay-v1');
  assert.equal(snapshot.boardParent, 'lia-tff-inline-slot-v2');
  assert.equal(snapshot.slotAfterToc, true);
  assert.equal(snapshot.markerHosted, false);
  assert.equal(snapshot.boardHosted, false);
  assert.equal(snapshot.markerDock, 'inline');
  assert.notEqual(snapshot.markerLeft, '');
  assert.notEqual(snapshot.inlineWidth, '');
  assert.equal(closeTo(snapshot.markerWidth, 40), true);
  assert.equal(closeTo(snapshot.boardWidth, 34), true);
  assert.equal(snapshot.separated, true);
  assert.equal(snapshot.gap >= 5 && snapshot.gap <= 12, true);
  assert.equal(snapshot.markerPanelExists, true);
  assert.equal(snapshot.boardPanelExists, true);
}

async function runStandaloneInteractions(page) {
  await page.locator('#lia-hl-btn').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() =>
    document.body.classList.contains('lia-hl-panel-open')
  );
  await page.keyboard.press('Escape');
  await page.locator('#lia-tff-btn-v2').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() =>
    document.body.classList.contains('lia-tff-panel-open')
  );
  await page.keyboard.press('Escape');
}

async function captureIdleWindows(page) {
  await page.mouse.move(420, 420);
  await page.evaluate(() => {
    const api = window.__LIA_ANNOTATION__;
    const probe = window.__toolbarProbe;
    probe.registerCalls = 0;
    const nativeRegister = api.registerToolbarControl;
    api.registerToolbarControl = function () {
      probe.registerCalls++;
      return nativeRegister.apply(api, arguments);
    };
    for (let i = 0; i < 6; i++) {
      window.dispatchEvent(new CustomEvent('lia-annotation-toolbar-ready', {
        detail: api
      }));
      api.refresh();
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('scroll'));
    }
    const mutation = document.createElement('span');
    mutation.textContent = ' settle the real peer-template observers';
    document.getElementById('course-text').append(mutation);
  });
  await page.waitForTimeout(1000);

  const windows = [];
  for (let i = 0; i < 2; i++) {
    await page.evaluate(() => window.__toolbarProbe.resetMetrics());
    await page.waitForTimeout(500);
    windows.push(await page.evaluate(() => window.__toolbarProbe.readMetrics()));
  }
  const state = await page.evaluate(() => ({
    registerCalls: window.__toolbarProbe.registerCalls,
    markerParent:
      document.getElementById('lia-hl-btn').parentElement?.className,
    boardParent:
      document.getElementById('lia-tff-btn-v2').parentElement?.className,
    order: Array.from(
      document.querySelector('.lia-annot-external-actions').children,
      element => element.getAttribute('data-lia-annotation-control')
    ),
    markerPanelOpen: document.body.classList.contains('lia-hl-panel-open'),
    boardPanelOpen: document.body.classList.contains('lia-tff-panel-open')
  }));
  return { windows, state };
}

function assertIdleResult(result) {
  assert.equal(result.state.registerCalls, 0);
  assert.match(result.state.markerParent, /lia-annot-external-actions/);
  assert.match(result.state.boardParent, /lia-annot-external-actions/);
  assert.deepEqual(result.state.order, ['lia-marker', 'lia-board-mode']);
  assert.equal(result.state.markerPanelOpen, false);
  assert.equal(result.state.boardPanelOpen, false);
  for (const windowMetrics of result.windows) {
    assert.deepEqual(windowMetrics, {
      rafRequests: 0,
      rafFrames: 0,
      totalMutations: 0,
      toolbarMutations: 0,
      buttonMutations: 0,
      panelStyleMutations: 0,
      hostedAttributeMutations: 0,
      pendingRAF: 0
    });
  }
}

test('current local dist bundles host marker and board-mode controls together', {
  skip: skipReason
}, async t => {
  if (availability.issues.length) {
    throw new Error(
      'Explicit toolbar integration requires all local bundles:\n- ' +
      availability.issues.join('\n- ')
    );
  }
  const bundles = readLocalBundles();
  if (explicitIntegration) {
    console.log(
      '[toolbar-integration] local bundle paths and SHA-256:\n' +
      JSON.stringify(publicBundleManifest(bundles), null, 2)
    );
  }

  const browser = await launchBrowser();
  t.after(async () => { await browser.close(); });

  for (const order of allOrders) {
    await t.test('load order: ' + order.join(' -> '), async () => {
      const scenario = await openScenario(browser, bundles, order);
      try {
        assertHostedSnapshot(await hostedSnapshot(scenario.page), order);
        await exerciseIdempotence(scenario.page);
        await assertNoRuntimeErrors(scenario);
      } finally {
        await scenario.close();
      }
    });
  }

  for (const order of interactionOrders) {
    await t.test('real interactions: ' + order.join(' -> '), async () => {
      const scenario = await openScenario(browser, bundles, order);
      try {
        assertHostedSnapshot(await hostedSnapshot(scenario.page), order);
        await runHostedInteractions(scenario.page);
        await assertNoRuntimeErrors(scenario);
      } finally {
        await scenario.close();
      }
    });
  }

  await t.test('public refresh rebuilds the toolbar around the same controls', async () => {
    const order = ['marker', 'board-mode', 'annotation'];
    const scenario = await openScenario(browser, bundles, order);
    try {
      assertHostedSnapshot(await hostedSnapshot(scenario.page), order);
      await rebuildToolbar(scenario.page, order);
      await assertNoRuntimeErrors(scenario);
    } finally {
      await scenario.close();
    }
  });

  for (const order of standaloneOrders) {
    await t.test('standalone fallback: ' + order.join(' -> '), async () => {
      const scenario = await openScenario(browser, bundles, order);
      try {
        assertStandaloneSnapshot(await standaloneSnapshot(scenario.page));
        await runStandaloneInteractions(scenario.page);
        await assertNoRuntimeErrors(scenario);
      } finally {
        await scenario.close();
      }
    });
  }

  await t.test('hosted controls settle for two consecutive idle windows', async () => {
    const order = ['board-mode', 'marker', 'annotation'];
    const scenario = await openScenario(browser, bundles, order);
    try {
      assertHostedSnapshot(await hostedSnapshot(scenario.page), order);
      assertIdleResult(await captureIdleWindows(scenario.page));
      await assertNoRuntimeErrors(scenario);
    } finally {
      await scenario.close();
    }
  });
});
