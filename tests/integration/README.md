# Template integration regression

Run `npm run test:integration` with Node and an installed Chrome/Chromium.
The first explicit run downloads the three commit-pinned bundles in
[assets.json](assets.json), verifies their SHA256 hashes and caches them in the
ignored `.test-assets/integration/` directory. Later runs are offline.
`npm test` also runs this integration test when all cached assets are present;
otherwise only this integration case is skipped. Set `LIA_INTEGRATION_ASSETS`
to use an existing asset directory containing `coordinate.js`, `marker.js`
and `board-mode.js`.

The harness uses Playwright's installed Chromium if present, otherwise system
Chrome. Override the browser with `ANNOTATION_BROWSER` (executable path) or
`ANNOTATION_BROWSER_CHANNEL` (for example `chrome` or `msedge`).

[fixture.html](fixture.html) represents the public macro output of two
`static=1` Superposition graphs from
[Wochenaufgabe / ABs/Spezi/profil10Lehrer.md, revision 3184ab1](https://github.com/MINT-the-GAP/Wochenaufgabe/blob/3184ab1978075679b6f1ae060474541fbfd1554d/ABs/Spezi/profil10Lehrer.md#L297).
It loads the actual lia-coordinate, lia-marker and lia-board-mode bundles,
including their real observers. A local routed HTTP origin provides normal
localStorage/sessionStorage; no external course viewer is contacted.
lia-annotation is compiled from the current TypeScript modules by the harness.

The test checks settled activity before and after scroll, pen, eraser, cursor
and theme changes. It measures DOM mutations and real observer callbacks, checks
toolbar SVG identity and canvas paints, and observes coordinate SVGs inside
their shadow roots. The instrumentation counts behavior; it is not a timing
benchmark. Startup and each real interaction are allowed to settle before idle measurements.
After an action, the test waits 250 ms, resets counters, then checks a 500 ms
idle window.

Relevant integration paths at the pinned versions:

- [lia-marker index.ts:333](https://github.com/MINT-the-GAP/lia-marker/blob/ed3da1236c5582c4083f2951fdaa4f83dfc97484/src/index.ts#L333)
  observes body child-list changes and schedules its layout/UI tick unless
  every mutation belongs to its own highlight overlay.
- [lia-board-mode events.ts:117](https://github.com/MINT-the-GAP/lia-board-mode/blob/97ea8f235a2e4d2009f923b6a6f13f241084eb6c/src/events.ts#L117)
  observes global child-list and attribute changes, ignoring only `style`
  and `data-lia-mode` attributes in this observer.
- [lia-coordinate staticSvg.ts:2535](https://github.com/MINT-the-GAP/lia-coordinate/blob/8dcdbb50d410cea6b107388d4ef5f7e4dedf63cb/src/static/staticSvg.ts#L2535)
  filters unrelated toolbar child-list changes, but html/body theme attribute
  changes schedule the static bootstrap. Its renderer rebuilds the static SVGs,
  so legitimate theme changes may replace coordinate SVG nodes.

Scope: two static SVG coordinate graphs with eight vectors and ordinary
toolbar use. This is not a complete LiaScript/Elm viewer, the entire original
course, MathJax rendering, every template imported by that course, or a
cross-browser performance benchmark. The real templates retain intentional
polling (for example marker layout checks and board-mode's five-second poll);
the assertions target mutation/animation-frame chains during settled windows.
The behavior of repeated identical CSS custom-property writes differs between
browser versions. These checks do not establish a browser-independent infinite
loop in the previous code.

## Browser-specific peer-template baseline

Run `node tests/integration/baseline.cjs` to load the identical fixture and peer
bundles **without lia-annotation**. It waits 1200 ms, resets counters and records
a 500 ms window. `--download` explicitly permits downloading missing pinned
assets. The same `ANNOTATION_BROWSER` / `ANNOTATION_BROWSER_CHANNEL` overrides
apply. Results from 14 September 2026 are saved in
[baseline-results.json](baseline-results.json):

| Browser | Annotation loaded | RAF requests | DOM mutations | Coordinate mutations |
| --- | --- | ---: | ---: | ---: |
| Chromium 131.0.6778.33 | No | 45 | 345 | 60 |
| Chrome 152.0.7977.83 | No | 0 | 0 | 0 |

Both samples used presentation mode, a 1100 by 800 viewport and produced no
page errors. In Chromium 131 the mutations were 225 html style records,
60 marker-button style records and 60 coordinate-host child-list records.
RAF requests were 15 per peer template. Real observer callback counts were
coordinate 45, marker 30 and board-mode 105.

The observed path is independent of lia-annotation:
[marker's root CSS writes](https://github.com/MINT-the-GAP/lia-marker/blob/ed3da1236c5582c4083f2951fdaa4f83dfc97484/src/theme/index.ts#L103)
and [board-mode's root CSS writes](https://github.com/MINT-the-GAP/lia-board-mode/blob/97ea8f235a2e4d2009f923b6a6f13f241084eb6c/src/css.ts#L58)
notify coordinate's theme observer; coordinate replaces the static SVGs;
those child-list changes schedule the marker/board-mode ticks, which write
root CSS again. In additional Chromium 131 pair checks, coordinate + marker
produced 315 mutations, coordinate + board-mode produced 94, and
marker + board-mode produced zero in the same 500 ms window.

The full integration test deliberately retains strict idle assertions.
It fails on this Chromium 131 peer-template baseline; the failure is not
converted into a pass or hidden behind a larger threshold. Correcting that
independent path requires changes in the peer templates. The Chrome 152
integration result and annotation-only regression results do not establish
compatibility across all browser versions.
