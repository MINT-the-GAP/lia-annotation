!function(e,t,n,a,r){var i="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:"u">typeof global?global:{},o="function"==typeof i[a]&&i[a],l=o.i||{},s=o.cache||{},d="u">typeof module&&"function"==typeof module.require&&module.require.bind(module);function c(t,n){if(!s[t]){if(!e[t]){if(r[t])return r[t];var l="function"==typeof i[a]&&i[a];if(!n&&l)return l(t,!0);if(o)return o(t,!0);if(d&&"string"==typeof t)return d(t);var u=Error("Cannot find module '"+t+"'");throw u.code="MODULE_NOT_FOUND",u}f.resolve=function(n){var a=e[t][1][n];return null!=a?a:n},f.cache={};var p=s[t]=new c.Module(t);e[t][0].call(p.exports,f,p,p.exports,i)}return s[t].exports;function f(e){var t=f.resolve(e);if(!1===t)return{};if(Array.isArray(t)){var n={__esModule:!0};return t.forEach(function(e){var t=e[0],a=e[1],r=e[2]||e[0],i=c(a);"*"===t?Object.keys(i).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:function(){return i[e]}})}):"*"===r?Object.defineProperty(n,t,{enumerable:!0,value:i}):Object.defineProperty(n,t,{enumerable:!0,get:function(){return"default"===r?i.__esModule?i.default:i:i[r]}})}),n}return c(t)}}c.isParcelRequire=!0,c.Module=function(e){this.id=e,this.bundle=c,this.require=d,this.exports={}},c.modules=e,c.cache=s,c.parent=o,c.distDir=void 0,c.publicUrl=void 0,c.devServer=void 0,c.i=l,c.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(c,"root",{get:function(){return i[a]}}),i[a]=c;for(var u=0;u<t.length;u++)c(t[u]);if(n){var p=c(n);"object"==typeof exports&&"u">typeof module?module.exports=p:"function"==typeof define&&define.amd&&define(function(){return p})}}({"8RSWf":[function(e,t,n,a){var r=e("./store"),i=e("./ui"),o=e("./overlay"),l=e("./api");if(!r.IS_DUPLICATE){(0,i.setToolbarCallbacks)({requestRedraw:o.requestRedraw,requestSync:o.requestSync,syncOverlayInteractivity:o.syncOverlayInteractivity,ensureOverlay:o.ensureOverlay,doUndo:l.doUndo,doRedo:l.doRedo,clearSlide:l.clearSlide,transferToNearestQuiz:l.transferToNearestQuiz,recognizeLatestAnnotationText:l.recognizeLatestAnnotationText,submitOcrTextToNearestQuiz:l.submitOcrTextToNearestQuiz,isOcrAvailable:l.isOcrAvailable,startDgsPlacementMode:o.startDgsPlacementMode}),(0,i.setGetVisibleMainHost)(o.getVisibleMainHost),(0,o.setOverlayCallbacks)({submitMarkedRect:l.transferToNearestQuiz,shouldPromptDgsInsert:l.shouldPromptDgsInsert}),(0,i.ensureCss)(),(0,i.applyThemeVars)(),(0,i.ensureToolbar)(),(0,r.ensureSlide)((0,r.getSlideKey)()),(0,o.ensureOverlay)(),(0,i.syncToolbarPosition)(),(0,i.updateToolbar)(),(0,l.registerGlobalApi)(),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},0),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},80),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},250),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},700),window.addEventListener("resize",function(){(0,i.applyThemeVars)(),(0,i.ensureToolbar)(),(0,o.requestSync)()}),window.addEventListener("hashchange",function(){(0,o.exitQuizPickingMode)(),(0,o.clearMarkedRect)(),r.STORE.ui.ocrBusy=!1,r.STORE.ui.ocrDraft="",r.STORE.ui.ocrFailed=!1,(0,r.ensureSlide)((0,r.getSlideKey)()),(0,o.ensureOverlay)(),(0,i.updateToolbar)(),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},40),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},180),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},500)}),window.addEventListener("scroll",function(){(0,o.requestSync)()},!0),document.addEventListener("input",function(){(0,o.requestSync)()},!0),document.addEventListener("change",function(){(0,o.requestSync)()},!0);let e=new MutationObserver(function(){(0,i.applyThemeVars)(),(0,i.updateToolbar)(),(0,o.requestRedraw)()});try{e.observe(document.documentElement,{attributes:!0,attributeFilter:["class","style"]})}catch(e){}let t=(0,l.isOcrAvailable)(),n=window.setInterval(function(){let e=(0,l.isOcrAvailable)();e!==t&&(t=e,(0,i.updateToolbar)())},1200);window.addEventListener("pagehide",function(){window.clearInterval(n)})}},{"./store":"cswaT","./ui":"7Wjmu","./overlay":"8rPw4","./api":"bH1QJ"}],cswaT:[function(e,t,n,a){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"ROOT",()=>i),r.export(n,"DOC_ID",()=>o),r.export(n,"IS_DUPLICATE",()=>c),r.export(n,"STORE",()=>u),r.export(n,"STATE",()=>p),r.export(n,"clamp",()=>f),r.export(n,"copyJson",()=>h),r.export(n,"parseRgbNoRegex",()=>g),r.export(n,"luminance",()=>m),r.export(n,"getViewportWidth",()=>y),r.export(n,"getCurrentHash",()=>b),r.export(n,"getSlideKey",()=>x),r.export(n,"ensureSlide",()=>T),r.export(n,"currentSlide",()=>v),r.export(n,"toRel",()=>S),r.export(n,"fromRel",()=>w),r.export(n,"isReadOnly",()=>E),r.export(n,"effectiveMode",()=>A),r.export(n,"getLineWidthPx",()=>M);let i=function(){let e=window;try{for(;e.parent&&e.parent!==e;)e=e.parent}catch(e){}return e}(),o=document.baseURI||location.href||"doc",l="__LIA_ANNOTATION_REG_V8__",s="__LIA_ANNOTATION_STORE_V8__";i[l]=i[l]||{docs:{}};let d=i[l],c=!!d.docs[o];d.docs[o]=!0,i[s]=i[s]||{slides:{},ui:{mode:"cursor",visible:!0,panelOpen:!1,panelMode:"pen",color:"#ff0000",width:3,alpha:1,eraserWidth:18,ocrBusy:!1,ocrDraft:"",ocrFailed:!1,forcedReadOnly:null}};let u=i[s];"boolean"!=typeof u.ui.ocrBusy&&(u.ui.ocrBusy=!1),"string"!=typeof u.ui.ocrDraft&&(u.ui.ocrDraft=""),"boolean"!=typeof u.ui.ocrFailed&&(u.ui.ocrFailed=!1);let p={host:null,shell:null,canvas:null,ctx:null,slideKey:null,cssW:0,cssH:0,dpr:window.devicePixelRatio||1,drawing:!1,activePath:null,syncRAF:0,redrawRAF:0,resizeObserver:null,toolbar:null,eraserRing:null,lastPointer:{x:0,y:0,inside:!1,pointerType:""}};function f(e,t,n){return Math.max(t,Math.min(n,e))}function h(e){try{return JSON.parse(JSON.stringify(e))}catch(e){return null}}function g(e){let t=String(e||""),n=t.indexOf("("),a=t.indexOf(")");if(n<0||a<0)return null;let r=t.slice(n+1,a).split(",").map(e=>Number(String(e).trim()));return!(r.length<3)&&isFinite(r[0])&&isFinite(r[1])&&isFinite(r[2])?[r[0],r[1],r[2]]:null}function m(e){let t=e.map(e=>e/255).map(e=>e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4));return .2126*t[0]+.7152*t[1]+.0722*t[2]}function y(){return Math.max(1,window.innerWidth||0,document.documentElement&&document.documentElement.clientWidth||0)}function b(){return String(location.hash||"").trim()||"#1"}function x(){return b()}function T(e){return u.slides[e]=u.slides[e]||{items:[],redo:[],widgets:[]},Array.isArray(u.slides[e].widgets)||(u.slides[e].widgets=[]),u.slides[e]}function v(){return T(x())}function S(e,t){return{x:p.cssW>0?e/p.cssW:0,y:p.cssH>0?t/p.cssH:0}}function w(e){return{x:e&&isFinite(e.x)?e.x*p.cssW:0,y:e&&isFinite(e.y)?e.y*p.cssH:0}}function E(){if(!0===u.ui.forcedReadOnly)return!0;if(!1===u.ui.forcedReadOnly)return!1;let e=document.body;return!!e&&(e.classList.contains("lia-snapshot-mode")||e.classList.contains("lia-shared-freeze-link")||e.classList.contains("lia-freeze-mode"))}function A(){return!u.ui.visible||E()?"cursor":u.ui.mode||"cursor"}function M(e){let t=Math.max(1,Number(e&&e.baseW)||p.cssW||1);return Math.max(.75,Math.max(1,p.cssW||1)/t*Math.max(.75,Number(e&&e.width)||1))}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],k3151:[function(e,t,n,a){n.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},n.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.exportAll=function(e,t){return Object.keys(e).forEach(function(n){"default"===n||"__esModule"===n||Object.prototype.hasOwnProperty.call(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:function(){return e[n]}})}),t},n.export=function(e,t,n){Object.defineProperty(e,t,{enumerable:!0,get:n})}},{}],"7Wjmu":[function(e,t,n,a){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"getThemeAccent",()=>l),r.export(n,"applyThemeVars",()=>s),r.export(n,"ensureCss",()=>d),r.export(n,"iconEye",()=>c),r.export(n,"hideEraserRing",()=>u),r.export(n,"updateEraserRing",()=>p),r.export(n,"refreshEraserRing",()=>f),r.export(n,"tUi",()=>x),r.export(n,"setToolbarCallbacks",()=>w),r.export(n,"ensureToolbar",()=>E),r.export(n,"updateToolbar",()=>A),r.export(n,"syncToolbarPosition",()=>M),r.export(n,"setGetVisibleMainHost",()=>O);var i=e("./store"),o=e("./styles");function l(){try{let e=document.querySelector(".lia-btn");if(e){let t=getComputedStyle(e).backgroundColor;if(t&&"transparent"!==t&&"rgba(0, 0, 0, 0)"!==t)return t}let t=document.createElement("button");t.className="lia-btn",t.type="button",t.textContent="x",t.style.position="absolute",t.style.left="-9999px",t.style.top="-9999px",t.style.visibility="hidden",(document.body||document.documentElement).appendChild(t);let n=getComputedStyle(t).backgroundColor;if(t.remove(),n&&"transparent"!==n&&"rgba(0, 0, 0, 0)"!==n)return n}catch(e){}return null}function s(){try{let e=document.documentElement,t=getComputedStyle(document.body||document.documentElement).backgroundColor||getComputedStyle(document.documentElement).backgroundColor,n=(0,i.parseRgbNoRegex)(t),a=!!n&&.5>(0,i.luminance)(n);e.style.setProperty("--lia-annot-border",a?"#fff":"#000"),e.style.setProperty("--lia-annot-fg",a?"#fff":"#000");let r=l();r&&e.style.setProperty("--lia-annot-accent",r),a?(e.style.setProperty("--lia-annot-bg","rgba(28,28,28,0.96)"),e.style.setProperty("--lia-annot-panel-bg","rgba(34,34,34,0.97)")):(e.style.setProperty("--lia-annot-bg","rgba(255,255,255,0.96)"),e.style.setProperty("--lia-annot-panel-bg","rgba(255,255,255,0.97)"))}catch(e){}}function d(){if(document.getElementById("__lia_annotation_css_v8"))return;let e=document.createElement("style");e.id="__lia_annotation_css_v8",e.textContent=o.CSS,(document.head||document.documentElement).appendChild(e)}function c(e){return e?`<svg viewBox="0 0 24 24" aria-hidden="true">
      <path class="ico-stroke" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/>
      <circle cx="12" cy="12" r="3.2" class="ico-stroke"></circle>
    </svg>`:`<svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M3 3l18 18"/>
    <path class="ico-stroke" d="M2.5 12s3.5-6 9.5-6c1.8 0 3.3.5 4.6 1.2"/>
    <path class="ico-stroke" d="M21.5 12s-3.5 6-9.5 6c-1.8 0-3.4-.5-4.8-1.3"/>
  </svg>`}function u(){i.STATE.eraserRing&&(i.STATE.eraserRing.dataset.on="0")}function p(e,t){if(!i.STATE.eraserRing)return;if(!i.STORE.ui.visible||(0,i.isReadOnly)()||"eraser"!==(0,i.effectiveMode)()||!isFinite(e)||!isFinite(t)||!isFinite(i.STATE.cssW)||!isFinite(i.STATE.cssH))return void u();let n=Math.max(8,Number(i.STORE.ui.eraserWidth||18));i.STATE.eraserRing.style.width=n+"px",i.STATE.eraserRing.style.height=n+"px",i.STATE.eraserRing.style.left=(0,i.clamp)(e,0,i.STATE.cssW)+"px",i.STATE.eraserRing.style.top=(0,i.clamp)(t,0,i.STATE.cssH)+"px",i.STATE.eraserRing.dataset.on="1"}function f(){i.STATE.lastPointer&&i.STATE.lastPointer.inside?p(i.STATE.lastPointer.x,i.STATE.lastPointer.y):u()}let h={colors:{en:"Colors",de:"Farben",es:"Colores",fr:"Couleurs"},penWidth:{en:"Pen Width",de:"Stiftbreite",es:"Grosor del lápiz",fr:"Épaisseur du stylo"},opacity:{en:"Opacity",de:"Deckkraft",es:"Opacidad",fr:"Opacité"},eraser:{en:"Eraser",de:"Radierer",es:"Borrador",fr:"Gomme"},clearAll:{en:"Clear all",de:"Alles löschen",es:"Borrar todo",fr:"Tout effacer"},ocrTransfer:{en:"Submit as solution",de:"Als Lösung übernehmen",es:"Enviar como solucion",fr:"Soumettre comme solution"},rectSubmit:{en:"Submit as Solution",de:"Als Lösung übernehmen",es:"Enviar como solucion",fr:"Soumettre comme solution"},rectChooseQuiz:{en:"Choose Quiz",de:"Quiz wählen",es:"Elegir quiz",fr:"Choisir quiz"},rectChooseCancel:{en:"Cancel",de:"Abbrechen",es:"Cancelar",fr:"Annuler"},rectChosenFallback:{en:"Quiz",de:"Quiz",es:"Quiz",fr:"Quiz"},rectClearAria:{en:"Clear marked rectangle",de:"Markiertes Rechteck löschen",es:"Borrar rectangulo marcado",fr:"Effacer le rectangle marqué"},ocrRecognize:{en:"Recognize",de:"Erkennen",es:"Reconocer",fr:"Reconnaître"},ocrSubmit:{en:"Insert into quiz",de:"In Quizfeld einsetzen",es:"Insertar en quiz",fr:"Insérer dans le quiz"},ocrResult:{en:"OCR Result",de:"OCR Ergebnis",es:"Resultado OCR",fr:"Résultat OCR"},ocrHint:{en:"Preview updates automatically as TeX.",de:"Vorschau aktualisiert sich automatisch als TeX.",es:"La vista previa se actualiza automaticamente como TeX.",fr:"L'aperçu se met automatiquement à jour en TeX."},ocrFailed:{en:"Recognition failed. Try drawing more clearly.",de:"Erkennung fehlgeschlagen. Bitte deutlicher schreiben.",es:"Reconocimiento fallido. Intente escribir más claro.",fr:"Reconnaissance échouée. Essayez d'écrire plus clairement."},penWidthAria:{en:"Pen width",de:"Stiftbreite",es:"Grosor del lápiz",fr:"Épaisseur du stylo"},opacityAria:{en:"Opacity",de:"Deckkraft",es:"Opacidad",fr:"Opacité"},eraserWidthAria:{en:"Eraser width",de:"Radierergröße",es:"Tamaño del borrador",fr:"Taille de la gomme"},colorAria:{en:"Color",de:"Farbe",es:"Color",fr:"Couleur"},readOnlyNote:{en:"Freeze/read-only mode: drawing is locked, show/hide still works.",de:"Freeze-/Nur-Lese-Modus: Zeichnen ist gesperrt, Anzeigen/Ausblenden funktioniert weiter.",es:"Modo congelado/solo lectura: dibujar está bloqueado, mostrar/ocultar sigue funcionando.",fr:"Mode figé/lecture seule: dessin verrouillé, afficher/masquer fonctionne encore."}};function g(e){if(!e)return null;let t=String(e).trim().toLowerCase().replace(/_/g,"-");if(!t)return null;let n=t.split("-")[0];return"de"===n||"es"===n||"en"===n||"fr"===n?n:null}let m=null;function y(){if(m)return m;try{let e,t,n=new URLSearchParams(String(location.search||"")),a=g(n.get("language")||n.get("lang"));if(a)return m=a;let r=new URLSearchParams((t=(e=String(location.hash||"")).indexOf("?"))>=0?e.slice(t+1):""),i=g(r.get("language")||r.get("lang"));if(i)return m=i;let o=g(document.documentElement&&document.documentElement.lang);if(o)return m=o;let l=g(document.body&&(document.body.getAttribute("lang")||document.body.getAttribute("data-language")));if(l)return m=l;let s=g(navigator&&(navigator.language||navigator.languages&&navigator.languages[0])||"");if(s)return m=s}catch(e){}return m="en"}function b(e,t){let n=h[t];return n&&n[e]||n.en}function x(e,t){return b(t||y(),e)}let T=null;function v(e){if(!e)return;let t=e.querySelector(".lia-annot-ocr-preview"),n=e.querySelector('[data-k="ocrPreview"]');if(!t||!n)return;let a=String(i.STORE.ui.ocrDraft||"").trim();if(!a){t.dataset.on="0",n.textContent="";return}t.dataset.on="1",function(e,t){let n,a,r,i=String(t||"").trim();if(e.innerHTML="",!i)return;let o=window,l=window.top,s=o.katex||l&&l.katex||o.KaTeX||l&&l.KaTeX;try{if(s&&"function"==typeof s.render)return void s.render(i,e,{throwOnError:!1,displayMode:!1})}catch(e){}e.textContent=i,(n=window,a=window.top,(r=n.katex||a&&a.katex||n.KaTeX||a&&a.KaTeX)&&"function"==typeof r.render?Promise.resolve(r):T||(T=async function(){if(!document.getElementById("__lia_annot_katex_css_v1")){let e=document.createElement("link");e.id="__lia_annot_katex_css_v1",e.rel="stylesheet",e.href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",(document.head||document.documentElement).appendChild(e)}let e=await Function("u","return import(u)")("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.mjs"),t=e.default||e;if(!t||"function"!=typeof t.render)throw Error("KaTeX render not available");try{n.katex||(n.katex=t)}catch(e){}try{a&&!a.katex&&(a.katex=t)}catch(e){}return t}())).then(function(t){if(e.isConnected){e.innerHTML="";try{t.render(i,e,{throwOnError:!1,displayMode:!1})}catch(t){e.textContent=i}}}).catch(function(){e.isConnected&&(e.textContent=i)})}(n,a)}let S=null;function w(e){S=e}function E(){if(i.STATE.toolbar&&i.STATE.toolbar.isConnected)return i.STATE.toolbar;let e=document.createElement("div");return e.className="lia-annot-toolbar",e.setAttribute("data-snapshot-admin","1"),e.innerHTML=`
    <div class="lia-annot-actions" role="toolbar" aria-label="Annotation tools">
      <button class="lia-annot-btn" type="button" data-act="cursor" aria-label="Cursor" aria-pressed="false" title="Cursor" data-snapshot-admin="1"><svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M5 3.5l8.8 10.8-4.1 1 1.9 5.4-2.6 1-1.9-5.4-3.9 2.2L5 3.5z" fill="none" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="pen" aria-label="Pen" aria-pressed="false" title="Pen" data-snapshot-admin="1"><svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M4 20h4l10.2-10.2a2.2 2.2 0 0 0 0-3.1l-1.1-1.1a2.2 2.2 0 0 0-3.1 0L3.8 15.8 3 21z" fill="none" stroke-width="1.8" stroke-linejoin="round"/>
    <path class="ico-stroke" d="M13.2 6.8l4 4" fill="none" stroke-width="1.8" stroke-linecap="round"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="eraser" aria-label="Eraser" aria-pressed="false" title="Eraser" data-snapshot-admin="1"><svg viewBox="-4 4 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M4 16.5l8.6-8.6a2 2 0 0 1 2.8 0l4.1 4.1a2 2 0 0 1 0 2.8L12.8 23H7.6L4 19.4a2 2 0 0 1 0-2.9z" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="ico-stroke" d="M8 23h8" fill="none" stroke-width="2" stroke-linecap="round"/>
    <path class="ico-stroke" d="M9.2 14.3l6.5 6.5" fill="none" stroke-width="2" stroke-linecap="round"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="undo" aria-label="Undo" title="Undo" data-snapshot-admin="1"><svg viewBox="-4 0 24 24" aria-hidden="true">
    <path d="M21 8H10.2V4L2 12l8.2 8v-4H21V8z" fill="var(--lia-annot-fg)"/>
    <rect x="10.2" y="10.6" width="10.8" height="2.8" rx="1.4" fill="var(--lia-annot-fg)"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="redo" aria-label="Redo" title="Redo" data-snapshot-admin="1"><svg viewBox="-4 0 24 24" aria-hidden="true">
    <path d="M3 8h10.8V4l8.2 8-8.2 8v-4H3V8z" fill="var(--lia-annot-fg)"/>
    <rect x="3" y="10.6" width="10.8" height="2.8" rx="1.4" fill="var(--lia-annot-fg)"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="dgs-place" aria-label="Place coordinate system" title="Place coordinate system" data-snapshot-admin="1"><svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M3.5 12h16.2" stroke-width="1.8" stroke-linecap="round"/>
    <path class="ico-stroke" d="M12 20.5V4.3" stroke-width="1.8" stroke-linecap="round"/>
    <path class="ico-stroke" d="M19.7 12l-2.1-1.2m2.1 1.2-2.1 1.2" stroke-width="1.8" stroke-linecap="round"/>
    <path class="ico-stroke" d="M12 4.3l-1.2 2.1m1.2-2.1 1.2 2.1" stroke-width="1.8" stroke-linecap="round"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="ocr-transfer" aria-label="Submit as solution" title="Submit as solution" data-snapshot-admin="1"><svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" d="M4.1 4.6 H19.2 Q20.9 4.6 20.9 6.3 V16.0 M17.2 19.8 H4.1 Q2.4 19.8 2.4 18.1 V6.3 Q2.4 4.6 4.1 4.6"/>
    <path class="ico-stroke" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" d="M5.2 12.7l1.9 1.9 4.0-4.8"/>
    <path class="ico-stroke" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" d="M13.8 9.9c0-2.2 4.8-2.2 4.8 0 0 1.6-2.4 1.8-2.4 3.6"/>
    <circle cx="16.2" cy="16.6" r="0.92" class="ico-fill"/>
    <path class="ico-stroke" stroke-width="1.4" stroke-linecap="round" d="M19.4 19.0H24.0 M21.7 16.7V21.3"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="toggle" aria-label="Show/hide annotations" aria-pressed="true" title="Show/hide annotations" data-snapshot-admin="1">${c(!0)}</button>
    </div>
    <div class="lia-annot-panel" data-open="0"></div>
  `,(document.body||document.documentElement).appendChild(e),e.addEventListener("click",function(e){let t=e.target,n=t&&t.closest?t.closest("button[data-act]"):null,a=t&&t.closest?t.closest("button[data-color]"):null;if(a){if(e.preventDefault(),e.stopPropagation(),(0,i.isReadOnly)())return;i.STORE.ui.color=String(a.getAttribute("data-color")||"#ff0000"),A(),S?.requestRedraw();return}if(!n)return;e.preventDefault(),e.stopPropagation();let r=String(n.getAttribute("data-act")||"");if("toggle"===r){S?.ensureOverlay(),i.STORE.ui.visible=!i.STORE.ui.visible,S?.syncOverlayInteractivity(),A(),S?.requestRedraw(),S?.requestSync();return}if("cursor"===r){i.STORE.ui.mode="cursor",i.STORE.ui.panelOpen=!1,S?.syncOverlayInteractivity(),A();return}if("pen"===r){if((0,i.isReadOnly)())return;let e="pen"===i.STORE.ui.mode&&"pen"===i.STORE.ui.panelMode&&i.STORE.ui.panelOpen;i.STORE.ui.mode="pen",i.STORE.ui.panelMode="pen",i.STORE.ui.panelOpen=!e,S?.syncOverlayInteractivity(),A();return}if("eraser"===r){if((0,i.isReadOnly)())return;let e="eraser"===i.STORE.ui.mode&&"eraser"===i.STORE.ui.panelMode&&i.STORE.ui.panelOpen;i.STORE.ui.mode="eraser",i.STORE.ui.panelMode="eraser",i.STORE.ui.panelOpen=!e,S?.syncOverlayInteractivity(),A();return}if("undo"===r){if((0,i.isReadOnly)())return;S?.doUndo();return}if("redo"===r){if((0,i.isReadOnly)())return;S?.doRedo();return}if("clear"===r){if((0,i.isReadOnly)())return;S?.clearSlide();return}if("ocr-transfer"===r){if((0,i.isReadOnly)()||!i.STORE.ui.visible||!S?.isOcrAvailable())return;i.STORE.ui.panelOpen=!1,i.STORE.ui.mode="rect",S?.syncOverlayInteractivity(),A();return}if("dgs-place"===r){if((0,i.isReadOnly)()||!i.STORE.ui.visible||!S?.startDgsPlacementMode)return;i.STORE.ui.panelOpen=!1,S.startDgsPlacementMode(),A();return}if("ocr-recognize"===r){if((0,i.isReadOnly)()||i.STORE.ui.ocrBusy||!i.STORE.ui.visible||!S||!S.isOcrAvailable()||!S.recognizeLatestAnnotationText)return;i.STORE.ui.ocrFailed=!1,S.recognizeLatestAnnotationText().then(function(e){"string"==typeof e&&e.trim()?(i.STORE.ui.ocrDraft=e,i.STORE.ui.ocrFailed=!1):i.STORE.ui.ocrFailed=!0,A(),S?.requestSync()});return}if("ocr-submit"===r){if((0,i.isReadOnly)()||i.STORE.ui.ocrBusy||!S?.submitOcrTextToNearestQuiz)return;S.submitOcrTextToNearestQuiz(String(i.STORE.ui.ocrDraft||"")),S.requestSync(),A();return}},!0),e.addEventListener("input",function(t){let n=t.target;if(!(n instanceof HTMLElement))return;let a=String(n.getAttribute("data-act")||"");if(!(0,i.isReadOnly)()){if("width"===a){i.STORE.ui.width=(0,i.clamp)(Number(n.value),1,24),A();return}if("alpha"===a){i.STORE.ui.alpha=(0,i.clamp)(Number(n.value),.1,1),A();return}if("eraserWidth"===a){i.STORE.ui.eraserWidth=(0,i.clamp)(Number(n.value),4,80),A();return}if("ocr-input"===a){i.STORE.ui.ocrDraft=String(n.value||""),v(e.querySelector(".lia-annot-panel"));return}}},!0),i.STATE.toolbar=e,e}function A(){let e=E(),t=(0,i.currentSlide)(),n=(0,i.isReadOnly)(),a=y(),r=e.querySelector(".lia-annot-panel");if(r){let e=i.STORE.ui.panelOpen&&!n?"1":"0",t="eraser"===i.STORE.ui.panelMode?"eraser":"ocr"===i.STORE.ui.panelMode?"ocr":"pen",o=String(r.dataset.builtMode||""),l=String(r.dataset.builtRo||""),s=String(r.dataset.builtLang||"");if(r.dataset.open=e,!r.firstElementChild||o!==t||l!==String(+!!n)||s!==a){if("eraser"===t)r.innerHTML=`
    <div class="lia-annot-row">
      <span class="k">${b(a,"eraser")}</span>
      <input class="lia-annot-slider" type="range" min="4" max="80" step="1" value="${i.STORE.ui.eraserWidth}" data-act="eraserWidth" aria-label="${b(a,"eraserWidthAria")}" data-snapshot-admin="1">
      <span class="v" data-k="eraserWidth">${i.STORE.ui.eraserWidth}</span>
    </div>
    <div class="lia-annot-row">
      <button class="lia-annot-danger" type="button" data-act="clear" data-snapshot-admin="1">${b(a,"clearAll")}</button>
    </div>
    <div class="lia-annot-note" data-k="note"></div>
  `;else if("ocr"===t)r.innerHTML=`
    <div class="lia-annot-row lia-annot-row--ocr-title">
      <span class="k">${b(a,"ocrResult")}</span>
    </div>
    <div class="lia-annot-row lia-annot-row--ocr-input">
      <textarea class="lia-annot-ocr-input" data-act="ocr-input" rows="3" data-snapshot-admin="1"></textarea>
    </div>
    <div class="lia-annot-row lia-annot-row--ocr-actions">
      <button class="lia-annot-primary" type="button" data-act="ocr-recognize" data-snapshot-admin="1">${b(a,"ocrRecognize")}</button>
      <button class="lia-annot-primary" type="button" data-act="ocr-submit" data-snapshot-admin="1">${b(a,"ocrSubmit")}</button>
    </div>
    <div class="lia-annot-ocr-preview" data-on="0">
      <div class="lia-annot-ocr-preview-math" data-k="ocrPreview"></div>
    </div>
    <div class="lia-annot-note" data-k="ocrHint">${b(a,"ocrHint")}</div>
    <div class="lia-annot-note" data-k="note"></div>
  `;else{let e;e=["#ff0000","#ff7500","#ffff00","#ff00ff","#0055ff","#00ffff","#00ff00","#007500","#000000","#ffffff"].map(function(e){return'<button class="lia-annot-color-item" type="button" data-color="'+e+'" aria-label="'+b(a,"colorAria")+" "+e+'" data-snapshot-admin="1" style="background:'+e+';"></button>'}).join(""),r.innerHTML=`
    <div class="lia-annot-row">
      <span class="k">${b(a,"colors")}</span>
      <span class="lia-annot-color-grid">${e}</span>
    </div>
    <div class="lia-annot-row">
      <span class="k">${b(a,"penWidth")}</span>
      <input class="lia-annot-slider" type="range" min="1" max="24" step="1" value="${i.STORE.ui.width}" data-act="width" aria-label="${b(a,"penWidthAria")}" data-snapshot-admin="1">
      <span class="v" data-k="width">${i.STORE.ui.width}</span>
    </div>
    <div class="lia-annot-row">
      <span class="k">${b(a,"opacity")}</span>
      <input class="lia-annot-slider" type="range" min="0.1" max="1" step="0.05" value="${i.STORE.ui.alpha}" data-act="alpha" aria-label="${b(a,"opacityAria")}" data-snapshot-admin="1">
      <span class="v" data-k="alpha">${Math.round(100*Number(i.STORE.ui.alpha||1))}%</span>
    </div>
    <div class="lia-annot-note" data-k="note"></div>
  `}if(r.dataset.builtMode=t,r.dataset.builtRo=String(+!!n),r.dataset.builtLang=a,"ocr"===t){let e=r.querySelector(".lia-annot-ocr-input");e&&(e.value=String(i.STORE.ui.ocrDraft||""))}}"ocr"===t&&v(r)}let o=r?r.querySelector('[data-k="note"]'):null;o&&(o.textContent=n?b(a,"readOnlyNote"):"");let l=e.querySelectorAll(".lia-annot-btn[data-act]"),s=!!S?.isOcrAvailable&&S.isOcrAvailable();if(s||"rect"!==i.STORE.ui.mode||(i.STORE.ui.mode="cursor"),l.forEach(function(e){let r=String(e.getAttribute("data-act")||"");e.dataset.active="0",e.dataset.busy="0","cursor"===r&&"cursor"===i.STORE.ui.mode&&(e.dataset.active="1"),"pen"===r&&"pen"===i.STORE.ui.mode&&(e.dataset.active="1"),"eraser"===r&&"eraser"===i.STORE.ui.mode&&(e.dataset.active="1"),"ocr-transfer"===r&&"rect"===i.STORE.ui.mode&&(e.dataset.active="1"),"toggle"===r&&(e.dataset.active=i.STORE.ui.visible?"1":"0",e.innerHTML=c(!!i.STORE.ui.visible)),("cursor"===r||"pen"===r||"eraser"===r||"toggle"===r)&&e.setAttribute("aria-pressed","1"===e.dataset.active?"true":"false"),"undo"===r?e.disabled=n||0===t.items.length:"redo"===r?e.disabled=n||0===t.redo.length:"dgs-place"===r?e.disabled=n||!i.STORE.ui.visible:"ocr-transfer"===r?(e.disabled=n||!i.STORE.ui.visible||i.STORE.ui.ocrBusy||!s,e.hidden=!s,e.style.display=s?"":"none",e.dataset.busy=i.STORE.ui.ocrBusy?"1":"0",e.title=b(a,"ocrTransfer"),e.setAttribute("aria-label",b(a,"ocrTransfer"))):"pen"===r||"eraser"===r?e.disabled=n:e.disabled=!1}),r){r.querySelectorAll(".lia-annot-color-item").forEach(function(e){let t=String(e.getAttribute("data-color")||"");e.dataset.active=t===String(i.STORE.ui.color||"")?"1":"0",e.disabled=n});let e=r.querySelector('.lia-annot-danger[data-act="clear"]');e&&(e.disabled=n||0===t.items.length);let o=r.querySelector('input[data-act="width"]'),l=r.querySelector('input[data-act="alpha"]'),d=r.querySelector('input[data-act="eraserWidth"]'),c=r.querySelector('textarea[data-act="ocr-input"]'),u=r.querySelector('button[data-act="ocr-recognize"]'),p=r.querySelector('button[data-act="ocr-submit"]'),f=r.querySelector('[data-k="width"]'),h=r.querySelector('[data-k="alpha"]'),g=r.querySelector('[data-k="eraserWidth"]');o&&document.activeElement!==o&&(o.value=String(i.STORE.ui.width)),l&&document.activeElement!==l&&(l.value=String(i.STORE.ui.alpha)),d&&document.activeElement!==d&&(d.value=String(i.STORE.ui.eraserWidth)),c&&document.activeElement!==c&&(c.value=String(i.STORE.ui.ocrDraft||"")),f&&(f.textContent=String(i.STORE.ui.width)),h&&(h.textContent=Math.round(100*Number(i.STORE.ui.alpha||1))+"%"),g&&(g.textContent=String(i.STORE.ui.eraserWidth)),c&&(c.disabled=n||i.STORE.ui.ocrBusy),u&&(u.disabled=n||i.STORE.ui.ocrBusy||!s),p&&(p.disabled=n||i.STORE.ui.ocrBusy||!String(i.STORE.ui.ocrDraft||"").trim());let m=r.querySelector('[data-k="ocrHint"]');m&&(m.textContent=i.STORE.ui.ocrFailed?b(a,"ocrFailed"):b(a,"ocrHint"),m.style.color=i.STORE.ui.ocrFailed?"var(--lia-annot-danger, #c0392b)":"")}"eraser"===(0,i.effectiveMode)()&&i.STORE.ui.visible&&!n&&i.STATE.lastPointer&&i.STATE.lastPointer.inside?f():u()}function M(){let e=E(),t=R();if(!e||!t)return;let n=(0,i.getViewportWidth)(),a=Math.ceil(e.getBoundingClientRect().width||e.offsetWidth||44),r=Math.round((t.closest(".lia-slide__container")||t.parentElement||t).getBoundingClientRect().left+8);r=Math.min(r=Math.max(8,r),Math.max(8,n-a-8)),e.style.left=r+"px"}let R=()=>document.body||document.documentElement;function O(e){R=e}},{"./store":"cswaT","@parcel/transformer-js/src/esmodule-helpers.js":"k3151","./styles":"86IFJ"}],"86IFJ":[function(e,t,n,a){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"CSS",()=>i);let i=`
  :root {
    --lia-annot-border: rgba(0,0,0,0.12);
    --lia-annot-fg: #1a1a1a;
    --lia-annot-accent: #3b82f6;
    --lia-annot-bg: rgba(255,255,255,0.92);
    --lia-annot-panel-bg: rgba(255,255,255,0.97);
    --lia-annot-hover-bg: rgba(0,0,0,0.06);
    --lia-annot-shadow: 0 4px 24px rgba(0,0,0,0.13), 0 1.5px 6px rgba(0,0,0,0.07);
    --lia-annot-panel-shadow: 0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07);
  }

  /* ---- Toolbar shell ---- */

  .lia-annot-toolbar {
    position: fixed;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10030;
    display: inline-flex;
    flex-direction: column;
    gap: 0;
    padding: 6px 5px;
    margin: 0;
    box-sizing: border-box;
    border: 1px solid var(--lia-annot-border);
    border-radius: 16px;
    background: var(--lia-annot-bg);
    backdrop-filter: blur(12px) saturate(1.4);
    box-shadow: var(--lia-annot-shadow);
    font-size: 14px;
  }

  .lia-annot-actions {
    display: inline-flex;
    flex-direction: column;
    gap: 2px;
    align-items: center;
  }

  /* ---- Toolbar buttons ---- */

  .lia-annot-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    position: relative;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: var(--lia-annot-fg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    line-height: 0;
    transition: background 0.15s, color 0.15s, transform 0.1s;
  }

  .lia-annot-btn:hover:not([disabled]) {
    background: var(--lia-annot-hover-bg);
  }

  .lia-annot-btn:active:not([disabled]) {
    transform: scale(0.92);
  }

  .lia-annot-btn[data-active="1"] {
    background: var(--lia-annot-accent);
    color: #fff;
  }

  .lia-annot-btn[data-active="1"] .ico-stroke {
    stroke: #fff;
  }

  .lia-annot-btn[data-active="1"] path,
  .lia-annot-btn[data-active="1"] rect {
    fill: #fff;
  }

  .lia-annot-btn[disabled] {
    opacity: .3;
    cursor: not-allowed;
  }

  .lia-annot-btn svg {
    width: 18px;
    height: 18px;
    display: block;
    margin: 0;
    overflow: visible;
  }

  /* Icon nudges \u{2014} each icon has slightly different optical weight */
  .lia-annot-btn[data-act="cursor"] svg { transform: translateX(4.5px); }
  .lia-annot-btn[data-act="pen"]    svg { transform: translateX(1px); }
  .lia-annot-btn[data-act="eraser"] svg { transform: translateX(-4px); }
  .lia-annot-btn[data-act="undo"]   svg { transform: translateX(-4px); }
  .lia-annot-btn[data-act="redo"]   svg { transform: translateX(-3px); }
  .lia-annot-btn[data-act="dgs-place"] svg { transform: translateX(1px); }
  .lia-annot-btn[data-act="ocr-transfer"] svg { transform: translateX(1px); }
  .lia-annot-btn[data-act="toggle"] svg { transform: translateX(1px); }

  .lia-annot-btn[data-busy="1"]::after {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 999px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-top-color: var(--lia-annot-accent);
    animation: lia-annot-spin 0.9s linear infinite;
  }

  @keyframes lia-annot-spin {
    to { transform: rotate(360deg); }
  }

  .lia-annot-btn .ico-stroke {
    stroke: var(--lia-annot-fg);
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .lia-annot-btn .ico-fill {
    fill: var(--lia-annot-fg);
  }

  /* Divider between mode buttons and action buttons */
  .lia-annot-btn[data-act="undo"] {
    margin-top: 6px;
  }
  .lia-annot-btn[data-act="undo"]::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 4px;
    right: 4px;
    height: 1px;
    background: var(--lia-annot-border);
  }

  /* ---- Settings panel ---- */

  .lia-annot-panel {
    position: absolute;
    left: 46px;
    top: 0;
    z-index: 10031;
    display: none;
    grid-template-columns: 1fr;
    gap: 12px;
    width: min(280px, calc(100vw - 70px));
    padding: 12px 14px;
    box-sizing: border-box;
    border: 1px solid var(--lia-annot-border);
    border-radius: 14px;
    background: var(--lia-annot-panel-bg);
    backdrop-filter: blur(12px) saturate(1.4);
    box-shadow: var(--lia-annot-panel-shadow);
    font-size: 14px;
  }

  .lia-annot-panel[data-open="1"] {
    display: grid;
  }

  .lia-annot-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .lia-annot-row .k {
    min-width: 6em;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: .5;
  }

  .lia-annot-row .v {
    min-width: 3em;
    text-align: right;
    font-weight: 600;
    font-size: 13px;
    opacity: .7;
  }

  .lia-annot-slider {
    flex: 1;
    min-width: 0;
    width: min(160px, 40vw);
    accent-color: var(--lia-annot-accent);
  }

  .lia-annot-color-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .lia-annot-color-item {
    width: 20px;
    height: 20px;
    border-radius: 999px;
    border: 1.5px solid rgba(0,0,0,0.15);
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    background: transparent;
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .lia-annot-color-item:hover {
    transform: scale(1.15);
  }

  .lia-annot-color-item[data-active="1"] {
    box-shadow: 0 0 0 2.5px var(--lia-annot-accent);
    transform: scale(1.15);
  }

  .lia-annot-note {
    font-weight: 500;
    opacity: .6;
    font-size: .95em;
  }

  .lia-annot-danger {
    width: auto;
    min-height: 28px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid rgba(220,50,50,0.35);
    background: rgba(220,50,50,0.07);
    color: #c0392b;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .lia-annot-danger:hover {
    background: rgba(220,50,50,0.14);
  }

  .lia-annot-primary {
    width: auto;
    min-height: 30px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--lia-annot-border);
    background: var(--lia-annot-accent);
    color: #fff;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .lia-annot-primary:disabled {
    opacity: .45;
    cursor: not-allowed;
  }

  .lia-annot-row--ocr-title .k {
    min-width: auto;
  }

  .lia-annot-row--ocr-input,
  .lia-annot-row--ocr-actions {
    align-items: stretch;
  }

  .lia-annot-row--ocr-actions {
    gap: 8px;
  }

  .lia-annot-ocr-input {
    width: 100%;
    min-height: 72px;
    border: 1px solid var(--lia-annot-border);
    border-radius: 10px;
    padding: 8px 10px;
    box-sizing: border-box;
    resize: vertical;
    font: inherit;
    color: var(--lia-annot-fg);
    background: rgba(255, 255, 255, 0.78);
  }

  .lia-annot-ocr-preview {
    display: none;
    align-items: center;
    min-height: 38px;
    width: 100%;
    border: 1px dashed var(--lia-annot-border);
    border-radius: 10px;
    padding: 8px 10px;
    box-sizing: border-box;
    overflow-x: auto;
  }

  .lia-annot-ocr-preview[data-on="1"] {
    display: flex;
  }

  .lia-annot-ocr-preview-math {
    width: 100%;
    line-height: 1.3;
  }

  .lia-annot-tex-preview {
    display: none;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    max-width: 100%;
    min-height: 34px;
    padding: 6px 10px;
    box-sizing: border-box;
    border: 2px solid var(--lia-annot-tex-preview-border, var(--lia-annot-accent));
    border-radius: 999px;
    background: transparent;
    cursor: text;
  }

  .lia-annot-tex-preview[data-on="1"] {
    display: inline-flex;
  }

  .lia-annot-tex-preview-math {
    max-width: 100%;
    overflow-x: auto;
  }

  .lia-annot-tex-preview-hint {
    font-size: 11px;
    font-weight: 600;
    opacity: .58;
    white-space: nowrap;
  }

  /* ---- Layout overflow guards ---- */

  html, body {
    overflow-x: hidden !important;
  }

  .lia-slide__container {
    overflow-x: hidden !important;
  }

  /* ---- Annotation overlay ---- */

  .lia-annot-host {
    position: relative !important;
    overflow-x: clip !important;
    overflow-y: visible !important;
  }

  .lia-annot-shell {
    position: absolute;
    top: 0;
    z-index: 500;
    background: transparent;
    pointer-events: none;
  }

  .lia-annot-shell[data-hidden="1"] {
    display: none;
  }

  .lia-annot-canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: block;
    background: transparent;
    pointer-events: none;
  }

  /* ---- Eraser cursor ring ---- */

  .lia-annot-eraser-ring {
    position: absolute;
    left: 0;
    top: 0;
    width: 12px;
    height: 12px;
    border-radius: 999px;
    box-sizing: border-box;
    border: 2px solid var(--lia-annot-accent);
    background: transparent;
    box-shadow: 0 0 0 1px var(--lia-annot-border);
    pointer-events: none;
    display: none;
    z-index: 501;
    transform: translate(-50%, -50%);
  }

  .lia-annot-eraser-ring[data-on="1"] {
    display: block;
  }

  /* Enable pointer events on canvas when drawing/erasing */
  .lia-annot-shell[data-mode="pen"]    .lia-annot-canvas,
  .lia-annot-shell[data-mode="eraser"] .lia-annot-canvas {
    pointer-events: auto;
  }

  .lia-annot-shell[data-mode="rect"] .lia-annot-canvas {
    pointer-events: auto;
  }

  .lia-annot-shell[data-mode="place"] .lia-annot-canvas {
    pointer-events: auto;
    cursor: crosshair;
  }

  .lia-annot-dgs-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 500;
  }

  .lia-annot-dgs-widget {
    position: relative;
    display: block;
    width: 100%;
    margin: 18px 0;
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    overflow: visible;
    pointer-events: auto;
    clear: both;
  }

  .lia-annot-dgs-board {
    position: relative;
    width: min(240px, 100%);
    height: 180px;
    background: transparent;
  }

  .lia-annot-dgs-fallback {
    width: 100%;
    height: 100%;
    display: block;
  }

  .lia-annot-dgs-fallback .axis {
    stroke: #1f2937;
    stroke-width: 2;
  }

  .lia-annot-dgs-fallback .arrow {
    fill: #1f2937;
  }

  .lia-annot-dgs-prompt {
    position: absolute;
    left: 14px;
    bottom: 14px;
    z-index: 503;
    display: none;
    width: min(280px, calc(100% - 28px));
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid var(--lia-annot-border);
    background: var(--lia-annot-panel-bg);
    box-shadow: var(--lia-annot-panel-shadow);
    pointer-events: auto;
  }

  .lia-annot-dgs-prompt[data-on="1"] {
    display: block;
  }

  .lia-annot-dgs-prompt-title {
    font-size: 12px;
    font-weight: 700;
    opacity: 0.72;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 4px;
  }

  .lia-annot-dgs-prompt-sub {
    font-size: 13px;
    margin-bottom: 8px;
  }

  .lia-annot-dgs-prompt-actions {
    display: flex;
    gap: 8px;
  }

  .lia-annot-dgs-prompt-actions button {
    border: 1px solid var(--lia-annot-border);
    border-radius: 8px;
    min-height: 28px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .lia-annot-dgs-yes {
    background: var(--lia-annot-accent);
    color: #fff;
  }

  .lia-annot-dgs-no {
    background: var(--lia-annot-panel-bg);
    color: var(--lia-annot-fg);
  }

  .lia-annot-dgs-crosshair {
    position: absolute;
    width: 26px;
    height: 26px;
    transform: translate(-50%, -50%);
    border-radius: 999px;
    border: 1px solid var(--lia-annot-accent);
    pointer-events: none;
    display: none;
    z-index: 503;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.9) inset;
  }

  .lia-annot-dgs-crosshair::before,
  .lia-annot-dgs-crosshair::after {
    content: '';
    position: absolute;
    background: var(--lia-annot-accent);
    opacity: 0.9;
  }

  .lia-annot-dgs-crosshair::before {
    left: 50%;
    top: 3px;
    width: 1px;
    height: calc(100% - 6px);
    transform: translateX(-50%);
  }

  .lia-annot-dgs-crosshair::after {
    top: 50%;
    left: 3px;
    height: 1px;
    width: calc(100% - 6px);
    transform: translateY(-50%);
  }

  .lia-annot-dgs-crosshair[data-on="1"] {
    display: block;
  }

  .lia-annot-rect-progress {
    position: absolute;
    z-index: 501;
    display: none;
    left: 0;
    top: 0;
    width: 180px;
    padding: 4px 8px;
    border-radius: 999px;
    border: 2px solid var(--lia-annot-border);
    background: var(--lia-annot-bg);
    backdrop-filter: blur(6px);
    box-sizing: border-box;
    align-items: center;
    gap: 8px;
    pointer-events: none;
  }

  .lia-annot-rect-progress[data-on="1"] {
    display: flex;
  }

  .lia-annot-rect-progbar {
    flex: 1 1 auto;
    height: 8px;
    border-radius: 999px;
    border: 2px solid var(--lia-annot-border);
    overflow: hidden;
    box-sizing: border-box;
    background: transparent;
  }

  .lia-annot-rect-progfill {
    height: 100%;
    width: 0%;
    background: var(--lia-annot-accent);
  }

  .lia-annot-rect-progtxt {
    font-weight: 800;
    font-size: 11px;
    min-width: 3.2em;
    text-align: right;
  }

  .lia-annot-rect-submit,
  .lia-annot-rect-clear {
    position: absolute;
    z-index: 502;
    border: 1px solid var(--lia-annot-border);
    box-shadow: var(--lia-annot-shadow);
    pointer-events: auto;
    cursor: pointer;
  }

  .lia-annot-rect-submit {
    min-height: 32px;
    padding: 6px 12px;
    border-radius: 9px;
    background: var(--lia-annot-accent);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
  }

  .lia-annot-rect-clear {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: var(--lia-annot-panel-bg);
    color: var(--lia-annot-fg);
    font-size: 15px;
    font-weight: 700;
    line-height: 1;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lia-annot-rect-choosequiz {
    position: absolute;
    z-index: 502;
    min-height: 28px;
    padding: 4px 12px;
    border-radius: 9px;
    border: 1px solid var(--lia-annot-border);
    box-shadow: var(--lia-annot-shadow);
    background: var(--lia-annot-panel-bg);
    color: var(--lia-annot-fg);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    pointer-events: auto;
    cursor: pointer;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lia-annot-rect-choosequiz[data-state="chosen"] {
    border-color: var(--lia-annot-accent);
    color: var(--lia-annot-accent);
  }

  .lia-annot-rect-choosequiz[data-state="picking"] {
    background: var(--lia-annot-accent);
    color: #fff;
    border-color: var(--lia-annot-accent);
  }

  /* Picking mode: show a crosshair cursor everywhere and highlight hovered inputs */
  html.lia-annot-quiz-picking,
  html.lia-annot-quiz-picking * {
    cursor: crosshair !important;
  }

  html.lia-annot-quiz-picking input,
  html.lia-annot-quiz-picking textarea,
  html.lia-annot-quiz-picking [contenteditable="true"],
  html.lia-annot-quiz-picking [role="textbox"] {
    outline: 2px dashed var(--lia-annot-accent) !important;
    outline-offset: 2px !important;
  }
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"8rPw4":[function(e,t,n,a){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"getPinnedQuizTarget",()=>b),r.export(n,"clearPinnedQuizTarget",()=>x),r.export(n,"setOverlayCallbacks",()=>E),r.export(n,"getMarkedRect",()=>A),r.export(n,"clearMarkedRect",()=>M),r.export(n,"startDgsPlacementMode",()=>q),r.export(n,"exitQuizPickingMode",()=>K),r.export(n,"getDirectHeader",()=>V),r.export(n,"findDirectChildByClass",()=>$),r.export(n,"isMainVisible",()=>U),r.export(n,"getVisibleMainHost",()=>J),r.export(n,"disconnectResizeObserver",()=>G),r.export(n,"bindResizeObserver",()=>Z),r.export(n,"bindCanvasEvents",()=>et),r.export(n,"ensureOverlay",()=>en),r.export(n,"syncOverlayInteractivity",()=>ea),r.export(n,"syncCanvasSize",()=>er),r.export(n,"requestSync",()=>ei),r.export(n,"redrawNow",()=>eo),r.export(n,"requestRedraw",()=>el);var i=e("./store"),o=e("./ui");let l=null,s=null,d=null,c=!1,u=!1,p=0,f=0,h="",g=1,m=null,y=!1;function b(){return m}function x(){m=null}let T=0,v=0;function S(e){if(!i.STATE.shell)return;let t=i.STATE.shell.querySelector(".lia-annot-rect-progress"),n=i.STATE.shell.querySelector(".lia-annot-rect-progfill"),a=i.STATE.shell.querySelector(".lia-annot-rect-progtxt");if(!t||!n||!a)return;let r=Math.max(0,Math.min(1,Number(e)));n.style.width=Math.round(100*r)+"%",a.textContent=Math.round(100*r)+"%"}function w(e){T&&(cancelAnimationFrame(T),T=0),S(e),setTimeout(function(){!function(){if(!i.STATE.shell)return;let e=i.STATE.shell.querySelector(".lia-annot-rect-progress");e&&(e.dataset.on="0",S(0))}()},250)}function E(e){d=e}function A(){if(!l)return null;let e=Math.min(l.x0,l.x1),t=Math.min(l.y0,l.y1);return{x:e,y:t,w:Math.max(1,Math.abs(l.x1-l.x0)),h:Math.max(1,Math.abs(l.y1-l.y0))}}function M(){l=null,s=null,el()}function R(){let e=(0,i.ensureSlide)((0,i.getSlideKey)());return Array.isArray(e.widgets)||(e.widgets=[]),e.widgets}function O(){try{let e=String(document.documentElement&&document.documentElement.lang||"").trim().toLowerCase(),t=String(document.body&&(document.body.getAttribute("lang")||document.body.getAttribute("data-language"))||"").trim().toLowerCase(),n=String(navigator&&(navigator.language||navigator.languages&&navigator.languages[0])||"").trim().toLowerCase();return(e||t||n).startsWith("de")?"de":"en"}catch(e){return"en"}}function k(e){c=!!e;let t=i.STATE.shell?i.STATE.shell.querySelector(".lia-annot-dgs-prompt"):null;if(t){if(c){let e=(0,i.ensureSlide)((0,i.getSlideKey)()).items.filter(function(e){return e&&"path"===e.kind&&"pen"===e.tool&&Array.isArray(e.points)&&e.points.length>=2}).slice(-6),n=1/0,a=1/0,r=-1/0,o=-1/0;for(let t=0;t<e.length;t++){let i=P(e[t]);i&&(n=Math.min(n,i.xMin),a=Math.min(a,i.yMin),r=Math.max(r,i.xMax),o=Math.max(o,i.yMax))}if(isFinite(n)&&isFinite(a)&&isFinite(r)&&isFinite(o)&&i.STATE.cssW>0&&i.STATE.cssH>0){let e=(0,i.clamp)(Math.round(r+14),12,Math.max(12,i.STATE.cssW-280-12)),n=(0,i.clamp)(Math.round(a-8),12,Math.max(12,i.STATE.cssH-110-12));t.style.left=e+"px",t.style.top=n+"px",t.style.bottom="auto"}else t.style.left="14px",t.style.bottom="14px",t.style.top="auto"}t.dataset.on=c?"1":"0"}}function _(){return i.STATE.shell?i.STATE.shell.querySelector(".lia-annot-dgs-crosshair"):null}function C(e){let t=_();t&&(t.dataset.on=e?"1":"0")}function z(e){(u=!!e)||C(!1),ea()}function q(){!(0,i.isReadOnly)()&&i.STORE.ui.visible&&(en(),k(!1),z(!0))}function P(e){if(!e||"path"!==e.kind||"pen"!==e.tool||!Array.isArray(e.points)||e.points.length<2)return null;let t=function(e){let t=[];if(!e||!Array.isArray(e.points))return t;let n=null;for(let a=0;a<e.points.length;a++){let r=(0,i.fromRel)(e.points[a]);isFinite(r.x)&&isFinite(r.y)&&(!n||Math.hypot(r.x-n.x,r.y-n.y)>=1.5)&&(t.push({x:r.x,y:r.y}),n={x:r.x,y:r.y})}return t}(e);if(t.length<2)return null;let n=1/0,a=-1/0,r=1/0,o=-1/0,l=0,s=t[0];n=Math.min(n,s.x),a=Math.max(a,s.x),r=Math.min(r,s.y),o=Math.max(o,s.y);for(let e=1;e<t.length;e++){let i=t[e];l+=Math.hypot(i.x-s.x,i.y-s.y),s=i,n=Math.min(n,i.x),a=Math.max(a,i.x),r=Math.min(r,i.y),o=Math.max(o,i.y)}if(!isFinite(n)||!isFinite(r)||!isFinite(a)||!isFinite(o))return null;let d=t[0],c=t[t.length-1],u=c.x-d.x,p=c.y-d.y,f=Math.hypot(u,p);if(f<1)return null;let h=u/f,g=p/f,m=0;for(let e=0;e<t.length;e++)m+=Math.abs((t[e].x-d.x)*g-(t[e].y-d.y)*h);let y=m/Math.max(1,t.length),b=f/Math.max(1,l),x=0,T=0;for(let e=1;e<t.length-1;e++){let n=t[e].x-t[e-1].x,a=t[e].y-t[e-1].y,r=t[e+1].x-t[e].x,o=t[e+1].y-t[e].y,l=Math.hypot(n,a),s=Math.hypot(r,o);if(l<1.2||s<1.2||180*Math.acos((0,i.clamp)((n*r+a*o)/(l*s),-1,1))/Math.PI<18)continue;let d=e/(t.length-1);d<.35?x++:d>.65&&T++}let v=0,S=0,w=0;for(let e=0;e<t.length;e++){let n=((t[e].x-d.x)*h+(t[e].y-d.y)*g)/Math.max(1e-6,f);if(e>0){let a=n-w,r=e/Math.max(1,t.length-1);r>.6&&a<0&&(v+=-a),r<.4&&a>0&&(S+=a)}w=n}let E=Math.max(1,a-n),A=Math.max(1,o-r),M=f>=24&&l>=28&&b>=.4&&l/Math.max(1,f)<=3.3&&y<=Math.max(12,.24*f),R=x>=1||T>=1,O=v>=.03||S>=.03,k=M&&f>=28&&l>=32&&b>=.43&&(R||O);return{xMin:n,xMax:a,yMin:r,yMax:o,w:E,h:A,cx:(n+a)*.5,cy:(r+o)*.5,pathLen:l,startX:d.x,startY:d.y,endX:c.x,endY:c.y,dirX:h,dirY:g,endToEnd:f,straightness:b,avgPerp:y,bendNearStart:x,bendNearEnd:T,endBacktrack:v,startBacktrack:S,isArrowLike:k,isLineLike:M,isHorizontal:E>=20&&E>=1.15*A,isVertical:A>=20&&A>=1.15*E}}function L(e,t,n,a,r,o){let l=r-n,s=o-a,d=l*l+s*s;if(d<=1e-6)return Math.hypot(e-n,t-a);let c=(0,i.clamp)(((e-n)*l+(t-a)*s)/d,0,1);return Math.hypot(e-(n+c*l),t-(a+c*s))}function N(e,t,n,a,r,i,o){return e>=Math.min(n,r)-o&&e<=Math.max(n,r)+o&&t>=Math.min(a,i)-o&&t<=Math.max(a,i)+o}function F(e,t){let n="right"===t?e.endX>=e.startX:e.endY<=e.startY,a=n?e.endX:e.startX,r=n?e.endY:e.startY,i=n?e.startX:e.endX,o=n?e.startY:e.endY,l=Math.max(1e-6,Math.hypot(i-a,o-r));return{tipX:a,tipY:r,inwardX:(i-a)/l,inwardY:(o-r)/l,tipIsEnd:n}}function I(e,t){return!!e.isArrowLike&&(t?e.bendNearEnd>=2||e.endBacktrack>=.06:e.bendNearStart>=2||e.startBacktrack>=.06)}function D(e,t,n,a,r,i,o){for(let l=0;l<e.length;l++){let s=e[l];if(!(s===t||s===n||s.endToEnd<4||s.endToEnd>80||Math.min(Math.hypot(s.startX-a,s.startY-r),Math.hypot(s.endX-a,s.endY-r))>58)){if(!(((s.startX+s.endX)*.5-a)*i+((s.startY+s.endY)*.5-r)*o<-6))return l}}return -1}function W(e,t,n){let a=[];a.push(window);try{window.parent&&window.parent!==window&&a.push(window.parent)}catch(e){}try{window.top&&window.top!==window&&a.push(window.top)}catch(e){}for(let r=0;r<a.length;r++){let i=a[r].__setupDGS;if("function"==typeof i)try{i(e,t,n);return}catch(e){}}}function j(e){e.innerHTML='<svg class="lia-annot-dgs-fallback" viewBox="0 0 240 180" preserveAspectRatio="none" aria-hidden="true"><line x1="24" y1="90" x2="226" y2="90" class="axis"/><line x1="120" y1="160" x2="120" y2="14" class="axis"/><polygon points="226,90 214,84 214,96" class="arrow"/><polygon points="120,14 114,26 126,26" class="arrow"/></svg>'}function B(){if(!i.STATE.host)return;let e=i.STATE.host,t=R().slice().sort(function(e,t){return e.y-t.y}),n={};for(let a=0;a<t.length;a++){let r=t[a];n[r.id]=!0;let o=String(r.spec||"lia-annot-dgs-board-"+r.id),l="de"===r.language?"de":"en";r.spec||(r.spec=o),r.language||(r.language=l);let s=e.querySelector('.lia-annot-dgs-widget[data-id="'+r.id+'"]');s||((s=document.createElement("div")).className="lia-annot-dgs-widget",s.dataset.id=r.id,s.innerHTML='<span class="lia-annot-dgs-spec" style="display:none;"></span><div class="lia-annot-dgs-board"></div>'),s.style.position="static",s.style.left="",s.style.top="",s.style.width="100%",s.style.height="auto",s.style.margin="18px 0",s.style.display="block",s.style.clear="both",s.dataset.spec=o,s.dataset.language=l;let d=s.querySelector(".lia-annot-dgs-spec");d&&(d.id="dgs-ui-"+r.id,d.dataset.spec=o,d.dataset.language=l);let c=function(t){let n=Array.from(e.children).filter(function(e){return(!i.STATE.shell||!e||e!==i.STATE.shell)&&!(e&&e instanceof HTMLElement&&e.classList.contains("lia-annot-dgs-widget"))}),a=null,r=-1/0;for(let i=0;i<n.length;i++){let o=n[i],l=o.getBoundingClientRect();if(l.width<24||l.height<12)continue;let s=l.top-e.getBoundingClientRect().top;l.bottom-e.getBoundingClientRect().top<=t+2&&s>=r&&(a=o,r=s)}return a}(r.y);c?c.nextSibling!==s&&c.parentNode.insertBefore(s,c.nextSibling):i.STATE.shell&&s.parentNode!==e?e.insertBefore(s,i.STATE.shell):s.parentNode!==e&&e.appendChild(s),function(e){let t=e.querySelector(".lia-annot-dgs-board");if(!t||"1"===t.dataset.init)return;let n=function(){let e=[];e.push(window);try{window.parent&&window.parent!==window&&e.push(window.parent)}catch(e){}try{window.top&&window.top!==window&&e.push(window.top)}catch(e){}for(let t=0;t<e.length;t++){let n=e[t].__coord;if(n&&"function"==typeof n.parseCoordSpec&&"function"==typeof n.prepareBoardContainer&&"function"==typeof n.createBoardDecorations&&"function"==typeof n.wireBoard&&"function"==typeof n.getNeutralColor&&"function"==typeof n.getAccentColor&&"function"==typeof n.loadStoredBoardState)return n}return null}(),a=function(){let e=[];e.push(window);try{window.parent&&window.parent!==window&&e.push(window.parent)}catch(e){}try{window.top&&window.top!==window&&e.push(window.top)}catch(e){}for(let t=0;t<e.length;t++){let n=e[t].JXG,a=n&&n.JSXGraph;if(n&&a&&"function"==typeof a.initBoard)return n}return null}(),r=String(e.dataset.id||Math.floor(1e9*Math.random())),i="lia-annot-dgs-board-"+r,o=O(),l=String(e.dataset.spec||i||""),s=e.querySelector(".lia-annot-dgs-spec");if(s||((s=document.createElement("span")).className="lia-annot-dgs-spec",s.style.display="none",e.insertBefore(s,e.firstChild)),s.id="dgs-ui-"+r,s.dataset.spec=l,s.dataset.language=o,!a||!n){j(t),t.dataset.init="1";return}let d=a.JSXGraph;t.id=i;try{let e=Math.max(160,Math.round(t.clientWidth||240)),a=n.parseCoordSpec("xmin=-7;xmax=7;ymin=-5;ymax=5;id="+i+";width="+e+";1;1;1"),s=[a.xmin,a.ymax,a.xmax,a.ymin],c=(a.ymax-a.ymin)/Math.max(1e-4,a.xmax-a.xmin),u=n.loadStoredBoardState(a.id);n.prepareBoardContainer(t,a.width,c,u);let p=d.initBoard(i,{axis:!1,grid:!1,showNavigation:!1,showCopyright:!1,boundingbox:u?u.bbox.slice():s.slice(),keepaspectratio:!0,zoom:{enabled:a.border,wheel:a.border,needShift:!1,factorX:1.15,factorY:1.15},pan:{enabled:a.border,needShift:!1,needTwoFingers:!1},resize:{enabled:!1}});n.createBoardDecorations(p,a,n.getNeutralColor(),n.getAccentColor()),n.wireBoard(p,a,s,c);try{let e=window;e.__boards=e.__boards||{},e.__boards[i]=p}catch(e){}t.__liaAnnotBoard=p,W(r,l,o),setTimeout(function(){W(r,l,o)},0),setTimeout(function(){W(r,l,o)},120)}catch(e){j(t)}t.dataset.init="1"}(s)}let a=Array.from(e.querySelectorAll(".lia-annot-dgs-widget"));for(let e=0;e<a.length;e++)n[String(a[e].dataset.id||"")]||a[e].remove()}function H(e){return!!e&&(!!e.matches("input, textarea")||"true"===e.getAttribute("contenteditable")||"textbox"===e.getAttribute("role"))}let X=null,Y=null;function K(){y=!1,i.STATE.canvas&&(i.STATE.canvas.style.pointerEvents=""),document.documentElement.classList.remove("lia-annot-quiz-picking"),X&&(document.removeEventListener("click",X,!0),X=null),Y&&(document.removeEventListener("keydown",Y,!0),Y=null),Q()}function Q(){if(!i.STATE.shell)return;let e=i.STATE.shell.querySelector(".lia-annot-rect-submit"),t=i.STATE.shell.querySelector(".lia-annot-rect-clear"),n=i.STATE.shell.querySelector(".lia-annot-rect-choosequiz"),a=i.STATE.shell.querySelector(".lia-annot-rect-progress");if(!e||!t||!a)return;let r=l;if(!(r&&i.STORE.ui.visible&&!(0,i.isReadOnly)()&&"rect"===(0,i.effectiveMode)())){e.style.display="none",t.style.display="none",a.style.display="none",n&&(n.style.display="none");return}e.style.display="block",t.style.display="block",a.style.display="";let s=Math.min(r.x0,r.x1),d=Math.min(r.y0,r.y1),c=Math.max(1,Math.abs(r.x1-r.x0)),u=Math.max(1,Math.abs(r.y1-r.y0)),p=Math.max(110,e.offsetWidth||140),f=Math.max(28,e.offsetHeight||32),h=Math.max(20,t.offsetWidth||22),g=(0,i.clamp)(s+c-p,8,Math.max(8,i.STATE.cssW-p-8)),b=(0,i.clamp)(d+u+8,8,Math.max(8,i.STATE.cssH-f-8));e.style.left=g+"px",e.style.top=b+"px";let x=Math.max(24,a.offsetHeight||26);a.style.width=p+"px",a.style.left=g+"px",a.style.top=(0,i.clamp)(b-x-6,8,Math.max(8,i.STATE.cssH-x-8))+"px";let T=(0,i.clamp)(s+c-.5*h,8,Math.max(8,i.STATE.cssW-h-8)),v=(0,i.clamp)(d-.5*h,8,Math.max(8,i.STATE.cssH-h-8));if(t.style.left=T+"px",t.style.top=v+"px",n){let e=Math.max(28,n.offsetHeight||32);n.style.display="block",n.style.width=p+"px",n.style.left=g+"px",n.style.top=(0,i.clamp)(b+f+4,8,Math.max(8,i.STATE.cssH-e-8))+"px",y?(n.textContent="✕ "+(0,o.tUi)("rectChooseCancel"),n.dataset.state="picking"):m?(n.textContent="✓ "+(m.placeholder||m.name||(0,o.tUi)("rectChosenFallback")),n.dataset.state="chosen"):(n.textContent=(0,o.tUi)("rectChooseQuiz"),n.dataset.state="")}}function V(e){if(!e)return null;let t=e.children||[];for(let e=0;e<t.length;e++){let n=t[e];if(n&&n.tagName&&"header"===n.tagName.toLowerCase())return n}return null}function $(e,t){if(!e)return null;let n=e.children||[];for(let e=0;e<n.length;e++){let a=n[e];if(a.classList&&a.classList.contains(t))return a}return null}function U(e){if(!e||e.hasAttribute("hidden"))return!1;let t=getComputedStyle(e);if("none"===t.display||"hidden"===t.visibility)return!1;let n=e.getBoundingClientRect();return n.width>0&&n.height>0}function J(){let e=Array.from(document.querySelectorAll("main"));for(let t=0;t<e.length;t++)if(U(e[t]))return e[t];return e[0]||document.querySelector("main")||document.body||document.documentElement}function G(){try{i.STATE.resizeObserver&&i.STATE.resizeObserver.disconnect()}catch(e){}i.STATE.resizeObserver=null}function Z(){if(G(),i.STATE.host)try{i.STATE.resizeObserver=new ResizeObserver(function(){ei()}),i.STATE.resizeObserver.observe(i.STATE.host)}catch(e){}}function ee(e,t){let n=V(e);if(n){n.nextSibling!==t&&(t.parentNode===e&&t.remove(),n.nextSibling?e.insertBefore(t,n.nextSibling):e.appendChild(t));return}e.firstChild!==t&&(t.parentNode===e&&t.remove(),e.firstChild?e.insertBefore(t,e.firstChild):e.appendChild(t))}function et(){function e(e){let t,n=(t=i.STATE.canvas.getBoundingClientRect(),{x:(0,i.clamp)(e.clientX-t.left,0,i.STATE.cssW),y:(0,i.clamp)(e.clientY-t.top,0,i.STATE.cssH)});return i.STATE.lastPointer={x:n.x,y:n.y,inside:!0,pointerType:String(e.pointerType||"")},n}function t(t,n){let a=i.STATE.activePath;if(i.STATE.drawing){t.preventDefault(),t.stopPropagation();try{i.STATE.canvas.releasePointerCapture(t.pointerId)}catch(e){}i.STATE.drawing=!1,i.STATE.activePath=null,el(),(0,o.updateToolbar)()}if(n&&"mouse"===t.pointerType&&i.STORE.ui.visible&&!(0,i.isReadOnly)()&&"eraser"===(0,i.effectiveMode)()){let n=e(t);(0,o.updateEraserRing)(n.x,n.y)}else i.STATE.lastPointer.inside=!1,(0,o.hideEraserRing)();a&&"pen"===a.tool&&((0,i.isReadOnly)()||!i.STORE.ui.visible||c||u||!d||!d.shouldPromptDgsInsert||!d.shouldPromptDgsInsert()||Date.now()<p||Date.now()-f<120||((0,i.ensureSlide)((0,i.getSlideKey)()),function(){let e=(0,i.ensureSlide)((0,i.getSlideKey)()).items.filter(function(e){return e&&"path"===e.kind&&"pen"===e.tool}).slice(-140).map(function(e){return P(e)}).filter(e=>null!==e);if(e.length<2)return!1;let t=e.slice(-26);if(t.length<2)return!1;let n=function(e){if(!e.length)return[];let t=[e[e.length-1]];for(let n=e.length-2;n>=0;n--){let a=e[n],r=!1;for(let e=0;e<t.length;e++)if(function(e,t){var n,a,r,i,o,l,s,d;return!!(220>=Math.hypot(e.cx-t.cx,e.cy-t.cy))||120>=(n=e.startX,a=e.startY,r=e.endX,i=e.endY,o=t.startX,l=t.startY,Math.min(L(n,a,o,l,s=t.endX,d=t.endY),L(r,i,o,l,s,d),L(o,l,n,a,r,i),L(s,d,n,a,r,i)))}(a,t[e])){r=!0;break}if(!r||(t.unshift(a),t.length>=10))break}return t}(t);if(n.length<2)return!1;let a=n.map(function(e){return[Math.round(e.cx),Math.round(e.cy),Math.round(e.endToEnd),Math.round(e.w),Math.round(e.h)].join(":")}).join("|");if(a&&a===h)return!1;let r=n.map(function(e,t){return{g:e,index:t}}).filter(function(e){let t=e.g;return t.isLineLike&&t.endToEnd>=28&&t.straightness>=.34&&Math.abs(t.dirX)>=.72&&.55>=Math.abs(t.dirY)&&t.w>=1.4*t.h}).sort(function(e,t){return t.index-e.index}),o=n.map(function(e,t){return{g:e,index:t}}).filter(function(e){let t=e.g;return t.isLineLike&&t.endToEnd>=28&&t.straightness>=.34&&Math.abs(t.dirY)>=.72&&.55>=Math.abs(t.dirX)&&t.h>=1.4*t.w}).sort(function(e,t){return t.index-e.index});if(!r.length||!o.length)return!1;let l=Math.min(3,r.length),s=Math.min(3,o.length);for(let e=0;e<l;e++)for(let t=0;t<s;t++){let i=r[e],l=o[t],s=i.g,d=l.g;if(Math.abs(i.index-l.index)>4||Math.max(i.index,l.index)<n.length-4||Math.abs(s.dirX*d.dirX+s.dirY*d.dirY)>.78)continue;let c=function(e,t,n,a,r,i,o,l){let s=(e-n)*(i-l)-(t-a)*(r-o);if(1e-6>Math.abs(s))return null;let d=e*a-t*n,c=r*l-i*o;return{x:(d*(r-o)-(e-n)*c)/s,y:(d*(i-l)-(t-a)*c)/s}}(s.startX,s.startY,s.endX,s.endY,d.startX,d.startY,d.endX,d.endY);if(!c)continue;let u=Math.max(16,Math.min(90,.22*s.endToEnd)),p=Math.max(16,Math.min(90,.22*d.endToEnd));if(!N(c.x,c.y,s.startX,s.startY,s.endX,s.endY,u)||!N(c.x,c.y,d.startX,d.startY,d.endX,d.endY,p))continue;let f=Math.hypot(c.x-s.cx,c.y-s.cy),g=Math.hypot(c.x-d.cx,c.y-d.cy);if(f>Math.max(90,.38*s.endToEnd)||g>Math.max(90,.38*d.endToEnd))continue;let m=F(s,"right"),y=F(d,"up"),b=I(s,m.tipIsEnd),x=D(n,s,d,m.tipX,m.tipY,m.inwardX,m.inwardY);if(!(b||x>=0))continue;let T=I(d,y.tipIsEnd),v=D(n,s,d,y.tipX,y.tipY,y.inwardX,y.inwardY);if((T||v>=0)&&(!(x>=0)||!(v>=0)||x!==v))return h=a,!0}return!1}()&&(f=Date.now(),k(!0))))}i.STATE.canvas&&!i.STATE.canvas.__liaAnnotBound&&(i.STATE.canvas.__liaAnnotBound=!0,i.STATE.canvas.addEventListener("pointerdown",function(t){var n,a,r,l;if("mouse"===t.pointerType&&0!==t.button)return;let d=e(t);if(u){let e,r,l,s;t.preventDefault(),t.stopPropagation(),n=d.x,a=d.y,e=R(),r=Math.round(n),l=Math.round(a),s=String(Date.now())+"-"+String(g++),e.push({id:s,x:r,y:l,w:240,h:180,spec:"lia-annot-dgs-board-"+s,language:O()}),B(),el(),z(!1),i.STORE.ui.mode="cursor",i.STORE.ui.panelOpen=!1,k(!1),f=0,p=0,(0,o.updateToolbar)(),ea();return}if(!i.STORE.ui.visible||(0,i.isReadOnly)())return void(0,o.hideEraserRing)();let c=(0,i.effectiveMode)();if("eraser"===c?(0,o.updateEraserRing)(d.x,d.y):(0,o.hideEraserRing)(),"rect"===c){t.preventDefault(),t.stopPropagation(),s={x0:r=d.x,y0:l=d.y,x1:r,y1:l};try{i.STATE.canvas.setPointerCapture(t.pointerId)}catch(e){}el();return}if("pen"!==c&&"eraser"!==c)return;t.preventDefault(),t.stopPropagation(),i.STORE.ui.panelOpen&&(i.STORE.ui.panelOpen=!1,(0,o.updateToolbar)());let h=(0,i.ensureSlide)((0,i.getSlideKey)()),m={kind:"path",tool:c,color:String(i.STORE.ui.color||"#ff0000"),width:"eraser"===c?Number(i.STORE.ui.eraserWidth||18):Number(i.STORE.ui.width||3),alpha:"eraser"===c?1:Number(i.STORE.ui.alpha||1),baseW:Math.max(1,i.STATE.cssW),points:[(0,i.toRel)(d.x,d.y)]};h.items.push(m),h.redo=[],i.STATE.activePath=m,i.STATE.drawing=!0;try{i.STATE.canvas.setPointerCapture(t.pointerId)}catch(e){}el(),(0,o.updateToolbar)()},!0),i.STATE.canvas.addEventListener("pointermove",function(t){var n,a,r,l;let d=e(t);if(u){let e;t.preventDefault(),t.stopPropagation(),n=d.x,a=d.y,(e=_())&&i.STATE.shell&&u&&isFinite(n)&&isFinite(a)&&(e.style.left=(0,i.clamp)(n,0,Math.max(0,i.STATE.cssW))+"px",e.style.top=(0,i.clamp)(a,0,Math.max(0,i.STATE.cssH))+"px",C(!0));return}if(!(0,i.isReadOnly)()&&i.STORE.ui.visible&&"eraser"===(0,i.effectiveMode)()?(0,o.updateEraserRing)(d.x,d.y):(0,o.hideEraserRing)(),s){t.preventDefault(),t.stopPropagation(),r=d.x,l=d.y,s&&(s.x1=r,s.y1=l),el();return}i.STATE.drawing&&i.STATE.activePath&&(t.preventDefault(),t.stopPropagation(),function(e,t,n){if(!e||!Array.isArray(e.points))return;let a=(0,i.toRel)(t,n),r=e.points.length?e.points[e.points.length-1]:null;if(!(r&&.8>Math.hypot((a.x-r.x)*i.STATE.cssW,(a.y-r.y)*i.STATE.cssH)))e.points.push(a)}(i.STATE.activePath,d.x,d.y),el())},!0),i.STATE.canvas.addEventListener("pointerup",function(e){if(s){e.preventDefault(),e.stopPropagation();try{i.STATE.canvas.releasePointerCapture(e.pointerId)}catch(e){}(function(){if(!s)return;let e=Math.abs(s.x1-s.x0),t=Math.abs(s.y1-s.y0);l=e>=6&&t>=6?{...s}:null,s=null})(),el(),(0,o.updateToolbar)();return}t(e,!0)},!0),i.STATE.canvas.addEventListener("pointercancel",function(e){t(e,!1)},!0),i.STATE.canvas.addEventListener("pointerleave",function(){i.STATE.lastPointer.inside=!1,(0,o.hideEraserRing)(),u&&C(!1)},!0),i.STATE.canvas.addEventListener("contextmenu",function(e){e.preventDefault()},!0))}function en(){let e=J(),t=(0,i.getSlideKey)(),n=i.STATE.host!==e,a=i.STATE.slideKey!==t;if(i.STATE.shell&&i.STATE.shell.isConnected&&!n)ee(e,i.STATE.shell),i.STATE.canvas=i.STATE.shell.querySelector(".lia-annot-canvas"),i.STATE.eraserRing=i.STATE.shell.querySelector(".lia-annot-eraser-ring");else{G(),i.STATE.host=e,i.STATE.slideKey=t,e.classList.add("lia-annot-host");let n=$(e,"lia-annot-shell");n||((n=document.createElement("div")).className="lia-annot-shell",n.setAttribute("aria-hidden","true"));let a=n.querySelector(".lia-annot-canvas");a||((a=document.createElement("canvas")).className="lia-annot-canvas",a.setAttribute("aria-label","Annotation canvas"),n.appendChild(a));let r=n.querySelector(".lia-annot-eraser-ring");r||((r=document.createElement("span")).className="lia-annot-eraser-ring",r.dataset.on="0",n.appendChild(r));let s=n.querySelector(".lia-annot-dgs-layer");s||((s=document.createElement("div")).className="lia-annot-dgs-layer",n.appendChild(s));let g=n.querySelector(".lia-annot-dgs-crosshair");g||((g=document.createElement("div")).className="lia-annot-dgs-crosshair",g.dataset.on="0",n.appendChild(g));let b=n.querySelector(".lia-annot-dgs-prompt");b||((b=document.createElement("div")).className="lia-annot-dgs-prompt",b.dataset.on="0",b.innerHTML='<div class="lia-annot-dgs-prompt-title">Coordinate system sketch detected</div><div class="lia-annot-dgs-prompt-sub">Create a DGS coordinate system?</div><div class="lia-annot-dgs-prompt-actions">  <button type="button" class="lia-annot-dgs-yes">Yes</button>  <button type="button" class="lia-annot-dgs-no">No</button></div>',n.appendChild(b),b.addEventListener("pointerdown",function(e){e.preventDefault(),e.stopPropagation()},!0),b.addEventListener("click",function(e){let t=e.target;if(t&&t instanceof Element){if(t.closest(".lia-annot-dgs-yes")){e.preventDefault(),e.stopPropagation(),k(!1),z(!0);return}t.closest(".lia-annot-dgs-no")&&(e.preventDefault(),e.stopPropagation(),k(!1),f=0,p=Date.now()+40,h="")}},!0));let x=n.querySelector(".lia-annot-rect-submit");x||((x=document.createElement("button")).type="button",x.className="lia-annot-rect-submit",x.textContent=(0,o.tUi)("rectSubmit"),x.style.display="none",n.appendChild(x),x.addEventListener("pointerdown",function(e){e.preventDefault(),e.stopPropagation()},!0),x.addEventListener("click",function(e){if(e.preventDefault(),e.stopPropagation(),d&&l&&!i.STORE.ui.ocrBusy){let e;T&&(cancelAnimationFrame(T),T=0),function(){if(!i.STATE.shell)return;let e=i.STATE.shell.querySelector(".lia-annot-rect-progress");e&&(e.dataset.on="1",S(0),Q())}(),v=performance.now(),e=function(){let t=performance.now()-v;S(t<900?t/900*.7:t<2200?.7+(t-900)/1300*.2:.9+Math.min(.08,(t-2200)/5e3*.08)),T=requestAnimationFrame(e)},T=requestAnimationFrame(e),d.submitMarkedRect().then(function(){(0,o.updateToolbar)(),w(1),Q()}).catch(function(){w(1),Q()})}},!0));let E=n.querySelector(".lia-annot-rect-progress");E||((E=document.createElement("div")).className="lia-annot-rect-progress",E.dataset.on="0",E.innerHTML='<div class="lia-annot-rect-progbar"><div class="lia-annot-rect-progfill"></div></div><div class="lia-annot-rect-progtxt">0%</div>',n.appendChild(E),E.addEventListener("pointerdown",function(e){e.preventDefault(),e.stopPropagation()},!0));let A=n.querySelector(".lia-annot-rect-clear");A||((A=document.createElement("button")).type="button",A.className="lia-annot-rect-clear",A.setAttribute("aria-label",(0,o.tUi)("rectClearAria")),A.textContent="×",A.style.display="none",n.appendChild(A),A.addEventListener("pointerdown",function(e){e.preventDefault(),e.stopPropagation()},!0),A.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation(),M()},!0));let R=n.querySelector(".lia-annot-rect-choosequiz");R||((R=document.createElement("button")).type="button",R.className="lia-annot-rect-choosequiz",R.textContent=(0,o.tUi)("rectChooseQuiz"),R.style.display="none",n.appendChild(R),R.addEventListener("pointerdown",function(e){e.preventDefault(),e.stopPropagation()},!0),R.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation(),y?K():y||(y=!0,i.STATE.canvas&&(i.STATE.canvas.style.pointerEvents="none"),document.documentElement.classList.add("lia-annot-quiz-picking"),Q(),X=function(e){let t=e.target;for(;t&&t!==document.documentElement&&!H(t);)t=t.parentElement;t&&H(t)&&!t.closest(".lia-annot-shell")?(e.preventDefault(),e.stopPropagation(),m=t,K()):t&&t.closest(".lia-annot-rect-choosequiz")||K()},Y=function(e){"Escape"===e.key&&K()},document.addEventListener("click",X,!0),document.addEventListener("keydown",Y,!0))},!0)),ee(e,n),i.STATE.shell=n,i.STATE.canvas=a,i.STATE.eraserRing=r,i.STATE.ctx=i.STATE.canvas?i.STATE.canvas.getContext("2d",{willReadFrequently:!0}):null,et(),Z(),document.__liaAnnotDgsEscBound||(document.addEventListener("keydown",function(e){if("Escape"===e.key){if(u)return void z(!1);c&&k(!1)}},!0),document.__liaAnnotDgsEscBound=!0)}a&&(i.STATE.slideKey=t,f=0,k(!1),z(!1),h=""),B(),ea(),Q()}function ea(){let e=Array.from(document.querySelectorAll(".lia-annot-shell")),t=(0,i.effectiveMode)(),n=!!i.STORE.ui.visible;u&&(!n||(0,i.isReadOnly)())&&(u=!1);let a=u&&n&&!(0,i.isReadOnly)();for(let t=0;t<e.length;t++){let r=e[t],i=r.querySelector(".lia-annot-canvas");r.dataset.mode=a?"place":"cursor",r.dataset.hidden=n?"0":"1",r.style.pointerEvents="none",r.style.display=n?"":"none",i&&(i.style.pointerEvents="none",i.style.touchAction="auto",i.style.cursor="default")}if(!n){(0,o.hideEraserRing)(),k(!1),C(!1);return}i.STATE.shell&&i.STATE.canvas?(i.STATE.shell.style.display="",i.STATE.shell.dataset.hidden="0",i.STATE.shell.dataset.mode=a?"place":t,i.STATE.shell.style.pointerEvents="none",a||"pen"===t||"eraser"===t||"rect"===t?(i.STATE.canvas.style.pointerEvents="auto",i.STATE.canvas.style.touchAction="none",i.STATE.canvas.style.cursor="crosshair"):(i.STATE.canvas.style.pointerEvents="none",i.STATE.canvas.style.touchAction="auto",i.STATE.canvas.style.cursor="default"),"eraser"!==t||a?(0,o.hideEraserRing)():(0,o.refreshEraserRing)(),a||C(!1),Q()):(0,o.hideEraserRing)()}function er(){let e;if(!i.STATE.host||!i.STATE.canvas||!i.STATE.ctx||!i.STATE.shell)return;i.STATE.dpr=window.devicePixelRatio||1;let t=i.STATE.host.getBoundingClientRect(),n=(0,i.getViewportWidth)(),a=i.STATE.host.querySelector(".lia-slide, section");e=Math.min(e=a?Math.max(1,Math.ceil(a.getBoundingClientRect().height||0)):Math.max(1,Math.ceil(t.height||0)),window.innerHeight);let r=Math.round(-t.left);i.STATE.cssW=n,i.STATE.cssH=e,i.STATE.shell.style.left=r+"px",i.STATE.shell.style.top="0px",i.STATE.shell.style.width=n+"px",i.STATE.shell.style.height=e+"px",i.STATE.canvas.style.width=n+"px",i.STATE.canvas.style.height=e+"px";let l=Math.max(1,Math.round(n*i.STATE.dpr)),s=Math.max(1,Math.round(e*i.STATE.dpr));i.STATE.canvas.width!==l&&(i.STATE.canvas.width=l),i.STATE.canvas.height!==s&&(i.STATE.canvas.height=s),(0,o.refreshEraserRing)(),Q()}function ei(){i.STATE.syncRAF||(i.STATE.syncRAF=requestAnimationFrame(function(){i.STATE.syncRAF=0,en(),er(),e("42b16d8938ebb527").then(({syncToolbarPosition:e})=>e()),el()}))}function eo(){if(!i.STATE.canvas||!i.STATE.ctx)return;let e=i.STATE.ctx;if(e.setTransform(i.STATE.dpr,0,0,i.STATE.dpr,0,0),e.clearRect(0,0,i.STATE.cssW,i.STATE.cssH),!i.STORE.ui.visible)return;let t=(0,i.ensureSlide)(i.STATE.slideKey||(0,i.getSlideKey)());for(let n=0;n<t.items.length;n++)!function(e,t){if(!t||"path"!==t.kind||!Array.isArray(t.points)||0===t.points.length)return;let n="eraser"===t.tool,a=(0,i.getLineWidthPx)(t),r=(0,i.clamp)(Number(t.alpha||1),.05,1),o=String(t.color||"#000");if(1===t.points.length){var l,s,d;let c=(0,i.fromRel)(t.points[0]);l=c.x,s=c.y,d=a/2,e.save(),e.globalCompositeOperation=n?"destination-out":"source-over",e.globalAlpha=n?1:(0,i.clamp)(Number(r||1),.05,1),e.beginPath(),e.arc(l,s,Math.max(.5,d),0,2*Math.PI),e.fillStyle=n?"#000":String(o||"#000"),e.fill(),e.restore();return}e.save(),e.globalCompositeOperation=n?"destination-out":"source-over",e.globalAlpha=n?1:r,e.lineCap="round",e.lineJoin="round",e.lineWidth=a,e.strokeStyle=n?"#000":o,e.beginPath();let c=t.points.map(i.fromRel);if(e.moveTo(c[0].x,c[0].y),2===c.length)e.lineTo(c[1].x,c[1].y);else{e.lineTo((c[0].x+c[1].x)/2,(c[0].y+c[1].y)/2);for(let t=1;t<c.length-1;t++){let n=(c[t].x+c[t+1].x)/2,a=(c[t].y+c[t+1].y)/2;e.quadraticCurveTo(c[t].x,c[t].y,n,a)}e.lineTo(c[c.length-1].x,c[c.length-1].y)}e.stroke(),e.restore()}(e,t.items[n]);let n=function(t,n){let a=Math.min(t.x0,t.x1),r=Math.min(t.y0,t.y1),i=Math.max(1,Math.abs(t.x1-t.x0)),o=Math.max(1,Math.abs(t.y1-t.y0)),l=getComputedStyle(document.documentElement).getPropertyValue("--lia-annot-accent").trim()||"#3b82f6";e.save(),e.globalCompositeOperation="source-over",e.globalAlpha=n?.22:.16,e.fillStyle=l,e.fillRect(a,r,i,o),e.globalAlpha=.95,e.lineWidth=1.6,e.strokeStyle=l,e.strokeRect(a,r,i,o),e.restore()};l&&n(l,!0),s&&n(s,!1),Q()}function el(){i.STATE.redrawRAF||(i.STATE.redrawRAF=requestAnimationFrame(function(){i.STATE.redrawRAF=0,eo(),(0,o.updateToolbar)()}))}},{"./store":"cswaT","./ui":"7Wjmu","42b16d8938ebb527":"fsRuL","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],fsRuL:[function(e,t,n,a){t.exports=Promise.resolve(t.bundle.root("7Wjmu"))},{}],bH1QJ:[function(e,t,n,a){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"doUndo",()=>s),r.export(n,"doRedo",()=>d),r.export(n,"clearSlide",()=>c),r.export(n,"clearAllSlides",()=>u),r.export(n,"isOcrAvailable",()=>h),r.export(n,"shouldPromptDgsInsert",()=>g),r.export(n,"recognizeLatestAnnotationText",()=>_),r.export(n,"submitOcrTextToNearestQuiz",()=>C),r.export(n,"transferToNearestQuiz",()=>z),r.export(n,"roundFreezeNum",()=>q),r.export(n,"sanitizeFreezePoint",()=>P),r.export(n,"sanitizeFreezeItem",()=>L),r.export(n,"sanitizeFreezeSlides",()=>N),r.export(n,"hasFreezeData",()=>I),r.export(n,"exportState",()=>D),r.export(n,"exportFreezeState",()=>W),r.export(n,"importState",()=>j),r.export(n,"importFreezeState",()=>B),r.export(n,"setVisible",()=>H),r.export(n,"setReadOnly",()=>X),r.export(n,"registerGlobalApi",()=>Y);var i=e("./store"),o=e("./overlay"),l=e("./ui");function s(){let e=(0,i.currentSlide)();e.items.length&&(e.redo.push(e.items.pop()),(0,o.requestRedraw)(),(0,l.updateToolbar)())}function d(){let e=(0,i.currentSlide)();e.redo.length&&(e.items.push(e.redo.pop()),(0,o.requestRedraw)(),(0,l.updateToolbar)())}function c(){let e=(0,i.currentSlide)();e.items=[],e.redo=[],e.widgets=[],(0,o.requestRedraw)(),(0,l.updateToolbar)()}function u(){i.STORE.slides={},(0,i.ensureSlide)((0,i.getSlideKey)()),(0,o.requestRedraw)(),(0,l.updateToolbar)()}function p(e){if(!e||"object"!=typeof e)return null;let t=e.__LIA_TEX_OCR__;if(t&&"function"==typeof t.recognize)return t;let n=e.__LIA_CANVAS_OCR__,a=n&&n.ocr;return a&&"function"==typeof a.recognize?a:null}function f(){let e=p(window);if(e)return e;try{let e=p(i.ROOT);if(e)return e}catch(e){}try{let e=window.parent&&window.parent!==window?p(window.parent):null;if(e)return e}catch(e){}try{let e=window.top&&window.top!==window?p(window.top):null;if(e)return e}catch(e){}return null}function h(){return!!f()}function g(){return!0}function m(e){if(!e||!(e instanceof Element)||!function(e){if(!e||!(e instanceof Element)||!e.isConnected)return!1;let t=e.getBoundingClientRect();if(t.width<=0||t.height<=0)return!1;let n=getComputedStyle(e);return"none"!==n.display&&"hidden"!==n.visibility}(e)||e.closest(".lia-annot-toolbar, .lia-annot-panel"))return!1;if(e.matches("input")){let t=String(e.type||"text").toLowerCase();return!e.disabled&&!e.readOnly&&("text"===t||"search"===t||"url"===t||"email"===t||"tel"===t||"number"===t)}return e.matches("textarea")?!e.disabled&&!e.readOnly:"true"===e.getAttribute("contenteditable")||"textbox"===e.getAttribute("role")&&"true"!==e.getAttribute("aria-readonly")}function y(e){return!!e.closest('.quiz, .lia-quiz, .lia-question, .lia-exercise, [class*="quiz"], [class*="exercise"], [id*="quiz"]')}function b(e){let t=String(null==e?"":e).trim();if(!t)return"";if(t.startsWith("$$")&&t.endsWith("$$")&&(t=t.slice(2,-2).trim()),t.startsWith("$")&&t.endsWith("$")&&(t=t.slice(1,-1).trim()),t.startsWith("\\[")&&t.endsWith("\\]")&&(t=t.slice(2,-2).trim()),t.startsWith("[")&&t.endsWith("]")){let e=t.slice(1,-1).trim(),n=0,a=!0;for(let t of e)if("["===t)n++;else if("]"===t){if(0===n){a=!1;break}n--}a&&(t=e)}return t.startsWith("\\left[")&&t.endsWith("\\right]")&&(t=t.slice(6,-7).trim()),(t=t.replace(/\s+/g," ").trim()).startsWith("\\mathrm{")&&t.endsWith("}")&&(t=t.slice(8,-1).replace(/~/g,"").trim()),t=function(e){let t=String(e||"");if(-1!==t.indexOf("\\div")&&(t=t.replace(/\s*\\div\s*/g,":")),-1===t.indexOf("\\times"))return t;let n="",a=0;for(;a<t.length;){let e=t.indexOf("\\times",a);if(e<0){n+=t.slice(a);break}n+=t.slice(a,e);let r=e-1;for(;r>=0&&" "===t[r];)r--;let i=e+6;for(;i<t.length&&" "===t[i];)i++;let o=r>=0?t[r]:"",l=i<t.length?t[i]:"",s=function(e){return e>="0"&&e<="9"},d=function(e){return e>="a"&&e<="z"};s(o)&&s(l)?n+="\\cdot":d(o)||d(l)?n+="x":n+="\\cdot",a=e+6}return n}(t)}function x(e){if("string"==typeof e)return b(e);if(e&&"object"==typeof e){let t=e.text??e.latex??e.output??e.result;if("string"==typeof t)return b(t)}return""}let T=null,v=null,S=!1;async function w(e){if(!S){if(!e||"function"!=typeof e.setModel||String(e.model||"").trim().toLowerCase().includes("texify2")){S=!0;return}try{await e.setModel("Xenova/texify2")}catch(e){}S=!0}}function E(e){let t=Math.max(e.width,e.height),n=1;if(t<420&&(n=420/t),t>1400&&(n=1400/t),.06>Math.abs(n-1))return e;let a=document.createElement("canvas");a.width=Math.max(1,Math.round(e.width*n)),a.height=Math.max(1,Math.round(e.height*n));let r=a.getContext("2d",{willReadFrequently:!0});return r?(r.fillStyle="#fff",r.fillRect(0,0,a.width,a.height),r.drawImage(e,0,0,a.width,a.height),a):e}function A(e){let t=document.createElement("canvas");t.width=Math.max(1,0|e.width),t.height=Math.max(1,0|e.height);let n=t.getContext("2d",{willReadFrequently:!0});if(!n)return e;n.fillStyle="#fff",n.fillRect(0,0,t.width,t.height),n.drawImage(e,0,0);let a=n.getImageData(0,0,t.width,t.height).data,r=t.width,i=t.height,o=new Uint8Array(r*i);for(let e=0,t=0;t<o.length;t++,e+=4)o[t]=+(.299*a[e]+.587*a[e+1]+.114*a[e+2]<200);let l=r,s=i,d=-1,c=-1;for(let e=0;e<i;e++)for(let t=0;t<r;t++)o[e*r+t]&&(t<l&&(l=t),e<s&&(s=e),t>d&&(d=t),e>c&&(c=e));if(d<0)return t;l=Math.max(0,l-18),s=Math.max(0,s-18);let u=Math.max(1,(d=Math.min(r-1,d+18))-l+1),p=Math.max(1,(c=Math.min(i-1,c+18))-s+1),f=document.createElement("canvas");f.width=u,f.height=p;let h=f.getContext("2d",{willReadFrequently:!0});if(!h)return t;let g=h.createImageData(u,p),m=g.data;for(let e=0;e<p;e++)for(let t=0;t<u;t++){let n=255*!o[(s+e)*r+(l+t)],a=(e*u+t)*4;m[a]=n,m[a+1]=n,m[a+2]=n,m[a+3]=255}h.putImageData(g,0,0);let y=512/Math.max(u,p);y<.75&&(y=.75),y>3.5&&(y=3.5);let b=document.createElement("canvas");b.width=Math.max(1,Math.round(u*y)),b.height=Math.max(1,Math.round(p*y));let x=b.getContext("2d",{willReadFrequently:!0});return x?(x.fillStyle="#fff",x.fillRect(0,0,b.width,b.height),x.imageSmoothingEnabled=!0,x.drawImage(f,0,0,b.width,b.height),b):f}function M(e){let t=String(e||"").trim();return t?!function(e){let t=String(e||"").trim();if(!t||/[+\-*/=,:;\\]$/.test(t)||/[{[(]$/.test(t))return!0;let n=0,a=0,r=0,i=!1;for(let e=0;e<t.length;e++){let o=t[e];if(i){i=!1;continue}if("\\"===o){i=!0;continue}"{"===o?n++:"}"===o?n--:"["===o?a++:"]"===o?a--:"("===o?r++:")"===o&&r--}return 0!==n||0!==a||0!==r}(t)?t.length:t.length-5e3:-9999}async function R(e,t){var n;let a,r,i,o={max_new_tokens:128,do_sample:!1,temperature:0,__silent:!0},l=E(A(t)),s=E((n=A(t),a=Math.max(0,Math.round(20)),(r=document.createElement("canvas")).width=n.width+2*a,r.height=n.height+2*a,(i=r.getContext("2d",{willReadFrequently:!0}))?(i.fillStyle="#fff",i.fillRect(0,0,r.width,r.height),i.drawImage(n,a,a),r):n)),d=E(A(function(e){let t=document.createElement("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d",{willReadFrequently:!0});if(!n)return e;n.fillStyle="#fff",n.fillRect(0,0,t.width,t.height),n.drawImage(e,0,0);let a=n.getImageData(0,0,t.width,t.height),r=a.data;for(let e=0;e<r.length;e+=4)!(r[e+3]<128)&&.299*r[e]+.587*r[e+1]+.114*r[e+2]<240&&(r[e]=Math.max(0,Math.min(255,Math.round(r[e]/1.35))),r[e+1]=Math.max(0,Math.min(255,Math.round(r[e+1]/1.35))),r[e+2]=Math.max(0,Math.min(255,Math.round(r[e+2]/1.35))));return n.putImageData(a,0,0),t}(t))),[c,u,p]=await Promise.all([e.recognize(l,o).catch(()=>""),e.recognize(s,o).catch(()=>""),e.recognize(d,o).catch(()=>"")]),f=x(c),h=x(u),g=x(p),m=M(f),y=M(h),b=M(g);return m>=y&&m>=b?f:y>=b?h:g}function O(e){if(!m(e))return;if(e.__liaAnnotTexReady){let t=e.__liaAnnotTexSync;t&&t();return}let t=document.createElement("span");t.className="lia-annot-tex-preview",t.dataset.on="0",t.innerHTML='<span class="lia-annot-tex-preview-math"></span><span class="lia-annot-tex-preview-hint">TeX</span>',e.insertAdjacentElement("afterend",t);let n=function(e){let t=e.classList;return!!t&&(!!(t.contains("is-success")||t.contains("is-failure")||t.contains("is-warning")||t.contains("is-partial")||t.contains("is-resolved"))||"true"===e.getAttribute("aria-invalid"))},a=function(e){let t=String(e||"").trim().toLowerCase();return!!t&&"transparent"!==t&&"rgba(0, 0, 0, 0)"!==t&&"rgba(0,0,0,0)"!==t},r=function(){if(t.style.removeProperty("--lia-annot-tex-preview-border"),!n(e))return;let r="";try{let t=getComputedStyle(e);r=t.borderTopColor||t.borderColor||t.outlineColor||""}catch(e){}a(r)&&t.style.setProperty("--lia-annot-tex-preview-border",r)};try{let t=new MutationObserver(function(){r()});t.observe(e,{attributes:!0,attributeFilter:["class","style","aria-invalid"]}),e.__liaAnnotTexBorderMo=t}catch(e){}r();let o=t.querySelector(".lia-annot-tex-preview-math"),l=function(){let n=(function(e){try{if(!e)return"";if(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)return String(e.value||"");if("true"===e.getAttribute("contenteditable")||"textbox"===e.getAttribute("role"))return String(e.textContent||"")}catch(e){}return""})(e).trim();if(r(),!n||document.activeElement===e){t.dataset.on="0",t.style.display="none",e.style.display="";return}t.dataset.on="1",t.style.display="inline-flex",e.style.display="none",o&&function(e,t){let n,a,r,o=b(t);if(e.innerHTML="",!o)return;let l=i.ROOT,s=window,d=s.katex||l.katex||s.KaTeX||l.KaTeX;try{if(d&&"function"==typeof d.render)return void d.render(o,e,{throwOnError:!1,displayMode:!1})}catch(e){}e.textContent=o,(n=i.ROOT,(r=(a=window).katex||n.katex||a.KaTeX||n.KaTeX)&&"function"==typeof r.render?Promise.resolve(r):T||(T=async function(){let e=n.document||document;if(!e.getElementById("__lia_annot_katex_css_v1")){let t=e.createElement("link");t.id="__lia_annot_katex_css_v1",t.rel="stylesheet",t.href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",(e.head||e.documentElement).appendChild(t)}let t=await Function("u","return import(u)")("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.mjs"),r=t.default||t;if(!r||"function"!=typeof r.render)throw Error("KaTeX render not available");try{n.katex||(n.katex=r)}catch(e){}try{a.katex||(a.katex=r)}catch(e){}return r}())).then(function(t){if(e.isConnected){e.innerHTML="";try{t.render(o,e,{throwOnError:!1,displayMode:!1})}catch(t){e.textContent=o}}}).catch(function(){e.isConnected&&(e.textContent=o)})}(o,n)};t.addEventListener("click",function(t){t.preventDefault(),t.stopPropagation(),e.style.display="";try{e.focus(),(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)&&e.select()}catch(e){}}),e.addEventListener("input",l),e.addEventListener("change",l),e.addEventListener("focus",l),e.addEventListener("blur",function(){setTimeout(l,0)}),e.__liaAnnotTexReady=!0,e.__liaAnnotTexSync=l,l()}function k(){let e=(0,o.getMarkedRect)();if(!e)return null;let t={x:e.x,y:e.y,w:e.w,h:e.h},n=(0,o.getPinnedQuizTarget)(),a=n&&m(n)?n:function(e){let t,n,a,r;if(!e||!i.STATE.canvas)return null;let l=(t=(0,o.getVisibleMainHost)(),n='input[type="text"], input:not([type]), textarea, [contenteditable="true"], [role="textbox"]',r=(a=t?Array.from(t.querySelectorAll(n)):[]).length?[]:Array.from(document.querySelectorAll(n)),(a.length?a:r).filter(m));if(!l.length)return null;let s=l.filter(y),d=s.length?s:l,c=i.STATE.canvas.getBoundingClientRect(),u=c.left+e.x+e.w/2,p=c.top+e.y+e.h/2,f=null,h=1/0;for(let e=0;e<d.length;e++){let t=d[e].getBoundingClientRect(),n=Math.hypot(t.left+t.width/2-u,t.top+t.height/2-p);n<h&&(h=n,f=d[e])}return f}(t);return a?{box:t,target:a}:null}async function _(){if(i.STORE.ui.ocrBusy||(0,i.isReadOnly)()||!i.STORE.ui.visible)return null;let e=f();if(!e||"function"!=typeof e.recognize)return null;await w(e);let t=k();if(!t)return null;v=t.target;let n=function(e){if(!e||!i.STATE.canvas)return null;let t=i.STATE.dpr||window.devicePixelRatio||1,n=(0,i.clamp)(Math.floor(e.x-12),0,i.STATE.cssW),a=(0,i.clamp)(Math.floor(e.y-12),0,i.STATE.cssH),r=(0,i.clamp)(Math.ceil(e.x+e.w+12),0,i.STATE.cssW),o=(0,i.clamp)(Math.ceil(e.y+e.h+12),0,i.STATE.cssH),l=Math.max(1,r-n),s=Math.max(1,o-a),d=Math.round(n*t),c=Math.round(a*t),u=Math.max(1,Math.round(l*t)),p=Math.max(1,Math.round(s*t)),f=document.createElement("canvas");f.width=u,f.height=p;let h=f.getContext("2d",{willReadFrequently:!0});if(!h)return null;h.setTransform(1,0,0,1,0,0),h.fillStyle="#fff",h.fillRect(0,0,f.width,f.height),h.drawImage(i.STATE.canvas,d,c,u,p,0,0,f.width,f.height);let g=h.getImageData(0,0,f.width,f.height),m=g.data;for(let e=0;e<m.length;e+=4){let t=.299*m[e]+.587*m[e+1]+.114*m[e+2]<210?0:255;m[e]=t,m[e+1]=t,m[e+2]=t,m[e+3]=255}return h.putImageData(g,0,0),f}(t.box);if(!n)return null;i.STORE.ui.ocrBusy=!0,(0,l.updateToolbar)();try{return await R(e,n)||null}catch(e){return null}finally{i.STORE.ui.ocrBusy=!1,(0,l.updateToolbar)()}}function C(e){let t=b(e);if(!t)return!1;let n=v&&m(v)?v:null;if(!n){let e=k();if(!e)return!1;n=e.target}let a=function(e,t){let n=String(null==t?"":t);try{if(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)return e.focus(),e.value=n,e.dispatchEvent(new Event("input",{bubbles:!0})),e.dispatchEvent(new Event("change",{bubbles:!0})),e.dispatchEvent(new KeyboardEvent("keyup",{bubbles:!0,key:"Enter"})),e.dispatchEvent(new Event("blur",{bubbles:!0})),O(e),!0;if("true"===e.getAttribute("contenteditable")||"textbox"===e.getAttribute("role"))return e.focus(),e.textContent=n,e.dispatchEvent(new Event("input",{bubbles:!0})),e.dispatchEvent(new Event("change",{bubbles:!0})),O(e),!0}catch(e){}return!1}(n,t);return a&&(v=n),a}async function z(){let e=await _();return!!e&&C(e)}function q(e){let t=Number(e);return isFinite(t)?Math.round(1e4*t)/1e4:null}function P(e){if(!e||"object"!=typeof e)return null;let t=q(e.x),n=q(e.y);return null===t||null===n?null:{x:t,y:n}}function L(e){if(!e||"object"!=typeof e||"path"!==e.kind)return null;let t=Array.isArray(e.points)?e.points.map(P).filter(e=>null!==e):[];if(!t.length)return null;let n="eraser"===e.tool?"eraser":"pen",a=q(e.width),r=q(null==e.alpha?1:e.alpha),i=q(e.baseW);return{kind:"path",tool:n,color:String(e.color||"#ff0000"),width:null===a?1:a,alpha:null===r?1:r,baseW:null===i?1:i,points:t}}function N(e){let t={};if(!e||"object"!=typeof e)return t;for(let n in e){if(!Object.prototype.hasOwnProperty.call(e,n))continue;let a=e[n];if(!a||"object"!=typeof a)continue;let r=Array.isArray(a.items)?a.items.map(L).filter(e=>null!==e):[];r.length&&(t[String(n)]={items:r,redo:[]})}return t}function F(e){if(!e||"object"!=typeof e)return null;let t=String(e.id||"").trim();if(!t||!/^[A-Za-z0-9_-]+$/.test(t))return null;let n=Number(e.x),a=Number(e.y),r=Number(e.w),i=Number(e.h);if(!isFinite(n)||!isFinite(a)||!isFinite(r)||!isFinite(i))return null;let o=String(e.spec||"").trim(),l=String(e.language||"").trim().toLowerCase();return{id:t,x:Math.max(0,Math.round(n)),y:Math.max(0,Math.round(a)),w:Math.max(120,Math.round(r)),h:Math.max(90,Math.round(i)),spec:o||void 0,language:"de"===l?"de":"en"===l?"en":void 0}}function I(){let e=N(i.STORE.slides);for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!0;return!1}function D(){return(0,i.copyJson)({version:"lia-annotation-v8",ui:{visible:!!i.STORE.ui.visible},slides:i.STORE.slides})}function W(){return(0,i.copyJson)({version:"lia-annotation-freeze-v1",ui:{visible:!!i.STORE.ui.visible},slides:N(i.STORE.slides)})}function j(e,t){let n=!1!==(t&&"object"==typeof t?t:{}).replace;if(!e||"object"!=typeof e)return!1;if(n&&(i.STORE.slides={}),e.slides&&"object"==typeof e.slides){let t=e.slides;for(let e in t){if(!Object.prototype.hasOwnProperty.call(t,e))continue;let n=t[e];n&&"object"==typeof n&&(i.STORE.slides[e]={items:Array.isArray(n.items)?(0,i.copyJson)(n.items):[],redo:Array.isArray(n.redo)?(0,i.copyJson)(n.redo):[],widgets:Array.isArray(n.widgets)?n.widgets.map(F).filter(e=>null!==e):[]})}}if(e.ui&&"object"==typeof e.ui){let t=e.ui;"boolean"==typeof t.visible&&(i.STORE.ui.visible=t.visible)}return(0,i.ensureSlide)((0,i.getSlideKey)()),(0,o.ensureOverlay)(),(0,o.syncOverlayInteractivity)(),(0,o.requestSync)(),(0,o.requestRedraw)(),(0,l.updateToolbar)(),!0}function B(e,t){let n=!1!==(t&&"object"==typeof t?t:{}).replace;if(!e||"object"!=typeof e)return!1;n&&(i.STORE.slides={});let a=N(e.slides);for(let e in a)Object.prototype.hasOwnProperty.call(a,e)&&(i.STORE.slides[e]={items:(0,i.copyJson)(a[e].items)||[],redo:[]});if(e.ui&&"object"==typeof e.ui){let t=e.ui;"boolean"==typeof t.visible&&(i.STORE.ui.visible=t.visible)}return(0,i.ensureSlide)((0,i.getSlideKey)()),(0,o.ensureOverlay)(),(0,o.syncOverlayInteractivity)(),(0,o.requestSync)(),(0,o.requestRedraw)(),(0,l.updateToolbar)(),!0}function H(e){i.STORE.ui.visible=!!e,(0,o.syncOverlayInteractivity)(),(0,o.requestRedraw)(),(0,l.updateToolbar)()}function X(e){i.STORE.ui.forcedReadOnly=null===e?null:!!e,(0,o.syncOverlayInteractivity)(),(0,l.updateToolbar)()}function Y(){window.__LIA_ANNOTATION__={exportState:D,exportFreezeState:W,importState:j,importFreezeState:B,hasFreezeData:I,setVisible:H,toggleVisible:()=>H(!i.STORE.ui.visible),setReadOnly:X,clearSlide:c,clearAllSlides:u,isOcrAvailable:h,recognizeLatestAnnotationText:_,submitOcrTextToNearestQuiz:C,transferToNearestQuiz:z,startDgsPlacementMode:o.startDgsPlacementMode,refresh:function(){(0,o.ensureOverlay)(),(0,o.requestSync)(),(0,l.updateToolbar)()},getStore:function(){return(0,i.copyJson)(i.STORE)},getSlideKey:function(){return(0,i.getSlideKey)()}},window.__LIA_ANNOTATION_EXPORT__=function(){return D()},window.__LIA_ANNOTATION_IMPORT__=function(e,t){return j(e,t)},window.__LIA_ANNOTATION_FREEZE_EXPORT__=function(){return W()},window.__LIA_ANNOTATION_FREEZE_IMPORT__=function(e,t){return B(e,t)},window.__LIA_ANNOTATION_FREEZE_HAS_DATA__=function(){return I()}}},{"./store":"cswaT","./overlay":"8rPw4","./ui":"7Wjmu","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}]},["8RSWf"],"8RSWf","parcelRequire23ca",{});
//# sourceMappingURL=index.js.map
