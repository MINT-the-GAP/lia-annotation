# Browser regression tests

Install dependencies with `npm ci`, then run:

```sh
npm run build
npx tsc --noEmit
npm test
npm run test:integration
```

Use an installed Playwright Chromium or system Chrome. To select another
installed browser, set `ANNOTATION_BROWSER` to its executable path or
`ANNOTATION_BROWSER_CHANNEL` to `chrome` or `msedge` before running the tests.
The tests use `playwright-core`; installing npm dependencies alone does not
download a browser. Development validation used Node 24.

The source tests transpile the actual TypeScript modules in memory. The dist
smoke test loads the generated `dist/index.js` and uses the public API. Real
browser MutationObservers, node identity, animation-frame counts and canvas
pixels verify idempotence, scroll/resize/DPR, pointer bursts, pen/eraser,
undo/redo, visibility, keyboard controls, slide binding and theme races.
OCR recognition/KaTeX use deterministic stubs; DGS placement tests exercise
the SVG fallback and import/clear lifecycle.

See [the integration fixture](integration/README.md) for the test with real
lia-coordinate, lia-marker and lia-board-mode bundles. Its first explicit
run downloads checksum-verified, pinned bundles. Other tests are offline;
`npm test` skips only this integration case if the bundles are not cached.
These tests measure rendering activity and correctness, not perceived latency
or the full original LiaScript course.
