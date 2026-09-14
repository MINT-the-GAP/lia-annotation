'use strict';

// Deliberately excludes lia-annotation: diagnose activity originating in peer templates.
const fs = require('node:fs');
const path = require('node:path');
const { launchBrowser } = require('../harness.cjs');
const { loadIntegrationAssets } = require('./loader.cjs');

async function main() {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 800 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route(/^https?:/, route => route.abort());
    await page.route('http://annotation.test/', route => route.fulfill({
      contentType: 'text/html', body: fs.readFileSync(path.join(__dirname, 'fixture.html'), 'utf8')
    }));
    await page.goto('http://annotation.test/');
    await page.evaluate(() => {
      const nativeRAF = window.requestAnimationFrame.bind(window);
      // The fixture wraps MutationObserver for attribution; keep our diagnostic
      // observer outside those template callback counts.
      const NativeObserver = Object.getPrototypeOf(window.MutationObserver);
      const empty = () => ({ rafRequests: 0, rafOwners: {}, mutationTargets: {} });
      window.__baseline = empty();
      window.requestAnimationFrame = callback => {
        const stack = new Error().stack || '';
        const owner = ['coordinate', 'marker', 'board-mode'].find(name =>
          stack.includes('lia-integration/' + name + '.js')) || 'other';
        window.__baseline.rafRequests++;
        window.__baseline.rafOwners[owner] = (window.__baseline.rafOwners[owner] || 0) + 1;
        return nativeRAF(callback);
      };
      const observer = new NativeObserver(records => {
        for (const record of records) {
          const target = record.target;
          const key = [record.type, target.nodeName, target.id || '', record.attributeName || ''].join('|');
          window.__baseline.mutationTargets[key] = (window.__baseline.mutationTargets[key] || 0) + 1;
        }
      });
      observer.observe(document.documentElement, {
        subtree: true, childList: true, attributes: true, characterData: true
      });
      window.__resetBaseline = () => {
        observer.takeRecords();
        window.__integration.reset();
        window.__baseline = empty();
      };
    });
    await loadIntegrationAssets(page, { allowDownload: process.argv.includes('--download') });
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.__resetBaseline());
    await page.waitForTimeout(500);
    const result = await page.evaluate(() => ({
      annotationLoaded: !!window.__LIA_ANNOTATION__,
      mode: document.documentElement.dataset.liaMode,
      metrics: window.__integration.metrics,
      ...window.__baseline
    }));
    console.log(JSON.stringify({
      browser: browser.version(), viewport: { width: 1100, height: 800 },
      settleMs: 1200, sampleMs: 500, errors, ...result
    }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
