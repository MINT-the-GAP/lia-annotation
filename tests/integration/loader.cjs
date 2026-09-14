'use strict';

const { createHash } = require('node:crypto');
const { readFile, writeFile, mkdir } = require('node:fs/promises');
const { existsSync } = require('node:fs');
const path = require('node:path');
const assets = require('./assets.json');
const assetDirectory = process.env.LIA_INTEGRATION_ASSETS || path.resolve(__dirname, '../../.test-assets/integration');

function hasIntegrationAssets() {
  return assets.every(asset => existsSync(path.join(assetDirectory, asset.file)));
}

async function readAsset(asset, allowDownload) {
  const file = path.join(assetDirectory, asset.file);
  let content;
  try { content = await readFile(file); }
  catch (error) {
    if (error.code !== 'ENOENT' || !allowDownload) throw error;
    const response = await fetch(asset.url);
    if (!response.ok) throw new Error('Integration asset download failed: ' + response.status + ' ' + asset.url);
    content = Buffer.from(await response.arrayBuffer());
    const sha256 = createHash('sha256').update(content).digest('hex');
    if (sha256 !== asset.sha256) throw new Error('Integration asset SHA256 mismatch: ' + asset.name);
    await mkdir(assetDirectory, { recursive: true });
    await writeFile(file, content);
  }
  if (createHash('sha256').update(content).digest('hex') !== asset.sha256) {
    throw new Error('Integration asset SHA256 mismatch: ' + asset.name);
  }
  return content.toString('utf8');
}

async function loadIntegrationAssets(page, { allowDownload = false } = {}) {
  for (const asset of assets) {
    const content = await readAsset(asset, allowDownload);
    await page.addScriptTag({ content: content + '\n//# sourceURL=lia-integration/' + asset.name + '.js' });
  }
  await page.waitForFunction(() =>
    !!window.__coord && !!window.__HLDBG && !!window.__LIA_TFF_REG_V2__ &&
    window.__integration.coordinateSvgs().every(Boolean)
  );
  await page.evaluate(() => window.__integration.watchCoordinates());
}

module.exports = { loadIntegrationAssets, hasIntegrationAssets, assetDirectory };
