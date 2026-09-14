const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { launchBrowser, openPage, reset, metrics, settle, clickTool, stroke } = require('./harness.cjs');
const { loadIntegrationAssets, hasIntegrationAssets } = require('./integration/loader.cjs');
const explicitIntegration = process.env.npm_lifecycle_event === 'test:integration' || process.env.ANNOTATION_INTEGRATION === '1';

test('real coordinate, marker and board-mode templates settle after annotation actions', {
  skip: !explicitIntegration && !hasIntegrationAssets() ? 'run npm run test:integration to download the pinned template bundles' : false
}, async t => {
  const browser = await launchBrowser();
  t.after(() => browser.close());
  const page = await openPage(browser, {
    html: fs.readFileSync(path.join(__dirname, 'integration/fixture.html'), 'utf8'),
    afterContent: page => loadIntegrationAssets(page, { allowDownload: explicitIntegration })
  });
  t.after(async () => {
    assert.deepEqual(page.testErrors, []);
    await page.close();
  });
  const resetAll = async () => {
    await reset(page);
    await page.evaluate(() => window.__integration.reset());
  };
  const quiet = async () => {
    await settle(page, 250);
    await resetAll();
    await settle(page, 500);
    assert.deepEqual(await metrics(page), {
      raf: 0, frames: 0, paints: 0, pending: 0, mutations: 0, toolbarMutations: 0
    });
    assert.deepEqual(await page.evaluate(() => window.__integration.metrics), {
      mutations: 0, toolbarMutations: 0, coordinateMutations: 0, observerCallbacks: {}
    });
  };
  await page.evaluate(() => {
    window.__coordinateSvgs = window.__integration.coordinateSvgs();
    window.__eye = document.querySelector('.lia-annot-toolbar [data-act="toggle"] svg');
  });
  assert.equal(await page.evaluate(() => window.__coordinateSvgs.length), 2);
  await quiet();
  await resetAll();
  await page.evaluate(() => window.scrollTo(0, 180));
  await settle(page, 250);
  assert.equal((await metrics(page)).toolbarMutations, 0);
  assert.equal((await metrics(page)).paints, 0);
  assert.equal(await page.evaluate(() => window.__eye === document.querySelector('.lia-annot-toolbar [data-act="toggle"] svg')), true);
  await quiet();
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page);
  await clickTool(page, 'pen');
  await stroke(page, [680, 220], [780, 280]);
  await clickTool(page, 'eraser');
  await stroke(page, [730, 220], [730, 290]);
  await clickTool(page, 'cursor');
  await quiet();
  assert.equal(await page.evaluate(() => window.__coordinateSvgs.every((svg, i) => svg === window.__integration.coordinateSvgs()[i])), true);
  await page.evaluate(() => document.documentElement.classList.replace('lia-light', 'lia-dark'));
  await settle(page, 300);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--lia-annot-fg').trim()), '#fff');
  await quiet();

});
