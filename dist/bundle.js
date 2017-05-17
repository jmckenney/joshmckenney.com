/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * vivus - JavaScript library to make drawing animation on SVG
 * @version v0.4.0
 * @link https://github.com/maxwellito/vivus
 * @license MIT
 */



(function (window, document) {

  'use strict';

/**
 * Pathformer
 * Beta version
 *
 * Take any SVG version 1.1 and transform
 * child elements to 'path' elements
 *
 * This code is purely forked from
 * https://github.com/Waest/SVGPathConverter
 */

/**
 * Class constructor
 *
 * @param {DOM|String} element Dom element of the SVG or id of it
 */
function Pathformer(element) {
  // Test params
  if (typeof element === 'undefined') {
    throw new Error('Pathformer [constructor]: "element" parameter is required');
  }

  // Set the element
  if (element.constructor === String) {
    element = document.getElementById(element);
    if (!element) {
      throw new Error('Pathformer [constructor]: "element" parameter is not related to an existing ID');
    }
  }
  if (element.constructor instanceof window.SVGElement || /^svg$/i.test(element.nodeName)) {
    this.el = element;
  } else {
    throw new Error('Pathformer [constructor]: "element" parameter must be a string or a SVGelement');
  }

  // Start
  this.scan(element);
}

/**
 * List of tags which can be transformed
 * to path elements
 *
 * @type {Array}
 */
Pathformer.prototype.TYPES = ['line', 'ellipse', 'circle', 'polygon', 'polyline', 'rect'];

/**
 * List of attribute names which contain
 * data. This array list them to check if
 * they contain bad values, like percentage.
 *
 * @type {Array}
 */
Pathformer.prototype.ATTR_WATCH = ['cx', 'cy', 'points', 'r', 'rx', 'ry', 'x', 'x1', 'x2', 'y', 'y1', 'y2'];

/**
 * Finds the elements compatible for transform
 * and apply the liked method
 *
 * @param  {object} options Object from the constructor
 */
Pathformer.prototype.scan = function (svg) {
  var fn, element, pathData, pathDom,
      elements = svg.querySelectorAll(this.TYPES.join(','));

  for (var i = 0; i < elements.length; i++) {
    element = elements[i];
    fn = this[element.tagName.toLowerCase() + 'ToPath'];
    pathData = fn(this.parseAttr(element.attributes));
    pathDom = this.pathMaker(element, pathData);
    element.parentNode.replaceChild(pathDom, element);
  }
};


/**
 * Read `line` element to extract and transform
 * data, to make it ready for a `path` object.
 *
 * @param  {DOMelement} element Line element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.lineToPath = function (element) {
  var newElement = {},
      x1 = element.x1 || 0,
      y1 = element.y1 || 0,
      x2 = element.x2 || 0,
      y2 = element.y2 || 0;

  newElement.d = 'M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2;
  return newElement;
};

/**
 * Read `rect` element to extract and transform
 * data, to make it ready for a `path` object.
 * The radius-border is not taken in charge yet.
 * (your help is more than welcomed)
 *
 * @param  {DOMelement} element Rect element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.rectToPath = function (element) {
  var newElement = {},
      x      = parseFloat(element.x)      || 0,
      y      = parseFloat(element.y)      || 0,
      width  = parseFloat(element.width)  || 0,
      height = parseFloat(element.height) || 0;

  newElement.d  = 'M' + x + ' ' + y + ' ';
  newElement.d += 'L' + (x + width) + ' ' + y + ' ';
  newElement.d += 'L' + (x + width) + ' ' + (y + height) + ' ';
  newElement.d += 'L' + x + ' ' + (y + height) + ' Z';
  return newElement;
};

/**
 * Read `polyline` element to extract and transform
 * data, to make it ready for a `path` object.
 *
 * @param  {DOMelement} element Polyline element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.polylineToPath = function (element) {
  var newElement = {},
      points = element.points.trim().split(' '),
      i, path;

  // Reformatting if points are defined without commas
  if (element.points.indexOf(',') === -1) {
    var formattedPoints = [];
    for (i = 0; i < points.length; i+=2) {
      formattedPoints.push(points[i] + ',' + points[i+1]);
    }
    points = formattedPoints;
  }

  // Generate the path.d value
  path = 'M' + points[0];
  for(i = 1; i < points.length; i++) {
    if (points[i].indexOf(',') !== -1) {
      path += 'L' + points[i];
    }
  }
  newElement.d = path;
  return newElement;
};

/**
 * Read `polygon` element to extract and transform
 * data, to make it ready for a `path` object.
 * This method rely on polylineToPath, because the
 * logic is similar. The path created is just closed,
 * so it needs an 'Z' at the end.
 *
 * @param  {DOMelement} element Polygon element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.polygonToPath = function (element) {
  var newElement = Pathformer.prototype.polylineToPath(element);

  newElement.d += 'Z';
  return newElement;
};

/**
 * Read `ellipse` element to extract and transform
 * data, to make it ready for a `path` object.
 *
 * @param  {DOMelement} element ellipse element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.ellipseToPath = function (element) {
  var newElement = {},
      rx = parseFloat(element.rx) || 0,
      ry = parseFloat(element.ry) || 0,
      cx = parseFloat(element.cx) || 0,
      cy = parseFloat(element.cy) || 0,
      startX = cx - rx,
      startY = cy,
      endX = parseFloat(cx) + parseFloat(rx),
      endY = cy;

  newElement.d = 'M' + startX + ',' + startY +
                 'A' + rx + ',' + ry + ' 0,1,1 ' + endX + ',' + endY +
                 'A' + rx + ',' + ry + ' 0,1,1 ' + startX + ',' + endY;
  return newElement;
};

/**
 * Read `circle` element to extract and transform
 * data, to make it ready for a `path` object.
 *
 * @param  {DOMelement} element Circle element to transform
 * @return {object}             Data for a `path` element
 */
Pathformer.prototype.circleToPath = function (element) {
  var newElement = {},
      r  = parseFloat(element.r)  || 0,
      cx = parseFloat(element.cx) || 0,
      cy = parseFloat(element.cy) || 0,
      startX = cx - r,
      startY = cy,
      endX = parseFloat(cx) + parseFloat(r),
      endY = cy;
      
  newElement.d =  'M' + startX + ',' + startY +
                  'A' + r + ',' + r + ' 0,1,1 ' + endX + ',' + endY +
                  'A' + r + ',' + r + ' 0,1,1 ' + startX + ',' + endY;
  return newElement;
};

/**
 * Create `path` elements form original element
 * and prepared objects
 *
 * @param  {DOMelement} element  Original element to transform
 * @param  {object} pathData     Path data (from `toPath` methods)
 * @return {DOMelement}          Path element
 */
Pathformer.prototype.pathMaker = function (element, pathData) {
  var i, attr, pathTag = document.createElementNS('http://www.w3.org/2000/svg','path');
  for(i = 0; i < element.attributes.length; i++) {
    attr = element.attributes[i];
    if (this.ATTR_WATCH.indexOf(attr.name) === -1) {
      pathTag.setAttribute(attr.name, attr.value);
    }
  }
  for(i in pathData) {
    pathTag.setAttribute(i, pathData[i]);
  }
  return pathTag;
};

/**
 * Parse attributes of a DOM element to
 * get an object of attribute => value
 *
 * @param  {NamedNodeMap} attributes Attributes object from DOM element to parse
 * @return {object}                  Object of attributes
 */
Pathformer.prototype.parseAttr = function (element) {
  var attr, output = {};
  for (var i = 0; i < element.length; i++) {
    attr = element[i];
    // Check if no data attribute contains '%', or the transformation is impossible
    if (this.ATTR_WATCH.indexOf(attr.name) !== -1 && attr.value.indexOf('%') !== -1) {
      throw new Error('Pathformer [parseAttr]: a SVG shape got values in percentage. This cannot be transformed into \'path\' tags. Please use \'viewBox\'.');
    }
    output[attr.name] = attr.value;
  }
  return output;
};

  'use strict';

var requestAnimFrame, cancelAnimFrame, parsePositiveInt;

/**
 * Vivus
 * Beta version
 *
 * Take any SVG and make the animation
 * to give give the impression of live drawing
 *
 * This in more than just inspired from codrops
 * At that point, it's a pure fork.
 */

/**
 * Class constructor
 * option structure
 *   type: 'delayed'|'sync'|'oneByOne'|'script' (to know if the items must be drawn synchronously or not, default: delayed)
 *   duration: <int> (in frames)
 *   start: 'inViewport'|'manual'|'autostart' (start automatically the animation, default: inViewport)
 *   delay: <int> (delay between the drawing of first and last path)
 *   dashGap <integer> whitespace extra margin between dashes
 *   pathTimingFunction <function> timing animation function for each path element of the SVG
 *   animTimingFunction <function> timing animation function for the complete SVG
 *   forceRender <boolean> force the browser to re-render all updated path items
 *   selfDestroy <boolean> removes all extra styling on the SVG, and leaves it as original
 *
 * The attribute 'type' is by default on 'delayed'.
 *  - 'delayed'
 *    all paths are draw at the same time but with a
 *    little delay between them before start
 *  - 'sync'
 *    all path are start and finish at the same time
 *  - 'oneByOne'
 *    only one path is draw at the time
 *    the end of the first one will trigger the draw
 *    of the next one
 *
 * All these values can be overwritten individually
 * for each path item in the SVG
 * The value of frames will always take the advantage of
 * the duration value.
 * If you fail somewhere, an error will be thrown.
 * Good luck.
 *
 * @constructor
 * @this {Vivus}
 * @param {DOM|String}   element  Dom element of the SVG or id of it
 * @param {Object}       options  Options about the animation
 * @param {Function}     callback Callback for the end of the animation
 */
function Vivus (element, options, callback) {

  // Setup
  this.isReady = false;
  this.setElement(element, options);
  this.setOptions(options);
  this.setCallback(callback);

  if (this.isReady) {
    this.init();
  }
}

/**
 * Timing functions
 **************************************
 *
 * Default functions to help developers.
 * It always take a number as parameter (between 0 to 1) then
 * return a number (between 0 and 1)
 */
Vivus.LINEAR          = function (x) {return x;};
Vivus.EASE            = function (x) {return -Math.cos(x * Math.PI) / 2 + 0.5;};
Vivus.EASE_OUT        = function (x) {return 1 - Math.pow(1-x, 3);};
Vivus.EASE_IN         = function (x) {return Math.pow(x, 3);};
Vivus.EASE_OUT_BOUNCE = function (x) {
  var base = -Math.cos(x * (0.5 * Math.PI)) + 1,
    rate = Math.pow(base,1.5),
    rateR = Math.pow(1 - x, 2),
    progress = -Math.abs(Math.cos(rate * (2.5 * Math.PI) )) + 1;
  return (1- rateR) + (progress * rateR);
};


/**
 * Setters
 **************************************
 */

/**
 * Check and set the element in the instance
 * The method will not return anything, but will throw an
 * error if the parameter is invalid
 *
 * @param {DOM|String}   element  SVG Dom element or id of it
 */
Vivus.prototype.setElement = function (element, options) {
  // Basic check
  if (typeof element === 'undefined') {
    throw new Error('Vivus [constructor]: "element" parameter is required');
  }

  // Set the element
  if (element.constructor === String) {
    element = document.getElementById(element);
    if (!element) {
      throw new Error('Vivus [constructor]: "element" parameter is not related to an existing ID');
    }
  }
  this.parentEl = element;

  // Create the object element if the property `file` exists in the options object
  if (options && options.file) {
    var objElm = document.createElement('object');
    objElm.setAttribute('type', 'image/svg+xml');
    objElm.setAttribute('data', options.file);
    objElm.setAttribute('built-by-vivus', 'true');
    element.appendChild(objElm);
    element = objElm;
  }

  switch (element.constructor) {
  case window.SVGSVGElement:
  case window.SVGElement:
    this.el = element;
    this.isReady = true;
    break;

  case window.HTMLObjectElement:
    // If we have to wait for it
    var onLoad, self;

    self = this;
    onLoad = function (e) {
      if (self.isReady) {
        return;
      }
      self.el = element.contentDocument && element.contentDocument.querySelector('svg');
      if (!self.el && e) {
        throw new Error('Vivus [constructor]: object loaded does not contain any SVG');
      }
      else if (self.el) {
        if (element.getAttribute('built-by-vivus')) {
          self.parentEl.insertBefore(self.el, element);
          self.parentEl.removeChild(element);
          self.el.setAttribute('width', '100%');
          self.el.setAttribute('height', '100%');
        }
        self.isReady = true;
        self.init();
        return true;
      }
    };

    if (!onLoad()) {
      element.addEventListener('load', onLoad);
    }
    break;

  default:
    throw new Error('Vivus [constructor]: "element" parameter is not valid (or miss the "file" attribute)');
  }
};

/**
 * Set up user option to the instance
 * The method will not return anything, but will throw an
 * error if the parameter is invalid
 *
 * @param  {object} options Object from the constructor
 */
Vivus.prototype.setOptions = function (options) {
  var allowedTypes = ['delayed', 'sync', 'async', 'nsync', 'oneByOne', 'scenario', 'scenario-sync'];
  var allowedStarts =  ['inViewport', 'manual', 'autostart'];

  // Basic check
  if (options !== undefined && options.constructor !== Object) {
    throw new Error('Vivus [constructor]: "options" parameter must be an object');
  }
  else {
    options = options || {};
  }

  // Set the animation type
  if (options.type && allowedTypes.indexOf(options.type) === -1) {
    throw new Error('Vivus [constructor]: ' + options.type + ' is not an existing animation `type`');
  }
  else {
    this.type = options.type || allowedTypes[0];
  }

  // Set the start type
  if (options.start && allowedStarts.indexOf(options.start) === -1) {
    throw new Error('Vivus [constructor]: ' + options.start + ' is not an existing `start` option');
  }
  else {
    this.start = options.start || allowedStarts[0];
  }

  this.isIE         = (window.navigator.userAgent.indexOf('MSIE') !== -1 || window.navigator.userAgent.indexOf('Trident/') !== -1 || window.navigator.userAgent.indexOf('Edge/') !== -1 );
  this.duration     = parsePositiveInt(options.duration, 120);
  this.delay        = parsePositiveInt(options.delay, null);
  this.dashGap      = parsePositiveInt(options.dashGap, 1);
  this.forceRender  = options.hasOwnProperty('forceRender') ? !!options.forceRender : this.isIE;
  this.reverseStack = !!options.reverseStack;
  this.selfDestroy  = !!options.selfDestroy;
  this.onReady      = options.onReady;
  this.map          = [];
  this.frameLength  = this.currentFrame = this.delayUnit = this.speed = this.handle = null;

  this.ignoreInvisible = options.hasOwnProperty('ignoreInvisible') ? !!options.ignoreInvisible : false;

  this.animTimingFunction = options.animTimingFunction || Vivus.LINEAR;
  this.pathTimingFunction = options.pathTimingFunction || Vivus.LINEAR;

  if (this.delay >= this.duration) {
    throw new Error('Vivus [constructor]: delay must be shorter than duration');
  }
};

/**
 * Set up callback to the instance
 * The method will not return enything, but will throw an
 * error if the parameter is invalid
 *
 * @param  {Function} callback Callback for the animation end
 */
Vivus.prototype.setCallback = function (callback) {
  // Basic check
  if (!!callback && callback.constructor !== Function) {
    throw new Error('Vivus [constructor]: "callback" parameter must be a function');
  }
  this.callback = callback || function () {};
};


/**
 * Core
 **************************************
 */

/**
 * Map the svg, path by path.
 * The method return nothing, it just fill the
 * `map` array. Each item in this array represent
 * a path element from the SVG, with informations for
 * the animation.
 *
 * ```
 * [
 *   {
 *     el: <DOMobj> the path element
 *     length: <number> length of the path line
 *     startAt: <number> time start of the path animation (in frames)
 *     duration: <number> path animation duration (in frames)
 *   },
 *   ...
 * ]
 * ```
 *
 */
Vivus.prototype.mapping = function () {
  var i, paths, path, pAttrs, pathObj, totalLength, lengthMeter, timePoint;
  timePoint = totalLength = lengthMeter = 0;
  paths = this.el.querySelectorAll('path');

  for (i = 0; i < paths.length; i++) {
    path = paths[i];
    if (this.isInvisible(path)) {
      continue;
    }
    pathObj = {
      el: path,
      length: Math.ceil(path.getTotalLength())
    };
    // Test if the path length is correct
    if (isNaN(pathObj.length)) {
      if (window.console && console.warn) {
        console.warn('Vivus [mapping]: cannot retrieve a path element length', path);
      }
      continue;
    }
    this.map.push(pathObj);
    path.style.strokeDasharray  = pathObj.length + ' ' + (pathObj.length + this.dashGap * 2);
    path.style.strokeDashoffset = pathObj.length + this.dashGap;
    pathObj.length += this.dashGap;
    totalLength += pathObj.length;

    this.renderPath(i);
  }

  totalLength = totalLength === 0 ? 1 : totalLength;
  this.delay = this.delay === null ? this.duration / 3 : this.delay;
  this.delayUnit = this.delay / (paths.length > 1 ? paths.length - 1 : 1);

  // Reverse stack if asked
  if (this.reverseStack) {
    this.map.reverse();
  }

  for (i = 0; i < this.map.length; i++) {
    pathObj = this.map[i];

    switch (this.type) {
    case 'delayed':
      pathObj.startAt = this.delayUnit * i;
      pathObj.duration = this.duration - this.delay;
      break;

    case 'oneByOne':
      pathObj.startAt = lengthMeter / totalLength * this.duration;
      pathObj.duration = pathObj.length / totalLength * this.duration;
      break;

    case 'sync':
    case 'async':
    case 'nsync':
      pathObj.startAt = 0;
      pathObj.duration = this.duration;
      break;

    case 'scenario-sync':
      path = pathObj.el;
      pAttrs = this.parseAttr(path);
      pathObj.startAt = timePoint + (parsePositiveInt(pAttrs['data-delay'], this.delayUnit) || 0);
      pathObj.duration = parsePositiveInt(pAttrs['data-duration'], this.duration);
      timePoint = pAttrs['data-async'] !== undefined ? pathObj.startAt : pathObj.startAt + pathObj.duration;
      this.frameLength = Math.max(this.frameLength, (pathObj.startAt + pathObj.duration));
      break;

    case 'scenario':
      path = pathObj.el;
      pAttrs = this.parseAttr(path);
      pathObj.startAt = parsePositiveInt(pAttrs['data-start'], this.delayUnit) || 0;
      pathObj.duration = parsePositiveInt(pAttrs['data-duration'], this.duration);
      this.frameLength = Math.max(this.frameLength, (pathObj.startAt + pathObj.duration));
      break;
    }
    lengthMeter += pathObj.length;
    this.frameLength = this.frameLength || this.duration;
  }
};

/**
 * Interval method to draw the SVG from current
 * position of the animation. It update the value of
 * `currentFrame` and re-trace the SVG.
 *
 * It use this.handle to store the requestAnimationFrame
 * and clear it one the animation is stopped. So this
 * attribute can be used to know if the animation is
 * playing.
 *
 * Once the animation at the end, this method will
 * trigger the Vivus callback.
 *
 */
Vivus.prototype.drawer = function () {
  var self = this;
  this.currentFrame += this.speed;

  if (this.currentFrame <= 0) {
    this.stop();
    this.reset();
  } else if (this.currentFrame >= this.frameLength) {
    this.stop();
    this.currentFrame = this.frameLength;
    this.trace();
    if (this.selfDestroy) {
      this.destroy();
    }
  } else {
    this.trace();
    this.handle = requestAnimFrame(function () {
      self.drawer();
    });
    return;
  }

  this.callback(this);
  if (this.instanceCallback) {
    this.instanceCallback(this);
    this.instanceCallback = null;
  }
};

/**
 * Draw the SVG at the current instant from the
 * `currentFrame` value. Here is where most of the magic is.
 * The trick is to use the `strokeDashoffset` style property.
 *
 * For optimisation reasons, a new property called `progress`
 * is added in each item of `map`. This one contain the current
 * progress of the path element. Only if the new value is different
 * the new value will be applied to the DOM element. This
 * method save a lot of resources to re-render the SVG. And could
 * be improved if the animation couldn't be played forward.
 *
 */
Vivus.prototype.trace = function () {
  var i, progress, path, currentFrame;
  currentFrame = this.animTimingFunction(this.currentFrame / this.frameLength) * this.frameLength;
  for (i = 0; i < this.map.length; i++) {
    path = this.map[i];
    progress = (currentFrame - path.startAt) / path.duration;
    progress = this.pathTimingFunction(Math.max(0, Math.min(1, progress)));
    if (path.progress !== progress) {
      path.progress = progress;
      path.el.style.strokeDashoffset = Math.floor(path.length * (1 - progress));
      this.renderPath(i);
    }
  }
};

/**
 * Method forcing the browser to re-render a path element
 * from it's index in the map. Depending on the `forceRender`
 * value.
 * The trick is to replace the path element by it's clone.
 * This practice is not recommended because it's asking more
 * ressources, too much DOM manupulation..
 * but it's the only way to let the magic happen on IE.
 * By default, this fallback is only applied on IE.
 *
 * @param  {Number} index Path index
 */
Vivus.prototype.renderPath = function (index) {
  if (this.forceRender && this.map && this.map[index]) {
    var pathObj = this.map[index],
        newPath = pathObj.el.cloneNode(true);
    pathObj.el.parentNode.replaceChild(newPath, pathObj.el);
    pathObj.el = newPath;
  }
};

/**
 * When the SVG object is loaded and ready,
 * this method will continue the initialisation.
 *
 * This this mainly due to the case of passing an
 * object tag in the constructor. It will wait
 * the end of the loading to initialise.
 *
 */
Vivus.prototype.init = function () {
  // Set object variables
  this.frameLength = 0;
  this.currentFrame = 0;
  this.map = [];

  // Start
  new Pathformer(this.el);
  this.mapping();
  this.starter();

  if (this.onReady) {
    this.onReady(this);
  }
};

/**
 * Trigger to start of the animation.
 * Depending on the `start` value, a different script
 * will be applied.
 *
 * If the `start` value is not valid, an error will be thrown.
 * Even if technically, this is impossible.
 *
 */
Vivus.prototype.starter = function () {
  switch (this.start) {
  case 'manual':
    return;

  case 'autostart':
    this.play();
    break;

  case 'inViewport':
    var self = this,
    listener = function () {
      if (self.isInViewport(self.parentEl, 1)) {
        self.play();
        window.removeEventListener('scroll', listener);
      }
    };
    window.addEventListener('scroll', listener);
    listener();
    break;
  }
};


/**
 * Controls
 **************************************
 */

/**
 * Get the current status of the animation between
 * three different states: 'start', 'progress', 'end'.
 * @return {string} Instance status
 */
Vivus.prototype.getStatus = function () {
  return this.currentFrame === 0 ? 'start' : this.currentFrame === this.frameLength ? 'end' : 'progress';
};

/**
 * Reset the instance to the initial state : undraw
 * Be careful, it just reset the animation, if you're
 * playing the animation, this won't stop it. But just
 * make it start from start.
 *
 */
Vivus.prototype.reset = function () {
  return this.setFrameProgress(0);
};

/**
 * Set the instance to the final state : drawn
 * Be careful, it just set the animation, if you're
 * playing the animation on rewind, this won't stop it.
 * But just make it start from the end.
 *
 */
Vivus.prototype.finish = function () {
  return this.setFrameProgress(1);
};

/**
 * Set the level of progress of the drawing.
 *
 * @param {number} progress Level of progress to set
 */
Vivus.prototype.setFrameProgress = function (progress) {
  progress = Math.min(1, Math.max(0, progress));
  this.currentFrame = Math.round(this.frameLength * progress);
  this.trace();
  return this;
};

/**
 * Play the animation at the desired speed.
 * Speed must be a valid number (no zero).
 * By default, the speed value is 1.
 * But a negative value is accepted to go forward.
 *
 * And works with float too.
 * But don't forget we are in JavaScript, se be nice
 * with him and give him a 1/2^x value.
 *
 * @param  {number} speed Animation speed [optional]
 */
Vivus.prototype.play = function (speed, callback) {
  this.instanceCallback = null;

  if (speed && typeof speed === 'function') {
    this.instanceCallback = speed; // first parameter is actually the callback function
    speed = null;
  }
  else if (speed && typeof speed !== 'number') {
    throw new Error('Vivus [play]: invalid speed');
  }
  // if the first parameter wasn't the callback, check if the seconds was
  if (callback && typeof(callback) === 'function' && !this.instanceCallback) {
    this.instanceCallback = callback;
  }


  this.speed = speed || 1;
  if (!this.handle) {
    this.drawer();
  }
  return this;
};

/**
 * Stop the current animation, if on progress.
 * Should not trigger any error.
 *
 */
Vivus.prototype.stop = function () {
  if (this.handle) {
    cancelAnimFrame(this.handle);
    this.handle = null;
  }
  return this;
};

/**
 * Destroy the instance.
 * Remove all bad styling attributes on all
 * path tags
 *
 */
Vivus.prototype.destroy = function () {
  this.stop();
  var i, path;
  for (i = 0; i < this.map.length; i++) {
    path = this.map[i];
    path.el.style.strokeDashoffset = null;
    path.el.style.strokeDasharray = null;
    this.renderPath(i);
  }
};


/**
 * Utils methods
 * include methods from Codrops
 **************************************
 */

/**
 * Method to best guess if a path should added into
 * the animation or not.
 *
 * 1. Use the `data-vivus-ignore` attribute if set
 * 2. Check if the instance must ignore invisible paths
 * 3. Check if the path is visible
 *
 * For now the visibility checking is unstable.
 * It will be used for a beta phase.
 *
 * Other improvments are planned. Like detecting
 * is the path got a stroke or a valid opacity.
 */
Vivus.prototype.isInvisible = function (el) {
  var rect,
    ignoreAttr = el.getAttribute('data-ignore');

  if (ignoreAttr !== null) {
    return ignoreAttr !== 'false';
  }

  if (this.ignoreInvisible) {
    rect = el.getBoundingClientRect();
    return !rect.width && !rect.height;
  }
  else {
    return false;
  }
};

/**
 * Parse attributes of a DOM element to
 * get an object of {attributeName => attributeValue}
 *
 * @param  {object} element DOM element to parse
 * @return {object}         Object of attributes
 */
Vivus.prototype.parseAttr = function (element) {
  var attr, output = {};
  if (element && element.attributes) {
    for (var i = 0; i < element.attributes.length; i++) {
      attr = element.attributes[i];
      output[attr.name] = attr.value;
    }
  }
  return output;
};

/**
 * Reply if an element is in the page viewport
 *
 * @param  {object} el Element to observe
 * @param  {number} h  Percentage of height
 * @return {boolean}
 */
Vivus.prototype.isInViewport = function (el, h) {
  var scrolled   = this.scrollY(),
    viewed       = scrolled + this.getViewportH(),
    elBCR        = el.getBoundingClientRect(),
    elHeight     = elBCR.height,
    elTop        = scrolled + elBCR.top,
    elBottom     = elTop + elHeight;

  // if 0, the element is considered in the viewport as soon as it enters.
  // if 1, the element is considered in the viewport only when it's fully inside
  // value in percentage (1 >= h >= 0)
  h = h || 0;

  return (elTop + elHeight * h) <= viewed && (elBottom) >= scrolled;
};

/**
 * Alias for document element
 *
 * @type {DOMelement}
 */
Vivus.prototype.docElem = window.document.documentElement;

/**
 * Get the viewport height in pixels
 *
 * @return {integer} Viewport height
 */
Vivus.prototype.getViewportH = function () {
  var client = this.docElem.clientHeight,
    inner = window.innerHeight;

  if (client < inner) {
    return inner;
  }
  else {
    return client;
  }
};

/**
 * Get the page Y offset
 *
 * @return {integer} Page Y offset
 */
Vivus.prototype.scrollY = function () {
  return window.pageYOffset || this.docElem.scrollTop;
};

/**
 * Alias for `requestAnimationFrame` or
 * `setTimeout` function for deprecated browsers.
 *
 */
requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(/* function */ callback){
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();

/**
 * Alias for `cancelAnimationFrame` or
 * `cancelTimeout` function for deprecated browsers.
 *
 */
cancelAnimFrame = (function () {
  return (
    window.cancelAnimationFrame       ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame    ||
    window.oCancelAnimationFrame      ||
    window.msCancelAnimationFrame     ||
    function(id){
      return window.clearTimeout(id);
    }
  );
})();

/**
 * Parse string to integer.
 * If the number is not positive or null
 * the method will return the default value
 * or 0 if undefined
 *
 * @param {string} value String to parse
 * @param {*} defaultValue Value to return if the result parsed is invalid
 * @return {number}
 *
 */
parsePositiveInt = function (value, defaultValue) {
  var output = parseInt(value, 10);
  return (output >= 0) ? output : defaultValue;
};


  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return Vivus;
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = Vivus;
  } else {
    // Browser globals
    window.Vivus = Vivus;
  }

}(window, document));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// page load intro
var Vivus = __webpack_require__(2);
__webpack_require__(0);
__webpack_require__(1);

var logoElement = document.getElementById("svg-logo");

new Vivus('svg-logo', { duration: 200, animTimingFunction: Vivus.EASE }, setupNav);

function setupNav() {
    //svgs have sticky element handling in js:(
    logoElement.setAttribute("class", "svg-logo small");
    document.body.classList.add("loaded");
}

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzE3NjFmYTVhMGE2MzNkNDQxM2YiLCJ3ZWJwYWNrOi8vLy4vYXBwL2dsb2JhbC5zY3NzP2RmOGIiLCJ3ZWJwYWNrOi8vLy4vYXBwL2hlYWRlci5zY3NzPzdlNmUiLCJ3ZWJwYWNrOi8vLy4vfi92aXZ1cy9kaXN0L3ZpdnVzLmpzIiwid2VicGFjazovLy8uL2FwcC9pbmRleC5qcyJdLCJuYW1lcyI6WyJWaXZ1cyIsInJlcXVpcmUiLCJsb2dvRWxlbWVudCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJkdXJhdGlvbiIsImFuaW1UaW1pbmdGdW5jdGlvbiIsIkVBU0UiLCJzZXR1cE5hdiIsInNldEF0dHJpYnV0ZSIsImJvZHkiLCJjbGFzc0xpc3QiLCJhZGQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ2hFQSx5Qzs7Ozs7O0FDQUEseUM7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxXQUFXO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLHFCQUFxQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFdBQVc7QUFDdkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksV0FBVztBQUN2QixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFdBQVc7QUFDdkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLG1CQUFtQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxtQkFBbUI7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFdBQVc7QUFDdkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFdBQVc7QUFDdkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxXQUFXO0FBQ3ZCLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFdBQVc7QUFDdkIsWUFBWSxPQUFPO0FBQ25CLFlBQVksV0FBVztBQUN2QjtBQUNBO0FBQ0E7QUFDQSxZQUFZLCtCQUErQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksYUFBYTtBQUN6QixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG9CQUFvQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixXQUFXLFdBQVc7QUFDdEIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsU0FBUztBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QyxzQ0FBc0M7QUFDdEMsc0NBQXNDO0FBQ3RDLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsV0FBVztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFNBQVM7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxrQkFBa0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhLHFCQUFxQjtBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxxQkFBcUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxxQkFBcUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsK0JBQStCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLEVBQUU7QUFDYixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFBQTtBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7Ozs7OztBQ2hpQ0Q7QUFDQSxJQUFJQSxRQUFRLG1CQUFBQyxDQUFRLENBQVIsQ0FBWjtBQUNBLG1CQUFBQSxDQUFRLENBQVI7QUFDQSxtQkFBQUEsQ0FBUSxDQUFSOztBQUVBLElBQUlDLGNBQWNDLFNBQVNDLGNBQVQsQ0FBd0IsVUFBeEIsQ0FBbEI7O0FBRUEsSUFBSUosS0FBSixDQUFVLFVBQVYsRUFBc0IsRUFBQ0ssVUFBVSxHQUFYLEVBQWdCQyxvQkFBb0JOLE1BQU1PLElBQTFDLEVBQXRCLEVBQXVFQyxRQUF2RTs7QUFFQSxTQUFTQSxRQUFULEdBQW9CO0FBQ2hCO0FBQ0FOLGdCQUFZTyxZQUFaLENBQXlCLE9BQXpCLEVBQWtDLGdCQUFsQztBQUNBTixhQUFTTyxJQUFULENBQWNDLFNBQWQsQ0FBd0JDLEdBQXhCLENBQTRCLFFBQTVCO0FBQ0gsQyIsImZpbGUiOiJkaXN0L2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNzE3NjFmYTVhMGE2MzNkNDQxM2YiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXBwL2dsb2JhbC5zY3NzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hcHAvaGVhZGVyLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiB2aXZ1cyAtIEphdmFTY3JpcHQgbGlicmFyeSB0byBtYWtlIGRyYXdpbmcgYW5pbWF0aW9uIG9uIFNWR1xuICogQHZlcnNpb24gdjAuNC4wXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vbWF4d2VsbGl0by92aXZ1c1xuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgZG9jdW1lbnQpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbi8qKlxuICogUGF0aGZvcm1lclxuICogQmV0YSB2ZXJzaW9uXG4gKlxuICogVGFrZSBhbnkgU1ZHIHZlcnNpb24gMS4xIGFuZCB0cmFuc2Zvcm1cbiAqIGNoaWxkIGVsZW1lbnRzIHRvICdwYXRoJyBlbGVtZW50c1xuICpcbiAqIFRoaXMgY29kZSBpcyBwdXJlbHkgZm9ya2VkIGZyb21cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9XYWVzdC9TVkdQYXRoQ29udmVydGVyXG4gKi9cblxuLyoqXG4gKiBDbGFzcyBjb25zdHJ1Y3RvclxuICpcbiAqIEBwYXJhbSB7RE9NfFN0cmluZ30gZWxlbWVudCBEb20gZWxlbWVudCBvZiB0aGUgU1ZHIG9yIGlkIG9mIGl0XG4gKi9cbmZ1bmN0aW9uIFBhdGhmb3JtZXIoZWxlbWVudCkge1xuICAvLyBUZXN0IHBhcmFtc1xuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQYXRoZm9ybWVyIFtjb25zdHJ1Y3Rvcl06IFwiZWxlbWVudFwiIHBhcmFtZXRlciBpcyByZXF1aXJlZCcpO1xuICB9XG5cbiAgLy8gU2V0IHRoZSBlbGVtZW50XG4gIGlmIChlbGVtZW50LmNvbnN0cnVjdG9yID09PSBTdHJpbmcpIHtcbiAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhdGhmb3JtZXIgW2NvbnN0cnVjdG9yXTogXCJlbGVtZW50XCIgcGFyYW1ldGVyIGlzIG5vdCByZWxhdGVkIHRvIGFuIGV4aXN0aW5nIElEJyk7XG4gICAgfVxuICB9XG4gIGlmIChlbGVtZW50LmNvbnN0cnVjdG9yIGluc3RhbmNlb2Ygd2luZG93LlNWR0VsZW1lbnQgfHwgL15zdmckL2kudGVzdChlbGVtZW50Lm5vZGVOYW1lKSkge1xuICAgIHRoaXMuZWwgPSBlbGVtZW50O1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignUGF0aGZvcm1lciBbY29uc3RydWN0b3JdOiBcImVsZW1lbnRcIiBwYXJhbWV0ZXIgbXVzdCBiZSBhIHN0cmluZyBvciBhIFNWR2VsZW1lbnQnKTtcbiAgfVxuXG4gIC8vIFN0YXJ0XG4gIHRoaXMuc2NhbihlbGVtZW50KTtcbn1cblxuLyoqXG4gKiBMaXN0IG9mIHRhZ3Mgd2hpY2ggY2FuIGJlIHRyYW5zZm9ybWVkXG4gKiB0byBwYXRoIGVsZW1lbnRzXG4gKlxuICogQHR5cGUge0FycmF5fVxuICovXG5QYXRoZm9ybWVyLnByb3RvdHlwZS5UWVBFUyA9IFsnbGluZScsICdlbGxpcHNlJywgJ2NpcmNsZScsICdwb2x5Z29uJywgJ3BvbHlsaW5lJywgJ3JlY3QnXTtcblxuLyoqXG4gKiBMaXN0IG9mIGF0dHJpYnV0ZSBuYW1lcyB3aGljaCBjb250YWluXG4gKiBkYXRhLiBUaGlzIGFycmF5IGxpc3QgdGhlbSB0byBjaGVjayBpZlxuICogdGhleSBjb250YWluIGJhZCB2YWx1ZXMsIGxpa2UgcGVyY2VudGFnZS5cbiAqXG4gKiBAdHlwZSB7QXJyYXl9XG4gKi9cblBhdGhmb3JtZXIucHJvdG90eXBlLkFUVFJfV0FUQ0ggPSBbJ2N4JywgJ2N5JywgJ3BvaW50cycsICdyJywgJ3J4JywgJ3J5JywgJ3gnLCAneDEnLCAneDInLCAneScsICd5MScsICd5MiddO1xuXG4vKipcbiAqIEZpbmRzIHRoZSBlbGVtZW50cyBjb21wYXRpYmxlIGZvciB0cmFuc2Zvcm1cbiAqIGFuZCBhcHBseSB0aGUgbGlrZWQgbWV0aG9kXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSBvcHRpb25zIE9iamVjdCBmcm9tIHRoZSBjb25zdHJ1Y3RvclxuICovXG5QYXRoZm9ybWVyLnByb3RvdHlwZS5zY2FuID0gZnVuY3Rpb24gKHN2Zykge1xuICB2YXIgZm4sIGVsZW1lbnQsIHBhdGhEYXRhLCBwYXRoRG9tLFxuICAgICAgZWxlbWVudHMgPSBzdmcucXVlcnlTZWxlY3RvckFsbCh0aGlzLlRZUEVTLmpvaW4oJywnKSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50c1tpXTtcbiAgICBmbiA9IHRoaXNbZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgKyAnVG9QYXRoJ107XG4gICAgcGF0aERhdGEgPSBmbih0aGlzLnBhcnNlQXR0cihlbGVtZW50LmF0dHJpYnV0ZXMpKTtcbiAgICBwYXRoRG9tID0gdGhpcy5wYXRoTWFrZXIoZWxlbWVudCwgcGF0aERhdGEpO1xuICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocGF0aERvbSwgZWxlbWVudCk7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBSZWFkIGBsaW5lYCBlbGVtZW50IHRvIGV4dHJhY3QgYW5kIHRyYW5zZm9ybVxuICogZGF0YSwgdG8gbWFrZSBpdCByZWFkeSBmb3IgYSBgcGF0aGAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSAge0RPTWVsZW1lbnR9IGVsZW1lbnQgTGluZSBlbGVtZW50IHRvIHRyYW5zZm9ybVxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICBEYXRhIGZvciBhIGBwYXRoYCBlbGVtZW50XG4gKi9cblBhdGhmb3JtZXIucHJvdG90eXBlLmxpbmVUb1BhdGggPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB2YXIgbmV3RWxlbWVudCA9IHt9LFxuICAgICAgeDEgPSBlbGVtZW50LngxIHx8IDAsXG4gICAgICB5MSA9IGVsZW1lbnQueTEgfHwgMCxcbiAgICAgIHgyID0gZWxlbWVudC54MiB8fCAwLFxuICAgICAgeTIgPSBlbGVtZW50LnkyIHx8IDA7XG5cbiAgbmV3RWxlbWVudC5kID0gJ00nICsgeDEgKyAnLCcgKyB5MSArICdMJyArIHgyICsgJywnICsgeTI7XG4gIHJldHVybiBuZXdFbGVtZW50O1xufTtcblxuLyoqXG4gKiBSZWFkIGByZWN0YCBlbGVtZW50IHRvIGV4dHJhY3QgYW5kIHRyYW5zZm9ybVxuICogZGF0YSwgdG8gbWFrZSBpdCByZWFkeSBmb3IgYSBgcGF0aGAgb2JqZWN0LlxuICogVGhlIHJhZGl1cy1ib3JkZXIgaXMgbm90IHRha2VuIGluIGNoYXJnZSB5ZXQuXG4gKiAoeW91ciBoZWxwIGlzIG1vcmUgdGhhbiB3ZWxjb21lZClcbiAqXG4gKiBAcGFyYW0gIHtET01lbGVtZW50fSBlbGVtZW50IFJlY3QgZWxlbWVudCB0byB0cmFuc2Zvcm1cbiAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgRGF0YSBmb3IgYSBgcGF0aGAgZWxlbWVudFxuICovXG5QYXRoZm9ybWVyLnByb3RvdHlwZS5yZWN0VG9QYXRoID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSB7fSxcbiAgICAgIHggICAgICA9IHBhcnNlRmxvYXQoZWxlbWVudC54KSAgICAgIHx8IDAsXG4gICAgICB5ICAgICAgPSBwYXJzZUZsb2F0KGVsZW1lbnQueSkgICAgICB8fCAwLFxuICAgICAgd2lkdGggID0gcGFyc2VGbG9hdChlbGVtZW50LndpZHRoKSAgfHwgMCxcbiAgICAgIGhlaWdodCA9IHBhcnNlRmxvYXQoZWxlbWVudC5oZWlnaHQpIHx8IDA7XG5cbiAgbmV3RWxlbWVudC5kICA9ICdNJyArIHggKyAnICcgKyB5ICsgJyAnO1xuICBuZXdFbGVtZW50LmQgKz0gJ0wnICsgKHggKyB3aWR0aCkgKyAnICcgKyB5ICsgJyAnO1xuICBuZXdFbGVtZW50LmQgKz0gJ0wnICsgKHggKyB3aWR0aCkgKyAnICcgKyAoeSArIGhlaWdodCkgKyAnICc7XG4gIG5ld0VsZW1lbnQuZCArPSAnTCcgKyB4ICsgJyAnICsgKHkgKyBoZWlnaHQpICsgJyBaJztcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59O1xuXG4vKipcbiAqIFJlYWQgYHBvbHlsaW5lYCBlbGVtZW50IHRvIGV4dHJhY3QgYW5kIHRyYW5zZm9ybVxuICogZGF0YSwgdG8gbWFrZSBpdCByZWFkeSBmb3IgYSBgcGF0aGAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSAge0RPTWVsZW1lbnR9IGVsZW1lbnQgUG9seWxpbmUgZWxlbWVudCB0byB0cmFuc2Zvcm1cbiAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgRGF0YSBmb3IgYSBgcGF0aGAgZWxlbWVudFxuICovXG5QYXRoZm9ybWVyLnByb3RvdHlwZS5wb2x5bGluZVRvUGF0aCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBuZXdFbGVtZW50ID0ge30sXG4gICAgICBwb2ludHMgPSBlbGVtZW50LnBvaW50cy50cmltKCkuc3BsaXQoJyAnKSxcbiAgICAgIGksIHBhdGg7XG5cbiAgLy8gUmVmb3JtYXR0aW5nIGlmIHBvaW50cyBhcmUgZGVmaW5lZCB3aXRob3V0IGNvbW1hc1xuICBpZiAoZWxlbWVudC5wb2ludHMuaW5kZXhPZignLCcpID09PSAtMSkge1xuICAgIHZhciBmb3JtYXR0ZWRQb2ludHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSs9Mikge1xuICAgICAgZm9ybWF0dGVkUG9pbnRzLnB1c2gocG9pbnRzW2ldICsgJywnICsgcG9pbnRzW2krMV0pO1xuICAgIH1cbiAgICBwb2ludHMgPSBmb3JtYXR0ZWRQb2ludHM7XG4gIH1cblxuICAvLyBHZW5lcmF0ZSB0aGUgcGF0aC5kIHZhbHVlXG4gIHBhdGggPSAnTScgKyBwb2ludHNbMF07XG4gIGZvcihpID0gMTsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwb2ludHNbaV0uaW5kZXhPZignLCcpICE9PSAtMSkge1xuICAgICAgcGF0aCArPSAnTCcgKyBwb2ludHNbaV07XG4gICAgfVxuICB9XG4gIG5ld0VsZW1lbnQuZCA9IHBhdGg7XG4gIHJldHVybiBuZXdFbGVtZW50O1xufTtcblxuLyoqXG4gKiBSZWFkIGBwb2x5Z29uYCBlbGVtZW50IHRvIGV4dHJhY3QgYW5kIHRyYW5zZm9ybVxuICogZGF0YSwgdG8gbWFrZSBpdCByZWFkeSBmb3IgYSBgcGF0aGAgb2JqZWN0LlxuICogVGhpcyBtZXRob2QgcmVseSBvbiBwb2x5bGluZVRvUGF0aCwgYmVjYXVzZSB0aGVcbiAqIGxvZ2ljIGlzIHNpbWlsYXIuIFRoZSBwYXRoIGNyZWF0ZWQgaXMganVzdCBjbG9zZWQsXG4gKiBzbyBpdCBuZWVkcyBhbiAnWicgYXQgdGhlIGVuZC5cbiAqXG4gKiBAcGFyYW0gIHtET01lbGVtZW50fSBlbGVtZW50IFBvbHlnb24gZWxlbWVudCB0byB0cmFuc2Zvcm1cbiAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgRGF0YSBmb3IgYSBgcGF0aGAgZWxlbWVudFxuICovXG5QYXRoZm9ybWVyLnByb3RvdHlwZS5wb2x5Z29uVG9QYXRoID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSBQYXRoZm9ybWVyLnByb3RvdHlwZS5wb2x5bGluZVRvUGF0aChlbGVtZW50KTtcblxuICBuZXdFbGVtZW50LmQgKz0gJ1onO1xuICByZXR1cm4gbmV3RWxlbWVudDtcbn07XG5cbi8qKlxuICogUmVhZCBgZWxsaXBzZWAgZWxlbWVudCB0byBleHRyYWN0IGFuZCB0cmFuc2Zvcm1cbiAqIGRhdGEsIHRvIG1ha2UgaXQgcmVhZHkgZm9yIGEgYHBhdGhgIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gIHtET01lbGVtZW50fSBlbGVtZW50IGVsbGlwc2UgZWxlbWVudCB0byB0cmFuc2Zvcm1cbiAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgRGF0YSBmb3IgYSBgcGF0aGAgZWxlbWVudFxuICovXG5QYXRoZm9ybWVyLnByb3RvdHlwZS5lbGxpcHNlVG9QYXRoID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSB7fSxcbiAgICAgIHJ4ID0gcGFyc2VGbG9hdChlbGVtZW50LnJ4KSB8fCAwLFxuICAgICAgcnkgPSBwYXJzZUZsb2F0KGVsZW1lbnQucnkpIHx8IDAsXG4gICAgICBjeCA9IHBhcnNlRmxvYXQoZWxlbWVudC5jeCkgfHwgMCxcbiAgICAgIGN5ID0gcGFyc2VGbG9hdChlbGVtZW50LmN5KSB8fCAwLFxuICAgICAgc3RhcnRYID0gY3ggLSByeCxcbiAgICAgIHN0YXJ0WSA9IGN5LFxuICAgICAgZW5kWCA9IHBhcnNlRmxvYXQoY3gpICsgcGFyc2VGbG9hdChyeCksXG4gICAgICBlbmRZID0gY3k7XG5cbiAgbmV3RWxlbWVudC5kID0gJ00nICsgc3RhcnRYICsgJywnICsgc3RhcnRZICtcbiAgICAgICAgICAgICAgICAgJ0EnICsgcnggKyAnLCcgKyByeSArICcgMCwxLDEgJyArIGVuZFggKyAnLCcgKyBlbmRZICtcbiAgICAgICAgICAgICAgICAgJ0EnICsgcnggKyAnLCcgKyByeSArICcgMCwxLDEgJyArIHN0YXJ0WCArICcsJyArIGVuZFk7XG4gIHJldHVybiBuZXdFbGVtZW50O1xufTtcblxuLyoqXG4gKiBSZWFkIGBjaXJjbGVgIGVsZW1lbnQgdG8gZXh0cmFjdCBhbmQgdHJhbnNmb3JtXG4gKiBkYXRhLCB0byBtYWtlIGl0IHJlYWR5IGZvciBhIGBwYXRoYCBvYmplY3QuXG4gKlxuICogQHBhcmFtICB7RE9NZWxlbWVudH0gZWxlbWVudCBDaXJjbGUgZWxlbWVudCB0byB0cmFuc2Zvcm1cbiAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgRGF0YSBmb3IgYSBgcGF0aGAgZWxlbWVudFxuICovXG5QYXRoZm9ybWVyLnByb3RvdHlwZS5jaXJjbGVUb1BhdGggPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB2YXIgbmV3RWxlbWVudCA9IHt9LFxuICAgICAgciAgPSBwYXJzZUZsb2F0KGVsZW1lbnQucikgIHx8IDAsXG4gICAgICBjeCA9IHBhcnNlRmxvYXQoZWxlbWVudC5jeCkgfHwgMCxcbiAgICAgIGN5ID0gcGFyc2VGbG9hdChlbGVtZW50LmN5KSB8fCAwLFxuICAgICAgc3RhcnRYID0gY3ggLSByLFxuICAgICAgc3RhcnRZID0gY3ksXG4gICAgICBlbmRYID0gcGFyc2VGbG9hdChjeCkgKyBwYXJzZUZsb2F0KHIpLFxuICAgICAgZW5kWSA9IGN5O1xuICAgICAgXG4gIG5ld0VsZW1lbnQuZCA9ICAnTScgKyBzdGFydFggKyAnLCcgKyBzdGFydFkgK1xuICAgICAgICAgICAgICAgICAgJ0EnICsgciArICcsJyArIHIgKyAnIDAsMSwxICcgKyBlbmRYICsgJywnICsgZW5kWSArXG4gICAgICAgICAgICAgICAgICAnQScgKyByICsgJywnICsgciArICcgMCwxLDEgJyArIHN0YXJ0WCArICcsJyArIGVuZFk7XG4gIHJldHVybiBuZXdFbGVtZW50O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYHBhdGhgIGVsZW1lbnRzIGZvcm0gb3JpZ2luYWwgZWxlbWVudFxuICogYW5kIHByZXBhcmVkIG9iamVjdHNcbiAqXG4gKiBAcGFyYW0gIHtET01lbGVtZW50fSBlbGVtZW50ICBPcmlnaW5hbCBlbGVtZW50IHRvIHRyYW5zZm9ybVxuICogQHBhcmFtICB7b2JqZWN0fSBwYXRoRGF0YSAgICAgUGF0aCBkYXRhIChmcm9tIGB0b1BhdGhgIG1ldGhvZHMpXG4gKiBAcmV0dXJuIHtET01lbGVtZW50fSAgICAgICAgICBQYXRoIGVsZW1lbnRcbiAqL1xuUGF0aGZvcm1lci5wcm90b3R5cGUucGF0aE1ha2VyID0gZnVuY3Rpb24gKGVsZW1lbnQsIHBhdGhEYXRhKSB7XG4gIHZhciBpLCBhdHRyLCBwYXRoVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3BhdGgnKTtcbiAgZm9yKGkgPSAwOyBpIDwgZWxlbWVudC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgYXR0ciA9IGVsZW1lbnQuYXR0cmlidXRlc1tpXTtcbiAgICBpZiAodGhpcy5BVFRSX1dBVENILmluZGV4T2YoYXR0ci5uYW1lKSA9PT0gLTEpIHtcbiAgICAgIHBhdGhUYWcuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgYXR0ci52YWx1ZSk7XG4gICAgfVxuICB9XG4gIGZvcihpIGluIHBhdGhEYXRhKSB7XG4gICAgcGF0aFRhZy5zZXRBdHRyaWJ1dGUoaSwgcGF0aERhdGFbaV0pO1xuICB9XG4gIHJldHVybiBwYXRoVGFnO1xufTtcblxuLyoqXG4gKiBQYXJzZSBhdHRyaWJ1dGVzIG9mIGEgRE9NIGVsZW1lbnQgdG9cbiAqIGdldCBhbiBvYmplY3Qgb2YgYXR0cmlidXRlID0+IHZhbHVlXG4gKlxuICogQHBhcmFtICB7TmFtZWROb2RlTWFwfSBhdHRyaWJ1dGVzIEF0dHJpYnV0ZXMgb2JqZWN0IGZyb20gRE9NIGVsZW1lbnQgdG8gcGFyc2VcbiAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgICAgICBPYmplY3Qgb2YgYXR0cmlidXRlc1xuICovXG5QYXRoZm9ybWVyLnByb3RvdHlwZS5wYXJzZUF0dHIgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB2YXIgYXR0ciwgb3V0cHV0ID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudC5sZW5ndGg7IGkrKykge1xuICAgIGF0dHIgPSBlbGVtZW50W2ldO1xuICAgIC8vIENoZWNrIGlmIG5vIGRhdGEgYXR0cmlidXRlIGNvbnRhaW5zICclJywgb3IgdGhlIHRyYW5zZm9ybWF0aW9uIGlzIGltcG9zc2libGVcbiAgICBpZiAodGhpcy5BVFRSX1dBVENILmluZGV4T2YoYXR0ci5uYW1lKSAhPT0gLTEgJiYgYXR0ci52YWx1ZS5pbmRleE9mKCclJykgIT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhdGhmb3JtZXIgW3BhcnNlQXR0cl06IGEgU1ZHIHNoYXBlIGdvdCB2YWx1ZXMgaW4gcGVyY2VudGFnZS4gVGhpcyBjYW5ub3QgYmUgdHJhbnNmb3JtZWQgaW50byBcXCdwYXRoXFwnIHRhZ3MuIFBsZWFzZSB1c2UgXFwndmlld0JveFxcJy4nKTtcbiAgICB9XG4gICAgb3V0cHV0W2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59O1xuXG4gICd1c2Ugc3RyaWN0JztcblxudmFyIHJlcXVlc3RBbmltRnJhbWUsIGNhbmNlbEFuaW1GcmFtZSwgcGFyc2VQb3NpdGl2ZUludDtcblxuLyoqXG4gKiBWaXZ1c1xuICogQmV0YSB2ZXJzaW9uXG4gKlxuICogVGFrZSBhbnkgU1ZHIGFuZCBtYWtlIHRoZSBhbmltYXRpb25cbiAqIHRvIGdpdmUgZ2l2ZSB0aGUgaW1wcmVzc2lvbiBvZiBsaXZlIGRyYXdpbmdcbiAqXG4gKiBUaGlzIGluIG1vcmUgdGhhbiBqdXN0IGluc3BpcmVkIGZyb20gY29kcm9wc1xuICogQXQgdGhhdCBwb2ludCwgaXQncyBhIHB1cmUgZm9yay5cbiAqL1xuXG4vKipcbiAqIENsYXNzIGNvbnN0cnVjdG9yXG4gKiBvcHRpb24gc3RydWN0dXJlXG4gKiAgIHR5cGU6ICdkZWxheWVkJ3wnc3luYyd8J29uZUJ5T25lJ3wnc2NyaXB0JyAodG8ga25vdyBpZiB0aGUgaXRlbXMgbXVzdCBiZSBkcmF3biBzeW5jaHJvbm91c2x5IG9yIG5vdCwgZGVmYXVsdDogZGVsYXllZClcbiAqICAgZHVyYXRpb246IDxpbnQ+IChpbiBmcmFtZXMpXG4gKiAgIHN0YXJ0OiAnaW5WaWV3cG9ydCd8J21hbnVhbCd8J2F1dG9zdGFydCcgKHN0YXJ0IGF1dG9tYXRpY2FsbHkgdGhlIGFuaW1hdGlvbiwgZGVmYXVsdDogaW5WaWV3cG9ydClcbiAqICAgZGVsYXk6IDxpbnQ+IChkZWxheSBiZXR3ZWVuIHRoZSBkcmF3aW5nIG9mIGZpcnN0IGFuZCBsYXN0IHBhdGgpXG4gKiAgIGRhc2hHYXAgPGludGVnZXI+IHdoaXRlc3BhY2UgZXh0cmEgbWFyZ2luIGJldHdlZW4gZGFzaGVzXG4gKiAgIHBhdGhUaW1pbmdGdW5jdGlvbiA8ZnVuY3Rpb24+IHRpbWluZyBhbmltYXRpb24gZnVuY3Rpb24gZm9yIGVhY2ggcGF0aCBlbGVtZW50IG9mIHRoZSBTVkdcbiAqICAgYW5pbVRpbWluZ0Z1bmN0aW9uIDxmdW5jdGlvbj4gdGltaW5nIGFuaW1hdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGNvbXBsZXRlIFNWR1xuICogICBmb3JjZVJlbmRlciA8Ym9vbGVhbj4gZm9yY2UgdGhlIGJyb3dzZXIgdG8gcmUtcmVuZGVyIGFsbCB1cGRhdGVkIHBhdGggaXRlbXNcbiAqICAgc2VsZkRlc3Ryb3kgPGJvb2xlYW4+IHJlbW92ZXMgYWxsIGV4dHJhIHN0eWxpbmcgb24gdGhlIFNWRywgYW5kIGxlYXZlcyBpdCBhcyBvcmlnaW5hbFxuICpcbiAqIFRoZSBhdHRyaWJ1dGUgJ3R5cGUnIGlzIGJ5IGRlZmF1bHQgb24gJ2RlbGF5ZWQnLlxuICogIC0gJ2RlbGF5ZWQnXG4gKiAgICBhbGwgcGF0aHMgYXJlIGRyYXcgYXQgdGhlIHNhbWUgdGltZSBidXQgd2l0aCBhXG4gKiAgICBsaXR0bGUgZGVsYXkgYmV0d2VlbiB0aGVtIGJlZm9yZSBzdGFydFxuICogIC0gJ3N5bmMnXG4gKiAgICBhbGwgcGF0aCBhcmUgc3RhcnQgYW5kIGZpbmlzaCBhdCB0aGUgc2FtZSB0aW1lXG4gKiAgLSAnb25lQnlPbmUnXG4gKiAgICBvbmx5IG9uZSBwYXRoIGlzIGRyYXcgYXQgdGhlIHRpbWVcbiAqICAgIHRoZSBlbmQgb2YgdGhlIGZpcnN0IG9uZSB3aWxsIHRyaWdnZXIgdGhlIGRyYXdcbiAqICAgIG9mIHRoZSBuZXh0IG9uZVxuICpcbiAqIEFsbCB0aGVzZSB2YWx1ZXMgY2FuIGJlIG92ZXJ3cml0dGVuIGluZGl2aWR1YWxseVxuICogZm9yIGVhY2ggcGF0aCBpdGVtIGluIHRoZSBTVkdcbiAqIFRoZSB2YWx1ZSBvZiBmcmFtZXMgd2lsbCBhbHdheXMgdGFrZSB0aGUgYWR2YW50YWdlIG9mXG4gKiB0aGUgZHVyYXRpb24gdmFsdWUuXG4gKiBJZiB5b3UgZmFpbCBzb21ld2hlcmUsIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duLlxuICogR29vZCBsdWNrLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHRoaXMge1ZpdnVzfVxuICogQHBhcmFtIHtET018U3RyaW5nfSAgIGVsZW1lbnQgIERvbSBlbGVtZW50IG9mIHRoZSBTVkcgb3IgaWQgb2YgaXRcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICBvcHRpb25zICBPcHRpb25zIGFib3V0IHRoZSBhbmltYXRpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259ICAgICBjYWxsYmFjayBDYWxsYmFjayBmb3IgdGhlIGVuZCBvZiB0aGUgYW5pbWF0aW9uXG4gKi9cbmZ1bmN0aW9uIFZpdnVzIChlbGVtZW50LCBvcHRpb25zLCBjYWxsYmFjaykge1xuXG4gIC8vIFNldHVwXG4gIHRoaXMuaXNSZWFkeSA9IGZhbHNlO1xuICB0aGlzLnNldEVsZW1lbnQoZWxlbWVudCwgb3B0aW9ucyk7XG4gIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgdGhpcy5zZXRDYWxsYmFjayhjYWxsYmFjayk7XG5cbiAgaWYgKHRoaXMuaXNSZWFkeSkge1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG59XG5cbi8qKlxuICogVGltaW5nIGZ1bmN0aW9uc1xuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICogRGVmYXVsdCBmdW5jdGlvbnMgdG8gaGVscCBkZXZlbG9wZXJzLlxuICogSXQgYWx3YXlzIHRha2UgYSBudW1iZXIgYXMgcGFyYW1ldGVyIChiZXR3ZWVuIDAgdG8gMSkgdGhlblxuICogcmV0dXJuIGEgbnVtYmVyIChiZXR3ZWVuIDAgYW5kIDEpXG4gKi9cblZpdnVzLkxJTkVBUiAgICAgICAgICA9IGZ1bmN0aW9uICh4KSB7cmV0dXJuIHg7fTtcblZpdnVzLkVBU0UgICAgICAgICAgICA9IGZ1bmN0aW9uICh4KSB7cmV0dXJuIC1NYXRoLmNvcyh4ICogTWF0aC5QSSkgLyAyICsgMC41O307XG5WaXZ1cy5FQVNFX09VVCAgICAgICAgPSBmdW5jdGlvbiAoeCkge3JldHVybiAxIC0gTWF0aC5wb3coMS14LCAzKTt9O1xuVml2dXMuRUFTRV9JTiAgICAgICAgID0gZnVuY3Rpb24gKHgpIHtyZXR1cm4gTWF0aC5wb3coeCwgMyk7fTtcblZpdnVzLkVBU0VfT1VUX0JPVU5DRSA9IGZ1bmN0aW9uICh4KSB7XG4gIHZhciBiYXNlID0gLU1hdGguY29zKHggKiAoMC41ICogTWF0aC5QSSkpICsgMSxcbiAgICByYXRlID0gTWF0aC5wb3coYmFzZSwxLjUpLFxuICAgIHJhdGVSID0gTWF0aC5wb3coMSAtIHgsIDIpLFxuICAgIHByb2dyZXNzID0gLU1hdGguYWJzKE1hdGguY29zKHJhdGUgKiAoMi41ICogTWF0aC5QSSkgKSkgKyAxO1xuICByZXR1cm4gKDEtIHJhdGVSKSArIChwcm9ncmVzcyAqIHJhdGVSKTtcbn07XG5cblxuLyoqXG4gKiBTZXR0ZXJzXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqL1xuXG4vKipcbiAqIENoZWNrIGFuZCBzZXQgdGhlIGVsZW1lbnQgaW4gdGhlIGluc3RhbmNlXG4gKiBUaGUgbWV0aG9kIHdpbGwgbm90IHJldHVybiBhbnl0aGluZywgYnV0IHdpbGwgdGhyb3cgYW5cbiAqIGVycm9yIGlmIHRoZSBwYXJhbWV0ZXIgaXMgaW52YWxpZFxuICpcbiAqIEBwYXJhbSB7RE9NfFN0cmluZ30gICBlbGVtZW50ICBTVkcgRG9tIGVsZW1lbnQgb3IgaWQgb2YgaXRcbiAqL1xuVml2dXMucHJvdG90eXBlLnNldEVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAvLyBCYXNpYyBjaGVja1xuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdWaXZ1cyBbY29uc3RydWN0b3JdOiBcImVsZW1lbnRcIiBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQnKTtcbiAgfVxuXG4gIC8vIFNldCB0aGUgZWxlbWVudFxuICBpZiAoZWxlbWVudC5jb25zdHJ1Y3RvciA9PT0gU3RyaW5nKSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdWaXZ1cyBbY29uc3RydWN0b3JdOiBcImVsZW1lbnRcIiBwYXJhbWV0ZXIgaXMgbm90IHJlbGF0ZWQgdG8gYW4gZXhpc3RpbmcgSUQnKTtcbiAgICB9XG4gIH1cbiAgdGhpcy5wYXJlbnRFbCA9IGVsZW1lbnQ7XG5cbiAgLy8gQ3JlYXRlIHRoZSBvYmplY3QgZWxlbWVudCBpZiB0aGUgcHJvcGVydHkgYGZpbGVgIGV4aXN0cyBpbiB0aGUgb3B0aW9ucyBvYmplY3RcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5maWxlKSB7XG4gICAgdmFyIG9iakVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29iamVjdCcpO1xuICAgIG9iakVsbS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgIG9iakVsbS5zZXRBdHRyaWJ1dGUoJ2RhdGEnLCBvcHRpb25zLmZpbGUpO1xuICAgIG9iakVsbS5zZXRBdHRyaWJ1dGUoJ2J1aWx0LWJ5LXZpdnVzJywgJ3RydWUnKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKG9iakVsbSk7XG4gICAgZWxlbWVudCA9IG9iakVsbTtcbiAgfVxuXG4gIHN3aXRjaCAoZWxlbWVudC5jb25zdHJ1Y3Rvcikge1xuICBjYXNlIHdpbmRvdy5TVkdTVkdFbGVtZW50OlxuICBjYXNlIHdpbmRvdy5TVkdFbGVtZW50OlxuICAgIHRoaXMuZWwgPSBlbGVtZW50O1xuICAgIHRoaXMuaXNSZWFkeSA9IHRydWU7XG4gICAgYnJlYWs7XG5cbiAgY2FzZSB3aW5kb3cuSFRNTE9iamVjdEVsZW1lbnQ6XG4gICAgLy8gSWYgd2UgaGF2ZSB0byB3YWl0IGZvciBpdFxuICAgIHZhciBvbkxvYWQsIHNlbGY7XG5cbiAgICBzZWxmID0gdGhpcztcbiAgICBvbkxvYWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKHNlbGYuaXNSZWFkeSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWxmLmVsID0gZWxlbWVudC5jb250ZW50RG9jdW1lbnQgJiYgZWxlbWVudC5jb250ZW50RG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgICBpZiAoIXNlbGYuZWwgJiYgZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZpdnVzIFtjb25zdHJ1Y3Rvcl06IG9iamVjdCBsb2FkZWQgZG9lcyBub3QgY29udGFpbiBhbnkgU1ZHJyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChzZWxmLmVsKSB7XG4gICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYnVpbHQtYnktdml2dXMnKSkge1xuICAgICAgICAgIHNlbGYucGFyZW50RWwuaW5zZXJ0QmVmb3JlKHNlbGYuZWwsIGVsZW1lbnQpO1xuICAgICAgICAgIHNlbGYucGFyZW50RWwucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgc2VsZi5lbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEwMCUnKTtcbiAgICAgICAgICBzZWxmLmVsLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmlzUmVhZHkgPSB0cnVlO1xuICAgICAgICBzZWxmLmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICghb25Mb2FkKCkpIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uTG9hZCk7XG4gICAgfVxuICAgIGJyZWFrO1xuXG4gIGRlZmF1bHQ6XG4gICAgdGhyb3cgbmV3IEVycm9yKCdWaXZ1cyBbY29uc3RydWN0b3JdOiBcImVsZW1lbnRcIiBwYXJhbWV0ZXIgaXMgbm90IHZhbGlkIChvciBtaXNzIHRoZSBcImZpbGVcIiBhdHRyaWJ1dGUpJyk7XG4gIH1cbn07XG5cbi8qKlxuICogU2V0IHVwIHVzZXIgb3B0aW9uIHRvIHRoZSBpbnN0YW5jZVxuICogVGhlIG1ldGhvZCB3aWxsIG5vdCByZXR1cm4gYW55dGhpbmcsIGJ1dCB3aWxsIHRocm93IGFuXG4gKiBlcnJvciBpZiB0aGUgcGFyYW1ldGVyIGlzIGludmFsaWRcbiAqXG4gKiBAcGFyYW0gIHtvYmplY3R9IG9wdGlvbnMgT2JqZWN0IGZyb20gdGhlIGNvbnN0cnVjdG9yXG4gKi9cblZpdnVzLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIGFsbG93ZWRUeXBlcyA9IFsnZGVsYXllZCcsICdzeW5jJywgJ2FzeW5jJywgJ25zeW5jJywgJ29uZUJ5T25lJywgJ3NjZW5hcmlvJywgJ3NjZW5hcmlvLXN5bmMnXTtcbiAgdmFyIGFsbG93ZWRTdGFydHMgPSAgWydpblZpZXdwb3J0JywgJ21hbnVhbCcsICdhdXRvc3RhcnQnXTtcblxuICAvLyBCYXNpYyBjaGVja1xuICBpZiAob3B0aW9ucyAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuY29uc3RydWN0b3IgIT09IE9iamVjdCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVml2dXMgW2NvbnN0cnVjdG9yXTogXCJvcHRpb25zXCIgcGFyYW1ldGVyIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIH1cblxuICAvLyBTZXQgdGhlIGFuaW1hdGlvbiB0eXBlXG4gIGlmIChvcHRpb25zLnR5cGUgJiYgYWxsb3dlZFR5cGVzLmluZGV4T2Yob3B0aW9ucy50eXBlKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZpdnVzIFtjb25zdHJ1Y3Rvcl06ICcgKyBvcHRpb25zLnR5cGUgKyAnIGlzIG5vdCBhbiBleGlzdGluZyBhbmltYXRpb24gYHR5cGVgJyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy50eXBlID0gb3B0aW9ucy50eXBlIHx8IGFsbG93ZWRUeXBlc1swXTtcbiAgfVxuXG4gIC8vIFNldCB0aGUgc3RhcnQgdHlwZVxuICBpZiAob3B0aW9ucy5zdGFydCAmJiBhbGxvd2VkU3RhcnRzLmluZGV4T2Yob3B0aW9ucy5zdGFydCkgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdWaXZ1cyBbY29uc3RydWN0b3JdOiAnICsgb3B0aW9ucy5zdGFydCArICcgaXMgbm90IGFuIGV4aXN0aW5nIGBzdGFydGAgb3B0aW9uJyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy5zdGFydCA9IG9wdGlvbnMuc3RhcnQgfHwgYWxsb3dlZFN0YXJ0c1swXTtcbiAgfVxuXG4gIHRoaXMuaXNJRSAgICAgICAgID0gKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUnKSAhPT0gLTEgfHwgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignVHJpZGVudC8nKSAhPT0gLTEgfHwgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignRWRnZS8nKSAhPT0gLTEgKTtcbiAgdGhpcy5kdXJhdGlvbiAgICAgPSBwYXJzZVBvc2l0aXZlSW50KG9wdGlvbnMuZHVyYXRpb24sIDEyMCk7XG4gIHRoaXMuZGVsYXkgICAgICAgID0gcGFyc2VQb3NpdGl2ZUludChvcHRpb25zLmRlbGF5LCBudWxsKTtcbiAgdGhpcy5kYXNoR2FwICAgICAgPSBwYXJzZVBvc2l0aXZlSW50KG9wdGlvbnMuZGFzaEdhcCwgMSk7XG4gIHRoaXMuZm9yY2VSZW5kZXIgID0gb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnZm9yY2VSZW5kZXInKSA/ICEhb3B0aW9ucy5mb3JjZVJlbmRlciA6IHRoaXMuaXNJRTtcbiAgdGhpcy5yZXZlcnNlU3RhY2sgPSAhIW9wdGlvbnMucmV2ZXJzZVN0YWNrO1xuICB0aGlzLnNlbGZEZXN0cm95ICA9ICEhb3B0aW9ucy5zZWxmRGVzdHJveTtcbiAgdGhpcy5vblJlYWR5ICAgICAgPSBvcHRpb25zLm9uUmVhZHk7XG4gIHRoaXMubWFwICAgICAgICAgID0gW107XG4gIHRoaXMuZnJhbWVMZW5ndGggID0gdGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLmRlbGF5VW5pdCA9IHRoaXMuc3BlZWQgPSB0aGlzLmhhbmRsZSA9IG51bGw7XG5cbiAgdGhpcy5pZ25vcmVJbnZpc2libGUgPSBvcHRpb25zLmhhc093blByb3BlcnR5KCdpZ25vcmVJbnZpc2libGUnKSA/ICEhb3B0aW9ucy5pZ25vcmVJbnZpc2libGUgOiBmYWxzZTtcblxuICB0aGlzLmFuaW1UaW1pbmdGdW5jdGlvbiA9IG9wdGlvbnMuYW5pbVRpbWluZ0Z1bmN0aW9uIHx8IFZpdnVzLkxJTkVBUjtcbiAgdGhpcy5wYXRoVGltaW5nRnVuY3Rpb24gPSBvcHRpb25zLnBhdGhUaW1pbmdGdW5jdGlvbiB8fCBWaXZ1cy5MSU5FQVI7XG5cbiAgaWYgKHRoaXMuZGVsYXkgPj0gdGhpcy5kdXJhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcignVml2dXMgW2NvbnN0cnVjdG9yXTogZGVsYXkgbXVzdCBiZSBzaG9ydGVyIHRoYW4gZHVyYXRpb24nKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTZXQgdXAgY2FsbGJhY2sgdG8gdGhlIGluc3RhbmNlXG4gKiBUaGUgbWV0aG9kIHdpbGwgbm90IHJldHVybiBlbnl0aGluZywgYnV0IHdpbGwgdGhyb3cgYW5cbiAqIGVycm9yIGlmIHRoZSBwYXJhbWV0ZXIgaXMgaW52YWxpZFxuICpcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmb3IgdGhlIGFuaW1hdGlvbiBlbmRcbiAqL1xuVml2dXMucHJvdG90eXBlLnNldENhbGxiYWNrID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIC8vIEJhc2ljIGNoZWNrXG4gIGlmICghIWNhbGxiYWNrICYmIGNhbGxiYWNrLmNvbnN0cnVjdG9yICE9PSBGdW5jdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcignVml2dXMgW2NvbnN0cnVjdG9yXTogXCJjYWxsYmFja1wiIHBhcmFtZXRlciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG59O1xuXG5cbi8qKlxuICogQ29yZVxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKi9cblxuLyoqXG4gKiBNYXAgdGhlIHN2ZywgcGF0aCBieSBwYXRoLlxuICogVGhlIG1ldGhvZCByZXR1cm4gbm90aGluZywgaXQganVzdCBmaWxsIHRoZVxuICogYG1hcGAgYXJyYXkuIEVhY2ggaXRlbSBpbiB0aGlzIGFycmF5IHJlcHJlc2VudFxuICogYSBwYXRoIGVsZW1lbnQgZnJvbSB0aGUgU1ZHLCB3aXRoIGluZm9ybWF0aW9ucyBmb3JcbiAqIHRoZSBhbmltYXRpb24uXG4gKlxuICogYGBgXG4gKiBbXG4gKiAgIHtcbiAqICAgICBlbDogPERPTW9iaj4gdGhlIHBhdGggZWxlbWVudFxuICogICAgIGxlbmd0aDogPG51bWJlcj4gbGVuZ3RoIG9mIHRoZSBwYXRoIGxpbmVcbiAqICAgICBzdGFydEF0OiA8bnVtYmVyPiB0aW1lIHN0YXJ0IG9mIHRoZSBwYXRoIGFuaW1hdGlvbiAoaW4gZnJhbWVzKVxuICogICAgIGR1cmF0aW9uOiA8bnVtYmVyPiBwYXRoIGFuaW1hdGlvbiBkdXJhdGlvbiAoaW4gZnJhbWVzKVxuICogICB9LFxuICogICAuLi5cbiAqIF1cbiAqIGBgYFxuICpcbiAqL1xuVml2dXMucHJvdG90eXBlLm1hcHBpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpLCBwYXRocywgcGF0aCwgcEF0dHJzLCBwYXRoT2JqLCB0b3RhbExlbmd0aCwgbGVuZ3RoTWV0ZXIsIHRpbWVQb2ludDtcbiAgdGltZVBvaW50ID0gdG90YWxMZW5ndGggPSBsZW5ndGhNZXRlciA9IDA7XG4gIHBhdGhzID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKCdwYXRoJyk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHBhdGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcGF0aCA9IHBhdGhzW2ldO1xuICAgIGlmICh0aGlzLmlzSW52aXNpYmxlKHBhdGgpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcGF0aE9iaiA9IHtcbiAgICAgIGVsOiBwYXRoLFxuICAgICAgbGVuZ3RoOiBNYXRoLmNlaWwocGF0aC5nZXRUb3RhbExlbmd0aCgpKVxuICAgIH07XG4gICAgLy8gVGVzdCBpZiB0aGUgcGF0aCBsZW5ndGggaXMgY29ycmVjdFxuICAgIGlmIChpc05hTihwYXRoT2JqLmxlbmd0aCkpIHtcbiAgICAgIGlmICh3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdWaXZ1cyBbbWFwcGluZ106IGNhbm5vdCByZXRyaWV2ZSBhIHBhdGggZWxlbWVudCBsZW5ndGgnLCBwYXRoKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB0aGlzLm1hcC5wdXNoKHBhdGhPYmopO1xuICAgIHBhdGguc3R5bGUuc3Ryb2tlRGFzaGFycmF5ICA9IHBhdGhPYmoubGVuZ3RoICsgJyAnICsgKHBhdGhPYmoubGVuZ3RoICsgdGhpcy5kYXNoR2FwICogMik7XG4gICAgcGF0aC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gcGF0aE9iai5sZW5ndGggKyB0aGlzLmRhc2hHYXA7XG4gICAgcGF0aE9iai5sZW5ndGggKz0gdGhpcy5kYXNoR2FwO1xuICAgIHRvdGFsTGVuZ3RoICs9IHBhdGhPYmoubGVuZ3RoO1xuXG4gICAgdGhpcy5yZW5kZXJQYXRoKGkpO1xuICB9XG5cbiAgdG90YWxMZW5ndGggPSB0b3RhbExlbmd0aCA9PT0gMCA/IDEgOiB0b3RhbExlbmd0aDtcbiAgdGhpcy5kZWxheSA9IHRoaXMuZGVsYXkgPT09IG51bGwgPyB0aGlzLmR1cmF0aW9uIC8gMyA6IHRoaXMuZGVsYXk7XG4gIHRoaXMuZGVsYXlVbml0ID0gdGhpcy5kZWxheSAvIChwYXRocy5sZW5ndGggPiAxID8gcGF0aHMubGVuZ3RoIC0gMSA6IDEpO1xuXG4gIC8vIFJldmVyc2Ugc3RhY2sgaWYgYXNrZWRcbiAgaWYgKHRoaXMucmV2ZXJzZVN0YWNrKSB7XG4gICAgdGhpcy5tYXAucmV2ZXJzZSgpO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IHRoaXMubWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgcGF0aE9iaiA9IHRoaXMubWFwW2ldO1xuXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICBjYXNlICdkZWxheWVkJzpcbiAgICAgIHBhdGhPYmouc3RhcnRBdCA9IHRoaXMuZGVsYXlVbml0ICogaTtcbiAgICAgIHBhdGhPYmouZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uIC0gdGhpcy5kZWxheTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnb25lQnlPbmUnOlxuICAgICAgcGF0aE9iai5zdGFydEF0ID0gbGVuZ3RoTWV0ZXIgLyB0b3RhbExlbmd0aCAqIHRoaXMuZHVyYXRpb247XG4gICAgICBwYXRoT2JqLmR1cmF0aW9uID0gcGF0aE9iai5sZW5ndGggLyB0b3RhbExlbmd0aCAqIHRoaXMuZHVyYXRpb247XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3N5bmMnOlxuICAgIGNhc2UgJ2FzeW5jJzpcbiAgICBjYXNlICduc3luYyc6XG4gICAgICBwYXRoT2JqLnN0YXJ0QXQgPSAwO1xuICAgICAgcGF0aE9iai5kdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3NjZW5hcmlvLXN5bmMnOlxuICAgICAgcGF0aCA9IHBhdGhPYmouZWw7XG4gICAgICBwQXR0cnMgPSB0aGlzLnBhcnNlQXR0cihwYXRoKTtcbiAgICAgIHBhdGhPYmouc3RhcnRBdCA9IHRpbWVQb2ludCArIChwYXJzZVBvc2l0aXZlSW50KHBBdHRyc1snZGF0YS1kZWxheSddLCB0aGlzLmRlbGF5VW5pdCkgfHwgMCk7XG4gICAgICBwYXRoT2JqLmR1cmF0aW9uID0gcGFyc2VQb3NpdGl2ZUludChwQXR0cnNbJ2RhdGEtZHVyYXRpb24nXSwgdGhpcy5kdXJhdGlvbik7XG4gICAgICB0aW1lUG9pbnQgPSBwQXR0cnNbJ2RhdGEtYXN5bmMnXSAhPT0gdW5kZWZpbmVkID8gcGF0aE9iai5zdGFydEF0IDogcGF0aE9iai5zdGFydEF0ICsgcGF0aE9iai5kdXJhdGlvbjtcbiAgICAgIHRoaXMuZnJhbWVMZW5ndGggPSBNYXRoLm1heCh0aGlzLmZyYW1lTGVuZ3RoLCAocGF0aE9iai5zdGFydEF0ICsgcGF0aE9iai5kdXJhdGlvbikpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdzY2VuYXJpbyc6XG4gICAgICBwYXRoID0gcGF0aE9iai5lbDtcbiAgICAgIHBBdHRycyA9IHRoaXMucGFyc2VBdHRyKHBhdGgpO1xuICAgICAgcGF0aE9iai5zdGFydEF0ID0gcGFyc2VQb3NpdGl2ZUludChwQXR0cnNbJ2RhdGEtc3RhcnQnXSwgdGhpcy5kZWxheVVuaXQpIHx8IDA7XG4gICAgICBwYXRoT2JqLmR1cmF0aW9uID0gcGFyc2VQb3NpdGl2ZUludChwQXR0cnNbJ2RhdGEtZHVyYXRpb24nXSwgdGhpcy5kdXJhdGlvbik7XG4gICAgICB0aGlzLmZyYW1lTGVuZ3RoID0gTWF0aC5tYXgodGhpcy5mcmFtZUxlbmd0aCwgKHBhdGhPYmouc3RhcnRBdCArIHBhdGhPYmouZHVyYXRpb24pKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBsZW5ndGhNZXRlciArPSBwYXRoT2JqLmxlbmd0aDtcbiAgICB0aGlzLmZyYW1lTGVuZ3RoID0gdGhpcy5mcmFtZUxlbmd0aCB8fCB0aGlzLmR1cmF0aW9uO1xuICB9XG59O1xuXG4vKipcbiAqIEludGVydmFsIG1ldGhvZCB0byBkcmF3IHRoZSBTVkcgZnJvbSBjdXJyZW50XG4gKiBwb3NpdGlvbiBvZiB0aGUgYW5pbWF0aW9uLiBJdCB1cGRhdGUgdGhlIHZhbHVlIG9mXG4gKiBgY3VycmVudEZyYW1lYCBhbmQgcmUtdHJhY2UgdGhlIFNWRy5cbiAqXG4gKiBJdCB1c2UgdGhpcy5oYW5kbGUgdG8gc3RvcmUgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZVxuICogYW5kIGNsZWFyIGl0IG9uZSB0aGUgYW5pbWF0aW9uIGlzIHN0b3BwZWQuIFNvIHRoaXNcbiAqIGF0dHJpYnV0ZSBjYW4gYmUgdXNlZCB0byBrbm93IGlmIHRoZSBhbmltYXRpb24gaXNcbiAqIHBsYXlpbmcuXG4gKlxuICogT25jZSB0aGUgYW5pbWF0aW9uIGF0IHRoZSBlbmQsIHRoaXMgbWV0aG9kIHdpbGxcbiAqIHRyaWdnZXIgdGhlIFZpdnVzIGNhbGxiYWNrLlxuICpcbiAqL1xuVml2dXMucHJvdG90eXBlLmRyYXdlciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLmN1cnJlbnRGcmFtZSArPSB0aGlzLnNwZWVkO1xuXG4gIGlmICh0aGlzLmN1cnJlbnRGcmFtZSA8PSAwKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudEZyYW1lID49IHRoaXMuZnJhbWVMZW5ndGgpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuZnJhbWVMZW5ndGg7XG4gICAgdGhpcy50cmFjZSgpO1xuICAgIGlmICh0aGlzLnNlbGZEZXN0cm95KSB7XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy50cmFjZSgpO1xuICAgIHRoaXMuaGFuZGxlID0gcmVxdWVzdEFuaW1GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLmRyYXdlcigpO1xuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuY2FsbGJhY2sodGhpcyk7XG4gIGlmICh0aGlzLmluc3RhbmNlQ2FsbGJhY2spIHtcbiAgICB0aGlzLmluc3RhbmNlQ2FsbGJhY2sodGhpcyk7XG4gICAgdGhpcy5pbnN0YW5jZUNhbGxiYWNrID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBEcmF3IHRoZSBTVkcgYXQgdGhlIGN1cnJlbnQgaW5zdGFudCBmcm9tIHRoZVxuICogYGN1cnJlbnRGcmFtZWAgdmFsdWUuIEhlcmUgaXMgd2hlcmUgbW9zdCBvZiB0aGUgbWFnaWMgaXMuXG4gKiBUaGUgdHJpY2sgaXMgdG8gdXNlIHRoZSBgc3Ryb2tlRGFzaG9mZnNldGAgc3R5bGUgcHJvcGVydHkuXG4gKlxuICogRm9yIG9wdGltaXNhdGlvbiByZWFzb25zLCBhIG5ldyBwcm9wZXJ0eSBjYWxsZWQgYHByb2dyZXNzYFxuICogaXMgYWRkZWQgaW4gZWFjaCBpdGVtIG9mIGBtYXBgLiBUaGlzIG9uZSBjb250YWluIHRoZSBjdXJyZW50XG4gKiBwcm9ncmVzcyBvZiB0aGUgcGF0aCBlbGVtZW50LiBPbmx5IGlmIHRoZSBuZXcgdmFsdWUgaXMgZGlmZmVyZW50XG4gKiB0aGUgbmV3IHZhbHVlIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgRE9NIGVsZW1lbnQuIFRoaXNcbiAqIG1ldGhvZCBzYXZlIGEgbG90IG9mIHJlc291cmNlcyB0byByZS1yZW5kZXIgdGhlIFNWRy4gQW5kIGNvdWxkXG4gKiBiZSBpbXByb3ZlZCBpZiB0aGUgYW5pbWF0aW9uIGNvdWxkbid0IGJlIHBsYXllZCBmb3J3YXJkLlxuICpcbiAqL1xuVml2dXMucHJvdG90eXBlLnRyYWNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaSwgcHJvZ3Jlc3MsIHBhdGgsIGN1cnJlbnRGcmFtZTtcbiAgY3VycmVudEZyYW1lID0gdGhpcy5hbmltVGltaW5nRnVuY3Rpb24odGhpcy5jdXJyZW50RnJhbWUgLyB0aGlzLmZyYW1lTGVuZ3RoKSAqIHRoaXMuZnJhbWVMZW5ndGg7XG4gIGZvciAoaSA9IDA7IGkgPCB0aGlzLm1hcC5sZW5ndGg7IGkrKykge1xuICAgIHBhdGggPSB0aGlzLm1hcFtpXTtcbiAgICBwcm9ncmVzcyA9IChjdXJyZW50RnJhbWUgLSBwYXRoLnN0YXJ0QXQpIC8gcGF0aC5kdXJhdGlvbjtcbiAgICBwcm9ncmVzcyA9IHRoaXMucGF0aFRpbWluZ0Z1bmN0aW9uKE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHByb2dyZXNzKSkpO1xuICAgIGlmIChwYXRoLnByb2dyZXNzICE9PSBwcm9ncmVzcykge1xuICAgICAgcGF0aC5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgICAgcGF0aC5lbC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gTWF0aC5mbG9vcihwYXRoLmxlbmd0aCAqICgxIC0gcHJvZ3Jlc3MpKTtcbiAgICAgIHRoaXMucmVuZGVyUGF0aChpKTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogTWV0aG9kIGZvcmNpbmcgdGhlIGJyb3dzZXIgdG8gcmUtcmVuZGVyIGEgcGF0aCBlbGVtZW50XG4gKiBmcm9tIGl0J3MgaW5kZXggaW4gdGhlIG1hcC4gRGVwZW5kaW5nIG9uIHRoZSBgZm9yY2VSZW5kZXJgXG4gKiB2YWx1ZS5cbiAqIFRoZSB0cmljayBpcyB0byByZXBsYWNlIHRoZSBwYXRoIGVsZW1lbnQgYnkgaXQncyBjbG9uZS5cbiAqIFRoaXMgcHJhY3RpY2UgaXMgbm90IHJlY29tbWVuZGVkIGJlY2F1c2UgaXQncyBhc2tpbmcgbW9yZVxuICogcmVzc291cmNlcywgdG9vIG11Y2ggRE9NIG1hbnVwdWxhdGlvbi4uXG4gKiBidXQgaXQncyB0aGUgb25seSB3YXkgdG8gbGV0IHRoZSBtYWdpYyBoYXBwZW4gb24gSUUuXG4gKiBCeSBkZWZhdWx0LCB0aGlzIGZhbGxiYWNrIGlzIG9ubHkgYXBwbGllZCBvbiBJRS5cbiAqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGluZGV4IFBhdGggaW5kZXhcbiAqL1xuVml2dXMucHJvdG90eXBlLnJlbmRlclBhdGggPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgaWYgKHRoaXMuZm9yY2VSZW5kZXIgJiYgdGhpcy5tYXAgJiYgdGhpcy5tYXBbaW5kZXhdKSB7XG4gICAgdmFyIHBhdGhPYmogPSB0aGlzLm1hcFtpbmRleF0sXG4gICAgICAgIG5ld1BhdGggPSBwYXRoT2JqLmVsLmNsb25lTm9kZSh0cnVlKTtcbiAgICBwYXRoT2JqLmVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld1BhdGgsIHBhdGhPYmouZWwpO1xuICAgIHBhdGhPYmouZWwgPSBuZXdQYXRoO1xuICB9XG59O1xuXG4vKipcbiAqIFdoZW4gdGhlIFNWRyBvYmplY3QgaXMgbG9hZGVkIGFuZCByZWFkeSxcbiAqIHRoaXMgbWV0aG9kIHdpbGwgY29udGludWUgdGhlIGluaXRpYWxpc2F0aW9uLlxuICpcbiAqIFRoaXMgdGhpcyBtYWlubHkgZHVlIHRvIHRoZSBjYXNlIG9mIHBhc3NpbmcgYW5cbiAqIG9iamVjdCB0YWcgaW4gdGhlIGNvbnN0cnVjdG9yLiBJdCB3aWxsIHdhaXRcbiAqIHRoZSBlbmQgb2YgdGhlIGxvYWRpbmcgdG8gaW5pdGlhbGlzZS5cbiAqXG4gKi9cblZpdnVzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBTZXQgb2JqZWN0IHZhcmlhYmxlc1xuICB0aGlzLmZyYW1lTGVuZ3RoID0gMDtcbiAgdGhpcy5jdXJyZW50RnJhbWUgPSAwO1xuICB0aGlzLm1hcCA9IFtdO1xuXG4gIC8vIFN0YXJ0XG4gIG5ldyBQYXRoZm9ybWVyKHRoaXMuZWwpO1xuICB0aGlzLm1hcHBpbmcoKTtcbiAgdGhpcy5zdGFydGVyKCk7XG5cbiAgaWYgKHRoaXMub25SZWFkeSkge1xuICAgIHRoaXMub25SZWFkeSh0aGlzKTtcbiAgfVxufTtcblxuLyoqXG4gKiBUcmlnZ2VyIHRvIHN0YXJ0IG9mIHRoZSBhbmltYXRpb24uXG4gKiBEZXBlbmRpbmcgb24gdGhlIGBzdGFydGAgdmFsdWUsIGEgZGlmZmVyZW50IHNjcmlwdFxuICogd2lsbCBiZSBhcHBsaWVkLlxuICpcbiAqIElmIHRoZSBgc3RhcnRgIHZhbHVlIGlzIG5vdCB2YWxpZCwgYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gKiBFdmVuIGlmIHRlY2huaWNhbGx5LCB0aGlzIGlzIGltcG9zc2libGUuXG4gKlxuICovXG5WaXZ1cy5wcm90b3R5cGUuc3RhcnRlciA9IGZ1bmN0aW9uICgpIHtcbiAgc3dpdGNoICh0aGlzLnN0YXJ0KSB7XG4gIGNhc2UgJ21hbnVhbCc6XG4gICAgcmV0dXJuO1xuXG4gIGNhc2UgJ2F1dG9zdGFydCc6XG4gICAgdGhpcy5wbGF5KCk7XG4gICAgYnJlYWs7XG5cbiAgY2FzZSAnaW5WaWV3cG9ydCc6XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgIGxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuaXNJblZpZXdwb3J0KHNlbGYucGFyZW50RWwsIDEpKSB7XG4gICAgICAgIHNlbGYucGxheSgpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgbGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGxpc3RlbmVyKTtcbiAgICBsaXN0ZW5lcigpO1xuICAgIGJyZWFrO1xuICB9XG59O1xuXG5cbi8qKlxuICogQ29udHJvbHNcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICovXG5cbi8qKlxuICogR2V0IHRoZSBjdXJyZW50IHN0YXR1cyBvZiB0aGUgYW5pbWF0aW9uIGJldHdlZW5cbiAqIHRocmVlIGRpZmZlcmVudCBzdGF0ZXM6ICdzdGFydCcsICdwcm9ncmVzcycsICdlbmQnLlxuICogQHJldHVybiB7c3RyaW5nfSBJbnN0YW5jZSBzdGF0dXNcbiAqL1xuVml2dXMucHJvdG90eXBlLmdldFN0YXR1cyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuY3VycmVudEZyYW1lID09PSAwID8gJ3N0YXJ0JyA6IHRoaXMuY3VycmVudEZyYW1lID09PSB0aGlzLmZyYW1lTGVuZ3RoID8gJ2VuZCcgOiAncHJvZ3Jlc3MnO1xufTtcblxuLyoqXG4gKiBSZXNldCB0aGUgaW5zdGFuY2UgdG8gdGhlIGluaXRpYWwgc3RhdGUgOiB1bmRyYXdcbiAqIEJlIGNhcmVmdWwsIGl0IGp1c3QgcmVzZXQgdGhlIGFuaW1hdGlvbiwgaWYgeW91J3JlXG4gKiBwbGF5aW5nIHRoZSBhbmltYXRpb24sIHRoaXMgd29uJ3Qgc3RvcCBpdC4gQnV0IGp1c3RcbiAqIG1ha2UgaXQgc3RhcnQgZnJvbSBzdGFydC5cbiAqXG4gKi9cblZpdnVzLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuc2V0RnJhbWVQcm9ncmVzcygwKTtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBpbnN0YW5jZSB0byB0aGUgZmluYWwgc3RhdGUgOiBkcmF3blxuICogQmUgY2FyZWZ1bCwgaXQganVzdCBzZXQgdGhlIGFuaW1hdGlvbiwgaWYgeW91J3JlXG4gKiBwbGF5aW5nIHRoZSBhbmltYXRpb24gb24gcmV3aW5kLCB0aGlzIHdvbid0IHN0b3AgaXQuXG4gKiBCdXQganVzdCBtYWtlIGl0IHN0YXJ0IGZyb20gdGhlIGVuZC5cbiAqXG4gKi9cblZpdnVzLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnNldEZyYW1lUHJvZ3Jlc3MoMSk7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgbGV2ZWwgb2YgcHJvZ3Jlc3Mgb2YgdGhlIGRyYXdpbmcuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHByb2dyZXNzIExldmVsIG9mIHByb2dyZXNzIHRvIHNldFxuICovXG5WaXZ1cy5wcm90b3R5cGUuc2V0RnJhbWVQcm9ncmVzcyA9IGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICBwcm9ncmVzcyA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIHByb2dyZXNzKSk7XG4gIHRoaXMuY3VycmVudEZyYW1lID0gTWF0aC5yb3VuZCh0aGlzLmZyYW1lTGVuZ3RoICogcHJvZ3Jlc3MpO1xuICB0aGlzLnRyYWNlKCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBQbGF5IHRoZSBhbmltYXRpb24gYXQgdGhlIGRlc2lyZWQgc3BlZWQuXG4gKiBTcGVlZCBtdXN0IGJlIGEgdmFsaWQgbnVtYmVyIChubyB6ZXJvKS5cbiAqIEJ5IGRlZmF1bHQsIHRoZSBzcGVlZCB2YWx1ZSBpcyAxLlxuICogQnV0IGEgbmVnYXRpdmUgdmFsdWUgaXMgYWNjZXB0ZWQgdG8gZ28gZm9yd2FyZC5cbiAqXG4gKiBBbmQgd29ya3Mgd2l0aCBmbG9hdCB0b28uXG4gKiBCdXQgZG9uJ3QgZm9yZ2V0IHdlIGFyZSBpbiBKYXZhU2NyaXB0LCBzZSBiZSBuaWNlXG4gKiB3aXRoIGhpbSBhbmQgZ2l2ZSBoaW0gYSAxLzJeeCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gIHtudW1iZXJ9IHNwZWVkIEFuaW1hdGlvbiBzcGVlZCBbb3B0aW9uYWxdXG4gKi9cblZpdnVzLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24gKHNwZWVkLCBjYWxsYmFjaykge1xuICB0aGlzLmluc3RhbmNlQ2FsbGJhY2sgPSBudWxsO1xuXG4gIGlmIChzcGVlZCAmJiB0eXBlb2Ygc3BlZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLmluc3RhbmNlQ2FsbGJhY2sgPSBzcGVlZDsgLy8gZmlyc3QgcGFyYW1ldGVyIGlzIGFjdHVhbGx5IHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgIHNwZWVkID0gbnVsbDtcbiAgfVxuICBlbHNlIGlmIChzcGVlZCAmJiB0eXBlb2Ygc3BlZWQgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdWaXZ1cyBbcGxheV06IGludmFsaWQgc3BlZWQnKTtcbiAgfVxuICAvLyBpZiB0aGUgZmlyc3QgcGFyYW1ldGVyIHdhc24ndCB0aGUgY2FsbGJhY2ssIGNoZWNrIGlmIHRoZSBzZWNvbmRzIHdhc1xuICBpZiAoY2FsbGJhY2sgJiYgdHlwZW9mKGNhbGxiYWNrKSA9PT0gJ2Z1bmN0aW9uJyAmJiAhdGhpcy5pbnN0YW5jZUNhbGxiYWNrKSB7XG4gICAgdGhpcy5pbnN0YW5jZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuXG4gIHRoaXMuc3BlZWQgPSBzcGVlZCB8fCAxO1xuICBpZiAoIXRoaXMuaGFuZGxlKSB7XG4gICAgdGhpcy5kcmF3ZXIoKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU3RvcCB0aGUgY3VycmVudCBhbmltYXRpb24sIGlmIG9uIHByb2dyZXNzLlxuICogU2hvdWxkIG5vdCB0cmlnZ2VyIGFueSBlcnJvci5cbiAqXG4gKi9cblZpdnVzLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5oYW5kbGUpIHtcbiAgICBjYW5jZWxBbmltRnJhbWUodGhpcy5oYW5kbGUpO1xuICAgIHRoaXMuaGFuZGxlID0gbnVsbDtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRGVzdHJveSB0aGUgaW5zdGFuY2UuXG4gKiBSZW1vdmUgYWxsIGJhZCBzdHlsaW5nIGF0dHJpYnV0ZXMgb24gYWxsXG4gKiBwYXRoIHRhZ3NcbiAqXG4gKi9cblZpdnVzLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnN0b3AoKTtcbiAgdmFyIGksIHBhdGg7XG4gIGZvciAoaSA9IDA7IGkgPCB0aGlzLm1hcC5sZW5ndGg7IGkrKykge1xuICAgIHBhdGggPSB0aGlzLm1hcFtpXTtcbiAgICBwYXRoLmVsLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBudWxsO1xuICAgIHBhdGguZWwuc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gbnVsbDtcbiAgICB0aGlzLnJlbmRlclBhdGgoaSk7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBVdGlscyBtZXRob2RzXG4gKiBpbmNsdWRlIG1ldGhvZHMgZnJvbSBDb2Ryb3BzXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqL1xuXG4vKipcbiAqIE1ldGhvZCB0byBiZXN0IGd1ZXNzIGlmIGEgcGF0aCBzaG91bGQgYWRkZWQgaW50b1xuICogdGhlIGFuaW1hdGlvbiBvciBub3QuXG4gKlxuICogMS4gVXNlIHRoZSBgZGF0YS12aXZ1cy1pZ25vcmVgIGF0dHJpYnV0ZSBpZiBzZXRcbiAqIDIuIENoZWNrIGlmIHRoZSBpbnN0YW5jZSBtdXN0IGlnbm9yZSBpbnZpc2libGUgcGF0aHNcbiAqIDMuIENoZWNrIGlmIHRoZSBwYXRoIGlzIHZpc2libGVcbiAqXG4gKiBGb3Igbm93IHRoZSB2aXNpYmlsaXR5IGNoZWNraW5nIGlzIHVuc3RhYmxlLlxuICogSXQgd2lsbCBiZSB1c2VkIGZvciBhIGJldGEgcGhhc2UuXG4gKlxuICogT3RoZXIgaW1wcm92bWVudHMgYXJlIHBsYW5uZWQuIExpa2UgZGV0ZWN0aW5nXG4gKiBpcyB0aGUgcGF0aCBnb3QgYSBzdHJva2Ugb3IgYSB2YWxpZCBvcGFjaXR5LlxuICovXG5WaXZ1cy5wcm90b3R5cGUuaXNJbnZpc2libGUgPSBmdW5jdGlvbiAoZWwpIHtcbiAgdmFyIHJlY3QsXG4gICAgaWdub3JlQXR0ciA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pZ25vcmUnKTtcblxuICBpZiAoaWdub3JlQXR0ciAhPT0gbnVsbCkge1xuICAgIHJldHVybiBpZ25vcmVBdHRyICE9PSAnZmFsc2UnO1xuICB9XG5cbiAgaWYgKHRoaXMuaWdub3JlSW52aXNpYmxlKSB7XG4gICAgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiAhcmVjdC53aWR0aCAmJiAhcmVjdC5oZWlnaHQ7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG4vKipcbiAqIFBhcnNlIGF0dHJpYnV0ZXMgb2YgYSBET00gZWxlbWVudCB0b1xuICogZ2V0IGFuIG9iamVjdCBvZiB7YXR0cmlidXRlTmFtZSA9PiBhdHRyaWJ1dGVWYWx1ZX1cbiAqXG4gKiBAcGFyYW0gIHtvYmplY3R9IGVsZW1lbnQgRE9NIGVsZW1lbnQgdG8gcGFyc2VcbiAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICBPYmplY3Qgb2YgYXR0cmlidXRlc1xuICovXG5WaXZ1cy5wcm90b3R5cGUucGFyc2VBdHRyID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdmFyIGF0dHIsIG91dHB1dCA9IHt9O1xuICBpZiAoZWxlbWVudCAmJiBlbGVtZW50LmF0dHJpYnV0ZXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnQuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0ciA9IGVsZW1lbnQuYXR0cmlidXRlc1tpXTtcbiAgICAgIG91dHB1dFthdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogUmVwbHkgaWYgYW4gZWxlbWVudCBpcyBpbiB0aGUgcGFnZSB2aWV3cG9ydFxuICpcbiAqIEBwYXJhbSAge29iamVjdH0gZWwgRWxlbWVudCB0byBvYnNlcnZlXG4gKiBAcGFyYW0gIHtudW1iZXJ9IGggIFBlcmNlbnRhZ2Ugb2YgaGVpZ2h0XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5WaXZ1cy5wcm90b3R5cGUuaXNJblZpZXdwb3J0ID0gZnVuY3Rpb24gKGVsLCBoKSB7XG4gIHZhciBzY3JvbGxlZCAgID0gdGhpcy5zY3JvbGxZKCksXG4gICAgdmlld2VkICAgICAgID0gc2Nyb2xsZWQgKyB0aGlzLmdldFZpZXdwb3J0SCgpLFxuICAgIGVsQkNSICAgICAgICA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgIGVsSGVpZ2h0ICAgICA9IGVsQkNSLmhlaWdodCxcbiAgICBlbFRvcCAgICAgICAgPSBzY3JvbGxlZCArIGVsQkNSLnRvcCxcbiAgICBlbEJvdHRvbSAgICAgPSBlbFRvcCArIGVsSGVpZ2h0O1xuXG4gIC8vIGlmIDAsIHRoZSBlbGVtZW50IGlzIGNvbnNpZGVyZWQgaW4gdGhlIHZpZXdwb3J0IGFzIHNvb24gYXMgaXQgZW50ZXJzLlxuICAvLyBpZiAxLCB0aGUgZWxlbWVudCBpcyBjb25zaWRlcmVkIGluIHRoZSB2aWV3cG9ydCBvbmx5IHdoZW4gaXQncyBmdWxseSBpbnNpZGVcbiAgLy8gdmFsdWUgaW4gcGVyY2VudGFnZSAoMSA+PSBoID49IDApXG4gIGggPSBoIHx8IDA7XG5cbiAgcmV0dXJuIChlbFRvcCArIGVsSGVpZ2h0ICogaCkgPD0gdmlld2VkICYmIChlbEJvdHRvbSkgPj0gc2Nyb2xsZWQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciBkb2N1bWVudCBlbGVtZW50XG4gKlxuICogQHR5cGUge0RPTWVsZW1lbnR9XG4gKi9cblZpdnVzLnByb3RvdHlwZS5kb2NFbGVtID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuLyoqXG4gKiBHZXQgdGhlIHZpZXdwb3J0IGhlaWdodCBpbiBwaXhlbHNcbiAqXG4gKiBAcmV0dXJuIHtpbnRlZ2VyfSBWaWV3cG9ydCBoZWlnaHRcbiAqL1xuVml2dXMucHJvdG90eXBlLmdldFZpZXdwb3J0SCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNsaWVudCA9IHRoaXMuZG9jRWxlbS5jbGllbnRIZWlnaHQsXG4gICAgaW5uZXIgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgaWYgKGNsaWVudCA8IGlubmVyKSB7XG4gICAgcmV0dXJuIGlubmVyO1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybiBjbGllbnQ7XG4gIH1cbn07XG5cbi8qKlxuICogR2V0IHRoZSBwYWdlIFkgb2Zmc2V0XG4gKlxuICogQHJldHVybiB7aW50ZWdlcn0gUGFnZSBZIG9mZnNldFxuICovXG5WaXZ1cy5wcm90b3R5cGUuc2Nyb2xsWSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldCB8fCB0aGlzLmRvY0VsZW0uc2Nyb2xsVG9wO1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3IgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgb3JcbiAqIGBzZXRUaW1lb3V0YCBmdW5jdGlvbiBmb3IgZGVwcmVjYXRlZCBicm93c2Vycy5cbiAqXG4gKi9cbnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gKFxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICAgfHxcbiAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSAgICB8fFxuICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgfHxcbiAgICB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgIHx8XG4gICAgZnVuY3Rpb24oLyogZnVuY3Rpb24gKi8gY2FsbGJhY2spe1xuICAgICAgcmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuICAgIH1cbiAgKTtcbn0pKCk7XG5cbi8qKlxuICogQWxpYXMgZm9yIGBjYW5jZWxBbmltYXRpb25GcmFtZWAgb3JcbiAqIGBjYW5jZWxUaW1lb3V0YCBmdW5jdGlvbiBmb3IgZGVwcmVjYXRlZCBicm93c2Vycy5cbiAqXG4gKi9cbmNhbmNlbEFuaW1GcmFtZSA9IChmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAoXG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lICAgICAgIHx8XG4gICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lICAgIHx8XG4gICAgd2luZG93Lm9DYW5jZWxBbmltYXRpb25GcmFtZSAgICAgIHx8XG4gICAgd2luZG93Lm1zQ2FuY2VsQW5pbWF0aW9uRnJhbWUgICAgIHx8XG4gICAgZnVuY3Rpb24oaWQpe1xuICAgICAgcmV0dXJuIHdpbmRvdy5jbGVhclRpbWVvdXQoaWQpO1xuICAgIH1cbiAgKTtcbn0pKCk7XG5cbi8qKlxuICogUGFyc2Ugc3RyaW5nIHRvIGludGVnZXIuXG4gKiBJZiB0aGUgbnVtYmVyIGlzIG5vdCBwb3NpdGl2ZSBvciBudWxsXG4gKiB0aGUgbWV0aG9kIHdpbGwgcmV0dXJuIHRoZSBkZWZhdWx0IHZhbHVlXG4gKiBvciAwIGlmIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBTdHJpbmcgdG8gcGFyc2VcbiAqIEBwYXJhbSB7Kn0gZGVmYXVsdFZhbHVlIFZhbHVlIHRvIHJldHVybiBpZiB0aGUgcmVzdWx0IHBhcnNlZCBpcyBpbnZhbGlkXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKlxuICovXG5wYXJzZVBvc2l0aXZlSW50ID0gZnVuY3Rpb24gKHZhbHVlLCBkZWZhdWx0VmFsdWUpIHtcbiAgdmFyIG91dHB1dCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gIHJldHVybiAob3V0cHV0ID49IDApID8gb3V0cHV0IDogZGVmYXVsdFZhbHVlO1xufTtcblxuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBWaXZ1cztcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAvLyBsaWtlIE5vZGUuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWaXZ1cztcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICB3aW5kb3cuVml2dXMgPSBWaXZ1cztcbiAgfVxuXG59KHdpbmRvdywgZG9jdW1lbnQpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi92aXZ1cy9kaXN0L3ZpdnVzLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHBhZ2UgbG9hZCBpbnRyb1xudmFyIFZpdnVzID0gcmVxdWlyZSgnLi4vbm9kZV9tb2R1bGVzL3ZpdnVzJyk7XG5yZXF1aXJlKCcuL2dsb2JhbC5zY3NzJyk7XG5yZXF1aXJlKCcuL2hlYWRlci5zY3NzJyk7XG5cbnZhciBsb2dvRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3ZnLWxvZ29cIik7XG5cbm5ldyBWaXZ1cygnc3ZnLWxvZ28nLCB7ZHVyYXRpb246IDIwMCwgYW5pbVRpbWluZ0Z1bmN0aW9uOiBWaXZ1cy5FQVNFfSwgc2V0dXBOYXYpO1xuXG5mdW5jdGlvbiBzZXR1cE5hdigpIHtcbiAgICAvL3N2Z3MgaGF2ZSBzdGlja3kgZWxlbWVudCBoYW5kbGluZyBpbiBqczooXG4gICAgbG9nb0VsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJzdmctbG9nbyBzbWFsbFwiKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJsb2FkZWRcIik7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==