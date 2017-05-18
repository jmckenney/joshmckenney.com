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
__webpack_require__(9);

var logoElement = document.getElementById("svg-logo");

new Vivus('svg-logo', { duration: 200, animTimingFunction: Vivus.EASE }, setupNav);

function setupNav() {
    //svgs have sticky element handling in js:(
    logoElement.setAttribute("class", "svg-logo small");
    document.body.classList.add("loaded");
}

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGYwYWY5YjFlY2FhY2RhNDUwNzUiLCJ3ZWJwYWNrOi8vLy4vYXBwL2dsb2JhbC5zY3NzP2RmOGIiLCJ3ZWJwYWNrOi8vLy4vYXBwL2hlYWRlci5zY3NzPzdlNmUiLCJ3ZWJwYWNrOi8vLy4vfi92aXZ1cy9kaXN0L3ZpdnVzLmpzIiwid2VicGFjazovLy8uL2FwcC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvZm9vdGVyLnNjc3MiXSwibmFtZXMiOlsiVml2dXMiLCJyZXF1aXJlIiwibG9nb0VsZW1lbnQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZHVyYXRpb24iLCJhbmltVGltaW5nRnVuY3Rpb24iLCJFQVNFIiwic2V0dXBOYXYiLCJzZXRBdHRyaWJ1dGUiLCJib2R5IiwiY2xhc3NMaXN0IiwiYWRkIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUEseUM7Ozs7OztBQ0FBLHlDOzs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsV0FBVztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixxQkFBcUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxXQUFXO0FBQ3ZCLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFdBQVc7QUFDdkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxXQUFXO0FBQ3ZCLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxtQkFBbUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksbUJBQW1CO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxXQUFXO0FBQ3ZCLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxXQUFXO0FBQ3ZCLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksV0FBVztBQUN2QixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxXQUFXO0FBQ3ZCLFlBQVksT0FBTztBQUNuQixZQUFZLFdBQVc7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsWUFBWSwrQkFBK0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGFBQWE7QUFDekIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsV0FBVyxXQUFXO0FBQ3RCLFdBQVcsT0FBTztBQUNsQixXQUFXLFNBQVM7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEMsc0NBQXNDO0FBQ3RDLHNDQUFzQztBQUN0QyxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFdBQVc7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEsa0JBQWtCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxxQkFBcUI7QUFDbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEscUJBQXFCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEscUJBQXFCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLCtCQUErQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxFQUFFO0FBQ2IsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQUE7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBLENBQUM7Ozs7Ozs7Ozs7QUNoaUNEO0FBQ0EsSUFBSUEsUUFBUSxtQkFBQUMsQ0FBUSxDQUFSLENBQVo7QUFDQSxtQkFBQUEsQ0FBUSxDQUFSO0FBQ0EsbUJBQUFBLENBQVEsQ0FBUjtBQUNBLG1CQUFBQSxDQUFRLENBQVI7O0FBRUEsSUFBSUMsY0FBY0MsU0FBU0MsY0FBVCxDQUF3QixVQUF4QixDQUFsQjs7QUFFQSxJQUFJSixLQUFKLENBQVUsVUFBVixFQUFzQixFQUFDSyxVQUFVLEdBQVgsRUFBZ0JDLG9CQUFvQk4sTUFBTU8sSUFBMUMsRUFBdEIsRUFBdUVDLFFBQXZFOztBQUVBLFNBQVNBLFFBQVQsR0FBb0I7QUFDaEI7QUFDQU4sZ0JBQVlPLFlBQVosQ0FBeUIsT0FBekIsRUFBa0MsZ0JBQWxDO0FBQ0FOLGFBQVNPLElBQVQsQ0FBY0MsU0FBZCxDQUF3QkMsR0FBeEIsQ0FBNEIsUUFBNUI7QUFDSCxDOzs7Ozs7Ozs7OztBQ2RELHlDIiwiZmlsZSI6ImRpc3QvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwZjBhZjliMWVjYWFjZGE0NTA3NSIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hcHAvZ2xvYmFsLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2FwcC9oZWFkZXIuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIHZpdnVzIC0gSmF2YVNjcmlwdCBsaWJyYXJ5IHRvIG1ha2UgZHJhd2luZyBhbmltYXRpb24gb24gU1ZHXG4gKiBAdmVyc2lvbiB2MC40LjBcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXh3ZWxsaXRvL3ZpdnVzXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xuXG4gICd1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBQYXRoZm9ybWVyXG4gKiBCZXRhIHZlcnNpb25cbiAqXG4gKiBUYWtlIGFueSBTVkcgdmVyc2lvbiAxLjEgYW5kIHRyYW5zZm9ybVxuICogY2hpbGQgZWxlbWVudHMgdG8gJ3BhdGgnIGVsZW1lbnRzXG4gKlxuICogVGhpcyBjb2RlIGlzIHB1cmVseSBmb3JrZWQgZnJvbVxuICogaHR0cHM6Ly9naXRodWIuY29tL1dhZXN0L1NWR1BhdGhDb252ZXJ0ZXJcbiAqL1xuXG4vKipcbiAqIENsYXNzIGNvbnN0cnVjdG9yXG4gKlxuICogQHBhcmFtIHtET018U3RyaW5nfSBlbGVtZW50IERvbSBlbGVtZW50IG9mIHRoZSBTVkcgb3IgaWQgb2YgaXRcbiAqL1xuZnVuY3Rpb24gUGF0aGZvcm1lcihlbGVtZW50KSB7XG4gIC8vIFRlc3QgcGFyYW1zXG4gIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhdGhmb3JtZXIgW2NvbnN0cnVjdG9yXTogXCJlbGVtZW50XCIgcGFyYW1ldGVyIGlzIHJlcXVpcmVkJyk7XG4gIH1cblxuICAvLyBTZXQgdGhlIGVsZW1lbnRcbiAgaWYgKGVsZW1lbnQuY29uc3RydWN0b3IgPT09IFN0cmluZykge1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50KTtcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGF0aGZvcm1lciBbY29uc3RydWN0b3JdOiBcImVsZW1lbnRcIiBwYXJhbWV0ZXIgaXMgbm90IHJlbGF0ZWQgdG8gYW4gZXhpc3RpbmcgSUQnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGVsZW1lbnQuY29uc3RydWN0b3IgaW5zdGFuY2VvZiB3aW5kb3cuU1ZHRWxlbWVudCB8fCAvXnN2ZyQvaS50ZXN0KGVsZW1lbnQubm9kZU5hbWUpKSB7XG4gICAgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQYXRoZm9ybWVyIFtjb25zdHJ1Y3Rvcl06IFwiZWxlbWVudFwiIHBhcmFtZXRlciBtdXN0IGJlIGEgc3RyaW5nIG9yIGEgU1ZHZWxlbWVudCcpO1xuICB9XG5cbiAgLy8gU3RhcnRcbiAgdGhpcy5zY2FuKGVsZW1lbnQpO1xufVxuXG4vKipcbiAqIExpc3Qgb2YgdGFncyB3aGljaCBjYW4gYmUgdHJhbnNmb3JtZWRcbiAqIHRvIHBhdGggZWxlbWVudHNcbiAqXG4gKiBAdHlwZSB7QXJyYXl9XG4gKi9cblBhdGhmb3JtZXIucHJvdG90eXBlLlRZUEVTID0gWydsaW5lJywgJ2VsbGlwc2UnLCAnY2lyY2xlJywgJ3BvbHlnb24nLCAncG9seWxpbmUnLCAncmVjdCddO1xuXG4vKipcbiAqIExpc3Qgb2YgYXR0cmlidXRlIG5hbWVzIHdoaWNoIGNvbnRhaW5cbiAqIGRhdGEuIFRoaXMgYXJyYXkgbGlzdCB0aGVtIHRvIGNoZWNrIGlmXG4gKiB0aGV5IGNvbnRhaW4gYmFkIHZhbHVlcywgbGlrZSBwZXJjZW50YWdlLlxuICpcbiAqIEB0eXBlIHtBcnJheX1cbiAqL1xuUGF0aGZvcm1lci5wcm90b3R5cGUuQVRUUl9XQVRDSCA9IFsnY3gnLCAnY3knLCAncG9pbnRzJywgJ3InLCAncngnLCAncnknLCAneCcsICd4MScsICd4MicsICd5JywgJ3kxJywgJ3kyJ107XG5cbi8qKlxuICogRmluZHMgdGhlIGVsZW1lbnRzIGNvbXBhdGlibGUgZm9yIHRyYW5zZm9ybVxuICogYW5kIGFwcGx5IHRoZSBsaWtlZCBtZXRob2RcbiAqXG4gKiBAcGFyYW0gIHtvYmplY3R9IG9wdGlvbnMgT2JqZWN0IGZyb20gdGhlIGNvbnN0cnVjdG9yXG4gKi9cblBhdGhmb3JtZXIucHJvdG90eXBlLnNjYW4gPSBmdW5jdGlvbiAoc3ZnKSB7XG4gIHZhciBmbiwgZWxlbWVudCwgcGF0aERhdGEsIHBhdGhEb20sXG4gICAgICBlbGVtZW50cyA9IHN2Zy5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuVFlQRVMuam9pbignLCcpKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuICAgIGZuID0gdGhpc1tlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSArICdUb1BhdGgnXTtcbiAgICBwYXRoRGF0YSA9IGZuKHRoaXMucGFyc2VBdHRyKGVsZW1lbnQuYXR0cmlidXRlcykpO1xuICAgIHBhdGhEb20gPSB0aGlzLnBhdGhNYWtlcihlbGVtZW50LCBwYXRoRGF0YSk7XG4gICAgZWxlbWVudC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChwYXRoRG9tLCBlbGVtZW50KTtcbiAgfVxufTtcblxuXG4vKipcbiAqIFJlYWQgYGxpbmVgIGVsZW1lbnQgdG8gZXh0cmFjdCBhbmQgdHJhbnNmb3JtXG4gKiBkYXRhLCB0byBtYWtlIGl0IHJlYWR5IGZvciBhIGBwYXRoYCBvYmplY3QuXG4gKlxuICogQHBhcmFtICB7RE9NZWxlbWVudH0gZWxlbWVudCBMaW5lIGVsZW1lbnQgdG8gdHJhbnNmb3JtXG4gKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgICAgIERhdGEgZm9yIGEgYHBhdGhgIGVsZW1lbnRcbiAqL1xuUGF0aGZvcm1lci5wcm90b3R5cGUubGluZVRvUGF0aCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBuZXdFbGVtZW50ID0ge30sXG4gICAgICB4MSA9IGVsZW1lbnQueDEgfHwgMCxcbiAgICAgIHkxID0gZWxlbWVudC55MSB8fCAwLFxuICAgICAgeDIgPSBlbGVtZW50LngyIHx8IDAsXG4gICAgICB5MiA9IGVsZW1lbnQueTIgfHwgMDtcblxuICBuZXdFbGVtZW50LmQgPSAnTScgKyB4MSArICcsJyArIHkxICsgJ0wnICsgeDIgKyAnLCcgKyB5MjtcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59O1xuXG4vKipcbiAqIFJlYWQgYHJlY3RgIGVsZW1lbnQgdG8gZXh0cmFjdCBhbmQgdHJhbnNmb3JtXG4gKiBkYXRhLCB0byBtYWtlIGl0IHJlYWR5IGZvciBhIGBwYXRoYCBvYmplY3QuXG4gKiBUaGUgcmFkaXVzLWJvcmRlciBpcyBub3QgdGFrZW4gaW4gY2hhcmdlIHlldC5cbiAqICh5b3VyIGhlbHAgaXMgbW9yZSB0aGFuIHdlbGNvbWVkKVxuICpcbiAqIEBwYXJhbSAge0RPTWVsZW1lbnR9IGVsZW1lbnQgUmVjdCBlbGVtZW50IHRvIHRyYW5zZm9ybVxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICBEYXRhIGZvciBhIGBwYXRoYCBlbGVtZW50XG4gKi9cblBhdGhmb3JtZXIucHJvdG90eXBlLnJlY3RUb1BhdGggPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB2YXIgbmV3RWxlbWVudCA9IHt9LFxuICAgICAgeCAgICAgID0gcGFyc2VGbG9hdChlbGVtZW50LngpICAgICAgfHwgMCxcbiAgICAgIHkgICAgICA9IHBhcnNlRmxvYXQoZWxlbWVudC55KSAgICAgIHx8IDAsXG4gICAgICB3aWR0aCAgPSBwYXJzZUZsb2F0KGVsZW1lbnQud2lkdGgpICB8fCAwLFxuICAgICAgaGVpZ2h0ID0gcGFyc2VGbG9hdChlbGVtZW50LmhlaWdodCkgfHwgMDtcblxuICBuZXdFbGVtZW50LmQgID0gJ00nICsgeCArICcgJyArIHkgKyAnICc7XG4gIG5ld0VsZW1lbnQuZCArPSAnTCcgKyAoeCArIHdpZHRoKSArICcgJyArIHkgKyAnICc7XG4gIG5ld0VsZW1lbnQuZCArPSAnTCcgKyAoeCArIHdpZHRoKSArICcgJyArICh5ICsgaGVpZ2h0KSArICcgJztcbiAgbmV3RWxlbWVudC5kICs9ICdMJyArIHggKyAnICcgKyAoeSArIGhlaWdodCkgKyAnIFonO1xuICByZXR1cm4gbmV3RWxlbWVudDtcbn07XG5cbi8qKlxuICogUmVhZCBgcG9seWxpbmVgIGVsZW1lbnQgdG8gZXh0cmFjdCBhbmQgdHJhbnNmb3JtXG4gKiBkYXRhLCB0byBtYWtlIGl0IHJlYWR5IGZvciBhIGBwYXRoYCBvYmplY3QuXG4gKlxuICogQHBhcmFtICB7RE9NZWxlbWVudH0gZWxlbWVudCBQb2x5bGluZSBlbGVtZW50IHRvIHRyYW5zZm9ybVxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICBEYXRhIGZvciBhIGBwYXRoYCBlbGVtZW50XG4gKi9cblBhdGhmb3JtZXIucHJvdG90eXBlLnBvbHlsaW5lVG9QYXRoID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSB7fSxcbiAgICAgIHBvaW50cyA9IGVsZW1lbnQucG9pbnRzLnRyaW0oKS5zcGxpdCgnICcpLFxuICAgICAgaSwgcGF0aDtcblxuICAvLyBSZWZvcm1hdHRpbmcgaWYgcG9pbnRzIGFyZSBkZWZpbmVkIHdpdGhvdXQgY29tbWFzXG4gIGlmIChlbGVtZW50LnBvaW50cy5pbmRleE9mKCcsJykgPT09IC0xKSB7XG4gICAgdmFyIGZvcm1hdHRlZFBvaW50cyA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKz0yKSB7XG4gICAgICBmb3JtYXR0ZWRQb2ludHMucHVzaChwb2ludHNbaV0gKyAnLCcgKyBwb2ludHNbaSsxXSk7XG4gICAgfVxuICAgIHBvaW50cyA9IGZvcm1hdHRlZFBvaW50cztcbiAgfVxuXG4gIC8vIEdlbmVyYXRlIHRoZSBwYXRoLmQgdmFsdWVcbiAgcGF0aCA9ICdNJyArIHBvaW50c1swXTtcbiAgZm9yKGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHBvaW50c1tpXS5pbmRleE9mKCcsJykgIT09IC0xKSB7XG4gICAgICBwYXRoICs9ICdMJyArIHBvaW50c1tpXTtcbiAgICB9XG4gIH1cbiAgbmV3RWxlbWVudC5kID0gcGF0aDtcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59O1xuXG4vKipcbiAqIFJlYWQgYHBvbHlnb25gIGVsZW1lbnQgdG8gZXh0cmFjdCBhbmQgdHJhbnNmb3JtXG4gKiBkYXRhLCB0byBtYWtlIGl0IHJlYWR5IGZvciBhIGBwYXRoYCBvYmplY3QuXG4gKiBUaGlzIG1ldGhvZCByZWx5IG9uIHBvbHlsaW5lVG9QYXRoLCBiZWNhdXNlIHRoZVxuICogbG9naWMgaXMgc2ltaWxhci4gVGhlIHBhdGggY3JlYXRlZCBpcyBqdXN0IGNsb3NlZCxcbiAqIHNvIGl0IG5lZWRzIGFuICdaJyBhdCB0aGUgZW5kLlxuICpcbiAqIEBwYXJhbSAge0RPTWVsZW1lbnR9IGVsZW1lbnQgUG9seWdvbiBlbGVtZW50IHRvIHRyYW5zZm9ybVxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICBEYXRhIGZvciBhIGBwYXRoYCBlbGVtZW50XG4gKi9cblBhdGhmb3JtZXIucHJvdG90eXBlLnBvbHlnb25Ub1BhdGggPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB2YXIgbmV3RWxlbWVudCA9IFBhdGhmb3JtZXIucHJvdG90eXBlLnBvbHlsaW5lVG9QYXRoKGVsZW1lbnQpO1xuXG4gIG5ld0VsZW1lbnQuZCArPSAnWic7XG4gIHJldHVybiBuZXdFbGVtZW50O1xufTtcblxuLyoqXG4gKiBSZWFkIGBlbGxpcHNlYCBlbGVtZW50IHRvIGV4dHJhY3QgYW5kIHRyYW5zZm9ybVxuICogZGF0YSwgdG8gbWFrZSBpdCByZWFkeSBmb3IgYSBgcGF0aGAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSAge0RPTWVsZW1lbnR9IGVsZW1lbnQgZWxsaXBzZSBlbGVtZW50IHRvIHRyYW5zZm9ybVxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICBEYXRhIGZvciBhIGBwYXRoYCBlbGVtZW50XG4gKi9cblBhdGhmb3JtZXIucHJvdG90eXBlLmVsbGlwc2VUb1BhdGggPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB2YXIgbmV3RWxlbWVudCA9IHt9LFxuICAgICAgcnggPSBwYXJzZUZsb2F0KGVsZW1lbnQucngpIHx8IDAsXG4gICAgICByeSA9IHBhcnNlRmxvYXQoZWxlbWVudC5yeSkgfHwgMCxcbiAgICAgIGN4ID0gcGFyc2VGbG9hdChlbGVtZW50LmN4KSB8fCAwLFxuICAgICAgY3kgPSBwYXJzZUZsb2F0KGVsZW1lbnQuY3kpIHx8IDAsXG4gICAgICBzdGFydFggPSBjeCAtIHJ4LFxuICAgICAgc3RhcnRZID0gY3ksXG4gICAgICBlbmRYID0gcGFyc2VGbG9hdChjeCkgKyBwYXJzZUZsb2F0KHJ4KSxcbiAgICAgIGVuZFkgPSBjeTtcblxuICBuZXdFbGVtZW50LmQgPSAnTScgKyBzdGFydFggKyAnLCcgKyBzdGFydFkgK1xuICAgICAgICAgICAgICAgICAnQScgKyByeCArICcsJyArIHJ5ICsgJyAwLDEsMSAnICsgZW5kWCArICcsJyArIGVuZFkgK1xuICAgICAgICAgICAgICAgICAnQScgKyByeCArICcsJyArIHJ5ICsgJyAwLDEsMSAnICsgc3RhcnRYICsgJywnICsgZW5kWTtcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59O1xuXG4vKipcbiAqIFJlYWQgYGNpcmNsZWAgZWxlbWVudCB0byBleHRyYWN0IGFuZCB0cmFuc2Zvcm1cbiAqIGRhdGEsIHRvIG1ha2UgaXQgcmVhZHkgZm9yIGEgYHBhdGhgIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gIHtET01lbGVtZW50fSBlbGVtZW50IENpcmNsZSBlbGVtZW50IHRvIHRyYW5zZm9ybVxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICBEYXRhIGZvciBhIGBwYXRoYCBlbGVtZW50XG4gKi9cblBhdGhmb3JtZXIucHJvdG90eXBlLmNpcmNsZVRvUGF0aCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBuZXdFbGVtZW50ID0ge30sXG4gICAgICByICA9IHBhcnNlRmxvYXQoZWxlbWVudC5yKSAgfHwgMCxcbiAgICAgIGN4ID0gcGFyc2VGbG9hdChlbGVtZW50LmN4KSB8fCAwLFxuICAgICAgY3kgPSBwYXJzZUZsb2F0KGVsZW1lbnQuY3kpIHx8IDAsXG4gICAgICBzdGFydFggPSBjeCAtIHIsXG4gICAgICBzdGFydFkgPSBjeSxcbiAgICAgIGVuZFggPSBwYXJzZUZsb2F0KGN4KSArIHBhcnNlRmxvYXQociksXG4gICAgICBlbmRZID0gY3k7XG4gICAgICBcbiAgbmV3RWxlbWVudC5kID0gICdNJyArIHN0YXJ0WCArICcsJyArIHN0YXJ0WSArXG4gICAgICAgICAgICAgICAgICAnQScgKyByICsgJywnICsgciArICcgMCwxLDEgJyArIGVuZFggKyAnLCcgKyBlbmRZICtcbiAgICAgICAgICAgICAgICAgICdBJyArIHIgKyAnLCcgKyByICsgJyAwLDEsMSAnICsgc3RhcnRYICsgJywnICsgZW5kWTtcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBgcGF0aGAgZWxlbWVudHMgZm9ybSBvcmlnaW5hbCBlbGVtZW50XG4gKiBhbmQgcHJlcGFyZWQgb2JqZWN0c1xuICpcbiAqIEBwYXJhbSAge0RPTWVsZW1lbnR9IGVsZW1lbnQgIE9yaWdpbmFsIGVsZW1lbnQgdG8gdHJhbnNmb3JtXG4gKiBAcGFyYW0gIHtvYmplY3R9IHBhdGhEYXRhICAgICBQYXRoIGRhdGEgKGZyb20gYHRvUGF0aGAgbWV0aG9kcylcbiAqIEByZXR1cm4ge0RPTWVsZW1lbnR9ICAgICAgICAgIFBhdGggZWxlbWVudFxuICovXG5QYXRoZm9ybWVyLnByb3RvdHlwZS5wYXRoTWFrZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGF0aERhdGEpIHtcbiAgdmFyIGksIGF0dHIsIHBhdGhUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywncGF0aCcpO1xuICBmb3IoaSA9IDA7IGkgPCBlbGVtZW50LmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBhdHRyID0gZWxlbWVudC5hdHRyaWJ1dGVzW2ldO1xuICAgIGlmICh0aGlzLkFUVFJfV0FUQ0guaW5kZXhPZihhdHRyLm5hbWUpID09PSAtMSkge1xuICAgICAgcGF0aFRhZy5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKTtcbiAgICB9XG4gIH1cbiAgZm9yKGkgaW4gcGF0aERhdGEpIHtcbiAgICBwYXRoVGFnLnNldEF0dHJpYnV0ZShpLCBwYXRoRGF0YVtpXSk7XG4gIH1cbiAgcmV0dXJuIHBhdGhUYWc7XG59O1xuXG4vKipcbiAqIFBhcnNlIGF0dHJpYnV0ZXMgb2YgYSBET00gZWxlbWVudCB0b1xuICogZ2V0IGFuIG9iamVjdCBvZiBhdHRyaWJ1dGUgPT4gdmFsdWVcbiAqXG4gKiBAcGFyYW0gIHtOYW1lZE5vZGVNYXB9IGF0dHJpYnV0ZXMgQXR0cmlidXRlcyBvYmplY3QgZnJvbSBET00gZWxlbWVudCB0byBwYXJzZVxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICAgICAgIE9iamVjdCBvZiBhdHRyaWJ1dGVzXG4gKi9cblBhdGhmb3JtZXIucHJvdG90eXBlLnBhcnNlQXR0ciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBhdHRyLCBvdXRwdXQgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgYXR0ciA9IGVsZW1lbnRbaV07XG4gICAgLy8gQ2hlY2sgaWYgbm8gZGF0YSBhdHRyaWJ1dGUgY29udGFpbnMgJyUnLCBvciB0aGUgdHJhbnNmb3JtYXRpb24gaXMgaW1wb3NzaWJsZVxuICAgIGlmICh0aGlzLkFUVFJfV0FUQ0guaW5kZXhPZihhdHRyLm5hbWUpICE9PSAtMSAmJiBhdHRyLnZhbHVlLmluZGV4T2YoJyUnKSAhPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGF0aGZvcm1lciBbcGFyc2VBdHRyXTogYSBTVkcgc2hhcGUgZ290IHZhbHVlcyBpbiBwZXJjZW50YWdlLiBUaGlzIGNhbm5vdCBiZSB0cmFuc2Zvcm1lZCBpbnRvIFxcJ3BhdGhcXCcgdGFncy4gUGxlYXNlIHVzZSBcXCd2aWV3Qm94XFwnLicpO1xuICAgIH1cbiAgICBvdXRwdXRbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn07XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVxdWVzdEFuaW1GcmFtZSwgY2FuY2VsQW5pbUZyYW1lLCBwYXJzZVBvc2l0aXZlSW50O1xuXG4vKipcbiAqIFZpdnVzXG4gKiBCZXRhIHZlcnNpb25cbiAqXG4gKiBUYWtlIGFueSBTVkcgYW5kIG1ha2UgdGhlIGFuaW1hdGlvblxuICogdG8gZ2l2ZSBnaXZlIHRoZSBpbXByZXNzaW9uIG9mIGxpdmUgZHJhd2luZ1xuICpcbiAqIFRoaXMgaW4gbW9yZSB0aGFuIGp1c3QgaW5zcGlyZWQgZnJvbSBjb2Ryb3BzXG4gKiBBdCB0aGF0IHBvaW50LCBpdCdzIGEgcHVyZSBmb3JrLlxuICovXG5cbi8qKlxuICogQ2xhc3MgY29uc3RydWN0b3JcbiAqIG9wdGlvbiBzdHJ1Y3R1cmVcbiAqICAgdHlwZTogJ2RlbGF5ZWQnfCdzeW5jJ3wnb25lQnlPbmUnfCdzY3JpcHQnICh0byBrbm93IGlmIHRoZSBpdGVtcyBtdXN0IGJlIGRyYXduIHN5bmNocm9ub3VzbHkgb3Igbm90LCBkZWZhdWx0OiBkZWxheWVkKVxuICogICBkdXJhdGlvbjogPGludD4gKGluIGZyYW1lcylcbiAqICAgc3RhcnQ6ICdpblZpZXdwb3J0J3wnbWFudWFsJ3wnYXV0b3N0YXJ0JyAoc3RhcnQgYXV0b21hdGljYWxseSB0aGUgYW5pbWF0aW9uLCBkZWZhdWx0OiBpblZpZXdwb3J0KVxuICogICBkZWxheTogPGludD4gKGRlbGF5IGJldHdlZW4gdGhlIGRyYXdpbmcgb2YgZmlyc3QgYW5kIGxhc3QgcGF0aClcbiAqICAgZGFzaEdhcCA8aW50ZWdlcj4gd2hpdGVzcGFjZSBleHRyYSBtYXJnaW4gYmV0d2VlbiBkYXNoZXNcbiAqICAgcGF0aFRpbWluZ0Z1bmN0aW9uIDxmdW5jdGlvbj4gdGltaW5nIGFuaW1hdGlvbiBmdW5jdGlvbiBmb3IgZWFjaCBwYXRoIGVsZW1lbnQgb2YgdGhlIFNWR1xuICogICBhbmltVGltaW5nRnVuY3Rpb24gPGZ1bmN0aW9uPiB0aW1pbmcgYW5pbWF0aW9uIGZ1bmN0aW9uIGZvciB0aGUgY29tcGxldGUgU1ZHXG4gKiAgIGZvcmNlUmVuZGVyIDxib29sZWFuPiBmb3JjZSB0aGUgYnJvd3NlciB0byByZS1yZW5kZXIgYWxsIHVwZGF0ZWQgcGF0aCBpdGVtc1xuICogICBzZWxmRGVzdHJveSA8Ym9vbGVhbj4gcmVtb3ZlcyBhbGwgZXh0cmEgc3R5bGluZyBvbiB0aGUgU1ZHLCBhbmQgbGVhdmVzIGl0IGFzIG9yaWdpbmFsXG4gKlxuICogVGhlIGF0dHJpYnV0ZSAndHlwZScgaXMgYnkgZGVmYXVsdCBvbiAnZGVsYXllZCcuXG4gKiAgLSAnZGVsYXllZCdcbiAqICAgIGFsbCBwYXRocyBhcmUgZHJhdyBhdCB0aGUgc2FtZSB0aW1lIGJ1dCB3aXRoIGFcbiAqICAgIGxpdHRsZSBkZWxheSBiZXR3ZWVuIHRoZW0gYmVmb3JlIHN0YXJ0XG4gKiAgLSAnc3luYydcbiAqICAgIGFsbCBwYXRoIGFyZSBzdGFydCBhbmQgZmluaXNoIGF0IHRoZSBzYW1lIHRpbWVcbiAqICAtICdvbmVCeU9uZSdcbiAqICAgIG9ubHkgb25lIHBhdGggaXMgZHJhdyBhdCB0aGUgdGltZVxuICogICAgdGhlIGVuZCBvZiB0aGUgZmlyc3Qgb25lIHdpbGwgdHJpZ2dlciB0aGUgZHJhd1xuICogICAgb2YgdGhlIG5leHQgb25lXG4gKlxuICogQWxsIHRoZXNlIHZhbHVlcyBjYW4gYmUgb3ZlcndyaXR0ZW4gaW5kaXZpZHVhbGx5XG4gKiBmb3IgZWFjaCBwYXRoIGl0ZW0gaW4gdGhlIFNWR1xuICogVGhlIHZhbHVlIG9mIGZyYW1lcyB3aWxsIGFsd2F5cyB0YWtlIHRoZSBhZHZhbnRhZ2Ugb2ZcbiAqIHRoZSBkdXJhdGlvbiB2YWx1ZS5cbiAqIElmIHlvdSBmYWlsIHNvbWV3aGVyZSwgYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gKiBHb29kIGx1Y2suXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAdGhpcyB7Vml2dXN9XG4gKiBAcGFyYW0ge0RPTXxTdHJpbmd9ICAgZWxlbWVudCAgRG9tIGVsZW1lbnQgb2YgdGhlIFNWRyBvciBpZCBvZiBpdFxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgIG9wdGlvbnMgIE9wdGlvbnMgYWJvdXQgdGhlIGFuaW1hdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gICAgIGNhbGxiYWNrIENhbGxiYWNrIGZvciB0aGUgZW5kIG9mIHRoZSBhbmltYXRpb25cbiAqL1xuZnVuY3Rpb24gVml2dXMgKGVsZW1lbnQsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG5cbiAgLy8gU2V0dXBcbiAgdGhpcy5pc1JlYWR5ID0gZmFsc2U7XG4gIHRoaXMuc2V0RWxlbWVudChlbGVtZW50LCBvcHRpb25zKTtcbiAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICB0aGlzLnNldENhbGxiYWNrKGNhbGxiYWNrKTtcblxuICBpZiAodGhpcy5pc1JlYWR5KSB7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaW1pbmcgZnVuY3Rpb25zXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiBEZWZhdWx0IGZ1bmN0aW9ucyB0byBoZWxwIGRldmVsb3BlcnMuXG4gKiBJdCBhbHdheXMgdGFrZSBhIG51bWJlciBhcyBwYXJhbWV0ZXIgKGJldHdlZW4gMCB0byAxKSB0aGVuXG4gKiByZXR1cm4gYSBudW1iZXIgKGJldHdlZW4gMCBhbmQgMSlcbiAqL1xuVml2dXMuTElORUFSICAgICAgICAgID0gZnVuY3Rpb24gKHgpIHtyZXR1cm4geDt9O1xuVml2dXMuRUFTRSAgICAgICAgICAgID0gZnVuY3Rpb24gKHgpIHtyZXR1cm4gLU1hdGguY29zKHggKiBNYXRoLlBJKSAvIDIgKyAwLjU7fTtcblZpdnVzLkVBU0VfT1VUICAgICAgICA9IGZ1bmN0aW9uICh4KSB7cmV0dXJuIDEgLSBNYXRoLnBvdygxLXgsIDMpO307XG5WaXZ1cy5FQVNFX0lOICAgICAgICAgPSBmdW5jdGlvbiAoeCkge3JldHVybiBNYXRoLnBvdyh4LCAzKTt9O1xuVml2dXMuRUFTRV9PVVRfQk9VTkNFID0gZnVuY3Rpb24gKHgpIHtcbiAgdmFyIGJhc2UgPSAtTWF0aC5jb3MoeCAqICgwLjUgKiBNYXRoLlBJKSkgKyAxLFxuICAgIHJhdGUgPSBNYXRoLnBvdyhiYXNlLDEuNSksXG4gICAgcmF0ZVIgPSBNYXRoLnBvdygxIC0geCwgMiksXG4gICAgcHJvZ3Jlc3MgPSAtTWF0aC5hYnMoTWF0aC5jb3MocmF0ZSAqICgyLjUgKiBNYXRoLlBJKSApKSArIDE7XG4gIHJldHVybiAoMS0gcmF0ZVIpICsgKHByb2dyZXNzICogcmF0ZVIpO1xufTtcblxuXG4vKipcbiAqIFNldHRlcnNcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICovXG5cbi8qKlxuICogQ2hlY2sgYW5kIHNldCB0aGUgZWxlbWVudCBpbiB0aGUgaW5zdGFuY2VcbiAqIFRoZSBtZXRob2Qgd2lsbCBub3QgcmV0dXJuIGFueXRoaW5nLCBidXQgd2lsbCB0aHJvdyBhblxuICogZXJyb3IgaWYgdGhlIHBhcmFtZXRlciBpcyBpbnZhbGlkXG4gKlxuICogQHBhcmFtIHtET018U3RyaW5nfSAgIGVsZW1lbnQgIFNWRyBEb20gZWxlbWVudCBvciBpZCBvZiBpdFxuICovXG5WaXZ1cy5wcm90b3R5cGUuc2V0RWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gIC8vIEJhc2ljIGNoZWNrXG4gIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZpdnVzIFtjb25zdHJ1Y3Rvcl06IFwiZWxlbWVudFwiIHBhcmFtZXRlciBpcyByZXF1aXJlZCcpO1xuICB9XG5cbiAgLy8gU2V0IHRoZSBlbGVtZW50XG4gIGlmIChlbGVtZW50LmNvbnN0cnVjdG9yID09PSBTdHJpbmcpIHtcbiAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZpdnVzIFtjb25zdHJ1Y3Rvcl06IFwiZWxlbWVudFwiIHBhcmFtZXRlciBpcyBub3QgcmVsYXRlZCB0byBhbiBleGlzdGluZyBJRCcpO1xuICAgIH1cbiAgfVxuICB0aGlzLnBhcmVudEVsID0gZWxlbWVudDtcblxuICAvLyBDcmVhdGUgdGhlIG9iamVjdCBlbGVtZW50IGlmIHRoZSBwcm9wZXJ0eSBgZmlsZWAgZXhpc3RzIGluIHRoZSBvcHRpb25zIG9iamVjdFxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZpbGUpIHtcbiAgICB2YXIgb2JqRWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2JqZWN0Jyk7XG4gICAgb2JqRWxtLnNldEF0dHJpYnV0ZSgndHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgb2JqRWxtLnNldEF0dHJpYnV0ZSgnZGF0YScsIG9wdGlvbnMuZmlsZSk7XG4gICAgb2JqRWxtLnNldEF0dHJpYnV0ZSgnYnVpbHQtYnktdml2dXMnLCAndHJ1ZScpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQob2JqRWxtKTtcbiAgICBlbGVtZW50ID0gb2JqRWxtO1xuICB9XG5cbiAgc3dpdGNoIChlbGVtZW50LmNvbnN0cnVjdG9yKSB7XG4gIGNhc2Ugd2luZG93LlNWR1NWR0VsZW1lbnQ6XG4gIGNhc2Ugd2luZG93LlNWR0VsZW1lbnQ6XG4gICAgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5pc1JlYWR5ID0gdHJ1ZTtcbiAgICBicmVhaztcblxuICBjYXNlIHdpbmRvdy5IVE1MT2JqZWN0RWxlbWVudDpcbiAgICAvLyBJZiB3ZSBoYXZlIHRvIHdhaXQgZm9yIGl0XG4gICAgdmFyIG9uTG9hZCwgc2VsZjtcblxuICAgIHNlbGYgPSB0aGlzO1xuICAgIG9uTG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoc2VsZi5pc1JlYWR5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlbGYuZWwgPSBlbGVtZW50LmNvbnRlbnREb2N1bWVudCAmJiBlbGVtZW50LmNvbnRlbnREb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICAgIGlmICghc2VsZi5lbCAmJiBlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVml2dXMgW2NvbnN0cnVjdG9yXTogb2JqZWN0IGxvYWRlZCBkb2VzIG5vdCBjb250YWluIGFueSBTVkcnKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHNlbGYuZWwpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdidWlsdC1ieS12aXZ1cycpKSB7XG4gICAgICAgICAgc2VsZi5wYXJlbnRFbC5pbnNlcnRCZWZvcmUoc2VsZi5lbCwgZWxlbWVudCk7XG4gICAgICAgICAgc2VsZi5wYXJlbnRFbC5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICBzZWxmLmVsLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMTAwJScpO1xuICAgICAgICAgIHNlbGYuZWwuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuaXNSZWFkeSA9IHRydWU7XG4gICAgICAgIHNlbGYuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCFvbkxvYWQoKSkge1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkKTtcbiAgICB9XG4gICAgYnJlYWs7XG5cbiAgZGVmYXVsdDpcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZpdnVzIFtjb25zdHJ1Y3Rvcl06IFwiZWxlbWVudFwiIHBhcmFtZXRlciBpcyBub3QgdmFsaWQgKG9yIG1pc3MgdGhlIFwiZmlsZVwiIGF0dHJpYnV0ZSknKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTZXQgdXAgdXNlciBvcHRpb24gdG8gdGhlIGluc3RhbmNlXG4gKiBUaGUgbWV0aG9kIHdpbGwgbm90IHJldHVybiBhbnl0aGluZywgYnV0IHdpbGwgdGhyb3cgYW5cbiAqIGVycm9yIGlmIHRoZSBwYXJhbWV0ZXIgaXMgaW52YWxpZFxuICpcbiAqIEBwYXJhbSAge29iamVjdH0gb3B0aW9ucyBPYmplY3QgZnJvbSB0aGUgY29uc3RydWN0b3JcbiAqL1xuVml2dXMucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgYWxsb3dlZFR5cGVzID0gWydkZWxheWVkJywgJ3N5bmMnLCAnYXN5bmMnLCAnbnN5bmMnLCAnb25lQnlPbmUnLCAnc2NlbmFyaW8nLCAnc2NlbmFyaW8tc3luYyddO1xuICB2YXIgYWxsb3dlZFN0YXJ0cyA9ICBbJ2luVmlld3BvcnQnLCAnbWFudWFsJywgJ2F1dG9zdGFydCddO1xuXG4gIC8vIEJhc2ljIGNoZWNrXG4gIGlmIChvcHRpb25zICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy5jb25zdHJ1Y3RvciAhPT0gT2JqZWN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdWaXZ1cyBbY29uc3RydWN0b3JdOiBcIm9wdGlvbnNcIiBwYXJhbWV0ZXIgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuICBlbHNlIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgfVxuXG4gIC8vIFNldCB0aGUgYW5pbWF0aW9uIHR5cGVcbiAgaWYgKG9wdGlvbnMudHlwZSAmJiBhbGxvd2VkVHlwZXMuaW5kZXhPZihvcHRpb25zLnR5cGUpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVml2dXMgW2NvbnN0cnVjdG9yXTogJyArIG9wdGlvbnMudHlwZSArICcgaXMgbm90IGFuIGV4aXN0aW5nIGFuaW1hdGlvbiBgdHlwZWAnKTtcbiAgfVxuICBlbHNlIHtcbiAgICB0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGUgfHwgYWxsb3dlZFR5cGVzWzBdO1xuICB9XG5cbiAgLy8gU2V0IHRoZSBzdGFydCB0eXBlXG4gIGlmIChvcHRpb25zLnN0YXJ0ICYmIGFsbG93ZWRTdGFydHMuaW5kZXhPZihvcHRpb25zLnN0YXJ0KSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZpdnVzIFtjb25zdHJ1Y3Rvcl06ICcgKyBvcHRpb25zLnN0YXJ0ICsgJyBpcyBub3QgYW4gZXhpc3RpbmcgYHN0YXJ0YCBvcHRpb24nKTtcbiAgfVxuICBlbHNlIHtcbiAgICB0aGlzLnN0YXJ0ID0gb3B0aW9ucy5zdGFydCB8fCBhbGxvd2VkU3RhcnRzWzBdO1xuICB9XG5cbiAgdGhpcy5pc0lFICAgICAgICAgPSAod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRScpICE9PSAtMSB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdUcmlkZW50LycpICE9PSAtMSB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdFZGdlLycpICE9PSAtMSApO1xuICB0aGlzLmR1cmF0aW9uICAgICA9IHBhcnNlUG9zaXRpdmVJbnQob3B0aW9ucy5kdXJhdGlvbiwgMTIwKTtcbiAgdGhpcy5kZWxheSAgICAgICAgPSBwYXJzZVBvc2l0aXZlSW50KG9wdGlvbnMuZGVsYXksIG51bGwpO1xuICB0aGlzLmRhc2hHYXAgICAgICA9IHBhcnNlUG9zaXRpdmVJbnQob3B0aW9ucy5kYXNoR2FwLCAxKTtcbiAgdGhpcy5mb3JjZVJlbmRlciAgPSBvcHRpb25zLmhhc093blByb3BlcnR5KCdmb3JjZVJlbmRlcicpID8gISFvcHRpb25zLmZvcmNlUmVuZGVyIDogdGhpcy5pc0lFO1xuICB0aGlzLnJldmVyc2VTdGFjayA9ICEhb3B0aW9ucy5yZXZlcnNlU3RhY2s7XG4gIHRoaXMuc2VsZkRlc3Ryb3kgID0gISFvcHRpb25zLnNlbGZEZXN0cm95O1xuICB0aGlzLm9uUmVhZHkgICAgICA9IG9wdGlvbnMub25SZWFkeTtcbiAgdGhpcy5tYXAgICAgICAgICAgPSBbXTtcbiAgdGhpcy5mcmFtZUxlbmd0aCAgPSB0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuZGVsYXlVbml0ID0gdGhpcy5zcGVlZCA9IHRoaXMuaGFuZGxlID0gbnVsbDtcblxuICB0aGlzLmlnbm9yZUludmlzaWJsZSA9IG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2lnbm9yZUludmlzaWJsZScpID8gISFvcHRpb25zLmlnbm9yZUludmlzaWJsZSA6IGZhbHNlO1xuXG4gIHRoaXMuYW5pbVRpbWluZ0Z1bmN0aW9uID0gb3B0aW9ucy5hbmltVGltaW5nRnVuY3Rpb24gfHwgVml2dXMuTElORUFSO1xuICB0aGlzLnBhdGhUaW1pbmdGdW5jdGlvbiA9IG9wdGlvbnMucGF0aFRpbWluZ0Z1bmN0aW9uIHx8IFZpdnVzLkxJTkVBUjtcblxuICBpZiAodGhpcy5kZWxheSA+PSB0aGlzLmR1cmF0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdWaXZ1cyBbY29uc3RydWN0b3JdOiBkZWxheSBtdXN0IGJlIHNob3J0ZXIgdGhhbiBkdXJhdGlvbicpO1xuICB9XG59O1xuXG4vKipcbiAqIFNldCB1cCBjYWxsYmFjayB0byB0aGUgaW5zdGFuY2VcbiAqIFRoZSBtZXRob2Qgd2lsbCBub3QgcmV0dXJuIGVueXRoaW5nLCBidXQgd2lsbCB0aHJvdyBhblxuICogZXJyb3IgaWYgdGhlIHBhcmFtZXRlciBpcyBpbnZhbGlkXG4gKlxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZvciB0aGUgYW5pbWF0aW9uIGVuZFxuICovXG5WaXZ1cy5wcm90b3R5cGUuc2V0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgLy8gQmFzaWMgY2hlY2tcbiAgaWYgKCEhY2FsbGJhY2sgJiYgY2FsbGJhY2suY29uc3RydWN0b3IgIT09IEZ1bmN0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdWaXZ1cyBbY29uc3RydWN0b3JdOiBcImNhbGxiYWNrXCIgcGFyYW1ldGVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICB9XG4gIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbn07XG5cblxuLyoqXG4gKiBDb3JlXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqL1xuXG4vKipcbiAqIE1hcCB0aGUgc3ZnLCBwYXRoIGJ5IHBhdGguXG4gKiBUaGUgbWV0aG9kIHJldHVybiBub3RoaW5nLCBpdCBqdXN0IGZpbGwgdGhlXG4gKiBgbWFwYCBhcnJheS4gRWFjaCBpdGVtIGluIHRoaXMgYXJyYXkgcmVwcmVzZW50XG4gKiBhIHBhdGggZWxlbWVudCBmcm9tIHRoZSBTVkcsIHdpdGggaW5mb3JtYXRpb25zIGZvclxuICogdGhlIGFuaW1hdGlvbi5cbiAqXG4gKiBgYGBcbiAqIFtcbiAqICAge1xuICogICAgIGVsOiA8RE9Nb2JqPiB0aGUgcGF0aCBlbGVtZW50XG4gKiAgICAgbGVuZ3RoOiA8bnVtYmVyPiBsZW5ndGggb2YgdGhlIHBhdGggbGluZVxuICogICAgIHN0YXJ0QXQ6IDxudW1iZXI+IHRpbWUgc3RhcnQgb2YgdGhlIHBhdGggYW5pbWF0aW9uIChpbiBmcmFtZXMpXG4gKiAgICAgZHVyYXRpb246IDxudW1iZXI+IHBhdGggYW5pbWF0aW9uIGR1cmF0aW9uIChpbiBmcmFtZXMpXG4gKiAgIH0sXG4gKiAgIC4uLlxuICogXVxuICogYGBgXG4gKlxuICovXG5WaXZ1cy5wcm90b3R5cGUubWFwcGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGksIHBhdGhzLCBwYXRoLCBwQXR0cnMsIHBhdGhPYmosIHRvdGFsTGVuZ3RoLCBsZW5ndGhNZXRlciwgdGltZVBvaW50O1xuICB0aW1lUG9pbnQgPSB0b3RhbExlbmd0aCA9IGxlbmd0aE1ldGVyID0gMDtcbiAgcGF0aHMgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3BhdGgnKTtcblxuICBmb3IgKGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgICBwYXRoID0gcGF0aHNbaV07XG4gICAgaWYgKHRoaXMuaXNJbnZpc2libGUocGF0aCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBwYXRoT2JqID0ge1xuICAgICAgZWw6IHBhdGgsXG4gICAgICBsZW5ndGg6IE1hdGguY2VpbChwYXRoLmdldFRvdGFsTGVuZ3RoKCkpXG4gICAgfTtcbiAgICAvLyBUZXN0IGlmIHRoZSBwYXRoIGxlbmd0aCBpcyBjb3JyZWN0XG4gICAgaWYgKGlzTmFOKHBhdGhPYmoubGVuZ3RoKSkge1xuICAgICAgaWYgKHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1ZpdnVzIFttYXBwaW5nXTogY2Fubm90IHJldHJpZXZlIGEgcGF0aCBlbGVtZW50IGxlbmd0aCcsIHBhdGgpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHRoaXMubWFwLnB1c2gocGF0aE9iaik7XG4gICAgcGF0aC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgID0gcGF0aE9iai5sZW5ndGggKyAnICcgKyAocGF0aE9iai5sZW5ndGggKyB0aGlzLmRhc2hHYXAgKiAyKTtcbiAgICBwYXRoLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBwYXRoT2JqLmxlbmd0aCArIHRoaXMuZGFzaEdhcDtcbiAgICBwYXRoT2JqLmxlbmd0aCArPSB0aGlzLmRhc2hHYXA7XG4gICAgdG90YWxMZW5ndGggKz0gcGF0aE9iai5sZW5ndGg7XG5cbiAgICB0aGlzLnJlbmRlclBhdGgoaSk7XG4gIH1cblxuICB0b3RhbExlbmd0aCA9IHRvdGFsTGVuZ3RoID09PSAwID8gMSA6IHRvdGFsTGVuZ3RoO1xuICB0aGlzLmRlbGF5ID0gdGhpcy5kZWxheSA9PT0gbnVsbCA/IHRoaXMuZHVyYXRpb24gLyAzIDogdGhpcy5kZWxheTtcbiAgdGhpcy5kZWxheVVuaXQgPSB0aGlzLmRlbGF5IC8gKHBhdGhzLmxlbmd0aCA+IDEgPyBwYXRocy5sZW5ndGggLSAxIDogMSk7XG5cbiAgLy8gUmV2ZXJzZSBzdGFjayBpZiBhc2tlZFxuICBpZiAodGhpcy5yZXZlcnNlU3RhY2spIHtcbiAgICB0aGlzLm1hcC5yZXZlcnNlKCk7XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5tYXAubGVuZ3RoOyBpKyspIHtcbiAgICBwYXRoT2JqID0gdGhpcy5tYXBbaV07XG5cbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgIGNhc2UgJ2RlbGF5ZWQnOlxuICAgICAgcGF0aE9iai5zdGFydEF0ID0gdGhpcy5kZWxheVVuaXQgKiBpO1xuICAgICAgcGF0aE9iai5kdXJhdGlvbiA9IHRoaXMuZHVyYXRpb24gLSB0aGlzLmRlbGF5O1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdvbmVCeU9uZSc6XG4gICAgICBwYXRoT2JqLnN0YXJ0QXQgPSBsZW5ndGhNZXRlciAvIHRvdGFsTGVuZ3RoICogdGhpcy5kdXJhdGlvbjtcbiAgICAgIHBhdGhPYmouZHVyYXRpb24gPSBwYXRoT2JqLmxlbmd0aCAvIHRvdGFsTGVuZ3RoICogdGhpcy5kdXJhdGlvbjtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnc3luYyc6XG4gICAgY2FzZSAnYXN5bmMnOlxuICAgIGNhc2UgJ25zeW5jJzpcbiAgICAgIHBhdGhPYmouc3RhcnRBdCA9IDA7XG4gICAgICBwYXRoT2JqLmR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnc2NlbmFyaW8tc3luYyc6XG4gICAgICBwYXRoID0gcGF0aE9iai5lbDtcbiAgICAgIHBBdHRycyA9IHRoaXMucGFyc2VBdHRyKHBhdGgpO1xuICAgICAgcGF0aE9iai5zdGFydEF0ID0gdGltZVBvaW50ICsgKHBhcnNlUG9zaXRpdmVJbnQocEF0dHJzWydkYXRhLWRlbGF5J10sIHRoaXMuZGVsYXlVbml0KSB8fCAwKTtcbiAgICAgIHBhdGhPYmouZHVyYXRpb24gPSBwYXJzZVBvc2l0aXZlSW50KHBBdHRyc1snZGF0YS1kdXJhdGlvbiddLCB0aGlzLmR1cmF0aW9uKTtcbiAgICAgIHRpbWVQb2ludCA9IHBBdHRyc1snZGF0YS1hc3luYyddICE9PSB1bmRlZmluZWQgPyBwYXRoT2JqLnN0YXJ0QXQgOiBwYXRoT2JqLnN0YXJ0QXQgKyBwYXRoT2JqLmR1cmF0aW9uO1xuICAgICAgdGhpcy5mcmFtZUxlbmd0aCA9IE1hdGgubWF4KHRoaXMuZnJhbWVMZW5ndGgsIChwYXRoT2JqLnN0YXJ0QXQgKyBwYXRoT2JqLmR1cmF0aW9uKSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3NjZW5hcmlvJzpcbiAgICAgIHBhdGggPSBwYXRoT2JqLmVsO1xuICAgICAgcEF0dHJzID0gdGhpcy5wYXJzZUF0dHIocGF0aCk7XG4gICAgICBwYXRoT2JqLnN0YXJ0QXQgPSBwYXJzZVBvc2l0aXZlSW50KHBBdHRyc1snZGF0YS1zdGFydCddLCB0aGlzLmRlbGF5VW5pdCkgfHwgMDtcbiAgICAgIHBhdGhPYmouZHVyYXRpb24gPSBwYXJzZVBvc2l0aXZlSW50KHBBdHRyc1snZGF0YS1kdXJhdGlvbiddLCB0aGlzLmR1cmF0aW9uKTtcbiAgICAgIHRoaXMuZnJhbWVMZW5ndGggPSBNYXRoLm1heCh0aGlzLmZyYW1lTGVuZ3RoLCAocGF0aE9iai5zdGFydEF0ICsgcGF0aE9iai5kdXJhdGlvbikpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxlbmd0aE1ldGVyICs9IHBhdGhPYmoubGVuZ3RoO1xuICAgIHRoaXMuZnJhbWVMZW5ndGggPSB0aGlzLmZyYW1lTGVuZ3RoIHx8IHRoaXMuZHVyYXRpb247XG4gIH1cbn07XG5cbi8qKlxuICogSW50ZXJ2YWwgbWV0aG9kIHRvIGRyYXcgdGhlIFNWRyBmcm9tIGN1cnJlbnRcbiAqIHBvc2l0aW9uIG9mIHRoZSBhbmltYXRpb24uIEl0IHVwZGF0ZSB0aGUgdmFsdWUgb2ZcbiAqIGBjdXJyZW50RnJhbWVgIGFuZCByZS10cmFjZSB0aGUgU1ZHLlxuICpcbiAqIEl0IHVzZSB0aGlzLmhhbmRsZSB0byBzdG9yZSB0aGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gKiBhbmQgY2xlYXIgaXQgb25lIHRoZSBhbmltYXRpb24gaXMgc3RvcHBlZC4gU28gdGhpc1xuICogYXR0cmlidXRlIGNhbiBiZSB1c2VkIHRvIGtub3cgaWYgdGhlIGFuaW1hdGlvbiBpc1xuICogcGxheWluZy5cbiAqXG4gKiBPbmNlIHRoZSBhbmltYXRpb24gYXQgdGhlIGVuZCwgdGhpcyBtZXRob2Qgd2lsbFxuICogdHJpZ2dlciB0aGUgVml2dXMgY2FsbGJhY2suXG4gKlxuICovXG5WaXZ1cy5wcm90b3R5cGUuZHJhd2VyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuY3VycmVudEZyYW1lICs9IHRoaXMuc3BlZWQ7XG5cbiAgaWYgKHRoaXMuY3VycmVudEZyYW1lIDw9IDApIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50RnJhbWUgPj0gdGhpcy5mcmFtZUxlbmd0aCkge1xuICAgIHRoaXMuc3RvcCgpO1xuICAgIHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5mcmFtZUxlbmd0aDtcbiAgICB0aGlzLnRyYWNlKCk7XG4gICAgaWYgKHRoaXMuc2VsZkRlc3Ryb3kpIHtcbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnRyYWNlKCk7XG4gICAgdGhpcy5oYW5kbGUgPSByZXF1ZXN0QW5pbUZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuZHJhd2VyKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5jYWxsYmFjayh0aGlzKTtcbiAgaWYgKHRoaXMuaW5zdGFuY2VDYWxsYmFjaykge1xuICAgIHRoaXMuaW5zdGFuY2VDYWxsYmFjayh0aGlzKTtcbiAgICB0aGlzLmluc3RhbmNlQ2FsbGJhY2sgPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIERyYXcgdGhlIFNWRyBhdCB0aGUgY3VycmVudCBpbnN0YW50IGZyb20gdGhlXG4gKiBgY3VycmVudEZyYW1lYCB2YWx1ZS4gSGVyZSBpcyB3aGVyZSBtb3N0IG9mIHRoZSBtYWdpYyBpcy5cbiAqIFRoZSB0cmljayBpcyB0byB1c2UgdGhlIGBzdHJva2VEYXNob2Zmc2V0YCBzdHlsZSBwcm9wZXJ0eS5cbiAqXG4gKiBGb3Igb3B0aW1pc2F0aW9uIHJlYXNvbnMsIGEgbmV3IHByb3BlcnR5IGNhbGxlZCBgcHJvZ3Jlc3NgXG4gKiBpcyBhZGRlZCBpbiBlYWNoIGl0ZW0gb2YgYG1hcGAuIFRoaXMgb25lIGNvbnRhaW4gdGhlIGN1cnJlbnRcbiAqIHByb2dyZXNzIG9mIHRoZSBwYXRoIGVsZW1lbnQuIE9ubHkgaWYgdGhlIG5ldyB2YWx1ZSBpcyBkaWZmZXJlbnRcbiAqIHRoZSBuZXcgdmFsdWUgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBET00gZWxlbWVudC4gVGhpc1xuICogbWV0aG9kIHNhdmUgYSBsb3Qgb2YgcmVzb3VyY2VzIHRvIHJlLXJlbmRlciB0aGUgU1ZHLiBBbmQgY291bGRcbiAqIGJlIGltcHJvdmVkIGlmIHRoZSBhbmltYXRpb24gY291bGRuJ3QgYmUgcGxheWVkIGZvcndhcmQuXG4gKlxuICovXG5WaXZ1cy5wcm90b3R5cGUudHJhY2UgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpLCBwcm9ncmVzcywgcGF0aCwgY3VycmVudEZyYW1lO1xuICBjdXJyZW50RnJhbWUgPSB0aGlzLmFuaW1UaW1pbmdGdW5jdGlvbih0aGlzLmN1cnJlbnRGcmFtZSAvIHRoaXMuZnJhbWVMZW5ndGgpICogdGhpcy5mcmFtZUxlbmd0aDtcbiAgZm9yIChpID0gMDsgaSA8IHRoaXMubWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgcGF0aCA9IHRoaXMubWFwW2ldO1xuICAgIHByb2dyZXNzID0gKGN1cnJlbnRGcmFtZSAtIHBhdGguc3RhcnRBdCkgLyBwYXRoLmR1cmF0aW9uO1xuICAgIHByb2dyZXNzID0gdGhpcy5wYXRoVGltaW5nRnVuY3Rpb24oTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgcHJvZ3Jlc3MpKSk7XG4gICAgaWYgKHBhdGgucHJvZ3Jlc3MgIT09IHByb2dyZXNzKSB7XG4gICAgICBwYXRoLnByb2dyZXNzID0gcHJvZ3Jlc3M7XG4gICAgICBwYXRoLmVsLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBNYXRoLmZsb29yKHBhdGgubGVuZ3RoICogKDEgLSBwcm9ncmVzcykpO1xuICAgICAgdGhpcy5yZW5kZXJQYXRoKGkpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBNZXRob2QgZm9yY2luZyB0aGUgYnJvd3NlciB0byByZS1yZW5kZXIgYSBwYXRoIGVsZW1lbnRcbiAqIGZyb20gaXQncyBpbmRleCBpbiB0aGUgbWFwLiBEZXBlbmRpbmcgb24gdGhlIGBmb3JjZVJlbmRlcmBcbiAqIHZhbHVlLlxuICogVGhlIHRyaWNrIGlzIHRvIHJlcGxhY2UgdGhlIHBhdGggZWxlbWVudCBieSBpdCdzIGNsb25lLlxuICogVGhpcyBwcmFjdGljZSBpcyBub3QgcmVjb21tZW5kZWQgYmVjYXVzZSBpdCdzIGFza2luZyBtb3JlXG4gKiByZXNzb3VyY2VzLCB0b28gbXVjaCBET00gbWFudXB1bGF0aW9uLi5cbiAqIGJ1dCBpdCdzIHRoZSBvbmx5IHdheSB0byBsZXQgdGhlIG1hZ2ljIGhhcHBlbiBvbiBJRS5cbiAqIEJ5IGRlZmF1bHQsIHRoaXMgZmFsbGJhY2sgaXMgb25seSBhcHBsaWVkIG9uIElFLlxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gaW5kZXggUGF0aCBpbmRleFxuICovXG5WaXZ1cy5wcm90b3R5cGUucmVuZGVyUGF0aCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICBpZiAodGhpcy5mb3JjZVJlbmRlciAmJiB0aGlzLm1hcCAmJiB0aGlzLm1hcFtpbmRleF0pIHtcbiAgICB2YXIgcGF0aE9iaiA9IHRoaXMubWFwW2luZGV4XSxcbiAgICAgICAgbmV3UGF0aCA9IHBhdGhPYmouZWwuY2xvbmVOb2RlKHRydWUpO1xuICAgIHBhdGhPYmouZWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3UGF0aCwgcGF0aE9iai5lbCk7XG4gICAgcGF0aE9iai5lbCA9IG5ld1BhdGg7XG4gIH1cbn07XG5cbi8qKlxuICogV2hlbiB0aGUgU1ZHIG9iamVjdCBpcyBsb2FkZWQgYW5kIHJlYWR5LFxuICogdGhpcyBtZXRob2Qgd2lsbCBjb250aW51ZSB0aGUgaW5pdGlhbGlzYXRpb24uXG4gKlxuICogVGhpcyB0aGlzIG1haW5seSBkdWUgdG8gdGhlIGNhc2Ugb2YgcGFzc2luZyBhblxuICogb2JqZWN0IHRhZyBpbiB0aGUgY29uc3RydWN0b3IuIEl0IHdpbGwgd2FpdFxuICogdGhlIGVuZCBvZiB0aGUgbG9hZGluZyB0byBpbml0aWFsaXNlLlxuICpcbiAqL1xuVml2dXMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFNldCBvYmplY3QgdmFyaWFibGVzXG4gIHRoaXMuZnJhbWVMZW5ndGggPSAwO1xuICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XG4gIHRoaXMubWFwID0gW107XG5cbiAgLy8gU3RhcnRcbiAgbmV3IFBhdGhmb3JtZXIodGhpcy5lbCk7XG4gIHRoaXMubWFwcGluZygpO1xuICB0aGlzLnN0YXJ0ZXIoKTtcblxuICBpZiAodGhpcy5vblJlYWR5KSB7XG4gICAgdGhpcy5vblJlYWR5KHRoaXMpO1xuICB9XG59O1xuXG4vKipcbiAqIFRyaWdnZXIgdG8gc3RhcnQgb2YgdGhlIGFuaW1hdGlvbi5cbiAqIERlcGVuZGluZyBvbiB0aGUgYHN0YXJ0YCB2YWx1ZSwgYSBkaWZmZXJlbnQgc2NyaXB0XG4gKiB3aWxsIGJlIGFwcGxpZWQuXG4gKlxuICogSWYgdGhlIGBzdGFydGAgdmFsdWUgaXMgbm90IHZhbGlkLCBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAqIEV2ZW4gaWYgdGVjaG5pY2FsbHksIHRoaXMgaXMgaW1wb3NzaWJsZS5cbiAqXG4gKi9cblZpdnVzLnByb3RvdHlwZS5zdGFydGVyID0gZnVuY3Rpb24gKCkge1xuICBzd2l0Y2ggKHRoaXMuc3RhcnQpIHtcbiAgY2FzZSAnbWFudWFsJzpcbiAgICByZXR1cm47XG5cbiAgY2FzZSAnYXV0b3N0YXJ0JzpcbiAgICB0aGlzLnBsYXkoKTtcbiAgICBicmVhaztcblxuICBjYXNlICdpblZpZXdwb3J0JzpcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgbGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5pc0luVmlld3BvcnQoc2VsZi5wYXJlbnRFbCwgMSkpIHtcbiAgICAgICAgc2VsZi5wbGF5KCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgbGlzdGVuZXIpO1xuICAgIGxpc3RlbmVyKCk7XG4gICAgYnJlYWs7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBDb250cm9sc1xuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKi9cblxuLyoqXG4gKiBHZXQgdGhlIGN1cnJlbnQgc3RhdHVzIG9mIHRoZSBhbmltYXRpb24gYmV0d2VlblxuICogdGhyZWUgZGlmZmVyZW50IHN0YXRlczogJ3N0YXJ0JywgJ3Byb2dyZXNzJywgJ2VuZCcuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IEluc3RhbmNlIHN0YXR1c1xuICovXG5WaXZ1cy5wcm90b3R5cGUuZ2V0U3RhdHVzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5jdXJyZW50RnJhbWUgPT09IDAgPyAnc3RhcnQnIDogdGhpcy5jdXJyZW50RnJhbWUgPT09IHRoaXMuZnJhbWVMZW5ndGggPyAnZW5kJyA6ICdwcm9ncmVzcyc7XG59O1xuXG4vKipcbiAqIFJlc2V0IHRoZSBpbnN0YW5jZSB0byB0aGUgaW5pdGlhbCBzdGF0ZSA6IHVuZHJhd1xuICogQmUgY2FyZWZ1bCwgaXQganVzdCByZXNldCB0aGUgYW5pbWF0aW9uLCBpZiB5b3UncmVcbiAqIHBsYXlpbmcgdGhlIGFuaW1hdGlvbiwgdGhpcyB3b24ndCBzdG9wIGl0LiBCdXQganVzdFxuICogbWFrZSBpdCBzdGFydCBmcm9tIHN0YXJ0LlxuICpcbiAqL1xuVml2dXMucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5zZXRGcmFtZVByb2dyZXNzKDApO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIGluc3RhbmNlIHRvIHRoZSBmaW5hbCBzdGF0ZSA6IGRyYXduXG4gKiBCZSBjYXJlZnVsLCBpdCBqdXN0IHNldCB0aGUgYW5pbWF0aW9uLCBpZiB5b3UncmVcbiAqIHBsYXlpbmcgdGhlIGFuaW1hdGlvbiBvbiByZXdpbmQsIHRoaXMgd29uJ3Qgc3RvcCBpdC5cbiAqIEJ1dCBqdXN0IG1ha2UgaXQgc3RhcnQgZnJvbSB0aGUgZW5kLlxuICpcbiAqL1xuVml2dXMucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuc2V0RnJhbWVQcm9ncmVzcygxKTtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBsZXZlbCBvZiBwcm9ncmVzcyBvZiB0aGUgZHJhd2luZy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gcHJvZ3Jlc3MgTGV2ZWwgb2YgcHJvZ3Jlc3MgdG8gc2V0XG4gKi9cblZpdnVzLnByb3RvdHlwZS5zZXRGcmFtZVByb2dyZXNzID0gZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gIHByb2dyZXNzID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgcHJvZ3Jlc3MpKTtcbiAgdGhpcy5jdXJyZW50RnJhbWUgPSBNYXRoLnJvdW5kKHRoaXMuZnJhbWVMZW5ndGggKiBwcm9ncmVzcyk7XG4gIHRoaXMudHJhY2UoKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFBsYXkgdGhlIGFuaW1hdGlvbiBhdCB0aGUgZGVzaXJlZCBzcGVlZC5cbiAqIFNwZWVkIG11c3QgYmUgYSB2YWxpZCBudW1iZXIgKG5vIHplcm8pLlxuICogQnkgZGVmYXVsdCwgdGhlIHNwZWVkIHZhbHVlIGlzIDEuXG4gKiBCdXQgYSBuZWdhdGl2ZSB2YWx1ZSBpcyBhY2NlcHRlZCB0byBnbyBmb3J3YXJkLlxuICpcbiAqIEFuZCB3b3JrcyB3aXRoIGZsb2F0IHRvby5cbiAqIEJ1dCBkb24ndCBmb3JnZXQgd2UgYXJlIGluIEphdmFTY3JpcHQsIHNlIGJlIG5pY2VcbiAqIHdpdGggaGltIGFuZCBnaXZlIGhpbSBhIDEvMl54IHZhbHVlLlxuICpcbiAqIEBwYXJhbSAge251bWJlcn0gc3BlZWQgQW5pbWF0aW9uIHNwZWVkIFtvcHRpb25hbF1cbiAqL1xuVml2dXMucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbiAoc3BlZWQsIGNhbGxiYWNrKSB7XG4gIHRoaXMuaW5zdGFuY2VDYWxsYmFjayA9IG51bGw7XG5cbiAgaWYgKHNwZWVkICYmIHR5cGVvZiBzcGVlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMuaW5zdGFuY2VDYWxsYmFjayA9IHNwZWVkOyAvLyBmaXJzdCBwYXJhbWV0ZXIgaXMgYWN0dWFsbHkgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgc3BlZWQgPSBudWxsO1xuICB9XG4gIGVsc2UgaWYgKHNwZWVkICYmIHR5cGVvZiBzcGVlZCAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZpdnVzIFtwbGF5XTogaW52YWxpZCBzcGVlZCcpO1xuICB9XG4gIC8vIGlmIHRoZSBmaXJzdCBwYXJhbWV0ZXIgd2Fzbid0IHRoZSBjYWxsYmFjaywgY2hlY2sgaWYgdGhlIHNlY29uZHMgd2FzXG4gIGlmIChjYWxsYmFjayAmJiB0eXBlb2YoY2FsbGJhY2spID09PSAnZnVuY3Rpb24nICYmICF0aGlzLmluc3RhbmNlQ2FsbGJhY2spIHtcbiAgICB0aGlzLmluc3RhbmNlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgfVxuXG5cbiAgdGhpcy5zcGVlZCA9IHNwZWVkIHx8IDE7XG4gIGlmICghdGhpcy5oYW5kbGUpIHtcbiAgICB0aGlzLmRyYXdlcigpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTdG9wIHRoZSBjdXJyZW50IGFuaW1hdGlvbiwgaWYgb24gcHJvZ3Jlc3MuXG4gKiBTaG91bGQgbm90IHRyaWdnZXIgYW55IGVycm9yLlxuICpcbiAqL1xuVml2dXMucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmhhbmRsZSkge1xuICAgIGNhbmNlbEFuaW1GcmFtZSh0aGlzLmhhbmRsZSk7XG4gICAgdGhpcy5oYW5kbGUgPSBudWxsO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBEZXN0cm95IHRoZSBpbnN0YW5jZS5cbiAqIFJlbW92ZSBhbGwgYmFkIHN0eWxpbmcgYXR0cmlidXRlcyBvbiBhbGxcbiAqIHBhdGggdGFnc1xuICpcbiAqL1xuVml2dXMucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc3RvcCgpO1xuICB2YXIgaSwgcGF0aDtcbiAgZm9yIChpID0gMDsgaSA8IHRoaXMubWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgcGF0aCA9IHRoaXMubWFwW2ldO1xuICAgIHBhdGguZWwuc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IG51bGw7XG4gICAgcGF0aC5lbC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBudWxsO1xuICAgIHRoaXMucmVuZGVyUGF0aChpKTtcbiAgfVxufTtcblxuXG4vKipcbiAqIFV0aWxzIG1ldGhvZHNcbiAqIGluY2x1ZGUgbWV0aG9kcyBmcm9tIENvZHJvcHNcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICovXG5cbi8qKlxuICogTWV0aG9kIHRvIGJlc3QgZ3Vlc3MgaWYgYSBwYXRoIHNob3VsZCBhZGRlZCBpbnRvXG4gKiB0aGUgYW5pbWF0aW9uIG9yIG5vdC5cbiAqXG4gKiAxLiBVc2UgdGhlIGBkYXRhLXZpdnVzLWlnbm9yZWAgYXR0cmlidXRlIGlmIHNldFxuICogMi4gQ2hlY2sgaWYgdGhlIGluc3RhbmNlIG11c3QgaWdub3JlIGludmlzaWJsZSBwYXRoc1xuICogMy4gQ2hlY2sgaWYgdGhlIHBhdGggaXMgdmlzaWJsZVxuICpcbiAqIEZvciBub3cgdGhlIHZpc2liaWxpdHkgY2hlY2tpbmcgaXMgdW5zdGFibGUuXG4gKiBJdCB3aWxsIGJlIHVzZWQgZm9yIGEgYmV0YSBwaGFzZS5cbiAqXG4gKiBPdGhlciBpbXByb3ZtZW50cyBhcmUgcGxhbm5lZC4gTGlrZSBkZXRlY3RpbmdcbiAqIGlzIHRoZSBwYXRoIGdvdCBhIHN0cm9rZSBvciBhIHZhbGlkIG9wYWNpdHkuXG4gKi9cblZpdnVzLnByb3RvdHlwZS5pc0ludmlzaWJsZSA9IGZ1bmN0aW9uIChlbCkge1xuICB2YXIgcmVjdCxcbiAgICBpZ25vcmVBdHRyID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWlnbm9yZScpO1xuXG4gIGlmIChpZ25vcmVBdHRyICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGlnbm9yZUF0dHIgIT09ICdmYWxzZSc7XG4gIH1cblxuICBpZiAodGhpcy5pZ25vcmVJbnZpc2libGUpIHtcbiAgICByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuICFyZWN0LndpZHRoICYmICFyZWN0LmhlaWdodDtcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbi8qKlxuICogUGFyc2UgYXR0cmlidXRlcyBvZiBhIERPTSBlbGVtZW50IHRvXG4gKiBnZXQgYW4gb2JqZWN0IG9mIHthdHRyaWJ1dGVOYW1lID0+IGF0dHJpYnV0ZVZhbHVlfVxuICpcbiAqIEBwYXJhbSAge29iamVjdH0gZWxlbWVudCBET00gZWxlbWVudCB0byBwYXJzZVxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgIE9iamVjdCBvZiBhdHRyaWJ1dGVzXG4gKi9cblZpdnVzLnByb3RvdHlwZS5wYXJzZUF0dHIgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB2YXIgYXR0ciwgb3V0cHV0ID0ge307XG4gIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuYXR0cmlidXRlcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRyID0gZWxlbWVudC5hdHRyaWJ1dGVzW2ldO1xuICAgICAgb3V0cHV0W2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBSZXBseSBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSBwYWdlIHZpZXdwb3J0XG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSBlbCBFbGVtZW50IHRvIG9ic2VydmVcbiAqIEBwYXJhbSAge251bWJlcn0gaCAgUGVyY2VudGFnZSBvZiBoZWlnaHRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cblZpdnVzLnByb3RvdHlwZS5pc0luVmlld3BvcnQgPSBmdW5jdGlvbiAoZWwsIGgpIHtcbiAgdmFyIHNjcm9sbGVkICAgPSB0aGlzLnNjcm9sbFkoKSxcbiAgICB2aWV3ZWQgICAgICAgPSBzY3JvbGxlZCArIHRoaXMuZ2V0Vmlld3BvcnRIKCksXG4gICAgZWxCQ1IgICAgICAgID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgZWxIZWlnaHQgICAgID0gZWxCQ1IuaGVpZ2h0LFxuICAgIGVsVG9wICAgICAgICA9IHNjcm9sbGVkICsgZWxCQ1IudG9wLFxuICAgIGVsQm90dG9tICAgICA9IGVsVG9wICsgZWxIZWlnaHQ7XG5cbiAgLy8gaWYgMCwgdGhlIGVsZW1lbnQgaXMgY29uc2lkZXJlZCBpbiB0aGUgdmlld3BvcnQgYXMgc29vbiBhcyBpdCBlbnRlcnMuXG4gIC8vIGlmIDEsIHRoZSBlbGVtZW50IGlzIGNvbnNpZGVyZWQgaW4gdGhlIHZpZXdwb3J0IG9ubHkgd2hlbiBpdCdzIGZ1bGx5IGluc2lkZVxuICAvLyB2YWx1ZSBpbiBwZXJjZW50YWdlICgxID49IGggPj0gMClcbiAgaCA9IGggfHwgMDtcblxuICByZXR1cm4gKGVsVG9wICsgZWxIZWlnaHQgKiBoKSA8PSB2aWV3ZWQgJiYgKGVsQm90dG9tKSA+PSBzY3JvbGxlZDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIGRvY3VtZW50IGVsZW1lbnRcbiAqXG4gKiBAdHlwZSB7RE9NZWxlbWVudH1cbiAqL1xuVml2dXMucHJvdG90eXBlLmRvY0VsZW0gPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4vKipcbiAqIEdldCB0aGUgdmlld3BvcnQgaGVpZ2h0IGluIHBpeGVsc1xuICpcbiAqIEByZXR1cm4ge2ludGVnZXJ9IFZpZXdwb3J0IGhlaWdodFxuICovXG5WaXZ1cy5wcm90b3R5cGUuZ2V0Vmlld3BvcnRIID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY2xpZW50ID0gdGhpcy5kb2NFbGVtLmNsaWVudEhlaWdodCxcbiAgICBpbm5lciA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICBpZiAoY2xpZW50IDwgaW5uZXIpIHtcbiAgICByZXR1cm4gaW5uZXI7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIGNsaWVudDtcbiAgfVxufTtcblxuLyoqXG4gKiBHZXQgdGhlIHBhZ2UgWSBvZmZzZXRcbiAqXG4gKiBAcmV0dXJuIHtpbnRlZ2VyfSBQYWdlIFkgb2Zmc2V0XG4gKi9cblZpdnVzLnByb3RvdHlwZS5zY3JvbGxZID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IHRoaXMuZG9jRWxlbS5zY3JvbGxUb3A7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBvclxuICogYHNldFRpbWVvdXRgIGZ1bmN0aW9uIGZvciBkZXByZWNhdGVkIGJyb3dzZXJzLlxuICpcbiAqL1xucmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAoXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgICB8fFxuICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XG4gICAgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICB8fFxuICAgIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgfHxcbiAgICBmdW5jdGlvbigvKiBmdW5jdGlvbiAqLyBjYWxsYmFjayl7XG4gICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG4gICAgfVxuICApO1xufSkoKTtcblxuLyoqXG4gKiBBbGlhcyBmb3IgYGNhbmNlbEFuaW1hdGlvbkZyYW1lYCBvclxuICogYGNhbmNlbFRpbWVvdXRgIGZ1bmN0aW9uIGZvciBkZXByZWNhdGVkIGJyb3dzZXJzLlxuICpcbiAqL1xuY2FuY2VsQW5pbUZyYW1lID0gKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIChcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgICAgICAgfHxcbiAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUgICAgfHxcbiAgICB3aW5kb3cub0NhbmNlbEFuaW1hdGlvbkZyYW1lICAgICAgfHxcbiAgICB3aW5kb3cubXNDYW5jZWxBbmltYXRpb25GcmFtZSAgICAgfHxcbiAgICBmdW5jdGlvbihpZCl7XG4gICAgICByZXR1cm4gd2luZG93LmNsZWFyVGltZW91dChpZCk7XG4gICAgfVxuICApO1xufSkoKTtcblxuLyoqXG4gKiBQYXJzZSBzdHJpbmcgdG8gaW50ZWdlci5cbiAqIElmIHRoZSBudW1iZXIgaXMgbm90IHBvc2l0aXZlIG9yIG51bGxcbiAqIHRoZSBtZXRob2Qgd2lsbCByZXR1cm4gdGhlIGRlZmF1bHQgdmFsdWVcbiAqIG9yIDAgaWYgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFN0cmluZyB0byBwYXJzZVxuICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgVmFsdWUgdG8gcmV0dXJuIGlmIHRoZSByZXN1bHQgcGFyc2VkIGlzIGludmFsaWRcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqXG4gKi9cbnBhcnNlUG9zaXRpdmVJbnQgPSBmdW5jdGlvbiAodmFsdWUsIGRlZmF1bHRWYWx1ZSkge1xuICB2YXIgb3V0cHV0ID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgcmV0dXJuIChvdXRwdXQgPj0gMCkgPyBvdXRwdXQgOiBkZWZhdWx0VmFsdWU7XG59O1xuXG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFZpdnVzO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgIC8vIGxpa2UgTm9kZS5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZpdnVzO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIHdpbmRvdy5WaXZ1cyA9IFZpdnVzO1xuICB9XG5cbn0od2luZG93LCBkb2N1bWVudCkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3ZpdnVzL2Rpc3Qvdml2dXMuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcGFnZSBsb2FkIGludHJvXG52YXIgVml2dXMgPSByZXF1aXJlKCcuLi9ub2RlX21vZHVsZXMvdml2dXMnKTtcbnJlcXVpcmUoJy4vZ2xvYmFsLnNjc3MnKTtcbnJlcXVpcmUoJy4vaGVhZGVyLnNjc3MnKTtcbnJlcXVpcmUoJy4vZm9vdGVyLnNjc3MnKTtcblxudmFyIGxvZ29FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdmctbG9nb1wiKTtcblxubmV3IFZpdnVzKCdzdmctbG9nbycsIHtkdXJhdGlvbjogMjAwLCBhbmltVGltaW5nRnVuY3Rpb246IFZpdnVzLkVBU0V9LCBzZXR1cE5hdik7XG5cbmZ1bmN0aW9uIHNldHVwTmF2KCkge1xuICAgIC8vc3ZncyBoYXZlIHN0aWNreSBlbGVtZW50IGhhbmRsaW5nIGluIGpzOihcbiAgICBsb2dvRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInN2Zy1sb2dvIHNtYWxsXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcImxvYWRlZFwiKTtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvaW5kZXguanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXBwL2Zvb3Rlci5zY3NzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=