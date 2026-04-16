!function(e,t,n,a,i){var r="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:"u">typeof global?global:{},o="function"==typeof r[a]&&r[a],l=o.i||{},s=o.cache||{},d="u">typeof module&&"function"==typeof module.require&&module.require.bind(module);function u(t,n){if(!s[t]){if(!e[t]){if(i[t])return i[t];var l="function"==typeof r[a]&&r[a];if(!n&&l)return l(t,!0);if(o)return o(t,!0);if(d&&"string"==typeof t)return d(t);var c=Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}f.resolve=function(n){var a=e[t][1][n];return null!=a?a:n},f.cache={};var p=s[t]=new u.Module(t);e[t][0].call(p.exports,f,p,p.exports,r)}return s[t].exports;function f(e){var t=f.resolve(e);if(!1===t)return{};if(Array.isArray(t)){var n={__esModule:!0};return t.forEach(function(e){var t=e[0],a=e[1],i=e[2]||e[0],r=u(a);"*"===t?Object.keys(r).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:function(){return r[e]}})}):"*"===i?Object.defineProperty(n,t,{enumerable:!0,value:r}):Object.defineProperty(n,t,{enumerable:!0,get:function(){return"default"===i?r.__esModule?r.default:r:r[i]}})}),n}return u(t)}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.require=d,this.exports={}},u.modules=e,u.cache=s,u.parent=o,u.distDir=void 0,u.publicUrl=void 0,u.devServer=void 0,u.i=l,u.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(u,"root",{get:function(){return r[a]}}),r[a]=u;for(var c=0;c<t.length;c++)u(t[c]);if(n){var p=u(n);"object"==typeof exports&&"u">typeof module?module.exports=p:"function"==typeof define&&define.amd&&define(function(){return p})}}({"8RSWf":[function(e,t,n,a){!function(){let e=function(){let e=window;try{for(;e.parent&&e.parent!==e;)e=e.parent}catch(e){}return e}(),t=document.baseURI||location.href||"doc",n="__LIA_ANNOTATION_REG_V8__";if(e[n]=e[n]||{docs:{}},e[n].docs[t])return;e[n].docs[t]=!0;let a="__LIA_ANNOTATION_STORE_V8__";e[a]=e[a]||{slides:{},ui:{mode:"cursor",visible:!0,panelOpen:!1,panelMode:"pen",color:"#ff0000",width:3,alpha:1,eraserWidth:18,forcedReadOnly:null}};let i=e[a],r={host:null,shell:null,canvas:null,ctx:null,slideKey:null,cssW:0,cssH:0,dpr:window.devicePixelRatio||1,drawing:!1,activePath:null,syncRAF:0,redrawRAF:0,resizeObserver:null,toolbar:null,eraserRing:null,lastPointer:{x:0,y:0,inside:!1,pointerType:""}};function o(e,t,n){return Math.max(t,Math.min(n,e))}function l(e){try{return JSON.parse(JSON.stringify(e))}catch(e){return null}}function s(){return Math.max(1,window.innerWidth||0,document.documentElement&&document.documentElement.clientWidth||0)}function d(){return String(location.hash||"").trim()||"#1"}function u(e){return i.slides[e]=i.slides[e]||{items:[],redo:[]},i.slides[e]}function c(){return u(d())}function p(e,t){return{x:r.cssW>0?e/r.cssW:0,y:r.cssH>0?t/r.cssH:0}}function f(e){return{x:e&&isFinite(e.x)?e.x*r.cssW:0,y:e&&isFinite(e.y)?e.y*r.cssH:0}}function h(){let e=Array.from(document.querySelectorAll("main"));for(let t=0;t<e.length;t++)if(function(e){if(!e||e.hasAttribute("hidden"))return!1;let t=getComputedStyle(e);if("none"===t.display||"hidden"===t.visibility)return!1;let n=e.getBoundingClientRect();return n.width>0&&n.height>0}(e[t]))return e[t];return e[0]||document.querySelector("main")||document.body||document.documentElement}function b(){if(!0===i.ui.forcedReadOnly)return!0;if(!1===i.ui.forcedReadOnly)return!1;let e=document.body;return!!e&&(e.classList.contains("lia-snapshot-mode")||e.classList.contains("lia-shared-freeze-link")||e.classList.contains("lia-freeze-mode"))}function v(){return!i.ui.visible||b()?"cursor":i.ui.mode||"cursor"}function m(){try{let e,t=document.documentElement,n=getComputedStyle(document.body||document.documentElement).backgroundColor||getComputedStyle(document.documentElement).backgroundColor,a=function(e){let t=String(e||""),n=t.indexOf("("),a=t.indexOf(")");if(n<0||a<0)return null;let i=t.slice(n+1,a).split(",").map(e=>Number(String(e).trim()));return!(i.length<3)&&isFinite(i[0])&&isFinite(i[1])&&isFinite(i[2])?[i[0],i[1],i[2]]:null}(n),i=!!a&&.5>(e=a.map(e=>e/255).map(e=>e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4)),.2126*e[0]+.7152*e[1]+.0722*e[2]);t.style.setProperty("--lia-annot-border",i?"#fff":"#000"),t.style.setProperty("--lia-annot-fg",i?"#fff":"#000");let r=function(){try{let e=document.querySelector(".lia-btn");if(e){let t=getComputedStyle(e).backgroundColor;if(t&&"transparent"!==t&&"rgba(0, 0, 0, 0)"!==t)return t}let t=document.createElement("button");t.className="lia-btn",t.type="button",t.textContent="x",t.style.position="absolute",t.style.left="-9999px",t.style.top="-9999px",t.style.visibility="hidden",(document.body||document.documentElement).appendChild(t);let n=getComputedStyle(t).backgroundColor;if(t.remove(),n&&"transparent"!==n&&"rgba(0, 0, 0, 0)"!==n)return n}catch(e){}return null}();r&&t.style.setProperty("--lia-annot-accent",r),i?(t.style.setProperty("--lia-annot-bg","rgba(28,28,28,0.96)"),t.style.setProperty("--lia-annot-panel-bg","rgba(34,34,34,0.97)")):(t.style.setProperty("--lia-annot-bg","rgba(255,255,255,0.96)"),t.style.setProperty("--lia-annot-panel-bg","rgba(255,255,255,0.97)"))}catch(e){}}function g(){r.eraserRing&&(r.eraserRing.dataset.on="0")}function y(e,t){if(!r.eraserRing)return;if(!i.ui.visible||b()||"eraser"!==v()||!isFinite(e)||!isFinite(t)||!isFinite(r.cssW)||!isFinite(r.cssH))return void g();let n=Math.max(8,Number(i.ui.eraserWidth||18));r.eraserRing.style.width=n+"px",r.eraserRing.style.height=n+"px",r.eraserRing.style.left=o(e,0,r.cssW)+"px",r.eraserRing.style.top=o(t,0,r.cssH)+"px",r.eraserRing.dataset.on="1"}function x(){r.lastPointer&&r.lastPointer.inside?y(r.lastPointer.x,r.lastPointer.y):g()}function w(e){return e?`<svg viewBox="0 0 24 24" aria-hidden="true">
        <path class="ico-stroke" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/>
        <circle cx="12" cy="12" r="3.2" class="ico-stroke"></circle>
      </svg>`:`<svg viewBox="0 0 24 24" aria-hidden="true">
      <path class="ico-stroke" d="M3 3l18 18"/>
      <path class="ico-stroke" d="M2.5 12s3.5-6 9.5-6c1.8 0 3.3.5 4.6 1.2"/>
      <path class="ico-stroke" d="M21.5 12s-3.5 6-9.5 6c-1.8 0-3.4-.5-4.8-1.3"/>
    </svg>`}function _(){if(r.toolbar&&r.toolbar.isConnected)return r.toolbar;let e=document.createElement("div");return e.className="lia-annot-toolbar",e.setAttribute("data-snapshot-admin","1"),e.innerHTML=`
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
        <button class="lia-annot-btn" type="button" data-act="toggle" aria-label="Show/hide annotations" data-snapshot-admin="1">${w(!0)}</button>
      </div>
      <div class="lia-annot-panel" data-open="0"></div>
    `,(document.body||document.documentElement).appendChild(e),e.addEventListener("click",function(e){let t=e.target,n=t&&t.closest?t.closest("button[data-act]"):null,a=t&&t.closest?t.closest("button[data-color]"):null;if(a){if(e.preventDefault(),e.stopPropagation(),b())return;i.ui.color=String(a.getAttribute("data-color")||"#ff0000"),A(),R();return}if(!n)return;e.preventDefault(),e.stopPropagation();let r=String(n.getAttribute("data-act")||"");if("toggle"===r){E(),i.ui.visible=!i.ui.visible,M(),A(),R(),N();return}if("cursor"===r){i.ui.mode="cursor",i.ui.panelOpen=!1,M(),A();return}if("pen"===r){if(b())return;let e="pen"===i.ui.mode&&"pen"===i.ui.panelMode&&i.ui.panelOpen;i.ui.mode="pen",i.ui.panelMode="pen",i.ui.panelOpen=!e,M(),A();return}if("eraser"===r){if(b())return;let e="eraser"===i.ui.mode&&"eraser"===i.ui.panelMode&&i.ui.panelOpen;i.ui.mode="eraser",i.ui.panelMode="eraser",i.ui.panelOpen=!e,M(),A();return}if("undo"===r){let e;if(b())return;(e=c()).items.length&&(e.redo.push(e.items.pop()),R(),A());return}if("redo"===r){let e;if(b())return;(e=c()).redo.length&&(e.items.push(e.redo.pop()),R(),A());return}if("clear"===r){if(b())return;P();return}},!0),e.addEventListener("input",function(e){let t=e.target;if(!(t instanceof HTMLElement))return;let n=String(t.getAttribute("data-act")||"");if(!b()){if("width"===n){i.ui.width=o(Number(t.value),1,24),A();return}if("alpha"===n){i.ui.alpha=o(Number(t.value),.1,1),A();return}if("eraserWidth"===n){i.ui.eraserWidth=o(Number(t.value),4,80),A();return}}},!0),r.toolbar=e,e}function A(){let e=_(),t=c(),n=b(),a=e.querySelector(".lia-annot-panel");if(a){let e=i.ui.panelOpen&&!n?"1":"0",t="eraser"===i.ui.panelMode?"eraser":"pen",r=String(a.dataset.builtMode||""),o=String(a.dataset.builtRo||"");if(a.dataset.open=e,!a.firstElementChild||r!==t||o!==String(+!!n)){if("eraser"===t)a.innerHTML=`
      <div class="lia-annot-row">
        <span class="k">Eraser</span>
        <input class="lia-annot-slider" type="range" min="4" max="80" step="1" value="${i.ui.eraserWidth}" data-act="eraserWidth" aria-label="Eraser width" data-snapshot-admin="1">
        <span class="v" data-k="eraserWidth">${i.ui.eraserWidth}</span>
      </div>
      <div class="lia-annot-row">
        <button class="lia-annot-danger" type="button" data-act="clear" data-snapshot-admin="1">Clear all</button>
      </div>
      <div class="lia-annot-note" data-k="note"></div>
    `;else{let e;e=["#ff0000","#ff7500","#ffff00","#ff00ff","#0055ff","#00ffff","#00ff00","#007500","#000000","#ffffff"].map(function(e){return'<button class="lia-annot-color-item" type="button" data-color="'+e+'" aria-label="Color '+e+'" data-snapshot-admin="1" style="background:'+e+';"></button>'}).join(""),a.innerHTML=`
      <div class="lia-annot-row">
        <span class="k">Colors</span>
        <span class="lia-annot-color-grid">${e}</span>
      </div>
      <div class="lia-annot-row">
        <span class="k">Pen width</span>
        <input class="lia-annot-slider" type="range" min="1" max="24" step="1" value="${i.ui.width}" data-act="width" aria-label="Pen width" data-snapshot-admin="1">
        <span class="v" data-k="width">${i.ui.width}</span>
      </div>
      <div class="lia-annot-row">
        <span class="k">Opacity</span>
        <input class="lia-annot-slider" type="range" min="0.1" max="1" step="0.05" value="${i.ui.alpha}" data-act="alpha" aria-label="Opacity" data-snapshot-admin="1">
        <span class="v" data-k="alpha">${Math.round(100*Number(i.ui.alpha||1))}%</span>
      </div>
      <div class="lia-annot-note" data-k="note"></div>
    `}a.dataset.builtMode=t,a.dataset.builtRo=String(+!!n)}}let o=a?a.querySelector('[data-k="note"]'):null;if(o&&(o.textContent=n?"Freeze/read-only mode: drawing is locked, show/hide still works.":""),e.querySelectorAll(".lia-annot-btn[data-act]").forEach(function(e){let a=String(e.getAttribute("data-act")||"");e.dataset.active="0","cursor"===a&&"cursor"===i.ui.mode&&(e.dataset.active="1"),"pen"===a&&"pen"===i.ui.mode&&(e.dataset.active="1"),"eraser"===a&&"eraser"===i.ui.mode&&(e.dataset.active="1"),"toggle"===a&&(e.dataset.active=i.ui.visible?"1":"0",e.innerHTML=w(!!i.ui.visible)),"undo"===a?e.disabled=n||0===t.items.length:"redo"===a?e.disabled=n||0===t.redo.length:"pen"===a||"eraser"===a?e.disabled=n:e.disabled=!1}),a){a.querySelectorAll(".lia-annot-color-item").forEach(function(e){let t=String(e.getAttribute("data-color")||"");e.dataset.active=t===String(i.ui.color||"")?"1":"0",e.disabled=n});let e=a.querySelector('.lia-annot-danger[data-act="clear"]');e&&(e.disabled=n||0===t.items.length);let r=a.querySelector('input[data-act="width"]'),o=a.querySelector('input[data-act="alpha"]'),l=a.querySelector('input[data-act="eraserWidth"]'),s=a.querySelector('[data-k="width"]'),d=a.querySelector('[data-k="alpha"]'),u=a.querySelector('[data-k="eraserWidth"]');r&&document.activeElement!==r&&(r.value=String(i.ui.width)),o&&document.activeElement!==o&&(o.value=String(i.ui.alpha)),l&&document.activeElement!==l&&(l.value=String(i.ui.eraserWidth)),s&&(s.textContent=String(i.ui.width)),d&&(d.textContent=Math.round(100*Number(i.ui.alpha||1))+"%"),u&&(u.textContent=String(i.ui.eraserWidth))}"eraser"===v()&&i.ui.visible&&!n&&r.lastPointer&&r.lastPointer.inside?x():g()}function k(){let e=_(),t=h();if(!e||!t)return;let n=s(),a=Math.ceil(e.getBoundingClientRect().width||e.offsetWidth||44),i=Math.round((t.closest(".lia-slide__container")||t.parentElement||t).getBoundingClientRect().left+8);i=Math.min(i=Math.max(8,i),Math.max(8,n-a-8)),e.style.left=i+"px"}function O(){try{r.resizeObserver&&r.resizeObserver.disconnect()}catch(e){}r.resizeObserver=null}function S(e,t){let n=function(e){if(!e)return null;let t=e.children||[];for(let e=0;e<t.length;e++){let n=t[e];if(n&&n.tagName&&"header"===n.tagName.toLowerCase())return n}return null}(e);if(n){n.nextSibling!==t&&(t.parentNode===e&&t.remove(),n.nextSibling?e.insertBefore(t,n.nextSibling):e.appendChild(t));return}e.firstChild!==t&&(t.parentNode===e&&t.remove(),e.firstChild?e.insertBefore(t,e.firstChild):e.appendChild(t))}function E(){let e=h(),t=d(),n=r.host!==e,a=r.slideKey!==t;if(r.shell&&r.shell.isConnected&&!n)S(e,r.shell),r.canvas=r.shell.querySelector(".lia-annot-canvas"),r.eraserRing=r.shell.querySelector(".lia-annot-eraser-ring");else{O(),r.host=e,r.slideKey=t,e.classList.add("lia-annot-host");let n=function(e,t){if(!e)return null;let n=e.children||[];for(let e=0;e<n.length;e++){let a=n[e];if(a.classList&&a.classList.contains(t))return a}return null}(e,"lia-annot-shell");n||((n=document.createElement("div")).className="lia-annot-shell",n.setAttribute("aria-hidden","true"));let a=n.querySelector(".lia-annot-canvas");a||((a=document.createElement("canvas")).className="lia-annot-canvas",a.setAttribute("aria-label","Annotation canvas"),n.appendChild(a));let d=n.querySelector(".lia-annot-eraser-ring");function l(e){let t,n=(t=r.canvas.getBoundingClientRect(),{x:o(e.clientX-t.left,0,r.cssW),y:o(e.clientY-t.top,0,r.cssH)});return r.lastPointer={x:n.x,y:n.y,inside:!0,pointerType:String(e.pointerType||"")},n}function s(e,t){if(r.drawing){e.preventDefault(),e.stopPropagation();try{r.canvas.releasePointerCapture(e.pointerId)}catch(e){}r.drawing=!1,r.activePath=null,R(),A()}if(t&&"mouse"===e.pointerType&&i.ui.visible&&!b()&&"eraser"===v()){let t=l(e);y(t.x,t.y)}else r.lastPointer.inside=!1,g()}if(d||((d=document.createElement("span")).className="lia-annot-eraser-ring",d.dataset.on="0",n.appendChild(d)),S(e,n),r.shell=n,r.canvas=a,r.eraserRing=d,r.ctx=r.canvas?r.canvas.getContext("2d",{willReadFrequently:!0}):null,r.canvas&&!r.canvas.__liaAnnotBound&&(r.canvas.__liaAnnotBound=!0,r.canvas.addEventListener("pointerdown",function(e){if("mouse"===e.pointerType&&0!==e.button)return;let t=l(e);if(!i.ui.visible||b())return void g();let n=v();if("eraser"===n?y(t.x,t.y):g(),"pen"!==n&&"eraser"!==n)return;e.preventDefault(),e.stopPropagation(),i.ui.panelOpen&&(i.ui.panelOpen=!1,A());let a=c(),o={kind:"path",tool:n,color:String(i.ui.color||"#ff0000"),width:"eraser"===n?Number(i.ui.eraserWidth||18):Number(i.ui.width||3),alpha:"eraser"===n?1:Number(i.ui.alpha||1),baseW:Math.max(1,r.cssW),points:[p(t.x,t.y)]};a.items.push(o),a.redo=[],r.activePath=o,r.drawing=!0;try{r.canvas.setPointerCapture(e.pointerId)}catch(e){}R(),A()},!0),r.canvas.addEventListener("pointermove",function(e){let t=l(e);!b()&&i.ui.visible&&"eraser"===v()?y(t.x,t.y):g(),r.drawing&&r.activePath&&(e.preventDefault(),e.stopPropagation(),function(e,t,n){if(!e||!Array.isArray(e.points))return;let a=p(t,n),i=e.points.length?e.points[e.points.length-1]:null;if(!(i&&.8>Math.hypot((a.x-i.x)*r.cssW,(a.y-i.y)*r.cssH)))e.points.push(a)}(r.activePath,t.x,t.y),R())},!0),r.canvas.addEventListener("pointerup",function(e){s(e,!0)},!0),r.canvas.addEventListener("pointercancel",function(e){s(e,!1)},!0),r.canvas.addEventListener("pointerleave",function(){r.lastPointer.inside=!1,g()},!0),r.canvas.addEventListener("contextmenu",function(e){e.preventDefault()},!0)),O(),r.host)try{r.resizeObserver=new ResizeObserver(function(){N()}),r.resizeObserver.observe(r.host)}catch(e){}}a&&(r.slideKey=t),M()}function M(){let e=Array.from(document.querySelectorAll(".lia-annot-shell")),t=v(),n=!!i.ui.visible;for(let t=0;t<e.length;t++){let a=e[t],i=a.querySelector(".lia-annot-canvas");a.dataset.mode="cursor",a.dataset.hidden=n?"0":"1",a.style.pointerEvents="none",a.style.display=n?"":"none",i&&(i.style.pointerEvents="none",i.style.touchAction="auto",i.style.cursor="default")}n&&r.shell&&r.canvas?(r.shell.style.display="",r.shell.dataset.hidden="0",r.shell.dataset.mode=t,r.shell.style.pointerEvents="none","pen"===t||"eraser"===t?(r.canvas.style.pointerEvents="auto",r.canvas.style.touchAction="none",r.canvas.style.cursor="crosshair"):(r.canvas.style.pointerEvents="none",r.canvas.style.touchAction="auto",r.canvas.style.cursor="default"),"eraser"===t?x():g()):g()}function N(){r.syncRAF||(r.syncRAF=requestAnimationFrame(function(){r.syncRAF=0,E(),function(){if(!r.host||!r.canvas||!r.ctx||!r.shell)return;r.dpr=window.devicePixelRatio||1;let e=r.host.getBoundingClientRect(),t=s(),n=Math.max(1,Math.ceil(Math.max(r.host.scrollHeight||0,r.host.clientHeight||0,e.height||0))),a=Math.round(-e.left);r.cssW=t,r.cssH=n,r.shell.style.left=a+"px",r.shell.style.top="0px",r.shell.style.width=t+"px",r.shell.style.height=n+"px",r.canvas.style.width=t+"px",r.canvas.style.height=n+"px";let i=Math.max(1,Math.round(t*r.dpr)),o=Math.max(1,Math.round(n*r.dpr));r.canvas.width!==i&&(r.canvas.width=i),r.canvas.height!==o&&(r.canvas.height=o),x()}(),k(),R()}))}function R(){r.redrawRAF||(r.redrawRAF=requestAnimationFrame(function(){r.redrawRAF=0,function(){if(!r.canvas||!r.ctx)return;let e=r.ctx;if(e.setTransform(r.dpr,0,0,r.dpr,0,0),e.clearRect(0,0,r.cssW,r.cssH),!i.ui.visible)return;let t=u(r.slideKey||d());for(let n=0;n<t.items.length;n++)!function(e,t){var n,a,i;let l;if(!t||"path"!==t.kind||!Array.isArray(t.points)||0===t.points.length)return;let s="eraser"===t.tool,d=(l=Math.max(1,Number(t&&t.baseW)||r.cssW||1),Math.max(.75,Math.max(1,r.cssW||1)/l*Math.max(.75,Number(t&&t.width)||1))),u=o(Number(t.alpha||1),.05,1),c=String(t.color||"#000");if(1===t.points.length){let r=f(t.points[0]);n=r.x,a=r.y,i=d/2,e.save(),e.globalCompositeOperation=s?"destination-out":"source-over",e.globalAlpha=s?1:o(Number(u||1),.05,1),e.beginPath(),e.arc(n,a,Math.max(.5,i),0,2*Math.PI),e.fillStyle=s?"#000":String(c||"#000"),e.fill(),e.restore();return}e.save(),e.globalCompositeOperation=s?"destination-out":"source-over",e.globalAlpha=s?1:u,e.lineCap="round",e.lineJoin="round",e.lineWidth=d,e.strokeStyle=s?"#000":c,e.beginPath();let p=f(t.points[0]);e.moveTo(p.x,p.y);for(let n=1;n<t.points.length;n++){let a=f(t.points[n]);e.lineTo(a.x,a.y)}e.stroke(),e.restore()}(e,t.items[n])}(),A()}))}function P(){let e=c();e.items=[],e.redo=[],R(),A()}function C(e){let t=Number(e);return isFinite(t)?Math.round(1e4*t)/1e4:null}function T(e){if(!e||"object"!=typeof e)return null;let t=C(e.x),n=C(e.y);return null===t||null===n?null:{x:t,y:n}}function L(e){if(!e||"object"!=typeof e||"path"!==e.kind)return null;let t=Array.isArray(e.points)?e.points.map(T).filter(e=>null!==e):[];if(!t.length)return null;let n="eraser"===e.tool?"eraser":"pen",a=C(e.width),i=C(null==e.alpha?1:e.alpha),r=C(e.baseW);return{kind:"path",tool:n,color:String(e.color||"#ff0000"),width:null===a?1:a,alpha:null===i?1:i,baseW:null===r?1:r,points:t}}function W(e){let t={};if(!e||"object"!=typeof e)return t;for(let n in e){if(!Object.prototype.hasOwnProperty.call(e,n))continue;let a=e[n];if(!a||"object"!=typeof a)continue;let i=Array.isArray(a.items)?a.items.map(L).filter(e=>null!==e):[];i.length&&(t[String(n)]={items:i,redo:[]})}return t}function j(){let e=W(i.slides);for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!0;return!1}function q(){return l({version:"lia-annotation-v8",ui:{visible:!!i.ui.visible},slides:i.slides})}function z(){return l({version:"lia-annotation-freeze-v1",ui:{visible:!!i.ui.visible},slides:W(i.slides)})}function F(e,t){let n=!1!==(t&&"object"==typeof t?t:{}).replace;if(!e||"object"!=typeof e)return!1;if(n&&(i.slides={}),e.slides&&"object"==typeof e.slides){let t=e.slides;for(let e in t){if(!Object.prototype.hasOwnProperty.call(t,e))continue;let n=t[e];n&&"object"==typeof n&&(i.slides[e]={items:Array.isArray(n.items)?l(n.items):[],redo:Array.isArray(n.redo)?l(n.redo):[]})}}if(e.ui&&"object"==typeof e.ui){let t=e.ui;"boolean"==typeof t.visible&&(i.ui.visible=t.visible)}return u(d()),E(),M(),N(),R(),A(),!0}function I(e,t){let n=!1!==(t&&"object"==typeof t?t:{}).replace;if(!e||"object"!=typeof e)return!1;n&&(i.slides={});let a=W(e.slides);for(let e in a)Object.prototype.hasOwnProperty.call(a,e)&&(i.slides[e]={items:l(a[e].items)||[],redo:[]});if(e.ui&&"object"==typeof e.ui){let t=e.ui;"boolean"==typeof t.visible&&(i.ui.visible=t.visible)}return u(d()),E(),M(),N(),R(),A(),!0}function H(e){i.ui.visible=!!e,M(),R(),A()}window.__LIA_ANNOTATION__={exportState:q,exportFreezeState:z,importState:F,importFreezeState:I,hasFreezeData:j,setVisible:H,toggleVisible:()=>H(!i.ui.visible),setReadOnly:function(e){i.ui.forcedReadOnly=null===e?null:!!e,M(),A()},clearSlide:P,clearAllSlides:function(){i.slides={},u(d()),R(),A()},refresh:function(){E(),N(),A()},getStore:function(){return l(i)},getSlideKey:function(){return d()}},window.__LIA_ANNOTATION_EXPORT__=function(){return q()},window.__LIA_ANNOTATION_IMPORT__=function(e,t){return F(e,t)},window.__LIA_ANNOTATION_FREEZE_EXPORT__=function(){return z()},window.__LIA_ANNOTATION_FREEZE_IMPORT__=function(e,t){return I(e,t)},window.__LIA_ANNOTATION_FREEZE_HAS_DATA__=function(){return j()},window.addEventListener("resize",function(){m(),_(),N()}),window.addEventListener("hashchange",function(){u(d()),E(),A(),setTimeout(function(){E(),N()},40),setTimeout(function(){E(),N()},180),setTimeout(function(){E(),N()},500)}),window.addEventListener("scroll",function(){N()},!0),document.addEventListener("input",function(){N()},!0),document.addEventListener("change",function(){N()},!0);let B=new MutationObserver(function(){m(),A(),R()});try{B.observe(document.documentElement,{attributes:!0,attributeFilter:["class","style"]})}catch(e){}!function(){if(document.getElementById("__lia_annotation_css_v8"))return;let e=document.createElement("style");e.id="__lia_annotation_css_v8",e.textContent=`
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
    `,(document.head||document.documentElement).appendChild(e)}(),m(),_(),u(d()),E(),k(),A(),setTimeout(function(){E(),N()},0),setTimeout(function(){E(),N()},80),setTimeout(function(){E(),N()},250),setTimeout(function(){E(),N()},700)}()},{}]},["8RSWf"],"8RSWf","parcelRequire23ca",{});
//# sourceMappingURL=index.js.map
