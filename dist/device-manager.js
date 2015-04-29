/** 
* device-manager - v1.0.6.
* https://github.com/mkay581/device-manager.git
* Copyright 2015 Mark Kennedy. Licensed MIT.
*/

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
/**
 A class to add a simple EventTarget (https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) API
 around any object or function, so that it can begin to receive and trigger event listeners.
 @class EventHandler
 */

var EventHandler = {

    /**
     * Registers a target to begin receiving and triggering events.
     * @param {Object|Function} target - The target
     */
    createTarget: function (target) {
        this._targets = this._targets || [];

        var targetMap = this._getTargetMap(target);
        if (!targetMap.target) {
            target.addEventListener = this._getEventMethod(target, '_addEvent').bind(this);
            target.removeEventListener = this._getEventMethod(target, '_removeEvent').bind(this);
            target.dispatchEvent = this._getEventMethod(target, '_dispatchEvent').bind(this);
            targetMap.target = target;
            this._targets.push(targetMap);
        }
    },

    /**
     * Looks through all targets and finds the one that has a target object that matches the passed in instance
     * @param target
     * @returns {Object}
     * @private
     */
    _getTargetMap: function (target) {
        return this._targets.filter(function (map) {
                return map.target === target;
            })[0] || {};
    },

    /**
     * Registers a callback to be fired when the url changes.
     * @private
     * @param {Object|Function} target
     * @param {String} eventName
     * @param {Function} listener
     * @param {boolean} useCapture
     * @param {Object} [context]
     */
    _addEvent: function (target, eventName, listener, useCapture, context) {

        if (typeof useCapture !== 'boolean') {
            context = useCapture;
            useCapture = null;
        }

        // replicating native JS default useCapture option
        useCapture = useCapture || false;

        var existingListeners = this.getNested(this._getTargetMap(target), eventName);
        if (!existingListeners) {
            existingListeners = this.setNested(this._getTargetMap(target), eventName, []);
        }

        var listenerObj = {
            listener: listener,
            context: context,
            useCapture: useCapture
        };
        // dont add event listener if target already has it
        if (existingListeners.indexOf(listenerObj) === -1) {
            existingListeners.push(listenerObj);
        }
    },

    /**
     * Returns our internal method for a target.
     * @private
     * @param target
     * @param method
     * @returns {*|function(this:EventHandler)}
     */
    _getEventMethod: function (target, method) {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(target);
            this[method].apply(this, args);
        }.bind(this);
    },

    /**
     * Removes an event listener from the target.
     * @private
     * @param target
     * @param eventName
     * @param listener
     */
    _removeEvent: function (target, eventName, listener) {
        var existingListeners = this.getNested(this._getTargetMap(target), eventName, []);
        existingListeners.forEach(function (listenerObj, idx) {
            if (listenerObj.listener === listener) {
                existingListeners.splice(idx, 1);
            }
        });
    },

    /**
     * Triggers all event listeners on a target.
     * @private
     * @param {Object|Function} target - The target
     * @param {String} eventName - The event name
     * @param {Object} customData - Custom data that will be sent to the url
     */
    _dispatchEvent: function (target, eventName, customData) {
        var targetObj = this._getTargetMap(target) || {},
            e;
        if (targetObj[eventName]) {
            targetObj[eventName].forEach(function (listenerObj) {
                e = this._createEvent(eventName, customData);
                listenerObj.listener.call(listenerObj.context || target, e);
            }.bind(this));
        }
    },

    /**
     * Creates an event.
     * @param {string} eventName - The event name
     * @param {Object} customData - Custom data that will be sent to the url
     * @private
     */
    _createEvent: function (eventName, customData) {
        // For IE 9+ compatibility, we must use document.createEvent() for our CustomEvent.
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(eventName, false, false, customData);
        return evt;
    },

    /**
     * Merges the contents of two or more objects.
     * @param {object} obj - The target object
     * @param {...object} - Additional objects who's properties will be merged in
     */
    extend: function (target) {
        var merged = target,
            source, i;
        for (i = 1; i < arguments.length; i++) {
            source = arguments[i];
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    merged[prop] = source[prop];
                }
            }
        }
        return merged;
    },

    /**
     * Gets a deeply nested property of an object.
     * @param {object} obj - The object to evaluate
     * @param {string} map - A string denoting where the property that should be extracted exists
     * @param {object} [fallback] - The fallback if the property does not exist
     */
    getNested: function (obj, map, fallback) {
        var mapFragments = map.split('.'),
            val = obj;
        for (var i = 0; i < mapFragments.length; i++) {
            if (val[mapFragments[i]]) {
                val = val[mapFragments[i]];
            } else {
                val = fallback;
                break;
            }
        }
        return val;
    },

    /**
     * Sets a nested property on an object, creating empty objects as needed to avoid undefined errors.
     * @param {object} obj - The initial object
     * @param {string} map - A string denoting where the property that should be set exists
     * @param {*} value - New value to set
     * @example this.setNested(obj, 'path.to.value.to.set', 'newValue');
     */
    setNested: function (obj, map, value) {
        var mapFragments = map.split('.'),
            val = obj;
        for (var i = 0; i < mapFragments.length; i++) {
            var isLast = i === (mapFragments.length - 1);
            if (!isLast) {
                val[mapFragments[i]] = val[mapFragments[i]] || {};
                val = val[mapFragments[i]];
            } else {
                val[mapFragments[i]] = value;
            }
        }
        return value;
    },

    /**
     * Removes target from being tracked therefore eliminating all listeners.
     * @param target
     */
    destroyTarget: function (target) {
        var map = this._getTargetMap(target),
            index = this._targets.indexOf(map);
        if (index > -1) {
            this._targets.splice(index, 1);
        }
    }
};

module.exports = EventHandler;
},{}],2:[function(require,module,exports){
'use strict';

var EventHandler = require('./../external/event-handler/src/event-handler');
/**
 @class DeviceManager
 @description A set of utilities for managing the state of the user's current device.
 */
var DeviceManager = function () {
    this.initialize();
};

DeviceManager.prototype = {

    /**
     * Upon initialization.
     * @memberOf DeviceManager
     */
    initialize: function () {
        // allow event listening on the device
        EventHandler.createTarget(this);

        this._getOrientationChangeListener = function () {
            var self = this;
            return function () {
                self._onOrientationChange.bind(self);
            }
        };

        window.addEventListener('orientationchange', this._getOrientationChangeListener());
    },

    /**
     * When the user changes the orientation of their device.
     * @private
     */
    _onOrientationChange: function () {
        var orientation;

        if (window.innerHeight <= window.innerWidth) {
            orientation = 'landscape';
        } else {
            orientation = 'portrait';
        }
        this.dispatchEvent('orientationchange', {orientation: orientation});
    },

    /**
     * Gets the user agent string of the current session.
     * @returns {string}
     */
    getUserAgent: function () {
        return window.navigator.userAgent;
    },

    /**
     * Checks if the user is on a specific browser.
     * @param {string|Array} name - The browser OS names to check
     * @returns {boolean}
     */
    isBrowser: function (name) {
        var pattern = name;
        if (Array.isArray(name)) {
            pattern = name.join('|');
        }
        var reg = new RegExp(pattern, 'i');
        return reg.test(this.getUserAgent());
    },

    /**
     * Checks if the user is on a mobile device.
     * @returns {boolean}
     */
    isMobile: function () {
        return this.isBrowser(['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'IEMobile', 'Opera Mini']);
    },

    /**
     * Checks if the OS is of a certain type.
     * @param {string|Array} name - The name of the OS
     * @returns {boolean}
     */
    isOS: function (name) {
        var pattern = name;
        if (Array.isArray(name)) {
            pattern = name.join('|');
        }
        var reg = new RegExp(pattern, 'i');
        return reg.test(this.getUserAgent());
    },

    /**
     * Removes events and cleans up.
     */
    destroy: function () {
        window.removeEventListener('orientationchange', this._getOrientationChangeListener());
        EventHandler.destroyTarget(this);
    }

};

module.exports = new DeviceManager();
},{"./../external/event-handler/src/event-handler":1}]},{},[2]);
