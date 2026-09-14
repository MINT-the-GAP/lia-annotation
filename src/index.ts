// Entry point: dedup guard, then boot the plugin and register all event listeners.

import { IS_DUPLICATE, STORE, getSlideKey, ensureSlide } from './store';
import {
  applyThemeVars,
  ensureCss,
  ensureToolbar,
  updateToolbar,
  syncToolbarPosition,
  setToolbarCallbacks,
  setGetVisibleMainHost
} from './ui';
import {
  ensureOverlay,
  syncOverlayInteractivity,
  requestSync,
  requestRedraw,
  getVisibleMainHost,
  setOverlayCallbacks,
  clearMarkedRect,
  exitQuizPickingMode,
  startDgsPlacementMode
} from './overlay';
import { doUndo, doRedo, clearSlide, registerGlobalApi, transferToNearestQuiz, isOcrAvailable, recognizeLatestAnnotationText, submitOcrTextToNearestQuiz, shouldPromptDgsInsert } from './api';

if (!IS_DUPLICATE) {
  // Wire up the callbacks that ui.ts needs to call back into overlay/api
  setToolbarCallbacks({
    requestRedraw,
    requestSync,
    syncOverlayInteractivity,
    ensureOverlay,
    doUndo,
    doRedo,
    clearSlide,
    transferToNearestQuiz,
    recognizeLatestAnnotationText,
    submitOcrTextToNearestQuiz,
    isOcrAvailable,
    startDgsPlacementMode
  });

  // Give ui.ts a reference to getVisibleMainHost (defined in overlay.ts).
  setGetVisibleMainHost(getVisibleMainHost);
  setOverlayCallbacks({
    submitMarkedRect: transferToNearestQuiz,
    shouldPromptDgsInsert
  });

  ensureCss();
  applyThemeVars();
  ensureToolbar();
  ensureSlide(getSlideKey());
  ensureOverlay();
  syncToolbarPosition();
  updateToolbar();
  registerGlobalApi();

  setTimeout(requestSync, 0);
  setTimeout(requestSync, 80);
  setTimeout(requestSync, 250);
  setTimeout(requestSync, 700);

  window.addEventListener('resize', function () { requestThemeSync(); requestSync(); });
  window.addEventListener('hashchange', function () {
    exitQuizPickingMode();
    clearMarkedRect();
    STORE.ui.ocrBusy = false;
    STORE.ui.ocrDraft = '';
    STORE.ui.ocrFailed = false;
    ensureSlide(getSlideKey());
    ensureOverlay();
    updateToolbar();
    setTimeout(requestSync, 40);
    setTimeout(requestSync, 180);
    setTimeout(requestSync, 500);
  });
  window.addEventListener('scroll', function () { requestSync(); }, true);
  document.addEventListener('input', function () { requestSync(); }, true);
  document.addEventListener('change', function () { requestSync(); }, true);

  // Theme outputs must not retrigger their own observer. Compare external
  // inputs without discarding mutation batches: other templates may change
  // class/style in the same delivery or immediately after our own writes.
  const themeOutputs = new Set([
    '--lia-annot-border', '--lia-annot-fg', '--lia-annot-accent',
    '--lia-annot-bg', '--lia-annot-panel-bg'
  ]);
  function themeInputs(): string {
    return JSON.stringify([document.documentElement, document.body].map(function (el) {
      if (!el) return null;
      const style = Array.from(el.style)
        .filter(name => el !== document.documentElement || !themeOutputs.has(name))
        .sort()
        .map(name => [name, el.style.getPropertyValue(name), el.style.getPropertyPriority(name)]);
      return [el.className, style];
    }));
  }
  let lastThemeInputs = themeInputs();
  let themeRAF = 0;
  function requestThemeSync(): void {
    if (themeRAF) return;
    themeRAF = requestAnimationFrame(function () {
      themeRAF = 0;
      // Snapshot before applying so external edits during application are
      // still detected by the next observer delivery.
      lastThemeInputs = themeInputs();
      applyThemeVars();
      updateToolbar();
      syncOverlayInteractivity();
      requestSync();
      requestRedraw();
    });
  }
  const themeMo = new MutationObserver(function () {
    if (themeInputs() !== lastThemeInputs) requestThemeSync();
  });
  try {
    themeMo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    if (document.body) themeMo.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
  } catch (_) { }

  let lastOcrAvailable = isOcrAvailable();
  const ocrPollId = window.setInterval(function () {
    const next = isOcrAvailable();
    if (next !== lastOcrAvailable) {
      lastOcrAvailable = next;
      updateToolbar();
    }
  }, 1200);

  // The poll runs for the lifetime of the document; stop it if the page goes
  // away so it does not keep firing in a cached/restored page.
  window.addEventListener('pagehide', function () { window.clearInterval(ocrPollId); });
}
