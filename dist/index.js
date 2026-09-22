!function(e,t,n,a,r){var i="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:"u">typeof global?global:{},o="function"==typeof i[a]&&i[a],l=o.i||{},s=o.cache||{},c="u">typeof module&&"function"==typeof module.require&&module.require.bind(module);function d(t,n){if(!s[t]){if(!e[t]){if(r[t])return r[t];var l="function"==typeof i[a]&&i[a];if(!n&&l)return l(t,!0);if(o)return o(t,!0);if(c&&"string"==typeof t)return c(t);var u=Error("Cannot find module '"+t+"'");throw u.code="MODULE_NOT_FOUND",u}f.resolve=function(n){var a=e[t][1][n];return null!=a?a:n},f.cache={};var p=s[t]=new d.Module(t);e[t][0].call(p.exports,f,p,p.exports,i)}return s[t].exports;function f(e){var t=f.resolve(e);if(!1===t)return{};if(Array.isArray(t)){var n={__esModule:!0};return t.forEach(function(e){var t=e[0],a=e[1],r=e[2]||e[0],i=d(a);"*"===t?Object.keys(i).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:function(){return i[e]}})}):"*"===r?Object.defineProperty(n,t,{enumerable:!0,value:i}):Object.defineProperty(n,t,{enumerable:!0,get:function(){return"default"===r?i.__esModule?i.default:i:i[r]}})}),n}return d(t)}}d.isParcelRequire=!0,d.Module=function(e){this.id=e,this.bundle=d,this.require=c,this.exports={}},d.modules=e,d.cache=s,d.parent=o,d.distDir=void 0,d.publicUrl=void 0,d.devServer=void 0,d.i=l,d.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(d,"root",{get:function(){return i[a]}}),i[a]=d;for(var u=0;u<t.length;u++)d(t[u]);if(n){var p=d(n);"object"==typeof exports&&"u">typeof module?module.exports=p:"function"==typeof define&&define.amd&&define(function(){return p})}}({"8RSWf":[function(e,t,n,a){var r=e("./store"),i=e("./ui"),o=e("./overlay"),l=e("./api");if(!r.IS_DUPLICATE){(0,i.setToolbarCallbacks)({requestRedraw:o.requestRedraw,requestSync:o.requestSync,syncOverlayInteractivity:o.syncOverlayInteractivity,ensureOverlay:o.ensureOverlay,doUndo:l.doUndo,doRedo:l.doRedo,clearSlide:l.clearSlide,transferToNearestQuiz:l.transferToNearestQuiz,recognizeLatestAnnotationText:l.recognizeLatestAnnotationText,submitOcrTextToNearestQuiz:l.submitOcrTextToNearestQuiz,isOcrAvailable:l.isOcrAvailable,startDgsPlacementMode:o.startDgsPlacementMode}),(0,i.setGetVisibleMainHost)(o.getVisibleMainHost),(0,o.setOverlayCallbacks)({submitMarkedRect:l.transferToNearestQuiz,shouldPromptDgsInsert:l.shouldPromptDgsInsert}),(0,i.ensureCss)(),(0,i.applyThemeVars)(),(0,i.ensureToolbar)(),(0,r.ensureSlide)((0,r.getSlideKey)()),(0,o.ensureOverlay)(),(0,i.syncToolbarPosition)(),(0,i.updateToolbar)(),(0,l.registerGlobalApi)(),setTimeout(o.requestSync,0),setTimeout(o.requestSync,80),setTimeout(o.requestSync,250),setTimeout(o.requestSync,700),window.addEventListener("resize",function(){c(),(0,o.requestSync)()}),window.addEventListener("hashchange",function(){(0,o.exitQuizPickingMode)(),(0,o.clearMarkedRect)(),r.STORE.ui.ocrBusy=!1,r.STORE.ui.ocrDraft="",r.STORE.ui.ocrFailed=!1,(0,r.ensureSlide)((0,r.getSlideKey)()),(0,o.ensureOverlay)(),(0,i.updateToolbar)(),setTimeout(o.requestSync,40),setTimeout(o.requestSync,180),setTimeout(o.requestSync,500)}),window.addEventListener("scroll",function(){(0,o.requestSync)()},!0),document.addEventListener("input",function(){(0,o.requestSync)()},!0),document.addEventListener("change",function(){(0,o.requestSync)()},!0);let e=new Set(["--lia-annot-border","--lia-annot-fg","--lia-annot-accent","--lia-annot-bg","--lia-annot-panel-bg"]);function s(){return JSON.stringify([document.documentElement,document.body].map(function(t){if(!t)return null;let n=Array.from(t.style).filter(n=>t!==document.documentElement||!e.has(n)).sort().map(e=>[e,t.style.getPropertyValue(e),t.style.getPropertyPriority(e)]);return[t.className,n]}))}let t=s(),n=0;function c(){n||(n=requestAnimationFrame(function(){n=0,t=s(),(0,i.applyThemeVars)(),(0,i.updateToolbar)(),(0,o.syncOverlayInteractivity)(),(0,o.requestSync)(),(0,o.requestRedraw)()}))}let a=new MutationObserver(function(){s()!==t&&c()});try{a.observe(document.documentElement,{attributes:!0,attributeFilter:["class","style"]}),document.body&&a.observe(document.body,{attributes:!0,attributeFilter:["class","style"]})}catch(e){}let d=(0,l.isOcrAvailable)(),u=window.setInterval(function(){let e=(0,l.isOcrAvailable)();e!==d&&(d=e,(0,i.updateToolbar)())},1200);window.addEventListener("pagehide",function(){window.clearInterval(u)})}},{"./store":"cswaT","./ui":"7Wjmu","./overlay":"8rPw4","./api":"bH1QJ"}],cswaT:[function(e,t,n,a){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"ROOT",()=>i),r.export(n,"DOC_ID",()=>o),r.export(n,"IS_DUPLICATE",()=>d),r.export(n,"STORE",()=>u),r.export(n,"STATE",()=>p),r.export(n,"clamp",()=>f),r.export(n,"copyJson",()=>h),r.export(n,"parseRgbNoRegex",()=>g),r.export(n,"luminance",()=>m),r.export(n,"getViewportWidth",()=>y),r.export(n,"getCurrentHash",()=>b),r.export(n,"getSlideKey",()=>x),r.export(n,"ensureSlide",()=>T),r.export(n,"currentSlide",()=>S),r.export(n,"toRel",()=>v),r.export(n,"fromRel",()=>w),r.export(n,"isReadOnly",()=>E),r.export(n,"effectiveMode",()=>A),r.export(n,"getLineWidthPx",()=>M);let i=function(){let e=window;try{for(;e.parent&&e.parent!==e;)e=e.parent}catch(e){}return e}(),o=document.baseURI||location.href||"doc",l="__LIA_ANNOTATION_REG_V8__",s="__LIA_ANNOTATION_STORE_V8__";i[l]=i[l]||{docs:{}};let c=i[l],d=!!c.docs[o];c.docs[o]=!0,i[s]=i[s]||{slides:{},ui:{mode:"cursor",visible:!0,panelOpen:!1,panelMode:"pen",color:"#ff0000",width:3,alpha:1,eraserWidth:18,ocrBusy:!1,ocrDraft:"",ocrFailed:!1,forcedReadOnly:null}};let u=i[s];"boolean"!=typeof u.ui.ocrBusy&&(u.ui.ocrBusy=!1),"string"!=typeof u.ui.ocrDraft&&(u.ui.ocrDraft=""),"boolean"!=typeof u.ui.ocrFailed&&(u.ui.ocrFailed=!1);let p={host:null,shell:null,canvas:null,ctx:null,slideKey:null,cssW:0,cssH:0,dpr:window.devicePixelRatio||1,drawing:!1,activePath:null,syncRAF:0,resizeObserver:null,toolbar:null,eraserRing:null,lastPointer:{x:0,y:0,inside:!1,pointerType:""}};function f(e,t,n){return Math.max(t,Math.min(n,e))}function h(e){try{return JSON.parse(JSON.stringify(e))}catch(e){return null}}function g(e){let t=String(e||""),n=t.indexOf("("),a=t.indexOf(")");if(n<0||a<0)return null;let r=t.slice(n+1,a).split(",").map(e=>Number(String(e).trim()));return!(r.length<3)&&isFinite(r[0])&&isFinite(r[1])&&isFinite(r[2])?[r[0],r[1],r[2]]:null}function m(e){let t=e.map(e=>e/255).map(e=>e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4));return .2126*t[0]+.7152*t[1]+.0722*t[2]}function y(){return Math.max(1,window.innerWidth||0,document.documentElement&&document.documentElement.clientWidth||0)}function b(){return String(location.hash||"").trim()||"#1"}function x(){return b()}function T(e){return u.slides[e]=u.slides[e]||{items:[],redo:[],widgets:[]},Array.isArray(u.slides[e].widgets)||(u.slides[e].widgets=[]),u.slides[e]}function S(){return T(x())}function v(e,t){return{x:p.cssW>0?e/p.cssW:0,y:p.cssH>0?t/p.cssH:0}}function w(e){return{x:e&&isFinite(e.x)?e.x*p.cssW:0,y:e&&isFinite(e.y)?e.y*p.cssH:0}}function E(){if(!0===u.ui.forcedReadOnly)return!0;if(!1===u.ui.forcedReadOnly)return!1;let e=document.body;return!!e&&(e.classList.contains("lia-snapshot-mode")||e.classList.contains("lia-shared-freeze-link")||e.classList.contains("lia-freeze-mode"))}function A(){return!u.ui.visible||E()?"cursor":u.ui.mode||"cursor"}function M(e){let t=Math.max(1,Number(e&&e.baseW)||p.cssW||1);return Math.max(.75,Math.max(1,p.cssW||1)/t*Math.max(.75,Number(e&&e.width)||1))}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],k3151:[function(e,t,n,a){n.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},n.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.exportAll=function(e,t){return Object.keys(e).forEach(function(n){"default"===n||"__esModule"===n||Object.prototype.hasOwnProperty.call(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:function(){return e[n]}})}),t},n.export=function(e,t,n){Object.defineProperty(e,t,{enumerable:!0,get:n})}},{}],"7Wjmu":[function(e,t,n,a){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"getThemeAccent",()=>p),r.export(n,"applyThemeVars",()=>f),r.export(n,"ensureCss",()=>h),r.export(n,"iconEye",()=>g),r.export(n,"hideEraserRing",()=>m),r.export(n,"updateEraserRing",()=>y),r.export(n,"refreshEraserRing",()=>b),r.export(n,"tUi",()=>E),r.export(n,"setToolbarCallbacks",()=>k),r.export(n,"ensureToolbar",()=>_),r.export(n,"updateToolbar",()=>z),r.export(n,"syncToolbarPosition",()=>C),r.export(n,"setGetVisibleMainHost",()=>P);var i=e("./store"),o=e("./styles"),l=e("./dom");function s(e,t){e.disabled!==t&&(e.disabled=t)}function c(e,t){e&&document.activeElement!==e&&e.value!==t&&(e.value=t)}let d=null;function u(e){return!e||"transparent"===e||/^rgba\([^)]*,\s*0(?:\.0+)?\s*\)$/.test(e)}function p(){try{let e=document.querySelector(".lia-btn");if(e){let t=getComputedStyle(e).backgroundColor;if(!u(t))return t}d&&d.isConnected||((d=document.createElement("button")).className="lia-btn",d.type="button",d.setAttribute("aria-hidden","true"),d.tabIndex=-1,d.style.position="absolute",d.style.left="-9999px",d.style.top="-9999px",d.style.visibility="hidden",(document.body||document.documentElement).appendChild(d));let t=getComputedStyle(d).backgroundColor;if(!u(t))return t}catch(e){}return null}function f(){try{let e=document.documentElement,t=getComputedStyle(document.body||e).backgroundColor;u(t)&&(t=getComputedStyle(e).backgroundColor);let n=u(t)?null:(0,i.parseRgbNoRegex)(t),a=!!n&&.5>(0,i.luminance)(n);(0,l.setStyle)(e,"--lia-annot-border",a?"#fff":"#000"),(0,l.setStyle)(e,"--lia-annot-fg",a?"#fff":"#000");let r=p();r&&(0,l.setStyle)(e,"--lia-annot-accent",r),a?((0,l.setStyle)(e,"--lia-annot-bg","rgba(28,28,28,0.96)"),(0,l.setStyle)(e,"--lia-annot-panel-bg","rgba(34,34,34,0.97)")):((0,l.setStyle)(e,"--lia-annot-bg","rgba(255,255,255,0.96)"),(0,l.setStyle)(e,"--lia-annot-panel-bg","rgba(255,255,255,0.97)"))}catch(e){}}function h(){if(document.getElementById("__lia_annotation_css_v8"))return;let e=document.createElement("style");e.id="__lia_annotation_css_v8",e.textContent=o.CSS,(document.head||document.documentElement).appendChild(e)}function g(e){return e?`<svg viewBox="0 0 24 24" aria-hidden="true">
      <path class="ico-stroke" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/>
      <circle cx="12" cy="12" r="3.2" class="ico-stroke"></circle>
    </svg>`:`<svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M3 3l18 18"/>
    <path class="ico-stroke" d="M2.5 12s3.5-6 9.5-6c1.8 0 3.3.5 4.6 1.2"/>
    <path class="ico-stroke" d="M21.5 12s-3.5 6-9.5 6c-1.8 0-3.4-.5-4.8-1.3"/>
  </svg>`}function m(){i.STATE.eraserRing&&(0,l.setAttribute)(i.STATE.eraserRing,"data-on","0")}function y(e,t){if(!i.STATE.eraserRing)return;if(!i.STORE.ui.visible||(0,i.isReadOnly)()||"eraser"!==(0,i.effectiveMode)()||!isFinite(e)||!isFinite(t)||!isFinite(i.STATE.cssW)||!isFinite(i.STATE.cssH))return void m();let n=Math.max(8,Number(i.STORE.ui.eraserWidth||18));(0,l.setStyle)(i.STATE.eraserRing,"width",n+"px"),(0,l.setStyle)(i.STATE.eraserRing,"height",n+"px"),(0,l.setStyle)(i.STATE.eraserRing,"left",(0,i.clamp)(e,0,i.STATE.cssW)+"px"),(0,l.setStyle)(i.STATE.eraserRing,"top",(0,i.clamp)(t,0,i.STATE.cssH)+"px"),(0,l.setAttribute)(i.STATE.eraserRing,"data-on","1")}function b(){i.STATE.lastPointer&&i.STATE.lastPointer.inside?y(i.STATE.lastPointer.x,i.STATE.lastPointer.y):m()}let x={colors:{en:"Colors",de:"Farben",es:"Colores",fr:"Couleurs"},penWidth:{en:"Pen Width",de:"Stiftbreite",es:"Grosor del lápiz",fr:"Épaisseur du stylo"},opacity:{en:"Opacity",de:"Deckkraft",es:"Opacidad",fr:"Opacité"},eraser:{en:"Eraser",de:"Radierer",es:"Borrador",fr:"Gomme"},clearAll:{en:"Clear all",de:"Alles löschen",es:"Borrar todo",fr:"Tout effacer"},ocrTransfer:{en:"Submit as solution",de:"Als Lösung übernehmen",es:"Enviar como solucion",fr:"Soumettre comme solution"},rectSubmit:{en:"Submit as Solution",de:"Als Lösung übernehmen",es:"Enviar como solucion",fr:"Soumettre comme solution"},rectChooseQuiz:{en:"Choose Quiz",de:"Quiz wählen",es:"Elegir quiz",fr:"Choisir quiz"},rectChooseCancel:{en:"Cancel",de:"Abbrechen",es:"Cancelar",fr:"Annuler"},rectChosenFallback:{en:"Quiz",de:"Quiz",es:"Quiz",fr:"Quiz"},rectClearAria:{en:"Clear marked rectangle",de:"Markiertes Rechteck löschen",es:"Borrar rectangulo marcado",fr:"Effacer le rectangle marqué"},ocrRecognize:{en:"Recognize",de:"Erkennen",es:"Reconocer",fr:"Reconnaître"},ocrSubmit:{en:"Insert into quiz",de:"In Quizfeld einsetzen",es:"Insertar en quiz",fr:"Insérer dans le quiz"},ocrResult:{en:"OCR Result",de:"OCR Ergebnis",es:"Resultado OCR",fr:"Résultat OCR"},ocrHint:{en:"Preview updates automatically as TeX.",de:"Vorschau aktualisiert sich automatisch als TeX.",es:"La vista previa se actualiza automaticamente como TeX.",fr:"L'aperçu se met automatiquement à jour en TeX."},ocrFailed:{en:"Recognition failed. Try drawing more clearly.",de:"Erkennung fehlgeschlagen. Bitte deutlicher schreiben.",es:"Reconocimiento fallido. Intente escribir más claro.",fr:"Reconnaissance échouée. Essayez d'écrire plus clairement."},penWidthAria:{en:"Pen width",de:"Stiftbreite",es:"Grosor del lápiz",fr:"Épaisseur du stylo"},opacityAria:{en:"Opacity",de:"Deckkraft",es:"Opacidad",fr:"Opacité"},eraserWidthAria:{en:"Eraser width",de:"Radierergröße",es:"Tamaño del borrador",fr:"Taille de la gomme"},colorAria:{en:"Color",de:"Farbe",es:"Color",fr:"Couleur"},readOnlyNote:{en:"Freeze/read-only mode: drawing is locked, show/hide still works.",de:"Freeze-/Nur-Lese-Modus: Zeichnen ist gesperrt, Anzeigen/Ausblenden funktioniert weiter.",es:"Modo congelado/solo lectura: dibujar está bloqueado, mostrar/ocultar sigue funcionando.",fr:"Mode figé/lecture seule: dessin verrouillé, afficher/masquer fonctionne encore."}};function T(e){if(!e)return null;let t=String(e).trim().toLowerCase().replace(/_/g,"-");if(!t)return null;let n=t.split("-")[0];return"de"===n||"es"===n||"en"===n||"fr"===n?n:null}let S=null;function v(){if(S)return S;try{let e,t,n=new URLSearchParams(String(location.search||"")),a=T(n.get("language")||n.get("lang"));if(a)return S=a;let r=new URLSearchParams((t=(e=String(location.hash||"")).indexOf("?"))>=0?e.slice(t+1):""),i=T(r.get("language")||r.get("lang"));if(i)return S=i;let o=T(document.documentElement&&document.documentElement.lang);if(o)return S=o;let l=T(document.body&&(document.body.getAttribute("lang")||document.body.getAttribute("data-language")));if(l)return S=l;let s=T(navigator&&(navigator.language||navigator.languages&&navigator.languages[0])||"");if(s)return S=s}catch(e){}return S="en"}function w(e,t){let n=x[t];return n&&n[e]||n.en}function E(e,t){return w(t||v(),e)}let A=null,M=new WeakMap,O=new WeakMap,R=null;function k(e){R=e}function _(){if(i.STATE.toolbar&&i.STATE.toolbar.isConnected)return i.STATE.toolbar;let e=document.createElement("div");e.className="lia-annot-toolbar",e.setAttribute("data-snapshot-admin","1"),e.innerHTML=`
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
      <button class="lia-annot-btn" type="button" data-act="toggle" aria-label="Show/hide annotations" aria-pressed="true" title="Show/hide annotations" data-snapshot-admin="1">${g(!0)}</button>
    </div>
    <div class="lia-annot-panel" data-open="0"></div>
  `;let t=e.querySelector('[data-act="toggle"]');return O.set(t,!0),(document.body||document.documentElement).appendChild(e),e.addEventListener("click",function(e){let t=e.target,n=t&&t.closest?t.closest("button[data-act]"):null,a=t&&t.closest?t.closest("button[data-color]"):null;if(a){if(e.preventDefault(),e.stopPropagation(),(0,i.isReadOnly)())return;i.STORE.ui.color=String(a.getAttribute("data-color")||"#ff0000"),z();return}if(!n)return;e.preventDefault(),e.stopPropagation();let r=String(n.getAttribute("data-act")||"");if("toggle"===r){R?.ensureOverlay(),i.STORE.ui.visible=!i.STORE.ui.visible,R?.syncOverlayInteractivity(),z(),R?.requestRedraw(),R?.requestSync();return}if("cursor"===r){i.STORE.ui.mode="cursor",i.STORE.ui.panelOpen=!1,R?.syncOverlayInteractivity(),z();return}if("pen"===r){if((0,i.isReadOnly)())return;let e="pen"===i.STORE.ui.mode&&"pen"===i.STORE.ui.panelMode&&i.STORE.ui.panelOpen;i.STORE.ui.mode="pen",i.STORE.ui.panelMode="pen",i.STORE.ui.panelOpen=!e,R?.syncOverlayInteractivity(),z();return}if("eraser"===r){if((0,i.isReadOnly)())return;let e="eraser"===i.STORE.ui.mode&&"eraser"===i.STORE.ui.panelMode&&i.STORE.ui.panelOpen;i.STORE.ui.mode="eraser",i.STORE.ui.panelMode="eraser",i.STORE.ui.panelOpen=!e,R?.syncOverlayInteractivity(),z();return}if("undo"===r){if((0,i.isReadOnly)())return;R?.doUndo();return}if("redo"===r){if((0,i.isReadOnly)())return;R?.doRedo();return}if("clear"===r){if((0,i.isReadOnly)())return;R?.clearSlide();return}if("ocr-transfer"===r){if((0,i.isReadOnly)()||!i.STORE.ui.visible||!R?.isOcrAvailable())return;i.STORE.ui.panelOpen=!1,i.STORE.ui.mode="rect",R?.syncOverlayInteractivity(),z();return}if("dgs-place"===r){if((0,i.isReadOnly)()||!i.STORE.ui.visible||!R?.startDgsPlacementMode)return;i.STORE.ui.panelOpen=!1,R.startDgsPlacementMode(),z();return}if("ocr-recognize"===r){if((0,i.isReadOnly)()||i.STORE.ui.ocrBusy||!i.STORE.ui.visible||!R||!R.isOcrAvailable()||!R.recognizeLatestAnnotationText)return;i.STORE.ui.ocrFailed=!1,R.recognizeLatestAnnotationText().then(function(e){"string"==typeof e&&e.trim()?(i.STORE.ui.ocrDraft=e,i.STORE.ui.ocrFailed=!1):i.STORE.ui.ocrFailed=!0,z(),R?.requestSync()});return}if("ocr-submit"===r){if((0,i.isReadOnly)()||i.STORE.ui.ocrBusy||!R?.submitOcrTextToNearestQuiz)return;R.submitOcrTextToNearestQuiz(String(i.STORE.ui.ocrDraft||"")),R.requestSync(),z();return}},!0),e.addEventListener("input",function(e){let t=e.target;if(!(t instanceof HTMLElement))return;let n=String(t.getAttribute("data-act")||"");if(!(0,i.isReadOnly)()){if("width"===n){i.STORE.ui.width=(0,i.clamp)(Number(t.value),1,24),z();return}if("alpha"===n){i.STORE.ui.alpha=(0,i.clamp)(Number(t.value),.1,1),z();return}if("eraserWidth"===n){i.STORE.ui.eraserWidth=(0,i.clamp)(Number(t.value),4,80),z();return}if("ocr-input"===n){i.STORE.ui.ocrDraft=String(t.value||""),z();return}}},!0),i.STATE.toolbar=e,e}function z(){let e=_(),t=(0,i.currentSlide)(),n=(0,i.isReadOnly)(),a=v(),r=e.querySelector(".lia-annot-panel");if(r){let e=i.STORE.ui.panelOpen&&!n?"1":"0",t="eraser"===i.STORE.ui.panelMode?"eraser":"ocr"===i.STORE.ui.panelMode?"ocr":"pen",o=String(r.dataset.builtMode||""),s=String(r.dataset.builtLang||"");if((0,l.setAttribute)(r,"data-open",e),!r.firstElementChild||o!==t||s!==a){if("eraser"===t)r.innerHTML=`
    <div class="lia-annot-row">
      <span class="k">${w(a,"eraser")}</span>
      <input class="lia-annot-slider" type="range" min="4" max="80" step="1" value="${i.STORE.ui.eraserWidth}" data-act="eraserWidth" aria-label="${w(a,"eraserWidthAria")}" data-snapshot-admin="1">
      <span class="v" data-k="eraserWidth">${i.STORE.ui.eraserWidth}</span>
    </div>
    <div class="lia-annot-row">
      <button class="lia-annot-danger" type="button" data-act="clear" data-snapshot-admin="1">${w(a,"clearAll")}</button>
    </div>
    <div class="lia-annot-note" data-k="note"></div>
  `;else if("ocr"===t)r.innerHTML=`
    <div class="lia-annot-row lia-annot-row--ocr-title">
      <span class="k">${w(a,"ocrResult")}</span>
    </div>
    <div class="lia-annot-row lia-annot-row--ocr-input">
      <textarea class="lia-annot-ocr-input" data-act="ocr-input" rows="3" data-snapshot-admin="1"></textarea>
    </div>
    <div class="lia-annot-row lia-annot-row--ocr-actions">
      <button class="lia-annot-primary" type="button" data-act="ocr-recognize" data-snapshot-admin="1">${w(a,"ocrRecognize")}</button>
      <button class="lia-annot-primary" type="button" data-act="ocr-submit" data-snapshot-admin="1">${w(a,"ocrSubmit")}</button>
    </div>
    <div class="lia-annot-ocr-preview" data-on="0">
      <div class="lia-annot-ocr-preview-math" data-k="ocrPreview"></div>
    </div>
    <div class="lia-annot-note" data-k="ocrHint">${w(a,"ocrHint")}</div>
    <div class="lia-annot-note" data-k="note"></div>
  `;else{let e;e=["#ff0000","#ff7500","#ffff00","#ff00ff","#0055ff","#00ffff","#00ff00","#007500","#000000","#ffffff"].map(function(e){return'<button class="lia-annot-color-item" type="button" data-color="'+e+'" aria-label="'+w(a,"colorAria")+" "+e+'" data-snapshot-admin="1" style="background:'+e+';"></button>'}).join(""),r.innerHTML=`
    <div class="lia-annot-row">
      <span class="k">${w(a,"colors")}</span>
      <span class="lia-annot-color-grid">${e}</span>
    </div>
    <div class="lia-annot-row">
      <span class="k">${w(a,"penWidth")}</span>
      <input class="lia-annot-slider" type="range" min="1" max="24" step="1" value="${i.STORE.ui.width}" data-act="width" aria-label="${w(a,"penWidthAria")}" data-snapshot-admin="1">
      <span class="v" data-k="width">${i.STORE.ui.width}</span>
    </div>
    <div class="lia-annot-row">
      <span class="k">${w(a,"opacity")}</span>
      <input class="lia-annot-slider" type="range" min="0.1" max="1" step="0.05" value="${i.STORE.ui.alpha}" data-act="alpha" aria-label="${w(a,"opacityAria")}" data-snapshot-admin="1">
      <span class="v" data-k="alpha">${Math.round(100*Number(i.STORE.ui.alpha||1))}%</span>
    </div>
    <div class="lia-annot-note" data-k="note"></div>
  `}(0,l.setAttribute)(r,"data-built-mode",t),(0,l.setAttribute)(r,"data-built-lang",a)}"ocr"===t&&function(e){if(!e)return;let t=e.querySelector(".lia-annot-ocr-preview"),n=e.querySelector('[data-k="ocrPreview"]');if(!t||!n)return;let a=String(i.STORE.ui.ocrDraft||"").trim();(0,l.setAttribute)(t,"data-on",a?"1":"0"),function(e,t){let n,a,r,i=String(t||"").trim();if(M.get(e)?.source===i)return;let o={source:i};if(M.set(e,o),!i)return(0,l.setText)(e,"");let s=window,c=window.top,d=s.katex||c&&c.katex||s.KaTeX||c&&c.KaTeX;try{if(d&&"function"==typeof d.render)return void d.render(i,e,{throwOnError:!1,displayMode:!1})}catch(e){}(0,l.setText)(e,i),(n=window,a=window.top,(r=n.katex||a&&a.katex||n.KaTeX||a&&a.KaTeX)&&"function"==typeof r.render?Promise.resolve(r):A||(A=async function(){if(!document.getElementById("__lia_annot_katex_css_v1")){let e=document.createElement("link");e.id="__lia_annot_katex_css_v1",e.rel="stylesheet",e.href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",(document.head||document.documentElement).appendChild(e)}let e=await Function("u","return import(u)")("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.mjs"),t=e.default||e;if(!t||"function"!=typeof t.render)throw Error("KaTeX render not available");try{n.katex||(n.katex=t)}catch(e){}try{a&&!a.katex&&(a.katex=t)}catch(e){}return t}())).then(function(t){if(e.isConnected&&M.get(e)===o)try{t.render(i,e,{throwOnError:!1,displayMode:!1})}catch(t){M.delete(e),(0,l.setText)(e,i)}}).catch(function(){e.isConnected&&M.get(e)===o&&(M.delete(e),(0,l.setText)(e,i))})}(n,a)}(r)}let o=r?r.querySelector('[data-k="note"]'):null;o&&(0,l.setText)(o,n?w(a,"readOnlyNote"):"");let d=e.querySelectorAll(".lia-annot-btn[data-act]"),u=!!R?.isOcrAvailable&&R.isOcrAvailable();if(u||"rect"!==i.STORE.ui.mode||(i.STORE.ui.mode="cursor",R?.syncOverlayInteractivity()),d.forEach(function(e){let r=String(e.getAttribute("data-act")||""),o="toggle"===r?!!i.STORE.ui.visible:r===i.STORE.ui.mode||"ocr-transfer"===r&&"rect"===i.STORE.ui.mode,c="ocr-transfer"===r&&!!i.STORE.ui.ocrBusy;(0,l.setAttribute)(e,"data-active",o?"1":"0"),(0,l.setAttribute)(e,"data-busy",c?"1":"0"),"toggle"===r&&O.get(e)!==!!i.STORE.ui.visible&&(e.innerHTML=g(!!i.STORE.ui.visible),O.set(e,!!i.STORE.ui.visible)),("cursor"===r||"pen"===r||"eraser"===r||"toggle"===r)&&(0,l.setAttribute)(e,"aria-pressed",o?"true":"false");let d=!1;"undo"===r?d=n||0===t.items.length:"redo"===r?d=n||0===t.redo.length:"dgs-place"===r?d=n||!i.STORE.ui.visible:"ocr-transfer"===r?(d=n||!i.STORE.ui.visible||i.STORE.ui.ocrBusy||!u,!u!==e.hidden&&(e.hidden=!u),(0,l.setStyle)(e,"display",u?"":"none"),(0,l.setAttribute)(e,"title",w(a,"ocrTransfer")),(0,l.setAttribute)(e,"aria-label",w(a,"ocrTransfer"))):("pen"===r||"eraser"===r)&&(d=n),s(e,d)}),r){r.querySelectorAll(".lia-annot-color-item").forEach(function(e){let t=String(e.getAttribute("data-color")||"");(0,l.setAttribute)(e,"data-active",t===String(i.STORE.ui.color||"")?"1":"0"),s(e,n)});let e=r.querySelector('.lia-annot-danger[data-act="clear"]');e&&s(e,n||0===t.items.length);let o=r.querySelector('input[data-act="width"]'),d=r.querySelector('input[data-act="alpha"]'),p=r.querySelector('input[data-act="eraserWidth"]'),f=r.querySelector('textarea[data-act="ocr-input"]'),h=r.querySelector('button[data-act="ocr-recognize"]'),g=r.querySelector('button[data-act="ocr-submit"]'),m=r.querySelector('[data-k="width"]'),y=r.querySelector('[data-k="alpha"]'),b=r.querySelector('[data-k="eraserWidth"]');c(o,String(i.STORE.ui.width)),c(d,String(i.STORE.ui.alpha)),c(p,String(i.STORE.ui.eraserWidth)),c(f,String(i.STORE.ui.ocrDraft||"")),m&&(0,l.setText)(m,String(i.STORE.ui.width)),y&&(0,l.setText)(y,Math.round(100*Number(i.STORE.ui.alpha||1))+"%"),b&&(0,l.setText)(b,String(i.STORE.ui.eraserWidth)),f&&s(f,n||i.STORE.ui.ocrBusy),h&&s(h,n||i.STORE.ui.ocrBusy||!u),g&&s(g,n||i.STORE.ui.ocrBusy||!String(i.STORE.ui.ocrDraft||"").trim());let x=r.querySelector('[data-k="ocrHint"]');x&&((0,l.setText)(x,i.STORE.ui.ocrFailed?w(a,"ocrFailed"):w(a,"ocrHint")),(0,l.setStyle)(x,"color",i.STORE.ui.ocrFailed?"var(--lia-annot-danger, #c0392b)":""))}"eraser"===(0,i.effectiveMode)()&&i.STORE.ui.visible&&!n&&i.STATE.lastPointer&&i.STATE.lastPointer.inside?b():m()}function C(){let e=_(),t=q();if(!e||!t)return;let n=(0,i.getViewportWidth)(),a=Math.ceil(e.getBoundingClientRect().width||e.offsetWidth||44),r=Math.round((t.closest(".lia-slide__container")||t.parentElement||t).getBoundingClientRect().left+8);r=Math.min(r=Math.max(8,r),Math.max(8,n-a-8)),(0,l.setStyle)(e,"left",r+"px")}let q=()=>document.body||document.documentElement;function P(e){q=e}},{"./store":"cswaT","./styles":"86IFJ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151","./dom":"azxXB"}],"86IFJ":[function(e,t,n,a){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"CSS",()=>i);let i=`
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
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],azxXB:[function(e,t,n,a){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function i(e,t,n){e.getAttribute(t)!==n&&e.setAttribute(t,n)}r.defineInteropFlag(n),r.export(n,"setAttribute",()=>i),r.export(n,"setStyle",()=>l),r.export(n,"setText",()=>s);let o=new WeakMap;function l(e,t,n){let a=e.style,r=a.getPropertyValue(t),i=a.getPropertyPriority(t),l=o.get(e)?.get(t);if(r===n&&!i||l?.input===n&&l.serialized===r&&l.priority===i)return;a.setProperty(t,n);let s=o.get(e);s||(s=new Map,o.set(e,s)),s.set(t,{input:n,serialized:a.getPropertyValue(t),priority:a.getPropertyPriority(t)})}function s(e,t){e.textContent!==t&&(e.textContent=t)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"8rPw4":[function(e,t,n,a){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"getPinnedQuizTarget",()=>x),r.export(n,"clearPinnedQuizTarget",()=>T),r.export(n,"setOverlayCallbacks",()=>A),r.export(n,"getMarkedRect",()=>M),r.export(n,"clearMarkedRect",()=>O),r.export(n,"startDgsPlacementMode",()=>P),r.export(n,"exitQuizPickingMode",()=>J),r.export(n,"getDirectHeader",()=>Z),r.export(n,"findDirectChildByClass",()=>ee),r.export(n,"isMainVisible",()=>et),r.export(n,"getVisibleMainHost",()=>en),r.export(n,"disconnectResizeObserver",()=>ea),r.export(n,"bindResizeObserver",()=>er),r.export(n,"bindCanvasEvents",()=>eo),r.export(n,"ensureOverlay",()=>el),r.export(n,"syncOverlayInteractivity",()=>es),r.export(n,"syncCanvasSize",()=>ec),r.export(n,"requestSync",()=>ef),r.export(n,"redrawNow",()=>eb),r.export(n,"requestRedraw",()=>ex);var i=e("./store"),o=e("./ui"),l=e("./dom");let s=null,c=null,d=null,u=!1,p=!1,f=0,h=0,g="",m=1,y=null,b=!1;function x(){return y}function T(){y=null}let S=0,v=0;function w(e){if(!i.STATE.shell)return;let t=i.STATE.shell.querySelector(".lia-annot-rect-progress"),n=i.STATE.shell.querySelector(".lia-annot-rect-progfill"),a=i.STATE.shell.querySelector(".lia-annot-rect-progtxt");if(!t||!n||!a)return;let r=Math.max(0,Math.min(1,Number(e)));(0,l.setStyle)(n,"width",Math.round(100*r)+"%"),(0,l.setText)(a,Math.round(100*r)+"%")}function E(e){S&&(cancelAnimationFrame(S),S=0),w(e),setTimeout(function(){!function(){if(!i.STATE.shell)return;let e=i.STATE.shell.querySelector(".lia-annot-rect-progress");e&&((0,l.setAttribute)(e,"data-on","0"),w(0))}()},250)}function A(e){d=e}function M(){if(!s)return null;let e=Math.min(s.x0,s.x1),t=Math.min(s.y0,s.y1);return{x:e,y:t,w:Math.max(1,Math.abs(s.x1-s.x0)),h:Math.max(1,Math.abs(s.y1-s.y0))}}function O(){s=null,c=null,ex()}function R(){let e=(0,i.ensureSlide)((0,i.getSlideKey)());return Array.isArray(e.widgets)||(e.widgets=[]),e.widgets}function k(){try{let e=String(document.documentElement&&document.documentElement.lang||"").trim().toLowerCase(),t=String(document.body&&(document.body.getAttribute("lang")||document.body.getAttribute("data-language"))||"").trim().toLowerCase(),n=String(navigator&&(navigator.language||navigator.languages&&navigator.languages[0])||"").trim().toLowerCase();return(e||t||n).startsWith("de")?"de":"en"}catch(e){return"en"}}function _(e){u=!!e;let t=i.STATE.shell?i.STATE.shell.querySelector(".lia-annot-dgs-prompt"):null;if(t){if(u){let e=(0,i.ensureSlide)((0,i.getSlideKey)()).items.filter(function(e){return e&&"path"===e.kind&&"pen"===e.tool&&Array.isArray(e.points)&&e.points.length>=2}).slice(-6),n=1/0,a=1/0,r=-1/0,o=-1/0;for(let t=0;t<e.length;t++){let i=L(e[t]);i&&(n=Math.min(n,i.xMin),a=Math.min(a,i.yMin),r=Math.max(r,i.xMax),o=Math.max(o,i.yMax))}if(isFinite(n)&&isFinite(a)&&isFinite(r)&&isFinite(o)&&i.STATE.cssW>0&&i.STATE.cssH>0){let e=(0,i.clamp)(Math.round(r+14),12,Math.max(12,i.STATE.cssW-280-12)),n=(0,i.clamp)(Math.round(a-8),12,Math.max(12,i.STATE.cssH-110-12));(0,l.setStyle)(t,"left",e+"px"),(0,l.setStyle)(t,"top",n+"px"),(0,l.setStyle)(t,"bottom","auto")}else(0,l.setStyle)(t,"left","14px"),(0,l.setStyle)(t,"bottom","14px"),(0,l.setStyle)(t,"top","auto")}(0,l.setAttribute)(t,"data-on",u?"1":"0")}}function z(){return i.STATE.shell?i.STATE.shell.querySelector(".lia-annot-dgs-crosshair"):null}function C(e){let t=z();t&&(0,l.setAttribute)(t,"data-on",e?"1":"0")}function q(e){(p=!!e)||C(!1),es()}function P(){!(0,i.isReadOnly)()&&i.STORE.ui.visible&&(el(),_(!1),q(!0))}function L(e){if(!e||"path"!==e.kind||"pen"!==e.tool||!Array.isArray(e.points)||e.points.length<2)return null;let t=function(e){let t=[];if(!e||!Array.isArray(e.points))return t;let n=null;for(let a=0;a<e.points.length;a++){let r=(0,i.fromRel)(e.points[a]);isFinite(r.x)&&isFinite(r.y)&&(!n||Math.hypot(r.x-n.x,r.y-n.y)>=1.5)&&(t.push({x:r.x,y:r.y}),n={x:r.x,y:r.y})}return t}(e);if(t.length<2)return null;let n=1/0,a=-1/0,r=1/0,o=-1/0,l=0,s=t[0];n=Math.min(n,s.x),a=Math.max(a,s.x),r=Math.min(r,s.y),o=Math.max(o,s.y);for(let e=1;e<t.length;e++){let i=t[e];l+=Math.hypot(i.x-s.x,i.y-s.y),s=i,n=Math.min(n,i.x),a=Math.max(a,i.x),r=Math.min(r,i.y),o=Math.max(o,i.y)}if(!isFinite(n)||!isFinite(r)||!isFinite(a)||!isFinite(o))return null;let c=t[0],d=t[t.length-1],u=d.x-c.x,p=d.y-c.y,f=Math.hypot(u,p);if(f<1)return null;let h=u/f,g=p/f,m=0;for(let e=0;e<t.length;e++)m+=Math.abs((t[e].x-c.x)*g-(t[e].y-c.y)*h);let y=m/Math.max(1,t.length),b=f/Math.max(1,l),x=0,T=0;for(let e=1;e<t.length-1;e++){let n=t[e].x-t[e-1].x,a=t[e].y-t[e-1].y,r=t[e+1].x-t[e].x,o=t[e+1].y-t[e].y,l=Math.hypot(n,a),s=Math.hypot(r,o);if(l<1.2||s<1.2||180*Math.acos((0,i.clamp)((n*r+a*o)/(l*s),-1,1))/Math.PI<18)continue;let c=e/(t.length-1);c<.35?x++:c>.65&&T++}let S=0,v=0,w=0;for(let e=0;e<t.length;e++){let n=((t[e].x-c.x)*h+(t[e].y-c.y)*g)/Math.max(1e-6,f);if(e>0){let a=n-w,r=e/Math.max(1,t.length-1);r>.6&&a<0&&(S+=-a),r<.4&&a>0&&(v+=a)}w=n}let E=Math.max(1,a-n),A=Math.max(1,o-r),M=f>=24&&l>=28&&b>=.4&&l/Math.max(1,f)<=3.3&&y<=Math.max(12,.24*f),O=x>=1||T>=1,R=S>=.03||v>=.03,k=M&&f>=28&&l>=32&&b>=.43&&(O||R);return{xMin:n,xMax:a,yMin:r,yMax:o,w:E,h:A,cx:(n+a)*.5,cy:(r+o)*.5,pathLen:l,startX:c.x,startY:c.y,endX:d.x,endY:d.y,dirX:h,dirY:g,endToEnd:f,straightness:b,avgPerp:y,bendNearStart:x,bendNearEnd:T,endBacktrack:S,startBacktrack:v,isArrowLike:k,isLineLike:M,isHorizontal:E>=20&&E>=1.15*A,isVertical:A>=20&&A>=1.15*E}}function N(e,t,n,a,r,o){let l=r-n,s=o-a,c=l*l+s*s;if(c<=1e-6)return Math.hypot(e-n,t-a);let d=(0,i.clamp)(((e-n)*l+(t-a)*s)/c,0,1);return Math.hypot(e-(n+d*l),t-(a+d*s))}function I(e,t,n,a,r,i,o){return e>=Math.min(n,r)-o&&e<=Math.max(n,r)+o&&t>=Math.min(a,i)-o&&t<=Math.max(a,i)+o}function F(e,t){let n="right"===t?e.endX>=e.startX:e.endY<=e.startY,a=n?e.endX:e.startX,r=n?e.endY:e.startY,i=n?e.startX:e.endX,o=n?e.startY:e.endY,l=Math.max(1e-6,Math.hypot(i-a,o-r));return{tipX:a,tipY:r,inwardX:(i-a)/l,inwardY:(o-r)/l,tipIsEnd:n}}function W(e,t){return!!e.isArrowLike&&(t?e.bendNearEnd>=2||e.endBacktrack>=.06:e.bendNearStart>=2||e.startBacktrack>=.06)}function j(e,t,n,a,r,i,o){for(let l=0;l<e.length;l++){let s=e[l];if(!(s===t||s===n||s.endToEnd<4||s.endToEnd>80||Math.min(Math.hypot(s.startX-a,s.startY-r),Math.hypot(s.endX-a,s.endY-r))>58)){if(!(((s.startX+s.endX)*.5-a)*i+((s.startY+s.endY)*.5-r)*o<-6))return l}}return -1}function D(e,t,n){let a=[];a.push(window);try{window.parent&&window.parent!==window&&a.push(window.parent)}catch(e){}try{window.top&&window.top!==window&&a.push(window.top)}catch(e){}for(let r=0;r<a.length;r++){let i=a[r].__setupDGS;if("function"==typeof i)try{i(e,t,n);return}catch(e){}}}function B(e){e.innerHTML='<svg class="lia-annot-dgs-fallback" viewBox="0 0 240 180" preserveAspectRatio="none" aria-hidden="true"><line x1="24" y1="90" x2="226" y2="90" class="axis"/><line x1="120" y1="160" x2="120" y2="14" class="axis"/><polygon points="226,90 214,84 214,96" class="arrow"/><polygon points="120,14 114,26 126,26" class="arrow"/></svg>'}let X=null,H="",Y=[],K=new WeakMap;function V(){if(!i.STATE.host)return;let e=i.STATE.host,t=R().slice().sort(function(e,t){return e.y-t.y}),n=JSON.stringify([i.STATE.slideKey,t]);if(X===e&&H===n&&Y.every(t=>t.parentElement===e))return;let a=[];function r(e){return!!(e&&e instanceof HTMLElement&&e.classList.contains("lia-annot-dgs-widget"))}let o={};for(let n=0;n<t.length;n++){let s=t[n];o[s.id]=!0;let c=String(s.spec||"lia-annot-dgs-board-"+s.id),d="de"===s.language?"de":"en";s.spec||(s.spec=c),s.language||(s.language=d);let u=e.querySelector('.lia-annot-dgs-widget[data-id="'+s.id+'"]');u||((u=document.createElement("div")).className="lia-annot-dgs-widget",(0,l.setAttribute)(u,"data-id",s.id),u.innerHTML='<span class="lia-annot-dgs-spec" style="display:none;"></span><div class="lia-annot-dgs-board"></div>'),(0,l.setStyle)(u,"position","static"),(0,l.setStyle)(u,"left",""),(0,l.setStyle)(u,"top",""),(0,l.setStyle)(u,"width","100%"),(0,l.setStyle)(u,"height","auto"),(0,l.setStyle)(u,"margin","18px 0"),(0,l.setStyle)(u,"display","block"),(0,l.setStyle)(u,"clear","both"),(0,l.setAttribute)(u,"data-spec",c),(0,l.setAttribute)(u,"data-language",d);let p=u.querySelector(".lia-annot-dgs-spec");if(p&&((0,l.setAttribute)(p,"id","dgs-ui-"+s.id),(0,l.setAttribute)(p,"data-spec",c),(0,l.setAttribute)(p,"data-language",d)),u.parentNode!==e||K.get(u)!==s.y){let t=function(t){let n=Array.from(e.children).filter(function(e){return!(i.STATE.shell&&e&&e===i.STATE.shell||r(e))}),a=null,o=-1/0,l=e.getBoundingClientRect().top;for(let e=0;e<n.length;e++){let r=n[e],i=r.getBoundingClientRect();if(i.width<24||i.height<12)continue;let s=i.top-l;i.bottom-l<=t+2&&s>=o&&(a=r,o=s)}return a}(s.y);if(t){let n=t.nextSibling;for(;n instanceof HTMLElement&&r(n)&&n!==u&&(K.get(n)??1/0)<=s.y;)n=n.nextSibling;n!==u&&e.insertBefore(u,n)}else{let t=i.STATE.shell?i.STATE.shell.nextSibling:e.firstChild;t!==u&&e.insertBefore(u,t)}K.set(u,s.y)}a.push(u),function(e){let t=e.querySelector(".lia-annot-dgs-board");if(!t||"1"===t.dataset.init)return;let n=function(){let e=[];e.push(window);try{window.parent&&window.parent!==window&&e.push(window.parent)}catch(e){}try{window.top&&window.top!==window&&e.push(window.top)}catch(e){}for(let t=0;t<e.length;t++){let n=e[t].__coord;if(n&&"function"==typeof n.parseCoordSpec&&"function"==typeof n.prepareBoardContainer&&"function"==typeof n.createBoardDecorations&&"function"==typeof n.wireBoard&&"function"==typeof n.getNeutralColor&&"function"==typeof n.getAccentColor&&"function"==typeof n.loadStoredBoardState)return n}return null}(),a=function(){let e=[];e.push(window);try{window.parent&&window.parent!==window&&e.push(window.parent)}catch(e){}try{window.top&&window.top!==window&&e.push(window.top)}catch(e){}for(let t=0;t<e.length;t++){let n=e[t].JXG,a=n&&n.JSXGraph;if(n&&a&&"function"==typeof a.initBoard)return n}return null}(),r=String(e.dataset.id||Math.floor(1e9*Math.random())),i="lia-annot-dgs-board-"+r,o=k(),s=String(e.dataset.spec||i||""),c=e.querySelector(".lia-annot-dgs-spec");if(c||((c=document.createElement("span")).className="lia-annot-dgs-spec",(0,l.setStyle)(c,"display","none"),e.insertBefore(c,e.firstChild)),c.id="dgs-ui-"+r,(0,l.setAttribute)(c,"data-spec",s),(0,l.setAttribute)(c,"data-language",o),!a||!n){B(t),(0,l.setAttribute)(t,"data-init","1");return}let d=a.JSXGraph;t.id=i;try{let e=Math.max(160,Math.round(t.clientWidth||240)),a=n.parseCoordSpec("xmin=-7;xmax=7;ymin=-5;ymax=5;id="+i+";width="+e+";1;1;1"),l=[a.xmin,a.ymax,a.xmax,a.ymin],c=(a.ymax-a.ymin)/Math.max(1e-4,a.xmax-a.xmin),u=n.loadStoredBoardState(a.id);n.prepareBoardContainer(t,a.width,c,u);let p=d.initBoard(i,{axis:!1,grid:!1,showNavigation:!1,showCopyright:!1,boundingbox:u?u.bbox.slice():l.slice(),keepaspectratio:!0,zoom:{enabled:a.border,wheel:a.border,needShift:!1,factorX:1.15,factorY:1.15},pan:{enabled:a.border,needShift:!1,needTwoFingers:!1},resize:{enabled:!1}});n.createBoardDecorations(p,a,n.getNeutralColor(),n.getAccentColor()),n.wireBoard(p,a,l,c);try{let e=window;e.__boards=e.__boards||{},e.__boards[i]=p}catch(e){}t.__liaAnnotBoard=p,D(r,s,o),setTimeout(function(){D(r,s,o)},0),setTimeout(function(){D(r,s,o)},120)}catch(e){B(t)}(0,l.setAttribute)(t,"data-init","1")}(u)}let s=Array.from(e.querySelectorAll(".lia-annot-dgs-widget"));for(let e=0;e<s.length;e++)o[String(s[e].dataset.id||"")]||s[e].remove();X=e,H=JSON.stringify([i.STATE.slideKey,t]),Y=a}function $(e){return!!e&&(!!e.matches("input, textarea")||"true"===e.getAttribute("contenteditable")||"textbox"===e.getAttribute("role"))}let Q=null,U=null;function J(){b=!1,document.documentElement.classList.contains("lia-annot-quiz-picking")&&document.documentElement.classList.remove("lia-annot-quiz-picking"),es(),Q&&(document.removeEventListener("click",Q,!0),Q=null),U&&(document.removeEventListener("keydown",U,!0),U=null),G()}function G(){if(!i.STATE.shell)return;let e=i.STATE.shell.querySelector(".lia-annot-rect-submit"),t=i.STATE.shell.querySelector(".lia-annot-rect-clear"),n=i.STATE.shell.querySelector(".lia-annot-rect-choosequiz"),a=i.STATE.shell.querySelector(".lia-annot-rect-progress");if(!e||!t||!a)return;let r=s;if(!(r&&i.STORE.ui.visible&&!(0,i.isReadOnly)()&&"rect"===(0,i.effectiveMode)())){(0,l.setStyle)(e,"display","none"),(0,l.setStyle)(t,"display","none"),(0,l.setStyle)(a,"display","none"),n&&(0,l.setStyle)(n,"display","none");return}(0,l.setStyle)(e,"display","block"),(0,l.setStyle)(t,"display","block"),(0,l.setStyle)(a,"display","");let c=Math.min(r.x0,r.x1),d=Math.min(r.y0,r.y1),u=Math.max(1,Math.abs(r.x1-r.x0)),p=Math.max(1,Math.abs(r.y1-r.y0)),f=Math.max(110,e.offsetWidth||140),h=Math.max(28,e.offsetHeight||32),g=Math.max(20,t.offsetWidth||22),m=(0,i.clamp)(c+u-f,8,Math.max(8,i.STATE.cssW-f-8)),x=(0,i.clamp)(d+p+8,8,Math.max(8,i.STATE.cssH-h-8));(0,l.setStyle)(e,"left",m+"px"),(0,l.setStyle)(e,"top",x+"px");let T=Math.max(24,a.offsetHeight||26);(0,l.setStyle)(a,"width",f+"px"),(0,l.setStyle)(a,"left",m+"px"),(0,l.setStyle)(a,"top",(0,i.clamp)(x-T-6,8,Math.max(8,i.STATE.cssH-T-8))+"px");let S=(0,i.clamp)(c+u-.5*g,8,Math.max(8,i.STATE.cssW-g-8)),v=(0,i.clamp)(d-.5*g,8,Math.max(8,i.STATE.cssH-g-8));if((0,l.setStyle)(t,"left",S+"px"),(0,l.setStyle)(t,"top",v+"px"),n){let e=Math.max(28,n.offsetHeight||32);if((0,l.setStyle)(n,"display","block"),(0,l.setStyle)(n,"width",f+"px"),(0,l.setStyle)(n,"left",m+"px"),(0,l.setStyle)(n,"top",(0,i.clamp)(x+h+4,8,Math.max(8,i.STATE.cssH-e-8))+"px"),b)(0,l.setText)(n,"✕ "+(0,o.tUi)("rectChooseCancel")),(0,l.setAttribute)(n,"data-state","picking");else if(y){let e=y.placeholder||y.name||(0,o.tUi)("rectChosenFallback");(0,l.setText)(n,"✓ "+e),(0,l.setAttribute)(n,"data-state","chosen")}else(0,l.setText)(n,(0,o.tUi)("rectChooseQuiz")),(0,l.setAttribute)(n,"data-state","")}}function Z(e){if(!e)return null;let t=e.children||[];for(let e=0;e<t.length;e++){let n=t[e];if(n&&n.tagName&&"header"===n.tagName.toLowerCase())return n}return null}function ee(e,t){if(!e)return null;let n=e.children||[];for(let e=0;e<n.length;e++){let a=n[e];if(a.classList&&a.classList.contains(t))return a}return null}function et(e){if(!e||e.hasAttribute("hidden"))return!1;let t=getComputedStyle(e);if("none"===t.display||"hidden"===t.visibility)return!1;let n=e.getBoundingClientRect();return n.width>0&&n.height>0}function en(){let e=Array.from(document.querySelectorAll("main"));for(let t=0;t<e.length;t++)if(et(e[t]))return e[t];return e[0]||document.querySelector("main")||document.body||document.documentElement}function ea(){try{i.STATE.resizeObserver&&i.STATE.resizeObserver.disconnect()}catch(e){}i.STATE.resizeObserver=null}function er(){if(ea(),i.STATE.host)try{i.STATE.resizeObserver=new ResizeObserver(function(){ef()}),i.STATE.resizeObserver.observe(i.STATE.host)}catch(e){}}function ei(e,t){let n=Z(e);if(n){n.nextSibling!==t&&(t.parentNode===e&&t.remove(),n.nextSibling?e.insertBefore(t,n.nextSibling):e.appendChild(t));return}e.firstChild!==t&&(t.parentNode===e&&t.remove(),e.firstChild?e.insertBefore(t,e.firstChild):e.appendChild(t))}function eo(){function e(e){let t,n=(t=i.STATE.canvas.getBoundingClientRect(),{x:(0,i.clamp)(e.clientX-t.left,0,i.STATE.cssW),y:(0,i.clamp)(e.clientY-t.top,0,i.STATE.cssH)});return i.STATE.lastPointer={x:n.x,y:n.y,inside:!0,pointerType:String(e.pointerType||"")},n}function t(t,n){let a=i.STATE.activePath;if(i.STATE.drawing){t.preventDefault(),t.stopPropagation();try{i.STATE.canvas.releasePointerCapture(t.pointerId)}catch(e){}i.STATE.drawing=!1,i.STATE.activePath=null,(0,o.updateToolbar)()}if(n&&"mouse"===t.pointerType&&i.STORE.ui.visible&&!(0,i.isReadOnly)()&&"eraser"===(0,i.effectiveMode)()){let n=e(t);(0,o.updateEraserRing)(n.x,n.y)}else i.STATE.lastPointer.inside=!1,(0,o.hideEraserRing)();a&&"pen"===a.tool&&((0,i.isReadOnly)()||!i.STORE.ui.visible||u||p||!d||!d.shouldPromptDgsInsert||!d.shouldPromptDgsInsert()||Date.now()<f||Date.now()-h<120||((0,i.ensureSlide)((0,i.getSlideKey)()),function(){let e=(0,i.ensureSlide)((0,i.getSlideKey)()).items.filter(function(e){return e&&"path"===e.kind&&"pen"===e.tool}).slice(-140).map(function(e){return L(e)}).filter(e=>null!==e);if(e.length<2)return!1;let t=e.slice(-26);if(t.length<2)return!1;let n=function(e){if(!e.length)return[];let t=[e[e.length-1]];for(let n=e.length-2;n>=0;n--){let a=e[n],r=!1;for(let e=0;e<t.length;e++)if(function(e,t){var n,a,r,i,o,l,s,c;return!!(220>=Math.hypot(e.cx-t.cx,e.cy-t.cy))||120>=(n=e.startX,a=e.startY,r=e.endX,i=e.endY,o=t.startX,l=t.startY,Math.min(N(n,a,o,l,s=t.endX,c=t.endY),N(r,i,o,l,s,c),N(o,l,n,a,r,i),N(s,c,n,a,r,i)))}(a,t[e])){r=!0;break}if(!r||(t.unshift(a),t.length>=10))break}return t}(t);if(n.length<2)return!1;let a=n.map(function(e){return[Math.round(e.cx),Math.round(e.cy),Math.round(e.endToEnd),Math.round(e.w),Math.round(e.h)].join(":")}).join("|");if(a&&a===g)return!1;let r=n.map(function(e,t){return{g:e,index:t}}).filter(function(e){let t=e.g;return t.isLineLike&&t.endToEnd>=28&&t.straightness>=.34&&Math.abs(t.dirX)>=.72&&.55>=Math.abs(t.dirY)&&t.w>=1.4*t.h}).sort(function(e,t){return t.index-e.index}),o=n.map(function(e,t){return{g:e,index:t}}).filter(function(e){let t=e.g;return t.isLineLike&&t.endToEnd>=28&&t.straightness>=.34&&Math.abs(t.dirY)>=.72&&.55>=Math.abs(t.dirX)&&t.h>=1.4*t.w}).sort(function(e,t){return t.index-e.index});if(!r.length||!o.length)return!1;let l=Math.min(3,r.length),s=Math.min(3,o.length);for(let e=0;e<l;e++)for(let t=0;t<s;t++){let i=r[e],l=o[t],s=i.g,c=l.g;if(Math.abs(i.index-l.index)>4||Math.max(i.index,l.index)<n.length-4||Math.abs(s.dirX*c.dirX+s.dirY*c.dirY)>.78)continue;let d=function(e,t,n,a,r,i,o,l){let s=(e-n)*(i-l)-(t-a)*(r-o);if(1e-6>Math.abs(s))return null;let c=e*a-t*n,d=r*l-i*o;return{x:(c*(r-o)-(e-n)*d)/s,y:(c*(i-l)-(t-a)*d)/s}}(s.startX,s.startY,s.endX,s.endY,c.startX,c.startY,c.endX,c.endY);if(!d)continue;let u=Math.max(16,Math.min(90,.22*s.endToEnd)),p=Math.max(16,Math.min(90,.22*c.endToEnd));if(!I(d.x,d.y,s.startX,s.startY,s.endX,s.endY,u)||!I(d.x,d.y,c.startX,c.startY,c.endX,c.endY,p))continue;let f=Math.hypot(d.x-s.cx,d.y-s.cy),h=Math.hypot(d.x-c.cx,d.y-c.cy);if(f>Math.max(90,.38*s.endToEnd)||h>Math.max(90,.38*c.endToEnd))continue;let m=F(s,"right"),y=F(c,"up"),b=W(s,m.tipIsEnd),x=j(n,s,c,m.tipX,m.tipY,m.inwardX,m.inwardY);if(!(b||x>=0))continue;let T=W(c,y.tipIsEnd),S=j(n,s,c,y.tipX,y.tipY,y.inwardX,y.inwardY);if((T||S>=0)&&(!(x>=0)||!(S>=0)||x!==S))return g=a,!0}return!1}()&&(h=Date.now(),_(!0))))}i.STATE.canvas&&!i.STATE.canvas.__liaAnnotBound&&(i.STATE.canvas.__liaAnnotBound=!0,i.STATE.canvas.addEventListener("pointerdown",function(t){var n,a,r,l;if("mouse"===t.pointerType&&0!==t.button)return;let s=e(t);if(p){let e,r,l,c;t.preventDefault(),t.stopPropagation(),n=s.x,a=s.y,e=R(),r=Math.round(n),l=Math.round(a),c=String(Date.now())+"-"+String(m++),e.push({id:c,x:r,y:l,w:240,h:180,spec:"lia-annot-dgs-board-"+c,language:k()}),V(),ef(),q(!1),i.STORE.ui.mode="cursor",i.STORE.ui.panelOpen=!1,_(!1),h=0,f=0,(0,o.updateToolbar)(),es();return}if(!i.STORE.ui.visible||(0,i.isReadOnly)())return void(0,o.hideEraserRing)();let d=(0,i.effectiveMode)();if("eraser"===d?(0,o.updateEraserRing)(s.x,s.y):(0,o.hideEraserRing)(),"rect"===d){t.preventDefault(),t.stopPropagation(),c={x0:r=s.x,y0:l=s.y,x1:r,y1:l};try{i.STATE.canvas.setPointerCapture(t.pointerId)}catch(e){}ex();return}if("pen"!==d&&"eraser"!==d)return;t.preventDefault(),t.stopPropagation(),i.STORE.ui.panelOpen&&(i.STORE.ui.panelOpen=!1,(0,o.updateToolbar)());let u=(0,i.ensureSlide)((0,i.getSlideKey)()),g={kind:"path",tool:d,color:String(i.STORE.ui.color||"#ff0000"),width:"eraser"===d?Number(i.STORE.ui.eraserWidth||18):Number(i.STORE.ui.width||3),alpha:"eraser"===d?1:Number(i.STORE.ui.alpha||1),baseW:Math.max(1,i.STATE.cssW),points:[(0,i.toRel)(s.x,s.y)]};u.items.push(g),u.redo=[],i.STATE.activePath=g,i.STATE.drawing=!0;try{i.STATE.canvas.setPointerCapture(t.pointerId)}catch(e){}ex(),(0,o.updateToolbar)()},!0),i.STATE.canvas.addEventListener("pointermove",function(t){var n,a,r,s;let d=e(t);if(p){let e;t.preventDefault(),t.stopPropagation(),n=d.x,a=d.y,(e=z())&&i.STATE.shell&&p&&isFinite(n)&&isFinite(a)&&((0,l.setStyle)(e,"left",(0,i.clamp)(n,0,Math.max(0,i.STATE.cssW))+"px"),(0,l.setStyle)(e,"top",(0,i.clamp)(a,0,Math.max(0,i.STATE.cssH))+"px"),C(!0));return}if(!(0,i.isReadOnly)()&&i.STORE.ui.visible&&"eraser"===(0,i.effectiveMode)()?(0,o.updateEraserRing)(d.x,d.y):(0,o.hideEraserRing)(),c){t.preventDefault(),t.stopPropagation(),r=d.x,s=d.y,c&&(c.x1=r,c.y1=s),ex();return}i.STATE.drawing&&i.STATE.activePath&&(t.preventDefault(),t.stopPropagation(),function(e,t,n){if(!e||!Array.isArray(e.points))return!1;let a=(0,i.toRel)(t,n),r=e.points.length?e.points[e.points.length-1]:null;if(r&&.8>Math.hypot((a.x-r.x)*i.STATE.cssW,(a.y-r.y)*i.STATE.cssH))return!1;return e.points.push(a),!0}(i.STATE.activePath,d.x,d.y)&&ex())},!0),i.STATE.canvas.addEventListener("pointerup",function(e){if(c){e.preventDefault(),e.stopPropagation();try{i.STATE.canvas.releasePointerCapture(e.pointerId)}catch(e){}(function(){if(!c)return;let e=Math.abs(c.x1-c.x0),t=Math.abs(c.y1-c.y0);s=e>=6&&t>=6?{...c}:null,c=null})(),ex(),(0,o.updateToolbar)();return}t(e,!0)},!0),i.STATE.canvas.addEventListener("pointercancel",function(e){t(e,!1)},!0),i.STATE.canvas.addEventListener("pointerleave",function(){i.STATE.lastPointer.inside=!1,(0,o.hideEraserRing)(),p&&C(!1)},!0),i.STATE.canvas.addEventListener("contextmenu",function(e){e.preventDefault()},!0))}function el(){let e=en(),t=(0,i.getSlideKey)(),n=i.STATE.host!==e,a=i.STATE.slideKey!==t;if(i.STATE.shell&&i.STATE.shell.isConnected&&!n)ei(e,i.STATE.shell),i.STATE.canvas=i.STATE.shell.querySelector(".lia-annot-canvas"),i.STATE.eraserRing=i.STATE.shell.querySelector(".lia-annot-eraser-ring");else{ea(),i.STATE.host=e,i.STATE.slideKey=t,e.classList.contains("lia-annot-host")||e.classList.add("lia-annot-host");let n=ee(e,"lia-annot-shell");n||((n=document.createElement("div")).className="lia-annot-shell",n.setAttribute("aria-hidden","true"));let a=n.querySelector(".lia-annot-canvas");a||((a=document.createElement("canvas")).className="lia-annot-canvas",a.setAttribute("aria-label","Annotation canvas"),n.appendChild(a));let r=n.querySelector(".lia-annot-eraser-ring");r||((r=document.createElement("span")).className="lia-annot-eraser-ring",(0,l.setAttribute)(r,"data-on","0"),n.appendChild(r));let c=n.querySelector(".lia-annot-dgs-layer");c||((c=document.createElement("div")).className="lia-annot-dgs-layer",n.appendChild(c));let m=n.querySelector(".lia-annot-dgs-crosshair");m||((m=document.createElement("div")).className="lia-annot-dgs-crosshair",(0,l.setAttribute)(m,"data-on","0"),n.appendChild(m));let x=n.querySelector(".lia-annot-dgs-prompt");x||((x=document.createElement("div")).className="lia-annot-dgs-prompt",(0,l.setAttribute)(x,"data-on","0"),x.innerHTML='<div class="lia-annot-dgs-prompt-title">Coordinate system sketch detected</div><div class="lia-annot-dgs-prompt-sub">Create a DGS coordinate system?</div><div class="lia-annot-dgs-prompt-actions">  <button type="button" class="lia-annot-dgs-yes">Yes</button>  <button type="button" class="lia-annot-dgs-no">No</button></div>',n.appendChild(x),x.addEventListener("pointerdown",function(e){e.preventDefault(),e.stopPropagation()},!0),x.addEventListener("click",function(e){let t=e.target;if(t&&t instanceof Element){if(t.closest(".lia-annot-dgs-yes")){e.preventDefault(),e.stopPropagation(),_(!1),q(!0);return}t.closest(".lia-annot-dgs-no")&&(e.preventDefault(),e.stopPropagation(),_(!1),h=0,f=Date.now()+40,g="")}},!0));let T=n.querySelector(".lia-annot-rect-submit");T||((T=document.createElement("button")).type="button",T.className="lia-annot-rect-submit",(0,l.setText)(T,(0,o.tUi)("rectSubmit")),(0,l.setStyle)(T,"display","none"),n.appendChild(T),T.addEventListener("pointerdown",function(e){e.preventDefault(),e.stopPropagation()},!0),T.addEventListener("click",function(e){if(e.preventDefault(),e.stopPropagation(),d&&s&&!i.STORE.ui.ocrBusy){let e;S&&(cancelAnimationFrame(S),S=0),function(){if(!i.STATE.shell)return;let e=i.STATE.shell.querySelector(".lia-annot-rect-progress");e&&((0,l.setAttribute)(e,"data-on","1"),w(0),G())}(),v=performance.now(),e=function(){let t=performance.now()-v;w(t<900?t/900*.7:t<2200?.7+(t-900)/1300*.2:.9+Math.min(.08,(t-2200)/5e3*.08)),S=requestAnimationFrame(e)},S=requestAnimationFrame(e),d.submitMarkedRect().then(function(){(0,o.updateToolbar)(),E(1),G()}).catch(function(){E(1),G()})}},!0));let A=n.querySelector(".lia-annot-rect-progress");A||((A=document.createElement("div")).className="lia-annot-rect-progress",(0,l.setAttribute)(A,"data-on","0"),A.innerHTML='<div class="lia-annot-rect-progbar"><div class="lia-annot-rect-progfill"></div></div><div class="lia-annot-rect-progtxt">0%</div>',n.appendChild(A),A.addEventListener("pointerdown",function(e){e.preventDefault(),e.stopPropagation()},!0));let M=n.querySelector(".lia-annot-rect-clear");M||((M=document.createElement("button")).type="button",M.className="lia-annot-rect-clear",M.setAttribute("aria-label",(0,o.tUi)("rectClearAria")),(0,l.setText)(M,"×"),(0,l.setStyle)(M,"display","none"),n.appendChild(M),M.addEventListener("pointerdown",function(e){e.preventDefault(),e.stopPropagation()},!0),M.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation(),O()},!0));let R=n.querySelector(".lia-annot-rect-choosequiz");R||((R=document.createElement("button")).type="button",R.className="lia-annot-rect-choosequiz",(0,l.setText)(R,(0,o.tUi)("rectChooseQuiz")),(0,l.setStyle)(R,"display","none"),n.appendChild(R),R.addEventListener("pointerdown",function(e){e.preventDefault(),e.stopPropagation()},!0),R.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation(),b?J():b||(b=!0,i.STATE.canvas&&(0,l.setStyle)(i.STATE.canvas,"pointer-events","none"),document.documentElement.classList.add("lia-annot-quiz-picking"),G(),Q=function(e){let t=e.target;for(;t&&t!==document.documentElement&&!$(t);)t=t.parentElement;t&&$(t)&&!t.closest(".lia-annot-shell")?(e.preventDefault(),e.stopPropagation(),y=t,J()):t&&t.closest(".lia-annot-rect-choosequiz")||J()},U=function(e){"Escape"===e.key&&J()},document.addEventListener("click",Q,!0),document.addEventListener("keydown",U,!0))},!0)),ei(e,n),i.STATE.shell=n,i.STATE.canvas=a,i.STATE.eraserRing=r,i.STATE.ctx=i.STATE.canvas?i.STATE.canvas.getContext("2d",{willReadFrequently:!0}):null,eo(),er(),document.__liaAnnotDgsEscBound||(document.addEventListener("keydown",function(e){if("Escape"===e.key){if(p)return void q(!1);u&&_(!1)}},!0),document.__liaAnnotDgsEscBound=!0)}a&&(i.STATE.slideKey=t,h=0,_(!1),q(!1),g=""),V(),es(),G()}function es(){let e=Array.from(document.querySelectorAll(".lia-annot-shell")),t=(0,i.effectiveMode)(),n=!!i.STORE.ui.visible;p&&(!n||(0,i.isReadOnly)())&&(p=!1);let a=p&&n&&!(0,i.isReadOnly)();for(let r of e){let e=r.querySelector(".lia-annot-canvas"),o=r===i.STATE.shell,s=o?a?"place":t:"cursor",c=o&&n&&!b&&"cursor"!==s;(0,l.setAttribute)(r,"data-mode",s),(0,l.setAttribute)(r,"data-hidden",n?"0":"1"),(0,l.setStyle)(r,"pointer-events","none"),(0,l.setStyle)(r,"display",n?"":"none"),e&&((0,l.setStyle)(e,"pointer-events",c?"auto":"none"),(0,l.setStyle)(e,"touch-action",c?"none":"auto"),(0,l.setStyle)(e,"cursor",c?"crosshair":"default"))}if(!n){(0,o.hideEraserRing)(),_(!1),C(!1);return}i.STATE.shell&&i.STATE.canvas?("eraser"!==t||a?(0,o.hideEraserRing)():(0,o.refreshEraserRing)(),a||C(!1),G()):(0,o.hideEraserRing)()}function ec(){if(!i.STATE.host||!i.STATE.canvas||!i.STATE.ctx||!i.STATE.shell)return!1;let e=window.devicePixelRatio||1,t=i.STATE.host.getBoundingClientRect(),n=(0,i.getViewportWidth)(),a=i.STATE.host.querySelector(".lia-slide, section"),r=a?a.getBoundingClientRect().height:0,s=Math.max(1,Math.ceil(t.height||0),Math.ceil(r||0)),c=Math.round(-t.left),d=i.STATE.cssW!==n||i.STATE.cssH!==s||i.STATE.dpr!==e;i.STATE.cssW=n,i.STATE.cssH=s,i.STATE.dpr=e,(0,l.setStyle)(i.STATE.shell,"left",c+"px"),(0,l.setStyle)(i.STATE.shell,"top","0px"),(0,l.setStyle)(i.STATE.shell,"width",n+"px"),(0,l.setStyle)(i.STATE.shell,"height",s+"px"),(0,l.setStyle)(i.STATE.canvas,"width",n+"px"),(0,l.setStyle)(i.STATE.canvas,"height",s+"px");let u=Math.max(1,Math.round(n*i.STATE.dpr)),p=Math.max(1,Math.round(s*i.STATE.dpr));return i.STATE.canvas.width!==u&&(i.STATE.canvas.width=u,d=!0),i.STATE.canvas.height!==p&&(i.STATE.canvas.height=p,d=!0),d&&((0,o.refreshEraserRing)(),G()),d}let ed=!1,eu=!1;function ep(){i.STATE.syncRAF||(i.STATE.syncRAF=requestAnimationFrame(function(){i.STATE.syncRAF=0;let e=ed,t=eu;ed=!1,eu=!1;let n=!1;e?(el(),n=ec(),(0,o.syncToolbarPosition)()):t&&V(),(t||n||!ey(eh,em()))&&eb(n)}))}function ef(){ed=!0,ep()}let eh=[],eg=[];function em(){return[i.STATE.canvas,i.STATE.slideKey,i.STATE.cssW,i.STATE.cssH,i.STATE.dpr,i.STORE.ui.visible]}function ey(e,t){return e.length===t.length&&e.every((e,n)=>e===t[n])}function eb(e=!1){if(!i.STATE.canvas||!i.STATE.ctx)return;let t=em(),n=(0,i.ensureSlide)(i.STATE.slideKey||(0,i.getSlideKey)()),a=s||c?getComputedStyle(document.documentElement).getPropertyValue("--lia-annot-accent").trim()||"#3b82f6":"",r=[];if(i.STORE.ui.visible){for(let e of n.items){if(!e){r.push(e);continue}r.push(e,e.kind,e.tool,e.color,e.width,e.alpha,e.baseW,e.points,e.points&&e.points.length)}for(let e of[s,c])r.push(e?e.x0:null,e?e.y0:null,e?e.x1:null,e?e.y1:null);r.push(a)}if(!e&&ey(eh,t)&&ey(eg,r))return;eh=t,eg=r;let o=i.STATE.ctx;if(o.setTransform(i.STATE.dpr,0,0,i.STATE.dpr,0,0),o.clearRect(0,0,i.STATE.cssW,i.STATE.cssH),!i.STORE.ui.visible)return;for(let e=0;e<n.items.length;e++)!function(e,t){if(!t||"path"!==t.kind||!Array.isArray(t.points)||0===t.points.length)return;let n="eraser"===t.tool,a=(0,i.getLineWidthPx)(t),r=(0,i.clamp)(Number(t.alpha||1),.05,1),o=String(t.color||"#000");if(1===t.points.length){var l,s,c;let d=(0,i.fromRel)(t.points[0]);l=d.x,s=d.y,c=a/2,e.save(),e.globalCompositeOperation=n?"destination-out":"source-over",e.globalAlpha=n?1:(0,i.clamp)(Number(r||1),.05,1),e.beginPath(),e.arc(l,s,Math.max(.5,c),0,2*Math.PI),e.fillStyle=n?"#000":String(o||"#000"),e.fill(),e.restore();return}e.save(),e.globalCompositeOperation=n?"destination-out":"source-over",e.globalAlpha=n?1:r,e.lineCap="round",e.lineJoin="round",e.lineWidth=a,e.strokeStyle=n?"#000":o,e.beginPath();let d=t.points.map(i.fromRel);if(e.moveTo(d[0].x,d[0].y),2===d.length)e.lineTo(d[1].x,d[1].y);else{e.lineTo((d[0].x+d[1].x)/2,(d[0].y+d[1].y)/2);for(let t=1;t<d.length-1;t++){let n=(d[t].x+d[t+1].x)/2,a=(d[t].y+d[t+1].y)/2;e.quadraticCurveTo(d[t].x,d[t].y,n,a)}e.lineTo(d[d.length-1].x,d[d.length-1].y)}e.stroke(),e.restore()}(o,n.items[e]);let l=function(e,t){let n=Math.min(e.x0,e.x1),r=Math.min(e.y0,e.y1),i=Math.max(1,Math.abs(e.x1-e.x0)),l=Math.max(1,Math.abs(e.y1-e.y0));o.save(),o.globalCompositeOperation="source-over",o.globalAlpha=t?.22:.16,o.fillStyle=a,o.fillRect(n,r,i,l),o.globalAlpha=.95,o.lineWidth=1.6,o.strokeStyle=a,o.strokeRect(n,r,i,l),o.restore()};s&&l(s,!0),c&&l(c,!1),G()}function ex(){eu=!0,ep()}},{"./store":"cswaT","./ui":"7Wjmu","@parcel/transformer-js/src/esmodule-helpers.js":"k3151","./dom":"azxXB"}],bH1QJ:[function(e,t,n,a){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"doUndo",()=>s),r.export(n,"doRedo",()=>c),r.export(n,"clearSlide",()=>d),r.export(n,"clearAllSlides",()=>u),r.export(n,"isOcrAvailable",()=>h),r.export(n,"shouldPromptDgsInsert",()=>g),r.export(n,"recognizeLatestAnnotationText",()=>_),r.export(n,"submitOcrTextToNearestQuiz",()=>z),r.export(n,"transferToNearestQuiz",()=>C),r.export(n,"roundFreezeNum",()=>q),r.export(n,"sanitizeFreezePoint",()=>P),r.export(n,"sanitizeFreezeItem",()=>L),r.export(n,"sanitizeFreezeSlides",()=>N),r.export(n,"hasFreezeData",()=>F),r.export(n,"exportState",()=>W),r.export(n,"exportFreezeState",()=>j),r.export(n,"importState",()=>D),r.export(n,"importFreezeState",()=>B),r.export(n,"setVisible",()=>X),r.export(n,"setReadOnly",()=>H),r.export(n,"registerGlobalApi",()=>Y);var i=e("./store"),o=e("./overlay"),l=e("./ui");function s(){let e=(0,i.currentSlide)();e.items.length&&(e.redo.push(e.items.pop()),(0,o.requestRedraw)(),(0,l.updateToolbar)())}function c(){let e=(0,i.currentSlide)();e.redo.length&&(e.items.push(e.redo.pop()),(0,o.requestRedraw)(),(0,l.updateToolbar)())}function d(){let e=(0,i.currentSlide)();e.items=[],e.redo=[],e.widgets=[],(0,o.requestRedraw)(),(0,l.updateToolbar)()}function u(){i.STORE.slides={},(0,i.ensureSlide)((0,i.getSlideKey)()),(0,o.requestRedraw)(),(0,l.updateToolbar)()}function p(e){if(!e||"object"!=typeof e)return null;let t=e.__LIA_TEX_OCR__;if(t&&"function"==typeof t.recognize)return t;let n=e.__LIA_CANVAS_OCR__,a=n&&n.ocr;return a&&"function"==typeof a.recognize?a:null}function f(){let e=p(window);if(e)return e;try{let e=p(i.ROOT);if(e)return e}catch(e){}try{let e=window.parent&&window.parent!==window?p(window.parent):null;if(e)return e}catch(e){}try{let e=window.top&&window.top!==window?p(window.top):null;if(e)return e}catch(e){}return null}function h(){return!!f()}function g(){return!0}function m(e){if(!e||!(e instanceof Element)||!function(e){if(!e||!(e instanceof Element)||!e.isConnected)return!1;let t=e.getBoundingClientRect();if(t.width<=0||t.height<=0)return!1;let n=getComputedStyle(e);return"none"!==n.display&&"hidden"!==n.visibility}(e)||e.closest(".lia-annot-toolbar, .lia-annot-panel"))return!1;if(e.matches("input")){let t=String(e.type||"text").toLowerCase();return!e.disabled&&!e.readOnly&&("text"===t||"search"===t||"url"===t||"email"===t||"tel"===t||"number"===t)}return e.matches("textarea")?!e.disabled&&!e.readOnly:"true"===e.getAttribute("contenteditable")||"textbox"===e.getAttribute("role")&&"true"!==e.getAttribute("aria-readonly")}function y(e){return!!e.closest('.quiz, .lia-quiz, .lia-question, .lia-exercise, [class*="quiz"], [class*="exercise"], [id*="quiz"]')}function b(e){let t=String(null==e?"":e).trim();if(!t)return"";if(t.startsWith("$$")&&t.endsWith("$$")&&(t=t.slice(2,-2).trim()),t.startsWith("$")&&t.endsWith("$")&&(t=t.slice(1,-1).trim()),t.startsWith("\\[")&&t.endsWith("\\]")&&(t=t.slice(2,-2).trim()),t.startsWith("[")&&t.endsWith("]")){let e=t.slice(1,-1).trim(),n=0,a=!0;for(let t of e)if("["===t)n++;else if("]"===t){if(0===n){a=!1;break}n--}a&&(t=e)}return t.startsWith("\\left[")&&t.endsWith("\\right]")&&(t=t.slice(6,-7).trim()),(t=t.replace(/\s+/g," ").trim()).startsWith("\\mathrm{")&&t.endsWith("}")&&(t=t.slice(8,-1).replace(/~/g,"").trim()),t=function(e){let t=String(e||"");if(-1!==t.indexOf("\\div")&&(t=t.replace(/\s*\\div\s*/g,":")),-1===t.indexOf("\\times"))return t;let n="",a=0;for(;a<t.length;){let e=t.indexOf("\\times",a);if(e<0){n+=t.slice(a);break}n+=t.slice(a,e);let r=e-1;for(;r>=0&&" "===t[r];)r--;let i=e+6;for(;i<t.length&&" "===t[i];)i++;let o=r>=0?t[r]:"",l=i<t.length?t[i]:"",s=function(e){return e>="0"&&e<="9"},c=function(e){return e>="a"&&e<="z"};s(o)&&s(l)?n+="\\cdot":c(o)||c(l)?n+="x":n+="\\cdot",a=e+6}return n}(t)}function x(e){if("string"==typeof e)return b(e);if(e&&"object"==typeof e){let t=e.text??e.latex??e.output??e.result;if("string"==typeof t)return b(t)}return""}let T=null,S=null,v=!1;async function w(e){if(!v){if(!e||"function"!=typeof e.setModel||String(e.model||"").trim().toLowerCase().includes("texify2")){v=!0;return}try{await e.setModel("Xenova/texify2")}catch(e){}v=!0}}function E(e){let t=Math.max(e.width,e.height),n=1;if(t<420&&(n=420/t),t>1400&&(n=1400/t),.06>Math.abs(n-1))return e;let a=document.createElement("canvas");a.width=Math.max(1,Math.round(e.width*n)),a.height=Math.max(1,Math.round(e.height*n));let r=a.getContext("2d",{willReadFrequently:!0});return r?(r.fillStyle="#fff",r.fillRect(0,0,a.width,a.height),r.drawImage(e,0,0,a.width,a.height),a):e}function A(e){let t=document.createElement("canvas");t.width=Math.max(1,0|e.width),t.height=Math.max(1,0|e.height);let n=t.getContext("2d",{willReadFrequently:!0});if(!n)return e;n.fillStyle="#fff",n.fillRect(0,0,t.width,t.height),n.drawImage(e,0,0);let a=n.getImageData(0,0,t.width,t.height).data,r=t.width,i=t.height,o=new Uint8Array(r*i);for(let e=0,t=0;t<o.length;t++,e+=4)o[t]=+(.299*a[e]+.587*a[e+1]+.114*a[e+2]<200);let l=r,s=i,c=-1,d=-1;for(let e=0;e<i;e++)for(let t=0;t<r;t++)o[e*r+t]&&(t<l&&(l=t),e<s&&(s=e),t>c&&(c=t),e>d&&(d=e));if(c<0)return t;l=Math.max(0,l-18),s=Math.max(0,s-18);let u=Math.max(1,(c=Math.min(r-1,c+18))-l+1),p=Math.max(1,(d=Math.min(i-1,d+18))-s+1),f=document.createElement("canvas");f.width=u,f.height=p;let h=f.getContext("2d",{willReadFrequently:!0});if(!h)return t;let g=h.createImageData(u,p),m=g.data;for(let e=0;e<p;e++)for(let t=0;t<u;t++){let n=255*!o[(s+e)*r+(l+t)],a=(e*u+t)*4;m[a]=n,m[a+1]=n,m[a+2]=n,m[a+3]=255}h.putImageData(g,0,0);let y=512/Math.max(u,p);y<.75&&(y=.75),y>3.5&&(y=3.5);let b=document.createElement("canvas");b.width=Math.max(1,Math.round(u*y)),b.height=Math.max(1,Math.round(p*y));let x=b.getContext("2d",{willReadFrequently:!0});return x?(x.fillStyle="#fff",x.fillRect(0,0,b.width,b.height),x.imageSmoothingEnabled=!0,x.drawImage(f,0,0,b.width,b.height),b):f}function M(e){let t=String(e||"").trim();return t?!function(e){let t=String(e||"").trim();if(!t||/[+\-*/=,:;\\]$/.test(t)||/[{[(]$/.test(t))return!0;let n=0,a=0,r=0,i=!1;for(let e=0;e<t.length;e++){let o=t[e];if(i){i=!1;continue}if("\\"===o){i=!0;continue}"{"===o?n++:"}"===o?n--:"["===o?a++:"]"===o?a--:"("===o?r++:")"===o&&r--}return 0!==n||0!==a||0!==r}(t)?t.length:t.length-5e3:-9999}async function O(e,t){var n;let a,r,i,o={max_new_tokens:128,do_sample:!1,temperature:0,__silent:!0},l=E(A(t)),s=E((n=A(t),a=Math.max(0,Math.round(20)),(r=document.createElement("canvas")).width=n.width+2*a,r.height=n.height+2*a,(i=r.getContext("2d",{willReadFrequently:!0}))?(i.fillStyle="#fff",i.fillRect(0,0,r.width,r.height),i.drawImage(n,a,a),r):n)),c=E(A(function(e){let t=document.createElement("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d",{willReadFrequently:!0});if(!n)return e;n.fillStyle="#fff",n.fillRect(0,0,t.width,t.height),n.drawImage(e,0,0);let a=n.getImageData(0,0,t.width,t.height),r=a.data;for(let e=0;e<r.length;e+=4)!(r[e+3]<128)&&.299*r[e]+.587*r[e+1]+.114*r[e+2]<240&&(r[e]=Math.max(0,Math.min(255,Math.round(r[e]/1.35))),r[e+1]=Math.max(0,Math.min(255,Math.round(r[e+1]/1.35))),r[e+2]=Math.max(0,Math.min(255,Math.round(r[e+2]/1.35))));return n.putImageData(a,0,0),t}(t))),[d,u,p]=await Promise.all([e.recognize(l,o).catch(()=>""),e.recognize(s,o).catch(()=>""),e.recognize(c,o).catch(()=>"")]),f=x(d),h=x(u),g=x(p),m=M(f),y=M(h),b=M(g);return m>=y&&m>=b?f:y>=b?h:g}function R(e){if(!m(e))return;if(e.__liaAnnotTexReady){let t=e.__liaAnnotTexSync;t&&t();return}let t=document.createElement("span");t.className="lia-annot-tex-preview",t.dataset.on="0",t.innerHTML='<span class="lia-annot-tex-preview-math"></span><span class="lia-annot-tex-preview-hint">TeX</span>',e.insertAdjacentElement("afterend",t);let n=function(e){let t=e.classList;return!!t&&(!!(t.contains("is-success")||t.contains("is-failure")||t.contains("is-warning")||t.contains("is-partial")||t.contains("is-resolved"))||"true"===e.getAttribute("aria-invalid"))},a=function(e){let t=String(e||"").trim().toLowerCase();return!!t&&"transparent"!==t&&"rgba(0, 0, 0, 0)"!==t&&"rgba(0,0,0,0)"!==t},r=function(){if(t.style.removeProperty("--lia-annot-tex-preview-border"),!n(e))return;let r="";try{let t=getComputedStyle(e);r=t.borderTopColor||t.borderColor||t.outlineColor||""}catch(e){}a(r)&&t.style.setProperty("--lia-annot-tex-preview-border",r)};try{let t=new MutationObserver(function(){r()});t.observe(e,{attributes:!0,attributeFilter:["class","style","aria-invalid"]}),e.__liaAnnotTexBorderMo=t}catch(e){}r();let o=t.querySelector(".lia-annot-tex-preview-math"),l=function(){let n=(function(e){try{if(!e)return"";if(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)return String(e.value||"");if("true"===e.getAttribute("contenteditable")||"textbox"===e.getAttribute("role"))return String(e.textContent||"")}catch(e){}return""})(e).trim();if(r(),!n||document.activeElement===e){t.dataset.on="0",t.style.display="none",e.style.display="";return}t.dataset.on="1",t.style.display="inline-flex",e.style.display="none",o&&function(e,t){let n,a,r,o=b(t);if(e.innerHTML="",!o)return;let l=i.ROOT,s=window,c=s.katex||l.katex||s.KaTeX||l.KaTeX;try{if(c&&"function"==typeof c.render)return void c.render(o,e,{throwOnError:!1,displayMode:!1})}catch(e){}e.textContent=o,(n=i.ROOT,(r=(a=window).katex||n.katex||a.KaTeX||n.KaTeX)&&"function"==typeof r.render?Promise.resolve(r):T||(T=async function(){let e=n.document||document;if(!e.getElementById("__lia_annot_katex_css_v1")){let t=e.createElement("link");t.id="__lia_annot_katex_css_v1",t.rel="stylesheet",t.href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",(e.head||e.documentElement).appendChild(t)}let t=await Function("u","return import(u)")("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.mjs"),r=t.default||t;if(!r||"function"!=typeof r.render)throw Error("KaTeX render not available");try{n.katex||(n.katex=r)}catch(e){}try{a.katex||(a.katex=r)}catch(e){}return r}())).then(function(t){if(e.isConnected){e.innerHTML="";try{t.render(o,e,{throwOnError:!1,displayMode:!1})}catch(t){e.textContent=o}}}).catch(function(){e.isConnected&&(e.textContent=o)})}(o,n)};t.addEventListener("click",function(t){t.preventDefault(),t.stopPropagation(),e.style.display="";try{e.focus(),(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)&&e.select()}catch(e){}}),e.addEventListener("input",l),e.addEventListener("change",l),e.addEventListener("focus",l),e.addEventListener("blur",function(){setTimeout(l,0)}),e.__liaAnnotTexReady=!0,e.__liaAnnotTexSync=l,l()}function k(){let e=(0,o.getMarkedRect)();if(!e)return null;let t={x:e.x,y:e.y,w:e.w,h:e.h},n=(0,o.getPinnedQuizTarget)(),a=n&&m(n)?n:function(e){let t,n,a,r;if(!e||!i.STATE.canvas)return null;let l=(t=(0,o.getVisibleMainHost)(),n='input[type="text"], input:not([type]), textarea, [contenteditable="true"], [role="textbox"]',r=(a=t?Array.from(t.querySelectorAll(n)):[]).length?[]:Array.from(document.querySelectorAll(n)),(a.length?a:r).filter(m));if(!l.length)return null;let s=l.filter(y),c=s.length?s:l,d=i.STATE.canvas.getBoundingClientRect(),u=d.left+e.x+e.w/2,p=d.top+e.y+e.h/2,f=null,h=1/0;for(let e=0;e<c.length;e++){let t=c[e].getBoundingClientRect(),n=Math.hypot(t.left+t.width/2-u,t.top+t.height/2-p);n<h&&(h=n,f=c[e])}return f}(t);return a?{box:t,target:a}:null}async function _(){if(i.STORE.ui.ocrBusy||(0,i.isReadOnly)()||!i.STORE.ui.visible)return null;let e=f();if(!e||"function"!=typeof e.recognize)return null;await w(e);let t=k();if(!t)return null;S=t.target;let n=function(e){if(!e||!i.STATE.canvas)return null;let t=i.STATE.dpr||window.devicePixelRatio||1,n=(0,i.clamp)(Math.floor(e.x-12),0,i.STATE.cssW),a=(0,i.clamp)(Math.floor(e.y-12),0,i.STATE.cssH),r=(0,i.clamp)(Math.ceil(e.x+e.w+12),0,i.STATE.cssW),o=(0,i.clamp)(Math.ceil(e.y+e.h+12),0,i.STATE.cssH),l=Math.max(1,r-n),s=Math.max(1,o-a),c=Math.round(n*t),d=Math.round(a*t),u=Math.max(1,Math.round(l*t)),p=Math.max(1,Math.round(s*t)),f=document.createElement("canvas");f.width=u,f.height=p;let h=f.getContext("2d",{willReadFrequently:!0});if(!h)return null;h.setTransform(1,0,0,1,0,0),h.fillStyle="#fff",h.fillRect(0,0,f.width,f.height),h.drawImage(i.STATE.canvas,c,d,u,p,0,0,f.width,f.height);let g=h.getImageData(0,0,f.width,f.height),m=g.data;for(let e=0;e<m.length;e+=4){let t=.299*m[e]+.587*m[e+1]+.114*m[e+2]<210?0:255;m[e]=t,m[e+1]=t,m[e+2]=t,m[e+3]=255}return h.putImageData(g,0,0),f}(t.box);if(!n)return null;i.STORE.ui.ocrBusy=!0,(0,l.updateToolbar)();try{return await O(e,n)||null}catch(e){return null}finally{i.STORE.ui.ocrBusy=!1,(0,l.updateToolbar)()}}function z(e){let t=b(e);if(!t)return!1;let n=S&&m(S)?S:null;if(!n){let e=k();if(!e)return!1;n=e.target}let a=function(e,t){let n=String(null==t?"":t);try{if(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)return e.focus(),e.value=n,e.dispatchEvent(new Event("input",{bubbles:!0})),e.dispatchEvent(new Event("change",{bubbles:!0})),e.dispatchEvent(new KeyboardEvent("keyup",{bubbles:!0,key:"Enter"})),e.dispatchEvent(new Event("blur",{bubbles:!0})),R(e),!0;if("true"===e.getAttribute("contenteditable")||"textbox"===e.getAttribute("role"))return e.focus(),e.textContent=n,e.dispatchEvent(new Event("input",{bubbles:!0})),e.dispatchEvent(new Event("change",{bubbles:!0})),R(e),!0}catch(e){}return!1}(n,t);return a&&(S=n),a}async function C(){let e=await _();return!!e&&z(e)}function q(e){let t=Number(e);return isFinite(t)?Math.round(1e4*t)/1e4:null}function P(e){if(!e||"object"!=typeof e)return null;let t=q(e.x),n=q(e.y);return null===t||null===n?null:{x:t,y:n}}function L(e){if(!e||"object"!=typeof e||"path"!==e.kind)return null;let t=Array.isArray(e.points)?e.points.map(P).filter(e=>null!==e):[];if(!t.length)return null;let n="eraser"===e.tool?"eraser":"pen",a=q(e.width),r=q(null==e.alpha?1:e.alpha),i=q(e.baseW);return{kind:"path",tool:n,color:String(e.color||"#ff0000"),width:null===a?1:a,alpha:null===r?1:r,baseW:null===i?1:i,points:t}}function N(e){let t={};if(!e||"object"!=typeof e)return t;for(let n in e){if(!Object.prototype.hasOwnProperty.call(e,n))continue;let a=e[n];if(!a||"object"!=typeof a)continue;let r=Array.isArray(a.items)?a.items.map(L).filter(e=>null!==e):[];r.length&&(t[String(n)]={items:r,redo:[]})}return t}function I(e){if(!e||"object"!=typeof e)return null;let t=String(e.id||"").trim();if(!t||!/^[A-Za-z0-9_-]+$/.test(t))return null;let n=Number(e.x),a=Number(e.y),r=Number(e.w),i=Number(e.h);if(!isFinite(n)||!isFinite(a)||!isFinite(r)||!isFinite(i))return null;let o=String(e.spec||"").trim(),l=String(e.language||"").trim().toLowerCase();return{id:t,x:Math.max(0,Math.round(n)),y:Math.max(0,Math.round(a)),w:Math.max(120,Math.round(r)),h:Math.max(90,Math.round(i)),spec:o||void 0,language:"de"===l?"de":"en"===l?"en":void 0}}function F(){let e=N(i.STORE.slides);for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!0;return!1}function W(){return(0,i.copyJson)({version:"lia-annotation-v8",ui:{visible:!!i.STORE.ui.visible},slides:i.STORE.slides})}function j(){return(0,i.copyJson)({version:"lia-annotation-freeze-v1",ui:{visible:!!i.STORE.ui.visible},slides:N(i.STORE.slides)})}function D(e,t){let n=!1!==(t&&"object"==typeof t?t:{}).replace;if(!e||"object"!=typeof e)return!1;if(n&&(i.STORE.slides={}),e.slides&&"object"==typeof e.slides){let t=e.slides;for(let e in t){if(!Object.prototype.hasOwnProperty.call(t,e))continue;let n=t[e];n&&"object"==typeof n&&(i.STORE.slides[e]={items:Array.isArray(n.items)?(0,i.copyJson)(n.items):[],redo:Array.isArray(n.redo)?(0,i.copyJson)(n.redo):[],widgets:Array.isArray(n.widgets)?n.widgets.map(I).filter(e=>null!==e):[]})}}if(e.ui&&"object"==typeof e.ui){let t=e.ui;"boolean"==typeof t.visible&&(i.STORE.ui.visible=t.visible)}return(0,i.ensureSlide)((0,i.getSlideKey)()),(0,o.ensureOverlay)(),(0,o.syncOverlayInteractivity)(),(0,o.requestSync)(),(0,o.requestRedraw)(),(0,l.updateToolbar)(),!0}function B(e,t){let n=!1!==(t&&"object"==typeof t?t:{}).replace;if(!e||"object"!=typeof e)return!1;n&&(i.STORE.slides={});let a=N(e.slides);for(let e in a)Object.prototype.hasOwnProperty.call(a,e)&&(i.STORE.slides[e]={items:(0,i.copyJson)(a[e].items)||[],redo:[]});if(e.ui&&"object"==typeof e.ui){let t=e.ui;"boolean"==typeof t.visible&&(i.STORE.ui.visible=t.visible)}return(0,i.ensureSlide)((0,i.getSlideKey)()),(0,o.ensureOverlay)(),(0,o.syncOverlayInteractivity)(),(0,o.requestSync)(),(0,o.requestRedraw)(),(0,l.updateToolbar)(),!0}function X(e){i.STORE.ui.visible=!!e,(0,o.syncOverlayInteractivity)(),(0,o.requestRedraw)(),(0,l.updateToolbar)()}function H(e){i.STORE.ui.forcedReadOnly=null===e?null:!!e,(0,o.syncOverlayInteractivity)(),(0,l.updateToolbar)()}function Y(){window.__LIA_ANNOTATION__={exportState:W,exportFreezeState:j,importState:D,importFreezeState:B,hasFreezeData:F,setVisible:X,toggleVisible:()=>X(!i.STORE.ui.visible),setReadOnly:H,clearSlide:d,clearAllSlides:u,isOcrAvailable:h,recognizeLatestAnnotationText:_,submitOcrTextToNearestQuiz:z,transferToNearestQuiz:C,startDgsPlacementMode:o.startDgsPlacementMode,refresh:function(){(0,o.ensureOverlay)(),(0,o.requestSync)(),(0,l.updateToolbar)()},getStore:function(){return(0,i.copyJson)(i.STORE)},getSlideKey:function(){return(0,i.getSlideKey)()}},window.__LIA_ANNOTATION_EXPORT__=function(){return W()},window.__LIA_ANNOTATION_IMPORT__=function(e,t){return D(e,t)},window.__LIA_ANNOTATION_FREEZE_EXPORT__=function(){return j()},window.__LIA_ANNOTATION_FREEZE_IMPORT__=function(e,t){return B(e,t)},window.__LIA_ANNOTATION_FREEZE_HAS_DATA__=function(){return F()}}},{"./store":"cswaT","./overlay":"8rPw4","./ui":"7Wjmu","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}]},["8RSWf"],"8RSWf","parcelRequire23ca",{});
//# sourceMappingURL=index.js.map
