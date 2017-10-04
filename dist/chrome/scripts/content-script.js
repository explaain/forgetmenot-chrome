/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3);


/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _loglevel = __webpack_require__(4);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_loglevel2.default.setLevel('debug');
	
	var getPageText = function getPageText() {
	  return document.body.innerText;
	};
	var getUrl = function getUrl() {
	  return window.location.href;
	};
	var getBaseUrl = function getBaseUrl() {
	  return window.location.host.replace('www.', '');
	};
	var collectPageData = function collectPageData() {
	  var pageText = getPageText();
	  var url = getUrl();
	  var baseUrl = getBaseUrl();
	  return { url: url, baseUrl: baseUrl, pageText: pageText };
	};
	
	var pingDiv;
	var drawer = document.createElement("div");
	var iframe = document.createElement('iframe');
	
	// document.addEventListener("DOMContentLoaded", function(){ sendPageText(); }, false);
	
	window.onload = function (e) {
	  sendPageText();
	};
	
	var sendPageText = function sendPageText() {
	  _loglevel2.default.trace(sendPageText);
	  var pageText = getPageText();
	  var url = getUrl();
	  var baseUrl = getBaseUrl();
	  _loglevel2.default.trace([pageText]);
	  _loglevel2.default.debug(url);
	  chrome.runtime.sendMessage({ action: "checkPage", data: { url: url, baseUrl: baseUrl, pageText: pageText } }, function (response) {
	    _loglevel2.default.debug(response);
	    var numPings = response.pings.length;
	    _loglevel2.default.debug("numPings: ", numPings);
	    if (numPings && pingDiv != -1) {
	      var existingPings = document.getElementsByClassName('forget-me-not-ping');
	      while (existingPings.length > 0) {
	        _loglevel2.default.trace('Deleting existing ping');
	        existingPings[0].parentNode.removeChild(existingPings[0]);
	      }
	      if (pingDiv) pingDiv.remove();
	      pingDiv = document.createElement("div");
	      pingDiv.style.cssText = "" + "position: fixed;" + "top: 0;" + "right: 0;" + "width: 300px;" + "margin: 20px;" + "padding: 20px 35px;" + "font-size: 16px;" + "font-weight: normal;" + "color: #333;" + "box-shadow: rgba(50, 50, 50, 0.95) 0px 0px 30px;" + "border: none;" + "border-radius: 10px;" + "z-index: 1000000;" + "background: white;" + "cursor: pointer;" + "line-height: 1.4;" + "font-family: Arial, sans-serif;";
	      var pageFloat = document.createElement("div");
	      pageFloat.style.cssText = "" + "float: right;";
	      pageFloat.innerHTML = "👆👆";
	      pingDiv.appendChild(pageFloat);
	      var text1 = document.createTextNode((numPings == 1 ? "One memory" : numPings + " memories") + " relevant to this page! 😃");
	      text1.className = 'forget-me-not-ping';
	      pingDiv.appendChild(text1);
	      var pageSpan = document.createElement("span");
	      pageSpan.style.cssText = "" + "color: grey;" + "font-style: italic;" + "margin-left: 5px;";
	      pageSpan.innerHTML = "Click to view";
	      pingDiv.appendChild(pageSpan);
	      pingDiv.onclick = function (e) {
	        openDrawer(e);
	        pingDiv.remove();
	        pingDiv = -1;
	      };
	      document.body.appendChild(pingDiv);
	      _loglevel2.default.trace(pingDiv);
	    }
	  });
	};
	
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	  _loglevel2.default.trace('Request received');
	  if (request.action == "getPageData") {
	    _loglevel2.default.debug('1');
	    _loglevel2.default.trace('Received getPageData request');
	    var pageData = collectPageData();
	    _loglevel2.default.debug(pageData);
	    sendResponse(pageData);
	  }
	  if (request.event == "popupOpened") {
	    _loglevel2.default.trace('Received popupOpened event');
	    if (pingDiv) pingDiv.remove();
	  }
	  if (request.action == "toggleDrawer") {
	    _loglevel2.default.trace('Received toggleDrawer action');
	    toggleDrawer();
	  }
	});
	
	sendPageText();
	
	var createDrawer = function createDrawer() {
	  try {
	    drawer.style.cssText = "" + "position: fixed;" + "top: 0;" + "right: -400px;" + "height: 100%;" + "width: 400px;" + "z-index: 1000000000000000;" + "background: white;" + "box-shadow: rgba(0, 0, 0, 0.4) -1px 3px 50px 0px;" + "transition: all 0.6s ease 0s;";
	    drawer.setAttribute('data-opened', 'false');
	
	    iframe.src = chrome.runtime.getURL('../pages/popup.html');
	    iframe.id = 'forgetmenot-frame';
	    iframe.style.cssText = "" + "position: absolute;" + "top: 0;" + "height: 100%;" + "left: -100%;" + "width: 200%;" + "border: none;" + "pointer-events: none;";
	
	    var close = document.createElement('a');
	    close.style.cssText = "" + "position: absolute;" + "top: 6px;" + "left: 4px;" + "z-index: 2147483647;" + "font-size: 20px;" + "color: #999;" + "font-family: Arial;" + "border-radius: 6px;" + "padding: 0px 9px 2px;" + "cursor: pointer;" + "font-weight: bold;" + "pointer-events: all;";
	    close.appendChild(document.createTextNode('x'));
	
	    // Click Events
	    close.onclick = function (e) {
	      closeDrawer(e);
	    };
	    document.addEventListener('click', function (event) {
	      // log.info(pingDiv)
	      var isClickInside = drawer.contains(event.target) || pingDiv && pingDiv != -1 && pingDiv.contains(event.target);
	
	      if (!isClickInside) {
	        closeDrawer(event);
	      }
	    });
	
	    drawer.appendChild(close);
	    drawer.appendChild(iframe);
	    document.body.appendChild(drawer);
	    _loglevel2.default.info(drawer);
	  } catch (e) {
	    _loglevel2.default.error(e);
	  }
	};
	var displayPageResults = function displayPageResults() {
	  _loglevel2.default.info('Sending setLoading to frame');
	  window.frames['forgetmenot-frame'].contentWindow.postMessage({ action: 'setLoading' }, "*");
	  chrome.runtime.sendMessage({ action: "getPageResults", data: { pageData: collectPageData() } }, function (response) {
	    var message = { action: "updatePageResults", data: { pageResults: response } };
	    _loglevel2.default.info(message);
	    window.frames['forgetmenot-frame'].contentWindow.postMessage(message, "*");
	  });
	};
	var openDrawer = function openDrawer(e) {
	  // log.info(drawer.getAttribute('data-opened'))
	  if (drawer.getAttribute('data-opened') != 'true' && (!e || !e.dealtWith)) {
	    displayPageResults();
	    drawer.style.right = '0px';
	    drawer.style.boxShadow = "rgba(0, 0, 0, 0.4) -1px 3px 50px 0px";
	    iframe.style.pointerEvents = 'all';
	    drawer.setAttribute('data-opened', 'true');
	    _loglevel2.default.info(drawer.getAttribute('data-opened'));
	  }
	  if (e) e.dealtWith = true;
	};
	var closeDrawer = function closeDrawer(e) {
	  // log.info(drawer.getAttribute('data-opened'))
	  if (drawer.getAttribute('data-opened') == 'true' && (!e || !e.dealtWith)) {
	    drawer.style.right = '-' + drawer.style.width;
	    drawer.style.boxShadow = "none";
	    iframe.style.pointerEvents = 'none';
	    drawer.setAttribute('data-opened', 'false');
	  }
	  // log.info(drawer.getAttribute('data-opened'))
	  if (e) e.dealtWith = true;
	};
	var toggleDrawer = function toggleDrawer(e) {
	  if (drawer.getAttribute('data-opened') == 'true') {
	    closeDrawer(e);
	  } else {
	    openDrawer(e);
	  }
	};
	
	window.addEventListener('message', function (event) {
	  switch (event.data.action) {
	    case 'getPageResults':
	      _loglevel2.default.info(5);
	      displayPageResults();
	      break;
	    default:
	
	  }
	}, false);
	
	createDrawer();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/*
	* loglevel - https://github.com/pimterry/loglevel
	*
	* Copyright (c) 2013 Tim Perry
	* Licensed under the MIT license.
	*/
	(function (root, definition) {
	    "use strict";
	
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
	        module.exports = definition();
	    } else {
	        root.log = definition();
	    }
	})(undefined, function () {
	    "use strict";
	
	    // Slightly dubious tricks to cut down minimized file size
	
	    var noop = function noop() {};
	    var undefinedType = "undefined";
	
	    var logMethods = ["trace", "debug", "info", "warn", "error"];
	
	    // Cross-browser bind equivalent that works at least back to IE6
	    function bindMethod(obj, methodName) {
	        var method = obj[methodName];
	        if (typeof method.bind === 'function') {
	            return method.bind(obj);
	        } else {
	            try {
	                return Function.prototype.bind.call(method, obj);
	            } catch (e) {
	                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
	                return function () {
	                    return Function.prototype.apply.apply(method, [obj, arguments]);
	                };
	            }
	        }
	    }
	
	    // Build the best logging method possible for this env
	    // Wherever possible we want to bind, not wrap, to preserve stack traces
	    function realMethod(methodName) {
	        if (methodName === 'debug') {
	            methodName = 'log';
	        }
	
	        if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === undefinedType) {
	            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
	        } else if (console[methodName] !== undefined) {
	            return bindMethod(console, methodName);
	        } else if (console.log !== undefined) {
	            return bindMethod(console, 'log');
	        } else {
	            return noop;
	        }
	    }
	
	    // These private functions always need `this` to be set properly
	
	    function replaceLoggingMethods(level, loggerName) {
	        /*jshint validthis:true */
	        for (var i = 0; i < logMethods.length; i++) {
	            var methodName = logMethods[i];
	            this[methodName] = i < level ? noop : this.methodFactory(methodName, level, loggerName);
	        }
	
	        // Define log.log as an alias for log.debug
	        this.log = this.debug;
	    }
	
	    // In old IE versions, the console isn't present until you first open it.
	    // We build realMethod() replacements here that regenerate logging methods
	    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
	        return function () {
	            if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) !== undefinedType) {
	                replaceLoggingMethods.call(this, level, loggerName);
	                this[methodName].apply(this, arguments);
	            }
	        };
	    }
	
	    // By default, we use closely bound real methods wherever possible, and
	    // otherwise we wait for a console to appear, and then try again.
	    function defaultMethodFactory(methodName, level, loggerName) {
	        /*jshint validthis:true */
	        return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
	    }
	
	    function Logger(name, defaultLevel, factory) {
	        var self = this;
	        var currentLevel;
	        var storageKey = "loglevel";
	        if (name) {
	            storageKey += ":" + name;
	        }
	
	        function persistLevelIfPossible(levelNum) {
	            var levelName = (logMethods[levelNum] || 'silent').toUpperCase();
	
	            if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === undefinedType) return;
	
	            // Use localStorage if available
	            try {
	                window.localStorage[storageKey] = levelName;
	                return;
	            } catch (ignore) {}
	
	            // Use session cookie as fallback
	            try {
	                window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
	            } catch (ignore) {}
	        }
	
	        function getPersistedLevel() {
	            var storedLevel;
	
	            if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === undefinedType) return;
	
	            try {
	                storedLevel = window.localStorage[storageKey];
	            } catch (ignore) {}
	
	            // Fallback to cookies if local storage gives us nothing
	            if ((typeof storedLevel === 'undefined' ? 'undefined' : _typeof(storedLevel)) === undefinedType) {
	                try {
	                    var cookie = window.document.cookie;
	                    var location = cookie.indexOf(encodeURIComponent(storageKey) + "=");
	                    if (location) {
	                        storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
	                    }
	                } catch (ignore) {}
	            }
	
	            // If the stored level is not valid, treat it as if nothing was stored.
	            if (self.levels[storedLevel] === undefined) {
	                storedLevel = undefined;
	            }
	
	            return storedLevel;
	        }
	
	        /*
	         *
	         * Public logger API - see https://github.com/pimterry/loglevel for details
	         *
	         */
	
	        self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
	            "ERROR": 4, "SILENT": 5 };
	
	        self.methodFactory = factory || defaultMethodFactory;
	
	        self.getLevel = function () {
	            return currentLevel;
	        };
	
	        self.setLevel = function (level, persist) {
	            if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
	                level = self.levels[level.toUpperCase()];
	            }
	            if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
	                currentLevel = level;
	                if (persist !== false) {
	                    // defaults to true
	                    persistLevelIfPossible(level);
	                }
	                replaceLoggingMethods.call(self, level, name);
	                if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === undefinedType && level < self.levels.SILENT) {
	                    return "No console available for logging";
	                }
	            } else {
	                throw "log.setLevel() called with invalid level: " + level;
	            }
	        };
	
	        self.setDefaultLevel = function (level) {
	            if (!getPersistedLevel()) {
	                self.setLevel(level, false);
	            }
	        };
	
	        self.enableAll = function (persist) {
	            self.setLevel(self.levels.TRACE, persist);
	        };
	
	        self.disableAll = function (persist) {
	            self.setLevel(self.levels.SILENT, persist);
	        };
	
	        // Initialize with the right level
	        var initialLevel = getPersistedLevel();
	        if (initialLevel == null) {
	            initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
	        }
	        self.setLevel(initialLevel, false);
	    }
	
	    /*
	     *
	     * Top-level API
	     *
	     */
	
	    var defaultLogger = new Logger();
	
	    var _loggersByName = {};
	    defaultLogger.getLogger = function getLogger(name) {
	        if (typeof name !== "string" || name === "") {
	            throw new TypeError("You must supply a name when creating a logger.");
	        }
	
	        var logger = _loggersByName[name];
	        if (!logger) {
	            logger = _loggersByName[name] = new Logger(name, defaultLogger.getLevel(), defaultLogger.methodFactory);
	        }
	        return logger;
	    };
	
	    // Grab the current global log variable in case of overwrite
	    var _log = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== undefinedType ? window.log : undefined;
	    defaultLogger.noConflict = function () {
	        if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== undefinedType && window.log === defaultLogger) {
	            window.log = _log;
	        }
	
	        return defaultLogger;
	    };
	
	    return defaultLogger;
	});

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGU5ODcwZjQ2NWQwY2E2OGU3MjAiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvY29udGVudC1zY3JpcHQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiXSwibmFtZXMiOlsic2V0TGV2ZWwiLCJnZXRQYWdlVGV4dCIsImRvY3VtZW50IiwiYm9keSIsImlubmVyVGV4dCIsImdldFVybCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImdldEJhc2VVcmwiLCJob3N0IiwicmVwbGFjZSIsImNvbGxlY3RQYWdlRGF0YSIsInBhZ2VUZXh0IiwidXJsIiwiYmFzZVVybCIsInBpbmdEaXYiLCJkcmF3ZXIiLCJjcmVhdGVFbGVtZW50IiwiaWZyYW1lIiwib25sb2FkIiwiZSIsInNlbmRQYWdlVGV4dCIsInRyYWNlIiwiZGVidWciLCJjaHJvbWUiLCJydW50aW1lIiwic2VuZE1lc3NhZ2UiLCJhY3Rpb24iLCJkYXRhIiwicmVzcG9uc2UiLCJudW1QaW5ncyIsInBpbmdzIiwibGVuZ3RoIiwiZXhpc3RpbmdQaW5ncyIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJyZW1vdmUiLCJzdHlsZSIsImNzc1RleHQiLCJwYWdlRmxvYXQiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsInRleHQxIiwiY3JlYXRlVGV4dE5vZGUiLCJjbGFzc05hbWUiLCJwYWdlU3BhbiIsIm9uY2xpY2siLCJvcGVuRHJhd2VyIiwib25NZXNzYWdlIiwiYWRkTGlzdGVuZXIiLCJyZXF1ZXN0Iiwic2VuZGVyIiwic2VuZFJlc3BvbnNlIiwicGFnZURhdGEiLCJldmVudCIsInRvZ2dsZURyYXdlciIsImNyZWF0ZURyYXdlciIsInNldEF0dHJpYnV0ZSIsInNyYyIsImdldFVSTCIsImlkIiwiY2xvc2UiLCJjbG9zZURyYXdlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJpc0NsaWNrSW5zaWRlIiwiY29udGFpbnMiLCJ0YXJnZXQiLCJpbmZvIiwiZXJyb3IiLCJkaXNwbGF5UGFnZVJlc3VsdHMiLCJmcmFtZXMiLCJjb250ZW50V2luZG93IiwicG9zdE1lc3NhZ2UiLCJtZXNzYWdlIiwicGFnZVJlc3VsdHMiLCJnZXRBdHRyaWJ1dGUiLCJkZWFsdFdpdGgiLCJyaWdodCIsImJveFNoYWRvdyIsInBvaW50ZXJFdmVudHMiLCJ3aWR0aCIsInJvb3QiLCJkZWZpbml0aW9uIiwiZGVmaW5lIiwibW9kdWxlIiwiZXhwb3J0cyIsImxvZyIsIm5vb3AiLCJ1bmRlZmluZWRUeXBlIiwibG9nTWV0aG9kcyIsImJpbmRNZXRob2QiLCJvYmoiLCJtZXRob2ROYW1lIiwibWV0aG9kIiwiYmluZCIsIkZ1bmN0aW9uIiwicHJvdG90eXBlIiwiY2FsbCIsImFwcGx5IiwiYXJndW1lbnRzIiwicmVhbE1ldGhvZCIsImNvbnNvbGUiLCJ1bmRlZmluZWQiLCJyZXBsYWNlTG9nZ2luZ01ldGhvZHMiLCJsZXZlbCIsImxvZ2dlck5hbWUiLCJpIiwibWV0aG9kRmFjdG9yeSIsImVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMiLCJkZWZhdWx0TWV0aG9kRmFjdG9yeSIsIkxvZ2dlciIsIm5hbWUiLCJkZWZhdWx0TGV2ZWwiLCJmYWN0b3J5Iiwic2VsZiIsImN1cnJlbnRMZXZlbCIsInN0b3JhZ2VLZXkiLCJwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlIiwibGV2ZWxOdW0iLCJsZXZlbE5hbWUiLCJ0b1VwcGVyQ2FzZSIsImxvY2FsU3RvcmFnZSIsImlnbm9yZSIsImNvb2tpZSIsImVuY29kZVVSSUNvbXBvbmVudCIsImdldFBlcnNpc3RlZExldmVsIiwic3RvcmVkTGV2ZWwiLCJpbmRleE9mIiwiZXhlYyIsInNsaWNlIiwibGV2ZWxzIiwiZ2V0TGV2ZWwiLCJwZXJzaXN0IiwiU0lMRU5UIiwic2V0RGVmYXVsdExldmVsIiwiZW5hYmxlQWxsIiwiVFJBQ0UiLCJkaXNhYmxlQWxsIiwiaW5pdGlhbExldmVsIiwiZGVmYXVsdExvZ2dlciIsIl9sb2dnZXJzQnlOYW1lIiwiZ2V0TG9nZ2VyIiwiVHlwZUVycm9yIiwibG9nZ2VyIiwiX2xvZyIsIm5vQ29uZmxpY3QiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7Ozs7OztBQUNBLG9CQUFJQSxRQUFKLENBQWEsT0FBYjs7QUFFQSxLQUFNQyxjQUFjLFNBQWRBLFdBQWMsR0FBVztBQUM3QixVQUFPQyxTQUFTQyxJQUFULENBQWNDLFNBQXJCO0FBQ0QsRUFGRDtBQUdBLEtBQU1DLFNBQVMsU0FBVEEsTUFBUyxHQUFXO0FBQ3hCLFVBQU9DLE9BQU9DLFFBQVAsQ0FBZ0JDLElBQXZCO0FBQ0QsRUFGRDtBQUdBLEtBQU1DLGFBQWEsU0FBYkEsVUFBYSxHQUFXO0FBQzVCLFVBQU9ILE9BQU9DLFFBQVAsQ0FBZ0JHLElBQWhCLENBQXFCQyxPQUFyQixDQUE2QixNQUE3QixFQUFvQyxFQUFwQyxDQUFQO0FBQ0QsRUFGRDtBQUdBLEtBQU1DLGtCQUFrQixTQUFsQkEsZUFBa0IsR0FBVztBQUNqQyxPQUFNQyxXQUFXWixhQUFqQjtBQUNBLE9BQU1hLE1BQU1ULFFBQVo7QUFDQSxPQUFNVSxVQUFVTixZQUFoQjtBQUNBLFVBQU8sRUFBQ0ssS0FBS0EsR0FBTixFQUFXQyxTQUFTQSxPQUFwQixFQUE2QkYsVUFBVUEsUUFBdkMsRUFBUDtBQUNELEVBTEQ7O0FBUUEsS0FBSUcsT0FBSjtBQUNBLEtBQU1DLFNBQVNmLFNBQVNnQixhQUFULENBQXVCLEtBQXZCLENBQWY7QUFDQSxLQUFNQyxTQUFTakIsU0FBU2dCLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZjs7QUFFQTs7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Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZGU5ODcwZjQ2NWQwY2E2OGU3MjAiLCJpbXBvcnQgbG9nIGZyb20gJ2xvZ2xldmVsJztcbmxvZy5zZXRMZXZlbCgnZGVidWcnKVxuXG5jb25zdCBnZXRQYWdlVGV4dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZG9jdW1lbnQuYm9keS5pbm5lclRleHQ7XG59XG5jb25zdCBnZXRVcmwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xufVxuY29uc3QgZ2V0QmFzZVVybCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3QucmVwbGFjZSgnd3d3LicsJycpO1xufVxuY29uc3QgY29sbGVjdFBhZ2VEYXRhID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IHBhZ2VUZXh0ID0gZ2V0UGFnZVRleHQoKTtcbiAgY29uc3QgdXJsID0gZ2V0VXJsKCk7XG4gIGNvbnN0IGJhc2VVcmwgPSBnZXRCYXNlVXJsKCk7XG4gIHJldHVybiB7dXJsOiB1cmwsIGJhc2VVcmw6IGJhc2VVcmwsIHBhZ2VUZXh0OiBwYWdlVGV4dH1cbn1cblxuXG52YXIgcGluZ0RpdjtcbmNvbnN0IGRyYXdlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbmNvbnN0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpXG5cbi8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKCl7IHNlbmRQYWdlVGV4dCgpOyB9LCBmYWxzZSk7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbihlKXtcbiAgc2VuZFBhZ2VUZXh0KClcbn1cblxuY29uc3Qgc2VuZFBhZ2VUZXh0ID0gZnVuY3Rpb24oKSB7XG4gIGxvZy50cmFjZShzZW5kUGFnZVRleHQpO1xuICBjb25zdCBwYWdlVGV4dCA9IGdldFBhZ2VUZXh0KCk7XG4gIGNvbnN0IHVybCA9IGdldFVybCgpO1xuICBjb25zdCBiYXNlVXJsID0gZ2V0QmFzZVVybCgpO1xuICBsb2cudHJhY2UoW3BhZ2VUZXh0XSk7XG4gIGxvZy5kZWJ1Zyh1cmwpO1xuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7YWN0aW9uOiBcImNoZWNrUGFnZVwiLCBkYXRhOiB7dXJsOiB1cmwsIGJhc2VVcmw6IGJhc2VVcmwsIHBhZ2VUZXh0OiBwYWdlVGV4dH19LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIGxvZy5kZWJ1ZyhyZXNwb25zZSk7XG4gICAgY29uc3QgbnVtUGluZ3MgPSByZXNwb25zZS5waW5ncy5sZW5ndGhcbiAgICBsb2cuZGVidWcoXCJudW1QaW5nczogXCIsIG51bVBpbmdzKTtcbiAgICBpZiAobnVtUGluZ3MgJiYgcGluZ0RpdiAhPSAtMSkge1xuICAgICAgY29uc3QgZXhpc3RpbmdQaW5ncyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ZvcmdldC1tZS1ub3QtcGluZycpO1xuICAgICAgd2hpbGUoZXhpc3RpbmdQaW5ncy5sZW5ndGggPiAwKXtcbiAgICAgICAgbG9nLnRyYWNlKCdEZWxldGluZyBleGlzdGluZyBwaW5nJyk7XG4gICAgICAgIGV4aXN0aW5nUGluZ3NbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChleGlzdGluZ1BpbmdzWzBdKTtcbiAgICAgIH1cbiAgICAgIGlmIChwaW5nRGl2KSBwaW5nRGl2LnJlbW92ZSgpO1xuICAgICAgcGluZ0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgIHBpbmdEaXYuc3R5bGUuY3NzVGV4dCA9IFwiXCJcbiAgICAgICAgKyBcInBvc2l0aW9uOiBmaXhlZDtcIlxuICAgICAgICArIFwidG9wOiAwO1wiXG4gICAgICAgICsgXCJyaWdodDogMDtcIlxuICAgICAgICArIFwid2lkdGg6IDMwMHB4O1wiXG4gICAgICAgICsgXCJtYXJnaW46IDIwcHg7XCJcbiAgICAgICAgKyBcInBhZGRpbmc6IDIwcHggMzVweDtcIlxuICAgICAgICArIFwiZm9udC1zaXplOiAxNnB4O1wiXG4gICAgICAgICsgXCJmb250LXdlaWdodDogbm9ybWFsO1wiXG4gICAgICAgICsgXCJjb2xvcjogIzMzMztcIlxuICAgICAgICArIFwiYm94LXNoYWRvdzogcmdiYSg1MCwgNTAsIDUwLCAwLjk1KSAwcHggMHB4IDMwcHg7XCJcbiAgICAgICAgKyBcImJvcmRlcjogbm9uZTtcIlxuICAgICAgICArIFwiYm9yZGVyLXJhZGl1czogMTBweDtcIlxuICAgICAgICArIFwiei1pbmRleDogMTAwMDAwMDtcIlxuICAgICAgICArIFwiYmFja2dyb3VuZDogd2hpdGU7XCJcbiAgICAgICAgKyBcImN1cnNvcjogcG9pbnRlcjtcIlxuICAgICAgICArIFwibGluZS1oZWlnaHQ6IDEuNDtcIlxuICAgICAgICArIFwiZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmO1wiXG4gICAgICB2YXIgcGFnZUZsb2F0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIHBhZ2VGbG9hdC5zdHlsZS5jc3NUZXh0ID0gXCJcIlxuICAgICAgKyBcImZsb2F0OiByaWdodDtcIlxuICAgICAgcGFnZUZsb2F0LmlubmVySFRNTCA9IFwi8J+RhvCfkYZcIjtcbiAgICAgIHBpbmdEaXYuYXBwZW5kQ2hpbGQocGFnZUZsb2F0KVxuICAgICAgY29uc3QgdGV4dDEgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgobnVtUGluZ3M9PTEgPyBcIk9uZSBtZW1vcnlcIiA6IG51bVBpbmdzK1wiIG1lbW9yaWVzXCIpICsgXCIgcmVsZXZhbnQgdG8gdGhpcyBwYWdlISDwn5iDXCIpO1xuICAgICAgdGV4dDEuY2xhc3NOYW1lID0gJ2ZvcmdldC1tZS1ub3QtcGluZydcbiAgICAgIHBpbmdEaXYuYXBwZW5kQ2hpbGQodGV4dDEpXG4gICAgICB2YXIgcGFnZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIHBhZ2VTcGFuLnN0eWxlLmNzc1RleHQgPSBcIlwiXG4gICAgICAgICsgXCJjb2xvcjogZ3JleTtcIlxuICAgICAgICArIFwiZm9udC1zdHlsZTogaXRhbGljO1wiXG4gICAgICAgICsgXCJtYXJnaW4tbGVmdDogNXB4O1wiXG4gICAgICBwYWdlU3Bhbi5pbm5lckhUTUwgPSBcIkNsaWNrIHRvIHZpZXdcIjtcbiAgICAgIHBpbmdEaXYuYXBwZW5kQ2hpbGQocGFnZVNwYW4pXG4gICAgICBwaW5nRGl2Lm9uY2xpY2sgPSBmdW5jdGlvbihlKXtcbiAgICAgICAgb3BlbkRyYXdlcihlKTtcbiAgICAgICAgcGluZ0Rpdi5yZW1vdmUoKTtcbiAgICAgICAgcGluZ0RpdiA9IC0xXG4gICAgICB9O1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwaW5nRGl2KTtcbiAgICAgIGxvZy50cmFjZShwaW5nRGl2KTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2Upe1xuICBsb2cudHJhY2UoJ1JlcXVlc3QgcmVjZWl2ZWQnKTtcbiAgaWYocmVxdWVzdC5hY3Rpb24gPT0gXCJnZXRQYWdlRGF0YVwiKXtcbiAgICBsb2cuZGVidWcoJzEnKVxuICAgIGxvZy50cmFjZSgnUmVjZWl2ZWQgZ2V0UGFnZURhdGEgcmVxdWVzdCcpO1xuICAgIGNvbnN0IHBhZ2VEYXRhID0gY29sbGVjdFBhZ2VEYXRhKClcbiAgICBsb2cuZGVidWcocGFnZURhdGEpXG4gICAgc2VuZFJlc3BvbnNlKHBhZ2VEYXRhKVxuICB9XG4gIGlmKHJlcXVlc3QuZXZlbnQgPT0gXCJwb3B1cE9wZW5lZFwiKXtcbiAgICBsb2cudHJhY2UoJ1JlY2VpdmVkIHBvcHVwT3BlbmVkIGV2ZW50Jyk7XG4gICAgaWYgKHBpbmdEaXYpIHBpbmdEaXYucmVtb3ZlKCk7XG4gIH1cbiAgaWYocmVxdWVzdC5hY3Rpb24gPT0gXCJ0b2dnbGVEcmF3ZXJcIil7XG4gICAgbG9nLnRyYWNlKCdSZWNlaXZlZCB0b2dnbGVEcmF3ZXIgYWN0aW9uJyk7XG4gICAgdG9nZ2xlRHJhd2VyKClcbiAgfVxufSlcblxuc2VuZFBhZ2VUZXh0KCk7XG5cblxuXG5jb25zdCBjcmVhdGVEcmF3ZXIgPSBmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICBkcmF3ZXIuc3R5bGUuY3NzVGV4dCA9IFwiXCJcbiAgICAgICsgXCJwb3NpdGlvbjogZml4ZWQ7XCJcbiAgICAgICsgXCJ0b3A6IDA7XCJcbiAgICAgICsgXCJyaWdodDogLTQwMHB4O1wiXG4gICAgICArIFwiaGVpZ2h0OiAxMDAlO1wiXG4gICAgICArIFwid2lkdGg6IDQwMHB4O1wiXG4gICAgICArIFwiei1pbmRleDogMTAwMDAwMDAwMDAwMDAwMDtcIlxuICAgICAgKyBcImJhY2tncm91bmQ6IHdoaXRlO1wiXG4gICAgICArIFwiYm94LXNoYWRvdzogcmdiYSgwLCAwLCAwLCAwLjQpIC0xcHggM3B4IDUwcHggMHB4O1wiXG4gICAgICArIFwidHJhbnNpdGlvbjogYWxsIDAuNnMgZWFzZSAwcztcIlxuICAgIGRyYXdlci5zZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJywgJ2ZhbHNlJylcblxuICAgIGlmcmFtZS5zcmMgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoJy4uL3BhZ2VzL3BvcHVwLmh0bWwnKVxuICAgIGlmcmFtZS5pZCA9ICdmb3JnZXRtZW5vdC1mcmFtZSdcbiAgICBpZnJhbWUuc3R5bGUuY3NzVGV4dCA9IFwiXCJcbiAgICAgICsgXCJwb3NpdGlvbjogYWJzb2x1dGU7XCJcbiAgICAgICsgXCJ0b3A6IDA7XCJcbiAgICAgICsgXCJoZWlnaHQ6IDEwMCU7XCJcbiAgICAgICsgXCJsZWZ0OiAtMTAwJTtcIlxuICAgICAgKyBcIndpZHRoOiAyMDAlO1wiXG4gICAgICArIFwiYm9yZGVyOiBub25lO1wiXG4gICAgICArIFwicG9pbnRlci1ldmVudHM6IG5vbmU7XCJcblxuICAgIGNvbnN0IGNsb3NlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgY2xvc2Uuc3R5bGUuY3NzVGV4dCA9IFwiXCJcbiAgICAgICsgXCJwb3NpdGlvbjogYWJzb2x1dGU7XCJcbiAgICAgICsgXCJ0b3A6IDZweDtcIlxuICAgICAgKyBcImxlZnQ6IDRweDtcIlxuICAgICAgKyBcInotaW5kZXg6IDIxNDc0ODM2NDc7XCJcbiAgICAgICsgXCJmb250LXNpemU6IDIwcHg7XCJcbiAgICAgICsgXCJjb2xvcjogIzk5OTtcIlxuICAgICAgKyBcImZvbnQtZmFtaWx5OiBBcmlhbDtcIlxuICAgICAgKyBcImJvcmRlci1yYWRpdXM6IDZweDtcIlxuICAgICAgKyBcInBhZGRpbmc6IDBweCA5cHggMnB4O1wiXG4gICAgICArIFwiY3Vyc29yOiBwb2ludGVyO1wiXG4gICAgICArIFwiZm9udC13ZWlnaHQ6IGJvbGQ7XCJcbiAgICAgICsgXCJwb2ludGVyLWV2ZW50czogYWxsO1wiXG4gICAgY2xvc2UuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ3gnKSlcblxuICAgIC8vIENsaWNrIEV2ZW50c1xuICAgIGNsb3NlLm9uY2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGNsb3NlRHJhd2VyKGUpXG4gICAgfTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAvLyBsb2cuaW5mbyhwaW5nRGl2KVxuICAgICAgdmFyIGlzQ2xpY2tJbnNpZGUgPSBkcmF3ZXIuY29udGFpbnMoZXZlbnQudGFyZ2V0KSB8fCAocGluZ0RpdiAmJiBwaW5nRGl2ICE9IC0xICYmIHBpbmdEaXYuY29udGFpbnMoZXZlbnQudGFyZ2V0KSk7XG5cbiAgICAgIGlmICghaXNDbGlja0luc2lkZSkge1xuICAgICAgICBjbG9zZURyYXdlcihldmVudClcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRyYXdlci5hcHBlbmRDaGlsZChjbG9zZSk7XG4gICAgZHJhd2VyLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkcmF3ZXIpO1xuICAgIGxvZy5pbmZvKGRyYXdlcilcbiAgfSBjYXRjaChlKSB7XG4gICAgbG9nLmVycm9yKGUpXG4gIH1cbn1cbmNvbnN0IGRpc3BsYXlQYWdlUmVzdWx0cyA9IGZ1bmN0aW9uKCkge1xuICBsb2cuaW5mbygnU2VuZGluZyBzZXRMb2FkaW5nIHRvIGZyYW1lJylcbiAgd2luZG93LmZyYW1lc1snZm9yZ2V0bWVub3QtZnJhbWUnXS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKHthY3Rpb246ICdzZXRMb2FkaW5nJ30sIFwiKlwiKTtcbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2FjdGlvbjogXCJnZXRQYWdlUmVzdWx0c1wiLCBkYXRhOiB7cGFnZURhdGE6IGNvbGxlY3RQYWdlRGF0YSgpfX0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IHthY3Rpb246IFwidXBkYXRlUGFnZVJlc3VsdHNcIiwgZGF0YToge3BhZ2VSZXN1bHRzOiByZXNwb25zZX19XG4gICAgbG9nLmluZm8obWVzc2FnZSlcbiAgICB3aW5kb3cuZnJhbWVzWydmb3JnZXRtZW5vdC1mcmFtZSddLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UobWVzc2FnZSwgXCIqXCIpO1xuICB9KVxufVxuY29uc3Qgb3BlbkRyYXdlciA9IGZ1bmN0aW9uKGUpIHtcbiAgLy8gbG9nLmluZm8oZHJhd2VyLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuZWQnKSlcbiAgaWYgKGRyYXdlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJykgIT0gJ3RydWUnICYmICghZSB8fCAhZS5kZWFsdFdpdGgpKSB7XG4gICAgZGlzcGxheVBhZ2VSZXN1bHRzKClcbiAgICBkcmF3ZXIuc3R5bGUucmlnaHQgPSAnMHB4J1xuICAgIGRyYXdlci5zdHlsZS5ib3hTaGFkb3cgPSBcInJnYmEoMCwgMCwgMCwgMC40KSAtMXB4IDNweCA1MHB4IDBweFwiXG4gICAgaWZyYW1lLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYWxsJ1xuICAgIGRyYXdlci5zZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJywgJ3RydWUnKVxuICAgIGxvZy5pbmZvKGRyYXdlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJykpXG4gIH1cbiAgaWYgKGUpIGUuZGVhbHRXaXRoID0gdHJ1ZVxufVxuY29uc3QgY2xvc2VEcmF3ZXIgPSBmdW5jdGlvbihlKSB7XG4gIC8vIGxvZy5pbmZvKGRyYXdlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJykpXG4gIGlmIChkcmF3ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW5lZCcpID09ICd0cnVlJyAmJiAoIWUgfHwgIWUuZGVhbHRXaXRoKSkge1xuICAgIGRyYXdlci5zdHlsZS5yaWdodCA9ICctJyArIGRyYXdlci5zdHlsZS53aWR0aFxuICAgIGRyYXdlci5zdHlsZS5ib3hTaGFkb3cgPSBcIm5vbmVcIlxuICAgIGlmcmFtZS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnXG4gICAgZHJhd2VyLnNldEF0dHJpYnV0ZSgnZGF0YS1vcGVuZWQnLCAnZmFsc2UnKVxuICB9XG4gIC8vIGxvZy5pbmZvKGRyYXdlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJykpXG4gIGlmIChlKSBlLmRlYWx0V2l0aCA9IHRydWVcbn1cbmNvbnN0IHRvZ2dsZURyYXdlciA9IGZ1bmN0aW9uKGUpIHtcbiAgaWYgKGRyYXdlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJykgPT0gJ3RydWUnKSB7XG4gICAgY2xvc2VEcmF3ZXIoZSlcbiAgfSBlbHNlIHtcbiAgICBvcGVuRHJhd2VyKGUpXG4gIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICBzd2l0Y2ggKGV2ZW50LmRhdGEuYWN0aW9uKSB7XG4gICAgY2FzZSAnZ2V0UGFnZVJlc3VsdHMnOlxuICAgIGxvZy5pbmZvKDUpXG4gICAgICBkaXNwbGF5UGFnZVJlc3VsdHMoKVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcblxuICB9XG59LCBmYWxzZSk7XG5cbmNyZWF0ZURyYXdlcigpXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvc2NyaXB0cy9jb250ZW50LXNjcmlwdC5qcyIsIi8qXG4qIGxvZ2xldmVsIC0gaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsXG4qXG4qIENvcHlyaWdodCAoYykgMjAxMyBUaW0gUGVycnlcbiogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuKi9cbihmdW5jdGlvbiAocm9vdCwgZGVmaW5pdGlvbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5sb2cgPSBkZWZpbml0aW9uKCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvLyBTbGlnaHRseSBkdWJpb3VzIHRyaWNrcyB0byBjdXQgZG93biBtaW5pbWl6ZWQgZmlsZSBzaXplXG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcblxuICAgIHZhciBsb2dNZXRob2RzID0gW1xuICAgICAgICBcInRyYWNlXCIsXG4gICAgICAgIFwiZGVidWdcIixcbiAgICAgICAgXCJpbmZvXCIsXG4gICAgICAgIFwid2FyblwiLFxuICAgICAgICBcImVycm9yXCJcbiAgICBdO1xuXG4gICAgLy8gQ3Jvc3MtYnJvd3NlciBiaW5kIGVxdWl2YWxlbnQgdGhhdCB3b3JrcyBhdCBsZWFzdCBiYWNrIHRvIElFNlxuICAgIGZ1bmN0aW9uIGJpbmRNZXRob2Qob2JqLCBtZXRob2ROYW1lKSB7XG4gICAgICAgIHZhciBtZXRob2QgPSBvYmpbbWV0aG9kTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgbWV0aG9kLmJpbmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYmluZChvYmopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChtZXRob2QsIG9iaik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gTWlzc2luZyBiaW5kIHNoaW0gb3IgSUU4ICsgTW9kZXJuaXpyLCBmYWxsYmFjayB0byB3cmFwcGluZ1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5hcHBseShtZXRob2QsIFtvYmosIGFyZ3VtZW50c10pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCdWlsZCB0aGUgYmVzdCBsb2dnaW5nIG1ldGhvZCBwb3NzaWJsZSBmb3IgdGhpcyBlbnZcbiAgICAvLyBXaGVyZXZlciBwb3NzaWJsZSB3ZSB3YW50IHRvIGJpbmQsIG5vdCB3cmFwLCB0byBwcmVzZXJ2ZSBzdGFjayB0cmFjZXNcbiAgICBmdW5jdGlvbiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHtcbiAgICAgICAgaWYgKG1ldGhvZE5hbWUgPT09ICdkZWJ1ZycpIHtcbiAgICAgICAgICAgIG1ldGhvZE5hbWUgPSAnbG9nJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBObyBtZXRob2QgcG9zc2libGUsIGZvciBub3cgLSBmaXhlZCBsYXRlciBieSBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZVttZXRob2ROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCBtZXRob2ROYW1lKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlLmxvZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCAnbG9nJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbm9vcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZXNlIHByaXZhdGUgZnVuY3Rpb25zIGFsd2F5cyBuZWVkIGB0aGlzYCB0byBiZSBzZXQgcHJvcGVybHlcblxuICAgIGZ1bmN0aW9uIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvZ01ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gbG9nTWV0aG9kc1tpXTtcbiAgICAgICAgICAgIHRoaXNbbWV0aG9kTmFtZV0gPSAoaSA8IGxldmVsKSA/XG4gICAgICAgICAgICAgICAgbm9vcCA6XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlZmluZSBsb2cubG9nIGFzIGFuIGFsaWFzIGZvciBsb2cuZGVidWdcbiAgICAgICAgdGhpcy5sb2cgPSB0aGlzLmRlYnVnO1xuICAgIH1cblxuICAgIC8vIEluIG9sZCBJRSB2ZXJzaW9ucywgdGhlIGNvbnNvbGUgaXNuJ3QgcHJlc2VudCB1bnRpbCB5b3UgZmlyc3Qgb3BlbiBpdC5cbiAgICAvLyBXZSBidWlsZCByZWFsTWV0aG9kKCkgcmVwbGFjZW1lbnRzIGhlcmUgdGhhdCByZWdlbmVyYXRlIGxvZ2dpbmcgbWV0aG9kc1xuICAgIGZ1bmN0aW9uIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHRoaXMsIGxldmVsLCBsb2dnZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQnkgZGVmYXVsdCwgd2UgdXNlIGNsb3NlbHkgYm91bmQgcmVhbCBtZXRob2RzIHdoZXJldmVyIHBvc3NpYmxlLCBhbmRcbiAgICAvLyBvdGhlcndpc2Ugd2Ugd2FpdCBmb3IgYSBjb25zb2xlIHRvIGFwcGVhciwgYW5kIHRoZW4gdHJ5IGFnYWluLlxuICAgIGZ1bmN0aW9uIGRlZmF1bHRNZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIHJldHVybiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHx8XG4gICAgICAgICAgICAgICBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gTG9nZ2VyKG5hbWUsIGRlZmF1bHRMZXZlbCwgZmFjdG9yeSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIGN1cnJlbnRMZXZlbDtcbiAgICAgIHZhciBzdG9yYWdlS2V5ID0gXCJsb2dsZXZlbFwiO1xuICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgc3RvcmFnZUtleSArPSBcIjpcIiArIG5hbWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWxOdW0pIHtcbiAgICAgICAgICB2YXIgbGV2ZWxOYW1lID0gKGxvZ01ldGhvZHNbbGV2ZWxOdW1dIHx8ICdzaWxlbnQnKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09IHVuZGVmaW5lZFR5cGUpIHJldHVybjtcblxuICAgICAgICAgIC8vIFVzZSBsb2NhbFN0b3JhZ2UgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XSA9IGxldmVsTmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cblxuICAgICAgICAgIC8vIFVzZSBzZXNzaW9uIGNvb2tpZSBhcyBmYWxsYmFja1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgPVxuICAgICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdG9yYWdlS2V5KSArIFwiPVwiICsgbGV2ZWxOYW1lICsgXCI7XCI7XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRQZXJzaXN0ZWRMZXZlbCgpIHtcbiAgICAgICAgICB2YXIgc3RvcmVkTGV2ZWw7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gdW5kZWZpbmVkVHlwZSkgcmV0dXJuO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB3aW5kb3cubG9jYWxTdG9yYWdlW3N0b3JhZ2VLZXldO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cblxuICAgICAgICAgIC8vIEZhbGxiYWNrIHRvIGNvb2tpZXMgaWYgbG9jYWwgc3RvcmFnZSBnaXZlcyB1cyBub3RoaW5nXG4gICAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgdmFyIGNvb2tpZSA9IHdpbmRvdy5kb2N1bWVudC5jb29raWU7XG4gICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBjb29raWUuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RvcmFnZUtleSkgKyBcIj1cIik7XG4gICAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IC9eKFteO10rKS8uZXhlYyhjb29raWUuc2xpY2UobG9jYXRpb24pKVsxXTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoZSBzdG9yZWQgbGV2ZWwgaXMgbm90IHZhbGlkLCB0cmVhdCBpdCBhcyBpZiBub3RoaW5nIHdhcyBzdG9yZWQuXG4gICAgICAgICAgaWYgKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdG9yZWRMZXZlbDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqXG4gICAgICAgKiBQdWJsaWMgbG9nZ2VyIEFQSSAtIHNlZSBodHRwczovL2dpdGh1Yi5jb20vcGltdGVycnkvbG9nbGV2ZWwgZm9yIGRldGFpbHNcbiAgICAgICAqXG4gICAgICAgKi9cblxuICAgICAgc2VsZi5sZXZlbHMgPSB7IFwiVFJBQ0VcIjogMCwgXCJERUJVR1wiOiAxLCBcIklORk9cIjogMiwgXCJXQVJOXCI6IDMsXG4gICAgICAgICAgXCJFUlJPUlwiOiA0LCBcIlNJTEVOVFwiOiA1fTtcblxuICAgICAgc2VsZi5tZXRob2RGYWN0b3J5ID0gZmFjdG9yeSB8fCBkZWZhdWx0TWV0aG9kRmFjdG9yeTtcblxuICAgICAgc2VsZi5nZXRMZXZlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY3VycmVudExldmVsO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5zZXRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCwgcGVyc2lzdCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwic3RyaW5nXCIgJiYgc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXZlbCA9IHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcIm51bWJlclwiICYmIGxldmVsID49IDAgJiYgbGV2ZWwgPD0gc2VsZi5sZXZlbHMuU0lMRU5UKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRMZXZlbCA9IGxldmVsO1xuICAgICAgICAgICAgICBpZiAocGVyc2lzdCAhPT0gZmFsc2UpIHsgIC8vIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICAgICAgICAgIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHNlbGYsIGxldmVsLCBuYW1lKTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlICYmIGxldmVsIDwgc2VsZi5sZXZlbHMuU0lMRU5UKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBjb25zb2xlIGF2YWlsYWJsZSBmb3IgbG9nZ2luZ1wiO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgXCJsb2cuc2V0TGV2ZWwoKSBjYWxsZWQgd2l0aCBpbnZhbGlkIGxldmVsOiBcIiArIGxldmVsO1xuICAgICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc2V0RGVmYXVsdExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XG4gICAgICAgICAgaWYgKCFnZXRQZXJzaXN0ZWRMZXZlbCgpKSB7XG4gICAgICAgICAgICAgIHNlbGYuc2V0TGV2ZWwobGV2ZWwsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmVuYWJsZUFsbCA9IGZ1bmN0aW9uKHBlcnNpc3QpIHtcbiAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlRSQUNFLCBwZXJzaXN0KTtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKHBlcnNpc3QpIHtcbiAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlNJTEVOVCwgcGVyc2lzdCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBJbml0aWFsaXplIHdpdGggdGhlIHJpZ2h0IGxldmVsXG4gICAgICB2YXIgaW5pdGlhbExldmVsID0gZ2V0UGVyc2lzdGVkTGV2ZWwoKTtcbiAgICAgIGlmIChpbml0aWFsTGV2ZWwgPT0gbnVsbCkge1xuICAgICAgICAgIGluaXRpYWxMZXZlbCA9IGRlZmF1bHRMZXZlbCA9PSBudWxsID8gXCJXQVJOXCIgOiBkZWZhdWx0TGV2ZWw7XG4gICAgICB9XG4gICAgICBzZWxmLnNldExldmVsKGluaXRpYWxMZXZlbCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICpcbiAgICAgKiBUb3AtbGV2ZWwgQVBJXG4gICAgICpcbiAgICAgKi9cblxuICAgIHZhciBkZWZhdWx0TG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuXG4gICAgdmFyIF9sb2dnZXJzQnlOYW1lID0ge307XG4gICAgZGVmYXVsdExvZ2dlci5nZXRMb2dnZXIgPSBmdW5jdGlvbiBnZXRMb2dnZXIobmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIgfHwgbmFtZSA9PT0gXCJcIikge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJZb3UgbXVzdCBzdXBwbHkgYSBuYW1lIHdoZW4gY3JlYXRpbmcgYSBsb2dnZXIuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvZ2dlciA9IF9sb2dnZXJzQnlOYW1lW25hbWVdO1xuICAgICAgICBpZiAoIWxvZ2dlcikge1xuICAgICAgICAgIGxvZ2dlciA9IF9sb2dnZXJzQnlOYW1lW25hbWVdID0gbmV3IExvZ2dlcihcbiAgICAgICAgICAgIG5hbWUsIGRlZmF1bHRMb2dnZXIuZ2V0TGV2ZWwoKSwgZGVmYXVsdExvZ2dlci5tZXRob2RGYWN0b3J5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9nZ2VyO1xuICAgIH07XG5cbiAgICAvLyBHcmFiIHRoZSBjdXJyZW50IGdsb2JhbCBsb2cgdmFyaWFibGUgaW4gY2FzZSBvZiBvdmVyd3JpdGVcbiAgICB2YXIgX2xvZyA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSA/IHdpbmRvdy5sb2cgOiB1bmRlZmluZWQ7XG4gICAgZGVmYXVsdExvZ2dlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXG4gICAgICAgICAgICAgICB3aW5kb3cubG9nID09PSBkZWZhdWx0TG9nZ2VyKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9nID0gX2xvZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWZhdWx0TG9nZ2VyO1xuICAgIH07XG5cbiAgICByZXR1cm4gZGVmYXVsdExvZ2dlcjtcbn0pKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vbG9nbGV2ZWwvbGliL2xvZ2xldmVsLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==