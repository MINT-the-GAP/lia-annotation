!function(e,t,n,r,a){var i="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:"u">typeof global?global:{},o="function"==typeof i[r]&&i[r],l=o.i||{},s=o.cache||{},d="u">typeof module&&"function"==typeof module.require&&module.require.bind(module);function u(t,n){if(!s[t]){if(!e[t]){if(a[t])return a[t];var l="function"==typeof i[r]&&i[r];if(!n&&l)return l(t,!0);if(o)return o(t,!0);if(d&&"string"==typeof t)return d(t);var c=Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}f.resolve=function(n){var r=e[t][1][n];return null!=r?r:n},f.cache={};var p=s[t]=new u.Module(t);e[t][0].call(p.exports,f,p,p.exports,i)}return s[t].exports;function f(e){var t=f.resolve(e);if(!1===t)return{};if(Array.isArray(t)){var n={__esModule:!0};return t.forEach(function(e){var t=e[0],r=e[1],a=e[2]||e[0],i=u(r);"*"===t?Object.keys(i).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:function(){return i[e]}})}):"*"===a?Object.defineProperty(n,t,{enumerable:!0,value:i}):Object.defineProperty(n,t,{enumerable:!0,get:function(){return"default"===a?i.__esModule?i.default:i:i[a]}})}),n}return u(t)}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.require=d,this.exports={}},u.modules=e,u.cache=s,u.parent=o,u.distDir=void 0,u.publicUrl=void 0,u.devServer=void 0,u.i=l,u.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(u,"root",{get:function(){return i[r]}}),i[r]=u;for(var c=0;c<t.length;c++)u(t[c]);if(n){var p=u(n);"object"==typeof exports&&"u">typeof module?module.exports=p:"function"==typeof define&&define.amd&&define(function(){return p})}}({"8RSWf":[function(e,t,n,r){var a=e("./store"),i=e("./ui"),o=e("./overlay"),l=e("./api");if(!a.IS_DUPLICATE){(0,i.setToolbarCallbacks)({requestRedraw:o.requestRedraw,requestSync:o.requestSync,syncOverlayInteractivity:o.syncOverlayInteractivity,ensureOverlay:o.ensureOverlay,doUndo:l.doUndo,doRedo:l.doRedo,clearSlide:l.clearSlide}),(0,i.setGetVisibleMainHost)(o.getVisibleMainHost),(0,i.ensureCss)(),(0,i.applyThemeVars)(),(0,i.ensureToolbar)(),(0,a.ensureSlide)((0,a.getSlideKey)()),(0,o.ensureOverlay)(),(0,i.syncToolbarPosition)(),(0,i.updateToolbar)(),(0,l.registerGlobalApi)(),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},0),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},80),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},250),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},700),window.addEventListener("resize",function(){(0,i.applyThemeVars)(),(0,i.ensureToolbar)(),(0,o.requestSync)()}),window.addEventListener("hashchange",function(){(0,a.ensureSlide)((0,a.getSlideKey)()),(0,o.ensureOverlay)(),(0,i.updateToolbar)(),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},40),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},180),setTimeout(function(){(0,o.ensureOverlay)(),(0,o.requestSync)()},500)}),window.addEventListener("scroll",function(){(0,o.requestSync)()},!0),document.addEventListener("input",function(){(0,o.requestSync)()},!0),document.addEventListener("change",function(){(0,o.requestSync)()},!0);let e=new MutationObserver(function(){(0,i.applyThemeVars)(),(0,i.updateToolbar)(),(0,o.requestRedraw)()});try{e.observe(document.documentElement,{attributes:!0,attributeFilter:["class","style"]})}catch(e){}}},{"./store":"cswaT","./ui":"7Wjmu","./overlay":"8rPw4","./api":"bH1QJ"}],cswaT:[function(e,t,n,r){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(n),a.export(n,"ROOT",()=>i),a.export(n,"DOC_ID",()=>o),a.export(n,"IS_DUPLICATE",()=>d),a.export(n,"STORE",()=>u),a.export(n,"STATE",()=>c),a.export(n,"clamp",()=>p),a.export(n,"copyJson",()=>f),a.export(n,"parseRgbNoRegex",()=>T),a.export(n,"luminance",()=>h),a.export(n,"getViewportWidth",()=>y),a.export(n,"getCurrentHash",()=>b),a.export(n,"getSlideKey",()=>v),a.export(n,"ensureSlide",()=>S),a.export(n,"currentSlide",()=>m),a.export(n,"toRel",()=>g),a.export(n,"fromRel",()=>E),a.export(n,"isReadOnly",()=>x),a.export(n,"effectiveMode",()=>A),a.export(n,"getLineWidthPx",()=>O);let i=function(){let e=window;try{for(;e.parent&&e.parent!==e;)e=e.parent}catch(e){}return e}(),o=document.baseURI||location.href||"doc",l="__LIA_ANNOTATION_REG_V8__",s="__LIA_ANNOTATION_STORE_V8__";i[l]=i[l]||{docs:{}};let d=!!i[l].docs[o];i[l].docs[o]=!0,i[s]=i[s]||{slides:{},ui:{mode:"cursor",visible:!0,panelOpen:!1,panelMode:"pen",color:"#ff0000",width:3,alpha:1,eraserWidth:18,forcedReadOnly:null}};let u=i[s],c={host:null,shell:null,canvas:null,ctx:null,slideKey:null,cssW:0,cssH:0,dpr:window.devicePixelRatio||1,drawing:!1,activePath:null,syncRAF:0,redrawRAF:0,resizeObserver:null,toolbar:null,eraserRing:null,lastPointer:{x:0,y:0,inside:!1,pointerType:""}};function p(e,t,n){return Math.max(t,Math.min(n,e))}function f(e){try{return JSON.parse(JSON.stringify(e))}catch(e){return null}}function T(e){let t=String(e||""),n=t.indexOf("("),r=t.indexOf(")");if(n<0||r<0)return null;let a=t.slice(n+1,r).split(",").map(e=>Number(String(e).trim()));return!(a.length<3)&&isFinite(a[0])&&isFinite(a[1])&&isFinite(a[2])?[a[0],a[1],a[2]]:null}function h(e){let t=e.map(e=>e/255).map(e=>e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4));return .2126*t[0]+.7152*t[1]+.0722*t[2]}function y(){return Math.max(1,window.innerWidth||0,document.documentElement&&document.documentElement.clientWidth||0)}function b(){return String(location.hash||"").trim()||"#1"}function v(){return b()}function S(e){return u.slides[e]=u.slides[e]||{items:[],redo:[]},u.slides[e]}function m(){return S(v())}function g(e,t){return{x:c.cssW>0?e/c.cssW:0,y:c.cssH>0?t/c.cssH:0}}function E(e){return{x:e&&isFinite(e.x)?e.x*c.cssW:0,y:e&&isFinite(e.y)?e.y*c.cssH:0}}function x(){if(!0===u.ui.forcedReadOnly)return!0;if(!1===u.ui.forcedReadOnly)return!1;let e=document.body;return!!e&&(e.classList.contains("lia-snapshot-mode")||e.classList.contains("lia-shared-freeze-link")||e.classList.contains("lia-freeze-mode"))}function A(){return!u.ui.visible||x()?"cursor":u.ui.mode||"cursor"}function O(e){let t=Math.max(1,Number(e&&e.baseW)||c.cssW||1);return Math.max(.75,Math.max(1,c.cssW||1)/t*Math.max(.75,Number(e&&e.width)||1))}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],k3151:[function(e,t,n,r){n.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},n.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.exportAll=function(e,t){return Object.keys(e).forEach(function(n){"default"===n||"__esModule"===n||Object.prototype.hasOwnProperty.call(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:function(){return e[n]}})}),t},n.export=function(e,t,n){Object.defineProperty(e,t,{enumerable:!0,get:n})}},{}],"7Wjmu":[function(e,t,n,r){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(n),a.export(n,"getThemeAccent",()=>o),a.export(n,"applyThemeVars",()=>l),a.export(n,"ensureCss",()=>s),a.export(n,"iconEye",()=>d),a.export(n,"hideEraserRing",()=>u),a.export(n,"updateEraserRing",()=>c),a.export(n,"refreshEraserRing",()=>p),a.export(n,"setToolbarCallbacks",()=>T),a.export(n,"ensureToolbar",()=>h),a.export(n,"updateToolbar",()=>y),a.export(n,"syncToolbarPosition",()=>b),a.export(n,"setGetVisibleMainHost",()=>S);var i=e("./store");function o(){try{let e=document.querySelector(".lia-btn");if(e){let t=getComputedStyle(e).backgroundColor;if(t&&"transparent"!==t&&"rgba(0, 0, 0, 0)"!==t)return t}let t=document.createElement("button");t.className="lia-btn",t.type="button",t.textContent="x",t.style.position="absolute",t.style.left="-9999px",t.style.top="-9999px",t.style.visibility="hidden",(document.body||document.documentElement).appendChild(t);let n=getComputedStyle(t).backgroundColor;if(t.remove(),n&&"transparent"!==n&&"rgba(0, 0, 0, 0)"!==n)return n}catch(e){}return null}function l(){try{let e=document.documentElement,t=getComputedStyle(document.body||document.documentElement).backgroundColor||getComputedStyle(document.documentElement).backgroundColor,n=(0,i.parseRgbNoRegex)(t),r=!!n&&.5>(0,i.luminance)(n);e.style.setProperty("--lia-annot-border",r?"#fff":"#000"),e.style.setProperty("--lia-annot-fg",r?"#fff":"#000");let a=o();a&&e.style.setProperty("--lia-annot-accent",a),r?(e.style.setProperty("--lia-annot-bg","rgba(28,28,28,0.96)"),e.style.setProperty("--lia-annot-panel-bg","rgba(34,34,34,0.97)")):(e.style.setProperty("--lia-annot-bg","rgba(255,255,255,0.96)"),e.style.setProperty("--lia-annot-panel-bg","rgba(255,255,255,0.97)"))}catch(e){}}function s(){if(document.getElementById("__lia_annotation_css_v8"))return;let e=document.createElement("style");e.id="__lia_annotation_css_v8",e.textContent=`
  :root{
    --lia-annot-border:#000;
    --lia-annot-fg:#000;
    --lia-annot-accent:#0b5fff;
    --lia-annot-bg: rgba(255,255,255,0.96);
    --lia-annot-panel-bg: rgba(255,255,255,0.97);
  }

  .lia-annot-toolbar{
    position: fixed;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10030;
    display: inline-flex;
    flex-direction: column;
    gap: 6px;
    padding: 5px;
    margin: 0;
    box-sizing: border-box;
    border: 2px solid var(--lia-annot-border);
    border-radius: 10px;
    background: var(--lia-annot-bg);
    backdrop-filter: blur(6px);
  }

  .lia-annot-actions{
    display: inline-flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
  }

  .lia-annot-btn{
    width: 28px;
    height: 28px;
    padding: 0;
    border: 2px solid var(--lia-annot-border);
    border-radius: 999px;
    background: transparent;
    color: var(--lia-annot-fg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    line-height: 0;
  }

  .lia-annot-btn[data-active="1"]{
    border-color: var(--lia-annot-accent);
    outline: 2px solid var(--lia-annot-accent);
    outline-offset: 2px;
  }

  .lia-annot-btn[disabled]{
    opacity: .35;
    cursor: not-allowed;
  }

  .lia-annot-btn svg{
    width: 19px;
    height: 19px;
    display: block;
    margin: 0;
    overflow: visible;
  }

  .lia-annot-btn[data-act="cursor"] svg{ transform: translateX(4.5px); }
  .lia-annot-btn[data-act="pen"] svg{ transform: translateX(1px); }
  .lia-annot-btn[data-act="eraser"] svg{ transform: translateX(-4px); }
  .lia-annot-btn[data-act="undo"] svg{ transform: translateX(-4px); }
  .lia-annot-btn[data-act="redo"] svg{ transform: translateX(-3px); }
  .lia-annot-btn[data-act="toggle"] svg{ transform: translateX(1px); }

  .lia-annot-btn .ico-stroke{
    stroke: var(--lia-annot-fg);
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .lia-annot-btn .ico-fill{
    fill: var(--lia-annot-fg);
  }

  .lia-annot-panel{
    position: absolute;
    left: 44px;
    top: 0;
    z-index: 10031;
    display: none;
    grid-template-columns: 1fr;
    gap: 10px;
    width: min(300px, calc(100vw - 70px));
    padding: 9px 10px;
    box-sizing: border-box;
    border: 2px solid var(--lia-annot-border);
    border-radius: 10px;
    background: var(--lia-annot-panel-bg);
    backdrop-filter: blur(6px);
  }

  .lia-annot-panel[data-open="1"]{
    display: grid;
  }

  .lia-annot-row{
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .lia-annot-row .k{
    min-width: 6.8em;
    font-weight: 800;
    opacity: .85;
  }

  .lia-annot-row .v{
    min-width: 3.2em;
    text-align: right;
    font-weight: 850;
  }

  .lia-annot-slider{
    width: min(180px, 45vw);
  }

  .lia-annot-color-grid{
    display: grid;
    grid-template-columns: repeat(5, 22px);
    gap: 10px;
    align-items: center;
  }

  .lia-annot-color-item{
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 2px solid var(--lia-annot-border);
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    background: transparent;
  }

  .lia-annot-color-item[data-active="1"]{
    outline: 2px solid var(--lia-annot-border);
    outline-offset: 2px;
  }

  .lia-annot-note{
    font-weight: 750;
    opacity: .8;
    font-size: .95em;
  }

  .lia-annot-danger{
    width: auto;
    min-height: 30px;
    padding: 6px 10px;
    border-radius: 999px;
    border: 2px solid var(--lia-annot-border);
    background: transparent;
    color: var(--lia-annot-fg);
    font-weight: 850;
    cursor: pointer;
  }

  html, body{
    overflow-x: hidden !important;
  }

  .lia-slide__container{
    overflow-x: hidden !important;
  }

  .lia-annot-host{
    position: relative !important;
    overflow-x: clip !important;
    overflow-y: visible !important;
  }

  .lia-annot-shell{
    position: absolute;
    top: 0;
    z-index: 500;
    background: transparent;
    pointer-events: none;
  }

  .lia-annot-shell[data-hidden="1"]{
    display: none;
  }

  .lia-annot-canvas{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: block;
    background: transparent;
    pointer-events: none;
  }

  .lia-annot-eraser-ring{
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

  .lia-annot-eraser-ring[data-on="1"]{
    display: block;
  }

  .lia-annot-shell[data-mode="pen"] .lia-annot-canvas,
  .lia-annot-shell[data-mode="eraser"] .lia-annot-canvas{
    pointer-events: auto;
  }
  `,(document.head||document.documentElement).appendChild(e)}function d(e){return e?`<svg viewBox="0 0 24 24" aria-hidden="true">
      <path class="ico-stroke" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/>
      <circle cx="12" cy="12" r="3.2" class="ico-stroke"></circle>
    </svg>`:`<svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M3 3l18 18"/>
    <path class="ico-stroke" d="M2.5 12s3.5-6 9.5-6c1.8 0 3.3.5 4.6 1.2"/>
    <path class="ico-stroke" d="M21.5 12s-3.5 6-9.5 6c-1.8 0-3.4-.5-4.8-1.3"/>
  </svg>`}function u(){i.STATE.eraserRing&&(i.STATE.eraserRing.dataset.on="0")}function c(e,t){if(!i.STATE.eraserRing)return;if(!i.STORE.ui.visible||(0,i.isReadOnly)()||"eraser"!==(0,i.effectiveMode)()||!isFinite(e)||!isFinite(t)||!isFinite(i.STATE.cssW)||!isFinite(i.STATE.cssH))return void u();let n=Math.max(8,Number(i.STORE.ui.eraserWidth||18));i.STATE.eraserRing.style.width=n+"px",i.STATE.eraserRing.style.height=n+"px",i.STATE.eraserRing.style.left=(0,i.clamp)(e,0,i.STATE.cssW)+"px",i.STATE.eraserRing.style.top=(0,i.clamp)(t,0,i.STATE.cssH)+"px",i.STATE.eraserRing.dataset.on="1"}function p(){i.STATE.lastPointer&&i.STATE.lastPointer.inside?c(i.STATE.lastPointer.x,i.STATE.lastPointer.y):u()}let f=null;function T(e){f=e}function h(){if(i.STATE.toolbar&&i.STATE.toolbar.isConnected)return i.STATE.toolbar;let e=document.createElement("div");return e.className="lia-annot-toolbar",e.setAttribute("data-snapshot-admin","1"),e.innerHTML=`
    <div class="lia-annot-actions">
      <button class="lia-annot-btn" type="button" data-act="cursor" aria-label="Cursor" data-snapshot-admin="1"><svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M5 3.5l8.8 10.8-4.1 1 1.9 5.4-2.6 1-1.9-5.4-3.9 2.2L5 3.5z" fill="none" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="pen" aria-label="Pen" data-snapshot-admin="1"><svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M4 20h4l10.2-10.2a2.2 2.2 0 0 0 0-3.1l-1.1-1.1a2.2 2.2 0 0 0-3.1 0L3.8 15.8 3 21z" fill="none" stroke-width="1.8" stroke-linejoin="round"/>
    <path class="ico-stroke" d="M13.2 6.8l4 4" fill="none" stroke-width="1.8" stroke-linecap="round"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="eraser" aria-label="Eraser" data-snapshot-admin="1"><svg viewBox="-4 4 24 24" aria-hidden="true">
    <path class="ico-stroke" d="M4 16.5l8.6-8.6a2 2 0 0 1 2.8 0l4.1 4.1a2 2 0 0 1 0 2.8L12.8 23H7.6L4 19.4a2 2 0 0 1 0-2.9z" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="ico-stroke" d="M8 23h8" fill="none" stroke-width="2" stroke-linecap="round"/>
    <path class="ico-stroke" d="M9.2 14.3l6.5 6.5" fill="none" stroke-width="2" stroke-linecap="round"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="undo" aria-label="Undo" data-snapshot-admin="1"><svg viewBox="-4 0 24 24" aria-hidden="true">
    <path d="M21 8H10.2V4L2 12l8.2 8v-4H21V8z" fill="var(--lia-annot-fg)"/>
    <rect x="10.2" y="10.6" width="10.8" height="2.8" rx="1.4" fill="var(--lia-annot-fg)"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="redo" aria-label="Redo" data-snapshot-admin="1"><svg viewBox="-4 0 24 24" aria-hidden="true">
    <path d="M3 8h10.8V4l8.2 8-8.2 8v-4H3V8z" fill="var(--lia-annot-fg)"/>
    <rect x="3" y="10.6" width="10.8" height="2.8" rx="1.4" fill="var(--lia-annot-fg)"/>
  </svg></button>
      <button class="lia-annot-btn" type="button" data-act="toggle" aria-label="Show/hide annotations" data-snapshot-admin="1">${d(!0)}</button>
    </div>
    <div class="lia-annot-panel" data-open="0"></div>
  `,(document.body||document.documentElement).appendChild(e),e.addEventListener("click",function(e){let t=e.target,n=t&&t.closest?t.closest("button[data-act]"):null,r=t&&t.closest?t.closest("button[data-color]"):null;if(r){if(e.preventDefault(),e.stopPropagation(),(0,i.isReadOnly)())return;i.STORE.ui.color=String(r.getAttribute("data-color")||"#ff0000"),y(),f?.requestRedraw();return}if(!n)return;e.preventDefault(),e.stopPropagation();let a=String(n.getAttribute("data-act")||"");if("toggle"===a){f?.ensureOverlay(),i.STORE.ui.visible=!i.STORE.ui.visible,f?.syncOverlayInteractivity(),y(),f?.requestRedraw(),f?.requestSync();return}if("cursor"===a){i.STORE.ui.mode="cursor",i.STORE.ui.panelOpen=!1,f?.syncOverlayInteractivity(),y();return}if("pen"===a){if((0,i.isReadOnly)())return;let e="pen"===i.STORE.ui.mode&&"pen"===i.STORE.ui.panelMode&&i.STORE.ui.panelOpen;i.STORE.ui.mode="pen",i.STORE.ui.panelMode="pen",i.STORE.ui.panelOpen=!e,f?.syncOverlayInteractivity(),y();return}if("eraser"===a){if((0,i.isReadOnly)())return;let e="eraser"===i.STORE.ui.mode&&"eraser"===i.STORE.ui.panelMode&&i.STORE.ui.panelOpen;i.STORE.ui.mode="eraser",i.STORE.ui.panelMode="eraser",i.STORE.ui.panelOpen=!e,f?.syncOverlayInteractivity(),y();return}if("undo"===a){if((0,i.isReadOnly)())return;f?.doUndo();return}if("redo"===a){if((0,i.isReadOnly)())return;f?.doRedo();return}if("clear"===a){if((0,i.isReadOnly)())return;f?.clearSlide();return}},!0),e.addEventListener("input",function(e){let t=e.target;if(!(t instanceof HTMLElement))return;let n=String(t.getAttribute("data-act")||"");if(!(0,i.isReadOnly)()){if("width"===n){i.STORE.ui.width=(0,i.clamp)(Number(t.value),1,24),y();return}if("alpha"===n){i.STORE.ui.alpha=(0,i.clamp)(Number(t.value),.1,1),y();return}if("eraserWidth"===n){i.STORE.ui.eraserWidth=(0,i.clamp)(Number(t.value),4,80),y();return}}},!0),i.STATE.toolbar=e,e}function y(){let e=h(),t=(0,i.currentSlide)(),n=(0,i.isReadOnly)(),r=e.querySelector(".lia-annot-panel");if(r){let e=i.STORE.ui.panelOpen&&!n?"1":"0",t="eraser"===i.STORE.ui.panelMode?"eraser":"pen",a=String(r.dataset.builtMode||""),o=String(r.dataset.builtRo||"");if(r.dataset.open=e,!r.firstElementChild||a!==t||o!==String(+!!n)){if("eraser"===t)r.innerHTML=`
    <div class="lia-annot-row">
      <span class="k">Eraser</span>
      <input class="lia-annot-slider" type="range" min="4" max="80" step="1" value="${i.STORE.ui.eraserWidth}" data-act="eraserWidth" aria-label="Eraser width" data-snapshot-admin="1">
      <span class="v" data-k="eraserWidth">${i.STORE.ui.eraserWidth}</span>
    </div>
    <div class="lia-annot-row">
      <button class="lia-annot-danger" type="button" data-act="clear" data-snapshot-admin="1">Clear all</button>
    </div>
    <div class="lia-annot-note" data-k="note"></div>
  `;else{let e;e=["#ff0000","#ff7500","#ffff00","#ff00ff","#0055ff","#00ffff","#00ff00","#007500","#000000","#ffffff"].map(function(e){return'<button class="lia-annot-color-item" type="button" data-color="'+e+'" aria-label="Color '+e+'" data-snapshot-admin="1" style="background:'+e+';"></button>'}).join(""),r.innerHTML=`
    <div class="lia-annot-row">
      <span class="k">Colors</span>
      <span class="lia-annot-color-grid">${e}</span>
    </div>
    <div class="lia-annot-row">
      <span class="k">Pen width</span>
      <input class="lia-annot-slider" type="range" min="1" max="24" step="1" value="${i.STORE.ui.width}" data-act="width" aria-label="Pen width" data-snapshot-admin="1">
      <span class="v" data-k="width">${i.STORE.ui.width}</span>
    </div>
    <div class="lia-annot-row">
      <span class="k">Opacity</span>
      <input class="lia-annot-slider" type="range" min="0.1" max="1" step="0.05" value="${i.STORE.ui.alpha}" data-act="alpha" aria-label="Opacity" data-snapshot-admin="1">
      <span class="v" data-k="alpha">${Math.round(100*Number(i.STORE.ui.alpha||1))}%</span>
    </div>
    <div class="lia-annot-note" data-k="note"></div>
  `}r.dataset.builtMode=t,r.dataset.builtRo=String(+!!n)}}let a=r?r.querySelector('[data-k="note"]'):null;if(a&&(a.textContent=n?"Freeze/read-only mode: drawing is locked, show/hide still works.":""),e.querySelectorAll(".lia-annot-btn[data-act]").forEach(function(e){let r=String(e.getAttribute("data-act")||"");e.dataset.active="0","cursor"===r&&"cursor"===i.STORE.ui.mode&&(e.dataset.active="1"),"pen"===r&&"pen"===i.STORE.ui.mode&&(e.dataset.active="1"),"eraser"===r&&"eraser"===i.STORE.ui.mode&&(e.dataset.active="1"),"toggle"===r&&(e.dataset.active=i.STORE.ui.visible?"1":"0",e.innerHTML=d(!!i.STORE.ui.visible)),"undo"===r?e.disabled=n||0===t.items.length:"redo"===r?e.disabled=n||0===t.redo.length:"pen"===r||"eraser"===r?e.disabled=n:e.disabled=!1}),r){r.querySelectorAll(".lia-annot-color-item").forEach(function(e){let t=String(e.getAttribute("data-color")||"");e.dataset.active=t===String(i.STORE.ui.color||"")?"1":"0",e.disabled=n});let e=r.querySelector('.lia-annot-danger[data-act="clear"]');e&&(e.disabled=n||0===t.items.length);let a=r.querySelector('input[data-act="width"]'),o=r.querySelector('input[data-act="alpha"]'),l=r.querySelector('input[data-act="eraserWidth"]'),s=r.querySelector('[data-k="width"]'),d=r.querySelector('[data-k="alpha"]'),u=r.querySelector('[data-k="eraserWidth"]');a&&document.activeElement!==a&&(a.value=String(i.STORE.ui.width)),o&&document.activeElement!==o&&(o.value=String(i.STORE.ui.alpha)),l&&document.activeElement!==l&&(l.value=String(i.STORE.ui.eraserWidth)),s&&(s.textContent=String(i.STORE.ui.width)),d&&(d.textContent=Math.round(100*Number(i.STORE.ui.alpha||1))+"%"),u&&(u.textContent=String(i.STORE.ui.eraserWidth))}"eraser"===(0,i.effectiveMode)()&&i.STORE.ui.visible&&!n&&i.STATE.lastPointer&&i.STATE.lastPointer.inside?p():u()}function b(){let e=h(),t=v();if(!e||!t)return;let n=(0,i.getViewportWidth)(),r=Math.ceil(e.getBoundingClientRect().width||e.offsetWidth||44),a=Math.round((t.closest(".lia-slide__container")||t.parentElement||t).getBoundingClientRect().left+8);a=Math.min(a=Math.max(8,a),Math.max(8,n-r-8)),e.style.left=a+"px"}let v=()=>document.body||document.documentElement;function S(e){v=e}},{"./store":"cswaT","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"8rPw4":[function(e,t,n,r){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(n),a.export(n,"getDirectHeader",()=>l),a.export(n,"findDirectChildByClass",()=>s),a.export(n,"isMainVisible",()=>d),a.export(n,"getVisibleMainHost",()=>u),a.export(n,"disconnectResizeObserver",()=>c),a.export(n,"bindResizeObserver",()=>p),a.export(n,"bindCanvasEvents",()=>T),a.export(n,"ensureOverlay",()=>h),a.export(n,"syncOverlayInteractivity",()=>y),a.export(n,"syncCanvasSize",()=>b),a.export(n,"requestSync",()=>v),a.export(n,"redrawNow",()=>S),a.export(n,"requestRedraw",()=>m);var i=e("./store"),o=e("./ui");function l(e){if(!e)return null;let t=e.children||[];for(let e=0;e<t.length;e++){let n=t[e];if(n&&n.tagName&&"header"===n.tagName.toLowerCase())return n}return null}function s(e,t){if(!e)return null;let n=e.children||[];for(let e=0;e<n.length;e++){let r=n[e];if(r.classList&&r.classList.contains(t))return r}return null}function d(e){if(!e||e.hasAttribute("hidden"))return!1;let t=getComputedStyle(e);if("none"===t.display||"hidden"===t.visibility)return!1;let n=e.getBoundingClientRect();return n.width>0&&n.height>0}function u(){let e=Array.from(document.querySelectorAll("main"));for(let t=0;t<e.length;t++)if(d(e[t]))return e[t];return e[0]||document.querySelector("main")||document.body||document.documentElement}function c(){try{i.STATE.resizeObserver&&i.STATE.resizeObserver.disconnect()}catch(e){}i.STATE.resizeObserver=null}function p(){if(c(),i.STATE.host)try{i.STATE.resizeObserver=new ResizeObserver(function(){v()}),i.STATE.resizeObserver.observe(i.STATE.host)}catch(e){}}function f(e,t){let n=l(e);if(n){n.nextSibling!==t&&(t.parentNode===e&&t.remove(),n.nextSibling?e.insertBefore(t,n.nextSibling):e.appendChild(t));return}e.firstChild!==t&&(t.parentNode===e&&t.remove(),e.firstChild?e.insertBefore(t,e.firstChild):e.appendChild(t))}function T(){function e(e){let t,n=(t=i.STATE.canvas.getBoundingClientRect(),{x:(0,i.clamp)(e.clientX-t.left,0,i.STATE.cssW),y:(0,i.clamp)(e.clientY-t.top,0,i.STATE.cssH)});return i.STATE.lastPointer={x:n.x,y:n.y,inside:!0,pointerType:String(e.pointerType||"")},n}function t(t,n){if(i.STATE.drawing){t.preventDefault(),t.stopPropagation();try{i.STATE.canvas.releasePointerCapture(t.pointerId)}catch(e){}i.STATE.drawing=!1,i.STATE.activePath=null,m(),(0,o.updateToolbar)()}if(n&&"mouse"===t.pointerType&&i.STORE.ui.visible&&!(0,i.isReadOnly)()&&"eraser"===(0,i.effectiveMode)()){let n=e(t);(0,o.updateEraserRing)(n.x,n.y)}else i.STATE.lastPointer.inside=!1,(0,o.hideEraserRing)()}i.STATE.canvas&&!i.STATE.canvas.__liaAnnotBound&&(i.STATE.canvas.__liaAnnotBound=!0,i.STATE.canvas.addEventListener("pointerdown",function(t){if("mouse"===t.pointerType&&0!==t.button)return;let n=e(t);if(!i.STORE.ui.visible||(0,i.isReadOnly)())return void(0,o.hideEraserRing)();let r=(0,i.effectiveMode)();if("eraser"===r?(0,o.updateEraserRing)(n.x,n.y):(0,o.hideEraserRing)(),"pen"!==r&&"eraser"!==r)return;t.preventDefault(),t.stopPropagation(),i.STORE.ui.panelOpen&&(i.STORE.ui.panelOpen=!1,(0,o.updateToolbar)());let a=(0,i.ensureSlide)((0,i.getSlideKey)()),l={kind:"path",tool:r,color:String(i.STORE.ui.color||"#ff0000"),width:"eraser"===r?Number(i.STORE.ui.eraserWidth||18):Number(i.STORE.ui.width||3),alpha:"eraser"===r?1:Number(i.STORE.ui.alpha||1),baseW:Math.max(1,i.STATE.cssW),points:[(0,i.toRel)(n.x,n.y)]};a.items.push(l),a.redo=[],i.STATE.activePath=l,i.STATE.drawing=!0;try{i.STATE.canvas.setPointerCapture(t.pointerId)}catch(e){}m(),(0,o.updateToolbar)()},!0),i.STATE.canvas.addEventListener("pointermove",function(t){let n=e(t);!(0,i.isReadOnly)()&&i.STORE.ui.visible&&"eraser"===(0,i.effectiveMode)()?(0,o.updateEraserRing)(n.x,n.y):(0,o.hideEraserRing)(),i.STATE.drawing&&i.STATE.activePath&&(t.preventDefault(),t.stopPropagation(),function(e,t,n){if(!e||!Array.isArray(e.points))return;let r=(0,i.toRel)(t,n),a=e.points.length?e.points[e.points.length-1]:null;if(!(a&&.8>Math.hypot((r.x-a.x)*i.STATE.cssW,(r.y-a.y)*i.STATE.cssH)))e.points.push(r)}(i.STATE.activePath,n.x,n.y),m())},!0),i.STATE.canvas.addEventListener("pointerup",function(e){t(e,!0)},!0),i.STATE.canvas.addEventListener("pointercancel",function(e){t(e,!1)},!0),i.STATE.canvas.addEventListener("pointerleave",function(){i.STATE.lastPointer.inside=!1,(0,o.hideEraserRing)()},!0),i.STATE.canvas.addEventListener("contextmenu",function(e){e.preventDefault()},!0))}function h(){let e=u(),t=(0,i.getSlideKey)(),n=i.STATE.host!==e,r=i.STATE.slideKey!==t;if(i.STATE.shell&&i.STATE.shell.isConnected&&!n)f(e,i.STATE.shell),i.STATE.canvas=i.STATE.shell.querySelector(".lia-annot-canvas"),i.STATE.eraserRing=i.STATE.shell.querySelector(".lia-annot-eraser-ring");else{c(),i.STATE.host=e,i.STATE.slideKey=t,e.classList.add("lia-annot-host");let n=s(e,"lia-annot-shell");n||((n=document.createElement("div")).className="lia-annot-shell",n.setAttribute("aria-hidden","true"));let r=n.querySelector(".lia-annot-canvas");r||((r=document.createElement("canvas")).className="lia-annot-canvas",r.setAttribute("aria-label","Annotation canvas"),n.appendChild(r));let a=n.querySelector(".lia-annot-eraser-ring");a||((a=document.createElement("span")).className="lia-annot-eraser-ring",a.dataset.on="0",n.appendChild(a)),f(e,n),i.STATE.shell=n,i.STATE.canvas=r,i.STATE.eraserRing=a,i.STATE.ctx=i.STATE.canvas?i.STATE.canvas.getContext("2d",{willReadFrequently:!0}):null,T(),p()}r&&(i.STATE.slideKey=t),y()}function y(){let e=Array.from(document.querySelectorAll(".lia-annot-shell")),t=(0,i.effectiveMode)(),n=!!i.STORE.ui.visible;for(let t=0;t<e.length;t++){let r=e[t],a=r.querySelector(".lia-annot-canvas");r.dataset.mode="cursor",r.dataset.hidden=n?"0":"1",r.style.pointerEvents="none",r.style.display=n?"":"none",a&&(a.style.pointerEvents="none",a.style.touchAction="auto",a.style.cursor="default")}n&&i.STATE.shell&&i.STATE.canvas?(i.STATE.shell.style.display="",i.STATE.shell.dataset.hidden="0",i.STATE.shell.dataset.mode=t,i.STATE.shell.style.pointerEvents="none","pen"===t||"eraser"===t?(i.STATE.canvas.style.pointerEvents="auto",i.STATE.canvas.style.touchAction="none",i.STATE.canvas.style.cursor="crosshair"):(i.STATE.canvas.style.pointerEvents="none",i.STATE.canvas.style.touchAction="auto",i.STATE.canvas.style.cursor="default"),"eraser"===t?(0,o.refreshEraserRing)():(0,o.hideEraserRing)()):(0,o.hideEraserRing)()}function b(){if(!i.STATE.host||!i.STATE.canvas||!i.STATE.ctx||!i.STATE.shell)return;i.STATE.dpr=window.devicePixelRatio||1;let e=i.STATE.host.getBoundingClientRect(),t=(0,i.getViewportWidth)(),n=Math.max(1,Math.ceil(Math.max(i.STATE.host.scrollHeight||0,i.STATE.host.clientHeight||0,e.height||0))),r=Math.round(-e.left);i.STATE.cssW=t,i.STATE.cssH=n,i.STATE.shell.style.left=r+"px",i.STATE.shell.style.top="0px",i.STATE.shell.style.width=t+"px",i.STATE.shell.style.height=n+"px",i.STATE.canvas.style.width=t+"px",i.STATE.canvas.style.height=n+"px";let a=Math.max(1,Math.round(t*i.STATE.dpr)),l=Math.max(1,Math.round(n*i.STATE.dpr));i.STATE.canvas.width!==a&&(i.STATE.canvas.width=a),i.STATE.canvas.height!==l&&(i.STATE.canvas.height=l),(0,o.refreshEraserRing)()}function v(){i.STATE.syncRAF||(i.STATE.syncRAF=requestAnimationFrame(function(){i.STATE.syncRAF=0,h(),b(),e("42b16d8938ebb527").then(({syncToolbarPosition:e})=>e()),m()}))}function S(){if(!i.STATE.canvas||!i.STATE.ctx)return;let e=i.STATE.ctx;if(e.setTransform(i.STATE.dpr,0,0,i.STATE.dpr,0,0),e.clearRect(0,0,i.STATE.cssW,i.STATE.cssH),!i.STORE.ui.visible)return;let t=(0,i.ensureSlide)(i.STATE.slideKey||(0,i.getSlideKey)());for(let n=0;n<t.items.length;n++)!function(e,t){if(!t||"path"!==t.kind||!Array.isArray(t.points)||0===t.points.length)return;let n="eraser"===t.tool,r=(0,i.getLineWidthPx)(t),a=(0,i.clamp)(Number(t.alpha||1),.05,1),o=String(t.color||"#000");if(1===t.points.length){var l,s,d;let u=(0,i.fromRel)(t.points[0]);l=u.x,s=u.y,d=r/2,e.save(),e.globalCompositeOperation=n?"destination-out":"source-over",e.globalAlpha=n?1:(0,i.clamp)(Number(a||1),.05,1),e.beginPath(),e.arc(l,s,Math.max(.5,d),0,2*Math.PI),e.fillStyle=n?"#000":String(o||"#000"),e.fill(),e.restore();return}e.save(),e.globalCompositeOperation=n?"destination-out":"source-over",e.globalAlpha=n?1:a,e.lineCap="round",e.lineJoin="round",e.lineWidth=r,e.strokeStyle=n?"#000":o,e.beginPath();let u=(0,i.fromRel)(t.points[0]);e.moveTo(u.x,u.y);for(let n=1;n<t.points.length;n++){let r=(0,i.fromRel)(t.points[n]);e.lineTo(r.x,r.y)}e.stroke(),e.restore()}(e,t.items[n])}function m(){i.STATE.redrawRAF||(i.STATE.redrawRAF=requestAnimationFrame(function(){i.STATE.redrawRAF=0,S(),(0,o.updateToolbar)()}))}},{"./store":"cswaT","./ui":"7Wjmu","42b16d8938ebb527":"fsRuL","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],fsRuL:[function(e,t,n,r){t.exports=Promise.resolve(t.bundle.root("7Wjmu"))},{}],bH1QJ:[function(e,t,n,r){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(n),a.export(n,"doUndo",()=>s),a.export(n,"doRedo",()=>d),a.export(n,"clearSlide",()=>u),a.export(n,"clearAllSlides",()=>c),a.export(n,"roundFreezeNum",()=>p),a.export(n,"sanitizeFreezePoint",()=>f),a.export(n,"sanitizeFreezeItem",()=>T),a.export(n,"sanitizeFreezeSlides",()=>h),a.export(n,"hasFreezeData",()=>y),a.export(n,"exportState",()=>b),a.export(n,"exportFreezeState",()=>v),a.export(n,"importState",()=>S),a.export(n,"importFreezeState",()=>m),a.export(n,"setVisible",()=>g),a.export(n,"setReadOnly",()=>E),a.export(n,"registerGlobalApi",()=>x);var i=e("./store"),o=e("./overlay"),l=e("./ui");function s(){let e=(0,i.currentSlide)();e.items.length&&(e.redo.push(e.items.pop()),(0,o.requestRedraw)(),(0,l.updateToolbar)())}function d(){let e=(0,i.currentSlide)();e.redo.length&&(e.items.push(e.redo.pop()),(0,o.requestRedraw)(),(0,l.updateToolbar)())}function u(){let e=(0,i.currentSlide)();e.items=[],e.redo=[],(0,o.requestRedraw)(),(0,l.updateToolbar)()}function c(){i.STORE.slides={},(0,i.ensureSlide)((0,i.getSlideKey)()),(0,o.requestRedraw)(),(0,l.updateToolbar)()}function p(e){let t=Number(e);return isFinite(t)?Math.round(1e4*t)/1e4:null}function f(e){if(!e||"object"!=typeof e)return null;let t=p(e.x),n=p(e.y);return null===t||null===n?null:{x:t,y:n}}function T(e){if(!e||"object"!=typeof e||"path"!==e.kind)return null;let t=Array.isArray(e.points)?e.points.map(f).filter(e=>null!==e):[];if(!t.length)return null;let n="eraser"===e.tool?"eraser":"pen",r=p(e.width),a=p(null==e.alpha?1:e.alpha),i=p(e.baseW);return{kind:"path",tool:n,color:String(e.color||"#ff0000"),width:null===r?1:r,alpha:null===a?1:a,baseW:null===i?1:i,points:t}}function h(e){let t={};if(!e||"object"!=typeof e)return t;for(let n in e){if(!Object.prototype.hasOwnProperty.call(e,n))continue;let r=e[n];if(!r||"object"!=typeof r)continue;let a=Array.isArray(r.items)?r.items.map(T).filter(e=>null!==e):[];a.length&&(t[String(n)]={items:a,redo:[]})}return t}function y(){let e=h(i.STORE.slides);for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!0;return!1}function b(){return(0,i.copyJson)({version:"lia-annotation-v8",ui:{visible:!!i.STORE.ui.visible},slides:i.STORE.slides})}function v(){return(0,i.copyJson)({version:"lia-annotation-freeze-v1",ui:{visible:!!i.STORE.ui.visible},slides:h(i.STORE.slides)})}function S(e,t){let n=!1!==(t&&"object"==typeof t?t:{}).replace;if(!e||"object"!=typeof e)return!1;if(n&&(i.STORE.slides={}),e.slides&&"object"==typeof e.slides){let t=e.slides;for(let e in t){if(!Object.prototype.hasOwnProperty.call(t,e))continue;let n=t[e];n&&"object"==typeof n&&(i.STORE.slides[e]={items:Array.isArray(n.items)?(0,i.copyJson)(n.items):[],redo:Array.isArray(n.redo)?(0,i.copyJson)(n.redo):[]})}}if(e.ui&&"object"==typeof e.ui){let t=e.ui;"boolean"==typeof t.visible&&(i.STORE.ui.visible=t.visible)}return(0,i.ensureSlide)((0,i.getSlideKey)()),(0,o.ensureOverlay)(),(0,o.syncOverlayInteractivity)(),(0,o.requestSync)(),(0,o.requestRedraw)(),(0,l.updateToolbar)(),!0}function m(e,t){let n=!1!==(t&&"object"==typeof t?t:{}).replace;if(!e||"object"!=typeof e)return!1;n&&(i.STORE.slides={});let r=h(e.slides);for(let e in r)Object.prototype.hasOwnProperty.call(r,e)&&(i.STORE.slides[e]={items:(0,i.copyJson)(r[e].items)||[],redo:[]});if(e.ui&&"object"==typeof e.ui){let t=e.ui;"boolean"==typeof t.visible&&(i.STORE.ui.visible=t.visible)}return(0,i.ensureSlide)((0,i.getSlideKey)()),(0,o.ensureOverlay)(),(0,o.syncOverlayInteractivity)(),(0,o.requestSync)(),(0,o.requestRedraw)(),(0,l.updateToolbar)(),!0}function g(e){i.STORE.ui.visible=!!e,(0,o.syncOverlayInteractivity)(),(0,o.requestRedraw)(),(0,l.updateToolbar)()}function E(e){i.STORE.ui.forcedReadOnly=null===e?null:!!e,(0,o.syncOverlayInteractivity)(),(0,l.updateToolbar)()}function x(){window.__LIA_ANNOTATION__={exportState:b,exportFreezeState:v,importState:S,importFreezeState:m,hasFreezeData:y,setVisible:g,toggleVisible:()=>g(!i.STORE.ui.visible),setReadOnly:E,clearSlide:u,clearAllSlides:c,refresh:function(){(0,o.ensureOverlay)(),(0,o.requestSync)(),(0,l.updateToolbar)()},getStore:function(){return(0,i.copyJson)(i.STORE)},getSlideKey:function(){return(0,i.getSlideKey)()}},window.__LIA_ANNOTATION_EXPORT__=function(){return b()},window.__LIA_ANNOTATION_IMPORT__=function(e,t){return S(e,t)},window.__LIA_ANNOTATION_FREEZE_EXPORT__=function(){return v()},window.__LIA_ANNOTATION_FREEZE_IMPORT__=function(e,t){return m(e,t)},window.__LIA_ANNOTATION_FREEZE_HAS_DATA__=function(){return y()}}},{"./store":"cswaT","./overlay":"8rPw4","./ui":"7Wjmu","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}]},["8RSWf"],"8RSWf","parcelRequire23ca",{});
//# sourceMappingURL=index.js.map
