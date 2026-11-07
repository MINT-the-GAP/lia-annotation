'use strict';

const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const names = ['annotation', 'marker', 'board-mode'];

const definitions = {
  annotation: {
    env: 'LIA_ANNOTATION_LOCAL_BUNDLE',
    fallback: path.join(root, 'dist', 'index.js')
  },
  marker: {
    env: 'LIA_MARKER_LOCAL_BUNDLE',
    fallback: path.resolve(root, '..', '..', 'Textmarker', 'lia-marker', 'dist', 'index.js')
  },
  'board-mode': {
    env: 'LIA_BOARD_MODE_LOCAL_BUNDLE',
    fallback: path.resolve(root, '..', '..', 'Tafelmodus', 'lia-board-mode', 'dist', 'index.js')
  }
};

function isExplicitLocalIntegration() {
  return process.env.npm_lifecycle_event === 'test:toolbar-integration' ||
    process.env.ANNOTATION_TOOLBAR_INTEGRATION === '1';
}

function inspectLocalBundles() {
  const paths = {};
  const issues = [];

  for (const name of names) {
    const definition = definitions[name];
    const override = process.env[definition.env];
    if (override && !path.isAbsolute(override)) {
      issues.push(definition.env + ' must be an absolute path: ' + override);
      paths[name] = override;
      continue;
    }

    const file = path.resolve(override || definition.fallback);
    paths[name] = file;
    try {
      if (!fs.statSync(file).isFile()) issues.push(name + ' bundle is not a file: ' + file);
      else fs.accessSync(file, fs.constants.R_OK);
    } catch (error) {
      issues.push(name + ' bundle is not readable: ' + file + ' (' + (error.code || error.message) + ')');
    }
  }

  return { paths, issues };
}

function readLocalBundles() {
  const inspected = inspectLocalBundles();
  if (inspected.issues.length) {
    throw new Error('Local toolbar integration bundles are unavailable:\n- ' + inspected.issues.join('\n- '));
  }

  const bundles = {};
  for (const name of names) {
    const file = inspected.paths[name];
    const content = fs.readFileSync(file);
    bundles[name] = {
      name,
      file,
      sha256: createHash('sha256').update(content).digest('hex'),
      source: content.toString('utf8')
    };
  }
  return bundles;
}

async function injectLocalBundle(page, bundles, name) {
  const bundle = bundles[name];
  if (!bundle) throw new Error('Unknown local integration bundle: ' + name);
  await page.evaluate(bundleName => {
    const loaded = window.__localToolbarBundlesLoaded ||
      (window.__localToolbarBundlesLoaded = []);
    if (loaded.includes(bundleName)) throw new Error('Bundle loaded twice: ' + bundleName);
    loaded.push(bundleName);
  }, name);
  await page.addScriptTag({
    content: bundle.source + '\n//# sourceURL=lia-local/' + name + '.js'
  });
}

function publicBundleManifest(bundles) {
  return names.map(name => ({
    name,
    path: bundles[name].file,
    sha256: bundles[name].sha256
  }));
}

module.exports = {
  injectLocalBundle,
  inspectLocalBundles,
  isExplicitLocalIntegration,
  names,
  publicBundleManifest,
  readLocalBundles,
  root
};
