// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"OJYiz":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "4a236f9275d0a351";
module.bundle.HMR_BUNDLE_ID = "8a46d31f808dd44c";
"use strict";
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F() {
            };
            return {
                s: F,
                n: function n() {
                    if (i >= o.length) return {
                        done: true
                    };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = o[Symbol.iterator]();
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally{
                if (didErr) throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
            this._acceptCallbacks.push(fn || function() {
            });
        },
        dispose: function dispose(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/'); // $FlowFixMe
    ws.onmessage = function(event) {
        checkedAssets = {
        };
        acceptedAssets = {
        };
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            var assets = data.assets.filter(function(asset) {
                return asset.envHash === HMR_ENV_HASH;
            }); // Handle HMR Update
            var handled = assets.every(function(asset) {
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            var _iterator = _createForOfIteratorHelper(data.diagnostics.ansi), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    var ansiDiagnostic = _step.value;
                    var stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                    console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
                }
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    var _iterator2 = _createForOfIteratorHelper(diagnostics), _step2;
    try {
        for(_iterator2.s(); !(_step2 = _iterator2.n()).done;){
            var diagnostic = _step2.value;
            var stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
            errorHTML += "\n      <div>\n        <div style=\"font-size: 18px; font-weight: bold; margin-top: 20px;\">\n          \uD83D\uDEA8 ".concat(diagnostic.message, "\n        </div>\n        <pre>").concat(stack, "</pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                return '<div>💡 ' + hint + '</div>';
            }).join(''), "\n        </div>\n        ").concat(diagnostic.documentation ? "<div>\uD83D\uDCDD <a style=\"color: violet\" href=\"".concat(diagnostic.documentation, "\" target=\"_blank\">Learn more</a></div>") : '', "\n      </div>\n    ");
        }
    } catch (err) {
        _iterator2.e(err);
    } finally{
        _iterator2.f();
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            var fn = new Function('require', 'module', 'exports', asset.output);
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) return true;
    var parents = getParents(module.bundle.root, id); // If no parents, the asset is new. Prevent reloading the page.
    if (!parents.length) return true;
    return parents.some(function(v) {
        return hmrAcceptCheck(v[0], v[1], null);
    });
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {
    };
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"cHk2S":[function(require,module,exports) {
var _jsxRuntime = require("@stickts/stick/jsx-runtime");
var _stick = require("@stickts/stick");
var _directives = require("@stickts/stick/directives");
var _o = require("@stickts/stick/o");
const VectorView = _stick.element('x-vector', (props)=>{
    return(/*#__PURE__*/ _jsxRuntime.jsxs("span", {
        title: props.x,
        __source: {
            fileName: "index.tsx",
            lineNumber: 6,
            columnNumber: 10
        },
        __self: undefined,
        children: [
            "(",
            props.x,
            ", ",
            props.y,
            ")"
        ]
    }));
});
const TestElement = _stick.element('x-update-perf', (props)=>{
    // const timer = createTimer()
    const mouseMove = _o.throttleToFrame(_o.fromEvent(document, 'mousemove'));
    const body = [];
    for(let i = 0; i < props.rows; i += 1)for(let j = 0; j < props.cols; j += 1){
        const x = _o.pipe(mouseMove, _o.map((event)=>event.pageX * i
        ));
        const y = _o.pipe(mouseMove, _o.map((event)=>event.pageY * j
        ));
        // const value = timer.map((time) => time * i * j)
        const style = `
        position: absolute;
        contain: strict;
        isolation: isolate;
        pointer-events: none;
        top: 0;
        left: 0;
        width: 100px;
        height: 30px;
        transform: translate(${j * 100}px, ${i * 30}px);
        overflow: hidden;
        white-space: nowrap;
      `;
        body.push(/*#__PURE__*/ _jsxRuntime.jsx("div", {
            style: style,
            __source: {
                fileName: "index.tsx",
                lineNumber: 34,
                columnNumber: 17
            },
            __self: undefined,
            children: /*#__PURE__*/ _jsxRuntime.jsx(VectorView, {
                x: x,
                y: y,
                __source: {
                    fileName: "index.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                },
                __self: undefined
            })
        }));
    }
    return(/*#__PURE__*/ _jsxRuntime.jsx("div", {
        style: "position: relative; font-family: monospace",
        __source: {
            fileName: "index.tsx",
            lineNumber: 40,
            columnNumber: 10
        },
        __self: undefined,
        children: body
    }));
});
const Counter = _stick.element('x-counter', (props)=>{
    const inc$ = _stick.eventSource(()=>1
    );
    const dec$ = _stick.eventSource(()=>-1
    );
    const count = _o.pipe(_o.merge(_o.fromArray([
        0
    ]), inc$, dec$), _o.scan((counter, change)=>counter + change
    , props.init), _o.broadcast);
    const isEven = _o.pipe(count, _o.map((value)=>value % 2 === 0
    ));
    return(/*#__PURE__*/ _jsxRuntime.jsxs(_jsxRuntime.Fragment, {
        children: [
            "Count ",
            /*#__PURE__*/ _jsxRuntime.jsx("button", {
                onClick: inc$,
                __source: {
                    fileName: "index.tsx",
                    lineNumber: 59,
                    columnNumber: 11
                },
                __self: undefined,
                children: "inc"
            }),
            " ",
            /*#__PURE__*/ _jsxRuntime.jsx("button", {
                onClick: dec$,
                __source: {
                    fileName: "index.tsx",
                    lineNumber: 59,
                    columnNumber: 47
                },
                __self: undefined,
                children: "dec"
            }),
            ": ",
            count,
            _directives.match(isEven, (value)=>{
                if (value) return(/*#__PURE__*/ _jsxRuntime.jsx("h1", {
                    __source: {
                        fileName: "index.tsx",
                        lineNumber: 62,
                        columnNumber: 16
                    },
                    __self: undefined,
                    children: "Even"
                }));
                else return(/*#__PURE__*/ _jsxRuntime.jsx("h3", {
                    __source: {
                        fileName: "index.tsx",
                        lineNumber: 64,
                        columnNumber: 16
                    },
                    __self: undefined,
                    children: "Odd"
                }));
            })
        ]
    }));
});
_stick.element('x-app', ()=>{
    return(/*#__PURE__*/ _jsxRuntime.jsxs(_jsxRuntime.Fragment, {
        children: [
            /*#__PURE__*/ _jsxRuntime.jsx("h1", {
                __source: {
                    fileName: "index.tsx",
                    lineNumber: 72,
                    columnNumber: 5
                },
                __self: undefined,
                children: "Testbed"
            }),
            /*#__PURE__*/ _jsxRuntime.jsx(Counter, {
                init: 9000,
                __source: {
                    fileName: "index.tsx",
                    lineNumber: 73,
                    columnNumber: 5
                },
                __self: undefined
            }),
            /*#__PURE__*/ _jsxRuntime.jsx(TestElement, {
                cols: 10,
                rows: 100,
                __source: {
                    fileName: "index.tsx",
                    lineNumber: 74,
                    columnNumber: 5
                },
                __self: undefined
            })
        ]
    }));
});

},{"@stickts/stick/jsx-runtime":"dJV0R","@stickts/stick":"5UJRe","@stickts/stick/directives":"dlYsP","@stickts/stick/o":"jTSbJ"}],"dJV0R":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "jsx", ()=>jsx
);
parcelHelpers.export(exports, "jsxs", ()=>jsxs
);
parcelHelpers.export(exports, "Fragment", ()=>_definitions.Fragment
);
var _definitions = require("./definitions");
var _dom = require("./dom");
var _eventSource = require("./eventSource");
var _o = require("./o");
var _util = require("./util");
const eventHandlerKey = /^on[A-Z]/;
const bindEventHandler = (element, key, handler)=>{
    const eventType = _util.camelToKebab(key.slice(2));
    return ()=>_dom.on(element, eventType, _eventSource.isEventSource(handler) ? handler.dispatchEvent : handler)
    ;
};
const bindProp = (element, key, value, meta)=>{
    const needsReflect = !meta || key in meta.reflect;
    let mount;
    if (needsReflect) {
        if (_o.isObservable(value)) mount = ()=>value((nextValue)=>_dom.setAttr(element, key, nextValue)
            )
        ;
        else _dom.setAttr(element, key, value);
    }
    if (meta) {
        // @ts-expect-error
        if (!element.props) element.props = {
        };
        // @ts-expect-error
        // We don't know what element we actually dealing with here
        // All the typechecking will happen in the template
        element.props[key] = value;
    }
    return mount;
};
const createRoot = (tag)=>{
    if (tag === _definitions.Fragment) return _dom.createFragment();
    return _dom.createElement(typeof tag === 'string' ? tag : tag[_definitions.stickKey].tagName);
};
const jsx = (tag, props)=>{
    const element = createRoot(tag);
    const { children , ...properties } = props;
    const mountFns = [];
    for (const [key, value1] of Object.entries(properties)){
        if (key.startsWith('_')) continue;
        else if (eventHandlerKey.test(key)) mountFns.push(bindEventHandler(element, key, value1));
        else bindProp(element, key, value1, Reflect.get(element, _definitions.stickKey));
    }
    if (children) {
        const c = Array.isArray(children) && !_definitions.isRenderResult(children) ? children : [
            children
        ];
        for (const child of c){
            let childElement = null;
            if (_definitions.isRenderResult(child)) {
                const [rootElement, mount] = child;
                childElement = rootElement;
                if (mount) mountFns.push(mount);
            } else if (_o.isObservable(child)) {
                const textNode = _dom.createTextNode('');
                mountFns.push(()=>child((value)=>{
                        textNode.data = _util.toString(value);
                    })
                );
                childElement = textNode;
            } else childElement = _dom.createTextNode(_util.toString(child));
            if (childElement) element.append(childElement);
        }
    }
    return _definitions.renderResult(element, ()=>{
        const unmountFns = mountFns.map((init)=>init()
        );
        return ()=>unmountFns.forEach((unmount)=>unmount()
            )
        ;
    });
};
const jsxs = jsx;

},{"./definitions":"ls1LZ","./dom":"h52FF","./eventSource":"9bIIf","./o":"jTSbJ","./util":"hJ9AG","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"ls1LZ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "stickKey", ()=>stickKey
);
parcelHelpers.export(exports, "renderResult", ()=>renderResult
);
parcelHelpers.export(exports, "isRenderResult", ()=>isRenderResult
);
parcelHelpers.export(exports, "Fragment", ()=>Fragment
);
var _util = require("./util");
const stickKey = Symbol('Stick');
const [renderResult, isRenderResult] = _util.tuple();
const Fragment = Symbol('Fragment');

},{"./util":"hJ9AG","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"hJ9AG":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createTag", ()=>createTag
);
parcelHelpers.export(exports, "tuple", ()=>tuple
);
parcelHelpers.export(exports, "toString", ()=>toString
);
parcelHelpers.export(exports, "camelToKebab", ()=>camelToKebab
);
parcelHelpers.export(exports, "noop", ()=>noop
);
parcelHelpers.export(exports, "identity", ()=>identity
);
function createTag(description) {
    const tags = new WeakSet();
    return [
        function tag(obj) {
            tags.add(obj);
            return obj;
        },
        function isTagged(obj) {
            return tags.has(obj);
        }
    ];
}
function tuple(description) {
    const [tag, isTagged] = createTag(description);
    return [
        function create(...items) {
            tag(items);
            return items;
        },
        isTagged
    ];
}
function toString(value) {
    return typeof value === 'string' ? value : value.toString();
}
const re = /([a-z0-9])([A-Z])/g;
function camelToKebab(value) {
    return value[0].toLowerCase() + value.slice(1).replace(re, (match, tail, head)=>`${tail}-${head.toLowerCase()}`
    );
}
const noop = (...args)=>{
};
const identity = (input)=>input
;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"ciiiV":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"h52FF":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createElement", ()=>createElement
);
parcelHelpers.export(exports, "createTextNode", ()=>createTextNode
);
parcelHelpers.export(exports, "createComment", ()=>createComment
);
parcelHelpers.export(exports, "createFragment", ()=>createFragment
);
parcelHelpers.export(exports, "createContainer", ()=>createContainer
);
parcelHelpers.export(exports, "on", ()=>on
);
parcelHelpers.export(exports, "setAttr", ()=>setAttr
);
parcelHelpers.export(exports, "appendChild", ()=>appendChild
);
var _util = require("./util");
const createElement = (tagName)=>document.createElement(tagName)
;
const createTextNode = (text)=>document.createTextNode(text)
;
const createComment = (comment = '')=>document.createComment(comment)
;
const createFragment = ()=>document.createDocumentFragment()
;
const CONTAINER_TAG = 's-container';
customElements.define(CONTAINER_TAG, class extends HTMLElement {
    constructor(){
        super();
        this.style.display = 'contents';
    }
});
const createContainer = ()=>createElement(CONTAINER_TAG)
;
const on = (target, eventType, handler, options)=>{
    target.addEventListener(eventType, handler, options);
    return ()=>target.removeEventListener(eventType, handler, options)
    ;
};
const setAttr = (target, key, value)=>{
    if (typeof value === 'boolean') target.toggleAttribute(key, value);
    else target.setAttribute(key, _util.toString(value));
};
const appendChild = (target, child)=>target.appendChild(child)
;

},{"./util":"hJ9AG","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"9bIIf":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "tagEventSource", ()=>tagEventSource
);
parcelHelpers.export(exports, "isEventSource", ()=>isEventSource
);
parcelHelpers.export(exports, "eventSource", ()=>eventSource1
);
var _observable = require("./o/observable");
var _util = require("./util");
const [tagEventSource, isEventSource] = _util.createTag();
function eventSource1(map) {
    const [observe, next] = _observable.observable();
    const eventSource = observe;
    eventSource.dispatchEvent = map ? (event)=>next(map(event))
     : next;
    return tagEventSource(eventSource);
}

},{"./o/observable":"2KZI5","./util":"hJ9AG","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"2KZI5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "tagObservable", ()=>tagObservable
);
parcelHelpers.export(exports, "isObservable", ()=>isObservable
);
parcelHelpers.export(exports, "observable", ()=>observable
);
var _util = require("../util");
const [tagObservable, isObservable] = _util.createTag();
function observable() {
    let observer;
    return [
        tagObservable((newObserver)=>{
            if (observer) throw new Error('No dice!');
            observer = newObserver;
            return ()=>{
                if (!observer) throw new Error('You fool!');
                observer = undefined;
            };
        }),
        (value)=>{
            if (observer) observer(value);
        }
    ];
}

},{"../util":"hJ9AG","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"jTSbJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "observable", ()=>_observable.observable
);
parcelHelpers.export(exports, "isObservable", ()=>_observable.isObservable
);
parcelHelpers.export(exports, "fromArray", ()=>_sources.fromArray
);
parcelHelpers.export(exports, "fromEvent", ()=>_sources.fromEvent
);
parcelHelpers.export(exports, "broadcast", ()=>_sources.broadcast
);
parcelHelpers.export(exports, "merge", ()=>_sources.merge
);
parcelHelpers.export(exports, "pipe", ()=>_pipe.pipe
);
parcelHelpers.export(exports, "map", ()=>_operators.map
);
parcelHelpers.export(exports, "filter", ()=>_operators.filter
);
parcelHelpers.export(exports, "scan", ()=>_operators.scan
);
parcelHelpers.export(exports, "throttleToFrame", ()=>_operators.throttleToFrame
);
var _observable = require("./observable");
var _sources = require("./sources");
var _pipe = require("./pipe");
var _operators = require("./operators");

},{"./observable":"2KZI5","./sources":"fq52V","./pipe":"1U5gu","./operators":"lnbtM","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"fq52V":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "fromArray", ()=>fromArray
);
parcelHelpers.export(exports, "fromEvent", ()=>fromEvent
);
parcelHelpers.export(exports, "broadcast", ()=>broadcast
);
parcelHelpers.export(exports, "merge", ()=>merge
);
var _dom = require("../dom");
var _observable = require("./observable");
function fromArray(items) {
    return _observable.tagObservable((notify)=>{
        // eslint-disable-next-line prefer-const
        for(let i = 0, len = items.length; i < len; i += 1)notify(items[i]);
        return ()=>{
        };
    });
}
function fromEvent(target, eventType, options = {
}) {
    return _observable.tagObservable((notify)=>{
        const listener = notify;
        return _dom.on(target, eventType, listener, options);
    });
}
function broadcast(input) {
    const observers = new Set();
    let forget;
    return _observable.tagObservable((notify1)=>{
        if (observers.size === 0) forget = input((value)=>observers.forEach((notify)=>notify(value)
            )
        );
        observers.add(notify1);
        return ()=>{
            observers.delete(notify1);
            if (observers.size === 0) forget();
        };
    });
}
function merge(...inputs) {
    return _observable.tagObservable((notify)=>{
        const forgetFns = inputs.map((observe)=>observe(notify)
        );
        return ()=>forgetFns.forEach((forget)=>forget()
            )
        ;
    });
}

},{"../dom":"h52FF","./observable":"2KZI5","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"1U5gu":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "pipe", ()=>pipe
);
function pipe(input, ...ops) {
    const len = ops.length;
    let result = input;
    for(let i = 0; i < len; i += 1)result = ops[i](result);
    return result;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"lnbtM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "throttleToFrame", ()=>throttleToFrame
);
parcelHelpers.export(exports, "map", ()=>map
);
parcelHelpers.export(exports, "scan", ()=>scan
);
parcelHelpers.export(exports, "filter", ()=>filter
);
var _observable = require("./observable");
function throttleToFrame(input) {
    const nextFrameTasks = [];
    function handleTasks() {
        for(let i = 0, len = nextFrameTasks.length; i < len; i += 1)nextFrameTasks[i]();
        nextFrameTasks.length = 0;
    }
    function addTask(task) {
        if (nextFrameTasks.length === 0) requestAnimationFrame(handleTasks);
        nextFrameTasks.push(task);
    }
    return _observable.tagObservable((notify)=>{
        let nextValue;
        let isScheduled = false;
        function handleNextFrame() {
            isScheduled = false;
            notify(nextValue);
        }
        return input((value)=>{
            nextValue = value;
            if (!isScheduled) {
                isScheduled = true;
                addTask(handleNextFrame);
            }
        });
    });
}
const map = (fn)=>(input)=>{
        return _observable.tagObservable((notify)=>{
            return input((value)=>notify(fn(value))
            );
        });
    }
;
const scan = (fn, init)=>(input)=>{
        return _observable.tagObservable((notify)=>{
            let memo = init;
            return input((value)=>{
                notify(memo = fn(memo, value));
            });
        });
    }
;
const filter = (fn)=>(input)=>{
        return _observable.tagObservable((notify)=>{
            return input((value)=>{
                if (fn(value)) notify(value);
            });
        });
    }
;

},{"./observable":"2KZI5","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"5UJRe":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "o", ()=>_o
);
var _o = require("./o");
var _element = require("./element");
parcelHelpers.exportAll(_element, exports);
var _eventSource = require("./eventSource");
parcelHelpers.exportAll(_eventSource, exports);

},{"./element":"foaVz","./o":"jTSbJ","./eventSource":"9bIIf","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"foaVz":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "element", ()=>element
);
var _definitions = require("./definitions");
var _dom = require("./dom");
function element(tagName, template, options = {
}) {
    const meta = {
        tagName,
        reflect: options.reflect || {
        }
    };
    customElements.define(tagName, class extends HTMLElement {
        [_definitions.stickKey] = meta;
        props;
        mount = false;
        unmount;
        connectedCallback() {
            if (!this.mount) {
                const [content, mount] = template(this.props);
                this.mount = mount || true;
                if (content) _dom.appendChild(this, content);
            }
            if (typeof this.mount === 'function') this.unmount = this.mount();
        }
        disconnectedCallback() {
            if (this.unmount) {
                this.unmount();
                this.unmount = undefined;
            }
        }
    });
    return Object.assign(template, {
        [_definitions.stickKey]: meta
    });
}

},{"./definitions":"ls1LZ","./dom":"h52FF","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"dlYsP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "match", ()=>match
);
var _definitions = require("./definitions");
var _dom = require("./dom");
const match = (observe, renderer)=>{
    const cache = new Map();
    let unmount;
    let currentElement = _dom.createContainer();
    return _definitions.renderResult(currentElement, ()=>{
        const forget = observe((value)=>{
            if (unmount) unmount();
            let next = cache.get(value);
            if (!next) {
                const [rootElement, mount] = renderer(value);
                let result;
                if (rootElement instanceof DocumentFragment) {
                    result = _dom.createContainer();
                    result.appendChild(rootElement);
                } else if (rootElement instanceof Node) result = rootElement;
                else result = _dom.createContainer();
                next = [
                    result,
                    mount
                ];
                cache.set(value, next);
            }
            const [element, mount] = next;
            console.log(element, value);
            currentElement.replaceWith(element);
            currentElement = element;
            if (mount) unmount = mount();
        });
        return ()=>{
            if (unmount) unmount();
            forget();
        };
    });
};

},{"./definitions":"ls1LZ","./dom":"h52FF","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}]},["OJYiz","cHk2S"], "cHk2S", "parcelRequire6524")

//# sourceMappingURL=index.808dd44c.js.map
