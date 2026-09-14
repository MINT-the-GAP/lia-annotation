const assert = require('node:assert/strict');
const { test } = require('node:test');
const { launchBrowser, openPage, reset, metrics, settle, clickTool } = require('./harness.cjs');

test('shipped dist bundle supports drawing, undo, themes and a quiet public refresh', async t => {
  const browser = await launchBrowser();
  t.after(() => browser.close());
  const page = await openPage(browser, { bundle: 'dist' });
  t.after(async () => {
    assert.deepEqual(page.testErrors, []);
    await page.close();
  });
  assert.equal(await page.evaluate(() => typeof window.__LIA_ANNOTATION__.getStore), 'function');
  await page.evaluate(() => { for (let i = 0; i < 10; i++) window.__LIA_ANNOTATION__.refresh(); });
  await settle(page);
  assert.equal((await metrics(page)).mutations, 0);
  assert.equal((await metrics(page)).paints, 0);
  await clickTool(page, 'pen');
  await clickTool(page, 'pen');
  const box = await page.locator('.lia-annot-canvas').boundingBox();
  await page.mouse.move(box.x + 400, box.y + 180);
  await page.mouse.down();
  await page.mouse.move(box.x + 600, box.y + 180, { steps: 12 });
  await page.mouse.up();
  await settle(page);
  assert.equal(await page.evaluate(() => window.__LIA_ANNOTATION__.getStore().slides['#1'].items.length), 1);
  assert.ok(await page.locator('.lia-annot-canvas').evaluate(canvas => canvas.getContext('2d').getImageData(500, 180, 1, 1).data[3]) > 0);
  await clickTool(page, 'undo');
  await settle(page);
  assert.equal(await page.locator('.lia-annot-canvas').evaluate(canvas => canvas.getContext('2d').getImageData(500, 180, 1, 1).data[3]), 0);
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await settle(page);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--lia-annot-fg').trim()), '#fff');
  await reset(page);
  await settle(page, 350);
  assert.deepEqual(await metrics(page), { raf: 0, frames: 0, paints: 0, pending: 0, mutations: 0, toolbarMutations: 0 });
});
