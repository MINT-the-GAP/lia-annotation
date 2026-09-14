const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { chromium } = require('playwright-core');

const root = path.resolve(__dirname, '..');
const fixture = `<!doctype html><html lang="en"><head><style>
html { --test-accent: rgb(20, 100, 210); }
body { margin: 0; background: rgb(255, 255, 255); }
html.dark body { background: rgb(24, 24, 24); }
html.alternate body { background: rgb(250, 250, 250); }
.lia-btn { background: var(--test-accent); }
main { position: relative; margin: 40px 80px; width: 800px; }
.lia-slide { height: 620px; }
#page-tail { height: 1000px; }
#quiz { position: absolute; left: 500px; top: 200px; }
</style></head><body><button class="lia-btn">Lia theme</button>
<main><section class="lia-slide"><input id="quiz" aria-label="Quiz answer"></section></main>
<div id="page-tail"></div></body></html>`;

// Exercise the actual modules without adding test exports or a second production bundle.
function sourceBundle() {
  const factories = fs.readdirSync(path.join(root, 'src')).filter(name => name.endsWith('.ts'))
    .map(name => {
      const source = fs.readFileSync(path.join(root, 'src', name), 'utf8');
      const js = ts.transpileModule(source, {
        fileName: name,
        compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS }
      }).outputText;
      return `${JSON.stringify('./' + name.slice(0, -3))}: function(require, module, exports) {\n${js}\n}`;
    }).join(',\n');
  return `(function () {
    const factories = {${factories}}, cache = {};
    function require(id) {
      if (cache[id]) return cache[id].exports;
      const module = cache[id] = { exports: {} };
      if (!factories[id]) throw new Error('Unknown test module: ' + id);
      factories[id](require, module, module.exports);
      return module.exports;
    }
    require('./index');
    window.__annotationTest = {
      ui: require('./ui'), overlay: require('./overlay'),
      store: require('./store'), api: require('./api'), dom: require('./dom')
    };
  })();`;
}

async function launchBrowser() {
  const options = { headless: true };
  if (process.env.ANNOTATION_BROWSER) options.executablePath = process.env.ANNOTATION_BROWSER;
  else if (process.env.ANNOTATION_BROWSER_CHANNEL) options.channel = process.env.ANNOTATION_BROWSER_CHANNEL;
  else if (!fs.existsSync(chromium.executablePath())) options.channel = 'chrome';
  return chromium.launch(options);
}

async function openPage(browser, { html = fixture, beforeBoot, afterContent, bundle = 'source' } = {}) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Keep these tests deterministic and offline, including optional OCR font/model loading.
  await page.route(/^https?:/, route => route.abort());
  await page.route('http://annotation.test/', route => route.fulfill({ contentType: 'text/html', body: html }));
  await page.goto('http://annotation.test/');
  await page.evaluate(() => {
    const metrics = window.__metrics = { raf: 0, frames: 0, paints: 0, pending: new Set() };
    const nativeRAF = window.requestAnimationFrame.bind(window);
    const nativeCancel = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = callback => {
      metrics.raf++;
      const id = nativeRAF(time => {
        metrics.pending.delete(id);
        metrics.frames++;
        callback(time);
      });
      metrics.pending.add(id);
      return id;
    };
    window.cancelAnimationFrame = id => { metrics.pending.delete(id); nativeCancel(id); };
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.classList.contains('lia-annot-canvas')) metrics.paints++;
      return clear.apply(this, args);
    };
    window.__resetMetrics = () => {
      metrics.raf = metrics.frames = metrics.paints = 0;
      window.__mutationRecords = [];
      window.__mutationObserver?.disconnect();
      window.__mutationObserver = new MutationObserver(records => window.__mutationRecords.push(...records));
      window.__mutationObserver.observe(document.documentElement, {
        subtree: true, childList: true, attributes: true, characterData: true
      });
    };
    window.__readMetrics = () => ({
      raf: metrics.raf, frames: metrics.frames, paints: metrics.paints, pending: metrics.pending.size,
      mutations: window.__mutationRecords.length,
      toolbarMutations: window.__mutationRecords.filter(record =>
        record.target === document.querySelector('.lia-annot-toolbar') ||
        document.querySelector('.lia-annot-toolbar').contains(record.target)).length
    });
  });
  if (afterContent) await afterContent(page);
  if (beforeBoot) await page.evaluate(beforeBoot);
  await page.addScriptTag({ content: bundle === 'dist' ? fs.readFileSync(path.join(root, 'dist/index.js'), 'utf8') : sourceBundle() });
  await page.waitForTimeout(950); // Includes the final intentional startup retry at 700 ms.
  await page.evaluate(() => window.__resetMetrics());
  page.testErrors = errors;
  return page;
}

async function reset(page) { await page.evaluate(() => window.__resetMetrics()); }
async function metrics(page) { return page.evaluate(() => window.__readMetrics()); }
async function settle(page, ms = 100) { await page.waitForTimeout(ms); }
async function clickTool(page, action) { await page.locator(`.lia-annot-toolbar button[data-act="${action}"]`).click(); }
async function stroke(page, from, to, steps = 12) {
  // Close an open settings panel using its normal toggle before aiming at canvas.
  await page.evaluate(() => {
    const { STORE } = window.__annotationTest.store;
    if (STORE.ui.panelOpen && (STORE.ui.mode === 'pen' || STORE.ui.mode === 'eraser')) {
      document.querySelector('.lia-annot-toolbar [data-act=' + STORE.ui.mode + ']').click();
    }
  });
  const box = await page.locator('.lia-annot-canvas').boundingBox();
  await page.mouse.move(box.x + from[0], box.y + from[1]);
  await page.mouse.down();
  await page.mouse.move(box.x + to[0], box.y + to[1], { steps });
  await page.mouse.up();
  await settle(page);
}
async function alphaAt(page, x, y) {
  return page.evaluate(([x, y]) => {
    const { STATE } = window.__annotationTest.store;
    return STATE.ctx.getImageData(Math.round(x * STATE.dpr), Math.round(y * STATE.dpr), 1, 1).data[3];
  }, [x, y]);
}

module.exports = { root, fixture, launchBrowser, openPage, reset, metrics, settle, clickTool, stroke, alphaAt };
