!function(t,e,n,a,r){var i="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:"u">typeof global?global:{},o="function"==typeof i[a]&&i[a],l=o.i||{},s=o.cache||{},c="u">typeof module&&"function"==typeof module.require&&module.require.bind(module);function d(e,n){if(!s[e]){if(!t[e]){if(r[e])return r[e];var l="function"==typeof i[a]&&i[a];if(!n&&l)return l(e,!0);if(o)return o(e,!0);if(c&&"string"==typeof e)return c(e);var u=Error("Cannot find module '"+e+"'");throw u.code="MODULE_NOT_FOUND",u}f.resolve=function(n){var a=t[e][1][n];return null!=a?a:n},f.cache={};var p=s[e]=new d.Module(e);t[e][0].call(p.exports,f,p,p.exports,i)}return s[e].exports;function f(t){var e=f.resolve(t);if(!1===e)return{};if(Array.isArray(e)){var n={__esModule:!0};return e.forEach(function(t){var e=t[0],a=t[1],r=t[2]||t[0],i=d(a);"*"===e?Object.keys(i).forEach(function(t){"default"===t||"__esModule"===t||Object.prototype.hasOwnProperty.call(n,t)||Object.defineProperty(n,t,{enumerable:!0,get:function(){return i[t]}})}):"*"===r?Object.defineProperty(n,e,{enumerable:!0,value:i}):Object.defineProperty(n,e,{enumerable:!0,get:function(){return"default"===r?i.__esModule?i.default:i:i[r]}})}),n}return d(e)}}d.isParcelRequire=!0,d.Module=function(t){this.id=t,this.bundle=d,this.require=c,this.exports={}},d.modules=t,d.cache=s,d.parent=o,d.distDir=void 0,d.publicUrl=void 0,d.devServer=void 0,d.i=l,d.register=function(e,n){t[e]=[function(t,e){e.exports=n},{}]},Object.defineProperty(d,"root",{get:function(){return i[a]}}),i[a]=d;for(var u=0;u<e.length;u++)d(e[u]);if(n){var p=d(n);"object"==typeof exports&&"u">typeof module?module.exports=p:"function"==typeof define&&define.amd&&define(function(){return p})}}({"8RSWf":[function(t,e,n,a){var r=t("./store"),i=t("./ui"),o=t("./overlay"),l=t("./api");if(!r.IS_DUPLICATE){(0,i.setToolbarCallbacks)({requestRedraw:o.requestRedraw,requestSync:o.requestSync,syncOverlayInteractivity:o.syncOverlayInteractivity,ensureOverlay:o.ensureOverlay,doUndo:l.doUndo,doRedo:l.doRedo,clearSlide:l.clearSlide,transferToNearestQuiz:l.transferToNearestQuiz,recognizeLatestAnnotationText:l.recognizeLatestAnnotationText,submitOcrTextToNearestQuiz:l.submitOcrTextToNearestQuiz,isOcrAvailable:l.isOcrAvailable,startDgsPlacementMode:o.startDgsPlacementMode}),(0,i.setGetVisibleMainHost)(o.getVisibleMainHost),(0,o.setOverlayCallbacks)({submitMarkedRect:l.transferToNearestQuiz,shouldPromptDgsInsert:l.shouldPromptDgsInsert}),(0,i.ensureCss)(),(0,i.applyThemeVars)(),(0,i.ensureToolbar)(),(0,r.ensureSlide)((0,r.getSlideKey)()),(0,o.ensureOverlay)(),(0,i.syncToolbarPosition)(),(0,i.updateToolbar)(),(0,l.registerGlobalApi)(),setTimeout(o.requestSync,0),setTimeout(o.requestSync,80),setTimeout(o.requestSync,250),setTimeout(o.requestSync,700),window.addEventListener("resize",function(){c(),(0,o.requestSync)(!0)}),window.addEventListener("hashchange",function(){(0,o.exitQuizPickingMode)(),(0,o.clearMarkedRect)(),r.STORE.ui.ocrBusy=!1,r.STORE.ui.ocrDraft="",r.STORE.ui.ocrFailed=!1,(0,r.ensureSlide)((0,r.getSlideKey)()),(0,o.ensureOverlay)(),(0,i.updateToolbar)(),setTimeout(function(){(0,o.requestSync)(!0)},40),setTimeout(function(){(0,o.requestSync)(!0)},180),setTimeout(function(){(0,o.requestSync)(!0)},500)}),window.addEventListener("scroll",function(){(0,o.requestSync)(!1)},!0),document.addEventListener("input",function(){(0,o.requestSync)(!0)},!0),document.addEventListener("change",function(){(0,o.requestSync)(!0)},!0);let t=new Set(["--lia-annot-border","--lia-annot-fg","--lia-annot-accent","--lia-annot-bg","--lia-annot-panel-bg"]);function s(){return JSON.stringify([document.documentElement,document.body].map(function(e){if(!e)return null;let n=Array.from(e.style).filter(n=>e!==document.documentElement||!t.has(n)).sort().map(t=>[t,e.style.getPropertyValue(t),e.style.getPropertyPriority(t)]);return[e.className,n]}))}let e=s(),n=0;function c(){n||(n=requestAnimationFrame(function(){n=0,e=s(),(0,i.applyThemeVars)(),(0,i.updateToolbar)(),(0,o.syncOverlayInteractivity)(),(0,o.requestSync)(!0),(0,o.requestRedraw)()}))}let a=new MutationObserver(function(){s()!==e&&c()});try{a.observe(document.documentElement,{attributes:!0,attributeFilter:["class","style"]}),document.body&&a.observe(document.body,{attributes:!0,attributeFilter:["class","style"]})}catch(t){}let d=(0,l.isOcrAvailable)(),u=window.setInterval(function(){let t=(0,l.isOcrAvailable)();t!==d&&(d=t,(0,i.updateToolbar)())},1200);window.addEventListener("pagehide",function(){window.clearInterval(u)})}},{"./store":"cswaT","./ui":"7Wjmu","./overlay":"8rPw4","./api":"bH1QJ"}],cswaT:[function(t,e,n,a){var r=t("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"ROOT",()=>i),r.export(n,"DOC_ID",()=>o),r.export(n,"IS_DUPLICATE",()=>d),r.export(n,"STORE",()=>u),r.export(n,"STATE",()=>p),r.export(n,"clamp",()=>f),r.export(n,"copyJson",()=>h),r.export(n,"parseRgbNoRegex",()=>g),r.export(n,"luminance",()=>m),r.export(n,"getViewportWidth",()=>b),r.export(n,"getCurrentHash",()=>y),r.export(n,"getSlideKey",()=>x),r.export(n,"ensureSlide",()=>T),r.export(n,"currentSlide",()=>S),r.export(n,"toRel",()=>v),r.export(n,"fromRel",()=>E),r.export(n,"isReadOnly",()=>w),r.export(n,"effectiveMode",()=>A),r.export(n,"getLineWidthPx",()=>M);let i=function(){let t=window;try{for(;t.parent&&t.parent!==t;)t=t.parent}catch(t){}return t}(),o=document.baseURI||location.href||"doc",l="__LIA_ANNOTATION_REG_V8__",s="__LIA_ANNOTATION_STORE_V8__";i[l]=i[l]||{docs:{}};let c=i[l],d=!!c.docs[o];c.docs[o]=!0,i[s]=i[s]||{slides:{},ui:{mode:"cursor",visible:!0,panelOpen:!1,panelMode:"pen",color:"#ff0000",width:3,alpha:1,eraserWidth:18,ocrBusy:!1,ocrDraft:"",ocrFailed:!1,forcedReadOnly:null}};let u=i[s];"boolean"!=typeof u.ui.ocrBusy&&(u.ui.ocrBusy=!1),"string"!=typeof u.ui.ocrDraft&&(u.ui.ocrDraft=""),"boolean"!=typeof u.ui.ocrFailed&&(u.ui.ocrFailed=!1);let p={host:null,shell:null,canvas:null,ctx:null,slideKey:null,cssW:0,cssH:0,dpr:window.devicePixelRatio||1,drawing:!1,activePath:null,syncRAF:0,resizeObserver:null,toolbar:null,eraserRing:null,lastPointer:{x:0,y:0,inside:!1,pointerType:""}};function f(t,e,n){return Math.max(e,Math.min(n,t))}function h(t){try{return JSON.parse(JSON.stringify(t))}catch(t){return null}}function g(t){let e=String(t||""),n=e.indexOf("("),a=e.indexOf(")");if(n<0||a<0)return null;let r=e.slice(n+1,a).split(",").map(t=>Number(String(t).trim()));return!(r.length<3)&&isFinite(r[0])&&isFinite(r[1])&&isFinite(r[2])?[r[0],r[1],r[2]]:null}function m(t){let e=t.map(t=>t/255).map(t=>t<=.03928?t/12.92:Math.pow((t+.055)/1.055,2.4));return .2126*e[0]+.7152*e[1]+.0722*e[2]}function b(){return Math.max(1,window.innerWidth||0,document.documentElement&&document.documentElement.clientWidth||0)}function y(){return String(location.hash||"").trim()||"#1"}function x(){return y()}function T(t){return u.slides[t]=u.slides[t]||{items:[],redo:[],widgets:[]},Array.isArray(u.slides[t].widgets)||(u.slides[t].widgets=[]),u.slides[t]}function S(){return T(x())}function v(t,e){return{x:p.cssW>0?t/p.cssW:0,y:p.cssH>0?e/p.cssH:0}}function E(t){return{x:t&&isFinite(t.x)?t.x*p.cssW:0,y:t&&isFinite(t.y)?t.y*p.cssH:0}}function w(){if(!0===u.ui.forcedReadOnly)return!0;if(!1===u.ui.forcedReadOnly)return!1;let t=document.body;return!!t&&(t.classList.contains("lia-snapshot-mode")||t.classList.contains("lia-shared-freeze-link")||t.classList.contains("lia-freeze-mode"))}function A(){return!u.ui.visible||w()?"cursor":u.ui.mode||"cursor"}function M(t){let e=Math.max(1,Number(t&&t.baseW)||p.cssW||1);return Math.max(.75,Math.max(1,p.cssW||1)/e*Math.max(.75,Number(t&&t.width)||1))}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],k3151:[function(t,e,n,a){n.interopDefault=function(t){return t&&t.__esModule?t:{default:t}},n.defineInteropFlag=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.exportAll=function(t,e){return Object.keys(t).forEach(function(n){"default"===n||"__esModule"===n||Object.prototype.hasOwnProperty.call(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[n]}})}),e},n.export=function(t,e,n){Object.defineProperty(t,e,{enumerable:!0,get:n})}},{}],"7Wjmu":[function(t,e,n,a){var r=t("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"getThemeAccent",()=>p),r.export(n,"applyThemeVars",()=>f),r.export(n,"ensureCss",()=>h),r.export(n,"iconEye",()=>g),r.export(n,"hideEraserRing",()=>m),r.export(n,"updateEraserRing",()=>b),r.export(n,"refreshEraserRing",()=>y),r.export(n,"tUi",()=>w),r.export(n,"registerToolbarControl",()=>C),r.export(n,"unregisterToolbarControl",()=>z),r.export(n,"hasToolbarControl",()=>P),r.export(n,"setToolbarCallbacks",()=>I),r.export(n,"ensureToolbar",()=>F),r.export(n,"updateToolbar",()=>W),r.export(n,"syncToolbarPosition",()=>B),r.export(n,"setGetVisibleMainHost",()=>D);var i=t("./store"),o=t("./styles"),l=t("./dom");function s(t,e){t.disabled!==e&&(t.disabled=e)}function c(t,e){t&&document.activeElement!==t&&t.value!==e&&(t.value=e)}let d=null;function u(t){return!t||"transparent"===t||/^rgba\([^)]*,\s*0(?:\.0+)?\s*\)$/.test(t)}function p(){try{let t=document.querySelector(".lia-btn");if(t){let e=getComputedStyle(t).backgroundColor;if(!u(e))return e}d&&d.isConnected||((d=document.createElement("button")).className="lia-btn",d.type="button",d.setAttribute("aria-hidden","true"),d.tabIndex=-1,d.style.position="absolute",d.style.left="-9999px",d.style.top="-9999px",d.style.visibility="hidden",(document.body||document.documentElement).appendChild(d));let e=getComputedStyle(d).backgroundColor;if(!u(e))return e}catch(t){}return null}function f(){try{let t=document.documentElement,e=getComputedStyle(document.body||t).backgroundColor;u(e)&&(e=getComputedStyle(t).backgroundColor);let n=u(e)?null:(0,i.parseRgbNoRegex)(e),a=!!n&&.5>(0,i.luminance)(n);(0,l.setStyle)(t,"--lia-annot-border",a?"#fff":"#000"),(0,l.setStyle)(t,"--lia-annot-fg",a?"#fff":"#000");let r=p();r&&(0,l.setStyle)(t,"--lia-annot-accent",r),a?((0,l.setStyle)(t,"--lia-annot-bg","rgba(28,28,28,0.96)"),(0,l.setStyle)(t,"--lia-annot-panel-bg","rgba(34,34,34,0.97)")):((0,l.setStyle)(t,"--lia-annot-bg","rgba(255,255,255,0.96)"),(0,l.setStyle)(t,"--lia-annot-panel-bg","rgba(255,255,255,0.97)"))}catch(t){}}function h(){if(document.getElementById("__lia_annotation_css_v8"))return;let t=document.createElement("style");t.id="__lia_annotation_css_v8",t.textContent=o.CSS,(document.head||document.documentElement).appendChild(t)}function g(t){return t?`<svg viewBox="0 0 24 24" aria-hidden="true">
      <path class="ico-stroke" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/>
      <circle cx="12" cy="12" r="3.2" class="ico-stroke"></circle>
    </svg>`:`<svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M3 3l18 18"/>
    <path class="ico-stroke" d="M2.5 12s3.5-6 9.5-6c1.8 0 3.3.5 4.6 1.2"/>
    <path class="ico-stroke" d="M21.5 12s-3.5 6-9.5 6c-1.8 0-3.4-.5-4.8-1.3"/>
  </svg>`}function m(){i.STATE.eraserRing&&(0,l.setAttribute)(i.STATE.eraserRing,"data-on","0")}function b(t,e){if(!i.STATE.eraserRing)return;if(!i.STORE.ui.visible||(0,i.isReadOnly)()||"eraser"!==(0,i.effectiveMode)()||!isFinite(t)||!isFinite(e)||!isFinite(i.STATE.cssW)||!isFinite(i.STATE.cssH))return void m();let n=Math.max(8,Number(i.STORE.ui.eraserWidth||18));(0,l.setStyle)(i.STATE.eraserRing,"width",n+"px"),(0,l.setStyle)(i.STATE.eraserRing,"height",n+"px"),(0,l.setStyle)(i.STATE.eraserRing,"left",(0,i.clamp)(t,0,i.STATE.cssW)+"px"),(0,l.setStyle)(i.STATE.eraserRing,"top",(0,i.clamp)(e,0,i.STATE.cssH)+"px"),(0,l.setAttribute)(i.STATE.eraserRing,"data-on","1")}function y(){i.STATE.lastPointer&&i.STATE.lastPointer.inside?b(i.STATE.lastPointer.x,i.STATE.lastPointer.y):m()}let x={colors:{en:"Colors",de:"Farben",es:"Colores",fr:"Couleurs"},penWidth:{en:"Pen Width",de:"Stiftbreite",es:"Grosor del lápiz",fr:"Épaisseur du stylo"},opacity:{en:"Opacity",de:"Deckkraft",es:"Opacidad",fr:"Opacité"},eraser:{en:"Eraser",de:"Radierer",es:"Borrador",fr:"Gomme"},clearAll:{en:"Clear all",de:"Alles löschen",es:"Borrar todo",fr:"Tout effacer"},ocrTransfer:{en:"Submit as solution",de:"Als Lösung übernehmen",es:"Enviar como solucion",fr:"Soumettre comme solution"},rectSubmit:{en:"Submit as Solution",de:"Als Lösung übernehmen",es:"Enviar como solucion",fr:"Soumettre comme solution"},rectChooseQuiz:{en:"Choose Quiz",de:"Quiz wählen",es:"Elegir quiz",fr:"Choisir quiz"},rectChooseCancel:{en:"Cancel",de:"Abbrechen",es:"Cancelar",fr:"Annuler"},rectChosenFallback:{en:"Quiz",de:"Quiz",es:"Quiz",fr:"Quiz"},rectClearAria:{en:"Clear marked rectangle",de:"Markiertes Rechteck löschen",es:"Borrar rectangulo marcado",fr:"Effacer le rectangle marqué"},dgsRemove:{en:"Remove coordinate system",de:"Koordinatensystem entfernen",es:"Eliminar sistema de coordenadas",fr:"Supprimer le système de coordonnées"},ocrRecognize:{en:"Recognize",de:"Erkennen",es:"Reconocer",fr:"Reconnaître"},ocrSubmit:{en:"Insert into quiz",de:"In Quizfeld einsetzen",es:"Insertar en quiz",fr:"Insérer dans le quiz"},ocrResult:{en:"OCR Result",de:"OCR Ergebnis",es:"Resultado OCR",fr:"Résultat OCR"},ocrHint:{en:"Preview updates automatically as TeX.",de:"Vorschau aktualisiert sich automatisch als TeX.",es:"La vista previa se actualiza automaticamente como TeX.",fr:"L'aperçu se met automatiquement à jour en TeX."},ocrFailed:{en:"Recognition failed. Try drawing more clearly.",de:"Erkennung fehlgeschlagen. Bitte deutlicher schreiben.",es:"Reconocimiento fallido. Intente escribir más claro.",fr:"Reconnaissance échouée. Essayez d'écrire plus clairement."},penWidthAria:{en:"Pen width",de:"Stiftbreite",es:"Grosor del lápiz",fr:"Épaisseur du stylo"},opacityAria:{en:"Opacity",de:"Deckkraft",es:"Opacidad",fr:"Opacité"},eraserWidthAria:{en:"Eraser width",de:"Radierergröße",es:"Tamaño del borrador",fr:"Taille de la gomme"},colorAria:{en:"Color",de:"Farbe",es:"Color",fr:"Couleur"},readOnlyNote:{en:"Freeze/read-only mode: drawing is locked, show/hide still works.",de:"Freeze-/Nur-Lese-Modus: Zeichnen ist gesperrt, Anzeigen/Ausblenden funktioniert weiter.",es:"Modo congelado/solo lectura: dibujar está bloqueado, mostrar/ocultar sigue funcionando.",fr:"Mode figé/lecture seule: dessin verrouillé, afficher/masquer fonctionne encore."}};function T(t){if(!t)return null;let e=String(t).trim().toLowerCase().replace(/_/g,"-");if(!e)return null;let n=e.split("-")[0];return"de"===n||"es"===n||"en"===n||"fr"===n?n:null}let S=null;function v(){if(S)return S;try{let t,e,n=new URLSearchParams(String(location.search||"")),a=T(n.get("language")||n.get("lang"));if(a)return S=a;let r=new URLSearchParams((e=(t=String(location.hash||"")).indexOf("?"))>=0?t.slice(e+1):""),i=T(r.get("language")||r.get("lang"));if(i)return S=i;let o=T(document.documentElement&&document.documentElement.lang);if(o)return S=o;let l=T(document.body&&(document.body.getAttribute("lang")||document.body.getAttribute("data-language")));if(l)return S=l;let s=T(navigator&&(navigator.language||navigator.languages&&navigator.languages[0])||"");if(s)return S=s}catch(t){}return S="en"}function E(t,e){let n=x[e];return n&&n[t]||n.en}function w(t,e){return E(e||v(),t)}let A=null,M=new WeakMap,R=new Map;function O(t,e){return t.order-e.order||(t.id<e.id?-1:+(t.id>e.id))}function k(t){let e=function(t=i.STATE.toolbar){return t?.querySelector(".lia-annot-external-actions")}(t);e&&Array.from(R.values()).sort(O).forEach(function(t,n){let a=e.children[n]||null;a!==t.element&&e.insertBefore(t.element,a)})}function _(t,e,n){null===n?t.removeAttribute(e):t.setAttribute(e,n)}function C(t,e,n={}){let a=String(t||"").trim();if(!a||!(e instanceof HTMLElement)||e.ownerDocument!==document||e.classList.contains("lia-annot-toolbar")||e.contains(i.STATE.toolbar))return!1;let r=R.get(a);if(r&&r.element!==e)return!1;for(let t of R.values())if(t.id!==a&&t.element===e)return!1;let o=Number(n.order??r?.order??0),s=Number.isFinite(o)?o:0;if(r)r.order!==s&&(r.order=s);else{let t=e.parentNode,n=t?document.createComment("lia-annotation-control:"+a):null;t&&n&&t.insertBefore(n,e),R.set(a,{id:a,element:e,order:s,originalParent:t,originalNextSibling:e.nextSibling,originalPlaceholder:n,hadExternalClass:e.classList.contains("lia-annot-external-control"),originalControlAttribute:e.getAttribute("data-lia-annotation-control"),originalHostedAttribute:e.getAttribute("data-lia-annotation-hosted")})}return e.classList.contains("lia-annot-external-control")||e.classList.add("lia-annot-external-control"),(0,l.setAttribute)(e,"data-lia-annotation-control",a),(0,l.setAttribute)(e,"data-lia-annotation-hosted","true"),k(F()),!0}function z(t){let e=String(t||"").trim(),n=R.get(e);if(!n)return!1;R.delete(e);let{element:a}=n;if(a.classList.toggle("lia-annot-external-control",n.hadExternalClass),_(a,"data-lia-annotation-control",n.originalControlAttribute),_(a,"data-lia-annotation-hosted",n.originalHostedAttribute),n.originalPlaceholder?.parentNode?.isConnected)n.originalPlaceholder.parentNode.replaceChild(a,n.originalPlaceholder);else if(n.originalParent?.isConnected){let t=n.originalNextSibling?.parentNode===n.originalParent?n.originalNextSibling:null;(a.parentNode!==n.originalParent||a.nextSibling!==t)&&n.originalParent.insertBefore(a,t)}else a.parentElement?.classList.contains("lia-annot-external-actions")&&a.remove();n.originalPlaceholder?.remove();let r=i.STATE.toolbar;return r?.isConnected&&k(r),!0}function P(t){return R.has(String(t||"").trim())}let q=new WeakMap;function L(t){let e=t.querySelector('.lia-annot-btn[data-act="pen"]');e&&(0,l.setStyle)(e,"--lia-annot-pen-color",String(i.STORE.ui.color||"#ff0000"))}let N=null;function I(t){N=t}function F(){if(i.STATE.toolbar&&i.STATE.toolbar.isConnected)return k(i.STATE.toolbar),i.STATE.toolbar;let t=document.createElement("div");t.className="lia-annot-toolbar",t.setAttribute("data-snapshot-admin","1"),t.innerHTML=`
    <div class="lia-annot-actions" role="toolbar" aria-label="Annotation tools">
      <button class="lia-annot-btn" type="button" data-act="cursor" aria-label="Cursor" aria-pressed="false" title="Cursor" data-snapshot-admin="1"><svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M5 3.5l8.8 10.8-4.1 1 1.9 5.4-2.6 1-1.9-5.4-3.9 2.2L5 3.5z" fill="none" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="pen" aria-label="Pen" aria-pressed="false" title="Pen" data-snapshot-admin="1"><svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M4 20h4l10.2-10.2a2.2 2.2 0 0 0 0-3.1l-1.1-1.1a2.2 2.2 0 0 0-3.1 0L3.8 15.8 3 21z" fill="none" stroke-width="1.8" stroke-linejoin="round"/>
    <path class="ico-stroke" d="M13.2 6.8l4 4" fill="none" stroke-width="1.8" stroke-linecap="round"/>
  </svg><span class="lia-annot-pen-color" aria-hidden="true"></span></button>
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
  `,L(t);let e=t.querySelector('[data-act="toggle"]'),n=document.createElement("div");return n.className="lia-annot-external-actions",n.setAttribute("role","group"),n.setAttribute("aria-label","Template tools"),t.querySelector(".lia-annot-actions")?.appendChild(n),q.set(e,!0),(document.body||document.documentElement).appendChild(t),k(t),t.addEventListener("click",function(t){let e=t.target,n=e&&e.closest?e.closest(".lia-annot-actions > .lia-annot-btn[data-act], .lia-annot-panel button[data-act]"):null,a=e&&e.closest?e.closest(".lia-annot-panel .lia-annot-color-item[data-color]"):null;if(a){if(t.preventDefault(),t.stopPropagation(),(0,i.isReadOnly)())return;i.STORE.ui.color=String(a.getAttribute("data-color")||"#ff0000"),W();return}if(!n)return;t.preventDefault(),t.stopPropagation();let r=String(n.getAttribute("data-act")||"");if("toggle"===r){N?.ensureOverlay(),i.STORE.ui.visible=!i.STORE.ui.visible,N?.syncOverlayInteractivity(),W(),N?.requestRedraw(),N?.requestSync();return}if("cursor"===r){i.STORE.ui.mode="cursor",i.STORE.ui.panelOpen=!1,N?.syncOverlayInteractivity(),W();return}if("pen"===r){if((0,i.isReadOnly)())return;let t="pen"===i.STORE.ui.mode&&"pen"===i.STORE.ui.panelMode&&i.STORE.ui.panelOpen;i.STORE.ui.mode="pen",i.STORE.ui.panelMode="pen",i.STORE.ui.panelOpen=!t,N?.syncOverlayInteractivity(),W();return}if("eraser"===r){if((0,i.isReadOnly)())return;let t="eraser"===i.STORE.ui.mode&&"eraser"===i.STORE.ui.panelMode&&i.STORE.ui.panelOpen;i.STORE.ui.mode="eraser",i.STORE.ui.panelMode="eraser",i.STORE.ui.panelOpen=!t,N?.syncOverlayInteractivity(),W();return}if("undo"===r){if((0,i.isReadOnly)())return;N?.doUndo();return}if("redo"===r){if((0,i.isReadOnly)())return;N?.doRedo();return}if("clear"===r){if((0,i.isReadOnly)())return;N?.clearSlide();return}if("ocr-transfer"===r){if((0,i.isReadOnly)()||!i.STORE.ui.visible||!N?.isOcrAvailable())return;i.STORE.ui.panelOpen=!1,i.STORE.ui.mode="rect",N?.syncOverlayInteractivity(),W();return}if("dgs-place"===r){if((0,i.isReadOnly)()||!i.STORE.ui.visible||!N?.startDgsPlacementMode)return;i.STORE.ui.panelOpen=!1,N.startDgsPlacementMode(),W();return}if("ocr-recognize"===r){if((0,i.isReadOnly)()||i.STORE.ui.ocrBusy||!i.STORE.ui.visible||!N||!N.isOcrAvailable()||!N.recognizeLatestAnnotationText)return;i.STORE.ui.ocrFailed=!1,N.recognizeLatestAnnotationText().then(function(t){"string"==typeof t&&t.trim()?(i.STORE.ui.ocrDraft=t,i.STORE.ui.ocrFailed=!1):i.STORE.ui.ocrFailed=!0,W(),N?.requestSync()});return}if("ocr-submit"===r){if((0,i.isReadOnly)()||i.STORE.ui.ocrBusy||!N?.submitOcrTextToNearestQuiz)return;N.submitOcrTextToNearestQuiz(String(i.STORE.ui.ocrDraft||"")),N.requestSync(),W();return}},!0),t.addEventListener("input",function(t){let e=t.target;if(!(e instanceof HTMLElement)||!e.closest(".lia-annot-panel"))return;let n=String(e.getAttribute("data-act")||"");if(!(0,i.isReadOnly)()){if("width"===n){i.STORE.ui.width=(0,i.clamp)(Number(e.value),1,24),W();return}if("alpha"===n){i.STORE.ui.alpha=(0,i.clamp)(Number(e.value),.1,1),W();return}if("eraserWidth"===n){i.STORE.ui.eraserWidth=(0,i.clamp)(Number(e.value),4,80),W();return}if("ocr-input"===n){i.STORE.ui.ocrDraft=String(e.value||""),W();return}}},!0),i.STATE.toolbar=t,t}function W(){let t=F(),e=(0,i.currentSlide)(),n=(0,i.isReadOnly)(),a=v();L(t);let r=t.querySelector(".lia-annot-panel");if(r){let t=i.STORE.ui.panelOpen&&!n?"1":"0",e="eraser"===i.STORE.ui.panelMode?"eraser":"ocr"===i.STORE.ui.panelMode?"ocr":"pen",o=String(r.dataset.builtMode||""),s=String(r.dataset.builtLang||"");if((0,l.setAttribute)(r,"data-open",t),!r.firstElementChild||o!==e||s!==a){if("eraser"===e)r.innerHTML=`
    <div class="lia-annot-row">
      <span class="k">${E(a,"eraser")}</span>
      <input class="lia-annot-slider" type="range" min="4" max="80" step="1" value="${i.STORE.ui.eraserWidth}" data-act="eraserWidth" aria-label="${E(a,"eraserWidthAria")}" data-snapshot-admin="1">
      <span class="v" data-k="eraserWidth">${i.STORE.ui.eraserWidth}</span>
    </div>
    <div class="lia-annot-row">
      <button class="lia-annot-danger" type="button" data-act="clear" data-snapshot-admin="1">${E(a,"clearAll")}</button>
    </div>
    <div class="lia-annot-note" data-k="note"></div>
  `;else if("ocr"===e)r.innerHTML=`
    <div class="lia-annot-row lia-annot-row--ocr-title">
      <span class="k">${E(a,"ocrResult")}</span>
    </div>
    <div class="lia-annot-row lia-annot-row--ocr-input">
      <textarea class="lia-annot-ocr-input" data-act="ocr-input" rows="3" data-snapshot-admin="1"></textarea>
    </div>
    <div class="lia-annot-row lia-annot-row--ocr-actions">
      <button class="lia-annot-primary" type="button" data-act="ocr-recognize" data-snapshot-admin="1">${E(a,"ocrRecognize")}</button>
      <button class="lia-annot-primary" type="button" data-act="ocr-submit" data-snapshot-admin="1">${E(a,"ocrSubmit")}</button>
    </div>
    <div class="lia-annot-ocr-preview" data-on="0">
      <div class="lia-annot-ocr-preview-math" data-k="ocrPreview"></div>
    </div>
    <div class="lia-annot-note" data-k="ocrHint">${E(a,"ocrHint")}</div>
    <div class="lia-annot-note" data-k="note"></div>
  `;else{let t;t=["#ff0000","#ff7500","#ffff00","#ff00ff","#0055ff","#00ffff","#00ff00","#007500","#000000","#ffffff"].map(function(t){return'<button class="lia-annot-color-item" type="button" data-color="'+t+'" aria-label="'+E(a,"colorAria")+" "+t+'" data-snapshot-admin="1" style="background:'+t+';"></button>'}).join(""),r.innerHTML=`
    <div class="lia-annot-row">
      <span class="k">${E(a,"colors")}</span>
      <span class="lia-annot-color-grid">${t}</span>
    </div>
    <div class="lia-annot-row">
      <span class="k">${E(a,"penWidth")}</span>
      <input class="lia-annot-slider" type="range" min="1" max="24" step="1" value="${i.STORE.ui.width}" data-act="width" aria-label="${E(a,"penWidthAria")}" data-snapshot-admin="1">
      <span class="v" data-k="width">${i.STORE.ui.width}</span>
    </div>
    <div class="lia-annot-row">
      <span class="k">${E(a,"opacity")}</span>
      <input class="lia-annot-slider" type="range" min="0.1" max="1" step="0.05" value="${i.STORE.ui.alpha}" data-act="alpha" aria-label="${E(a,"opacityAria")}" data-snapshot-admin="1">
      <span class="v" data-k="alpha">${Math.round(100*Number(i.STORE.ui.alpha||1))}%</span>
    </div>
    <div class="lia-annot-note" data-k="note"></div>
  `}(0,l.setAttribute)(r,"data-built-mode",e),(0,l.setAttribute)(r,"data-built-lang",a)}"ocr"===e&&function(t){if(!t)return;let e=t.querySelector(".lia-annot-ocr-preview"),n=t.querySelector('[data-k="ocrPreview"]');if(!e||!n)return;let a=String(i.STORE.ui.ocrDraft||"").trim();(0,l.setAttribute)(e,"data-on",a?"1":"0"),function(t,e){let n,a,r,i=String(e||"").trim();if(M.get(t)?.source===i)return;let o={source:i};if(M.set(t,o),!i)return(0,l.setText)(t,"");let s=window,c=window.top,d=s.katex||c&&c.katex||s.KaTeX||c&&c.KaTeX;try{if(d&&"function"==typeof d.render)return void d.render(i,t,{throwOnError:!1,displayMode:!1})}catch(t){}(0,l.setText)(t,i),(n=window,a=window.top,(r=n.katex||a&&a.katex||n.KaTeX||a&&a.KaTeX)&&"function"==typeof r.render?Promise.resolve(r):A||(A=async function(){if(!document.getElementById("__lia_annot_katex_css_v1")){let t=document.createElement("link");t.id="__lia_annot_katex_css_v1",t.rel="stylesheet",t.href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",(document.head||document.documentElement).appendChild(t)}let t=await Function("u","return import(u)")("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.mjs"),e=t.default||t;if(!e||"function"!=typeof e.render)throw Error("KaTeX render not available");try{n.katex||(n.katex=e)}catch(t){}try{a&&!a.katex&&(a.katex=e)}catch(t){}return e}())).then(function(e){if(t.isConnected&&M.get(t)===o)try{e.render(i,t,{throwOnError:!1,displayMode:!1})}catch(e){M.delete(t),(0,l.setText)(t,i)}}).catch(function(){t.isConnected&&M.get(t)===o&&(M.delete(t),(0,l.setText)(t,i))})}(n,a)}(r)}let o=r?r.querySelector('[data-k="note"]'):null;o&&(0,l.setText)(o,n?E(a,"readOnlyNote"):"");let d=t.querySelectorAll(".lia-annot-actions > .lia-annot-btn[data-act]"),u=!!N?.isOcrAvailable&&N.isOcrAvailable();if(u||"rect"!==i.STORE.ui.mode||(i.STORE.ui.mode="cursor",N?.syncOverlayInteractivity()),d.forEach(function(t){let r=String(t.getAttribute("data-act")||""),o="toggle"===r?!!i.STORE.ui.visible:r===i.STORE.ui.mode||"ocr-transfer"===r&&"rect"===i.STORE.ui.mode,c="ocr-transfer"===r&&!!i.STORE.ui.ocrBusy;(0,l.setAttribute)(t,"data-active",o?"1":"0"),(0,l.setAttribute)(t,"data-busy",c?"1":"0"),"toggle"===r&&q.get(t)!==!!i.STORE.ui.visible&&(t.innerHTML=g(!!i.STORE.ui.visible),q.set(t,!!i.STORE.ui.visible)),("cursor"===r||"pen"===r||"eraser"===r||"toggle"===r)&&(0,l.setAttribute)(t,"aria-pressed",o?"true":"false");let d=!1;"undo"===r?d=n||0===e.items.length:"redo"===r?d=n||0===e.redo.length:"dgs-place"===r?d=n||!i.STORE.ui.visible:"ocr-transfer"===r?(d=n||!i.STORE.ui.visible||i.STORE.ui.ocrBusy||!u,!u!==t.hidden&&(t.hidden=!u),(0,l.setStyle)(t,"display",u?"":"none"),(0,l.setAttribute)(t,"title",E(a,"ocrTransfer")),(0,l.setAttribute)(t,"aria-label",E(a,"ocrTransfer"))):("pen"===r||"eraser"===r)&&(d=n),s(t,d)}),r){r.querySelectorAll(".lia-annot-color-item").forEach(function(t){let e=String(t.getAttribute("data-color")||"");(0,l.setAttribute)(t,"data-active",e===String(i.STORE.ui.color||"")?"1":"0"),s(t,n)});let t=r.querySelector('.lia-annot-danger[data-act="clear"]');t&&s(t,n||0===e.items.length);let o=r.querySelector('input[data-act="width"]'),d=r.querySelector('input[data-act="alpha"]'),p=r.querySelector('input[data-act="eraserWidth"]'),f=r.querySelector('textarea[data-act="ocr-input"]'),h=r.querySelector('button[data-act="ocr-recognize"]'),g=r.querySelector('button[data-act="ocr-submit"]'),m=r.querySelector('[data-k="width"]'),b=r.querySelector('[data-k="alpha"]'),y=r.querySelector('[data-k="eraserWidth"]');c(o,String(i.STORE.ui.width)),c(d,String(i.STORE.ui.alpha)),c(p,String(i.STORE.ui.eraserWidth)),c(f,String(i.STORE.ui.ocrDraft||"")),m&&(0,l.setText)(m,String(i.STORE.ui.width)),b&&(0,l.setText)(b,Math.round(100*Number(i.STORE.ui.alpha||1))+"%"),y&&(0,l.setText)(y,String(i.STORE.ui.eraserWidth)),f&&s(f,n||i.STORE.ui.ocrBusy),h&&s(h,n||i.STORE.ui.ocrBusy||!u),g&&s(g,n||i.STORE.ui.ocrBusy||!String(i.STORE.ui.ocrDraft||"").trim());let x=r.querySelector('[data-k="ocrHint"]');x&&((0,l.setText)(x,i.STORE.ui.ocrFailed?E(a,"ocrFailed"):E(a,"ocrHint")),(0,l.setStyle)(x,"color",i.STORE.ui.ocrFailed?"var(--lia-annot-danger, #c0392b)":""))}"eraser"===(0,i.effectiveMode)()&&i.STORE.ui.visible&&!n&&i.STATE.lastPointer&&i.STATE.lastPointer.inside?y():m()}function B(){let t=F(),e=j();if(!t||!e)return;let n=(0,i.getViewportWidth)(),a=Math.ceil(t.getBoundingClientRect().width||t.offsetWidth||44),r=Math.round((e.closest(".lia-slide__container")||e.parentElement||e).getBoundingClientRect().left+8);r=Math.min(r=Math.max(8,r),Math.max(8,n-a-8)),(0,l.setStyle)(t,"left",r+"px")}let j=()=>document.body||document.documentElement;function D(t){j=t}},{"./store":"cswaT","./styles":"86IFJ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151","./dom":"azxXB"}],"86IFJ":[function(t,e,n,a){var r=t("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"CSS",()=>i);let i=`
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
    /* Stay above course content, but below LiaScript's modal/Classroom layer (9000). */
    z-index: 8990;
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

  .lia-annot-external-actions {
    display: inline-flex;
    flex-direction: column;
    gap: 2px;
    align-items: center;
    width: 32px;
    margin-top: 6px;
    padding-top: 6px;
    box-sizing: content-box;
    border-top: 1px solid var(--lia-annot-border);
  }

  .lia-annot-external-actions:empty {
    display: none;
  }

  .lia-annot-external-control {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
    margin: 0;
    flex: 0 0 32px;
    box-sizing: border-box;
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

  .lia-annot-btn[data-act="pen"] .lia-annot-pen-color {
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 8px;
    height: 8px;
    box-sizing: border-box;
    border: 1px solid var(--lia-annot-bg);
    border-radius: 999px;
    background: var(--lia-annot-pen-color, #ff0000);
    pointer-events: none;
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
    z-index: 1;
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

  /* Pen/selection starts are routed from the real element below the visual
     overlay. Keep touch gestures in drawing mode until that routing decision
     has been made. */
  .lia-annot-host[data-lia-annot-capture] {
    touch-action: none !important;
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

  .lia-annot-dgs-frame {
    position: relative;
    display: block;
    width: 100%;
    overflow: visible;
  }

  .lia-annot-dgs-board {
    position: relative;
    width: min(240px, 100%);
    height: 180px;
    background: transparent;
  }

  .lia-annot-dgs-remove {
    position: absolute;
    top: -12px;
    left: -12px;
    z-index: 502;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 1px solid var(--lia-annot-border);
    border-radius: 999px;
    background: var(--lia-annot-panel-bg);
    color: var(--lia-annot-fg);
    box-shadow: var(--lia-annot-panel-shadow);
    font: 700 18px/1 system-ui, sans-serif;
    cursor: pointer;
    pointer-events: auto;
  }

  .lia-annot-dgs-remove:hover {
    color: var(--lia-annot-danger, #c0392b);
    border-color: currentColor;
  }

  .lia-annot-dgs-remove:focus-visible {
    outline: 2px solid var(--lia-annot-accent);
    outline-offset: 2px;
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
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],azxXB:[function(t,e,n,a){var r=t("@parcel/transformer-js/src/esmodule-helpers.js");function i(t,e,n){t.getAttribute(e)!==n&&t.setAttribute(e,n)}r.defineInteropFlag(n),r.export(n,"setAttribute",()=>i),r.export(n,"setStyle",()=>l),r.export(n,"setText",()=>s);let o=new WeakMap;function l(t,e,n){let a=t.style,r=a.getPropertyValue(e),i=a.getPropertyPriority(e),l=o.get(t)?.get(e);if(r===n&&!i||l?.input===n&&l.serialized===r&&l.priority===i)return;a.setProperty(e,n);let s=o.get(t);s||(s=new Map,o.set(t,s)),s.set(e,{input:n,serialized:a.getPropertyValue(e),priority:a.getPropertyPriority(e)})}function s(t,e){t.textContent!==e&&(t.textContent=e)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"8rPw4":[function(t,e,n,a){var r=t("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"getPinnedQuizTarget",()=>T),r.export(n,"clearPinnedQuizTarget",()=>S),r.export(n,"setOverlayCallbacks",()=>M),r.export(n,"getMarkedRect",()=>R),r.export(n,"clearMarkedRect",()=>O),r.export(n,"startDgsPlacementMode",()=>L),r.export(n,"exitQuizPickingMode",()=>te),r.export(n,"getDirectHeader",()=>ta),r.export(n,"findDirectChildByClass",()=>tr),r.export(n,"isMainVisible",()=>ti),r.export(n,"getVisibleMainHost",()=>to),r.export(n,"disconnectResizeObserver",()=>tl),r.export(n,"bindResizeObserver",()=>ts),r.export(n,"bindCanvasEvents",()=>td),r.export(n,"ensureOverlay",()=>tu),r.export(n,"syncOverlayInteractivity",()=>tp),r.export(n,"syncCanvasSize",()=>tb),r.export(n,"requestSync",()=>tv),r.export(n,"redrawNow",()=>tR),r.export(n,"requestRedraw",()=>tO);var i=t("./store"),o=t("./ui"),l=t("./dom");let s=null,c=null,d=null,u=!1,p=!1,f=0,h=0,g="",m=1,b=null,y=!1,x=!1;function T(){return b}function S(){b=null}let v=0,E=0;function w(t){if(!i.STATE.shell)return;let e=i.STATE.shell.querySelector(".lia-annot-rect-progress"),n=i.STATE.shell.querySelector(".lia-annot-rect-progfill"),a=i.STATE.shell.querySelector(".lia-annot-rect-progtxt");if(!e||!n||!a)return;let r=Math.max(0,Math.min(1,Number(t)));(0,l.setStyle)(n,"width",Math.round(100*r)+"%"),(0,l.setText)(a,Math.round(100*r)+"%")}function A(t){v&&(cancelAnimationFrame(v),v=0),w(t),setTimeout(function(){!function(){if(!i.STATE.shell)return;let t=i.STATE.shell.querySelector(".lia-annot-rect-progress");t&&((0,l.setAttribute)(t,"data-on","0"),w(0))}()},250)}function M(t){d=t}function R(){if(!s)return null;let t=Math.min(s.x0,s.x1),e=Math.min(s.y0,s.y1);return{x:t,y:e,w:Math.max(1,Math.abs(s.x1-s.x0)),h:Math.max(1,Math.abs(s.y1-s.y0))}}function O(){s=null,c=null,tO()}function k(){let t=(0,i.ensureSlide)((0,i.getSlideKey)());return Array.isArray(t.widgets)||(t.widgets=[]),t.widgets}function _(){try{let t=String(document.documentElement&&document.documentElement.lang||"").trim().toLowerCase(),e=String(document.body&&(document.body.getAttribute("lang")||document.body.getAttribute("data-language"))||"").trim().toLowerCase(),n=String(navigator&&(navigator.language||navigator.languages&&navigator.languages[0])||"").trim().toLowerCase();return(t||e||n).startsWith("de")?"de":"en"}catch(t){return"en"}}function C(t){u=!!t;let e=i.STATE.shell?i.STATE.shell.querySelector(".lia-annot-dgs-prompt"):null;if(e){if(u){let t=(0,i.ensureSlide)((0,i.getSlideKey)()).items.filter(function(t){return t&&"path"===t.kind&&"pen"===t.tool&&Array.isArray(t.points)&&t.points.length>=2}).slice(-6),n=1/0,a=1/0,r=-1/0,o=-1/0;for(let e=0;e<t.length;e++){let i=N(t[e]);i&&(n=Math.min(n,i.xMin),a=Math.min(a,i.yMin),r=Math.max(r,i.xMax),o=Math.max(o,i.yMax))}if(isFinite(n)&&isFinite(a)&&isFinite(r)&&isFinite(o)&&i.STATE.cssW>0&&i.STATE.cssH>0){let t=(0,i.clamp)(Math.round(r+14),12,Math.max(12,i.STATE.cssW-280-12)),n=(0,i.clamp)(Math.round(a-8),12,Math.max(12,i.STATE.cssH-110-12));(0,l.setStyle)(e,"left",t+"px"),(0,l.setStyle)(e,"top",n+"px"),(0,l.setStyle)(e,"bottom","auto")}else(0,l.setStyle)(e,"left","14px"),(0,l.setStyle)(e,"bottom","14px"),(0,l.setStyle)(e,"top","auto")}(0,l.setAttribute)(e,"data-on",u?"1":"0")}}function z(){return i.STATE.shell?i.STATE.shell.querySelector(".lia-annot-dgs-crosshair"):null}function P(t){let e=z();e&&(0,l.setAttribute)(e,"data-on",t?"1":"0")}function q(t){(p=!!t)||P(!1),tp()}function L(){!(0,i.isReadOnly)()&&i.STORE.ui.visible&&(tu(),C(!1),q(!0))}function N(t){if(!t||"path"!==t.kind||"pen"!==t.tool||!Array.isArray(t.points)||t.points.length<2)return null;let e=function(t){let e=[];if(!t||!Array.isArray(t.points))return e;let n=null;for(let a=0;a<t.points.length;a++){let r=(0,i.fromRel)(t.points[a]);isFinite(r.x)&&isFinite(r.y)&&(!n||Math.hypot(r.x-n.x,r.y-n.y)>=1.5)&&(e.push({x:r.x,y:r.y}),n={x:r.x,y:r.y})}return e}(t);if(e.length<2)return null;let n=1/0,a=-1/0,r=1/0,o=-1/0,l=0,s=e[0];n=Math.min(n,s.x),a=Math.max(a,s.x),r=Math.min(r,s.y),o=Math.max(o,s.y);for(let t=1;t<e.length;t++){let i=e[t];l+=Math.hypot(i.x-s.x,i.y-s.y),s=i,n=Math.min(n,i.x),a=Math.max(a,i.x),r=Math.min(r,i.y),o=Math.max(o,i.y)}if(!isFinite(n)||!isFinite(r)||!isFinite(a)||!isFinite(o))return null;let c=e[0],d=e[e.length-1],u=d.x-c.x,p=d.y-c.y,f=Math.hypot(u,p);if(f<1)return null;let h=u/f,g=p/f,m=0;for(let t=0;t<e.length;t++)m+=Math.abs((e[t].x-c.x)*g-(e[t].y-c.y)*h);let b=m/Math.max(1,e.length),y=f/Math.max(1,l),x=0,T=0;for(let t=1;t<e.length-1;t++){let n=e[t].x-e[t-1].x,a=e[t].y-e[t-1].y,r=e[t+1].x-e[t].x,o=e[t+1].y-e[t].y,l=Math.hypot(n,a),s=Math.hypot(r,o);if(l<1.2||s<1.2||180*Math.acos((0,i.clamp)((n*r+a*o)/(l*s),-1,1))/Math.PI<18)continue;let c=t/(e.length-1);c<.35?x++:c>.65&&T++}let S=0,v=0,E=0;for(let t=0;t<e.length;t++){let n=((e[t].x-c.x)*h+(e[t].y-c.y)*g)/Math.max(1e-6,f);if(t>0){let a=n-E,r=t/Math.max(1,e.length-1);r>.6&&a<0&&(S+=-a),r<.4&&a>0&&(v+=a)}E=n}let w=Math.max(1,a-n),A=Math.max(1,o-r),M=f>=24&&l>=28&&y>=.4&&l/Math.max(1,f)<=3.3&&b<=Math.max(12,.24*f),R=x>=1||T>=1,O=S>=.03||v>=.03,k=M&&f>=28&&l>=32&&y>=.43&&(R||O);return{xMin:n,xMax:a,yMin:r,yMax:o,w,h:A,cx:(n+a)*.5,cy:(r+o)*.5,pathLen:l,startX:c.x,startY:c.y,endX:d.x,endY:d.y,dirX:h,dirY:g,endToEnd:f,straightness:y,avgPerp:b,bendNearStart:x,bendNearEnd:T,endBacktrack:S,startBacktrack:v,isArrowLike:k,isLineLike:M,isHorizontal:w>=20&&w>=1.15*A,isVertical:A>=20&&A>=1.15*w}}function I(t,e,n,a,r,o){let l=r-n,s=o-a,c=l*l+s*s;if(c<=1e-6)return Math.hypot(t-n,e-a);let d=(0,i.clamp)(((t-n)*l+(e-a)*s)/c,0,1);return Math.hypot(t-(n+d*l),e-(a+d*s))}function F(t,e,n,a,r,i,o){return t>=Math.min(n,r)-o&&t<=Math.max(n,r)+o&&e>=Math.min(a,i)-o&&e<=Math.max(a,i)+o}function W(t,e){let n="right"===e?t.endX>=t.startX:t.endY<=t.startY,a=n?t.endX:t.startX,r=n?t.endY:t.startY,i=n?t.startX:t.endX,o=n?t.startY:t.endY,l=Math.max(1e-6,Math.hypot(i-a,o-r));return{tipX:a,tipY:r,inwardX:(i-a)/l,inwardY:(o-r)/l,tipIsEnd:n}}function B(t,e){return!!t.isArrowLike&&(e?t.bendNearEnd>=2||t.endBacktrack>=.06:t.bendNearStart>=2||t.startBacktrack>=.06)}function j(t,e,n,a,r,i,o){for(let l=0;l<t.length;l++){let s=t[l];if(!(s===e||s===n||s.endToEnd<4||s.endToEnd>80||Math.min(Math.hypot(s.startX-a,s.startY-r),Math.hypot(s.endX-a,s.endY-r))>58)){if(!(((s.startX+s.endX)*.5-a)*i+((s.startY+s.endY)*.5-r)*o<-6))return l}}return -1}function D(){let t=[];t.push(window);try{if(window.parent&&window.parent!==window){let e=window.parent;t.includes(e)||t.push(e)}}catch(t){}try{if(window.top&&window.top!==window){let e=window.top;t.includes(e)||t.push(e)}}catch(t){}return t}function H(t,e,n){let a=D();for(let r=0;r<a.length;r++){let i=a[r].__setupDGS;if("function"==typeof i)try{i(t,e,n);return}catch(t){}}}function X(t){t.innerHTML='<svg class="lia-annot-dgs-fallback" viewBox="0 0 240 180" preserveAspectRatio="none" aria-hidden="true"><line x1="24" y1="90" x2="226" y2="90" class="axis"/><line x1="120" y1="160" x2="120" y2="14" class="axis"/><polygon points="226,90 214,84 214,96" class="arrow"/><polygon points="120,14 114,26 126,26" class="arrow"/></svg>'}let Y=null,K="",V=[],$=new WeakMap;function Q(t){let e=t.querySelector(".lia-annot-dgs-board");if(!e)return;let n=String(e.id||"lia-annot-dgs-board-"+String(t.dataset.id||""));(e.__liaAnnotSetupTimers||[]).forEach(function(t){window.clearTimeout(t)}),e.__liaAnnotSetupTimers=[];let a=D(),r=e.__liaAnnotBoard;for(let t=0;t<a.length;t++){let e=a[t].__boards;if(!r&&e&&(r=e[n]),!r)continue;let i=a[t].__disposeDGSForBoard,o=a[t].__disposeRegressionForBoard;try{"function"==typeof i&&i(n)}catch(t){}try{"function"==typeof o&&o(n)}catch(t){}}if(r&&"object"==typeof r){let t=r;try{"function"==typeof t.__coordCleanup?t.__coordCleanup():"function"==typeof t.__coordViewportCleanup&&t.__coordViewportCleanup()}catch(t){}for(let t=0;t<a.length;t++){let e=a[t].JXG,n=e&&e.JSXGraph;if(n&&"function"==typeof n.freeBoard){try{n.freeBoard(r)}catch(t){}break}}}for(let t=0;t<a.length;t++){let e=a[t],i=e.__boards;try{i&&(!r||i[n]===r)&&delete i[n]}catch(t){}let o=["__points","__pointStates","__pointGraphs","__pointGraphStates"];for(let t=0;t<o.length;t++){let a=e[o[t]];try{a&&delete a[n]}catch(t){}}}e.__liaAnnotBoard=void 0}function U(){if(!i.STATE.host)return;let t=i.STORE.ui.visible&&!(0,i.isReadOnly)();i.STATE.host.querySelectorAll(".lia-annot-dgs-remove").forEach(function(e){e.disabled===t&&(e.disabled=!t),(0,l.setStyle)(e,"display",t?"inline-flex":"none")})}function J(){if(!i.STATE.host)return;let t=i.STATE.host,e=k().slice().sort(function(t,e){return t.y-e.y}),n=JSON.stringify([i.STATE.slideKey,e]);if(Y===t&&K===n&&V.every(e=>e.parentElement===t))return void U();Y&&Y!==t&&V.forEach(function(t){t.isConnected&&(Q(t),t.remove())});let a=[];function r(t){return!!(t&&t instanceof HTMLElement&&t.classList.contains("lia-annot-dgs-widget"))}let s={};for(let n=0;n<e.length;n++){let c=e[n];s[c.id]=!0;let d=String(c.spec||"lia-annot-dgs-board-"+c.id),u="de"===c.language?"de":"en";c.spec||(c.spec=d),c.language||(c.language=u);let p=t.querySelector('.lia-annot-dgs-widget[data-id="'+c.id+'"]');p||((p=document.createElement("div")).className="lia-annot-dgs-widget",(0,l.setAttribute)(p,"data-id",c.id),p.innerHTML='<span class="lia-annot-dgs-spec" style="display:none;"></span><div class="lia-annot-dgs-frame"><div class="lia-annot-dgs-board"></div></div>'),(0,l.setStyle)(p,"position","relative"),(0,l.setStyle)(p,"left",""),(0,l.setStyle)(p,"top",""),(0,l.setStyle)(p,"width","100%"),(0,l.setStyle)(p,"height","auto"),(0,l.setStyle)(p,"margin","18px 0"),(0,l.setStyle)(p,"display","block"),(0,l.setStyle)(p,"clear","both"),(0,l.setAttribute)(p,"data-spec",d),(0,l.setAttribute)(p,"data-language",u);let f=p.querySelector(".lia-annot-dgs-spec");if(f&&((0,l.setAttribute)(f,"id","dgs-ui-"+c.id),(0,l.setAttribute)(f,"data-spec",d),(0,l.setAttribute)(f,"data-language",u)),!function(t){let e=t.querySelector(".lia-annot-dgs-board");if(!e)return;let n=t.querySelector(".lia-annot-dgs-frame");n||((n=document.createElement("div")).className="lia-annot-dgs-frame",e.parentNode.insertBefore(n,e),n.appendChild(e));let a=n.querySelector(".lia-annot-dgs-remove");a||((a=document.createElement("button")).type="button",a.className="lia-annot-dgs-remove",a.setAttribute("data-snapshot-admin","1"),(0,l.setText)(a,"×"),a.addEventListener("pointerdown",function(t){t.stopPropagation()},!0),a.addEventListener("click",function(t){t.preventDefault(),t.stopPropagation();let e=a.closest(".lia-annot-dgs-widget");!function(t){if(!t||(0,i.isReadOnly)())return;let e=k(),n=e.findIndex(function(e){return e.id===t});n<0||(e.splice(n,1),J(),tv(!0))}(String(e&&e.dataset.id||""))},!0),n.appendChild(a));let r=(0,o.tUi)("dgsRemove");(0,l.setAttribute)(a,"aria-label",r),(0,l.setAttribute)(a,"title",r)}(p),p.parentNode!==t||$.get(p)!==c.y){let e=function(e){let n=Array.from(t.children).filter(function(t){return!(i.STATE.shell&&t&&t===i.STATE.shell||r(t))}),a=null,o=-1/0,l=t.getBoundingClientRect().top;for(let t=0;t<n.length;t++){let r=n[t],i=r.getBoundingClientRect();if(i.width<24||i.height<12)continue;let s=i.top-l;i.bottom-l<=e+2&&s>=o&&(a=r,o=s)}return a}(c.y);if(e){let n=e.nextSibling;for(;n instanceof HTMLElement&&r(n)&&n!==p&&($.get(n)??1/0)<=c.y;)n=n.nextSibling;n!==p&&t.insertBefore(p,n)}else{let e=i.STATE.shell?i.STATE.shell.nextSibling:t.firstChild;e!==p&&t.insertBefore(p,e)}$.set(p,c.y)}a.push(p),function(t){let e=t.querySelector(".lia-annot-dgs-board");if(!e||"1"===e.dataset.init)return;let n=function(){let t=D();for(let e=0;e<t.length;e++){let n=t[e].__coord;if(n&&"function"==typeof n.parseCoordSpec&&"function"==typeof n.prepareBoardContainer&&"function"==typeof n.createBoardDecorations&&"function"==typeof n.wireBoard&&"function"==typeof n.getNeutralColor&&"function"==typeof n.getAccentColor&&"function"==typeof n.loadStoredBoardState)return n}return null}(),a=function(){let t=D();for(let e=0;e<t.length;e++){let n=t[e].JXG,a=n&&n.JSXGraph;if(n&&a&&"function"==typeof a.initBoard)return n}return null}(),r=String(t.dataset.id||Math.floor(1e9*Math.random())),i="lia-annot-dgs-board-"+r,o=_(),s=String(t.dataset.spec||i||""),c=t.querySelector(".lia-annot-dgs-spec");if(c||((c=document.createElement("span")).className="lia-annot-dgs-spec",(0,l.setStyle)(c,"display","none"),t.insertBefore(c,t.firstChild)),c.id="dgs-ui-"+r,(0,l.setAttribute)(c,"data-spec",s),(0,l.setAttribute)(c,"data-language",o),!a||!n){X(e),(0,l.setAttribute)(e,"data-init","1");return}let d=a.JSXGraph;e.id=i;try{let t=Math.max(160,Math.round(e.clientWidth||240)),a=n.parseCoordSpec("xmin=-7;xmax=7;ymin=-5;ymax=5;id="+i+";width="+t+";1;1;1"),l=[a.xmin,a.ymax,a.xmax,a.ymin],c=(a.ymax-a.ymin)/Math.max(1e-4,a.xmax-a.xmin),u=n.loadStoredBoardState(a.id);n.prepareBoardContainer(e,a.width,c,u);let p=d.initBoard(i,{axis:!1,grid:!1,showNavigation:!1,showCopyright:!1,boundingbox:u?u.bbox.slice():l.slice(),keepaspectratio:!0,zoom:{enabled:a.border,wheel:a.border,needShift:!1,factorX:1.15,factorY:1.15},pan:{enabled:a.border,needShift:!1,needTwoFingers:!1},resize:{enabled:!1}});n.createBoardDecorations(p,a,n.getNeutralColor(),n.getAccentColor()),n.wireBoard(p,a,l,c);try{let t=window;t.__boards=t.__boards||{},t.__boards[i]=p}catch(t){}e.__liaAnnotBoard=p,H(r,s,o);let f=[window.setTimeout(function(){e.isConnected&&H(r,s,o)},0),window.setTimeout(function(){e.isConnected&&H(r,s,o)},120)];e.__liaAnnotSetupTimers=f}catch(t){X(e)}(0,l.setAttribute)(e,"data-init","1")}(p)}let c=Array.from(t.querySelectorAll(".lia-annot-dgs-widget"));for(let t=0;t<c.length;t++)s[String(c[t].dataset.id||"")]||(Q(c[t]),c[t].remove());Y=t,K=JSON.stringify([i.STATE.slideKey,e]),V=a,U()}function G(t){return!!t&&(!!t.matches("input, textarea")||"true"===t.getAttribute("contenteditable")||"textbox"===t.getAttribute("role"))}let Z=null,tt=null;function te(){y=!1,document.documentElement.classList.contains("lia-annot-quiz-picking")&&document.documentElement.classList.remove("lia-annot-quiz-picking"),tp(),Z&&(document.removeEventListener("click",Z,!0),Z=null),tt&&(document.removeEventListener("keydown",tt,!0),tt=null),tn()}function tn(){if(!i.STATE.shell)return;let t=i.STATE.shell.querySelector(".lia-annot-rect-submit"),e=i.STATE.shell.querySelector(".lia-annot-rect-clear"),n=i.STATE.shell.querySelector(".lia-annot-rect-choosequiz"),a=i.STATE.shell.querySelector(".lia-annot-rect-progress");if(!t||!e||!a)return;let r=s;if(!(r&&i.STORE.ui.visible&&!(0,i.isReadOnly)()&&"rect"===(0,i.effectiveMode)())){(0,l.setStyle)(t,"display","none"),(0,l.setStyle)(e,"display","none"),(0,l.setStyle)(a,"display","none"),n&&(0,l.setStyle)(n,"display","none");return}(0,l.setStyle)(t,"display","block"),(0,l.setStyle)(e,"display","block"),(0,l.setStyle)(a,"display","");let c=Math.min(r.x0,r.x1),d=Math.min(r.y0,r.y1),u=Math.max(1,Math.abs(r.x1-r.x0)),p=Math.max(1,Math.abs(r.y1-r.y0)),f=Math.max(110,t.offsetWidth||140),h=Math.max(28,t.offsetHeight||32),g=Math.max(20,e.offsetWidth||22),m=(0,i.clamp)(c+u-f,8,Math.max(8,i.STATE.cssW-f-8)),x=(0,i.clamp)(d+p+8,8,Math.max(8,i.STATE.cssH-h-8));(0,l.setStyle)(t,"left",m+"px"),(0,l.setStyle)(t,"top",x+"px");let T=Math.max(24,a.offsetHeight||26);(0,l.setStyle)(a,"width",f+"px"),(0,l.setStyle)(a,"left",m+"px"),(0,l.setStyle)(a,"top",(0,i.clamp)(x-T-6,8,Math.max(8,i.STATE.cssH-T-8))+"px");let S=(0,i.clamp)(c+u-.5*g,8,Math.max(8,i.STATE.cssW-g-8)),v=(0,i.clamp)(d-.5*g,8,Math.max(8,i.STATE.cssH-g-8));if((0,l.setStyle)(e,"left",S+"px"),(0,l.setStyle)(e,"top",v+"px"),n){let t=Math.max(28,n.offsetHeight||32);if((0,l.setStyle)(n,"display","block"),(0,l.setStyle)(n,"width",f+"px"),(0,l.setStyle)(n,"left",m+"px"),(0,l.setStyle)(n,"top",(0,i.clamp)(x+h+4,8,Math.max(8,i.STATE.cssH-t-8))+"px"),y)(0,l.setText)(n,"✕ "+(0,o.tUi)("rectChooseCancel")),(0,l.setAttribute)(n,"data-state","picking");else if(b){let t=b.placeholder||b.name||(0,o.tUi)("rectChosenFallback");(0,l.setText)(n,"✓ "+t),(0,l.setAttribute)(n,"data-state","chosen")}else(0,l.setText)(n,(0,o.tUi)("rectChooseQuiz")),(0,l.setAttribute)(n,"data-state","")}}function ta(t){if(!t)return null;let e=t.children||[];for(let t=0;t<e.length;t++){let n=e[t];if(n&&n.tagName&&"header"===n.tagName.toLowerCase())return n}return null}function tr(t,e){if(!t)return null;let n=t.children||[];for(let t=0;t<n.length;t++){let a=n[t];if(a.classList&&a.classList.contains(e))return a}return null}function ti(t){if(!t||t.hasAttribute("hidden"))return!1;let e=getComputedStyle(t);if("none"===e.display||"hidden"===e.visibility)return!1;let n=t.getBoundingClientRect();return n.width>0&&n.height>0}function to(){let t=Array.from(document.querySelectorAll("main"));for(let e=0;e<t.length;e++)if(ti(t[e]))return t[e];return t[0]||document.querySelector("main")||document.body||document.documentElement}function tl(){try{i.STATE.resizeObserver&&i.STATE.resizeObserver.disconnect()}catch(t){}i.STATE.resizeObserver=null}function ts(){if(tl(),i.STATE.host)try{i.STATE.resizeObserver=new ResizeObserver(function(){tv(!0)}),i.STATE.resizeObserver.observe(i.STATE.host)}catch(t){}}function tc(t,e){let n=ta(t);if(n){n.nextSibling!==e&&(e.parentNode===t&&e.remove(),n.nextSibling?t.insertBefore(e,n.nextSibling):t.appendChild(e));return}t.firstChild!==e&&(e.parentNode===t&&e.remove(),t.firstChild?t.insertBefore(e,t.firstChild):t.appendChild(e))}function td(){function t(t){let e,n=(e=i.STATE.canvas.getBoundingClientRect(),{x:(0,i.clamp)(t.clientX-e.left,0,i.STATE.cssW),y:(0,i.clamp)(t.clientY-e.top,0,i.STATE.cssH)});return i.STATE.lastPointer={x:n.x,y:n.y,inside:!0,pointerType:String(t.pointerType||"")},n}function e(e,n){let a=i.STATE.activePath;if(i.STATE.drawing){e.preventDefault(),e.stopPropagation();try{i.STATE.canvas.releasePointerCapture(e.pointerId)}catch(t){}i.STATE.drawing=!1,i.STATE.activePath=null,(0,o.updateToolbar)()}if(n&&"mouse"===e.pointerType&&i.STORE.ui.visible&&!(0,i.isReadOnly)()&&"eraser"===(0,i.effectiveMode)()){let n=t(e);(0,o.updateEraserRing)(n.x,n.y)}else i.STATE.lastPointer.inside=!1,(0,o.hideEraserRing)();a&&"pen"===a.tool&&((0,i.isReadOnly)()||!i.STORE.ui.visible||u||p||!d||!d.shouldPromptDgsInsert||!d.shouldPromptDgsInsert()||Date.now()<f||Date.now()-h<120||((0,i.ensureSlide)((0,i.getSlideKey)()),function(){let t=(0,i.ensureSlide)((0,i.getSlideKey)()).items.filter(function(t){return t&&"path"===t.kind&&"pen"===t.tool}).slice(-140).map(function(t){return N(t)}).filter(t=>null!==t);if(t.length<2)return!1;let e=t.slice(-26);if(e.length<2)return!1;let n=function(t){if(!t.length)return[];let e=[t[t.length-1]];for(let n=t.length-2;n>=0;n--){let a=t[n],r=!1;for(let t=0;t<e.length;t++)if(function(t,e){var n,a,r,i,o,l,s,c;return!!(220>=Math.hypot(t.cx-e.cx,t.cy-e.cy))||120>=(n=t.startX,a=t.startY,r=t.endX,i=t.endY,o=e.startX,l=e.startY,Math.min(I(n,a,o,l,s=e.endX,c=e.endY),I(r,i,o,l,s,c),I(o,l,n,a,r,i),I(s,c,n,a,r,i)))}(a,e[t])){r=!0;break}if(!r||(e.unshift(a),e.length>=10))break}return e}(e);if(n.length<2)return!1;let a=n.map(function(t){return[Math.round(t.cx),Math.round(t.cy),Math.round(t.endToEnd),Math.round(t.w),Math.round(t.h)].join(":")}).join("|");if(a&&a===g)return!1;let r=n.map(function(t,e){return{g:t,index:e}}).filter(function(t){let e=t.g;return e.isLineLike&&e.endToEnd>=28&&e.straightness>=.34&&Math.abs(e.dirX)>=.72&&.55>=Math.abs(e.dirY)&&e.w>=1.4*e.h}).sort(function(t,e){return e.index-t.index}),o=n.map(function(t,e){return{g:t,index:e}}).filter(function(t){let e=t.g;return e.isLineLike&&e.endToEnd>=28&&e.straightness>=.34&&Math.abs(e.dirY)>=.72&&.55>=Math.abs(e.dirX)&&e.h>=1.4*e.w}).sort(function(t,e){return e.index-t.index});if(!r.length||!o.length)return!1;let l=Math.min(3,r.length),s=Math.min(3,o.length);for(let t=0;t<l;t++)for(let e=0;e<s;e++){let i=r[t],l=o[e],s=i.g,c=l.g;if(Math.abs(i.index-l.index)>4||Math.max(i.index,l.index)<n.length-4||Math.abs(s.dirX*c.dirX+s.dirY*c.dirY)>.78)continue;let d=function(t,e,n,a,r,i,o,l){let s=(t-n)*(i-l)-(e-a)*(r-o);if(1e-6>Math.abs(s))return null;let c=t*a-e*n,d=r*l-i*o;return{x:(c*(r-o)-(t-n)*d)/s,y:(c*(i-l)-(e-a)*d)/s}}(s.startX,s.startY,s.endX,s.endY,c.startX,c.startY,c.endX,c.endY);if(!d)continue;let u=Math.max(16,Math.min(90,.22*s.endToEnd)),p=Math.max(16,Math.min(90,.22*c.endToEnd));if(!F(d.x,d.y,s.startX,s.startY,s.endX,s.endY,u)||!F(d.x,d.y,c.startX,c.startY,c.endX,c.endY,p))continue;let f=Math.hypot(d.x-s.cx,d.y-s.cy),h=Math.hypot(d.x-c.cx,d.y-c.cy);if(f>Math.max(90,.38*s.endToEnd)||h>Math.max(90,.38*c.endToEnd))continue;let m=W(s,"right"),b=W(c,"up"),y=B(s,m.tipIsEnd),x=j(n,s,c,m.tipX,m.tipY,m.inwardX,m.inwardY);if(!(y||x>=0))continue;let T=B(c,b.tipIsEnd),S=j(n,s,c,b.tipX,b.tipY,b.inwardX,b.inwardY);if((T||S>=0)&&(!(x>=0)||!(S>=0)||x!==S))return g=a,!0}return!1}()&&(h=Date.now(),C(!0))))}function n(e){var n,a,r,l;if("mouse"===e.pointerType&&0!==e.button)return;let s=t(e);if(p){let t,r,l,c;e.preventDefault(),e.stopPropagation(),n=s.x,a=s.y,t=k(),r=Math.round(n),l=Math.round(a),c=String(Date.now())+"-"+String(m++),t.push({id:c,x:r,y:l,w:240,h:180,spec:"lia-annot-dgs-board-"+c,language:_()}),J(),tv(),q(!1),i.STORE.ui.mode="cursor",i.STORE.ui.panelOpen=!1,C(!1),h=0,f=0,(0,o.updateToolbar)(),tp();return}if(!i.STORE.ui.visible||(0,i.isReadOnly)())return void(0,o.hideEraserRing)();let d=(0,i.effectiveMode)();if("eraser"===d?(0,o.updateEraserRing)(s.x,s.y):(0,o.hideEraserRing)(),"rect"===d){e.preventDefault(),e.stopPropagation(),c={x0:r=s.x,y0:l=s.y,x1:r,y1:l};try{i.STATE.canvas.setPointerCapture(e.pointerId)}catch(t){}tO();return}if("pen"!==d&&"eraser"!==d)return;e.preventDefault(),e.stopPropagation(),i.STORE.ui.panelOpen&&(i.STORE.ui.panelOpen=!1,(0,o.updateToolbar)());let u=(0,i.ensureSlide)((0,i.getSlideKey)()),g={kind:"path",tool:d,color:String(i.STORE.ui.color||"#ff0000"),width:"eraser"===d?Number(i.STORE.ui.eraserWidth||18):Number(i.STORE.ui.width||3),alpha:"eraser"===d?1:Number(i.STORE.ui.alpha||1),baseW:Math.max(1,i.STATE.cssW),points:[(0,i.toRel)(s.x,s.y)]};u.items.push(g),u.redo=[],i.STATE.activePath=g,i.STATE.drawing=!0;try{i.STATE.canvas.setPointerCapture(e.pointerId)}catch(t){}tO(),(0,o.updateToolbar)()}i.STATE.canvas&&!i.STATE.canvas.__liaAnnotBound&&(i.STATE.canvas.__liaAnnotBound=!0,i.STATE.canvas.addEventListener("pointerdown",n,!0),x||(x=!0,window.addEventListener("pointerdown",function(t){if(!i.STATE.canvas||!i.STATE.shell||!i.STATE.host||!i.STORE.ui.visible||(0,i.isReadOnly)()||y||p||"mouse"===t.pointerType&&0!==t.button)return;let e=(0,i.effectiveMode)();if("pen"!==e&&"rect"!==e)return;let a=t.target;if(a===i.STATE.canvas||a?.closest(".lia-annot-shell, .lia-annot-toolbar, .lia-annot-panel")||!a)return;let r=i.STATE.canvas.getBoundingClientRect();if(t.clientX<r.left||t.clientX>r.right||t.clientY<r.top||t.clientY>r.bottom)return;let o=function(t){let e="function"==typeof t.composedPath?t.composedPath():[];for(let t=0;t<e.length;t++){let n=e[t];if(n instanceof HTMLCanvasElement&&n.matches("canvas.lia-draw[data-ready]"))return n}let n=t.target instanceof Element?t.target:null,a=n?.closest(".lia-draw-wrap, .lia-draw-block"),r=a?.querySelector("canvas.lia-draw[data-ready]");if(r)return r;let i=[];try{i=document.elementsFromPoint(t.clientX,t.clientY)}catch(t){}for(let t=0;t<i.length;t++){let e=i[t];if(e instanceof HTMLCanvasElement&&e.matches("canvas.lia-draw[data-ready]"))return e}return null}(t);if(o&&i.STATE.host.contains(o)&&function(t,e){let n=t.closest(".lia-draw-wrap");if(!n)return!1;let a=n.querySelector("pen"===e?".lia-color-btn":".lia-rect-btn");if(!a)return!1;if("1"===a.getAttribute("data-active"))return!0;if(a.disabled)return!1;a.click();let r=n.querySelector(".lia-tool-menu");if(r?.getAttribute("data-open")==="1"){let t=r.querySelector("button[data-act=close]");t&&t.click()}return"1"===a.getAttribute("data-active")}(o,e)){"rect"===e&&(s||c)&&O();return}n(t),t.stopImmediatePropagation()},!0)),i.STATE.canvas.addEventListener("pointermove",function(e){var n,a,r,s;let d=t(e);if(p){let t;e.preventDefault(),e.stopPropagation(),n=d.x,a=d.y,(t=z())&&i.STATE.shell&&p&&isFinite(n)&&isFinite(a)&&((0,l.setStyle)(t,"left",(0,i.clamp)(n,0,Math.max(0,i.STATE.cssW))+"px"),(0,l.setStyle)(t,"top",(0,i.clamp)(a,0,Math.max(0,i.STATE.cssH))+"px"),P(!0));return}if(!(0,i.isReadOnly)()&&i.STORE.ui.visible&&"eraser"===(0,i.effectiveMode)()?(0,o.updateEraserRing)(d.x,d.y):(0,o.hideEraserRing)(),c){e.preventDefault(),e.stopPropagation(),r=d.x,s=d.y,c&&(c.x1=r,c.y1=s),tO();return}i.STATE.drawing&&i.STATE.activePath&&(e.preventDefault(),e.stopPropagation(),function(t,e,n){if(!t||!Array.isArray(t.points))return!1;let a=(0,i.toRel)(e,n),r=t.points.length?t.points[t.points.length-1]:null;if(r&&.8>Math.hypot((a.x-r.x)*i.STATE.cssW,(a.y-r.y)*i.STATE.cssH))return!1;return t.points.push(a),!0}(i.STATE.activePath,d.x,d.y)&&tO())},!0),i.STATE.canvas.addEventListener("pointerup",function(t){if(c){t.preventDefault(),t.stopPropagation();try{i.STATE.canvas.releasePointerCapture(t.pointerId)}catch(t){}(function(){if(!c)return;let t=Math.abs(c.x1-c.x0),e=Math.abs(c.y1-c.y0);s=t>=6&&e>=6?{...c}:null,c=null})(),tO(),(0,o.updateToolbar)();return}e(t,!0)},!0),i.STATE.canvas.addEventListener("pointercancel",function(t){e(t,!1)},!0),i.STATE.canvas.addEventListener("pointerleave",function(){i.STATE.lastPointer.inside=!1,(0,o.hideEraserRing)(),p&&P(!1)},!0),i.STATE.canvas.addEventListener("contextmenu",function(t){t.preventDefault()},!0))}function tu(){let t=to(),e=(0,i.getSlideKey)(),n=i.STATE.host!==t,a=i.STATE.slideKey!==e;if(i.STATE.shell&&i.STATE.shell.isConnected&&!n)tc(t,i.STATE.shell),i.STATE.canvas=i.STATE.shell.querySelector(".lia-annot-canvas"),i.STATE.eraserRing=i.STATE.shell.querySelector(".lia-annot-eraser-ring");else{tl(),i.STATE.host=t,i.STATE.slideKey=e,t.classList.contains("lia-annot-host")||t.classList.add("lia-annot-host");let n=tr(t,"lia-annot-shell");n||((n=document.createElement("div")).className="lia-annot-shell",n.setAttribute("aria-hidden","true"));let a=n.querySelector(".lia-annot-canvas");a||((a=document.createElement("canvas")).className="lia-annot-canvas",a.setAttribute("aria-label","Annotation canvas"),n.appendChild(a));let r=n.querySelector(".lia-annot-eraser-ring");r||((r=document.createElement("span")).className="lia-annot-eraser-ring",(0,l.setAttribute)(r,"data-on","0"),n.appendChild(r));let c=n.querySelector(".lia-annot-dgs-layer");c||((c=document.createElement("div")).className="lia-annot-dgs-layer",n.appendChild(c));let m=n.querySelector(".lia-annot-dgs-crosshair");m||((m=document.createElement("div")).className="lia-annot-dgs-crosshair",(0,l.setAttribute)(m,"data-on","0"),n.appendChild(m));let x=n.querySelector(".lia-annot-dgs-prompt");x||((x=document.createElement("div")).className="lia-annot-dgs-prompt",(0,l.setAttribute)(x,"data-on","0"),x.innerHTML='<div class="lia-annot-dgs-prompt-title">Coordinate system sketch detected</div><div class="lia-annot-dgs-prompt-sub">Create a DGS coordinate system?</div><div class="lia-annot-dgs-prompt-actions">  <button type="button" class="lia-annot-dgs-yes">Yes</button>  <button type="button" class="lia-annot-dgs-no">No</button></div>',n.appendChild(x),x.addEventListener("pointerdown",function(t){t.preventDefault(),t.stopPropagation()},!0),x.addEventListener("click",function(t){let e=t.target;if(e&&e instanceof Element){if(e.closest(".lia-annot-dgs-yes")){t.preventDefault(),t.stopPropagation(),C(!1),q(!0);return}e.closest(".lia-annot-dgs-no")&&(t.preventDefault(),t.stopPropagation(),C(!1),h=0,f=Date.now()+40,g="")}},!0));let T=n.querySelector(".lia-annot-rect-submit");T||((T=document.createElement("button")).type="button",T.className="lia-annot-rect-submit",(0,l.setText)(T,(0,o.tUi)("rectSubmit")),(0,l.setStyle)(T,"display","none"),n.appendChild(T),T.addEventListener("pointerdown",function(t){t.preventDefault(),t.stopPropagation()},!0),T.addEventListener("click",function(t){if(t.preventDefault(),t.stopPropagation(),d&&s&&!i.STORE.ui.ocrBusy){let t;v&&(cancelAnimationFrame(v),v=0),function(){if(!i.STATE.shell)return;let t=i.STATE.shell.querySelector(".lia-annot-rect-progress");t&&((0,l.setAttribute)(t,"data-on","1"),w(0),tn())}(),E=performance.now(),t=function(){let e=performance.now()-E;w(e<900?e/900*.7:e<2200?.7+(e-900)/1300*.2:.9+Math.min(.08,(e-2200)/5e3*.08)),v=requestAnimationFrame(t)},v=requestAnimationFrame(t),d.submitMarkedRect().then(function(){(0,o.updateToolbar)(),A(1),tn()}).catch(function(){A(1),tn()})}},!0));let S=n.querySelector(".lia-annot-rect-progress");S||((S=document.createElement("div")).className="lia-annot-rect-progress",(0,l.setAttribute)(S,"data-on","0"),S.innerHTML='<div class="lia-annot-rect-progbar"><div class="lia-annot-rect-progfill"></div></div><div class="lia-annot-rect-progtxt">0%</div>',n.appendChild(S),S.addEventListener("pointerdown",function(t){t.preventDefault(),t.stopPropagation()},!0));let M=n.querySelector(".lia-annot-rect-clear");M||((M=document.createElement("button")).type="button",M.className="lia-annot-rect-clear",M.setAttribute("aria-label",(0,o.tUi)("rectClearAria")),(0,l.setText)(M,"×"),(0,l.setStyle)(M,"display","none"),n.appendChild(M),M.addEventListener("pointerdown",function(t){t.preventDefault(),t.stopPropagation()},!0),M.addEventListener("click",function(t){t.preventDefault(),t.stopPropagation(),O()},!0));let R=n.querySelector(".lia-annot-rect-choosequiz");R||((R=document.createElement("button")).type="button",R.className="lia-annot-rect-choosequiz",(0,l.setText)(R,(0,o.tUi)("rectChooseQuiz")),(0,l.setStyle)(R,"display","none"),n.appendChild(R),R.addEventListener("pointerdown",function(t){t.preventDefault(),t.stopPropagation()},!0),R.addEventListener("click",function(t){t.preventDefault(),t.stopPropagation(),y?te():y||(y=!0,i.STATE.canvas&&(0,l.setStyle)(i.STATE.canvas,"pointer-events","none"),document.documentElement.classList.add("lia-annot-quiz-picking"),tn(),Z=function(t){let e=t.target;for(;e&&e!==document.documentElement&&!G(e);)e=e.parentElement;e&&G(e)&&!e.closest(".lia-annot-shell")?(t.preventDefault(),t.stopPropagation(),b=e,te()):e&&e.closest(".lia-annot-rect-choosequiz")||te()},tt=function(t){"Escape"===t.key&&te()},document.addEventListener("click",Z,!0),document.addEventListener("keydown",tt,!0))},!0)),tc(t,n),i.STATE.shell=n,i.STATE.canvas=a,i.STATE.eraserRing=r,i.STATE.ctx=i.STATE.canvas?i.STATE.canvas.getContext("2d",{willReadFrequently:!0}):null,td(),ts(),document.__liaAnnotDgsEscBound||(document.addEventListener("keydown",function(t){if("Escape"===t.key){if(p)return void q(!1);u&&C(!1)}},!0),document.__liaAnnotDgsEscBound=!0)}a&&(i.STATE.slideKey=e,h=0,C(!1),q(!1),g=""),J(),tp(),tn()}function tp(){let t=Array.from(document.querySelectorAll(".lia-annot-shell")),e=(0,i.effectiveMode)(),n=!!i.STORE.ui.visible;p&&(!n||(0,i.isReadOnly)())&&(p=!1);let a=p&&n&&!(0,i.isReadOnly)();for(let r of t){let t=r.querySelector(".lia-annot-canvas"),o=r===i.STATE.shell,s=o?a?"place":e:"cursor",c=o&&n&&!y&&"cursor"!==s,d=c&&("pen"===s||"rect"===s);(0,l.setAttribute)(r,"data-mode",s),(0,l.setAttribute)(r,"data-hidden",n?"0":"1"),(0,l.setStyle)(r,"pointer-events","none"),(0,l.setStyle)(r,"display",n?"":"none"),t&&((0,l.setStyle)(t,"pointer-events",c&&!d?"auto":"none"),(0,l.setStyle)(t,"touch-action",c&&!d?"none":"auto"),(0,l.setStyle)(t,"cursor",c?"crosshair":"default"));let u=r.parentElement;u&&(d?(0,l.setAttribute)(u,"data-lia-annot-capture","1"):u.hasAttribute("data-lia-annot-capture")&&u.removeAttribute("data-lia-annot-capture"))}if(U(),!n){(0,o.hideEraserRing)(),C(!1),P(!1);return}i.STATE.shell&&i.STATE.canvas?("eraser"!==e||a?(0,o.hideEraserRing)():(0,o.refreshEraserRing)(),a||P(!1),tn()):(0,o.hideEraserRing)()}let tf=null,th=0;function tg(t){if(!i.STATE.host)return 1;let e=i.STATE.host.querySelector(".lia-slide, section"),n=e?Math.max(e.getBoundingClientRect().height,e.scrollHeight):0,a=Math.max(t.height,i.STATE.host.scrollHeight),r=i.STATE.host.closest(".lia-slide__container"),o=0;if(r){let e=r.getBoundingClientRect(),n=t.top-e.top+r.scrollTop-r.clientTop;o=Math.max(0,r.scrollHeight-Math.max(0,n))}return Math.max(1,a,n,o)}function tm(t,e,n,a){n?t.setProperty(e,n,a):t.removeProperty(e)}function tb(t=!0){if(!i.STATE.host||!i.STATE.canvas||!i.STATE.ctx||!i.STATE.shell)return!1;let e=window.devicePixelRatio||1,n=i.STATE.host.getBoundingClientRect(),a=(0,i.getViewportWidth)();if(tf!==i.STATE.host&&(tf=i.STATE.host,th=0,t=!0),t||th<=0)th=function(){if(!i.STATE.host||!i.STATE.shell)return 1;let t=i.STATE.shell.style,e=t.getPropertyValue("height"),n=t.getPropertyPriority("height"),a=t.getPropertyValue("overflow"),r=t.getPropertyPriority("overflow");try{return t.setProperty("height","0px","important"),t.setProperty("overflow","hidden","important"),tg(i.STATE.host.getBoundingClientRect())}finally{tm(t,"height",e,n),tm(t,"overflow",a,r)}}();else{let t=tg(n);t>Math.max(th,i.STATE.cssH)+1&&(th=t)}let r=Math.max(1,Math.ceil(th||0)),s=Math.round(-n.left),c=i.STATE.cssW!==a||i.STATE.cssH!==r||i.STATE.dpr!==e;i.STATE.cssW=a,i.STATE.cssH=r,i.STATE.dpr=e,(0,l.setStyle)(i.STATE.shell,"left",s+"px"),(0,l.setStyle)(i.STATE.shell,"top","0px"),(0,l.setStyle)(i.STATE.shell,"width",a+"px"),(0,l.setStyle)(i.STATE.shell,"height",r+"px"),(0,l.setStyle)(i.STATE.canvas,"width",a+"px"),(0,l.setStyle)(i.STATE.canvas,"height",r+"px");let d=Math.max(1,Math.round(a*i.STATE.dpr)),u=Math.max(1,Math.round(r*i.STATE.dpr));return i.STATE.canvas.width!==d&&(i.STATE.canvas.width=d,c=!0),i.STATE.canvas.height!==u&&(i.STATE.canvas.height=u,c=!0),c&&((0,o.refreshEraserRing)(),tn()),c}let ty=!1,tx=!1,tT=!1;function tS(){i.STATE.syncRAF||(i.STATE.syncRAF=requestAnimationFrame(function(){i.STATE.syncRAF=0;let t=ty,e=tx,n=tT;ty=!1,tx=!1,tT=!1;let a=!1;t?(tu(),a=tb(n),(0,o.syncToolbarPosition)()):e&&J(),(e||a||!tM(tE,tA()))&&tR(a)}))}function tv(t=!1){ty=!0,t&&(tT=!0),tS()}let tE=[],tw=[];function tA(){return[i.STATE.canvas,i.STATE.slideKey,i.STATE.cssW,i.STATE.cssH,i.STATE.dpr,i.STORE.ui.visible]}function tM(t,e){return t.length===e.length&&t.every((t,n)=>t===e[n])}function tR(t=!1){if(!i.STATE.canvas||!i.STATE.ctx)return;let e=tA(),n=(0,i.ensureSlide)(i.STATE.slideKey||(0,i.getSlideKey)()),a=s||c?getComputedStyle(document.documentElement).getPropertyValue("--lia-annot-accent").trim()||"#3b82f6":"",r=[];if(i.STORE.ui.visible){for(let t of n.items){if(!t){r.push(t);continue}r.push(t,t.kind,t.tool,t.color,t.width,t.alpha,t.baseW,t.points,t.points&&t.points.length)}for(let t of[s,c])r.push(t?t.x0:null,t?t.y0:null,t?t.x1:null,t?t.y1:null);r.push(a)}if(!t&&tM(tE,e)&&tM(tw,r))return;tE=e,tw=r;let o=i.STATE.ctx;if(o.setTransform(i.STATE.dpr,0,0,i.STATE.dpr,0,0),o.clearRect(0,0,i.STATE.cssW,i.STATE.cssH),!i.STORE.ui.visible)return;for(let t=0;t<n.items.length;t++)!function(t,e){if(!e||"path"!==e.kind||!Array.isArray(e.points)||0===e.points.length)return;let n="eraser"===e.tool,a=(0,i.getLineWidthPx)(e),r=(0,i.clamp)(Number(e.alpha||1),.05,1),o=String(e.color||"#000");if(1===e.points.length){var l,s,c;let d=(0,i.fromRel)(e.points[0]);l=d.x,s=d.y,c=a/2,t.save(),t.globalCompositeOperation=n?"destination-out":"source-over",t.globalAlpha=n?1:(0,i.clamp)(Number(r||1),.05,1),t.beginPath(),t.arc(l,s,Math.max(.5,c),0,2*Math.PI),t.fillStyle=n?"#000":String(o||"#000"),t.fill(),t.restore();return}t.save(),t.globalCompositeOperation=n?"destination-out":"source-over",t.globalAlpha=n?1:r,t.lineCap="round",t.lineJoin="round",t.lineWidth=a,t.strokeStyle=n?"#000":o,t.beginPath();let d=e.points.map(i.fromRel);if(t.moveTo(d[0].x,d[0].y),2===d.length)t.lineTo(d[1].x,d[1].y);else{t.lineTo((d[0].x+d[1].x)/2,(d[0].y+d[1].y)/2);for(let e=1;e<d.length-1;e++){let n=(d[e].x+d[e+1].x)/2,a=(d[e].y+d[e+1].y)/2;t.quadraticCurveTo(d[e].x,d[e].y,n,a)}t.lineTo(d[d.length-1].x,d[d.length-1].y)}t.stroke(),t.restore()}(o,n.items[t]);let l=function(t,e){let n=Math.min(t.x0,t.x1),r=Math.min(t.y0,t.y1),i=Math.max(1,Math.abs(t.x1-t.x0)),l=Math.max(1,Math.abs(t.y1-t.y0));o.save(),o.globalCompositeOperation="source-over",o.globalAlpha=e?.22:.16,o.fillStyle=a,o.fillRect(n,r,i,l),o.globalAlpha=.95,o.lineWidth=1.6,o.strokeStyle=a,o.strokeRect(n,r,i,l),o.restore()};s&&l(s,!0),c&&l(c,!1),tn()}function tO(){tx=!0,tS()}},{"./store":"cswaT","./ui":"7Wjmu","@parcel/transformer-js/src/esmodule-helpers.js":"k3151","./dom":"azxXB"}],bH1QJ:[function(t,e,n,a){var r=t("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"doUndo",()=>s),r.export(n,"doRedo",()=>c),r.export(n,"clearSlide",()=>d),r.export(n,"clearAllSlides",()=>u),r.export(n,"isOcrAvailable",()=>h),r.export(n,"shouldPromptDgsInsert",()=>g),r.export(n,"recognizeLatestAnnotationText",()=>_),r.export(n,"submitOcrTextToNearestQuiz",()=>C),r.export(n,"transferToNearestQuiz",()=>z),r.export(n,"roundFreezeNum",()=>P),r.export(n,"sanitizeFreezePoint",()=>q),r.export(n,"sanitizeFreezeItem",()=>L),r.export(n,"sanitizeFreezeSlides",()=>N),r.export(n,"hasFreezeData",()=>F),r.export(n,"exportState",()=>W),r.export(n,"exportFreezeState",()=>B),r.export(n,"importState",()=>j),r.export(n,"importFreezeState",()=>D),r.export(n,"setVisible",()=>H),r.export(n,"setReadOnly",()=>X),r.export(n,"registerGlobalApi",()=>Y);var i=t("./store"),o=t("./overlay"),l=t("./ui");function s(){let t=(0,i.currentSlide)();t.items.length&&(t.redo.push(t.items.pop()),(0,o.requestRedraw)(),(0,l.updateToolbar)())}function c(){let t=(0,i.currentSlide)();t.redo.length&&(t.items.push(t.redo.pop()),(0,o.requestRedraw)(),(0,l.updateToolbar)())}function d(){let t=(0,i.currentSlide)();t.items=[],t.redo=[],t.widgets=[],(0,o.requestRedraw)(),(0,l.updateToolbar)()}function u(){i.STORE.slides={},(0,i.ensureSlide)((0,i.getSlideKey)()),(0,o.requestRedraw)(),(0,l.updateToolbar)()}function p(t){if(!t||"object"!=typeof t)return null;let e=t.__LIA_TEX_OCR__;if(e&&"function"==typeof e.recognize)return e;let n=t.__LIA_CANVAS_OCR__,a=n&&n.ocr;return a&&"function"==typeof a.recognize?a:null}function f(){let t=p(window);if(t)return t;try{let t=p(i.ROOT);if(t)return t}catch(t){}try{let t=window.parent&&window.parent!==window?p(window.parent):null;if(t)return t}catch(t){}try{let t=window.top&&window.top!==window?p(window.top):null;if(t)return t}catch(t){}return null}function h(){return!!f()}function g(){return!0}function m(t){if(!t||!(t instanceof Element)||!function(t){if(!t||!(t instanceof Element)||!t.isConnected)return!1;let e=t.getBoundingClientRect();if(e.width<=0||e.height<=0)return!1;let n=getComputedStyle(t);return"none"!==n.display&&"hidden"!==n.visibility}(t)||t.closest(".lia-annot-toolbar, .lia-annot-panel"))return!1;if(t.matches("input")){let e=String(t.type||"text").toLowerCase();return!t.disabled&&!t.readOnly&&("text"===e||"search"===e||"url"===e||"email"===e||"tel"===e||"number"===e)}return t.matches("textarea")?!t.disabled&&!t.readOnly:"true"===t.getAttribute("contenteditable")||"textbox"===t.getAttribute("role")&&"true"!==t.getAttribute("aria-readonly")}function b(t){return!!t.closest('.quiz, .lia-quiz, .lia-question, .lia-exercise, [class*="quiz"], [class*="exercise"], [id*="quiz"]')}function y(t){let e=String(null==t?"":t).trim();if(!e)return"";if(e.startsWith("$$")&&e.endsWith("$$")&&(e=e.slice(2,-2).trim()),e.startsWith("$")&&e.endsWith("$")&&(e=e.slice(1,-1).trim()),e.startsWith("\\[")&&e.endsWith("\\]")&&(e=e.slice(2,-2).trim()),e.startsWith("[")&&e.endsWith("]")){let t=e.slice(1,-1).trim(),n=0,a=!0;for(let e of t)if("["===e)n++;else if("]"===e){if(0===n){a=!1;break}n--}a&&(e=t)}return e.startsWith("\\left[")&&e.endsWith("\\right]")&&(e=e.slice(6,-7).trim()),(e=e.replace(/\s+/g," ").trim()).startsWith("\\mathrm{")&&e.endsWith("}")&&(e=e.slice(8,-1).replace(/~/g,"").trim()),e=function(t){let e=String(t||"");if(-1!==e.indexOf("\\div")&&(e=e.replace(/\s*\\div\s*/g,":")),-1===e.indexOf("\\times"))return e;let n="",a=0;for(;a<e.length;){let t=e.indexOf("\\times",a);if(t<0){n+=e.slice(a);break}n+=e.slice(a,t);let r=t-1;for(;r>=0&&" "===e[r];)r--;let i=t+6;for(;i<e.length&&" "===e[i];)i++;let o=r>=0?e[r]:"",l=i<e.length?e[i]:"",s=function(t){return t>="0"&&t<="9"},c=function(t){return t>="a"&&t<="z"};s(o)&&s(l)?n+="\\cdot":c(o)||c(l)?n+="x":n+="\\cdot",a=t+6}return n}(e)}function x(t){if("string"==typeof t)return y(t);if(t&&"object"==typeof t){let e=t.text??t.latex??t.output??t.result;if("string"==typeof e)return y(e)}return""}let T=null,S=null,v=!1;async function E(t){if(!v){if(!t||"function"!=typeof t.setModel||String(t.model||"").trim().toLowerCase().includes("texify2")){v=!0;return}try{await t.setModel("Xenova/texify2")}catch(t){}v=!0}}function w(t){let e=Math.max(t.width,t.height),n=1;if(e<420&&(n=420/e),e>1400&&(n=1400/e),.06>Math.abs(n-1))return t;let a=document.createElement("canvas");a.width=Math.max(1,Math.round(t.width*n)),a.height=Math.max(1,Math.round(t.height*n));let r=a.getContext("2d",{willReadFrequently:!0});return r?(r.fillStyle="#fff",r.fillRect(0,0,a.width,a.height),r.drawImage(t,0,0,a.width,a.height),a):t}function A(t){let e=document.createElement("canvas");e.width=Math.max(1,0|t.width),e.height=Math.max(1,0|t.height);let n=e.getContext("2d",{willReadFrequently:!0});if(!n)return t;n.fillStyle="#fff",n.fillRect(0,0,e.width,e.height),n.drawImage(t,0,0);let a=n.getImageData(0,0,e.width,e.height).data,r=e.width,i=e.height,o=new Uint8Array(r*i);for(let t=0,e=0;e<o.length;e++,t+=4)o[e]=+(.299*a[t]+.587*a[t+1]+.114*a[t+2]<200);let l=r,s=i,c=-1,d=-1;for(let t=0;t<i;t++)for(let e=0;e<r;e++)o[t*r+e]&&(e<l&&(l=e),t<s&&(s=t),e>c&&(c=e),t>d&&(d=t));if(c<0)return e;l=Math.max(0,l-18),s=Math.max(0,s-18);let u=Math.max(1,(c=Math.min(r-1,c+18))-l+1),p=Math.max(1,(d=Math.min(i-1,d+18))-s+1),f=document.createElement("canvas");f.width=u,f.height=p;let h=f.getContext("2d",{willReadFrequently:!0});if(!h)return e;let g=h.createImageData(u,p),m=g.data;for(let t=0;t<p;t++)for(let e=0;e<u;e++){let n=255*!o[(s+t)*r+(l+e)],a=(t*u+e)*4;m[a]=n,m[a+1]=n,m[a+2]=n,m[a+3]=255}h.putImageData(g,0,0);let b=512/Math.max(u,p);b<.75&&(b=.75),b>3.5&&(b=3.5);let y=document.createElement("canvas");y.width=Math.max(1,Math.round(u*b)),y.height=Math.max(1,Math.round(p*b));let x=y.getContext("2d",{willReadFrequently:!0});return x?(x.fillStyle="#fff",x.fillRect(0,0,y.width,y.height),x.imageSmoothingEnabled=!0,x.drawImage(f,0,0,y.width,y.height),y):f}function M(t){let e=String(t||"").trim();return e?!function(t){let e=String(t||"").trim();if(!e||/[+\-*/=,:;\\]$/.test(e)||/[{[(]$/.test(e))return!0;let n=0,a=0,r=0,i=!1;for(let t=0;t<e.length;t++){let o=e[t];if(i){i=!1;continue}if("\\"===o){i=!0;continue}"{"===o?n++:"}"===o?n--:"["===o?a++:"]"===o?a--:"("===o?r++:")"===o&&r--}return 0!==n||0!==a||0!==r}(e)?e.length:e.length-5e3:-9999}async function R(t,e){var n;let a,r,i,o={max_new_tokens:128,do_sample:!1,temperature:0,__silent:!0},l=w(A(e)),s=w((n=A(e),a=Math.max(0,Math.round(20)),(r=document.createElement("canvas")).width=n.width+2*a,r.height=n.height+2*a,(i=r.getContext("2d",{willReadFrequently:!0}))?(i.fillStyle="#fff",i.fillRect(0,0,r.width,r.height),i.drawImage(n,a,a),r):n)),c=w(A(function(t){let e=document.createElement("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d",{willReadFrequently:!0});if(!n)return t;n.fillStyle="#fff",n.fillRect(0,0,e.width,e.height),n.drawImage(t,0,0);let a=n.getImageData(0,0,e.width,e.height),r=a.data;for(let t=0;t<r.length;t+=4)!(r[t+3]<128)&&.299*r[t]+.587*r[t+1]+.114*r[t+2]<240&&(r[t]=Math.max(0,Math.min(255,Math.round(r[t]/1.35))),r[t+1]=Math.max(0,Math.min(255,Math.round(r[t+1]/1.35))),r[t+2]=Math.max(0,Math.min(255,Math.round(r[t+2]/1.35))));return n.putImageData(a,0,0),e}(e))),[d,u,p]=await Promise.all([t.recognize(l,o).catch(()=>""),t.recognize(s,o).catch(()=>""),t.recognize(c,o).catch(()=>"")]),f=x(d),h=x(u),g=x(p),m=M(f),b=M(h),y=M(g);return m>=b&&m>=y?f:b>=y?h:g}function O(t){if(!m(t))return;if(t.__liaAnnotTexReady){let e=t.__liaAnnotTexSync;e&&e();return}let e=document.createElement("span");e.className="lia-annot-tex-preview",e.dataset.on="0",e.innerHTML='<span class="lia-annot-tex-preview-math"></span><span class="lia-annot-tex-preview-hint">TeX</span>',t.insertAdjacentElement("afterend",e);let n=function(t){let e=t.classList;return!!e&&(!!(e.contains("is-success")||e.contains("is-failure")||e.contains("is-warning")||e.contains("is-partial")||e.contains("is-resolved"))||"true"===t.getAttribute("aria-invalid"))},a=function(t){let e=String(t||"").trim().toLowerCase();return!!e&&"transparent"!==e&&"rgba(0, 0, 0, 0)"!==e&&"rgba(0,0,0,0)"!==e},r=function(){if(e.style.removeProperty("--lia-annot-tex-preview-border"),!n(t))return;let r="";try{let e=getComputedStyle(t);r=e.borderTopColor||e.borderColor||e.outlineColor||""}catch(t){}a(r)&&e.style.setProperty("--lia-annot-tex-preview-border",r)};try{let e=new MutationObserver(function(){r()});e.observe(t,{attributes:!0,attributeFilter:["class","style","aria-invalid"]}),t.__liaAnnotTexBorderMo=e}catch(t){}r();let o=e.querySelector(".lia-annot-tex-preview-math"),l=function(){let n=(function(t){try{if(!t)return"";if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)return String(t.value||"");if("true"===t.getAttribute("contenteditable")||"textbox"===t.getAttribute("role"))return String(t.textContent||"")}catch(t){}return""})(t).trim();if(r(),!n||document.activeElement===t){e.dataset.on="0",e.style.display="none",t.style.display="";return}e.dataset.on="1",e.style.display="inline-flex",t.style.display="none",o&&function(t,e){let n,a,r,o=y(e);if(t.innerHTML="",!o)return;let l=i.ROOT,s=window,c=s.katex||l.katex||s.KaTeX||l.KaTeX;try{if(c&&"function"==typeof c.render)return void c.render(o,t,{throwOnError:!1,displayMode:!1})}catch(t){}t.textContent=o,(n=i.ROOT,(r=(a=window).katex||n.katex||a.KaTeX||n.KaTeX)&&"function"==typeof r.render?Promise.resolve(r):T||(T=async function(){let t=n.document||document;if(!t.getElementById("__lia_annot_katex_css_v1")){let e=t.createElement("link");e.id="__lia_annot_katex_css_v1",e.rel="stylesheet",e.href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",(t.head||t.documentElement).appendChild(e)}let e=await Function("u","return import(u)")("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.mjs"),r=e.default||e;if(!r||"function"!=typeof r.render)throw Error("KaTeX render not available");try{n.katex||(n.katex=r)}catch(t){}try{a.katex||(a.katex=r)}catch(t){}return r}())).then(function(e){if(t.isConnected){t.innerHTML="";try{e.render(o,t,{throwOnError:!1,displayMode:!1})}catch(e){t.textContent=o}}}).catch(function(){t.isConnected&&(t.textContent=o)})}(o,n)};e.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation(),t.style.display="";try{t.focus(),(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)&&t.select()}catch(t){}}),t.addEventListener("input",l),t.addEventListener("change",l),t.addEventListener("focus",l),t.addEventListener("blur",function(){setTimeout(l,0)}),t.__liaAnnotTexReady=!0,t.__liaAnnotTexSync=l,l()}function k(){let t=(0,o.getMarkedRect)();if(!t)return null;let e={x:t.x,y:t.y,w:t.w,h:t.h},n=(0,o.getPinnedQuizTarget)(),a=n&&m(n)?n:function(t){let e,n,a,r;if(!t||!i.STATE.canvas)return null;let l=(e=(0,o.getVisibleMainHost)(),n='input[type="text"], input:not([type]), textarea, [contenteditable="true"], [role="textbox"]',r=(a=e?Array.from(e.querySelectorAll(n)):[]).length?[]:Array.from(document.querySelectorAll(n)),(a.length?a:r).filter(m));if(!l.length)return null;let s=l.filter(b),c=s.length?s:l,d=i.STATE.canvas.getBoundingClientRect(),u=d.left+t.x+t.w/2,p=d.top+t.y+t.h/2,f=null,h=1/0;for(let t=0;t<c.length;t++){let e=c[t].getBoundingClientRect(),n=Math.hypot(e.left+e.width/2-u,e.top+e.height/2-p);n<h&&(h=n,f=c[t])}return f}(e);return a?{box:e,target:a}:null}async function _(){if(i.STORE.ui.ocrBusy||(0,i.isReadOnly)()||!i.STORE.ui.visible)return null;let t=f();if(!t||"function"!=typeof t.recognize)return null;await E(t);let e=k();if(!e)return null;S=e.target;let n=function(t){if(!t||!i.STATE.canvas)return null;let e=i.STATE.dpr||window.devicePixelRatio||1,n=(0,i.clamp)(Math.floor(t.x-12),0,i.STATE.cssW),a=(0,i.clamp)(Math.floor(t.y-12),0,i.STATE.cssH),r=(0,i.clamp)(Math.ceil(t.x+t.w+12),0,i.STATE.cssW),o=(0,i.clamp)(Math.ceil(t.y+t.h+12),0,i.STATE.cssH),l=Math.max(1,r-n),s=Math.max(1,o-a),c=Math.round(n*e),d=Math.round(a*e),u=Math.max(1,Math.round(l*e)),p=Math.max(1,Math.round(s*e)),f=document.createElement("canvas");f.width=u,f.height=p;let h=f.getContext("2d",{willReadFrequently:!0});if(!h)return null;h.setTransform(1,0,0,1,0,0),h.fillStyle="#fff",h.fillRect(0,0,f.width,f.height),h.drawImage(i.STATE.canvas,c,d,u,p,0,0,f.width,f.height);let g=h.getImageData(0,0,f.width,f.height),m=g.data;for(let t=0;t<m.length;t+=4){let e=.299*m[t]+.587*m[t+1]+.114*m[t+2]<210?0:255;m[t]=e,m[t+1]=e,m[t+2]=e,m[t+3]=255}return h.putImageData(g,0,0),f}(e.box);if(!n)return null;i.STORE.ui.ocrBusy=!0,(0,l.updateToolbar)();try{return await R(t,n)||null}catch(t){return null}finally{i.STORE.ui.ocrBusy=!1,(0,l.updateToolbar)()}}function C(t){let e=y(t);if(!e)return!1;let n=S&&m(S)?S:null;if(!n){let t=k();if(!t)return!1;n=t.target}let a=function(t,e){let n=String(null==e?"":e);try{if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)return t.focus(),t.value=n,t.dispatchEvent(new Event("input",{bubbles:!0})),t.dispatchEvent(new Event("change",{bubbles:!0})),t.dispatchEvent(new KeyboardEvent("keyup",{bubbles:!0,key:"Enter"})),t.dispatchEvent(new Event("blur",{bubbles:!0})),O(t),!0;if("true"===t.getAttribute("contenteditable")||"textbox"===t.getAttribute("role"))return t.focus(),t.textContent=n,t.dispatchEvent(new Event("input",{bubbles:!0})),t.dispatchEvent(new Event("change",{bubbles:!0})),O(t),!0}catch(t){}return!1}(n,e);return a&&(S=n),a}async function z(){let t=await _();return!!t&&C(t)}function P(t){let e=Number(t);return isFinite(e)?Math.round(1e4*e)/1e4:null}function q(t){if(!t||"object"!=typeof t)return null;let e=P(t.x),n=P(t.y);return null===e||null===n?null:{x:e,y:n}}function L(t){if(!t||"object"!=typeof t||"path"!==t.kind)return null;let e=Array.isArray(t.points)?t.points.map(q).filter(t=>null!==t):[];if(!e.length)return null;let n="eraser"===t.tool?"eraser":"pen",a=P(t.width),r=P(null==t.alpha?1:t.alpha),i=P(t.baseW);return{kind:"path",tool:n,color:String(t.color||"#ff0000"),width:null===a?1:a,alpha:null===r?1:r,baseW:null===i?1:i,points:e}}function N(t){let e={};if(!t||"object"!=typeof t)return e;for(let n in t){if(!Object.prototype.hasOwnProperty.call(t,n))continue;let a=t[n];if(!a||"object"!=typeof a)continue;let r=Array.isArray(a.items)?a.items.map(L).filter(t=>null!==t):[];r.length&&(e[String(n)]={items:r,redo:[]})}return e}function I(t){if(!t||"object"!=typeof t)return null;let e=String(t.id||"").trim();if(!e||!/^[A-Za-z0-9_-]+$/.test(e))return null;let n=Number(t.x),a=Number(t.y),r=Number(t.w),i=Number(t.h);if(!isFinite(n)||!isFinite(a)||!isFinite(r)||!isFinite(i))return null;let o=String(t.spec||"").trim(),l=String(t.language||"").trim().toLowerCase();return{id:e,x:Math.max(0,Math.round(n)),y:Math.max(0,Math.round(a)),w:Math.max(120,Math.round(r)),h:Math.max(90,Math.round(i)),spec:o||void 0,language:"de"===l?"de":"en"===l?"en":void 0}}function F(){let t=N(i.STORE.slides);for(let e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!0;return!1}function W(){return(0,i.copyJson)({version:"lia-annotation-v8",ui:{visible:!!i.STORE.ui.visible},slides:i.STORE.slides})}function B(){return(0,i.copyJson)({version:"lia-annotation-freeze-v1",ui:{visible:!!i.STORE.ui.visible},slides:N(i.STORE.slides)})}function j(t,e){let n=!1!==(e&&"object"==typeof e?e:{}).replace;if(!t||"object"!=typeof t)return!1;if(n&&(i.STORE.slides={}),t.slides&&"object"==typeof t.slides){let e=t.slides;for(let t in e){if(!Object.prototype.hasOwnProperty.call(e,t))continue;let n=e[t];n&&"object"==typeof n&&(i.STORE.slides[t]={items:Array.isArray(n.items)?(0,i.copyJson)(n.items):[],redo:Array.isArray(n.redo)?(0,i.copyJson)(n.redo):[],widgets:Array.isArray(n.widgets)?n.widgets.map(I).filter(t=>null!==t):[]})}}if(t.ui&&"object"==typeof t.ui){let e=t.ui;"boolean"==typeof e.visible&&(i.STORE.ui.visible=e.visible)}return(0,i.ensureSlide)((0,i.getSlideKey)()),(0,o.ensureOverlay)(),(0,o.syncOverlayInteractivity)(),(0,o.requestSync)(),(0,o.requestRedraw)(),(0,l.updateToolbar)(),!0}function D(t,e){let n=!1!==(e&&"object"==typeof e?e:{}).replace;if(!t||"object"!=typeof t)return!1;n&&(i.STORE.slides={});let a=N(t.slides);for(let t in a)Object.prototype.hasOwnProperty.call(a,t)&&(i.STORE.slides[t]={items:(0,i.copyJson)(a[t].items)||[],redo:[]});if(t.ui&&"object"==typeof t.ui){let e=t.ui;"boolean"==typeof e.visible&&(i.STORE.ui.visible=e.visible)}return(0,i.ensureSlide)((0,i.getSlideKey)()),(0,o.ensureOverlay)(),(0,o.syncOverlayInteractivity)(),(0,o.requestSync)(),(0,o.requestRedraw)(),(0,l.updateToolbar)(),!0}function H(t){i.STORE.ui.visible=!!t,(0,o.syncOverlayInteractivity)(),(0,o.requestRedraw)(),(0,l.updateToolbar)()}function X(t){i.STORE.ui.forcedReadOnly=null===t?null:!!t,(0,o.syncOverlayInteractivity)(),(0,l.updateToolbar)()}function Y(){let t=window.__LIA_ANNOTATION__={exportState:W,exportFreezeState:B,importState:j,importFreezeState:D,hasFreezeData:F,setVisible:H,toggleVisible:()=>H(!i.STORE.ui.visible),setReadOnly:X,clearSlide:d,clearAllSlides:u,isOcrAvailable:h,recognizeLatestAnnotationText:_,submitOcrTextToNearestQuiz:C,transferToNearestQuiz:z,startDgsPlacementMode:o.startDgsPlacementMode,registerToolbarControl:l.registerToolbarControl,unregisterToolbarControl:l.unregisterToolbarControl,hasToolbarControl:l.hasToolbarControl,refresh:function(){(0,o.ensureOverlay)(),(0,o.requestSync)(),(0,l.updateToolbar)()},getStore:function(){return(0,i.copyJson)(i.STORE)},getSlideKey:function(){return(0,i.getSlideKey)()}};window.dispatchEvent(new CustomEvent("lia-annotation-toolbar-ready",{detail:t})),window.__LIA_ANNOTATION_EXPORT__=function(){return W()},window.__LIA_ANNOTATION_IMPORT__=function(t,e){return j(t,e)},window.__LIA_ANNOTATION_FREEZE_EXPORT__=function(){return B()},window.__LIA_ANNOTATION_FREEZE_IMPORT__=function(t,e){return D(t,e)},window.__LIA_ANNOTATION_FREEZE_HAS_DATA__=function(){return F()}}},{"./store":"cswaT","./overlay":"8rPw4","./ui":"7Wjmu","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}]},["8RSWf"],"8RSWf","parcelRequire23ca",{});
//# sourceMappingURL=index.js.map
