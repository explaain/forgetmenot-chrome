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
	    drawer.style.cssText = "" + "all: initial;" + "position: fixed;" + "top: 0;" + "right: -400px;" + "height: 100%;" + "width: 400px;" + "z-index: 1000000000000000;" + "background: white;" + "box-shadow: rgba(0, 0, 0, 0.4) -1px 3px 50px 0px;" + "transition: all 0.6s ease 0s;";
	    drawer.setAttribute('data-opened', 'false');
	
	    iframe.src = chrome.runtime.getURL('../pages/popup.html');
	    iframe.id = 'forgetmenot-frame';
	    iframe.style.cssText = "" + "all: initial;" + "position: absolute;" + "top: 0;" + "height: 100%;" + "left: -100%;" + "width: 200%;" + "border: none;" + "pointer-events: none;";
	
	    var close = document.createElement('a');
	    close.style.cssText = "" + "all: initial;" + "position: absolute;" + "top: 6px;" + "left: 4px;" + "z-index: 2147483647;" + "font-size: 20px;" + "color: #999;" + "font-family: Arial;" + "border-radius: 6px;" + "padding: 0px 9px 2px;" + "cursor: pointer;" + "font-weight: bold;" + "pointer-events: all;";
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
	
	    var timeSaved = document.createElement('div');
	    timeSaved.style.cssText = "" + "all: initial;" + "font-family: Lato, Arial, sans-serif;" + "position: absolute;" + "bottom: 0;" + "left: 0;" + "right: 0;" + "padding: 20px;" + "background: white;" + "box-shadow: 0px 0px 30px rgba(150,150,150,0.5);" + "color: #999;" + "text-align: center;" + "font-weight: bold;";
	    timeSaved.appendChild(document.createTextNode('You\'ve saved 4.5 hours so far this month! 💪'));
	
	    drawer.appendChild(close);
	    drawer.appendChild(iframe);
	    drawer.appendChild(timeSaved);
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
	    case 'closeDrawer':
	      console.log('closeDrawer');
	      closeDrawer();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmVmMTg4M2Y0MjdmODQwOTBlOTkiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvY29udGVudC1zY3JpcHQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiXSwibmFtZXMiOlsic2V0TGV2ZWwiLCJnZXRQYWdlVGV4dCIsImRvY3VtZW50IiwiYm9keSIsImlubmVyVGV4dCIsImdldFVybCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImdldEJhc2VVcmwiLCJob3N0IiwicmVwbGFjZSIsImNvbGxlY3RQYWdlRGF0YSIsInBhZ2VUZXh0IiwidXJsIiwiYmFzZVVybCIsInBpbmdEaXYiLCJkcmF3ZXIiLCJjcmVhdGVFbGVtZW50IiwiaWZyYW1lIiwib25sb2FkIiwiZSIsInNlbmRQYWdlVGV4dCIsInRyYWNlIiwiZGVidWciLCJjaHJvbWUiLCJydW50aW1lIiwic2VuZE1lc3NhZ2UiLCJhY3Rpb24iLCJkYXRhIiwicmVzcG9uc2UiLCJudW1QaW5ncyIsInBpbmdzIiwibGVuZ3RoIiwiZXhpc3RpbmdQaW5ncyIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJyZW1vdmUiLCJzdHlsZSIsImNzc1RleHQiLCJwYWdlRmxvYXQiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsInRleHQxIiwiY3JlYXRlVGV4dE5vZGUiLCJjbGFzc05hbWUiLCJwYWdlU3BhbiIsIm9uY2xpY2siLCJvcGVuRHJhd2VyIiwib25NZXNzYWdlIiwiYWRkTGlzdGVuZXIiLCJyZXF1ZXN0Iiwic2VuZGVyIiwic2VuZFJlc3BvbnNlIiwicGFnZURhdGEiLCJldmVudCIsInRvZ2dsZURyYXdlciIsImNyZWF0ZURyYXdlciIsInNldEF0dHJpYnV0ZSIsInNyYyIsImdldFVSTCIsImlkIiwiY2xvc2UiLCJjbG9zZURyYXdlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJpc0NsaWNrSW5zaWRlIiwiY29udGFpbnMiLCJ0YXJnZXQiLCJ0aW1lU2F2ZWQiLCJpbmZvIiwiZXJyb3IiLCJkaXNwbGF5UGFnZVJlc3VsdHMiLCJmcmFtZXMiLCJjb250ZW50V2luZG93IiwicG9zdE1lc3NhZ2UiLCJtZXNzYWdlIiwicGFnZVJlc3VsdHMiLCJnZXRBdHRyaWJ1dGUiLCJkZWFsdFdpdGgiLCJyaWdodCIsImJveFNoYWRvdyIsInBvaW50ZXJFdmVudHMiLCJ3aWR0aCIsImNvbnNvbGUiLCJsb2ciLCJyb290IiwiZGVmaW5pdGlvbiIsImRlZmluZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJub29wIiwidW5kZWZpbmVkVHlwZSIsImxvZ01ldGhvZHMiLCJiaW5kTWV0aG9kIiwib2JqIiwibWV0aG9kTmFtZSIsIm1ldGhvZCIsImJpbmQiLCJGdW5jdGlvbiIsInByb3RvdHlwZSIsImNhbGwiLCJhcHBseSIsImFyZ3VtZW50cyIsInJlYWxNZXRob2QiLCJ1bmRlZmluZWQiLCJyZXBsYWNlTG9nZ2luZ01ldGhvZHMiLCJsZXZlbCIsImxvZ2dlck5hbWUiLCJpIiwibWV0aG9kRmFjdG9yeSIsImVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMiLCJkZWZhdWx0TWV0aG9kRmFjdG9yeSIsIkxvZ2dlciIsIm5hbWUiLCJkZWZhdWx0TGV2ZWwiLCJmYWN0b3J5Iiwic2VsZiIsImN1cnJlbnRMZXZlbCIsInN0b3JhZ2VLZXkiLCJwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlIiwibGV2ZWxOdW0iLCJsZXZlbE5hbWUiLCJ0b1VwcGVyQ2FzZSIsImxvY2FsU3RvcmFnZSIsImlnbm9yZSIsImNvb2tpZSIsImVuY29kZVVSSUNvbXBvbmVudCIsImdldFBlcnNpc3RlZExldmVsIiwic3RvcmVkTGV2ZWwiLCJpbmRleE9mIiwiZXhlYyIsInNsaWNlIiwibGV2ZWxzIiwiZ2V0TGV2ZWwiLCJwZXJzaXN0IiwiU0lMRU5UIiwic2V0RGVmYXVsdExldmVsIiwiZW5hYmxlQWxsIiwiVFJBQ0UiLCJkaXNhYmxlQWxsIiwiaW5pdGlhbExldmVsIiwiZGVmYXVsdExvZ2dlciIsIl9sb2dnZXJzQnlOYW1lIiwiZ2V0TG9nZ2VyIiwiVHlwZUVycm9yIiwibG9nZ2VyIiwiX2xvZyIsIm5vQ29uZmxpY3QiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7Ozs7OztBQUNBLG9CQUFJQSxRQUFKLENBQWEsT0FBYjs7QUFFQSxLQUFNQyxjQUFjLFNBQWRBLFdBQWMsR0FBVztBQUM3QixVQUFPQyxTQUFTQyxJQUFULENBQWNDLFNBQXJCO0FBQ0QsRUFGRDtBQUdBLEtBQU1DLFNBQVMsU0FBVEEsTUFBUyxHQUFXO0FBQ3hCLFVBQU9DLE9BQU9DLFFBQVAsQ0FBZ0JDLElBQXZCO0FBQ0QsRUFGRDtBQUdBLEtBQU1DLGFBQWEsU0FBYkEsVUFBYSxHQUFXO0FBQzVCLFVBQU9ILE9BQU9DLFFBQVAsQ0FBZ0JHLElBQWhCLENBQXFCQyxPQUFyQixDQUE2QixNQUE3QixFQUFvQyxFQUFwQyxDQUFQO0FBQ0QsRUFGRDtBQUdBLEtBQU1DLGtCQUFrQixTQUFsQkEsZUFBa0IsR0FBVztBQUNqQyxPQUFNQyxXQUFXWixhQUFqQjtBQUNBLE9BQU1hLE1BQU1ULFFBQVo7QUFDQSxPQUFNVSxVQUFVTixZQUFoQjtBQUNBLFVBQU8sRUFBQ0ssS0FBS0EsR0FBTixFQUFXQyxTQUFTQSxPQUFwQixFQUE2QkYsVUFBVUEsUUFBdkMsRUFBUDtBQUNELEVBTEQ7O0FBUUEsS0FBSUcsT0FBSjtBQUNBLEtBQU1DLFNBQVNmLFNBQVNnQixhQUFULENBQXVCLEtBQXZCLENBQWY7QUFDQSxLQUFNQyxTQUFTakIsU0FBU2dCLGFBQVQsQ0FBdUIsUUFBdkIs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RUFEd0IsRUFDRVEsY0FBY2hDLGFBRGhCLENBQWhDO0FBRUQ7QUFDRCxnQkFBT29DLE1BQVA7QUFDSCxNQVhEOztBQWFBO0FBQ0EsU0FBSUMsT0FBUSxRQUFPN0ksTUFBUCx5Q0FBT0EsTUFBUCxPQUFrQnNGLGFBQW5CLEdBQW9DdEYsT0FBTytFLEdBQTNDLEdBQWlEb0IsU0FBNUQ7QUFDQXFDLG1CQUFjTSxVQUFkLEdBQTJCLFlBQVc7QUFDbEMsYUFBSSxRQUFPOUksTUFBUCx5Q0FBT0EsTUFBUCxPQUFrQnNGLGFBQWxCLElBQ0d0RixPQUFPK0UsR0FBUCxLQUFleUQsYUFEdEIsRUFDcUM7QUFDakN4SSxvQkFBTytFLEdBQVAsR0FBYThELElBQWI7QUFDSDs7QUFFRCxnQkFBT0wsYUFBUDtBQUNILE1BUEQ7O0FBU0EsWUFBT0EsYUFBUDtBQUNILEVBN09BLENBQUQsQyIsImZpbGUiOiJjb250ZW50LXNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGJlZjE4ODNmNDI3Zjg0MDkwZTk5IiwiaW1wb3J0IGxvZyBmcm9tICdsb2dsZXZlbCc7XG5sb2cuc2V0TGV2ZWwoJ2RlYnVnJylcblxuY29uc3QgZ2V0UGFnZVRleHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmJvZHkuaW5uZXJUZXh0O1xufVxuY29uc3QgZ2V0VXJsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZjtcbn1cbmNvbnN0IGdldEJhc2VVcmwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ob3N0LnJlcGxhY2UoJ3d3dy4nLCcnKTtcbn1cbmNvbnN0IGNvbGxlY3RQYWdlRGF0YSA9IGZ1bmN0aW9uKCkge1xuICBjb25zdCBwYWdlVGV4dCA9IGdldFBhZ2VUZXh0KCk7XG4gIGNvbnN0IHVybCA9IGdldFVybCgpO1xuICBjb25zdCBiYXNlVXJsID0gZ2V0QmFzZVVybCgpO1xuICByZXR1cm4ge3VybDogdXJsLCBiYXNlVXJsOiBiYXNlVXJsLCBwYWdlVGV4dDogcGFnZVRleHR9XG59XG5cblxudmFyIHBpbmdEaXY7XG5jb25zdCBkcmF3ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG5jb25zdCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKVxuXG4vLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpeyBzZW5kUGFnZVRleHQoKTsgfSwgZmFsc2UpO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oZSl7XG4gIHNlbmRQYWdlVGV4dCgpXG59XG5cbmNvbnN0IHNlbmRQYWdlVGV4dCA9IGZ1bmN0aW9uKCkge1xuICBsb2cudHJhY2Uoc2VuZFBhZ2VUZXh0KTtcbiAgY29uc3QgcGFnZVRleHQgPSBnZXRQYWdlVGV4dCgpO1xuICBjb25zdCB1cmwgPSBnZXRVcmwoKTtcbiAgY29uc3QgYmFzZVVybCA9IGdldEJhc2VVcmwoKTtcbiAgbG9nLnRyYWNlKFtwYWdlVGV4dF0pO1xuICBsb2cuZGVidWcodXJsKTtcbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2FjdGlvbjogXCJjaGVja1BhZ2VcIiwgZGF0YToge3VybDogdXJsLCBiYXNlVXJsOiBiYXNlVXJsLCBwYWdlVGV4dDogcGFnZVRleHR9fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICBsb2cuZGVidWcocmVzcG9uc2UpO1xuICAgIGNvbnN0IG51bVBpbmdzID0gcmVzcG9uc2UucGluZ3MubGVuZ3RoXG4gICAgbG9nLmRlYnVnKFwibnVtUGluZ3M6IFwiLCBudW1QaW5ncyk7XG4gICAgaWYgKG51bVBpbmdzICYmIHBpbmdEaXYgIT0gLTEpIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nUGluZ3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JnZXQtbWUtbm90LXBpbmcnKTtcbiAgICAgIHdoaWxlKGV4aXN0aW5nUGluZ3MubGVuZ3RoID4gMCl7XG4gICAgICAgIGxvZy50cmFjZSgnRGVsZXRpbmcgZXhpc3RpbmcgcGluZycpO1xuICAgICAgICBleGlzdGluZ1BpbmdzWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZXhpc3RpbmdQaW5nc1swXSk7XG4gICAgICB9XG4gICAgICBpZiAocGluZ0RpdikgcGluZ0Rpdi5yZW1vdmUoKTtcbiAgICAgIHBpbmdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICBwaW5nRGl2LnN0eWxlLmNzc1RleHQgPSBcIlwiXG4gICAgICAgICsgXCJwb3NpdGlvbjogZml4ZWQ7XCJcbiAgICAgICAgKyBcInRvcDogMDtcIlxuICAgICAgICArIFwicmlnaHQ6IDA7XCJcbiAgICAgICAgKyBcIndpZHRoOiAzMDBweDtcIlxuICAgICAgICArIFwibWFyZ2luOiAyMHB4O1wiXG4gICAgICAgICsgXCJwYWRkaW5nOiAyMHB4IDM1cHg7XCJcbiAgICAgICAgKyBcImZvbnQtc2l6ZTogMTZweDtcIlxuICAgICAgICArIFwiZm9udC13ZWlnaHQ6IG5vcm1hbDtcIlxuICAgICAgICArIFwiY29sb3I6ICMzMzM7XCJcbiAgICAgICAgKyBcImJveC1zaGFkb3c6IHJnYmEoNTAsIDUwLCA1MCwgMC45NSkgMHB4IDBweCAzMHB4O1wiXG4gICAgICAgICsgXCJib3JkZXI6IG5vbmU7XCJcbiAgICAgICAgKyBcImJvcmRlci1yYWRpdXM6IDEwcHg7XCJcbiAgICAgICAgKyBcInotaW5kZXg6IDEwMDAwMDA7XCJcbiAgICAgICAgKyBcImJhY2tncm91bmQ6IHdoaXRlO1wiXG4gICAgICAgICsgXCJjdXJzb3I6IHBvaW50ZXI7XCJcbiAgICAgICAgKyBcImxpbmUtaGVpZ2h0OiAxLjQ7XCJcbiAgICAgICAgKyBcImZvbnQtZmFtaWx5OiBBcmlhbCwgc2Fucy1zZXJpZjtcIlxuICAgICAgdmFyIHBhZ2VGbG9hdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBwYWdlRmxvYXQuc3R5bGUuY3NzVGV4dCA9IFwiXCJcbiAgICAgICsgXCJmbG9hdDogcmlnaHQ7XCJcbiAgICAgIHBhZ2VGbG9hdC5pbm5lckhUTUwgPSBcIvCfkYbwn5GGXCI7XG4gICAgICBwaW5nRGl2LmFwcGVuZENoaWxkKHBhZ2VGbG9hdClcbiAgICAgIGNvbnN0IHRleHQxID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoKG51bVBpbmdzPT0xID8gXCJPbmUgbWVtb3J5XCIgOiBudW1QaW5ncytcIiBtZW1vcmllc1wiKSArIFwiIHJlbGV2YW50IHRvIHRoaXMgcGFnZSEg8J+Yg1wiKTtcbiAgICAgIHRleHQxLmNsYXNzTmFtZSA9ICdmb3JnZXQtbWUtbm90LXBpbmcnXG4gICAgICBwaW5nRGl2LmFwcGVuZENoaWxkKHRleHQxKVxuICAgICAgdmFyIHBhZ2VTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBwYWdlU3Bhbi5zdHlsZS5jc3NUZXh0ID0gXCJcIlxuICAgICAgICArIFwiY29sb3I6IGdyZXk7XCJcbiAgICAgICAgKyBcImZvbnQtc3R5bGU6IGl0YWxpYztcIlxuICAgICAgICArIFwibWFyZ2luLWxlZnQ6IDVweDtcIlxuICAgICAgcGFnZVNwYW4uaW5uZXJIVE1MID0gXCJDbGljayB0byB2aWV3XCI7XG4gICAgICBwaW5nRGl2LmFwcGVuZENoaWxkKHBhZ2VTcGFuKVxuICAgICAgcGluZ0Rpdi5vbmNsaWNrID0gZnVuY3Rpb24oZSl7XG4gICAgICAgIG9wZW5EcmF3ZXIoZSk7XG4gICAgICAgIHBpbmdEaXYucmVtb3ZlKCk7XG4gICAgICAgIHBpbmdEaXYgPSAtMVxuICAgICAgfTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGluZ0Rpdik7XG4gICAgICBsb2cudHJhY2UocGluZ0Rpdik7XG4gICAgfVxuICB9KTtcbn1cblxuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKXtcbiAgbG9nLnRyYWNlKCdSZXF1ZXN0IHJlY2VpdmVkJyk7XG4gIGlmKHJlcXVlc3QuYWN0aW9uID09IFwiZ2V0UGFnZURhdGFcIil7XG4gICAgbG9nLmRlYnVnKCcxJylcbiAgICBsb2cudHJhY2UoJ1JlY2VpdmVkIGdldFBhZ2VEYXRhIHJlcXVlc3QnKTtcbiAgICBjb25zdCBwYWdlRGF0YSA9IGNvbGxlY3RQYWdlRGF0YSgpXG4gICAgbG9nLmRlYnVnKHBhZ2VEYXRhKVxuICAgIHNlbmRSZXNwb25zZShwYWdlRGF0YSlcbiAgfVxuICBpZihyZXF1ZXN0LmV2ZW50ID09IFwicG9wdXBPcGVuZWRcIil7XG4gICAgbG9nLnRyYWNlKCdSZWNlaXZlZCBwb3B1cE9wZW5lZCBldmVudCcpO1xuICAgIGlmIChwaW5nRGl2KSBwaW5nRGl2LnJlbW92ZSgpO1xuICB9XG4gIGlmKHJlcXVlc3QuYWN0aW9uID09IFwidG9nZ2xlRHJhd2VyXCIpe1xuICAgIGxvZy50cmFjZSgnUmVjZWl2ZWQgdG9nZ2xlRHJhd2VyIGFjdGlvbicpO1xuICAgIHRvZ2dsZURyYXdlcigpXG4gIH1cbn0pXG5cbnNlbmRQYWdlVGV4dCgpO1xuXG5cblxuY29uc3QgY3JlYXRlRHJhd2VyID0gZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgZHJhd2VyLnN0eWxlLmNzc1RleHQgPSBcIlwiXG4gICAgICArIFwiYWxsOiBpbml0aWFsO1wiXG4gICAgICArIFwicG9zaXRpb246IGZpeGVkO1wiXG4gICAgICArIFwidG9wOiAwO1wiXG4gICAgICArIFwicmlnaHQ6IC00MDBweDtcIlxuICAgICAgKyBcImhlaWdodDogMTAwJTtcIlxuICAgICAgKyBcIndpZHRoOiA0MDBweDtcIlxuICAgICAgKyBcInotaW5kZXg6IDEwMDAwMDAwMDAwMDAwMDA7XCJcbiAgICAgICsgXCJiYWNrZ3JvdW5kOiB3aGl0ZTtcIlxuICAgICAgKyBcImJveC1zaGFkb3c6IHJnYmEoMCwgMCwgMCwgMC40KSAtMXB4IDNweCA1MHB4IDBweDtcIlxuICAgICAgKyBcInRyYW5zaXRpb246IGFsbCAwLjZzIGVhc2UgMHM7XCJcbiAgICBkcmF3ZXIuc2V0QXR0cmlidXRlKCdkYXRhLW9wZW5lZCcsICdmYWxzZScpXG5cbiAgICBpZnJhbWUuc3JjID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKCcuLi9wYWdlcy9wb3B1cC5odG1sJylcbiAgICBpZnJhbWUuaWQgPSAnZm9yZ2V0bWVub3QtZnJhbWUnXG4gICAgaWZyYW1lLnN0eWxlLmNzc1RleHQgPSBcIlwiXG4gICAgICArIFwiYWxsOiBpbml0aWFsO1wiXG4gICAgICArIFwicG9zaXRpb246IGFic29sdXRlO1wiXG4gICAgICArIFwidG9wOiAwO1wiXG4gICAgICArIFwiaGVpZ2h0OiAxMDAlO1wiXG4gICAgICArIFwibGVmdDogLTEwMCU7XCJcbiAgICAgICsgXCJ3aWR0aDogMjAwJTtcIlxuICAgICAgKyBcImJvcmRlcjogbm9uZTtcIlxuICAgICAgKyBcInBvaW50ZXItZXZlbnRzOiBub25lO1wiXG5cbiAgICBjb25zdCBjbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgIGNsb3NlLnN0eWxlLmNzc1RleHQgPSBcIlwiXG4gICAgICArIFwiYWxsOiBpbml0aWFsO1wiXG4gICAgICArIFwicG9zaXRpb246IGFic29sdXRlO1wiXG4gICAgICArIFwidG9wOiA2cHg7XCJcbiAgICAgICsgXCJsZWZ0OiA0cHg7XCJcbiAgICAgICsgXCJ6LWluZGV4OiAyMTQ3NDgzNjQ3O1wiXG4gICAgICArIFwiZm9udC1zaXplOiAyMHB4O1wiXG4gICAgICArIFwiY29sb3I6ICM5OTk7XCJcbiAgICAgICsgXCJmb250LWZhbWlseTogQXJpYWw7XCJcbiAgICAgICsgXCJib3JkZXItcmFkaXVzOiA2cHg7XCJcbiAgICAgICsgXCJwYWRkaW5nOiAwcHggOXB4IDJweDtcIlxuICAgICAgKyBcImN1cnNvcjogcG9pbnRlcjtcIlxuICAgICAgKyBcImZvbnQtd2VpZ2h0OiBib2xkO1wiXG4gICAgICArIFwicG9pbnRlci1ldmVudHM6IGFsbDtcIlxuICAgIGNsb3NlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCd4JykpXG5cbiAgICAvLyBDbGljayBFdmVudHNcbiAgICBjbG9zZS5vbmNsaWNrID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBjbG9zZURyYXdlcihlKVxuICAgIH07XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgLy8gbG9nLmluZm8ocGluZ0RpdilcbiAgICAgIHZhciBpc0NsaWNrSW5zaWRlID0gZHJhd2VyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgfHwgKHBpbmdEaXYgJiYgcGluZ0RpdiAhPSAtMSAmJiBwaW5nRGl2LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpO1xuXG4gICAgICBpZiAoIWlzQ2xpY2tJbnNpZGUpIHtcbiAgICAgICAgY2xvc2VEcmF3ZXIoZXZlbnQpXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0aW1lU2F2ZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRpbWVTYXZlZC5zdHlsZS5jc3NUZXh0ID0gXCJcIlxuICAgICAgKyBcImFsbDogaW5pdGlhbDtcIlxuICAgICAgKyBcImZvbnQtZmFtaWx5OiBMYXRvLCBBcmlhbCwgc2Fucy1zZXJpZjtcIlxuICAgICAgKyBcInBvc2l0aW9uOiBhYnNvbHV0ZTtcIlxuICAgICAgKyBcImJvdHRvbTogMDtcIlxuICAgICAgKyBcImxlZnQ6IDA7XCJcbiAgICAgICsgXCJyaWdodDogMDtcIlxuICAgICAgKyBcInBhZGRpbmc6IDIwcHg7XCJcbiAgICAgICsgXCJiYWNrZ3JvdW5kOiB3aGl0ZTtcIlxuICAgICAgKyBcImJveC1zaGFkb3c6IDBweCAwcHggMzBweCByZ2JhKDE1MCwxNTAsMTUwLDAuNSk7XCJcbiAgICAgICsgXCJjb2xvcjogIzk5OTtcIlxuICAgICAgKyBcInRleHQtYWxpZ246IGNlbnRlcjtcIlxuICAgICAgKyBcImZvbnQtd2VpZ2h0OiBib2xkO1wiXG4gICAgdGltZVNhdmVkLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdZb3VcXCd2ZSBzYXZlZCA0LjUgaG91cnMgc28gZmFyIHRoaXMgbW9udGghIPCfkqonKSlcblxuICAgIGRyYXdlci5hcHBlbmRDaGlsZChjbG9zZSk7XG4gICAgZHJhd2VyLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgZHJhd2VyLmFwcGVuZENoaWxkKHRpbWVTYXZlZCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkcmF3ZXIpO1xuICAgIGxvZy5pbmZvKGRyYXdlcilcbiAgfSBjYXRjaChlKSB7XG4gICAgbG9nLmVycm9yKGUpXG4gIH1cbn1cbmNvbnN0IGRpc3BsYXlQYWdlUmVzdWx0cyA9IGZ1bmN0aW9uKCkge1xuICBsb2cuaW5mbygnU2VuZGluZyBzZXRMb2FkaW5nIHRvIGZyYW1lJylcbiAgd2luZG93LmZyYW1lc1snZm9yZ2V0bWVub3QtZnJhbWUnXS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKHthY3Rpb246ICdzZXRMb2FkaW5nJ30sIFwiKlwiKTtcbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2FjdGlvbjogXCJnZXRQYWdlUmVzdWx0c1wiLCBkYXRhOiB7cGFnZURhdGE6IGNvbGxlY3RQYWdlRGF0YSgpfX0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IHthY3Rpb246IFwidXBkYXRlUGFnZVJlc3VsdHNcIiwgZGF0YToge3BhZ2VSZXN1bHRzOiByZXNwb25zZX19XG4gICAgbG9nLmluZm8obWVzc2FnZSlcbiAgICB3aW5kb3cuZnJhbWVzWydmb3JnZXRtZW5vdC1mcmFtZSddLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UobWVzc2FnZSwgXCIqXCIpO1xuICB9KVxufVxuY29uc3Qgb3BlbkRyYXdlciA9IGZ1bmN0aW9uKGUpIHtcbiAgLy8gbG9nLmluZm8oZHJhd2VyLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuZWQnKSlcbiAgaWYgKGRyYXdlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJykgIT0gJ3RydWUnICYmICghZSB8fCAhZS5kZWFsdFdpdGgpKSB7XG4gICAgZGlzcGxheVBhZ2VSZXN1bHRzKClcbiAgICBkcmF3ZXIuc3R5bGUucmlnaHQgPSAnMHB4J1xuICAgIGRyYXdlci5zdHlsZS5ib3hTaGFkb3cgPSBcInJnYmEoMCwgMCwgMCwgMC40KSAtMXB4IDNweCA1MHB4IDBweFwiXG4gICAgaWZyYW1lLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYWxsJ1xuICAgIGRyYXdlci5zZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJywgJ3RydWUnKVxuICAgIGxvZy5pbmZvKGRyYXdlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJykpXG4gIH1cbiAgaWYgKGUpIGUuZGVhbHRXaXRoID0gdHJ1ZVxufVxuY29uc3QgY2xvc2VEcmF3ZXIgPSBmdW5jdGlvbihlKSB7XG4gIC8vIGxvZy5pbmZvKGRyYXdlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJykpXG4gIGlmIChkcmF3ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW5lZCcpID09ICd0cnVlJyAmJiAoIWUgfHwgIWUuZGVhbHRXaXRoKSkge1xuICAgIGRyYXdlci5zdHlsZS5yaWdodCA9ICctJyArIGRyYXdlci5zdHlsZS53aWR0aFxuICAgIGRyYXdlci5zdHlsZS5ib3hTaGFkb3cgPSBcIm5vbmVcIlxuICAgIGlmcmFtZS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnXG4gICAgZHJhd2VyLnNldEF0dHJpYnV0ZSgnZGF0YS1vcGVuZWQnLCAnZmFsc2UnKVxuICB9XG4gIC8vIGxvZy5pbmZvKGRyYXdlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJykpXG4gIGlmIChlKSBlLmRlYWx0V2l0aCA9IHRydWVcbn1cbmNvbnN0IHRvZ2dsZURyYXdlciA9IGZ1bmN0aW9uKGUpIHtcbiAgaWYgKGRyYXdlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3BlbmVkJykgPT0gJ3RydWUnKSB7XG4gICAgY2xvc2VEcmF3ZXIoZSlcbiAgfSBlbHNlIHtcbiAgICBvcGVuRHJhd2VyKGUpXG4gIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICBzd2l0Y2ggKGV2ZW50LmRhdGEuYWN0aW9uKSB7XG4gICAgY2FzZSAnZ2V0UGFnZVJlc3VsdHMnOlxuICAgICAgbG9nLmluZm8oNSlcbiAgICAgIGRpc3BsYXlQYWdlUmVzdWx0cygpXG4gICAgICBicmVhaztcbiAgICBjYXNlICdjbG9zZURyYXdlcic6XG4gICAgICBjb25zb2xlLmxvZygnY2xvc2VEcmF3ZXInKVxuICAgICAgY2xvc2VEcmF3ZXIoKVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcblxuICB9XG59LCBmYWxzZSk7XG5cbmNyZWF0ZURyYXdlcigpXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvc2NyaXB0cy9jb250ZW50LXNjcmlwdC5qcyIsIi8qXG4qIGxvZ2xldmVsIC0gaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsXG4qXG4qIENvcHlyaWdodCAoYykgMjAxMyBUaW0gUGVycnlcbiogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuKi9cbihmdW5jdGlvbiAocm9vdCwgZGVmaW5pdGlvbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5sb2cgPSBkZWZpbml0aW9uKCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvLyBTbGlnaHRseSBkdWJpb3VzIHRyaWNrcyB0byBjdXQgZG93biBtaW5pbWl6ZWQgZmlsZSBzaXplXG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcblxuICAgIHZhciBsb2dNZXRob2RzID0gW1xuICAgICAgICBcInRyYWNlXCIsXG4gICAgICAgIFwiZGVidWdcIixcbiAgICAgICAgXCJpbmZvXCIsXG4gICAgICAgIFwid2FyblwiLFxuICAgICAgICBcImVycm9yXCJcbiAgICBdO1xuXG4gICAgLy8gQ3Jvc3MtYnJvd3NlciBiaW5kIGVxdWl2YWxlbnQgdGhhdCB3b3JrcyBhdCBsZWFzdCBiYWNrIHRvIElFNlxuICAgIGZ1bmN0aW9uIGJpbmRNZXRob2Qob2JqLCBtZXRob2ROYW1lKSB7XG4gICAgICAgIHZhciBtZXRob2QgPSBvYmpbbWV0aG9kTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgbWV0aG9kLmJpbmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYmluZChvYmopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChtZXRob2QsIG9iaik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gTWlzc2luZyBiaW5kIHNoaW0gb3IgSUU4ICsgTW9kZXJuaXpyLCBmYWxsYmFjayB0byB3cmFwcGluZ1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5hcHBseShtZXRob2QsIFtvYmosIGFyZ3VtZW50c10pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCdWlsZCB0aGUgYmVzdCBsb2dnaW5nIG1ldGhvZCBwb3NzaWJsZSBmb3IgdGhpcyBlbnZcbiAgICAvLyBXaGVyZXZlciBwb3NzaWJsZSB3ZSB3YW50IHRvIGJpbmQsIG5vdCB3cmFwLCB0byBwcmVzZXJ2ZSBzdGFjayB0cmFjZXNcbiAgICBmdW5jdGlvbiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHtcbiAgICAgICAgaWYgKG1ldGhvZE5hbWUgPT09ICdkZWJ1ZycpIHtcbiAgICAgICAgICAgIG1ldGhvZE5hbWUgPSAnbG9nJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBObyBtZXRob2QgcG9zc2libGUsIGZvciBub3cgLSBmaXhlZCBsYXRlciBieSBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZVttZXRob2ROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCBtZXRob2ROYW1lKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlLmxvZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCAnbG9nJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbm9vcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZXNlIHByaXZhdGUgZnVuY3Rpb25zIGFsd2F5cyBuZWVkIGB0aGlzYCB0byBiZSBzZXQgcHJvcGVybHlcblxuICAgIGZ1bmN0aW9uIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvZ01ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gbG9nTWV0aG9kc1tpXTtcbiAgICAgICAgICAgIHRoaXNbbWV0aG9kTmFtZV0gPSAoaSA8IGxldmVsKSA/XG4gICAgICAgICAgICAgICAgbm9vcCA6XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlZmluZSBsb2cubG9nIGFzIGFuIGFsaWFzIGZvciBsb2cuZGVidWdcbiAgICAgICAgdGhpcy5sb2cgPSB0aGlzLmRlYnVnO1xuICAgIH1cblxuICAgIC8vIEluIG9sZCBJRSB2ZXJzaW9ucywgdGhlIGNvbnNvbGUgaXNuJ3QgcHJlc2VudCB1bnRpbCB5b3UgZmlyc3Qgb3BlbiBpdC5cbiAgICAvLyBXZSBidWlsZCByZWFsTWV0aG9kKCkgcmVwbGFjZW1lbnRzIGhlcmUgdGhhdCByZWdlbmVyYXRlIGxvZ2dpbmcgbWV0aG9kc1xuICAgIGZ1bmN0aW9uIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHRoaXMsIGxldmVsLCBsb2dnZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQnkgZGVmYXVsdCwgd2UgdXNlIGNsb3NlbHkgYm91bmQgcmVhbCBtZXRob2RzIHdoZXJldmVyIHBvc3NpYmxlLCBhbmRcbiAgICAvLyBvdGhlcndpc2Ugd2Ugd2FpdCBmb3IgYSBjb25zb2xlIHRvIGFwcGVhciwgYW5kIHRoZW4gdHJ5IGFnYWluLlxuICAgIGZ1bmN0aW9uIGRlZmF1bHRNZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIHJldHVybiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHx8XG4gICAgICAgICAgICAgICBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gTG9nZ2VyKG5hbWUsIGRlZmF1bHRMZXZlbCwgZmFjdG9yeSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIGN1cnJlbnRMZXZlbDtcbiAgICAgIHZhciBzdG9yYWdlS2V5ID0gXCJsb2dsZXZlbFwiO1xuICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgc3RvcmFnZUtleSArPSBcIjpcIiArIG5hbWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWxOdW0pIHtcbiAgICAgICAgICB2YXIgbGV2ZWxOYW1lID0gKGxvZ01ldGhvZHNbbGV2ZWxOdW1dIHx8ICdzaWxlbnQnKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09IHVuZGVmaW5lZFR5cGUpIHJldHVybjtcblxuICAgICAgICAgIC8vIFVzZSBsb2NhbFN0b3JhZ2UgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XSA9IGxldmVsTmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cblxuICAgICAgICAgIC8vIFVzZSBzZXNzaW9uIGNvb2tpZSBhcyBmYWxsYmFja1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgPVxuICAgICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdG9yYWdlS2V5KSArIFwiPVwiICsgbGV2ZWxOYW1lICsgXCI7XCI7XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRQZXJzaXN0ZWRMZXZlbCgpIHtcbiAgICAgICAgICB2YXIgc3RvcmVkTGV2ZWw7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gdW5kZWZpbmVkVHlwZSkgcmV0dXJuO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB3aW5kb3cubG9jYWxTdG9yYWdlW3N0b3JhZ2VLZXldO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cblxuICAgICAgICAgIC8vIEZhbGxiYWNrIHRvIGNvb2tpZXMgaWYgbG9jYWwgc3RvcmFnZSBnaXZlcyB1cyBub3RoaW5nXG4gICAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgdmFyIGNvb2tpZSA9IHdpbmRvdy5kb2N1bWVudC5jb29raWU7XG4gICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBjb29raWUuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RvcmFnZUtleSkgKyBcIj1cIik7XG4gICAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IC9eKFteO10rKS8uZXhlYyhjb29raWUuc2xpY2UobG9jYXRpb24pKVsxXTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoZSBzdG9yZWQgbGV2ZWwgaXMgbm90IHZhbGlkLCB0cmVhdCBpdCBhcyBpZiBub3RoaW5nIHdhcyBzdG9yZWQuXG4gICAgICAgICAgaWYgKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdG9yZWRMZXZlbDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqXG4gICAgICAgKiBQdWJsaWMgbG9nZ2VyIEFQSSAtIHNlZSBodHRwczovL2dpdGh1Yi5jb20vcGltdGVycnkvbG9nbGV2ZWwgZm9yIGRldGFpbHNcbiAgICAgICAqXG4gICAgICAgKi9cblxuICAgICAgc2VsZi5sZXZlbHMgPSB7IFwiVFJBQ0VcIjogMCwgXCJERUJVR1wiOiAxLCBcIklORk9cIjogMiwgXCJXQVJOXCI6IDMsXG4gICAgICAgICAgXCJFUlJPUlwiOiA0LCBcIlNJTEVOVFwiOiA1fTtcblxuICAgICAgc2VsZi5tZXRob2RGYWN0b3J5ID0gZmFjdG9yeSB8fCBkZWZhdWx0TWV0aG9kRmFjdG9yeTtcblxuICAgICAgc2VsZi5nZXRMZXZlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY3VycmVudExldmVsO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5zZXRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCwgcGVyc2lzdCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwic3RyaW5nXCIgJiYgc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXZlbCA9IHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcIm51bWJlclwiICYmIGxldmVsID49IDAgJiYgbGV2ZWwgPD0gc2VsZi5sZXZlbHMuU0lMRU5UKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRMZXZlbCA9IGxldmVsO1xuICAgICAgICAgICAgICBpZiAocGVyc2lzdCAhPT0gZmFsc2UpIHsgIC8vIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICAgICAgICAgIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHNlbGYsIGxldmVsLCBuYW1lKTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlICYmIGxldmVsIDwgc2VsZi5sZXZlbHMuU0lMRU5UKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBjb25zb2xlIGF2YWlsYWJsZSBmb3IgbG9nZ2luZ1wiO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgXCJsb2cuc2V0TGV2ZWwoKSBjYWxsZWQgd2l0aCBpbnZhbGlkIGxldmVsOiBcIiArIGxldmVsO1xuICAgICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc2V0RGVmYXVsdExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XG4gICAgICAgICAgaWYgKCFnZXRQZXJzaXN0ZWRMZXZlbCgpKSB7XG4gICAgICAgICAgICAgIHNlbGYuc2V0TGV2ZWwobGV2ZWwsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmVuYWJsZUFsbCA9IGZ1bmN0aW9uKHBlcnNpc3QpIHtcbiAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlRSQUNFLCBwZXJzaXN0KTtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKHBlcnNpc3QpIHtcbiAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlNJTEVOVCwgcGVyc2lzdCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBJbml0aWFsaXplIHdpdGggdGhlIHJpZ2h0IGxldmVsXG4gICAgICB2YXIgaW5pdGlhbExldmVsID0gZ2V0UGVyc2lzdGVkTGV2ZWwoKTtcbiAgICAgIGlmIChpbml0aWFsTGV2ZWwgPT0gbnVsbCkge1xuICAgICAgICAgIGluaXRpYWxMZXZlbCA9IGRlZmF1bHRMZXZlbCA9PSBudWxsID8gXCJXQVJOXCIgOiBkZWZhdWx0TGV2ZWw7XG4gICAgICB9XG4gICAgICBzZWxmLnNldExldmVsKGluaXRpYWxMZXZlbCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICpcbiAgICAgKiBUb3AtbGV2ZWwgQVBJXG4gICAgICpcbiAgICAgKi9cblxuICAgIHZhciBkZWZhdWx0TG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuXG4gICAgdmFyIF9sb2dnZXJzQnlOYW1lID0ge307XG4gICAgZGVmYXVsdExvZ2dlci5nZXRMb2dnZXIgPSBmdW5jdGlvbiBnZXRMb2dnZXIobmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIgfHwgbmFtZSA9PT0gXCJcIikge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJZb3UgbXVzdCBzdXBwbHkgYSBuYW1lIHdoZW4gY3JlYXRpbmcgYSBsb2dnZXIuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvZ2dlciA9IF9sb2dnZXJzQnlOYW1lW25hbWVdO1xuICAgICAgICBpZiAoIWxvZ2dlcikge1xuICAgICAgICAgIGxvZ2dlciA9IF9sb2dnZXJzQnlOYW1lW25hbWVdID0gbmV3IExvZ2dlcihcbiAgICAgICAgICAgIG5hbWUsIGRlZmF1bHRMb2dnZXIuZ2V0TGV2ZWwoKSwgZGVmYXVsdExvZ2dlci5tZXRob2RGYWN0b3J5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9nZ2VyO1xuICAgIH07XG5cbiAgICAvLyBHcmFiIHRoZSBjdXJyZW50IGdsb2JhbCBsb2cgdmFyaWFibGUgaW4gY2FzZSBvZiBvdmVyd3JpdGVcbiAgICB2YXIgX2xvZyA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSA/IHdpbmRvdy5sb2cgOiB1bmRlZmluZWQ7XG4gICAgZGVmYXVsdExvZ2dlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXG4gICAgICAgICAgICAgICB3aW5kb3cubG9nID09PSBkZWZhdWx0TG9nZ2VyKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9nID0gX2xvZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWZhdWx0TG9nZ2VyO1xuICAgIH07XG5cbiAgICByZXR1cm4gZGVmYXVsdExvZ2dlcjtcbn0pKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vbG9nbGV2ZWwvbGliL2xvZ2xldmVsLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==