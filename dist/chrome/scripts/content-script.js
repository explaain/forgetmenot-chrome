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
	    drawer.style.boxShadow = "rgba(0, 0, 0, 0.4) -1px 3px 50px 0px;";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTAzNzM2ZmFmYjNhZGFmZjNhYmI/ZTI1MSoiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvY29udGVudC1zY3JpcHQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiXSwibmFtZXMiOlsic2V0TGV2ZWwiLCJnZXRQYWdlVGV4dCIsImRvY3VtZW50IiwiYm9keSIsImlubmVyVGV4dCIsImdldFVybCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImdldEJhc2VVcmwiLCJob3N0IiwicmVwbGFjZSIsImNvbGxlY3RQYWdlRGF0YSIsInBhZ2VUZXh0IiwidXJsIiwiYmFzZVVybCIsInBpbmdEaXYiLCJkcmF3ZXIiLCJjcmVhdGVFbGVtZW50IiwiaWZyYW1lIiwib25sb2FkIiwiZSIsInNlbmRQYWdlVGV4dCIsInRyYWNlIiwiZGVidWciLCJjaHJvbWUiLCJydW50aW1lIiwic2VuZE1lc3NhZ2UiLCJhY3Rpb24iLCJkYXRhIiwicmVzcG9uc2UiLCJudW1QaW5ncyIsInBpbmdzIiwibGVuZ3RoIiwiZXhpc3RpbmdQaW5ncyIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJyZW1vdmUiLCJzdHlsZSIsImNzc1RleHQiLCJwYWdlRmxvYXQiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsInRleHQxIiwiY3JlYXRlVGV4dE5vZGUiLCJjbGFzc05hbWUiLCJwYWdlU3BhbiIsIm9uY2xpY2siLCJvcGVuRHJhd2VyIiwib25NZXNzYWdlIiwiYWRkTGlzdGVuZXIiLCJyZXF1ZXN0Iiwic2VuZGVyIiwic2VuZFJlc3BvbnNlIiwicGFnZURhdGEiLCJldmVudCIsInRvZ2dsZURyYXdlciIsImNyZWF0ZURyYXdlciIsInNldEF0dHJpYnV0ZSIsInNyYyIsImdldFVSTCIsImlkIiwiY2xvc2UiLCJjbG9zZURyYXdlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJpc0NsaWNrSW5zaWRlIiwiY29udGFpbnMiLCJ0YXJnZXQiLCJpbmZvIiwiZXJyb3IiLCJkaXNwbGF5UGFnZVJlc3VsdHMiLCJmcmFtZXMiLCJjb250ZW50V2luZG93IiwicG9zdE1lc3NhZ2UiLCJtZXNzYWdlIiwicGFnZVJlc3VsdHMiLCJnZXRBdHRyaWJ1dGUiLCJkZWFsdFdpdGgiLCJyaWdodCIsImJveFNoYWRvdyIsInBvaW50ZXJFdmVudHMiLCJ3aWR0aCIsInJvb3QiLCJkZWZpbml0aW9uIiwiZGVmaW5lIiwibW9kdWxlIiwiZXhwb3J0cyIsImxvZyIsIm5vb3AiLCJ1bmRlZmluZWRUeXBlIiwibG9nTWV0aG9kcyIsImJpbmRNZXRob2QiLCJvYmoiLCJtZXRob2ROYW1lIiwibWV0aG9kIiwiYmluZCIsIkZ1bmN0aW9uIiwicHJvdG90eXBlIiwiY2FsbCIsImFwcGx5IiwiYXJndW1lbnRzIiwicmVhbE1ldGhvZCIsImNvbnNvbGUiLCJ1bmRlZmluZWQiLCJyZXBsYWNlTG9nZ2luZ01ldGhvZHMiLCJsZXZlbCIsImxvZ2dlck5hbWUiLCJpIiwibWV0aG9kRmFjdG9yeSIsImVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMiLCJkZWZhdWx0TWV0aG9kRmFjdG9yeSIsIkxvZ2dlciIsIm5hbWUiLCJkZWZhdWx0TGV2ZWwiLCJmYWN0b3J5Iiwic2VsZiIsImN1cnJlbnRMZXZlbCIsInN0b3JhZ2VLZXkiLCJwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlIiwibGV2ZWxOdW0iLCJsZXZlbE5hbWUiLCJ0b1VwcGVyQ2FzZSIsImxvY2FsU3RvcmFnZSIsImlnbm9yZSIsImNvb2tpZSIsImVuY29kZVVSSUNvbXBvbmVudCIsImdldFBlcnNpc3RlZExldmVsIiwic3RvcmVkTGV2ZWwiLCJpbmRleE9mIiwiZXhlYyIsInNsaWNlIiwibGV2ZWxzIiwiZ2V0TGV2ZWwiLCJwZXJzaXN0IiwiU0lMRU5UIiwic2V0RGVmYXVsdExldmVsIiwiZW5hYmxlQWxsIiwiVFJBQ0UiLCJkaXNhYmxlQWxsIiwiaW5pdGlhbExldmVsIiwiZGVmYXVsdExvZ2dlciIsIl9sb2dnZXJzQnlOYW1lIiwiZ2V0TG9nZ2VyIiwiVHlwZUVycm9yIiwibG9nZ2VyIiwiX2xvZyIsIm5vQ29uZmxpY3QiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7Ozs7OztBQUNBLG9CQUFJQSxRQUFKLENBQWEsT0FBYjs7QUFFQSxLQUFNQyxjQUFjLFNBQWRBLFdBQWMsR0FBVztBQUM3QixVQUFPQyxTQUFTQyxJQUFULENBQWNDLFNBQXJCO0FBQ0QsRUFGRDtBQUdBLEtBQU1DLFNBQVMsU0FBVEEsTUFBUyxHQUFXO0FBQ3hCLFVBQU9DLE9BQU9DLFFBQVAsQ0FBZ0JDLElBQXZCO0FBQ0QsRUFGRDtBQUdBLEtBQU1DLGFBQWEsU0FBYkEsVUFBYSxHQUFXO0FBQzVCLFVBQU9ILE9BQU9DLFFBQVAsQ0FBZ0JHLElBQWhCLENBQXFCQyxPQUFyQixDQUE2QixNQUE3QixFQUFvQyxFQUFwQyxDQUFQO0FBQ0QsRUFGRDtBQUdBLEtBQU1DLGtCQUFrQixTQUFsQkEsZUFBa0IsR0FBVztBQUNqQyxPQUFNQyxXQUFXWixhQUFqQjtBQUNBLE9BQU1hLE1BQU1ULFFBQVo7QUFDQSxPQUFNVSxVQUFVTixZQUFoQjtBQUNBLFVBQU8sRUFBQ0ssS0FBS0EsR0FBTixFQUFXQyxTQUFTQSxPQUFwQixFQUE2QkYsVUFBVUEsUUFBdkMsRUFBUDtBQUNELEVBTEQ7O0FBUUEsS0FBSUcsT0FBSjtBQUNBLEtBQU1DLFNBQVNmLFNBQVNnQixhQUFULENBQXVCLEtBQXZCLENBQWY7QUFDQSxLQUFNQyxTQUFTakIsU0FBU2dCLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZjs7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OlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZTAzNzM2ZmFmYjNhZGFmZjNhYmIiLCJpbXBvcnQgbG9nIGZyb20gJ2xvZ2xldmVsJztcbmxvZy5zZXRMZXZlbCgnZGVidWcnKVxuXG5jb25zdCBnZXRQYWdlVGV4dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZG9jdW1lbnQuYm9keS5pbm5lclRleHQ7XG59XG5jb25zdCBnZXRVcmwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xufVxuY29uc3QgZ2V0QmFzZVVybCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3QucmVwbGFjZSgnd3d3LicsJycpO1xufVxuY29uc3QgY29sbGVjdFBhZ2VEYXRhID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IHBhZ2VUZXh0ID0gZ2V0UGFnZVRleHQoKTtcbiAgY29uc3QgdXJsID0gZ2V0VXJsKCk7XG4gIGNvbnN0IGJhc2VVcmwgPSBnZXRCYXNlVXJsKCk7XG4gIHJldHVybiB7dXJsOiB1cmwsIGJhc2VVcmw6IGJhc2VVcmwsIHBhZ2VUZXh0OiBwYWdlVGV4dH1cbn1cblxuXG52YXIgcGluZ0RpdjtcbmNvbnN0IGRyYXdlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbmNvbnN0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpXG5cbi8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKCl7IHNlbmRQYWdlVGV4dCgpOyB9LCBmYWxzZSk7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbihlKXtcbiAgc2VuZFBhZ2VUZXh0KClcbn1cblxuY29uc3Qgc2VuZFBhZ2VUZXh0ID0gZnVuY3Rpb24oKSB7XG4gIGxvZy50cmFjZShzZW5kUGFnZVRleHQpO1xuICBjb25zdCBwYWdlVGV4dCA9IGdldFBhZ2VUZXh0KCk7XG4gIGNvbnN0IHVybCA9IGdldFVybCgpO1xuICBjb25zdCBiYXNlVXJsID0gZ2V0QmFzZVVybCgpO1xuICBsb2cudHJhY2UoW3BhZ2VUZXh0XSk7XG4gIGxvZy5kZWJ1Zyh1cmwpO1xuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7YWN0aW9uOiBcImNoZWNrUGFnZVwiLCBkYXRhOiB7dXJsOiB1cmwsIGJhc2VVcmw6IGJhc2VVcmwsIHBhZ2VUZXh0OiBwYWdlVGV4dH19LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIGxvZy5kZWJ1ZyhyZXNwb25zZSk7XG4gICAgY29uc3QgbnVtUGluZ3MgPSByZXNwb25zZS5waW5ncy5sZW5ndGhcbiAgICBsb2cuZGVidWcoXCJudW1QaW5nczogXCIsIG51bVBpbmdzKTtcbiAgICBpZiAobnVtUGluZ3MgJiYgcGluZ0RpdiAhPSAtMSkge1xuICAgICAgY29uc3QgZXhpc3RpbmdQaW5ncyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ZvcmdldC1tZS1ub3QtcGluZycpO1xuICAgICAgd2hpbGUoZXhpc3RpbmdQaW5ncy5sZW5ndGggPiAwKXtcbiAgICAgICAgbG9nLnRyYWNlKCdEZWxldGluZyBleGlzdGluZyBwaW5nJyk7XG4gICAgICAgIGV4aXN0aW5nUGluZ3NbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChleGlzdGluZ1BpbmdzWzBdKTtcbiAgICAgIH1cbiAgICAgIGlmIChwaW5nRGl2KSBwaW5nRGl2LnJlbW92ZSgpO1xuICAgICAgcGluZ0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgIHBpbmdEaXYuc3R5bGUuY3NzVGV4dCA9IFwiXCJcbiAgICAgICAgKyBcInBvc2l0aW9uOiBmaXhlZDtcIlxuICAgICAgICArIFwidG9wOiAwO1wiXG4gICAgICAgICsgXCJyaWdodDogMDtcIlxuICAgICAgICArIFwid2lkdGg6IDMwMHB4O1wiXG4gICAgICAgICsgXCJtYXJnaW46IDIwcHg7XCJcbiAgICAgICAgKyBcInBhZGRpbmc6IDIwcHggMzVweDtcIlxuICAgICAgICArIFwiZm9udC1zaXplOiAxNnB4O1wiXG4gICAgICAgICsgXCJmb250LXdlaWdodDogbm9ybWFsO1wiXG4gICAgICAgICsgXCJjb2xvcjogIzMzMztcIlxuICAgICAgICArIFwiYm94LXNoYWRvdzogcmdiYSg1MCwgNTAsIDUwLCAwLjk1KSAwcHggMHB4IDMwcHg7XCJcbiAgICAgICAgKyBcImJvcmRlcjogbm9uZTtcIlxuICAgICAgICArIFwiYm9yZGVyLXJhZGl1czogMTBweDtcIlxuICAgICAgICArIFwiei1pbmRleDogMTAwMDAwMDtcIlxuICAgICAgICArIFwiYmFja2dyb3VuZDogd2hpdGU7XCJcbiAgICAgICAgKyBcImN1cnNvcjogcG9pbnRlcjtcIlxuICAgICAgICArIFwibGluZS1oZWlnaHQ6IDEuNDtcIlxuICAgICAgICArIFwiZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmO1wiXG4gICAgICB2YXIgcGFnZUZsb2F0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIHBhZ2VGbG9hdC5zdHlsZS5jc3NUZXh0ID0gXCJcIlxuICAgICAgKyBcImZsb2F0OiByaWdodDtcIlxuICAgICAgcGFnZUZsb2F0LmlubmVySFRNTCA9IFwi8J+RhvCfkYZcIjtcbiAgICAgIHBpbmdEaXYuYXBwZW5kQ2hpbGQocGFnZUZsb2F0KVxuICAgICAgY29uc3QgdGV4dDEgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgobnVtUGluZ3M9PTEgPyBcIk9uZSBtZW1vcnlcIiA6IG51bVBpbmdzK1wiIG1lbW9yaWVzXCIpICsgXCIgcmVsZXZhbnQgdG8gdGhpcyBwYWdlISDwn5iDXCIpO1xuICAgICAgdGV4dDEuY2xhc3NOYW1lID0gJ2ZvcmdldC1tZS1ub3QtcGluZydcbiAgICAgIHBpbmdEaXYuYXBwZW5kQ2hpbGQodGV4dDEpXG4gICAgICB2YXIgcGFnZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIHBhZ2VTcGFuLnN0eWxlLmNzc1RleHQgPSBcIlwiXG4gICAgICAgICsgXCJjb2xvcjogZ3JleTtcIlxuICAgICAgICArIFwiZm9udC1zdHlsZTogaXRhbGljO1wiXG4gICAgICAgICsgXCJtYXJnaW4tbGVmdDogNXB4O1wiXG4gICAgICBwYWdlU3Bhbi5pbm5lckhUTUwgPSBcIkNsaWNrIHRvIHZpZXdcIjtcbiAgICAgIHBpbmdEaXYuYXBwZW5kQ2hpbGQocGFnZVNwYW4pXG4gICAgICBwaW5nRGl2Lm9uY2xpY2sgPSBmdW5jdGlvbihlKXtcbiAgICAgICAgb3BlbkRyYXdlcihlKTtcbiAgICAgICAgcGluZ0Rpdi5yZW1vdmUoKTtcbiAgICAgICAgcGluZ0RpdiA9IC0xXG4gICAgICB9O1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwaW5nRGl2KTtcbiAgICAgIGxvZy50cmFjZShwaW5nRGl2KTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2Upe1xuICBsb2cudHJhY2UoJ1JlcXVlc3QgcmVjZWl2ZWQnKTtcbiAgaWYocmVxdWVzdC5hY3Rpb24gPT0gXCJnZXRQYWdlRGF0YVwiKXtcbiAgICBsb2cuZGVidWcoJzEnKVxuICAgIGxvZy50cmFjZSgnUmVjZWl2ZWQgZ2V0UGFnZURhdGEgcmVxdWVzdCcpO1xuICAgIGNvbnN0IHBhZ2VEYXRhID0gY29sbGVjdFBhZ2VEYXRhKClcbiAgICBsb2cuZGVidWcocGFnZURhdGEpXG4gICAgc2VuZFJlc3BvbnNlKHBhZ2VEYXRhKVxuICB9XG4gIGlmKHJlcXVlc3QuZXZlbnQgPT0gXCJwb3B1cE9wZW5lZFwiKXtcbiAgICBsb2cudHJhY2UoJ1JlY2VpdmVkIHBvcHVwT3BlbmVkIGV2ZW50Jyk7XG4gICAgaWYgKHBpbmdEaXYpIHBpbmdEaXYucmVtb3ZlKCk7XG4gIH1cbiAgaWYocmVxdWVzdC5hY3Rpb24gPT0gXCJ0b2dnbGVEcmF3ZXJcIil7XG4gICAgbG9nLnRyYWNlKCdSZWNlaXZlZCB0b2dnbGVEcmF3ZXIgYWN0aW9uJyk7XG4gICAgdG9nZ2xlRHJhd2VyKClcbiAgfVxufSlcblxuc2VuZFBhZ2VUZXh0KCk7XG5cblxuXG5jb25zdCBjcmVhdGVEcmF3ZXIgPSBmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICBkcmF3ZXIuc3R5bGUuY3NzVGV4dCA9IFwiXCJcbiAgICAgICsgXCJwb3NpdGlvbjogZml4ZWQ7XCJcbiAgICAgICsgXCJ0b3A6IDA7XCJcbiAgICAgICsgXCJyaWdodDogLTQwMHB4O1wiXG4gICAgICArIFwiaGVpZ2h0OiAxMDAlO1wiXG4gICAgICArIFwid2lkdGg6IDQwMHB4O1wiXG4gICAgICArIFwiei1pbmRleDogMTAwMDAwMDAwMDAwMDAwMDtcIlxuICAgICAgKyBcImJhY2tncm91bmQ6IHdoaXRlO1wiXG4gICAgICArIFwiYm94LXNoYWRvdzogcmdiYSgwLCAwLCAwLCAwLjQpIC0xcHggM3B4IDUwcHggMHB4O1wiXG4gICAgICArIFwidHJhbnNpdGlvbjogYWxsIDAuNnMgZWFzZSAwcztcIlxuICAgIGRyYXdlci5zZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJywgJ2ZhbHNlJylcblxuICAgIGlmcmFtZS5zcmMgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoJy4uL3BhZ2VzL3BvcHVwLmh0bWwnKVxuICAgIGlmcmFtZS5pZCA9ICdmb3JnZXRtZW5vdC1mcmFtZSdcbiAgICBpZnJhbWUuc3R5bGUuY3NzVGV4dCA9IFwiXCJcbiAgICAgICsgXCJwb3NpdGlvbjogYWJzb2x1dGU7XCJcbiAgICAgICsgXCJ0b3A6IDA7XCJcbiAgICAgICsgXCJoZWlnaHQ6IDEwMCU7XCJcbiAgICAgICsgXCJsZWZ0OiAtMTAwJTtcIlxuICAgICAgKyBcIndpZHRoOiAyMDAlO1wiXG4gICAgICArIFwiYm9yZGVyOiBub25lO1wiXG4gICAgICArIFwicG9pbnRlci1ldmVudHM6IG5vbmU7XCJcblxuICAgIGNvbnN0IGNsb3NlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgY2xvc2Uuc3R5bGUuY3NzVGV4dCA9IFwiXCJcbiAgICAgICsgXCJwb3NpdGlvbjogYWJzb2x1dGU7XCJcbiAgICAgICsgXCJ0b3A6IDZweDtcIlxuICAgICAgKyBcImxlZnQ6IDRweDtcIlxuICAgICAgKyBcInotaW5kZXg6IDIxNDc0ODM2NDc7XCJcbiAgICAgICsgXCJmb250LXNpemU6IDIwcHg7XCJcbiAgICAgICsgXCJjb2xvcjogIzk5OTtcIlxuICAgICAgKyBcImZvbnQtZmFtaWx5OiBBcmlhbDtcIlxuICAgICAgKyBcImJvcmRlci1yYWRpdXM6IDZweDtcIlxuICAgICAgKyBcInBhZGRpbmc6IDBweCA5cHggMnB4O1wiXG4gICAgICArIFwiY3Vyc29yOiBwb2ludGVyO1wiXG4gICAgICArIFwiZm9udC13ZWlnaHQ6IGJvbGQ7XCJcbiAgICAgICsgXCJwb2ludGVyLWV2ZW50czogYWxsO1wiXG4gICAgY2xvc2UuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ3gnKSlcblxuICAgIC8vIENsaWNrIEV2ZW50c1xuICAgIGNsb3NlLm9uY2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGNsb3NlRHJhd2VyKGUpXG4gICAgfTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAvLyBsb2cuaW5mbyhwaW5nRGl2KVxuICAgICAgdmFyIGlzQ2xpY2tJbnNpZGUgPSBkcmF3ZXIuY29udGFpbnMoZXZlbnQudGFyZ2V0KSB8fCAocGluZ0RpdiAmJiBwaW5nRGl2ICE9IC0xICYmIHBpbmdEaXYuY29udGFpbnMoZXZlbnQudGFyZ2V0KSk7XG5cbiAgICAgIGlmICghaXNDbGlja0luc2lkZSkge1xuICAgICAgICBjbG9zZURyYXdlcihldmVudClcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRyYXdlci5hcHBlbmRDaGlsZChjbG9zZSk7XG4gICAgZHJhd2VyLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkcmF3ZXIpO1xuICAgIGxvZy5pbmZvKGRyYXdlcilcbiAgfSBjYXRjaChlKSB7XG4gICAgbG9nLmVycm9yKGUpXG4gIH1cbn1cbmNvbnN0IGRpc3BsYXlQYWdlUmVzdWx0cyA9IGZ1bmN0aW9uKCkge1xuICBsb2cuaW5mbygnU2VuZGluZyBzZXRMb2FkaW5nIHRvIGZyYW1lJylcbiAgd2luZG93LmZyYW1lc1snZm9yZ2V0bWVub3QtZnJhbWUnXS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKHthY3Rpb246ICdzZXRMb2FkaW5nJ30sIFwiKlwiKTtcbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2FjdGlvbjogXCJnZXRQYWdlUmVzdWx0c1wiLCBkYXRhOiB7cGFnZURhdGE6IGNvbGxlY3RQYWdlRGF0YSgpfX0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IHthY3Rpb246IFwidXBkYXRlUGFnZVJlc3VsdHNcIiwgZGF0YToge3BhZ2VSZXN1bHRzOiByZXNwb25zZX19XG4gICAgbG9nLmluZm8obWVzc2FnZSlcbiAgICB3aW5kb3cuZnJhbWVzWydmb3JnZXRtZW5vdC1mcmFtZSddLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UobWVzc2FnZSwgXCIqXCIpO1xuICB9KVxufVxuY29uc3Qgb3BlbkRyYXdlciA9IGZ1bmN0aW9uKGUpIHtcbiAgLy8gbG9nLmluZm8oZHJhd2VyLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuZWQnKSlcbiAgaWYgKGRyYXdlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJykgIT0gJ3RydWUnICYmICghZSB8fCAhZS5kZWFsdFdpdGgpKSB7XG4gICAgZGlzcGxheVBhZ2VSZXN1bHRzKClcbiAgICBkcmF3ZXIuc3R5bGUucmlnaHQgPSAnMHB4J1xuICAgIGRyYXdlci5zdHlsZS5ib3hTaGFkb3cgPSBcInJnYmEoMCwgMCwgMCwgMC40KSAtMXB4IDNweCA1MHB4IDBweDtcIlxuICAgIGlmcmFtZS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ2FsbCdcbiAgICBkcmF3ZXIuc2V0QXR0cmlidXRlKCdkYXRhLW9wZW5lZCcsICd0cnVlJylcbiAgICBsb2cuaW5mbyhkcmF3ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW5lZCcpKVxuICB9XG4gIGlmIChlKSBlLmRlYWx0V2l0aCA9IHRydWVcbn1cbmNvbnN0IGNsb3NlRHJhd2VyID0gZnVuY3Rpb24oZSkge1xuICAvLyBsb2cuaW5mbyhkcmF3ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW5lZCcpKVxuICBpZiAoZHJhd2VyLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuZWQnKSA9PSAndHJ1ZScgJiYgKCFlIHx8ICFlLmRlYWx0V2l0aCkpIHtcbiAgICBkcmF3ZXIuc3R5bGUucmlnaHQgPSAnLScgKyBkcmF3ZXIuc3R5bGUud2lkdGhcbiAgICBkcmF3ZXIuc3R5bGUuYm94U2hhZG93ID0gXCJub25lXCJcbiAgICBpZnJhbWUuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJ1xuICAgIGRyYXdlci5zZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJywgJ2ZhbHNlJylcbiAgfVxuICAvLyBsb2cuaW5mbyhkcmF3ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW5lZCcpKVxuICBpZiAoZSkgZS5kZWFsdFdpdGggPSB0cnVlXG59XG5jb25zdCB0b2dnbGVEcmF3ZXIgPSBmdW5jdGlvbihlKSB7XG4gIGlmIChkcmF3ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW5lZCcpID09ICd0cnVlJykge1xuICAgIGNsb3NlRHJhd2VyKGUpXG4gIH0gZWxzZSB7XG4gICAgb3BlbkRyYXdlcihlKVxuICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgc3dpdGNoIChldmVudC5kYXRhLmFjdGlvbikge1xuICAgIGNhc2UgJ2dldFBhZ2VSZXN1bHRzJzpcbiAgICBsb2cuaW5mbyg1KVxuICAgICAgZGlzcGxheVBhZ2VSZXN1bHRzKClcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG5cbiAgfVxufSwgZmFsc2UpO1xuXG5jcmVhdGVEcmF3ZXIoKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL3NjcmlwdHMvY29udGVudC1zY3JpcHQuanMiLCIvKlxuKiBsb2dsZXZlbCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9waW10ZXJyeS9sb2dsZXZlbFxuKlxuKiBDb3B5cmlnaHQgKGMpIDIwMTMgVGltIFBlcnJ5XG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiovXG4oZnVuY3Rpb24gKHJvb3QsIGRlZmluaXRpb24pIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QubG9nID0gZGVmaW5pdGlvbigpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy8gU2xpZ2h0bHkgZHViaW91cyB0cmlja3MgdG8gY3V0IGRvd24gbWluaW1pemVkIGZpbGUgc2l6ZVxuICAgIHZhciBub29wID0gZnVuY3Rpb24oKSB7fTtcbiAgICB2YXIgdW5kZWZpbmVkVHlwZSA9IFwidW5kZWZpbmVkXCI7XG5cbiAgICB2YXIgbG9nTWV0aG9kcyA9IFtcbiAgICAgICAgXCJ0cmFjZVwiLFxuICAgICAgICBcImRlYnVnXCIsXG4gICAgICAgIFwiaW5mb1wiLFxuICAgICAgICBcIndhcm5cIixcbiAgICAgICAgXCJlcnJvclwiXG4gICAgXTtcblxuICAgIC8vIENyb3NzLWJyb3dzZXIgYmluZCBlcXVpdmFsZW50IHRoYXQgd29ya3MgYXQgbGVhc3QgYmFjayB0byBJRTZcbiAgICBmdW5jdGlvbiBiaW5kTWV0aG9kKG9iaiwgbWV0aG9kTmFtZSkge1xuICAgICAgICB2YXIgbWV0aG9kID0gb2JqW21ldGhvZE5hbWVdO1xuICAgICAgICBpZiAodHlwZW9mIG1ldGhvZC5iaW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmJpbmQob2JqKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwobWV0aG9kLCBvYmopO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIE1pc3NpbmcgYmluZCBzaGltIG9yIElFOCArIE1vZGVybml6ciwgZmFsbGJhY2sgdG8gd3JhcHBpbmdcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuYXBwbHkobWV0aG9kLCBbb2JqLCBhcmd1bWVudHNdKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQnVpbGQgdGhlIGJlc3QgbG9nZ2luZyBtZXRob2QgcG9zc2libGUgZm9yIHRoaXMgZW52XG4gICAgLy8gV2hlcmV2ZXIgcG9zc2libGUgd2Ugd2FudCB0byBiaW5kLCBub3Qgd3JhcCwgdG8gcHJlc2VydmUgc3RhY2sgdHJhY2VzXG4gICAgZnVuY3Rpb24gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB7XG4gICAgICAgIGlmIChtZXRob2ROYW1lID09PSAnZGVidWcnKSB7XG4gICAgICAgICAgICBtZXRob2ROYW1lID0gJ2xvZyc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gTm8gbWV0aG9kIHBvc3NpYmxlLCBmb3Igbm93IC0gZml4ZWQgbGF0ZXIgYnkgZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlc1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGVbbWV0aG9kTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgbWV0aG9kTmFtZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZS5sb2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgJ2xvZycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGVzZSBwcml2YXRlIGZ1bmN0aW9ucyBhbHdheXMgbmVlZCBgdGhpc2AgdG8gYmUgc2V0IHByb3Blcmx5XG5cbiAgICBmdW5jdGlvbiByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2dNZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IGxvZ01ldGhvZHNbaV07XG4gICAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdID0gKGkgPCBsZXZlbCkgP1xuICAgICAgICAgICAgICAgIG5vb3AgOlxuICAgICAgICAgICAgICAgIHRoaXMubWV0aG9kRmFjdG9yeShtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZWZpbmUgbG9nLmxvZyBhcyBhbiBhbGlhcyBmb3IgbG9nLmRlYnVnXG4gICAgICAgIHRoaXMubG9nID0gdGhpcy5kZWJ1ZztcbiAgICB9XG5cbiAgICAvLyBJbiBvbGQgSUUgdmVyc2lvbnMsIHRoZSBjb25zb2xlIGlzbid0IHByZXNlbnQgdW50aWwgeW91IGZpcnN0IG9wZW4gaXQuXG4gICAgLy8gV2UgYnVpbGQgcmVhbE1ldGhvZCgpIHJlcGxhY2VtZW50cyBoZXJlIHRoYXQgcmVnZW5lcmF0ZSBsb2dnaW5nIG1ldGhvZHNcbiAgICBmdW5jdGlvbiBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzKG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMuY2FsbCh0aGlzLCBsZXZlbCwgbG9nZ2VyTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRob2ROYW1lXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIEJ5IGRlZmF1bHQsIHdlIHVzZSBjbG9zZWx5IGJvdW5kIHJlYWwgbWV0aG9kcyB3aGVyZXZlciBwb3NzaWJsZSwgYW5kXG4gICAgLy8gb3RoZXJ3aXNlIHdlIHdhaXQgZm9yIGEgY29uc29sZSB0byBhcHBlYXIsIGFuZCB0aGVuIHRyeSBhZ2Fpbi5cbiAgICBmdW5jdGlvbiBkZWZhdWx0TWV0aG9kRmFjdG9yeShtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICByZXR1cm4gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB8fFxuICAgICAgICAgICAgICAgZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIExvZ2dlcihuYW1lLCBkZWZhdWx0TGV2ZWwsIGZhY3RvcnkpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBjdXJyZW50TGV2ZWw7XG4gICAgICB2YXIgc3RvcmFnZUtleSA9IFwibG9nbGV2ZWxcIjtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIHN0b3JhZ2VLZXkgKz0gXCI6XCIgKyBuYW1lO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsTnVtKSB7XG4gICAgICAgICAgdmFyIGxldmVsTmFtZSA9IChsb2dNZXRob2RzW2xldmVsTnVtXSB8fCAnc2lsZW50JykudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSB1bmRlZmluZWRUeXBlKSByZXR1cm47XG5cbiAgICAgICAgICAvLyBVc2UgbG9jYWxTdG9yYWdlIGlmIGF2YWlsYWJsZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV0gPSBsZXZlbE5hbWU7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG5cbiAgICAgICAgICAvLyBVc2Ugc2Vzc2lvbiBjb29raWUgYXMgZmFsbGJhY2tcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuY29va2llID1cbiAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RvcmFnZUtleSkgKyBcIj1cIiArIGxldmVsTmFtZSArIFwiO1wiO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0UGVyc2lzdGVkTGV2ZWwoKSB7XG4gICAgICAgICAgdmFyIHN0b3JlZExldmVsO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09IHVuZGVmaW5lZFR5cGUpIHJldHVybjtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gd2luZG93LmxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XTtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG5cbiAgICAgICAgICAvLyBGYWxsYmFjayB0byBjb29raWVzIGlmIGxvY2FsIHN0b3JhZ2UgZ2l2ZXMgdXMgbm90aGluZ1xuICAgICAgICAgIGlmICh0eXBlb2Ygc3RvcmVkTGV2ZWwgPT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHZhciBjb29raWUgPSB3aW5kb3cuZG9jdW1lbnQuY29va2llO1xuICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gY29va2llLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0b3JhZ2VLZXkpICsgXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSAvXihbXjtdKykvLmV4ZWMoY29va2llLnNsaWNlKGxvY2F0aW9uKSlbMV07XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGUgc3RvcmVkIGxldmVsIGlzIG5vdCB2YWxpZCwgdHJlYXQgaXQgYXMgaWYgbm90aGluZyB3YXMgc3RvcmVkLlxuICAgICAgICAgIGlmIChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc3RvcmVkTGV2ZWw7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAgKlxuICAgICAgICogUHVibGljIGxvZ2dlciBBUEkgLSBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsIGZvciBkZXRhaWxzXG4gICAgICAgKlxuICAgICAgICovXG5cbiAgICAgIHNlbGYubGV2ZWxzID0geyBcIlRSQUNFXCI6IDAsIFwiREVCVUdcIjogMSwgXCJJTkZPXCI6IDIsIFwiV0FSTlwiOiAzLFxuICAgICAgICAgIFwiRVJST1JcIjogNCwgXCJTSUxFTlRcIjogNX07XG5cbiAgICAgIHNlbGYubWV0aG9kRmFjdG9yeSA9IGZhY3RvcnkgfHwgZGVmYXVsdE1ldGhvZEZhY3Rvcnk7XG5cbiAgICAgIHNlbGYuZ2V0TGV2ZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRMZXZlbDtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc2V0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwsIHBlcnNpc3QpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcInN0cmluZ1wiICYmIHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbGV2ZWwgPSBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIiAmJiBsZXZlbCA+PSAwICYmIGxldmVsIDw9IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xuICAgICAgICAgICAgICBjdXJyZW50TGV2ZWwgPSBsZXZlbDtcbiAgICAgICAgICAgICAgaWYgKHBlcnNpc3QgIT09IGZhbHNlKSB7ICAvLyBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAgICAgICAgICBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMuY2FsbChzZWxmLCBsZXZlbCwgbmFtZSk7XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSAmJiBsZXZlbCA8IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gY29uc29sZSBhdmFpbGFibGUgZm9yIGxvZ2dpbmdcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IFwibG9nLnNldExldmVsKCkgY2FsbGVkIHdpdGggaW52YWxpZCBsZXZlbDogXCIgKyBsZXZlbDtcbiAgICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZWxmLnNldERlZmF1bHRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xuICAgICAgICAgIGlmICghZ2V0UGVyc2lzdGVkTGV2ZWwoKSkge1xuICAgICAgICAgICAgICBzZWxmLnNldExldmVsKGxldmVsLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VsZi5lbmFibGVBbGwgPSBmdW5jdGlvbihwZXJzaXN0KSB7XG4gICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5UUkFDRSwgcGVyc2lzdCk7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmRpc2FibGVBbGwgPSBmdW5jdGlvbihwZXJzaXN0KSB7XG4gICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5TSUxFTlQsIHBlcnNpc3QpO1xuICAgICAgfTtcblxuICAgICAgLy8gSW5pdGlhbGl6ZSB3aXRoIHRoZSByaWdodCBsZXZlbFxuICAgICAgdmFyIGluaXRpYWxMZXZlbCA9IGdldFBlcnNpc3RlZExldmVsKCk7XG4gICAgICBpZiAoaW5pdGlhbExldmVsID09IG51bGwpIHtcbiAgICAgICAgICBpbml0aWFsTGV2ZWwgPSBkZWZhdWx0TGV2ZWwgPT0gbnVsbCA/IFwiV0FSTlwiIDogZGVmYXVsdExldmVsO1xuICAgICAgfVxuICAgICAgc2VsZi5zZXRMZXZlbChpbml0aWFsTGV2ZWwsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqXG4gICAgICogVG9wLWxldmVsIEFQSVxuICAgICAqXG4gICAgICovXG5cbiAgICB2YXIgZGVmYXVsdExvZ2dlciA9IG5ldyBMb2dnZXIoKTtcblxuICAgIHZhciBfbG9nZ2Vyc0J5TmFtZSA9IHt9O1xuICAgIGRlZmF1bHRMb2dnZXIuZ2V0TG9nZ2VyID0gZnVuY3Rpb24gZ2V0TG9nZ2VyKG5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiIHx8IG5hbWUgPT09IFwiXCIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiWW91IG11c3Qgc3VwcGx5IGEgbmFtZSB3aGVuIGNyZWF0aW5nIGEgbG9nZ2VyLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2dnZXIgPSBfbG9nZ2Vyc0J5TmFtZVtuYW1lXTtcbiAgICAgICAgaWYgKCFsb2dnZXIpIHtcbiAgICAgICAgICBsb2dnZXIgPSBfbG9nZ2Vyc0J5TmFtZVtuYW1lXSA9IG5ldyBMb2dnZXIoXG4gICAgICAgICAgICBuYW1lLCBkZWZhdWx0TG9nZ2VyLmdldExldmVsKCksIGRlZmF1bHRMb2dnZXIubWV0aG9kRmFjdG9yeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvZ2dlcjtcbiAgICB9O1xuXG4gICAgLy8gR3JhYiB0aGUgY3VycmVudCBnbG9iYWwgbG9nIHZhcmlhYmxlIGluIGNhc2Ugb2Ygb3ZlcndyaXRlXG4gICAgdmFyIF9sb2cgPSAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSkgPyB3aW5kb3cubG9nIDogdW5kZWZpbmVkO1xuICAgIGRlZmF1bHRMb2dnZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxuICAgICAgICAgICAgICAgd2luZG93LmxvZyA9PT0gZGVmYXVsdExvZ2dlcikge1xuICAgICAgICAgICAgd2luZG93LmxvZyA9IF9sb2c7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVmYXVsdExvZ2dlcjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlZmF1bHRMb2dnZXI7XG59KSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qcyJdLCJzb3VyY2VSb290IjoiIn0=