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

  setTimeout(function () { ensureOverlay(); requestSync(); }, 0);
  setTimeout(function () { ensureOverlay(); requestSync(); }, 80);
  setTimeout(function () { ensureOverlay(); requestSync(); }, 250);
  setTimeout(function () { ensureOverlay(); requestSync(); }, 700);

  window.addEventListener('resize', function () { applyThemeVars(); ensureToolbar(); requestSync(); });
  window.addEventListener('hashchange', function () {
    exitQuizPickingMode();
    clearMarkedRect();
    STORE.ui.ocrBusy = false;
    STORE.ui.ocrDraft = '';
    STORE.ui.ocrFailed = false;
    ensureSlide(getSlideKey());
    ensureOverlay();
    updateToolbar();
    setTimeout(function () { ensureOverlay(); requestSync(); }, 40);
    setTimeout(function () { ensureOverlay(); requestSync(); }, 180);
    setTimeout(function () { ensureOverlay(); requestSync(); }, 500);
  });
  window.addEventListener('scroll', function () { requestSync(); }, true);
  document.addEventListener('input', function () { requestSync(); }, true);
  document.addEventListener('change', function () { requestSync(); }, true);

  const themeMo = new MutationObserver(function () { applyThemeVars(); updateToolbar(); requestRedraw(); });
  try {
    themeMo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
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
