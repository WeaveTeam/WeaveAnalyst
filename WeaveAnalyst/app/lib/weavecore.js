/*
 * Event
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * A collection of Classes that are shared across all the CreateJS libraries.  The classes are included in the minified
 * files of each library and are available on the createsjs namespace directly.
 *
 * <h4>Example</h4>
 *
 *      myObject.addEventListener("change", createjs.proxy(myMethod, scope));
 *
 * @module CreateJS
 * @main CreateJS
 */

// namespace:
if (typeof window === 'undefined') {
    this.createjs = this.createjs || {};
} else {
    window.createjs = window.createjs || {};
}

(function () {
    "use strict";

    // constructor:
    /**
     * Contains properties and methods shared by all events for use with
     * {{#crossLink "EventDispatcher"}}{{/crossLink}}.
     *
     * Note that Event objects are often reused, so you should never
     * rely on an event object's state outside of the call stack it was received in.
     * @class Event
     * @param {String} type The event type.
     * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
     * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
     * @constructor
     **/
    function Event(type, bubbles, cancelable) {


        // public properties:
        /**
         * The type of event.
         * @property type
         * @type String
         **/
        this.type = type;

        /**
         * The object that generated an event.
         * @property target
         * @type Object
         * @default null
         * @readonly
         */
        this.target = null;

        /**
         * The current target that a bubbling event is being dispatched from. For non-bubbling events, this will
         * always be the same as target. For example, if childObj.parent = parentObj, and a bubbling event
         * is generated from childObj, then a listener on parentObj would receive the event with
         * target=childObj (the original target) and currentTarget=parentObj (where the listener was added).
         * @property currentTarget
         * @type Object
         * @default null
         * @readonly
         */
        this.currentTarget = null;

        /**
         * For bubbling events, this indicates the current event phase:<OL>
         * 	<LI> capture phase: starting from the top parent to the target</LI>
         * 	<LI> at target phase: currently being dispatched from the target</LI>
         * 	<LI> bubbling phase: from the target to the top parent</LI>
         * </OL>
         * @property eventPhase
         * @type Number
         * @default 0
         * @readonly
         */
        this.eventPhase = 0;

        /**
         * Indicates whether the event will bubble through the display list.
         * @property bubbles
         * @type Boolean
         * @default false
         * @readonly
         */
        this.bubbles = !!bubbles;

        /**
         * Indicates whether the default behaviour of this event can be cancelled via
         * {{#crossLink "Event/preventDefault"}}{{/crossLink}}. This is set via the Event constructor.
         * @property cancelable
         * @type Boolean
         * @default false
         * @readonly
         */
        this.cancelable = !!cancelable;

        /**
         * The epoch time at which this event was created.
         * @property timeStamp
         * @type Number
         * @default 0
         * @readonly
         */
        this.timeStamp = (new Date()).getTime();

        /**
         * Indicates if {{#crossLink "Event/preventDefault"}}{{/crossLink}} has been called
         * on this event.
         * @property defaultPrevented
         * @type Boolean
         * @default false
         * @readonly
         */
        this.defaultPrevented = false;

        /**
         * Indicates if {{#crossLink "Event/stopPropagation"}}{{/crossLink}} or
         * {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called on this event.
         * @property propagationStopped
         * @type Boolean
         * @default false
         * @readonly
         */
        this.propagationStopped = false;

        /**
         * Indicates if {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called
         * on this event.
         * @property immediatePropagationStopped
         * @type Boolean
         * @default false
         * @readonly
         */
        this.immediatePropagationStopped = false;

        /**
         * Indicates if {{#crossLink "Event/remove"}}{{/crossLink}} has been called on this event.
         * @property removed
         * @type Boolean
         * @default false
         * @readonly
         */
        this.removed = false;
    }
    var p = Event.prototype;

    /**
     * <strong>REMOVED</strong>. Removed in favor of using `MySuperClass_constructor`.
     * See {{#crossLink "Utility Methods/extend"}}{{/crossLink}} and {{#crossLink "Utility Methods/promote"}}{{/crossLink}}
     * for details.
     *
     * There is an inheritance tutorial distributed with EaselJS in /tutorials/Inheritance.
     *
     * @method initialize
     * @protected
     * @deprecated
     */
    // p.initialize = function() {}; // searchable for devs wondering where it is.

    // public methods:
    /**
     * Sets {{#crossLink "Event/defaultPrevented"}}{{/crossLink}} to true.
     * Mirrors the DOM event standard.
     * @method preventDefault
     **/
    p.preventDefault = function () {
        this.defaultPrevented = this.cancelable && true;
    };

    /**
     * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} to true.
     * Mirrors the DOM event standard.
     * @method stopPropagation
     **/
    p.stopPropagation = function () {
        this.propagationStopped = true;
    };

    /**
     * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} and
     * {{#crossLink "Event/immediatePropagationStopped"}}{{/crossLink}} to true.
     * Mirrors the DOM event standard.
     * @method stopImmediatePropagation
     **/
    p.stopImmediatePropagation = function () {
        this.immediatePropagationStopped = this.propagationStopped = true;
    };

    /**
     * Causes the active listener to be removed via removeEventListener();
     *
     * 		myBtn.addEventListener("click", function(evt) {
     * 			// do stuff...
     * 			evt.remove(); // removes this listener.
     * 		});
     *
     * @method remove
     **/
    p.remove = function () {
        this.removed = true;
    };

    /**
     * Returns a clone of the Event instance.
     * @method clone
     * @return {Event} a clone of the Event instance.
     **/
    p.clone = function () {
        return new Event(this.type, this.bubbles, this.cancelable);
    };

    /**
     * Provides a chainable shortcut method for setting a number of properties on the instance.
     *
     * @method set
     * @param {Object} props A generic object containing properties to copy to the instance.
     * @return {Event} Returns the instance the method is called on (useful for chaining calls.)
     * @chainable
     */
    p.set = function (props) {
        for (var n in props) {
            this[n] = props[n];
        }
        return this;
    };

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    p.toString = function () {
        return "[Event (type=" + this.type + ")]";
    };

    createjs.Event = Event;
}());

/*
 * EventDispatcher
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @module CreateJS
 */

// namespace:
if (typeof window === 'undefined') {
    this.createjs = this.createjs || {};
} else {
    window.createjs = window.createjs || {};
}

(function () {
    "use strict";


    // constructor:
    /**
     * EventDispatcher provides methods for managing queues of event listeners and dispatching events.
     *
     * You can either extend EventDispatcher or mix its methods into an existing prototype or instance by using the
     * EventDispatcher {{#crossLink "EventDispatcher/initialize"}}{{/crossLink}} method.
     *
     * Together with the CreateJS Event class, EventDispatcher provides an extended event model that is based on the
     * DOM Level 2 event model, including addEventListener, removeEventListener, and dispatchEvent. It supports
     * bubbling / capture, preventDefault, stopPropagation, stopImmediatePropagation, and handleEvent.
     *
     * EventDispatcher also exposes a {{#crossLink "EventDispatcher/on"}}{{/crossLink}} method, which makes it easier
     * to create scoped listeners, listeners that only run once, and listeners with associated arbitrary data. The
     * {{#crossLink "EventDispatcher/off"}}{{/crossLink}} method is merely an alias to
     * {{#crossLink "EventDispatcher/removeEventListener"}}{{/crossLink}}.
     *
     * Another addition to the DOM Level 2 model is the {{#crossLink "EventDispatcher/removeAllEventListeners"}}{{/crossLink}}
     * method, which can be used to listeners for all events, or listeners for a specific event. The Event object also
     * includes a {{#crossLink "Event/remove"}}{{/crossLink}} method which removes the active listener.
     *
     * <h4>Example</h4>
     * Add EventDispatcher capabilities to the "MyClass" class.
     *
     *      EventDispatcher.initialize(MyClass.prototype);
     *
     * Add an event (see {{#crossLink "EventDispatcher/addEventListener"}}{{/crossLink}}).
     *
     *      instance.addEventListener("eventName", handlerMethod);
     *      function handlerMethod(event) {
     *          console.log(event.target + " Was Clicked");
     *      }
     *
     * <b>Maintaining proper scope</b><br />
     * Scope (ie. "this") can be be a challenge with events. Using the {{#crossLink "EventDispatcher/on"}}{{/crossLink}}
     * method to subscribe to events simplifies this.
     *
     *      instance.addEventListener("click", function(event) {
     *          console.log(instance == this); // false, scope is ambiguous.
     *      });
     *
     *      instance.on("click", function(event) {
     *          console.log(instance == this); // true, "on" uses dispatcher scope by default.
     *      });
     *
     * If you want to use addEventListener instead, you may want to use function.bind() or a similar proxy to manage scope.
     *
     *
     * @class EventDispatcher
     * @constructor
     **/
    function EventDispatcher() {


        // private properties:
        /**
         * @protected
         * @property _listeners
         * @type Object
         **/
        this._listeners = null;

        /**
         * @protected
         * @property _captureListeners
         * @type Object
         **/
        this._captureListeners = null;
    }
    var p = EventDispatcher.prototype;

    /**
     * <strong>REMOVED</strong>. Removed in favor of using `MySuperClass_constructor`.
     * See {{#crossLink "Utility Methods/extend"}}{{/crossLink}} and {{#crossLink "Utility Methods/promote"}}{{/crossLink}}
     * for details.
     *
     * There is an inheritance tutorial distributed with EaselJS in /tutorials/Inheritance.
     *
     * @method initialize
     * @protected
     * @deprecated
     */
    // p.initialize = function() {}; // searchable for devs wondering where it is.


    // static public methods:
    /**
     * Static initializer to mix EventDispatcher methods into a target object or prototype.
     *
     * 		EventDispatcher.initialize(MyClass.prototype); // add to the prototype of the class
     * 		EventDispatcher.initialize(myObject); // add to a specific instance
     *
     * @method initialize
     * @static
     * @param {Object} target The target object to inject EventDispatcher methods into. This can be an instance or a
     * prototype.
     **/
    EventDispatcher.initialize = function (target) {
        target.addEventListener = p.addEventListener;
        target.on = p.on;
        target.removeEventListener = target.off = p.removeEventListener;
        target.removeAllEventListeners = p.removeAllEventListeners;
        target.hasEventListener = p.hasEventListener;
        target.dispatchEvent = p.dispatchEvent;
        target._dispatchEvent = p._dispatchEvent;
        target.willTrigger = p.willTrigger;
    };


    // public methods:
    /**
     * Adds the specified event listener. Note that adding multiple listeners to the same function will result in
     * multiple callbacks getting fired.
     *
     * <h4>Example</h4>
     *
     *      displayObject.addEventListener("click", handleClick);
     *      function handleClick(event) {
     *         // Click happened.
     *      }
     *
     * @method addEventListener
     * @param {String} type The string type of the event.
     * @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when
     * the event is dispatched.
     * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
     * @return {Function | Object} Returns the listener for chaining or assignment.
     **/
    p.addEventListener = function (type, listener, useCapture) {
        var listeners;
        if (useCapture) {
            listeners = this._captureListeners = this._captureListeners || {};
        } else {
            listeners = this._listeners = this._listeners || {};
        }
        var arr = listeners[type];
        if (arr) {
            this.removeEventListener(type, listener, useCapture);
        }
        arr = listeners[type]; // remove may have deleted the array
        if (!arr) {
            listeners[type] = [listener];
        } else {
            arr.push(listener);
        }
        return listener;
    };

    /**
     * A shortcut method for using addEventListener that makes it easier to specify an execution scope, have a listener
     * only run once, associate arbitrary data with the listener, and remove the listener.
     *
     * This method works by creating an anonymous wrapper function and subscribing it with addEventListener.
     * The created anonymous function is returned for use with .removeEventListener (or .off).
     *
     * <h4>Example</h4>
     *
     * 		var listener = myBtn.on("click", handleClick, null, false, {count:3});
     * 		function handleClick(evt, data) {
     * 			data.count -= 1;
     * 			console.log(this == myBtn); // true - scope defaults to the dispatcher
     * 			if (data.count == 0) {
     * 				alert("clicked 3 times!");
     * 				myBtn.off("click", listener);
     * 				// alternately: evt.remove();
     * 			}
     * 		}
     *
     * @method on
     * @param {String} type The string type of the event.
     * @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when
     * the event is dispatched.
     * @param {Object} [scope] The scope to execute the listener in. Defaults to the dispatcher/currentTarget for function listeners, and to the listener itself for object listeners (ie. using handleEvent).
     * @param {Boolean} [once=false] If true, the listener will remove itself after the first time it is triggered.
     * @param {*} [data] Arbitrary data that will be included as the second parameter when the listener is called.
     * @param {Boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
     * @return {Function} Returns the anonymous function that was created and assigned as the listener. This is needed to remove the listener later using .removeEventListener.
     **/
    p.on = function (type, listener, scope, once, data, useCapture) {
        if (listener.handleEvent) {
            scope = scope || listener;
            listener = listener.handleEvent;
        }
        scope = scope || this;
        return this.addEventListener(type, function (evt) {
            listener.call(scope, evt, data);
            once && evt.remove();
        }, useCapture);
    };

    /**
     * Removes the specified event listener.
     *
     * <b>Important Note:</b> that you must pass the exact function reference used when the event was added. If a proxy
     * function, or function closure is used as the callback, the proxy/closure reference must be used - a new proxy or
     * closure will not work.
     *
     * <h4>Example</h4>
     *
     *      displayObject.removeEventListener("click", handleClick);
     *
     * @method removeEventListener
     * @param {String} type The string type of the event.
     * @param {Function | Object} listener The listener function or object.
     * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
     **/
    p.removeEventListener = function (type, listener, useCapture) {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        if (!listeners) {
            return;
        }
        var arr = listeners[type];
        if (!arr) {
            return;
        }
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] == listener) {
                if (l == 1) {
                    delete(listeners[type]);
                } // allows for faster checks.
                else {
                    arr.splice(i, 1);
                }
                break;
            }
        }
    };

    /**
     * A shortcut to the removeEventListener method, with the same parameters and return value. This is a companion to the
     * .on method.
     *
     * @method off
     * @param {String} type The string type of the event.
     * @param {Function | Object} listener The listener function or object.
     * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
     **/
    p.off = p.removeEventListener;

    /**
     * Removes all listeners for the specified type, or all listeners of all types.
     *
     * <h4>Example</h4>
     *
     *      // Remove all listeners
     *      displayObject.removeAllEventListeners();
     *
     *      // Remove all click listeners
     *      displayObject.removeAllEventListeners("click");
     *
     * @method removeAllEventListeners
     * @param {String} [type] The string type of the event. If omitted, all listeners for all types will be removed.
     **/
    p.removeAllEventListeners = function (type) {
        if (!type) {
            this._listeners = this._captureListeners = null;
        } else {
            if (this._listeners) {
                delete(this._listeners[type]);
            }
            if (this._captureListeners) {
                delete(this._captureListeners[type]);
            }
        }
    };

    /**
     * Dispatches the specified event to all listeners.
     *
     * <h4>Example</h4>
     *
     *      // Use a string event
     *      this.dispatchEvent("complete");
     *
     *      // Use an Event instance
     *      var event = new createjs.Event("progress");
     *      this.dispatchEvent(event);
     *
     * @method dispatchEvent
     * @param {Object | String | Event} eventObj An object with a "type" property, or a string type.
     * While a generic object will work, it is recommended to use a CreateJS Event instance. If a string is used,
     * dispatchEvent will construct an Event instance with the specified type.
     * @return {Boolean} Returns the value of eventObj.defaultPrevented.
     **/
    p.dispatchEvent = function (eventObj) {
        if (typeof eventObj == "string") {
            // won't bubble, so skip everything if there's no listeners:
            var listeners = this._listeners;
            if (!listeners || !listeners[eventObj]) {
                return false;
            }
            eventObj = new createjs.Event(eventObj);
        } else if (eventObj.target && eventObj.clone) {
            // redispatching an active event object, so clone it:
            eventObj = eventObj.clone();
        }
        try {
            eventObj.target = this;
        } catch (e) {} // try/catch allows redispatching of native events

        if (!eventObj.bubbles || !this.parent) {
            this._dispatchEvent(eventObj, 2);
        } else {
            var top = this,
                list = [top];
            while (top.parent) {
                list.push(top = top.parent);
            }
            var i, l = list.length;

            // capture & atTarget
            for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
                list[i]._dispatchEvent(eventObj, 1 + (i == 0));
            }
            // bubbling
            for (i = 1; i < l && !eventObj.propagationStopped; i++) {
                list[i]._dispatchEvent(eventObj, 3);
            }
        }
        return eventObj.defaultPrevented;
    };

    /**
     * Indicates whether there is at least one listener for the specified event type.
     * @method hasEventListener
     * @param {String} type The string type of the event.
     * @return {Boolean} Returns true if there is at least one listener for the specified event.
     **/
    p.hasEventListener = function (type) {
        var listeners = this._listeners,
            captureListeners = this._captureListeners;
        return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
    };

    /**
     * Indicates whether there is at least one listener for the specified event type on this object or any of its
     * ancestors (parent, parent's parent, etc). A return value of true indicates that if a bubbling event of the
     * specified type is dispatched from this object, it will trigger at least one listener.
     *
     * This is similar to {{#crossLink "EventDispatcher/hasEventListener"}}{{/crossLink}}, but it searches the entire
     * event flow for a listener, not just this object.
     * @method willTrigger
     * @param {String} type The string type of the event.
     * @return {Boolean} Returns `true` if there is at least one listener for the specified event.
     **/
    p.willTrigger = function (type) {
        var o = this;
        while (o) {
            if (o.hasEventListener(type)) {
                return true;
            }
            o = o.parent;
        }
        return false;
    };

    /**
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    p.toString = function () {
        return "[EventDispatcher]";
    };


    // private methods:
    /**
     * @method _dispatchEvent
     * @param {Object | String | Event} eventObj
     * @param {Object} eventPhase
     * @protected
     **/
    p._dispatchEvent = function (eventObj, eventPhase) {
        var l, listeners = (eventPhase == 1) ? this._captureListeners : this._listeners;
        if (eventObj && listeners) {
            var arr = listeners[eventObj.type];
            if (!arr || !(l = arr.length)) {
                return;
            }
            try {
                eventObj.currentTarget = this;
            } catch (e) {}
            try {
                eventObj.eventPhase = eventPhase;
            } catch (e) {}
            eventObj.removed = false;

            arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
            for (var i = 0; i < l && !eventObj.immediatePropagationStopped; i++) {
                var o = arr[i];
                if (o.handleEvent) {
                    o.handleEvent(eventObj);
                } else {
                    o(eventObj);
                }
                if (eventObj.removed) {
                    this.off(eventObj.type, o, eventPhase == 1);
                    eventObj.removed = false;
                }
            }
        }
    };


    createjs.EventDispatcher = EventDispatcher;
}());

/*
 * Ticker
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @module CreateJS
 */

// namespace:
if (typeof window === 'undefined') {
    this.createjs = this.createjs || {};
} else {
    window.createjs = window.createjs || {};
}

(function () {
    "use strict";


    // constructor:
    /**
     * The Ticker provides a centralized tick or heartbeat broadcast at a set interval. Listeners can subscribe to the tick
     * event to be notified when a set time interval has elapsed.
     *
     * Note that the interval that the tick event is called is a target interval, and may be broadcast at a slower interval
     * when under high CPU load. The Ticker class uses a static interface (ex. `Ticker.framerate = 30;`) and
     * can not be instantiated.
     *
     * <h4>Example</h4>
     *
     *      createjs.Ticker.addEventListener("tick", handleTick);
     *      function handleTick(event) {
     *          // Actions carried out each tick (aka frame)
     *          if (!event.paused) {
     *              // Actions carried out when the Ticker is not paused.
     *          }
     *      }
     *
     * @class Ticker
     * @uses EventDispatcher
     * @static
     **/
    function Ticker() {
        throw "Ticker cannot be instantiated.";
    }


    // constants:
    /**
     * In this mode, Ticker uses the requestAnimationFrame API, but attempts to synch the ticks to target framerate. It
     * uses a simple heuristic that compares the time of the RAF return to the target time for the current frame and
     * dispatches the tick when the time is within a certain threshold.
     *
     * This mode has a higher variance for time between frames than TIMEOUT, but does not require that content be time
     * based as with RAF while gaining the benefits of that API (screen synch, background throttling).
     *
     * Variance is usually lowest for framerates that are a divisor of the RAF frequency. This is usually 60, so
     * framerates of 10, 12, 15, 20, and 30 work well.
     *
     * Falls back on TIMEOUT if the requestAnimationFrame API is not supported.
     * @property RAF_SYNCHED
     * @static
     * @type {String}
     * @default "synched"
     * @readonly
     **/
    Ticker.RAF_SYNCHED = "synched";

    /**
     * In this mode, Ticker passes through the requestAnimationFrame heartbeat, ignoring the target framerate completely.
     * Because requestAnimationFrame frequency is not deterministic, any content using this mode should be time based.
     * You can leverage {{#crossLink "Ticker/getTime"}}{{/crossLink}} and the tick event object's "delta" properties
     * to make this easier.
     *
     * Falls back on TIMEOUT if the requestAnimationFrame API is not supported.
     * @property RAF
     * @static
     * @type {String}
     * @default "raf"
     * @readonly
     **/
    Ticker.RAF = "raf";

    /**
     * In this mode, Ticker uses the setTimeout API. This provides predictable, adaptive frame timing, but does not
     * provide the benefits of requestAnimationFrame (screen synch, background throttling).
     * @property TIMEOUT
     * @static
     * @type {String}
     * @default "timer"
     * @readonly
     **/
    Ticker.TIMEOUT = "timeout";


    // static events:
    /**
     * Dispatched each tick. The event will be dispatched to each listener even when the Ticker has been paused using
     * {{#crossLink "Ticker/setPaused"}}{{/crossLink}}.
     *
     * <h4>Example</h4>
     *
     *      createjs.Ticker.addEventListener("tick", handleTick);
     *      function handleTick(event) {
     *          console.log("Paused:", event.paused, event.delta);
     *      }
     *
     * @event tick
     * @param {Object} target The object that dispatched the event.
     * @param {String} type The event type.
     * @param {Boolean} paused Indicates whether the ticker is currently paused.
     * @param {Number} delta The time elapsed in ms since the last tick.
     * @param {Number} time The total time in ms since Ticker was initialized.
     * @param {Number} runTime The total time in ms that Ticker was not paused since it was initialized. For example,
     * 	you could determine the amount of time that the Ticker has been paused since initialization with time-runTime.
     * @since 0.6.0
     */


    // public static properties:
    /**
     * Deprecated in favour of {{#crossLink "Ticker/timingMode"}}{{/crossLink}}, and will be removed in a future version. If true, timingMode will
     * use {{#crossLink "Ticker/RAF_SYNCHED"}}{{/crossLink}} by default.
     * @deprecated Deprecated in favour of {{#crossLink "Ticker/timingMode"}}{{/crossLink}}.
     * @property useRAF
     * @static
     * @type {Boolean}
     * @default false
     **/
    Ticker.useRAF = false;

    /**
     * Specifies the timing api (setTimeout or requestAnimationFrame) and mode to use. See
     * {{#crossLink "Ticker/TIMEOUT"}}{{/crossLink}}, {{#crossLink "Ticker/RAF"}}{{/crossLink}}, and
     * {{#crossLink "Ticker/RAF_SYNCHED"}}{{/crossLink}} for mode details.
     * @property timingMode
     * @static
     * @type {String}
     * @default Ticker.TIMEOUT
     **/
    Ticker.timingMode = null;

    /**
     * Specifies a maximum value for the delta property in the tick event object. This is useful when building time
     * based animations and systems to prevent issues caused by large time gaps caused by background tabs, system sleep,
     * alert dialogs, or other blocking routines. Double the expected frame duration is often an effective value
     * (ex. maxDelta=50 when running at 40fps).
     *
     * This does not impact any other values (ex. time, runTime, etc), so you may experience issues if you enable maxDelta
     * when using both delta and other values.
     *
     * If 0, there is no maximum.
     * @property maxDelta
     * @static
     * @type {number}
     * @default 0
     */
    Ticker.maxDelta = 0;

    /**
     * When the ticker is paused, all listeners will still receive a tick event, but the <code>paused</code> property of the event will be false.
     * Also, while paused the `runTime` will not increase. See {{#crossLink "Ticker/tick:event"}}{{/crossLink}},
     * {{#crossLink "Ticker/getTime"}}{{/crossLink}}, and {{#crossLink "Ticker/getEventTime"}}{{/crossLink}} for more info.
     *
     * <h4>Example</h4>
     *
     *      createjs.Ticker.addEventListener("tick", handleTick);
     *      createjs.Ticker.paused = true;
     *      function handleTick(event) {
     *          console.log(event.paused,
     *          	createjs.Ticker.getTime(false),
     *          	createjs.Ticker.getTime(true));
     *      }
     *
     * @property paused
     * @static
     * @type {Boolean}
     * @default false
     **/
    Ticker.paused = false;


    // mix-ins:
    // EventDispatcher methods:
    Ticker.removeEventListener = null;
    Ticker.removeAllEventListeners = null;
    Ticker.dispatchEvent = null;
    Ticker.hasEventListener = null;
    Ticker._listeners = null;
    createjs.EventDispatcher.initialize(Ticker); // inject EventDispatcher methods.
    Ticker._addEventListener = Ticker.addEventListener;
    Ticker.addEventListener = function () {
        !Ticker._inited && Ticker.init();
        return Ticker._addEventListener.apply(Ticker, arguments);
    };


    // private static properties:
    /**
     * @property _inited
     * @static
     * @type {Boolean}
     * @protected
     **/
    Ticker._inited = false;

    /**
     * @property _startTime
     * @static
     * @type {Number}
     * @protected
     **/
    Ticker._startTime = 0;

    /**
     * @property _pausedTime
     * @static
     * @type {Number}
     * @protected
     **/
    Ticker._pausedTime = 0;

    /**
     * The number of ticks that have passed
     * @property _ticks
     * @static
     * @type {Number}
     * @protected
     **/
    Ticker._ticks = 0;

    /**
     * The number of ticks that have passed while Ticker has been paused
     * @property _pausedTicks
     * @static
     * @type {Number}
     * @protected
     **/
    Ticker._pausedTicks = 0;

    /**
     * @property _interval
     * @static
     * @type {Number}
     * @protected
     **/
    Ticker._interval = 50;

    /**
     * @property _lastTime
     * @static
     * @type {Number}
     * @protected
     **/
    Ticker._lastTime = 0;

    /**
     * @property _times
     * @static
     * @type {Array}
     * @protected
     **/
    Ticker._times = null;

    /**
     * @property _tickTimes
     * @static
     * @type {Array}
     * @protected
     **/
    Ticker._tickTimes = null;

    /**
     * Stores the timeout or requestAnimationFrame id.
     * @property _timerId
     * @static
     * @type {Number}
     * @protected
     **/
    Ticker._timerId = null;

    /**
     * True if currently using requestAnimationFrame, false if using setTimeout. This may be different than timingMode
     * if that property changed and a tick hasn't fired.
     * @property _raf
     * @static
     * @type {Boolean}
     * @protected
     **/
    Ticker._raf = true;


    // static getter / setters:
    /**
     * Use the {{#crossLink "Ticker/interval:property"}}{{/crossLink}} property instead.
     * @method setInterval
     * @static
     * @param {Number} interval
     * @deprecated
     **/
    Ticker.setInterval = function (interval) {
        Ticker._interval = interval;
        if (!Ticker._inited) {
            return;
        }
        Ticker._setupTick();
    };

    /**
     * Use the {{#crossLink "Ticker/framerate:property"}}{{/crossLink}} property instead.
     * @method getInterval
     * @static
     * @return {Number}
     * @deprecated
     **/
    Ticker.getInterval = function () {
        return Ticker._interval;
    };

    /**
     * Use the {{#crossLink "Ticker/framerate:property"}}{{/crossLink}} property instead.
     * @method setFPS
     * @static
     * @param {Number} value
     * @deprecated
     **/
    Ticker.setFPS = function (value) {
        Ticker.setInterval(1000 / value);
    };

    /**
     * Use the {{#crossLink "Ticker/interval:property"}}{{/crossLink}} property instead.
     * @method getFPS
     * @static
     * @return {Number}
     * @deprecated
     **/
    Ticker.getFPS = function () {
        return 1000 / Ticker._interval;
    };

    /**
     * Indicates the target time (in milliseconds) between ticks. Default is 50 (20 FPS).
     * Note that actual time between ticks may be more than specified depending on CPU load.
     * This property is ignored if the ticker is using the `RAF` timing mode.
     * @property interval
     * @static
     * @type {Number}
     **/

    /**
     * Indicates the target frame rate in frames per second (FPS). Effectively just a shortcut to `interval`, where
     * `framerate == 1000/interval`.
     * @property framerate
     * @static
     * @type {Number}
     **/
    try {
        Object.defineProperties(Ticker, {
            interval: {
                get: Ticker.getInterval,
                set: Ticker.setInterval
            },
            framerate: {
                get: Ticker.getFPS,
                set: Ticker.setFPS
            }
        });
    } catch (e) {
        console.log(e);
    }


    // public static methods:
    /**
     * Starts the tick. This is called automatically when the first listener is added.
     * @method init
     * @static
     **/
    Ticker.init = function () {
        if (Ticker._inited) {
            return;
        }
        Ticker._inited = true;
        Ticker._times = [];
        Ticker._tickTimes = [];
        Ticker._startTime = Ticker._getTime();
        Ticker._times.push(Ticker._lastTime = 0);
        Ticker.interval = Ticker._interval;
    };

    /**
     * Stops the Ticker and removes all listeners. Use init() to restart the Ticker.
     * @method reset
     * @static
     **/
    Ticker.reset = function () {
        if (Ticker._raf) {
            var f = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
            f && f(Ticker._timerId);
        } else {
            clearTimeout(Ticker._timerId);
        }
        Ticker.removeAllEventListeners("tick");
        Ticker._timerId = Ticker._times = Ticker._tickTimes = null;
        Ticker._startTime = Ticker._lastTime = Ticker._ticks = 0;
        Ticker._inited = false;
    };

    /**
     * Returns the average time spent within a tick. This can vary significantly from the value provided by getMeasuredFPS
     * because it only measures the time spent within the tick execution stack.
     *
     * Example 1: With a target FPS of 20, getMeasuredFPS() returns 20fps, which indicates an average of 50ms between
     * the end of one tick and the end of the next. However, getMeasuredTickTime() returns 15ms. This indicates that
     * there may be up to 35ms of "idle" time between the end of one tick and the start of the next.
     *
     * Example 2: With a target FPS of 30, getFPS() returns 10fps, which indicates an average of 100ms between the end of
     * one tick and the end of the next. However, getMeasuredTickTime() returns 20ms. This would indicate that something
     * other than the tick is using ~80ms (another script, DOM rendering, etc).
     * @method getMeasuredTickTime
     * @static
     * @param {Number} [ticks] The number of previous ticks over which to measure the average time spent in a tick.
     * Defaults to the number of ticks per second. To get only the last tick's time, pass in 1.
     * @return {Number} The average time spent in a tick in milliseconds.
     **/
    Ticker.getMeasuredTickTime = function (ticks) {
        var ttl = 0,
            times = Ticker._tickTimes;
        if (!times || times.length < 1) {
            return -1;
        }

        // by default, calculate average for the past ~1 second:
        ticks = Math.min(times.length, ticks || (Ticker.getFPS() | 0));
        for (var i = 0; i < ticks; i++) {
            ttl += times[i];
        }
        return ttl / ticks;
    };

    /**
     * Returns the actual frames / ticks per second.
     * @method getMeasuredFPS
     * @static
     * @param {Number} [ticks] The number of previous ticks over which to measure the actual frames / ticks per second.
     * Defaults to the number of ticks per second.
     * @return {Number} The actual frames / ticks per second. Depending on performance, this may differ
     * from the target frames per second.
     **/
    Ticker.getMeasuredFPS = function (ticks) {
        var times = Ticker._times;
        if (!times || times.length < 2) {
            return -1;
        }

        // by default, calculate fps for the past ~1 second:
        ticks = Math.min(times.length - 1, ticks || (Ticker.getFPS() | 0));
        return 1000 / ((times[0] - times[ticks]) / ticks);
    };

    /**
     * Use the {{#crossLink "Ticker/paused:property"}}{{/crossLink}} property instead.
     * @method setPaused
     * @static
     * @param {Boolean} value
     * @deprecated
     **/
    Ticker.setPaused = function (value) {
        // TODO: deprecated.
        Ticker.paused = value;
    };

    /**
     * Use the {{#crossLink "Ticker/paused:property"}}{{/crossLink}} property instead.
     * @method getPaused
     * @static
     * @return {Boolean}
     * @deprecated
     **/
    Ticker.getPaused = function () {
        // TODO: deprecated.
        return Ticker.paused;
    };

    /**
     * Returns the number of milliseconds that have elapsed since Ticker was initialized via {{#crossLink "Ticker/init"}}.
     * Returns -1 if Ticker has not been initialized. For example, you could use
     * this in a time synchronized animation to determine the exact amount of time that has elapsed.
     * @method getTime
     * @static
     * @param {Boolean} [runTime=false] If true only time elapsed while Ticker was not paused will be returned.
     * If false, the value returned will be total time elapsed since the first tick event listener was added.
     * @return {Number} Number of milliseconds that have elapsed since Ticker was initialized or -1.
     **/
    Ticker.getTime = function (runTime) {
        return Ticker._startTime ? Ticker._getTime() - (runTime ? Ticker._pausedTime : 0) : -1;
    };

    /**
     * Similar to getTime(), but returns the time on the most recent tick event object.
     * @method getEventTime
     * @static
     * @param runTime {Boolean} [runTime=false] If true, the runTime property will be returned instead of time.
     * @returns {number} The time or runTime property from the most recent tick event or -1.
     */
    Ticker.getEventTime = function (runTime) {
        return Ticker._startTime ? (Ticker._lastTime || Ticker._startTime) - (runTime ? Ticker._pausedTime : 0) : -1;
    };

    /**
     * Returns the number of ticks that have been broadcast by Ticker.
     * @method getTicks
     * @static
     * @param {Boolean} pauseable Indicates whether to include ticks that would have been broadcast
     * while Ticker was paused. If true only tick events broadcast while Ticker is not paused will be returned.
     * If false, tick events that would have been broadcast while Ticker was paused will be included in the return
     * value. The default value is false.
     * @return {Number} of ticks that have been broadcast.
     **/
    Ticker.getTicks = function (pauseable) {
        return Ticker._ticks - (pauseable ? Ticker._pausedTicks : 0);
    };


    // private static methods:
    /**
     * @method _handleSynch
     * @static
     * @protected
     **/
    Ticker._handleSynch = function () {
        Ticker._timerId = null;
        Ticker._setupTick();

        // run if enough time has elapsed, with a little bit of flexibility to be early:
        if (Ticker._getTime() - Ticker._lastTime >= (Ticker._interval - 1) * 0.97) {
            Ticker._tick();
        }
    };

    /**
     * @method _handleRAF
     * @static
     * @protected
     **/
    Ticker._handleRAF = function () {
        Ticker._timerId = null;
        Ticker._setupTick();
        Ticker._tick();
    };

    /**
     * @method _handleTimeout
     * @static
     * @protected
     **/
    Ticker._handleTimeout = function () {
        Ticker._timerId = null;
        Ticker._setupTick();
        Ticker._tick();
    };

    /**
     * @method _setupTick
     * @static
     * @protected
     **/
    Ticker._setupTick = function () {
        if (Ticker._timerId != null) {
            return;
        } // avoid duplicates

        var mode = Ticker.timingMode || (Ticker.useRAF && Ticker.RAF_SYNCHED);
        if (mode == Ticker.RAF_SYNCHED || mode == Ticker.RAF) {
            var f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
            if (f) {
                Ticker._timerId = f(mode == Ticker.RAF ? Ticker._handleRAF : Ticker._handleSynch);
                Ticker._raf = true;
                return;
            }
        }
        Ticker._raf = false;
        Ticker._timerId = setTimeout(Ticker._handleTimeout, Ticker._interval);
    };

    /**
     * @method _tick
     * @static
     * @protected
     **/
    Ticker._tick = function () {
        var paused = Ticker.paused;
        var time = Ticker._getTime();
        var elapsedTime = time - Ticker._lastTime;
        Ticker._lastTime = time;
        Ticker._ticks++;

        if (paused) {
            Ticker._pausedTicks++;
            Ticker._pausedTime += elapsedTime;
        }

        if (Ticker.hasEventListener("tick")) {
            var event = new createjs.Event("tick");
            var maxDelta = Ticker.maxDelta;
            event.delta = (maxDelta && elapsedTime > maxDelta) ? maxDelta : elapsedTime;
            event.paused = paused;
            event.time = time;
            event.runTime = time - Ticker._pausedTime;
            Ticker.dispatchEvent(event);
        }

        Ticker._tickTimes.unshift(Ticker._getTime() - time);
        while (Ticker._tickTimes.length > 100) {
            Ticker._tickTimes.pop();
        }

        Ticker._times.unshift(time);
        while (Ticker._times.length > 100) {
            Ticker._times.pop();
        }
    };

    /**
     * @method _getTime
     * @static
     * @protected
     **/
    var now = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
    Ticker._getTime = function () {
        return ((now && now.call(performance)) || (new Date().getTime())) - Ticker._startTime;
    };


    createjs.Ticker = Ticker;
}());

/*
    Weave (Web-based Analysis and Visualization Environment)
    Copyright (C) 2008-2011 University of Massachusetts Lowell
    This file is a part of Weave.
    Weave is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License, Version 3,
    as published by the Free Software Foundation.
    Weave is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with Weave.  If not, see <http://www.gnu.org/licenses/>.
*/

// namespace
if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

/**
 * This provides a set of useful static functions for Object Comparison.
 * All Static functions are Ported from  Apache Flex mx.utils.ObjectUtil - ActionScript Code
 * @author sanjay1909
 */
(function () {
    "use strict";

    //constructor
    function ObjectUtil() {
        throw "ObjectUtil cannot be instantiated.";
    }

    /**
     *  Compares two numeric values.
     *  @param a First number.
     *  @param b Second number.
     *  @return 0 is both numbers are NaN.
     *  1 if only <code>a</code> is a NaN.
     *  -1 if only <code>b</code> is a NaN.
     *  -1 if <code>a</code> is less than <code>b</code>.
     *  1 if <code>a</code> is greater than <code>b</code>.
     */
    ObjectUtil.numericCompare = function (a, b) {
        if (isNaN(a) && isNaN(b))
            return 0;

        if (isNaN(a))
            return 1;

        if (isNaN(b))
            return -1;

        if (a < b)
            return -1;

        if (a > b)
            return 1;

        return 0;
    };

    /**
     *  Compares two String values.
     *  @param a First String value.
     *  @param b Second String value.
     *  @param caseInsensitive Specifies to perform a case insensitive compare,
     *  <code>true</code>, or not, <code>false</code>.
     *
     *  @return 0 is both Strings are null.
     *  1 if only <code>a</code> is null.
     *  -1 if only <code>b</code> is null.
     *  -1 if <code>a</code> precedes <code>b</code>.
     *  1 if <code>b</code> precedes <code>a</code>.
     */
    ObjectUtil.stringCompare = function (a, b, caseInsensitive) {
        if ((a === null || a === undefined) && (b === null || b === undefined))
            return 0;

        if (a === null || a === undefined)
            return 1;

        if (b === null || b === undefined)
            return -1;

        // Convert to lowercase if we are case insensitive.
        if (caseInsensitive) {
            a = a.toLocaleLowerCase();
            b = b.toLocaleLowerCase();
        }

        var result = a.localeCompare(b);

        if (result < -1)
            result = -1;
        else if (result > 1)
            result = 1;

        return result;
    };

    /**
     *  Compares the two Date objects and returns an integer value
     *  indicating if the first Date object is before, equal to,
     *  or after the second item.
     *  @param a Date object.
     *  @param b Date object.
     *  @return 0 if <code>a</code> and <code>b</code> are equal
     *  (or both are <code>null</code>);
     *  -1 if <code>a</code> is before <code>b</code>
     *  (or <code>b</code> is <code>null</code>);
     *  1 if <code>a</code> is after <code>b</code>
     *  (or <code>a</code> is <code>null</code>);
     *  0 is both dates getTime's are NaN;
     *  1 if only <code>a</code> getTime is a NaN;
     *  -1 if only <code>b</code> getTime is a NaN.
     */
    ObjectUtil.dateCompare = function (a, b) {
        if ((a === null || a === undefined) && (b === null || b === undefined))
            return 0;

        if (a === null || undefined)
            return 1;

        if (b === null || undefined)
            return -1;

        var na = a.getTime();
        var nb = b.getTime();

        if (na < nb)
            return -1;

        if (na > nb)
            return 1;

        if (isNaN(na) && isNaN(nb))
            return 0;

        if (isNaN(na))
            return 1;

        if (isNaN(nb))
            return -1;

        return 0;
    };

    weavecore.ObjectUtil = ObjectUtil;

}());

/*
    Weave (Web-based Analysis and Visualization Environment)
    Copyright (C) 2008-2011 University of Massachusetts Lowell
    This file is a part of Weave.
    Weave is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License, Version 3,
    as published by the Free Software Foundation.
    Weave is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with Weave.  If not, see <http://www.gnu.org/licenses/>.
*/

// namespace
if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

/**
 * This provides a set of useful static functions.
 * All the functions defined in this class are pure functions,
 * meaning they always return the same result with the same arguments, and they have no side-effects.
 *
 * @author adufilie
 * @author sanbalag
 */
(function () {
    "use strict";

    //constructor
    function StandardLib() {
        throw "StandardLib cannot be instantiated.";
    }

    /**
     * This compares two dynamic objects or primitive values and is much faster than ObjectUtil.compare().
     * Does not check for circular refrences.
     * @param a First dynamic object or primitive value.
     * @param b Second dynamic object or primitive value.
     * @return A value of zero if the two objects are equal, nonzero if not equal.
     */
    StandardLib.compare = function (a, b) {
        var c;
        var ObjectUtil = weavecore.ObjectUtil;
        if (a === b)
            return 0;
        if (a === null || a === undefined)
            return 1;
        if (b === null || b === undefined)
            return -1;
        var typeA = typeof (a);
        var typeB = typeof (b);
        if (typeA !== typeB)
            return weavecore.ObjectUtil.stringCompare(typeA, typeB);
        if (typeA === 'boolean')
            return weavecore.ObjectUtil.numericCompare(Number(a), Number(b));
        if (typeA === 'number')
            return weavecore.ObjectUtil.numericCompare(a, b);
        if (typeA === 'string')
            return weavecore.ObjectUtil.stringCompare(a, b);

        if (typeA !== 'object')
            return 1;

        if (a instanceof Date && b instanceof Date)
            return weavecore.ObjectUtil.dateCompare(a, b);

        if (a.constructor === Array && b.constructor === Array) {
            var an = a.length;
            var bn = b.length;
            if (an < bn)
                return -1;
            if (an > bn)
                return 1;
            for (var i = 0; i < an; i++) {
                c = StandardLib.compare(a[i], b[i]);
                if (c !== 0)
                    return c;
            }
            return 0;
        }

        var qna = a.constructor.name;
        var qnb = b.constructor.name;

        if (qna != qnb)
            return weavecore.ObjectUtil.stringCompare(qna, qnb);

        var p;

        // test if objects are dynamic
        try {
            a[''];
            b[''];
        } catch (e) {
            return 1; // not dynamic objects
        }

        // if there are properties in a not found in b, return -1
        for (p in a) {
            if (!b.hasOwnProperty(p))
                return -1;
        }
        for (p in b) {
            // if there are properties in b not found in a, return 1
            if (!a.hasOwnProperty(p))
                return 1;

            c = StandardLib.compare(a[p], b[p]);
            if (c !== 0)
                return c;
        }

        return 0;
    };

    weavecore.StandardLib = StandardLib;
}());

/**
 * @module weavecore
 */

//namesapce
if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

(function () {
    "use strict";

    // constructor
    /**
     * Utility Class to create Dynamic state objects with three properties: objectName, className, sessionState
     * @class DynamicState
     */
    function DynamicState() {
        throw "DynamicState cannot be instantiated.";
    }

    // Static Public Const Properties
    /**
     * The name of the property containing the name assigned to the object when the session state is generated.
     * @static
     * @public
     * @property OBJECT_NAME
     * @readOnly
     * @default "objectName"
     * @type String
     */
    Object.defineProperty(DynamicState, 'OBJECT_NAME', {
        value: "objectName"
    });

    /**
     * The name of the property containing the qualified class name of the original object providing the session state.
     * @static
     * @public
     * @property CLASS_NAME
     * @readOnly
     * @default "className"
     * @type String
     */
    Object.defineProperty(DynamicState, 'CLASS_NAME', {
        value: "className"
    });

    /**
     * The name of the property containing the session state for an object of the type specified by className.
     * @static
     * @public
     * @property SESSION_STATE
     * @readOnly
     * @default "sessionState"
     * @type String
     */
    Object.defineProperty(DynamicState, 'SESSION_STATE', {
        value: "sessionState"
    });

    //static Public Methods
    /**
     * Creates an Object having three properties: objectName, className, sessionState
     * @method create
     * @static
     * @param {String} objectName The name assigned to the object when the session state is generated.
     * @param {String} className The qualified class name of the original object providing the session state.
     * @param {Object} sessionState The session state for an object of the type specified by className.
     */
    DynamicState.create = function (objectName, className, sessionState) {
        var obj = {};
        // convert empty strings ("") to null
        obj[DynamicState.OBJECT_NAME] = objectName || null;
        obj[DynamicState.CLASS_NAME] = className || null;
        obj[DynamicState.SESSION_STATE] = sessionState;
        return obj;
    };

    /**
     * This function can be used to detect dynamic state objects within nested, untyped session state objects.
     * This function will check if the given object has the three properties of a dynamic state object.
     * @method isDynamicState
     * @static
     * @param {Object} object An object to check.
     * @return {Boolean} true if the object has all three properties and no extras.
     */
    DynamicState.isDynamicState = function (object) {
        var matchCount = 0;
        for (var name in object) {
            if (name === DynamicState.OBJECT_NAME || name === DynamicState.CLASS_NAME || name === DynamicState.SESSION_STATE)
                matchCount++;
            else
                return false;
        }
        return (matchCount == 3); // must match all three properties with no extras
    };

    /**
     * This function checks whether or not a session state is an Array containing at least one
     * object that looks like a DynamicState and has no other non-String items.
     * @method isDynamicStateArray
     * @static
     * @param {Object} state
     * @return {Boolean} A value of true if the Array looks like a dynamic session state or diff.
     */
    DynamicState.isDynamicStateArray = function (state) {
        if (!Array.isArray(state))
            return false;
        var result = false;
        for (var i = 0; i < state.length; i++) {
            var item = state[i];
            if (typeof item == 'string' || item instanceof String)
                continue; // dynamic state diffs can contain String values.
            if (DynamicState.isDynamicState(item))
                result = true;
            else
                return false;
        }
        return result;
    };

    weavecore.DynamicState = DynamicState;

}());

/**
 * @module weavecore
 */

//namesapce
if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

(function () {
    "use strict";
    /**
     * temporary solution to save the namespace for this class/prototype
     * @static
     * @public
     * @property NS
     * @default weavecore
     * @readOnly
     * @type String
     */
    Object.defineProperty(ILinkableObject, 'NS', {
        value: 'weavecore'
    });

    /**
     * TO-DO:temporary solution to save the CLASS_NAME constructor.name works for window object , but modular based won't work
     * @static
     * @public
     * @property CLASS_NAME
     * @readOnly
     * @type String
     */
    Object.defineProperty(ILinkableObject, 'CLASS_NAME', {
        value: 'ILinkableObject'
    });

    // constructor:
    /**
     * An object that implements this empty interface has an associated CallbackCollection and session state,
     * accessible through the global functions in the WeaveAPI Object. In order for an ILinkableObject to
     * be created dynamically at runtime, it must not require any constructor parameters.
     * @class ILinkableObject
     * @constructor
     */
    function ILinkableObject() {
        /**
         * temporary solution to save the namespace for this class/prototype
         * @public
         * @property ns
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'ns', {
            value: 'weavecore'
        });
    }

    weavecore.ILinkableObject = ILinkableObject;

}());

if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

/**
 * This is an interface to a composite object with dynamic state, meaning child objects can be dynamically added or removed.
 * The session state for this type of object is defined as an Array of DynamicState objects.
 * DynamicState objects are defined as having exactly three properties: objectName, className, and sessionState.
 * @see DynamicState
 *
 * @author adufilie
 * @author sanjay1909
 */
(function () {
    function ILinkableCompositeObject() {
        /**
         * temporary solution to save the namespace for this class/prototype
         * @public
         * @property ns
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'ns', {
            value: 'weavecore'
        });
    }



    ILinkableCompositeObject.prototype = new weavecore.ILinkableObject();
    ILinkableCompositeObject.prototype.constructor = ILinkableCompositeObject;

    // Prototypes
    var p = ILinkableCompositeObject.prototype;

    /**
     * This gets the session state of this composite object.
     * @return An Array of DynamicState objects which compose the session state for this object.
     * @see weave.api.core.DynamicState
     */
    p.getSessionState = function () {};

    /**
     * This sets the session state of this composite object.
     * @param newState An Array of child name Strings or DynamicState objects containing the new values and types for child ILinkableObjects.
     * @param removeMissingDynamicObjects If true, this will remove any child objects that do not appear in the session state.
     *     As a special case, a null session state will result in no change regardless of the removeMissingDynamicObjects value.
     * @see weave.api.core.DynamicState
     */
    p.setSessionState = function (newState, removeMissingDynamicObjects) {};

    weavecore.ILinkableCompositeObject = ILinkableCompositeObject;

}());

/**
 * @module weavecore
 */

//namesapce
if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}


(function () {
    "use strict";

    // Static Public Const Properties
    /**
     * The name of the property containing the name assigned to the object when the session state is generated.
     * @static
     * @public
     * @property DEFAULT_TRIGGER_COUNT
     * @readOnly
     * @default 1
     * @type number
     */
    Object.defineProperty(CallbackCollection, 'DEFAULT_TRIGGER_COUNT', {
        value: 1
    });

    /**
     * TO-DO:temporary solution to save the namespace for this class/prototype
     * @static
     * @public
     * @property NS
     * @readOnly
     * @type String
     */
    Object.defineProperty(CallbackCollection, 'NS', {
        value: 'weavecore'
    });

    /**
     * TO-DO:temporary solution to save the CLASS_NAME constructor.name works for window object , but modular based won't work
     * @static
     * @public
     * @property CLASS_NAME
     * @readOnly
     * @type String
     */
    Object.defineProperty(CallbackCollection, 'CLASS_NAME', {
        value: 'CallbackCollection'
    });

    // constructor:
    /**
     * This class manages a list of callback functions.
     * If specified, the preCallback function will be called immediately before running each
     * callback using the parameters passed to _runCallbacksImmediately(). This means if there
     * are five callbacks added, preCallback() gets called five times whenever
     * _runCallbacksImmediately() is called.  An example usage of this is to make sure a relevant
     * variable is set to the appropriate value while each callback is running.  The preCallback
     * function will not be called before grouped callbacks.
     * @class CallbackCollection
     * @param {Function} preCallback An optional function to call before each immediate callback.
     * @constructor
     */

    function CallbackCollection(preCallback) {

        weavecore.ILinkableObject.call(this);

        //private properties:

        /**
         * for debugging only... will be set when debug==true
         * @private
         * @property _linkableObject
         * @type ILinkableObject
         **/
        this._linkableObject;

        /**
         * for debugging only... will be set when debug==true
         * @private
         * @property _lastTriggerStackTrace
         * @type string
         **/
        this._lastTriggerStackTrace; //
        /**
         * @private
         * @property _oldEntries
         * @type Array
         **/
        this._oldEntries;

        /**
         * This is a list of CallbackEntry objects in the order they were created.
         * @private
         * @property _callbackEntries
         * @type Array
         **/
        this._callbackEntries = [];

        /**
         * This is the function that gets called immediately before every callback.
         * @protected
         * @property _precallback
         * @type function
         **/
        this._preCallback = preCallback;

        /**
         * If this is true, it means triggerCallbacks() has been called while delayed was true.
         * @private
         * @property _runCallbacksIsPending
         * @defaut false
         * @type boolean
         **/
        this._runCallbacksIsPending = false;

        /**
         * This is the number of times delayCallbacks() has been called without a matching call to resumeCallbacks().
         * While this is greater than zero, effects of triggerCallbacks() will be delayed.
         * @private
         * @property _delayCount
         * @type number
         * @default 0
         **/
        this._delayCount = 0;

        /**
         * This value keeps track of how many times callbacks were triggered, and is returned by the public triggerCounter accessor function.
         * The value starts at 1 to simplify code that compares the counter to a previous value.
         * This allows the previous value to be set to zero so change will be detected the first time the counter is compared.
         * This fixes potential bugs where the base case of zero is not considered.
         * @private
         * @property _runCallbacksIsPending
         * @type boolean
         **/
        this._triggerCounter = CallbackCollection.DEFAULT_TRIGGER_COUNT;

        /**
         * A list of CallbackEntry objects for when dispose() is called.
         * @private
         * @property _disposeCallbackEntries
         * @type Array
         */
        this._disposeCallbackEntries = [];
        /**
         * This value is used internally to remember if dispose() was called.
         * @private
         * @property _wasDisposed
         * @type Boolean
         * @default false
         */
        this._wasDisposed = false;

        /**
         * This flag is used in _runCallbacksImmediately() to detect when a recursive call has completed running all the callbacks.
         * @private
         * @property _runCallbacksCompleted
         * @type Boolean
         */
        this._runCallbacksCompleted;

        // public properties:
        // readonly Properties

        /**
         * This counter gets incremented at the time that callbacks are triggered and before they are actually called.
         * It is necessary in some situations to check this counter to determine if cached data should be used.
         * @public
         * @property triggerCounter
         * @readOnly
         * @type Number
         */
        Object.defineProperty(this, 'triggerCounter', {
            get: function () {
                return this._triggerCounter;
            }
        });

        /**
         * While this is true, it means the delay count is greater than zero and the effects of
         * triggerCallbacks() are delayed until resumeCallbacks() is called to reduce the delay count.
         * @public
         * @property callbacksAreDelayed
         * @readOnly
         * @type Boolean
         */
        Object.defineProperty(this, 'callbacksAreDelayed', {
            get: function () {
                return this._delayCount > 0;
            }
        });

        /**
         * This flag becomes true after dispose() is called.
         * @public
         * @property wasDisposed
         * @readOnly
         * @type Boolean
         */
        Object.defineProperty(this, 'wasDisposed', {
            get: function () {
                return this._wasDisposed;
            }
        });

        /**
         * temporary solution to save the namespace for this class/prototype
         * @public
         * @property ns
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'ns', {
            value: 'weavecore'
        });

    }

    CallbackCollection.prototype = new weavecore.ILinkableObject();
    CallbackCollection.prototype.constructor = CallbackCollection;

    // Prototypes
    var p = CallbackCollection.prototype;
    // public methods:
    /**
     * This adds the given function as a callback.  The function must not require any parameters.
     * The callback function will not be called recursively as a result of it triggering callbacks recursively.
     * @method addImmediateCallback
     * @param {Object} relevantContext If this is not null, then the callback will be removed when the relevantContext object is disposed via SessionManager.dispose().  This parameter is typically a 'this' pointer.
     * @param {Function} callback The function to call when callbacks are triggered.
     * @param {Boolean} runCallbackNow If this is set to true, the callback will be run immediately after it is added.
     * @param {Boolean} alwaysCallLast If this is set to true, the callback will be always be called after any callbacks that were added with alwaysCallLast=false.  Use this to establish the desired child-to-parent triggering order.
     */
    p.addImmediateCallback = function (contextObj, callback, runCallbackNow, alwaysCallLast) {
        if (callback === null || callback === undefined)
            return;

        // set default value for parameters
        if (runCallbackNow === null || runCallbackNow === undefined)
            runCallbackNow = false;

        if (alwaysCallLast === null || alwaysCallLast === undefined)
            alwaysCallLast = false;

        // remove the callback if it was previously added
        this.removeCallback(callback);

        var entry = new CallbackEntry(contextObj, callback);
        if (alwaysCallLast) // this will run the callback in second round of callback entries
            entry.schedule = 1; //mostly parent.triggercallback are called last.
        this._callbackEntries.push(entry);

        if (runCallbackNow) {
            // increase the recursion count while the function is running
            entry.recursionCount++;
            callback.call(this);
            entry.recursionCount--;
        }
    };

    /**
     * This will trigger every callback function to be called with their saved arguments.
     * If the delay count is greater than zero, the callbacks will not be called immediately.
     * @method triggerCallbacks
     */
    p.triggerCallbacks = function () {

        if (CallbackCollection.debug) {
            if (arguments)
                console.log("triggerCallbacks", arguments);
            else
                console.log("triggerCallbacks", this);

            this._lastTriggerStackTrace = new Error(CallbackCollection.STACK_TRACE_TRIGGER).stack;
        }

        if (this._delayCount > 0) {
            // we still want to increase the counter even if callbacks are delayed
            this._triggerCounter++;
            if (CallbackCollection.debug) console.log("triggerCallbacks: _runCallbacksIsPending ->true", this._delayCount, this._triggerCounter);
            this._runCallbacksIsPending = true;
            return;
        }
        this._runCallbacksImmediately.call(this);
    };


    /**
     * This function runs callbacks immediately, ignoring any delays.
     * The preCallback function will be called with the specified preCallbackParams arguments.
     * @method _runCallbacksImmediately
     * @param preCallbackParams The arguments to pass to the preCallback function given in the constructor.
     * @protected
     * @final
     */
    p._runCallbacksImmediately = function () {
        if (CallbackCollection.debug) {
            if (arguments.length > 1) console.log("_runCallbacksImmediately: ", arguments);
        }
        var preCallbackParams = arguments;
        //increase the counter immediately
        this._triggerCounter++;
        this._runCallbacksIsPending = false;

        // This flag is set to false before running the callbacks.  When it becomes true, the loop exits.
        this._runCallbacksCompleted = false;

        for (var schedule = 0; schedule < 2; schedule++) {
            // run the callbacks in the order they were added
            for (var i = 0; i < this._callbackEntries.length; i++) {
                // If this flag is set to true, it means a recursive call has finished running callbacks.
                // If _preCallback is specified, we don't want to exit the loop because that cause a loss of information.
                if (this._runCallbacksCompleted && (this._preCallback === undefined || this._preCallback === null))
                    break;

                var entry = this._callbackEntries[i];

                // if we haven't reached the matching schedule yet, skip this callback
                if (entry.schedule != schedule)
                    continue;
                // Remove the entry if the context was disposed by SessionManager.
                var shouldRemoveEntry;
                if (entry.callback === null || entry.callback === undefined)
                    shouldRemoveEntry = true;
                else if (entry.context instanceof CallbackCollection) // special case
                    shouldRemoveEntry = entry.context.wasDisposed;
                else
                    shouldRemoveEntry = WeaveAPI.SessionManager.objectWasDisposed(entry.context);
                if (shouldRemoveEntry) {
                    if (CallbackCollection.debug) {
                        if (arguments.length > 1) console.log("Entry is disposed");
                    }
                    entry.dispose();
                    // remove the empty callback reference from the list
                    var removed = this._callbackEntries.splice(i--, 1); // decrease i because remaining entries have shifted
                    if (CallbackCollection.debug)
                        this._oldEntries = this._oldEntries ? this._oldEntries.concat(removed) : removed;
                    continue;
                }
                // if _preCallback is specified, we don't want to limit recursion because that would cause a loss of information.
                if (entry.recursionCount === 0 || (this._preCallback !== undefined && this._preCallback !== null)) {
                    entry.recursionCount++; // increase count to signal that we are currently running this callback.
                    if (this._preCallback !== undefined && this._preCallback !== null)
                        this._preCallback.apply(this, preCallbackParams);
                    if (CallbackCollection.debug) {
                        if (arguments.length > 1) console.log(["callback executed"]);
                    }
                    entry.callback.call();

                    entry.recursionCount--; // decrease count because the callback finished.
                }
            }
        }
        // This flag is now set to true in case this function was called recursively.  This causes the outer call to exit its loop.
        this._runCallbacksCompleted = true;
    };

    /**
     * This function will remove a callback that was previously added.
     * @method removeCallback
     * @param {Function} callback The function to remove from the list of callbacks.
     */
    p.removeCallback = function (callback) {
        // if the callback was added as a grouped callback, we need to remove the trigger function
        GroupedCallbackEntry.removeGroupedCallback(this, callback);
        // find the matching CallbackEntry, if any
        for (var outerLoop = 0; outerLoop < 2; outerLoop++) {
            var entries = outerLoop === 0 ? this._callbackEntries : this._disposeCallbackEntries;
            for (var index = 0; index < entries.length; index++) {
                var entry = entries[index];
                if (entry !== null && entry !== undefined && callback === entry.callback) {
                    // Remove the callback by setting the function pointer to null.
                    // This is done instead of removing the entry because we may be looping over the _callbackEntries Array right now.
                    entry.dispose();
                }
            }
        }
    };



    /**
     * This will increase the delay count by 1.  To decrease the delay count, use resumeCallbacks().
     * As long as the delay count is greater than zero, effects of triggerCallbacks() will be delayed.
     * @method delayCallbacks
     */
    p.delayCallbacks = function () {
        this._delayCount++;
    };

    /**
     * This will decrease the delay count by one if it is greater than zero.
     * If triggerCallbacks() was called while the delay count was greater than zero, immediate callbacks will be called now.
     * @method resumeCallbacks
     */
    p.resumeCallbacks = function () {
        if (this._delayCount > 0)
            this._delayCount--;

        if (this._delayCount === 0 && this._runCallbacksIsPending)
            this.triggerCallbacks("resume Callbacks");
    };

    /**
     * This will add a callback that will only be called once, when this callback collection is disposed.
     * @method addDisposeCallback
     * @param {Object} relevantContext If this is not null, then the callback will be removed when the relevantContext object is disposed via SessionManager.dispose().  This parameter is typically a 'this' pointer.
     * @param callback {Function} The function to call when this callback collection is disposed.
     */
    p.addDisposeCallback = function (relevantContext, callback) {
        // don't do anything if the dispose callback was already added
        for (var i = 0; i < this._disposeCallbackEntries.length; i++) {
            var entry = this._disposeCallbackEntries[i];
            if (entry.callback === callback)
                return;
        }


        this._disposeCallbackEntries.push(new CallbackEntry(relevantContext, callback));
    };


    /**
     * This function will be called automatically when the object is no longer needed, and should not be called directly.
     * Use disposeObject() instead so parent-child relationships get cleaned up automatically.
     * @method dispose
     */
    p.dispose = function () {
        // remove all callbacks
        if (CallbackCollection.debug)
            this._oldEntries = this._oldEntries ? this._oldEntries.concat(this._callbackEntries) : this._callbackEntries.concat();

        this._callbackEntries.length = 0;
        this._wasDisposed = true;

        // run & remove dispose callbacks
        while (this._disposeCallbackEntries.length) {
            var entry = this._disposeCallbackEntries.shift();
            if (entry.callback !== null && entry.callback !== undefined && !WeaveAPI.SessionManager.objectWasDisposed(entry.context)) {
                entry.callback();
            }
        }
    };



    /**
     * Adds a callback that will only be called during a scheduled time each frame.  Grouped callbacks use a central trigger list,
     * meaning that if multiple ICallbackCollections trigger the same grouped callback before the scheduled time, it will behave as
     * if it were only triggered once.  For this reason, grouped callback functions cannot have any parameters.  Adding a grouped
     * callback to a ICallbackCollection will undo any previous effects of addImmediateCallback() or addDisposeCallback() made to the
     * same ICallbackCollection.  The callback function will not be called recursively as a result of it triggering callbacks recursively.
     * @method addGroupedCallback
     * @param relevantContext {Object} If this is not null, then the callback will be removed when the relevantContext object is disposed via SessionManager.dispose().  This parameter is typically a 'this' pointer.
     * @param groupedCallback {Function} The callback function that will only be allowed to run during a scheduled time each frame.  It must not require any parameters.
     * @param triggerCallbackNow {Boolean} If this is set to true, the callback will be triggered to run during the scheduled time after it is added.
     */
    p.addGroupedCallback = function (relevantContext, groupedCallback, triggerCallbackNow) {
        //set default value for parameters
        if (triggerCallbackNow === null || triggerCallbackNow === undefined)
            triggerCallbackNow = false;
        GroupedCallbackEntry.addGroupedCallback(this, relevantContext, groupedCallback, triggerCallbackNow);
    };



    weavecore.CallbackCollection = CallbackCollection;


    // constructor:
    /**
     * Internal Class used in {{#crossLink "CallbackCollection"}}{{/crossLink}}
     * @class CallbackEntry
     * @for CallbackCollection
     * @param {Object} context
     * @param {Function} callback
     * @constructor
     */
    function CallbackEntry(context, callback) {
        /**
         * This is the context in which the callback function is relevant.
         * When the context is disposed, the callback should not be called anymore.
         * @public
         * @property context
         * @type Object
         */
        this.context = context;
        /**
         * This is the callback function.
         * @public
         * @property callback
         * @type Function
         */
        this.callback = callback;
        /**
         * This is the current recursion depth.
         * If this is greater than zero, it means the function is currently running.
         * @public
         * @property recursionCount
         * @type number
         */
        this.recursionCount = 0;
        /**
         * This is 0 if the callback was added with alwaysCallLast=false, or 1 for alwaysCallLast=true
         * @public
         * @property schedule
         * @type number
         */
        this.schedule = 0;

        /**
         * This is a stack trace from when the callback was added.
         * @public
         * @property addCallback_stackTrace
         * @type string
         */
        this.addCallback_stackTrace;
        /**
         * This is a stack trace from when the callback was removed.
         * @public
         * @property removeCallback_stackTrace
         * @type string
         */
        this.removeCallback_stackTrace;

        if (CallbackCollection.debug)
            this.addCallback_stackTrace = new Error(CallbackEntry.STACK_TRACE_ADD).stack;
    }

    //Static Properties:
    /**
     * Internal Static const properties for Debugging
     * @private
     * @static
     * @property STACK_TRACE_TRIGGER
     * @readOnly
     * @default "This is the stack trace from when the callbacks were last triggered."
     * @type string
     */
    Object.defineProperty(CallbackEntry, 'STACK_TRACE_TRIGGER', {
        value: "This is the stack trace from when the callbacks were last triggered."
    });
    /**
     * Internal Static const properties for Debugging
     * @private
     * @static
     * @property STACK_TRACE_ADD
     * @readOnly
     * @default "This is the stack trace from when the callback was added."
     * @type string
     */
    Object.defineProperty(CallbackEntry, 'STACK_TRACE_ADD', {
        value: "This is the stack trace from when the callback was added."
    });
    /**
     * Internal Static const properties for Debugging
     * @private
     * @static
     * @property STACK_TRACE_REMOVE
     * @readOnly
     * @default "This is the stack trace from when the callback was removed."
     * @type string
     */
    Object.defineProperty(CallbackEntry, 'STACK_TRACE_REMOVE', {
        value: "This is the stack trace from when the callback was removed."
    });

    /**
     * Call this when the callback entry is no longer needed.
     * @method dispose
     */
    CallbackEntry.prototype.dispose = function () {
        if (CallbackCollection.debug && this.callback !== null && this.callback !== undefined)
            this.removeCallback_stackTrace = new Error(CallbackEntry.STACK_TRACE_REMOVE).stack;

        this.context = null;
        this.callback = null;
    };

    weavecore.CallbackEntry = CallbackEntry;


    // constructor:
    /**
     * Internal Class used in {{#crossLink "CallbackCollection"}}{{/crossLink}}
     * @class GroupedCallbackEntry
     * @extends CallbackEntry
     * @for CallbackCollection
     * @param {Function} groupedCallback
     * @constructor
     */
    function GroupedCallbackEntry(groupedCallback) {

        CallbackEntry.call(this, [], groupedCallback);
        /**
         * If true, the callback was triggered this frame.
         * @public
         * @property triggered
         * @type Boolean
         * @default false
         */
        this.triggered = false;

        /**
         * If true, the callback was triggered again from another grouped callback.
         * @public
         * @property triggeredAgain
         * @type Boolean
         * @default false
         */
        this.triggeredAgain = false;


        if (!GroupedCallbackEntry._initialized) {
            weavecore.StageUtils.addEventCallback("tick", null, GroupedCallbackEntry._handleGroupedCallbacks.bind(this));
            GroupedCallbackEntry._initialized = true;
        }
    }

    //Static Properties:
    /**
     * True while handling grouped callbacks.
     * @private
     * @static
     * @property _handlingGroupedCallbacks
     * @default false
     * @type Boolean
     */
    GroupedCallbackEntry._handlingGroupedCallbacks = false;

    /**
     * True while handling grouped callbacks called recursively from other grouped callbacks.
     * @private
     * @static
     * @property _handlingRecursiveGroupedCallbacks
     * @default false
     * @type Boolean
     */
    GroupedCallbackEntry._handlingRecursiveGroupedCallbacks = false;

    /**
     * This gets set to true when the static _handleGroupedCallbacks() callback has been added as a frame listener.
     * @private
     * @static
     * @property _initialized
     * @default false
     * @type Boolean
     */
    GroupedCallbackEntry._initialized = false;

    /**
     * This maps a groupedCallback function to its corresponding GroupedCallbackEntry.
     * @private
     * @static
     * @readOnly
     * @property _entryLookup
     * @type Map
     */
    Object.defineProperty(GroupedCallbackEntry, '_entryLookup', {
        value: new Map()
    });

    /**
     * This is a list of GroupedCallbackEntry objects in the order they were triggered.
     * @private
     * @static
     * @readOnly
     * @property _triggeredEntries
     * @type Array
     */
    Object.defineProperty(GroupedCallbackEntry, '_triggeredEntries', {
        value: []
    });

    //Static Methods:

    /**
     * @method addGroupedCallback
     * @static
     * @param {CallbackCollection} callbackCollection
     * @param {Object} relevantContext
     * @param {Function} groupedCallback
     * @param {Boolean} triggerCallbackNow
     */
    GroupedCallbackEntry.addGroupedCallback = function (callbackCollection, relevantContext, groupedCallback, triggerCallbackNow) {
        // get (or create) the shared entry for the groupedCallback
        var entry = GroupedCallbackEntry._entryLookup.get(groupedCallback);
        if (!entry) {
            entry = new GroupedCallbackEntry(groupedCallback);
            GroupedCallbackEntry._entryLookup.set(groupedCallback, entry);
        }

        // context shouldn't be null because we use it to determine when to clean up the GroupedCallbackEntry.
        if (relevantContext === null || relevantContext === undefined)
            relevantContext = callbackCollection;

        // add this context to the list of relevant contexts
        entry.context.push(relevantContext);


        // make sure the actual function is not already added as a callback.
        callbackCollection.removeCallback(groupedCallback);

        // add the trigger function as a callback
        // The relevantContext parameter is set to null for entry.trigger so the same callback can be added multiple times to the same
        // target using different contexts without having the side effect of losing the callback when one of those contexts is disposed.
        // The entry.trigger function will be removed once all contexts are disposed.
        callbackCollection.addImmediateCallback(null, entry.trigger.bind(entry), triggerCallbackNow);
    };

    /**
     * @method removeGroupedCallback
     * @static
     * @param {CallbackCollection} callbackCollection
     * @param {Function} groupedCallback
     */
    GroupedCallbackEntry.removeGroupedCallback = function (callbackCollection, groupedCallback) {
        // remove the trigger function as a callback
        var entry = GroupedCallbackEntry._entryLookup.get(groupedCallback);
        if (entry)
            callbackCollection.removeCallback(entry.trigger);
    };

    /**
     * This function gets called once per frame and allows grouped callbacks to run.
     * @method _handleGroupedCallbacks
     * @static
     * @private
     */
    GroupedCallbackEntry._handleGroupedCallbacks = function () {
        var i;
        var entry;

        GroupedCallbackEntry._handlingGroupedCallbacks = true; {
            // Handle grouped callbacks in the order they were triggered,
            // anticipating that more may be added to the end of the list in the process.
            // This first pass does not allow grouped callbacks to call each other immediately.
            for (i = 0; i < GroupedCallbackEntry._triggeredEntries.length; i++) {
                entry = GroupedCallbackEntry._triggeredEntries[i];
                entry.handleGroupedCallback();
            }

            // after all grouped callbacks have been handled once, run those which were triggered recursively and allow them to call other grouped callbacks immediately.
            GroupedCallbackEntry._handlingRecursiveGroupedCallbacks = true; {
                // handle grouped callbacks that were triggered recursively
                for (i = 0; i < GroupedCallbackEntry._triggeredEntries.length; i++) {
                    entry = GroupedCallbackEntry._triggeredEntries[i];
                    if (entry.triggeredAgain)
                        entry.handleGroupedCallback();
                }
            }
            GroupedCallbackEntry._handlingRecursiveGroupedCallbacks = false;
        }
        GroupedCallbackEntry._handlingGroupedCallbacks = false;

        // reset for next frame
        for (i = 0; i < GroupedCallbackEntry._triggeredEntries.length; i++) {
            entry = GroupedCallbackEntry._triggeredEntries[i];
            entry.triggered = entry.triggeredAgain = false;
        }
        GroupedCallbackEntry._triggeredEntries.length = 0;

    };

    GroupedCallbackEntry.prototype = new CallbackEntry();
    GroupedCallbackEntry.prototype.constructor = GroupedCallbackEntry;

    var gcP = GroupedCallbackEntry.prototype;

    /**
     * Marks the entry to be handled later (unless already triggered this frame).
     * This also takes care of preventing recursion.
     * @method trigger
     */
    gcP.trigger = function () {
        // if handling recursive callbacks, call now
        if (GroupedCallbackEntry._handlingRecursiveGroupedCallbacks) {
            this.handleGroupedCallback();
        } else if (!this.triggered) {
            // not previously triggered
            GroupedCallbackEntry._triggeredEntries.push(this);
            this.triggered = true;
        } else if (GroupedCallbackEntry._handlingGroupedCallbacks) {
            // triggered recursively - call later
            this.triggeredAgain = true;
        }
    };


    /**
     * Checks the context(s) before calling groupedCallback
     * @method handleGroupedCallback
     */
    gcP.handleGroupedCallback = function () {
        if (!this.context)
            return;

        // first, make sure there is at least one relevant context for this callback.
        var allContexts = this.context;
        // remove the contexts that have been disposed.
        for (var i = 0; i < allContexts.length; i++)
            if (WeaveAPI.SessionManager.objectWasDisposed(allContexts[i]))
                allContexts.splice(i--, 1);
            // if there are no more relevant contexts for this callback, don't run it.
        if (allContexts.length === 0) {
            this.dispose();
            GroupedCallbackEntry._entryLookup.delete(this.callback);
            return;
        }

        // avoid immediate recursion
        if (this.recursionCount === 0) {
            this.recursionCount++;
            this.callback.apply();
            this.recursionCount--;
        }
        // avoid delayed recursion
        this.triggeredAgain = false;
    };

    weavecore.GroupedCallbackEntry = GroupedCallbackEntry;

}());

/**
 * @module weavecore
 */

// namespace
if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}


(function () {
    "use strict";

    // constructor:
    /**
     * Session manager contains core functions related to session state.
     * @class SessionManager
     * @constructor
     */
    function SessionManager() {

        //const properties - writable default to false.
        /**
         * @private
         * @readOnly
         * @property _childToParentMap
         * @type Map
         * This maps a child ILinkableObject to a Dictionary, which maps each of its registered parent ILinkableObjects to a value of true if the child should appear in the session state automatically or false if not.
         */
        Object.defineProperty(this, "_childToParentMap", {
            value: new Map()
        });

        /**
         * @private
         * @readOnly
         * @property _parentToChildMap
         * @type Map
         * This maps a parent ILinkableObject to a Dictionary, which maps each of its registered child ILinkableObjects to a value of true if the child should appear in the session state automatically or false if not.
         */
        Object.defineProperty(this, "_parentToChildMap", {
            value: new Map()
        });

        /**
         * @private
         * @readOnly
         * @property _ownerToChildMap
         * @type Map
         * This maps a parent ILinkableObject to a Dictionary, which maps each child ILinkableObject it owns to a value of true.
         */
        Object.defineProperty(this, "_ownerToChildMap", {
            value: new Map()
        });

        /**
         * This maps a child ILinkableObject to its registered owner.
         * @private
         * @readOnly
         * @property _childToOwnerMap
         * @type Map
         */
        Object.defineProperty(this, "_childToOwnerMap", {
            value: new Map()
        });

        this.debug = false;

        this.linkableObjectToCallbackCollectionMap = new Map();
        this.debugBusyTasks = false;

        /**
         * @private
         * @readOnly
         * @property _disposedObjectsMap
         * @type Map
         */
        Object.defineProperty(this, "_disposedObjectsMap", {
            value: new Map()
        });

        /**
         * @private
         * @readOnly
         * @property _treeCallbacks
         * @type CallbackCollection
         */
        Object.defineProperty(this, "_treeCallbacks", {
            value: new weavecore.CallbackCollection()
        });

        /**
         * @private
         * @readOnly
         * @property _classNameToSessionedPropertyNames
         * @type Object
         */
        Object.defineProperty(this, "_classNameToSessionedPropertyNames", {
            value: {}
        });

        /**
         * keeps track of which objects are currently being traversed
         * @private
         * @readOnly
         * @property _getSessionStateIgnoreList
         * @type Map
         */
        Object.defineProperty(this, "_getSessionStateIgnoreList", {
            value: new Map()
        });

    }

    var p = SessionManager.prototype;



    /**
     * This function tells the SessionManager that the session state of the specified child should appear in the
     * session state of the specified parent, and the child should be disposed when the parent is disposed.
     *
     * There is one other requirement for the child session state to appear in the parent session state -- the child
     * must be accessible through a public variable of the parent or through an accessor function of the parent.
     *
     * This function will add callbacks to the sessioned children that cause the parent callbacks to run.
     *
     * If a callback function is given, the callback will be added to the child and cleaned up when the parent is disposed.
     *
     * @method registerLinkableChild
     * @param {Object} linkableParent A parent ILinkableObject that the child will be registered with.
     * @param {ILinkableObject} linkableChild The child ILinkableObject to register as a child.
     * @param {Function} callback A callback with no parameters that will be added to the child that will run before the parent callbacks are triggered, or during the next ENTER_FRAME event if a grouped callback is used.
     * @param {Boolean} useGroupedCallback If this is true, addGroupedCallback() will be used instead of addImmediateCallback().
     * @return {Object} The linkableChild object that was passed to the function.
     * @example usage:    const foo = registerLinkableChild(this, someLinkableNumber, handleFooChange);
     */
    p.registerLinkableChild = function (linkableParent, linkableChild, callback, useGroupedCallback) {
        //set default values for parameters
        if (useGroupedCallback === undefined)
            useGroupedCallback = false;
        if (!(linkableParent instanceof weavecore.ILinkableObject)) {
            if (!linkableParent.sessionable) {
                console.log("registerLinkableChild(): Parent does not inherit ILinkableObject. or sessionablepropery is not true");
                return;
            }
        }

        if (!(linkableChild instanceof weavecore.ILinkableObject)) {
            if (!linkableChild.sessionable) {
                console.log("registerLinkableChild(): child does not inherit ILinkableObject. or sessionablepropery is not true");
                return;
            }
        }

        if (callback !== null && callback !== undefined) {
            var cc = this.getCallbackCollection.call(this, linkableChild);
            if (useGroupedCallback)
                cc.addGroupedCallback(linkableParent, callback);
            else
                cc.addImmediateCallback(linkableParent, callback);
        }

        // if the child doesn't have an owner yet, this parent is the owner of the child
        // and the child should be disposed when the parent is disposed.
        // registerDisposableChild() also initializes the required Dictionaries.
        this.registerDisposableChild(linkableParent, linkableChild);

        if (this._childToParentMap.get(linkableChild).get(linkableParent) === undefined) {
            // remember this child-parent relationship
            this._childToParentMap.get(linkableChild).set(linkableParent, true);
            this._parentToChildMap.get(linkableParent).set(linkableChild, true);

            // make child changes trigger parent callbacks
            var parentCC = this.getCallbackCollection(linkableParent);
            // set alwaysCallLast=true for triggering parent callbacks, so parent will be triggered after all the other child callbacks
            this.getCallbackCollection(linkableChild).addImmediateCallback(linkableParent, parentCC.triggerCallbacks.bind(parentCC, "Parent's -triggerCallback"), false, true); // parent-child relationship
        }

        this._treeCallbacks.triggerCallbacks("Session Tree: Child Registered");

        return linkableChild;
    };

    /**
     * This will register a child of a parent and cause the child to be disposed when the parent is disposed.
     * Use this function when a child object can be disposed but you do not want to link the callbacks.
     * The child will be disposed when the parent is disposed.
     *
     * @method registerDisposableChild
     * @example usage:    const foo = registerDisposableChild(this, someLinkableNumber);
     *
     * @param {Object} disposableParent A parent disposable object that the child will be registered with.
     * @param {Object} disposableChild The disposable object to register as a child of the parent.
     * @return {Object} The linkableChild object that was passed to the function.
     */
    p.registerDisposableChild = function (disposableParent, disposableChild) {
        if (this._ownerToChildMap.get(disposableParent) === undefined) {
            this._ownerToChildMap.set(disposableParent, new Map());
            this._parentToChildMap.set(disposableParent, new Map());
        }
        // if this child has no owner yet...
        if (this._childToOwnerMap.get(disposableChild) === undefined) {
            // make this first parent the owner
            this._childToOwnerMap.set(disposableChild, disposableParent);
            this._ownerToChildMap.get(disposableParent).set(disposableChild, true);
            // initialize the parent dictionary for this child
            this._childToParentMap.set(disposableChild, new Map());
        }
        return disposableChild;
    };

    /**
     * Use this function with care.  This will remove child objects from the session state of a parent and
     * stop the child from triggering the parent callbacks.
     * @method unregisterLinkableChild
     * @param {ILinkableChild} parent A parent that the specified child objects were previously registered with.
     * @param {ILinkableChild} child The child object to unregister from the parent.
     */
    p.unregisterLinkableChild = function (parent, child) {
        if (this._childToParentMap.get(child))
            this._childToParentMap.get(child).delete(parent);
        if (this._parentToChildMap.get(parent))
            this._parentToChildMap(parent).delete(child);
        this.getCallbackCollection(child).removeCallback(this.getCallbackCollection(parent).triggerCallbacks.bind(parent));

        this._treeCallbacks.triggerCallbacks("Session Tree: Child un-Registered");
    };


    /**
     * This function will add or remove child objects from the session state of a parent.  Use this function
     * with care because the child will no longer be "sessioned."  The child objects will continue to trigger the
     * callbacks of the parent object, but they will no longer be considered a part of the parent's session state.
     * If you are not careful, this will break certain functionalities that depend on the session state of the parent.
     * @method excludeLinkableChildFromSessionState
     * @param {ILinkableChild} parent A parent that the specified child objects were previously registered with.
     * @param {ILinkableChild} child The child object to remove from the session state of the parent.
     */
    p.excludeLinkableChildFromSessionState = function (parent, child) {
        if (parent === null || child === null || parent === undefined || child === undefined) {
            console.log("SessionManager.excludeLinkableChildFromSessionState(): Parameters cannot be null.");
            return;
        }
        if (this._childToParentMap.get(child) !== undefined && this._childToParentMap.get(child).get(parent))
            this._childToParentMap.get(child).set(parent, false);
        if (this._parentToChildMap.get(parent) !== undefined && this._parentToChildMap.get(parent).get(child))
            this._parentToChildMap.get(parent).set(child, false);
    };

    /**
     * @method _getRegisteredChildren
     * @private
     * This function will return all the child objects that have been registered with a parent.
     * @param {ILinkableChild} parent A parent object to get the registered children of.
     * @return {Array} An Array containing a list of linkable objects that have been registered as children of the specified parent.
     *         This list includes all children that have been registered, even those that do not appear in the session state.
     */
    p._getRegisteredChildren = function (parent) {
        var result = [];
        if (this._parentToChildMap.get(parent) !== undefined)
            for (var child in this._parentToChildMap.get(parent))
                result.push(child);
        return result;
    };

    /**
     * This function gets the owner of a linkable object.  The owner of an object is defined as its first registered parent.
     * @method getLinkableOwner
     * @param {ILinkableObject} child An ILinkableObject that was registered as a child of another ILinkableObject.
     * @return {ILinkableObject} The owner of the child object (the first parent that was registered with the child), or null if the child has no owner.
     * See {{#crossLink "SessionManager/getLinkableDescendants:method"}}{{/crossLink}}
     */
    p.getLinkableOwner = function (child) {
        return this._childToOwnerMap.get(child);
    };

    /**
     * This function will return all the descendant objects that implement ILinkableObject.
     * If the filter parameter is specified, the results will contain only those objects that extend or implement the filter class.
     * @method getLinkableDescendants
     * @param {ILinkableObject} root A root object to get the descendants of.
     * @param {Class} filter An optional Class definition which will be used to filter the results.
     * @return {Array} An Array containing a list of descendant objects.
     * See {{#crossLink "SessionManager/getLinkableOwner:method"}}{{/crossLink}}
     */
    p.getLinkableDescendants = function (root, filter) { //TODO: Port getLinkableDescendants
        //return this._childToOwnerMap.get(child);
    };
    //TODO: Port Busy task from As3

    /**
     * @method getSessionStateTree
     * @param {ILinkableObject} root The linkable object to be placed at the root node of the tree.
     * @param {String} objectName
     * @param {Object} objectTypeFilter
     * @return {WeaveTreeItem} A tree of nodes with the properties "label", "object", and "children"
     */
    p.getSessionStateTree = function (root, objectName, objectTypeFilter) {
        var treeItem = new weavecore.WeaveTreeItem();
        treeItem.label = objectName;
        treeItem.source = root;
        treeItem.children = SessionManager.prototype._getTreeItemChildren.bind(this);
        treeItem.data = objectTypeFilter;
        return treeItem;
    };

    /**
     * @method _getTreeItemChildren
     * @param {WeaveTreeItem} treeItem
     * @return {Array}
     */
    p._getTreeItemChildren = function (treeItem) {
        var object = treeItem.source;
        var objectTypeFilter = treeItem.data;
        var children = [];
        var names = [];
        var childObject;
        var subtree;
        var ignoreList = new Map();
        if (object instanceof weavecore.LinkableHashMap) {
            names = object.getNames();
            var childObjects = object.getObjects();
            for (var i = 0; i < names.length; i++) {
                childObject = childObjects[i];
                if (this._childToParentMap.get(childObject) && this._childToParentMap.get(childObject).get(object)) {
                    if (ignoreList.get(childObject) !== undefined)
                        continue;
                    ignoreList.set(childObject, true);

                    subtree = this.getSessionStateTree(childObject, names[i], objectTypeFilter);
                    if (subtree !== null && subtree !== undefined)
                        children.push(subtree);
                }
            }
        } else {
            var deprecatedLookup = null;
            //TODO: support for Linkable dynamic object
            console.log("Linkable dynamic object not yet supported - only Linkablehashmap");
        }
        if (children.length === 0)
            children = null;
        if (objectTypeFilter === null || objectTypeFilter === undefined)
            return children;
        if ((children === null || children === undefined) && !(object instanceof objectTypeFilter))
            return null;
        return children;
    };

    /**
     * Adds a grouped callback that will be triggered when the session state tree changes.
     * USE WITH CARE. The groupedCallback should not run computationally-expensive code.
     * @method addTreeCallback
     * @param {Object} relevantContext
     * @param {Function} groupedCallback
     * @param {Boolean} triggerCallbackNow
     */
    p.addTreeCallback = function (relevantContext, groupedCallback, triggerCallbackNow) {
        if (triggerCallbackNow === undefined) triggerCallbackNow = false;
        this._treeCallbacks.addGroupedCallback(relevantContext, groupedCallback, triggerCallbackNow);
    };

    /**
     * @method removeTreeCallback
     * @param {Function} groupedCallback
     */
    p.removeTreeCallback = function (groupedCallback) {
        this._treeCallbacks.removeCallback(groupedCallback);
    };

    /**
     * This function will copy the session state from one sessioned object to another.
     * If the two objects are of different types, the behavior of this function is undefined.
     * @method copySessionState
     * @param {ILinkableObject} source A sessioned object to copy the session state from.
     * @param {ILinkableObject} destination A sessioned object to copy the session state to.
     * see {{#crossLink "SessionManager/getSessionState:method"}}{{/crossLink}}
     * see {{#crossLink "SessionManager/setSessionState:method"}}{{/crossLink}}
     */
    p.copySessionState = function (source, destination) {
        var sessionState = this.getSessionState(source);
        this.setSessionState(destination, sessionState, true);
    };

    /**
     * @method _applyDiff
     * @private
     * @param {Object} base
     * @param {Object} diff
     */
    p._applyDiff = function (base, diff) {
        if (base === null || base === undefined || typeof (base) !== 'object')
            return diff;

        for (var key in diff)
            base[key] = this._applyDiff(base[key], diff[key]);

        return base;
    };

    /**
     * Sets the session state of an ILinkableObject.
     * @method setSessionState
     * @param {ILinkableObject} linkableObject An object containing sessioned properties (sessioned objects may be nested).
     * @param {Object} newState An object containing the new values for sessioned properties in the sessioned object.
     * @param {Boolean} removeMissingDynamicObjects If true, this will remove any properties from an ILinkableCompositeObject that do not appear in the session state.
     * see {{#crossLink "SessionManager/getSessionState:method"}}{{/crossLink}}
     */
    p.setSessionState = function (linkableObject, newState, removeMissingDynamicObjects) {
        if (removeMissingDynamicObjects === undefined) removeMissingDynamicObjects = true;
        if (linkableObject === null) {
            console.log("SessionManager.setSessionState(): linkableObject cannot be null.");
            return;
        }

        if (linkableObject === undefined) {
            console.log("SessionManager.setSessionState(): linkableObject cannot be undefined.");
            return;
        }

        // special cases: for Explicit and Composite Session Object
        if (linkableObject instanceof weavecore.LinkableVariable) {
            var lv = linkableObject;
            if (removeMissingDynamicObjects === false && newState && newState.constructor.name === 'Object') {
                lv.setSessionState.call(lv, this._applyDiff.call(this, Object.create(lv.getSessionState(lv)), newState));
            } else {
                lv.setSessionState.call(lv, newState);
            }
            return;
        }
        //linkableHashmap is handled, In As3 version it implements ILinkableCompositeObject
        // in jS we couldnt do that, thats why linkableObject.setSessionState is used
        if (linkableObject instanceof weavecore.ILinkableCompositeObject || linkableObject.setSessionState) {
            if (newState.constructor.name === "String")
                newState = [newState];

            if (newState !== null && !(newState instanceof Array)) {
                var array = [];
                for (var key in newState)
                    array.push(weavecore.DynamicState.create(key, null, newState[key]));
                newState = array;
            }

            linkableObject.setSessionState(newState, removeMissingDynamicObjects);
            return;
        }

        if (newState === null || newState === undefined)
            return;

        // delay callbacks before setting session state
        var objectCC = this.getCallbackCollection(linkableObject);
        objectCC.delayCallbacks();

        // cache property names if necessary
        var className = (linkableObject.constructor.name);
        if (!this._classNameToSessionedPropertyNames[className])
            this._cacheClassInfo(linkableObject, className);

        // set session state
        var foundMissingProperty = false;
        var propertyNames;

        propertyNames = this._classNameToSessionedPropertyNames[className];

        for (var i = 0; i < propertyNames.length; i++) {
            var name = propertyNames[i];
            if (!newState.hasOwnProperty(name)) {
                if (removeMissingDynamicObjects) //&& linkableObject is ILinkableObjectWithNewProperties
                    foundMissingProperty = true;
                continue;
            }

            var property = null;
            try {
                property = linkableObject[name];
            } catch (e) {
                console.log('SessionManager.setSessionState(): Unable to get property "' + name + '" of class "' + linkableObject.constructor.name + '"', e);
            }

            if (property === null)
                continue;

            this.setSessionState(property, newState[name], removeMissingDynamicObjects);
        }

        // TODO: handle properties appearing in session state that do not appear in the linkableObject
        /*if (linkableObject instanceof ILinkableObjectWithNewProperties)
				for (name in newState)
					if (!deprecatedLookup.hasOwnProperty(name))
						linkableObject.handleMissingSessionStateProperty(newState, name);*/

        // handle properties missing from absolute session state
        if (foundMissingProperty)
            propertyNames.forEach(function (name) {
                if (!newState.hasOwnProperty(name))
                    linkableObject.handleMissingSessionStateProperty(newState, name);
            });

        // resume callbacks after setting session state
        objectCC.resumeCallbacks();

    };

    /**
     * Gets the session state of an ILinkableObject.
     * @method getSessionState
     * @param {IlinkableObject} linkableObject An object containing sessioned properties (sessioned objects may be nested).
     * @return {Object} An object containing the values from the sessioned properties.
     * see {{#crossLink "SessionManager/setSessionState:method"}}{{/crossLink}}
     */
    p.getSessionState = function (linkableObject) {
        if (linkableObject === null) {
            console.log("SessionManager.getSessionState(): linkableObject cannot be null.");
            return null;
        }

        if (linkableObject === undefined) {
            console.log("SessionManager.getSessionState(): linkableObject cannot be undefined.");
            return null;
        }

        var result = null;

        // special cases (explicit session state)
        if (linkableObject instanceof weavecore.LinkableVariable) {
            result = linkableObject.getSessionState();
        }
        //linkableHashmap is handled, In As3 version it implements ILinkableCompositeObject
        // in jS we couldnt do that, thats why linkableObject.setSessionState is used
        else if (linkableObject instanceof weavecore.ILinkableCompositeObject || linkableObject.getSessionState) {
            result = linkableObject.getSessionState();
        } else {
            // implicit session state
            // first pass: get property names

            // cache property names if necessary
            var className = linkableObject.constructor.name;

            if (!this._classNameToSessionedPropertyNames[className])
                this._cacheClassInfo(linkableObject, className);

            var propertyNames = this._classNameToSessionedPropertyNames[className];
            var resultNames = [];
            var resultProperties = [];
            var property = null;
            var i;
            for (i = 0; i < propertyNames.length; i++) {
                var name = propertyNames[i];

                try {
                    property = null; // must set this to null first because accessing the property may fail
                    property = linkableObject[name];
                } catch (e) {
                    console.log('Unable to get property "' + name + '" of class "' + linkableObject.constructor.name + '"');
                }

                // first pass: set result[name] to the ILinkableObject
                if (property !== null && !this._getSessionStateIgnoreList[property]) {
                    // skip this property if it should not appear in the session state under the parent.
                    if (this._childToParentMap[property] === undefined || !this._childToParentMap[property][linkableObject])
                        continue;
                    // avoid infinite recursion in implicit session states
                    this._getSessionStateIgnoreList[property] = true;
                    resultNames.push(name);
                    resultProperties.push(property);
                } else {
                    if (debug) {
                        if (property !== null)
                            console.log("ignoring duplicate object:", name, property);
                    }


                }

            }

            // special case if there are no child objects -- return null
            if (resultNames.length > 0) {
                // second pass: get values from property names
                result = {};
                for (i = 0; i < resultNames.length; i++) {
                    var value = this.getSessionState(resultProperties[i]);
                    property = resultProperties[i];
                    // do not include objects that have a null implicit session state (no child objects)
                    if (value === null && !(property instanceof weavecore.LinkableVariable) && !(property instanceof weavecore.ILinkableCompositeObject) && !(property.getSessionState))
                        continue;
                    result[resultNames[i]] = value;

                    if (debug)
                        console.log("getState", sessionedObject.constructor.name, resultNames[i], result[resultNames[i]]);
                }
            }
        }

        this._getSessionStateIgnoreList[linkableObject] = undefined;

        return result;
    };


    /**
     * @method _cacheClassInfo
     * @private
     * @param {ILinkableObject} linkableObject
     * @param {String} className
     */
    p._cacheClassInfo = function (linkableObject, className) {
        // linkable property names
        var propertyNames = Object.getOwnPropertyNames(linkableObject);
        var sessionedPublicProperties = propertyNames.filter(function (propName) {
            if (propName.charAt(0) === '_')
                return false; //Private properties are ignored
            else
                return linkableObject[propName] instanceof weavecore.ILinkableObject;
        });

        this._classNameToSessionedPropertyNames[className] = sessionedPublicProperties.sort();
    };

    /**
     * This function gets a list of sessioned property names so accessor functions for non-sessioned properties do not have to be called.
     * @method getLinkablePropertyNames
     * @param {ILinkableObject} linkableObject An object containing sessioned properties.
     * @param {Boolean} filtered If set to true, filters out deprecated, null, and excluded properties.
     * @return {Array} An Array containing the names of the sessioned properties of that object class.
     */
    p.getLinkablePropertyNames = function (linkableObject, filtered) {
        if (filtered === undefined) //default parameter value
            filtered = false;

        if (linkableObject === null) {
            console.log("SessionManager.getLinkablePropertyNames(): linkableObject cannot be null.");
            return [];
        }

        if (linkableObject === undefined) {
            console.log("SessionManager.getLinkablePropertyNames(): linkableObject cannot be undefined.");
            return [];
        }

        var className = linkableObject.constructor.name;
        var propertyNames = this._classNameToSessionedPropertyNames[className];
        if (propertyNames === null || propertyNames === undefined) {
            this._cacheClassInfo(linkableObject, className);
            propertyNames = this._classNameToSessionedPropertyNames[className];
        }

        if (filtered) {
            var filteredPropNames = propertyNames.filter(function (propName) {
                var property = linkableObject[propName];
                if (property === null || property === undefined)
                    return false;
                if (this._childToParentMap[property] === undefined || !this._childToParentMap[property][linkableObject])
                    return false;

                return true;
            });
            return filteredPropNames;
        }
        return propertyNames;
    };

    /**
     * This function gets the CallbackCollection associated with an ILinkableObject.
     * If there is no CallbackCollection defined for the object, one will be created.
     * This CallbackCollection is used for reporting changes in the session state
     * @method getCallbackCollection
     * @param {ILinkableObject} linkableObject An ILinkableObject to get the associated ICallbackCollection for.
     * @return {CallbackCollection} The CallbackCollection associated with the given object.
     */
    p.getCallbackCollection = function (linkableObject) {
        if (linkableObject === null || linkableObject === undefined)
            return null;
        if (linkableObject instanceof weavecore.CallbackCollection)
            return linkableObject;

        var objectCC = this.linkableObjectToCallbackCollectionMap.get(linkableObject);
        if (objectCC === null || objectCC === undefined) {
            objectCC = this.registerDisposableChild(linkableObject, new weavecore.CallbackCollection());
            if (weavecore.CallbackCollection.debug)
                objectCC._linkableObject = linkableObject;
            this.linkableObjectToCallbackCollectionMap.set(linkableObject, objectCC);
        }

        return objectCC;
    };


    /**
     * This function checks if an object has been disposed by the SessionManager.
     * @method objectWasDisposed
     * @param {Object} object An object to check.
     * @return {Boolean} A value of true if disposeObject() was called for the specified object.
     * see {{#crossLink "SessionManager/disposeObject:method"}}{{/crossLink}}
     */
    p.objectWasDisposed = function (object) {
        if (object === undefined)
            return true; // added by sanjay:
        if (object === null) //null means :Object parameter is null i.e Object has no parameters
            return false;
        if (object instanceof weavecore.ILinkableObject || object.sessionable) {
            var cc = this.getCallbackCollection(object);
            if (cc)
                return cc.wasDisposed;
        }
        return this._disposedObjectsMap.get(object) !== undefined;
    };


    /**
     * This function should be called when an ILinkableObject  is no longer needed.
     * @method disposeObject
     * @param {Object} object An ILinkableObject  to clean up.
     * see {{#crossLink "SessionManager/objectWasDisposed:method"}}{{/crossLink}}
     */
    p.disposeObject = function (object) {
        if (object !== null && object !== undefined && !this._disposedObjectsMap.get(object)) {
            this._disposedObjectsMap.set(object, true);

            // TODO: clean up pointers to busy tasks
            //disposeBusyTaskPointers(object as ILinkableObject);

            try {
                // if the object implements IDisposableObject, call its dispose() function now
                //if (object instanceof IDisposableObject)
                //	{
                //	object.dispose();
                //	}
                if (object.dispose && object.dispose.constructor === Function) {
                    // call dispose() anyway if it exists, because it is common to forget to implement IDisposableObject.
                    object.dispose();
                }
            } catch (e) {
                console.log(e);
            }

            var linkableObject = object;
            if (linkableObject) {
                // dispose the callback collection corresponding to the object.
                // this removes all callbacks, including the one that triggers parent callbacks.
                var objectCC = this.getCallbackCollection(linkableObject);
                if (objectCC !== linkableObject)
                    this.disposeObject(objectCC);
            }

            // unregister from parents
            if (this._childToParentMap.get(object) !== undefined) {
                // remove the parent-to-child mappings
                for (var parent in this._childToParentMap.get(object))
                    if (this._parentToChildMap(parent) !== undefined)
                        this._parentToChildMap.get(parent).delete(object);
                    // remove child-to-parent mapping
                this._childToParentMap.delete(object);
            }

            // unregister from owner
            var owner = this._childToOwnerMap.get(object);
            if (owner !== null || owner !== undefined) {
                if (this._ownerToChildMap.get(owner) !== undefined)
                    this._ownerToChildMap.get(owner).delete(object);
                this._childToOwnerMap.delete(object);
            }

            // if the object is an ILinkableVariable, unlink it from all bindable properties that were previously linked
            //if (linkableObject instanceof LinkableVariable)
            //for (var bindableParent:* in _watcherMap[linkableObject])
            //for (var bindablePropertyName:String in _watcherMap[linkableObject][bindableParent])
            //unlinkBindableProperty(linkableObject as ILinkableVariable, bindableParent, bindablePropertyName);

            // unlink this object from all other linkable objects
            //for (var otherObject in linkFunctionCache.dictionary[linkableObject])
            //unlinkSessionState(linkableObject, otherObject as ILinkableObject);

            // dispose all registered children that this object owns
            var children = this._ownerToChildMap.get(object);
            if (children !== null && children !== undefined) {
                // clear the pointers to the child dictionaries for this object
                this._ownerToChildMap.delete(object);
                this._parentToChildMap.delete(object);
                // dispose the children this object owned
                for (var child in children)
                    this.disposeObject(child);
            }

            this._treeCallbacks.triggerCallbacks("Session Tree: Object Disposed");
        }
    };


    /**
     * This function computes the diff of two session states.
     * @method computeDiff
     * @param {Object} oldState The source session state.
     * @param {Object} newState The destination session state.
     * @return {Object} A patch that generates the destination session state when applied to the source session state, or undefined if the two states are equivalent.
     * see {{#crossLink "SessionManager/combineDiff:method"}}{{/crossLink}}
     */
    p.computeDiff = function (oldState, newState) {
        var type = typeof (oldState); // the type of null is 'object'
        var diffValue;

        // special case if types differ
        if (typeof (newState) !== type)
            return newState;


        if (type === 'number') {
            if (isNaN(oldState) && isNaN(newState))
                return undefined; // no diff

            if (oldState !== newState)
                return newState;

            return undefined; // no diff
        } else if (oldState === null || oldState === undefined || newState === null || newState === undefined || type !== 'object') // other primitive value
        {
            if (oldState !== newState) // no type-casting
                return newState;

            return undefined; // no diff
        } else if (oldState.constructor === Array && newState.constructor === Array) {
            // If neither is a dynamic state array, don't compare them as such.
            if (!weavecore.DynamicState.isDynamicStateArray(oldState) && !weavecore.DynamicState.isDynamicStateArray(newState)) {
                if (weavecore.StandardLib.compare(oldState, newState) === 0)
                    return undefined; // no diff
                return newState;
            }

            // create an array of new DynamicState objects for all new names followed by missing old names
            var i;
            var typedState;
            var changeDetected = false;

            // create oldLookup
            var oldLookup = {};
            var objectName;
            var className;
            var sessionState;
            for (i = 0; i < oldState.length; i++) {
                // assume everthing is typed session state
                //note: there is no error checking here for typedState
                typedState = oldState[i];
                objectName = typedState[weavecore.DynamicState.OBJECT_NAME];
                // use '' instead of null to avoid "null"
                oldLookup[objectName || ''] = typedState;
            }
            if (oldState.length !== newState.length)
                changeDetected = true;

            // create new Array with new DynamicState objects
            var result = [];
            for (i = 0; i < newState.length; i++) {
                // assume everthing is typed session state
                //note: there is no error checking here for typedState
                typedState = newState[i];
                objectName = typedState[weavecore.DynamicState.OBJECT_NAME];
                className = typedState[weavecore.DynamicState.CLASS_NAME];
                sessionState = typedState[weavecore.DynamicState.SESSION_STATE];
                var oldTypedState = oldLookup[objectName || ''];
                delete oldLookup[objectName || '']; // remove it from the lookup because it's already been handled

                // If the object specified in newState does not exist in oldState, we don't need to do anything further.
                // If the class is the same as before, then we can save a diff instead of the entire session state.
                // If the class changed, we can't save only a diff -- we need to keep the entire session state.
                // Replace the sessionState in the new DynamicState object with the diff.
                if (oldTypedState !== undefined && oldTypedState[weavecore.DynamicState.CLASS_NAME] === className) {
                    className = null; // no change
                    diffValue = this.computeDiff(oldTypedState[weavecore.DynamicState.SESSION_STATE], sessionState);
                    if (diffValue === undefined) {
                        // Since the class name is the same and the session state is the same,
                        // we only need to specify that this name is still present.
                        result.push(objectName);

                        if (!changeDetected && oldState[i][weavecore.DynamicState.OBJECT_NAME] != objectName)
                            changeDetected = true;

                        continue;
                    }
                    sessionState = diffValue;
                }

                // save in new array and remove from lookup
                result.push(weavecore.DynamicState.create(objectName || null, className, sessionState)); // convert empty string to null
                changeDetected = true;
            }

            // Anything remaining in the lookup does not appear in newState.
            // Add DynamicState entries with an invalid className ("delete") to convey that each of these objects should be removed.
            for (objectName in oldLookup) {
                result.push(weavecore.DynamicState.create(objectName || null, SessionManager.DIFF_DELETE)); // convert empty string to null
                changeDetected = true;
            }

            if (changeDetected)
                return result;

            return undefined; // no diff
        } else // nested object
        {
            var diff; // start with no diff

            // find old properties that changed value
            for (var oldName in oldState) {
                diffValue = this.computeDiff(oldState[oldName], newState[oldName]);
                if (diffValue !== undefined) {
                    if (!diff)
                        diff = {};
                    diff[oldName] = diffValue;
                }
            }

            // find new properties
            for (var newName in newState) {
                if (oldState[newName] === undefined) {
                    if (!diff)
                        diff = {};
                    diff[newName] = newState[newName]; // TODO: same object pointer.. potential problem?
                }
            }

            return diff;
        }
    };

    /**
     * This modifies an existing diff to include an additional diff.
     * @method combineDiff
     * @param {Object} baseDiff The base diff which will be modified to include an additional diff.
     * @param {Object} diffToAdd The diff to add to the base diff.  This diff will not be modified.
     * @return {Object} The modified baseDiff, or a new diff object if baseDiff is a primitive value.
     * see {{#crossLink "SessionManager/computeDiff:method"}}{{/crossLink}}
     */
    p.combineDiff = function (baseDiff, diffToAdd) {
        var baseType = typeof (baseDiff); // the type of null is 'object'
        var diffType = typeof (diffToAdd);

        // special cases
        if (baseDiff === null || baseDiff === undefined || diffToAdd === null || diffToAdd === undefined || baseType !== diffType || baseType !== 'object') {
            if (diffType === 'object') // not a primitive, so make a copy
                baseDiff = Object.getPrototypeOf(Object.create(diffToAdd)).slice(0); //TODO: find better solution for array copy(currently Shallow copy)
            else
                baseDiff = diffToAdd;
        } else if (Array.isArray(baseDiff) && Array.isArray(diffToAdd)) {
            var i;

            // If either of the arrays look like DynamicState arrays, treat as such
            if (weavecore.DynamicState.isDynamicStateArray(baseDiff) || weavecore.DynamicState.isDynamicStateArray(diffToAdd)) {
                var typedState;
                var objectName;

                // create lookup: objectName -> old diff entry
                // temporarily turn baseDiff into an Array of object names
                var baseLookup = {};
                for (i = 0; i < baseDiff.length; i++) {
                    typedState = baseDiff[i];
                    // note: no error checking for typedState
                    if (typeof typedState === 'string' || typedState instanceof String || typedState === null || typedState === undefined)
                        objectName = typedState;
                    else
                        objectName = typedState[weavecore.DynamicState.OBJECT_NAME];
                    baseLookup[objectName] = typedState;
                    // temporarily turn baseDiff into an Array of object names
                    baseDiff[i] = objectName;
                }
                // apply each typedState diff appearing in diffToAdd
                for (i = 0; i < diffToAdd.length; i++) {
                    typedState = diffToAdd[i];
                    // note: no error checking for typedState
                    if (typeof typedState === 'string' || typedState instanceof String || typedState === null || typedState === undefined)
                        objectName = typedState;
                    else
                        objectName = typedState[weavecore.DynamicState.OBJECT_NAME];

                    // adjust names list so this name appears at the end
                    if (baseLookup.hasOwnProperty(objectName)) {
                        for (var j = baseDiff.indexOf(objectName); j < baseDiff.length - 1; j++)
                            baseDiff[j] = baseDiff[j + 1];
                        baseDiff[baseDiff.length - 1] = objectName;
                    } else {
                        baseDiff.push(objectName);
                    }

                    // apply diff
                    var oldTypedState = baseLookup[objectName];
                    if (typeof oldTypedState === 'string' || oldTypedState instanceof String || oldTypedState === null || oldTypedState === undefined) {
                        if (typeof typedState === 'string' || typedState instanceof String || typedState === null || typedState === undefined)
                            baseLookup[objectName] = typedState; // avoid unnecessary function call overhead
                        else
                            baseLookup[objectName] = Object.getPrototypeOf(Object.create(typedState)).slice(0); //TODO: Temp solution for Array Copy
                    } else if (!(typeof typedState === 'string' || typedState instanceof String || typedState === null || typedState === undefined)) // update dynamic state
                    {
                        var className = typedState[weavecore.DynamicState.CLASS_NAME];
                        // if new className is different and not null, start with a fresh typedState diff
                        if (className && className != oldTypedState[weavecore.DynamicState.CLASS_NAME]) {
                            baseLookup[objectName] = Object.getPrototypeOf(Object.create(typedState)).slice(0); //TODO: Temp solution for Array Copy
                        } else // className hasn't changed, so combine the diffs
                        {
                            oldTypedState[weavecore.DynamicState.SESSION_STATE] = this.combineDiff(oldTypedState[weavecore.DynamicState.SESSION_STATE], typedState[weavecore.DynamicState.SESSION_STATE]);
                        }
                    }
                }
                // change baseDiff back from names to typed states
                for (i = 0; i < baseDiff.length; i++)
                    baseDiff[i] = baseLookup[baseDiff[i]];
            } else // not typed session state
            {
                // overwrite old Array with new Array's values
                i = baseDiff.length = diffToAdd.length;
                while (i--) {
                    var value = diffToAdd[i];
                    if (value === null || value === undefined || typeof value !== 'object')
                        baseDiff[i] = value; // avoid function call overhead
                    else
                        baseDiff[i] = this.combineDiff(baseDiff[i], value);
                }
            }
        } else // nested object
        {
            for (var newName in diffToAdd)
                baseDiff[newName] = this.combineDiff(baseDiff[newName], diffToAdd[newName]);
        }

        return baseDiff;
    };

    /**
     * @public
     * @property  DIFF_DELETE
     * @static
     * @readOnly
     * @type String
     * @default "delete"
     */
    Object.defineProperty(SessionManager, 'DIFF_DELETE', {
        value: "delete"
    });

    weavecore.SessionManager = SessionManager;

}());
/*
    Weave (Web-based Analysis and Visualization Environment)
    Copyright (C) 2008-2011 University of Massachusetts Lowell

    This file is a part of Weave.

    Weave is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License, Version 3,
    as published by the Free Software Foundation.

    Weave is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Weave.  If not, see <http://www.gnu.org/licenses/>.
*/


if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

/**
 * Facilitates the creation of dynamic trees.
 */
(function () {


    //----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----

    /**
     * Constructs a new WeaveTreeItem.
     * @param params An Object containing property values to set on the WeaveTreeItem.
     *               If params is a String, both <code>label</code> and <code>data</code> will be set to that String.
     */

    function WeaveTreeItem(params) {
        //set default values
        if (params === undefined) params = null;
        /**
         * Set this to change the constructor used for initializing child items.
         * This variable is intentionally uninitialized to avoid overwriting the value set by an extending class in its constructor.
         */
        this.childItemClass; // IMPORTANT - no initial value
        this._recursion = {}; // recursionName -> Boolean
        this._label = "";
        this._children = null;
        this._source = null;
        /**
         * Cached values that get invalidated when the source triggers callbacks.
         */
        this._cache = {};

        /**
         * Cached values of getCallbackCollection(source).triggerCounter.
         */
        this._counter = {};


        //----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----

        /**
         * This can be set to either a String or a Function.
         * This property is checked by Flex's default data descriptor.
         * If this property is not set, the <code>data</code> property will be used as the label.
         */
        Object.defineProperty(this, 'label', {
            get: function () {
                const id = 'label';
                if (this.isCached(id))
                    return this._cache[id];

                var str = this.getString(this._label, id);
                if (!str && this.data !== null && this.data !== undefined)
                    str = String(this.data);
                return this.cache(id, str);
            },
            set: function (value) {
                this._counter['label'] = undefined;
                this._label = value;
            }
        });




        Object.defineProperty(this, 'children', {
            /**
             * Gets a filtered copy of the child menu items.
             * When this property is accessed, refresh() will be called except if refresh() is already being called.
             * This property is checked by Flex's default data descriptor.
             */
            get: function () {
                const id = 'children';
                if (this.isCached(id))
                    return this._cache[id];

                var items = this.getObject(this._children, id);
                if (!items)
                    return this.cache(id, null);

                var result = items.map(WeaveTreeItem._mapItems.bind(this), this.childItemClass).filter(WeaveTreeItem._filterItems.bind(this));
                return this.cache(id, result);
            },
            /**
             * This can be set to either an Array or a Function that returns an Array.
             * The function can be like function():void or function(item:WeaveTreeItem):void.
             * The Array can contain either WeaveTreeItems or Objects, each of which will be passed to the WeaveTreeItem constructor.
             */
            set: function (value) {
                this._counter['children'] = undefined;
                this._children = value;
            }
        });


        /**
         * A pointer to the ILinkableObject that created this node.
         * This is used to determine when to invalidate cached values.
         */
        Object.defineProperty(this, 'source', {
            get: function () {
                if (this._source && WeaveAPI.SessionManager.objectWasDisposed(this._source)) {
                    this.source = null;
                }
                return this._source;
            },
            set: function (value) {
                if (this._source != value)
                    this._counter = {};
                this._source = value;
            }
        });

        /**
         * This can be any data associated with this tree item.
         */
        this.data = null;

        if (typeof (params) === 'string') {
            this.label = params;
            this.data = params;
        } else
            for (var key in params)
                this[key] = params[key];
    }






    //----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----
    var p = WeaveTreeItem.prototype;
    /**
     * Computes a Boolean value from various structures
     * @param param Either a Boolean, and Object like {not: param}, a Function, an ILinkableVariable, or an Array of those objects.
     * @param recursionName A name used to keep track of recursion.
     * @return A Boolean value derived from the param, or the param itself if called recursively.
     */
    p.getBoolean = function (param, recursionName) {
        if (!this._recursion[recursionName]) {
            try {
                this._recursion[recursionName] = true;

                if (this.isSimpleObject(param, 'not'))
                    param = !this.getBoolean(param['not'], "not_" + recursionName);
                if (this.isSimpleObject(param, 'or'))
                    param = this.getBoolean(param['or'], "or_" + recursionName);
                if (typeof (param) === "function")
                    param = this.evalFunction(param);
                if (param instanceof weavecore.LinkableVariable)
                    param = param.getSessionState();
                if (param instanceof Array) {
                    var breakValue = recursionName.indexOf("or_") === 0;
                    for (var param in param) {
                        param = this.getBoolean(param, "item_" + recursionName);
                        if (param ? breakValue : !breakValue)
                            break;
                    }
                }
                param = param ? true : false;
            } finally {
                this._recursion[recursionName] = false;
            }
        }
        return param;
    };

    /**
     * Checks if an object has a single specified property.
     */
    p.isSimpleObject = function (object, singlePropertyName) {
        if (!(object instanceof Object) || object.constructor !== Object)
            return false;

        var found = false;
        for (var key in object) {
            if (found)
                return false; // two or more properties

            if (key !== singlePropertyName)
                return false; // not the desired property

            found = true; // found the desired property
        }
        return found;
    };

    /**
     * Gets a String value from a String or Function.
     * @param param Either a String or a Function.
     * @param recursionName A name used to keep track of recursion.
     * @return A String value derived from the param, or the param itself if called recursively.
     */
    p.getString = function (param, recursionName) {
        if (!this._recursion[recursionName]) {
            try {
                this._recursion[recursionName] = true;

                if (typeof (param) === "function")
                    param = this.evalFunction(param);
                else
                    param = param || '';
            } finally {
                this._recursion[recursionName] = false;
            }
        }
        return param;
    };

    /**
     * Evaluates a function to get an Object or just returns the non-Function Object passed in.
     * @param param Either an Object or a Function.
     * @param recursionName A name used to keep track of recursion.
     * @return An Object derived from the param, or the param itself if called recursively.
     */
    p.getObject = function (param, recursionName) {
        if (!this._recursion[recursionName]) {
            try {
                this._recursion[recursionName] = true;

                if (typeof (param) === "function")
                    param = this.evalFunction(param);
            } finally {
                this._recursion[recursionName] = false;
            }
        }
        return param;
    };

    /**
     * First tries calling a function with no parameters.
     * If an ArgumentError is thrown, the function will called again, passing this WeaveTreeItem as the first parameter.
     */
    p.evalFunction = function (func) {
        try {
            // first try calling the function with no parameters
            return func.call(this);
        } catch (e) {
            console.log(e);
            /*if (!(e is ArgumentError))
				{
					if (e is Error)
						trace((e as Error).getStackTrace());
					throw e;
				}*/
        }

        // on ArgumentError, pass in this WeaveTreeItem as the first parameter
        return func.call(this, this);
    };

    //----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----//----

    /**
     * Checks if cached value is valid.
     * Always returns false if the source property is not set.
     * @param id A string identifying a property.
     * @return true if the property value has been cached.
     */
    p.isCached = function (id) {
        if (this._source && WeaveAPI.SessionManager.objectWasDisposed(this._source))
            source = null;
        return this._source && this._counter[id] === WeaveAPI.SessionManager.getCallbackCollection(this._source).triggerCounter;
    };

    /**
     * Retrieves or updates a cached value for a property.
     * Does not cache the value if the source property is not set.
     * @param id A string identifying a property.
     * @param newValue Optional new value to cache for the property.
     * @return The new or existing value for the property.
     */
    p.cache = function (id, newValue) {
        if (arguments.length === 1)
            return this._cache[id];

        if (this._source && WeaveAPI.SessionManager.objectWasDisposed(this._source))
            source = null;
        if (this._source) {
            this._counter[id] = WeaveAPI.SessionManager.getCallbackCollection(this._source).triggerCounter;
            this._cache[id] = newValue;
        }
        return newValue;
    };


    /**
     * Initializes an Array of WeaveTreeItems using an Array of objects to pass to the constructor.
     * Any Arrays passed in will be flattened.
     * @param WeaveTreeItem_implementation The implementation of WeaveTreeItem to use.
     * @param items Item descriptors.
     */
    WeaveTreeItem.createItems = function (WeaveTreeItem_implementation, items) {
        // flatten
        var n = 0;
        while (n !== items.length) {
            n = items.length;
            items = [].concat.apply(null, items);
        }

        return items.map(_mapItems, WeaveTreeItem_implementation).filter(_filterItems);
    };

    /**
     * Used for mapping an Array of params objects to an Array of WeaveTreeItem objects.
     * The "this" argument is used to specify a particular WeaveTreeItem implementation.
     */
    WeaveTreeItem._mapItems = function (item, i, a) {
        // If the item is a Class definition, create an instance of that Class.
        if (typeof (item) === 'function')
            return new item();

        // If the item is a String or an Object, we can pass it to the constructor.
        if (typeof (item) === 'string' || (item !== null && item !== undefined && item.constructor.name === "Object")) {
            var ItemClass = WeaveTreeItem;
            return new ItemClass(item);
        }

        // If the item is any other type, return the original item.
        return item;
    };

    /**
     * Filters out null items.
     */
    WeaveTreeItem._filterItems = function (item, i, a) {
        return item !== null || item !== undefined;
    };



    weavecore.WeaveTreeItem = WeaveTreeItem;

}());

/*
    Weave (Web-based Analysis and Visualization Environment)
    Copyright (C) 2008-2011 University of Massachusetts Lowell

    This file is a part of Weave.

    Weave is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License, Version 3,
    as published by the Free Software Foundation.

    Weave is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Weave.  If not, see <http://www.gnu.org/licenses/>.
*/

if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

/**
 * This is a wrapper for a 2-dimensional Dictionary.
 *
 * @author adufilie
 * @author sanjay1909
 */

(function () {
    function Dictionary2D() {
        this.dictionary = new Map();
    }

    var p = Dictionary2D.prototype;

    /**
     *
     * @param key1 The first dictionary key.
     * @param key2 The second dictionary key.
     * @return The value in the dictionary.
     */
    p.get = function (key1, key2) {
        var d2 = this.dictionary.get(key1);
        return d2 ? d2.get(key2) : undefined;
    };

    /**
     * This will add or replace an entry in the dictionary.
     * @param key1 The first dictionary key.
     * @param key2 The second dictionary key.
     * @param value The value to put into the dictionary.
     */
    p.set = function (key1, key2, value) {
        var d2 = this.dictionary.get(key1);
        if (d2 === null || d2 === undefined)
            d2 = new Map();
        this.dictionary.set(key1, d2);
        d2.set(key2, value);
    };

    /**
     * This removes all values associated with the given primary key.
     * @param key1 The first dictionary key.
     */
    p.removeAllPrimary = function (key1) {
        this.dictionary.delete(key1);
    };

    /**
     * This removes all values associated with the given secondary key.
     * @param key2 The second dictionary key.
     */
    p.removeAllSecondary = function (key2) {
        for (var key1 of this.dictionary.keys()) {
            this.dictionary.get(key1).delete(key2);
        }

    };

    /**
     * This removes a value associated with the given primary and secondary keys.
     * @param key1 The first dictionary key.
     * @param key2 The second dictionary key.
     * @return The value that was in the dictionary.
     */
    p.remove = function (key1, key2) {
        var value;
        var d2 = this.dictionary.get(key1);
        if (d2) {
            value = d2.get(key2);
            d2.delete(key2);
        }

        // if entries remain in d2, keep it
        for (var v2 of d2.values())
            return value;

        // otherwise, remove it
        this.dictionary.delete(key1);

        return value;
    };

    weavecore.Dictionary2D = Dictionary2D;
}());

if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}
/**
 * LinkableVariable allows callbacks to be added that will be called when the value changes.
 * A LinkableVariable has an optional type restriction on the values it holds.
 *
 * @author adufilie
 * @author sanjay1909
 */

(function () {

    /**
     * temporary solution to save the namespace for this class/prototype
     * @static
     * @public
     * @property NS
     * @default weavecore
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableVariable, 'NS', {
        value: 'weavecore'
    });

    /**
     * TO-DO:temporary solution to save the CLASS_NAME constructor.name works for window object , but modular based won't work
     * @static
     * @public
     * @property CLASS_NAME
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableVariable, 'CLASS_NAME', {
        value: 'LinkableVariable'
    });

    /**
     * If a defaultValue is specified, callbacks will be triggered in a later frame unless they have already been triggered before then.
     * This behavior is desirable because it allows the initial value to be handled by the same callbacks that handles new values.
     * @param sessionStateType The type of values accepted for this sessioned property.
     * @param verifier A function that returns true or false to verify that a value is accepted as a session state or not.  The function signature should be  function(value:*):Boolean.
     * @param defaultValue The default value for the session state.
     * @param defaultValueTriggersCallbacks Set this to false if you do not want the callbacks to be triggered one frame later after setting the default value.
     */

    function LinkableVariable(sessionStateType, verifier, defaultValue, defaultValueTriggersCallbacks) {
        if (sessionStateType === undefined) sessionStateType = null;
        if (verifier === undefined) verifier = null;
        if (defaultValueTriggersCallbacks === undefined) defaultValueTriggersCallbacks = true;

        weavecore.CallbackCollection.call(this);

        /**
         * This function is used to prevent the session state from having unwanted values.
         * Function signature should be  function(value:*):Boolean
         * @private
         * @property _verifier
         * @type function
         */
        this._verifier = verifier;

        /**
         * This is true if the session state has been set at least once.
         */
        this._sessionStateWasSet = false;

        /**
         * This is true if the _sessionStateType is a primitive type.
         */
        this._primitiveType = false;

        /**
         * Type restriction passed in to the constructor.
         */
        this._sessionStateType = null;

        /**
         * Cannot be modified externally because it is not returned by getSessionState()
         */
        this._sessionStateInternal = undefined;

        /**
         * Available externally via getSessionState()
         */
        this._sessionStateExternal = undefined;

        this._locked = false;

        Object.defineProperty(this, 'locked', {
            get: function () {
                return this._locked;
            }
        });

        if (sessionStateType !== Object) {
            this._sessionStateType = sessionStateType;
            this._primitiveType = this._sessionStateType === "string" || this._sessionStateType === "number" || this._sessionStateType === "boolean";
        }
        if (defaultValue !== undefined) {
            this.setSessionState(defaultValue);

            // If callbacks were triggered, make sure callbacks are triggered again one frame later when
            // it is possible for other classes to have a pointer to this object and retrieve the value.
            if (defaultValueTriggersCallbacks && this._triggerCounter > weavecore.CallbackCollection.DEFAULT_TRIGGER_COUNT)
                weavecore.StageUtils.callLater(this, _defaultValueTrigger.bind(this));
        }

        /**
         * temporary solution to save the namespace for this class/prototype
         * @public
         * @property ns
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'ns', {
            value: 'weavecore'
        });
    }

    function _defaultValueTrigger() {
        // unless callbacks were triggered again since the default value was set, trigger callbacks now
        if (!this._wasDisposed && this._triggerCounter === weavecore.CallbackCollection.DEFAULT_TRIGGER_COUNT + 1)
            this.triggerCallbacks();

    }

    /**
     * This function will verify if a given value is a valid session state for this linkable variable.
     * @param value The value to verify.
     * @return A value of true if the value is accepted by this linkable variable.
     */
    function verifyValue(value) {
        return this._verifier === null || this._verifier === undefined || this._verifier(value);
    }

    LinkableVariable.prototype = new weavecore.CallbackCollection();
    LinkableVariable.prototype.constructor = LinkableVariable;

    var p = LinkableVariable.prototype;

    /**
     * The type restriction passed in to the constructor.
     */
    p.getSessionStateType = function () {
        return this._sessionStateType;
    };

    p.getSessionState = function () {
        return this._sessionStateExternal;
    };

    p.setSessionState = function (value) {
        if (this._locked)
            return;

        // cast value now in case it is not the appropriate type
        if (this._sessionStateType !== null && this._sessionStateType !== undefined)
            value = value;

        // stop if verifier says it's not an accepted value
        if (this._verifier !== null && this._verifier !== undefined && !this._verifier(value))
            return;

        var wasCopied = false;
        var type = null;
        if (value !== null && value !== undefined) {
            type = typeof (value);

            if (type === 'object' && value.constructor !== Object && value.constructor !== Array) {
                // convert to dynamic Object prior to sessionStateEquals comparison
                value = Object.create(value);
                wasCopied = true;
            }
        }

        // If this is the first time we are calling setSessionState(), including
        // from the constructor, don't bother checking sessionStateEquals().
        // Otherwise, stop if the value did not change.
        if (this._sessionStateWasSet && this.sessionStateEquals(value))
            return;

        // If the value is a dynamic object, save a copy because we don't want
        // two LinkableVariables to share the same object as their session state.
        if (type === 'object') {
            if (!wasCopied) {
                if (value.constructor === Array) //TODO:Temp solution for array copy - its a shallow copy now
                    value = Object.getPrototypeOf(Object.create(value)).slice(0);
                else
                    value = Object.create(value);
            }


            // save external copy, accessible via getSessionState()
            this._sessionStateExternal = value;

            // save internal copy
            if (value.constructor === Array) // TODO:Temp solution for array copy - its a shallow copy now
                this._sessionStateInternal = Object.getPrototypeOf(Object.create(value)).slice(0);
            else
                this._sessionStateInternal = Object.create(value);

        } else {
            // save primitive value
            this._sessionStateExternal = this._sessionStateInternal = value;
        }

        // remember that we have set the session state at least once.
        this._sessionStateWasSet = true;

        this.triggerCallbacks();
    };

    /**
     * This function is used in setSessionState() to determine if the value has changed or not.
     * object that prototype this object may override this function.
     */
    p.sessionStateEquals = function (otherSessionState) {
        if (this._primitiveType)
            return this._sessionStateInternal === otherSessionState;

        return weavecore.StandardLib.compare(this._sessionStateInternal, otherSessionState) === 0;
    };


    /**
     * This function may be called to detect change to a non-primitive session state in case it has been modified externally.
     */
    p.detectChanges = function () {
        if (!this.sessionStateEquals(this._sessionStateExternal))
            this.triggerCallbacks();
    };

    p.lock = function () {
        this._locked = true;
    };





    p.dispose = function () {
        weavecore.CallbackCollection.prototype.dispose.call(this);
        this.setSessionState(null);
    };

    weavecore.LinkableVariable = LinkableVariable;

}());

if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

/**
 * This is a LinkableVariable which limits its session state to Number values.
 * @author adufilie
 * @author sanjay1909
 */
(function () {
    /**
     * temporary solution to save the namespace for this class/prototype
     * @static
     * @public
     * @property NS
     * @default weavecore
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableNumber, 'NS', {
        value: 'weavecore'
    });

    /**
     * TO-DO:temporary solution to save the CLASS_NAME constructor.name works for window object , but modular based won't work
     * @static
     * @public
     * @property CLASS_NAME
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableNumber, 'CLASS_NAME', {
        value: 'LinkableNumber'
    });

    function LinkableNumber(defaultValue, verifier, defaultValueTriggersCallbacks) {
        // set default values for Parameters
        if (defaultValue === undefined) defaultValue = NaN;
        if (verifier === undefined) verifier = null;
        if (defaultValueTriggersCallbacks === undefined) defaultValueTriggersCallbacks = true;

        // Note: Calling  weavecore.LinkableVariable.call() will set all the default values for member variables defined in the super class,
        // which means we can't set _sessionStateInternal = NaN here.
        weavecore.LinkableVariable.call(this, "number", verifier, arguments.length ? defaultValue : undefined, defaultValueTriggersCallbacks);

        Object.defineProperty(this, 'value', {
            get: function () {
                return this._sessionStateExternal;
            },
            set: function (val) {
                this.setSessionState(val);
            }
        });
        /**
         * temporary solution to save the namespace for this class/prototype
         * @public
         * @property ns
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'ns', {
            value: 'weavecore'
        });
    }

    LinkableNumber.prototype = new weavecore.LinkableVariable();
    LinkableNumber.prototype.constructor = LinkableNumber;

    var p = LinkableNumber.prototype;


    p.setSessionState = function (val) {
        if (typeof (val) != "number") {
            if (val === null || val === '' || val === undefined) val = NaN;
            else val = Number(val);
        }
        weavecore.LinkableVariable.prototype.setSessionState.call(this, val);
    };

    p.sessionStateEquals = function (otherSessionState) {
        // We must check for null here because we can't set _sessionStateInternal = NaN in the constructor.
        if (this._sessionStateInternal === null || this._sessionStateInternal === undefined)
            this._sessionStateInternal = this._sessionStateExternal = NaN;
        if (isNaN(this._sessionStateInternal) && isNaN(otherSessionState))
            return true;
        return this._sessionStateInternal === otherSessionState;
    };

    weavecore.LinkableNumber = LinkableNumber;

}());

if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

/**
 * This is a LinkableVariable which limits its session state to Boolean values.
 * @author adufilie
 * @author sanjay1909
 */
(function () {
    /**
     * temporary solution to save the namespace for this class/prototype
     * @static
     * @public
     * @property NS
     * @default weavecore
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableBoolean, 'NS', {
        value: 'weavecore'
    });


    /**
     * TO-DO:temporary solution to save the CLASS_NAME constructor.name works for window object , but modular based won't work
     * @static
     * @public
     * @property CLASS_NAME
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableBoolean, 'CLASS_NAME', {
        value: 'LinkableBoolean'
    });

    function LinkableBoolean(defaultValue, verifier, defaultValueTriggersCallbacks) {
        // set default values for Parameters
        if (verifier === undefined) verifier = null;
        if (defaultValueTriggersCallbacks === undefined) defaultValueTriggersCallbacks = true;

        weavecore.LinkableVariable.call(this, "boolean", verifier, defaultValue, defaultValueTriggersCallbacks);

        Object.defineProperty(this, 'value', {
            get: function () {
                return this._sessionStateExternal;
            },
            set: function (val) {
                this.setSessionState(val);
            }
        });
        /**
         * temporary solution to save the namespace for this class/prototype
         * @public
         * @property ns
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'ns', {
            value: 'weavecore'
        });
    }

    LinkableBoolean.prototype = new weavecore.LinkableVariable();
    LinkableBoolean.prototype.constructor = LinkableBoolean;

    var p = LinkableBoolean.prototype;


    p.setSessionState = function (val) {
        if (typeof (val) === "string") {
            val = weavecore.ObjectUtil.stringCompare(val, "true", true) === 0;
        }
        weavecore.LinkableVariable.prototype.setSessionState.call(this, val ? true : false);
    };

    weavecore.LinkableBoolean = LinkableBoolean;

}());

if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

/**
 * This is a LinkableVariable which limits its session state to string values.
 * @author adufilie
 * @author sanjay1909
 */
(function () {
    /**
     * temporary solution to save the namespace for this class/prototype
     * @static
     * @public
     * @property NS
     * @default weavecore
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableString, 'NS', {
        value: 'weavecore'
    });

    /**
     * TO-DO:temporary solution to save the CLASS_NAME constructor.name works for window object , but modular based won't work
     * @static
     * @public
     * @property CLASS_NAME
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableString, 'CLASS_NAME', {
        value: 'LinkableString'
    });

    function LinkableString(defaultValue, verifier, defaultValueTriggersCallbacks) {
        // set default values for Parameters

        if (defaultValue === undefined) defaultValue = null;
        if (verifier === undefined) verifier = null;
        if (defaultValueTriggersCallbacks === undefined) defaultValueTriggersCallbacks = true;


        weavecore.LinkableVariable.call(this, "string", verifier, arguments.length ? defaultValue : undefined, defaultValueTriggersCallbacks);

        Object.defineProperty(this, 'value', {
            get: function () {
                return this._sessionStateExternal;
            },
            set: function (val) {
                this.setSessionState(val);
            }
        });
        /**
         * temporary solution to save the namespace for this class/prototype
         * @public
         * @property ns
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'ns', {
            value: 'weavecore'
        });
    }

    LinkableString.prototype = new weavecore.LinkableVariable();
    LinkableString.prototype.constructor = LinkableString;

    var p = LinkableString.prototype;

    p.setSessionState = function (val) {
        if (val !== null)
            val = String(val);
        weavecore.LinkableVariable.prototype.setSessionState.call(this, val);
    };

    weavecore.LinkableString = LinkableString;

}());

/**
 * @module weavecore
 */

//namesapce
if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

(function () {
    "use strict";

    /**
     * temporary solution to save the namespace for this class/prototype
     * @static
     * @public
     * @property NS
     * @default weavecore
     * @readOnly
     * @type String
     */
    Object.defineProperty(ChildListCallbackInterface, 'NS', {
        value: 'weavecore'
    });

    /**
     * TO-DO:temporary solution to save the CLASS_NAME constructor.name works for window object , but modular based won't work
     * @static
     * @public
     * @property CLASS_NAME
     * @readOnly
     * @type String
     */
    Object.defineProperty(ChildListCallbackInterface, 'CLASS_NAME', {
        value: 'ChildListCallbackInterface'
    });
    // constructor:
    /**
     * Private Class for use with {{#crossLink "LinkableHashMap"}}{{/crossLink}}
     * @class ChildListCallbackInterface
     * @extends CallbackCollection
     * @private
     * @constructor
     */
    function ChildListCallbackInterface() {

        // specify the preCallback function in super() so list callback
        // variables will be set before each change callback.
        weavecore.CallbackCollection.call(this, this._setCallbackVariables);
        /**
         * returned by public getter
         * @private
         * @property _lastNameAdded
         * @default null
         * @type String
         **/
        this._lastNameAdded = null;
        /**
         * returned by public getter
         * @private
         * @property _lastObjectAdded
         * @default null
         * @type ILinkableObject
         **/
        this._lastObjectAdded = null;
        /**
         * returned by public getter
         * @private
         * @property _lastNameRemoved
         * @default null
         * @type String
         **/
        this._lastNameRemoved = null;
        /**
         * returned by public getter
         * @private
         * @property _lastObjectRemoved
         * @default null
         * @type ILinkableObject
         **/
        this._lastObjectRemoved = null;

        /**
         * This is the name of the object that was added prior to running callbacks.
         * @public
         * @property lastNameAdded
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'lastNameAdded', {
            get: function () {
                return this._lastNameAdded;
            }
        });

        /**
         * This is the object that was added prior to running callbacks.
         * @public
         * @property lastObjectAdded
         * @readOnly
         * @type ILinkableObject
         */
        Object.defineProperty(this, 'lastObjectAdded', {
            get: function () {
                return this._lastObjectAdded;
            }
        });

        /**
         * This is the name of the object that was removed prior to running callbacks.
         * @public
         * @property lastNameRemoved
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'lastNameRemoved', {
            get: function () {
                return this._lastNameRemoved;
            }
        });

        /**
         * This is the object that was removed prior to running callbacks.
         * @public
         * @property lastObjectRemoved
         * @readOnly
         * @type ILinkableObject
         */
        Object.defineProperty(this, 'lastObjectRemoved', {
            get: function () {
                return this._lastObjectRemoved;
            }
        });

        /**
         * temporary solution to save the namespace for this class/prototype
         * @public
         * @property ns
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'ns', {
            value: 'weavecore'
        });

    }

    ChildListCallbackInterface.prototype = new weavecore.CallbackCollection();
    ChildListCallbackInterface.prototype.constructor = ChildListCallbackInterface;

    var p = ChildListCallbackInterface.prototype;
    /**
     * This function will set the list callback variables:
     *     lastNameAdded, lastObjectAdded, lastNameRemoved, lastObjectRemoved, childListChanged
     * @method _setCallbackVariables
     * @private
     * @param {String} name This is the name of the object that was just added or removed from the hash map.
     * @param {ILinkableObject} objectAdded This is the object that was just added to the hash map.
     * @param {ILinkableObject} objectRemoved This is the object that was just removed from the hash map.
     */
    p._setCallbackVariables = function (name, objectAdded, objectRemoved) {
        this._lastNameAdded = objectAdded ? name : null;
        this._lastObjectAdded = objectAdded;
        this._lastNameRemoved = objectRemoved ? name : null;
        this._lastObjectRemoved = objectRemoved;
    };

    /**
     * This function will run callbacks immediately, setting the list callback variables before each one.
     * @method runCallbacks
     * @param {String} name
     * @param {ILinkableObject} objectAdded
     * @param {ILinkableObject} objectRemoved
     */
    p.runCallbacks = function (name, objectAdded, objectRemoved) {
        // remember previous values
        var _name = this._lastNameAdded || this._lastNameRemoved;
        var _added = this._lastObjectAdded;
        var _removed = this._lastObjectRemoved;

        this._runCallbacksImmediately(name, objectAdded, objectRemoved);

        // restore previous values (in case an external JavaScript popup caused us to interrupt something else)
        this._setCallbackVariables.call(this, _name, _added, _removed);
    };



    weavecore.ChildListCallbackInterface = ChildListCallbackInterface;

}());

/**
 * @module weavecore
 */

// namespace
if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

(function () {
    "use strict";

    /**
     * temporary solution to save the namespace for this class/prototype
     * @static
     * @public
     * @property NS
     * @default weavecore
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableWatcher, 'NS', {
        value: 'weavecore'
    });

    /**
     * TO-DO:temporary solution to save the CLASS_NAME constructor.name works for window object , but modular based won't work
     * @static
     * @public
     * @property CLASS_NAME
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableWatcher, 'CLASS_NAME', {
        value: 'LinkableWatcher'
    });

    // constructor:
    /**
     * This is used to dynamically attach a set of callbacks to different targets.
     * The callbacks of the LinkableWatcher will be triggered automatically when the
     * target triggers callbacks, changes, becomes null or is disposed.
     * Instead of calling this constructor directly, consider using one of the {{#crossLink "SessionManager"}}{{/crossLink}} functions
     * {{#crossLink "SessionManager/registerLinkableChild:method"}}{{/crossLink}} or  {{#crossLink "SessionManager/registerDisposableChild:method"}}{{/crossLink}} to make sure the watcher will get disposed automatically.
     * @class LinkableWatcher
     * @extends ILinkableObject
     * @constructor
     * @param {Class} typeRestriction Optionally restricts which type of targets this watcher accepts.
     * @param {Function} immediateCallback A function to add as an immediate callback.
     * @param {Function} groupedCallback A function to add as a grouped callback.
     */
    function LinkableWatcher(typeRestriction, immediateCallback, groupedCallback) {
        if (typeRestriction === undefined) typeRestriction = null;
        if (immediateCallback === undefined) immediateCallback = null;
        if (groupedCallback === undefined) groupedCallback = null;

        weavecore.ILinkableObject.call(this);

        this._typeRestriction = typeRestriction;

        if (immediateCallback !== null)
            WeaveAPI.SessionManager.getCallbackCollection(this).addImmediateCallback(null, immediateCallback);

        if (groupedCallback !== null)
            WeaveAPI.SessionManager.getCallbackCollection(this).addGroupedCallback(null, groupedCallback);

        this._target; // the current target or ancestor of the to-be-target
        this._foundTarget = true; // false when _target is not the desired target
        this._targetPath; // the path that is being watched
        this._pathDependencies = new Map(); // Maps an ILinkableDynamicObject to its previous internalObject.

        Object.defineProperty(this, 'targetPath', {
            /**
             * This is the path that is currently being watched for linkable object targets.
             */
            get: function () {
                return this._targetPath ? this._targetPath.concat() : null;
            },
            /**
             * This will set a path which should be watched for new targets.
             * Callbacks will be triggered immediately if the path changes or points to a new target.
             */
            set: function (path) {
                // do not allow watching the globalHashMap
                if (path && path.length === 0)
                    path = null;
                if (weavecore.StandardLib.compare(this._targetPath, path) !== 0) {
                    var cc = WeaveAPI.SessionManager.getCallbackCollection(this);
                    cc.delayCallbacks();

                    this._resetPathDependencies();
                    this._targetPath = path;
                    this._handlePath();
                    cc.triggerCallbacks();

                    cc.resumeCallbacks();
                }
            },
            configurable: true
        });

        Object.defineProperty(this, 'target', {
            /**
             * This is the linkable object currently being watched.
             * Setting this will unset the targetPath.
             */
            get: function () {
                return this._foundTarget ? this._target : null;
            },
            set: function (newTarget) {
                var cc = WeaveAPI.SessionManager.getCallbackCollection(this);
                cc.delayCallbacks();
                this.targetPath = null;
                this.internalSetTarget(newTarget);
                cc.resumeCallbacks();
            },
            configurable: true
        });

        /**
         * temporary solution to save the namespace for this class/prototype
         * @public
         * @property ns
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'ns', {
            value: 'weavecore'
        });
    }

    LinkableWatcher.prototype = new weavecore.ILinkableObject();
    LinkableWatcher.prototype.constructor = LinkableWatcher;

    var p = LinkableWatcher.prototype;

    /**
     * This sets the new target to be watched without resetting targetPath.
     * Callbacks will be triggered immediately if the new target is different from the old one.
     */
    p.internalSetTarget = function (newTarget) {
        if (this._foundTarget && this._typeRestriction)
            newTarget = newTarget;

        // do nothing if the targets are the same.
        if (_target === newTarget)
            return;

        var sm = WeaveAPI.SessionManager;

        // unlink from old target
        if (this._target) {
            sm.getCallbackCollection(this._target).removeCallback(this._handleTargetTrigger);
            sm.getCallbackCollection(this._target).removeCallback(this._handleTargetDispose);
            // if we own the previous target, dispose it
            if (sm.getLinkableOwner(this._target) === this)
                sm.disposeObject(this._target);
            else
                sm.unregisterLinkableChild(this, this._target);
        }

        this._target = newTarget;

        // link to new target
        if (this._target) {
            // we want to register the target as a linkable child (for busy status)
            sm.registerLinkableChild(this, _target);
            // we don't want the target triggering our callbacks directly
            sm.getCallbackCollection(this._target).removeCallback(sm.getCallbackCollection(this).triggerCallbacks);
            sm.getCallbackCollection(this._target).addImmediateCallback(this, this._handleTargetTrigger.bind(this), false, true);
            // we need to know when the target is disposed
            sm.getCallbackCollection(this._target).addDisposeCallback(this, this._handleTargetDispose.bind(this));
        }

        if (this._foundTarget)
            this._handleTargetTrigger();
    };


    p._handleTargetTrigger = function () {
        if (this._foundTarget)
            WeaveAPI.SessionManager.getCallbackCollection(this).triggerCallbacks();
        else
            this._handlePath();
    };



    p._handleTargetDispose = function () {
        if (this._targetPath) {
            this._handlePath();
        } else {
            this._target = null;
            WeaveAPI.SessionManager.getCallbackCollection(this).triggerCallbacks();
        }
    };

    p._handlePath = function () {
        if (!this._targetPath) {
            this._foundTarget = true;
            this.internalSetTarget(null);
            return;
        }

        // traverse the path, finding ILinkableDynamicObject path dependencies along the way
        var sm = WeaveAPI.SessionManager;
        var node = WeaveAPI.globalHashMap;
        var subPath = [];
        for (var name of this._targetPath) {
            if (node instanceof weavecore.LinkableDynamicObject)
                this._addPathDependency(node);

            subPath[0] = name;
            var child = sm.getObject(node, subPath);
            if (child) {
                node = child;
            } else {
                // the path points to an object that doesn't exist yet
                if (node instanceof weavecore.LinkableHashMap) {
                    // watching childListCallbacks instead of the hash map accomplishes two things:
                    // 1. eliminate unnecessary calls to _handlePath()
                    // 2. avoid watching the root hash map (and registering the root as a child of the watcher)
                    node = node.childListCallbacks;
                }
                this._foundTarget = false;
                if (node instanceof weavecore.LinkableDynamicObject) {
                    if (this._target !== null) {
                        // path dependency code will detect changes to this node
                        this.internalSetTarget(null);
                        // must trigger here because _foundtarget is false
                        sm.getCallbackCollection(this).triggerCallbacks();
                    }
                } else
                    this.internalSetTarget(node);
                return;
            }
        }

        // we found a desired target if there is no type restriction or the object fits the restriction
        this._foundTarget = !this._typeRestriction || node instanceof this._typeRestriction;
        this.internalSetTarget(node);
    };

    p._addPathDependency = function (ldo) {
        var sm = WeaveAPI.SessionManager;
        if (!this._pathDependencies.get(ldo)) {
            this._pathDependencies.set(ldo, ldo.internalObject);
            sm.getCallbackCollection(ldo).addImmediateCallback(this, this._handlePathDependencies.bind(this));
            sm.getCallbackCollection(ldo).addDisposeCallback(this, this._handlePathDependencies.bind(this));
        }
    };


    p._handlePathDependencies = function () {
        var sm = WeaveAPI.SessionManager;
        for (var key of this._pathDependencies.keys()) {
            var ldo = key;
            if (sm.objectWasDisposed(ldo) || ldo.internalObject !== this._pathDependencies.get(ldo)) {
                this._resetPathDependencies();
                this._handlePath();
                return;
            }
        }
    };

    p._resetPathDependencies = function () {
        var sm = WeaveAPI.SessionManager;
        for (var key of this._pathDependencies.keys())
            sm.getCallbackCollection(key).removeCallback(this._handlePathDependencies);
        this._pathDependencies = new Map();
    };


    p.dispose = function () {
        this._targetPath = null;
        this._target = null;
        // everything else will be cleaned up automatically
    };

    weavecore.LinkableWatcher = LinkableWatcher;

    /*
			// JavaScript test code for path dependency case
			var lhm = weave.path('lhm').remove().request('LinkableHashMap');

			var a = lhm.push('a').request('LinkableDynamicObject').state(lhm.getPath('b', null));

			a.addCallback(function () {
			if (a.getType(null))
			console.log('a.getState(null): ', JSON.stringify(a.getState(null)));
			else
			console.log('a has no internal object');
			}, false, true);

			var b = lhm.push('b').request('LinkableDynamicObject').state(lhm.getPath('c'));

			// a has no internal object

			var c = lhm.push('c').request('LinkableDynamicObject').request(null, 'LinkableString').state(null, 'c value');

			// a.getState(null): []
			// a.getState(null): [{"className":"weave.core::LinkableString","objectName":null,"sessionState":null}]
			// a.getState(null): [{"className":"weave.core::LinkableString","objectName":null,"sessionState":"c value"}]

			b.remove(null);

			// a has no internal object

			b.request(null, 'LinkableString').state(null, 'b value');

			// a.getState(null): null
			// a.getState(null): "b value"
		*/
}());

/**
 * @module weavecore
 */

//namesapce
if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

(function () {
    "use strict";

    /**
     * temporary solution to save the namespace for this class/prototype
     * @static
     * @public
     * @property NS
     * @default weavecore
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableHashMap, 'NS', {
        value: 'weavecore'
    });

    /**
     * TO-DO:temporary solution to save the CLASS_NAME constructor.name works for window object , but modular based won't work
     * @static
     * @public
     * @property CLASS_NAME
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableHashMap, 'CLASS_NAME', {
        value: 'LinkableHashMap'
    });

    // constructor:
    /**
     * Allows dynamically creating instances of objects inheriting ILinkableObject at runtime.
     * The session state is an Array of {{#crossLink "DynamicState"}}{{/crossLink}} objects.
     * @class LinkableHashMap
     * @extends CallbackCollection
     * @constructor
     * @param {Class} typeRestriction If specified, this will limit the type of objects that can be added to this LinkableHashMap.
     */
    function LinkableHashMap(typeRestriction) {
        if (typeRestriction === undefined) typeRestriction = null;

        weavecore.CallbackCollection.call(this);

        /**
         * restricts the type of object that can be stored
         * @private
         * @property _typeRestriction
         * @type Class
         */
        this._typeRestriction;
        /**
         * qualified class name of _typeRestriction
         * @private
         * @property _typeRestrictionClassName
         * @type String
         */
        this._typeRestrictionClassName;

        if (typeRestriction !== null && typeRestriction !== undefined) {
            this._typeRestriction = typeRestriction;
            this._typeRestrictionClassName = typeRestriction.name;
        }

        /**
         * @private
         * @readOnly
         * @property _childListCallbacks
         * @type ChildListCallbackInterface
         */
        Object.defineProperty(this, '_childListCallbacks', {
            value: WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.ChildListCallbackInterface())
        });

        /**
         * an ordered list of names appearing in _nameToObjectMap
         * @private
         * @readOnly
         * @property _orderedNames
         * @type Array
         */
        Object.defineProperty(this, '_orderedNames', {
            value: []
        });

        /**
         * maps an identifying name to an object
         * @private
         * @readOnly
         * @property _nameToObjectMap
         * @type Object
         */
        Object.defineProperty(this, '_nameToObjectMap', {
            value: {}
        });

        /**
         * maps an object to an identifying name
         * @private
         * @readOnly
         * @property _objectToNameMap
         * @type Map
         */
        Object.defineProperty(this, '_objectToNameMap', {
            value: new Map()
        });

        /**
         * maps an identifying name to a value of true if that name is locked.
         * @private
         * @readOnly
         * @property _nameIsLocked
         * @type Object
         */
        Object.defineProperty(this, '_nameIsLocked', {
            value: {}
        });

        /**
         * maps a previously used name to a value of true.  used when generating unique names.
         * @private
         * @readOnly
         * @property _previousNameMap
         * @type Object
         */
        Object.defineProperty(this, '_previousNameMap', {
            value: {}
        });

        /**
         * The child type restriction, or null if there is none.
         * @public
         * @readOnly
         * @property typeRestriction
         * @type Class
         */
        Object.defineProperty(this, 'typeRestriction', {
            get: function () {
                return this._typeRestriction;
            }
        });

        /**
         * This is an interface for adding and removing callbacks that will get triggered immediately
         * when the list of child objects changes.
         * @public
         * @readOnly
         * @property childListCallbacks
         * @type ChildListCallbackInterface
         */
        Object.defineProperty(this, 'childListCallbacks', {
            get: function () {
                return this._childListCallbacks;
            }
        });

        /**
         * temporary solution to save the namespace for this class/prototype
         * @public
         * @property ns
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'ns', {
            value: 'weavecore'
        });
    }

    LinkableHashMap.prototype = new weavecore.CallbackCollection();
    LinkableHashMap.prototype.constructor = LinkableHashMap;

    var p = LinkableHashMap.prototype;

    /**
     * This function returns an ordered list of names in the hash map.
     * @method getNames
     * @param {Class} filter If specified, names of objects that are not of this type will be filtered out.
     * @return {Array} A copy of the ordered list of names of objects contained in this LinkableHashMap.
     */
    p.getNames = function (filter) {
        // set default value for parameter
        if (filter === undefined) filter = null;
        var result = [];
        for (var i = 0; i < this._orderedNames.length; i++) {
            var name = this._orderedNames[i];
            if (filter === null || this._nameToObjectMap[name] instanceof filter)
                result.push(name);
        }
        return result;
    };

    /**
     * This function returns an ordered list of objects in the hash map.
     * @method getObjects
     * @param {Class} filter If specified, objects that are not of this type will be filtered out.
     * @return {Array} An ordered Array of objects that correspond to the names returned by getNames(filter).
     */
    p.getObjects = function (filter) {
        // set default value for parameter
        if (filter === undefined) filter = null;
        var result = [];
        for (var i = 0; i < this._orderedNames.length; i++) {
            var name = this._orderedNames[i];
            var object = this._nameToObjectMap[name];
            if (filter === null || filter === undefined || object instanceof filter)
                result.push(object);
        }
        return result;
    };

    /**
     * This function gets the object associated with the specified name.
     * @method getObject
     * @param {String} name The identifying name to associate with an object.
     * @return {ILinkableObject} The object associated with the given name.
     */
    p.getObject = function (name) {
        return this._nameToObjectMap[name];
    };

    /**
     * This function gets the name of the specified object in the hash map.
     * @getName
     * @param {ILinkableObject} object An object contained in this LinkableHashMap.
     * @return {String} The name associated with the object, or null if the object was not found.
     */
    p.getName = function (object) {
        return this._objectToNameMap.get(object);
    };

    /**
     * This will reorder the names returned by getNames().
     * Any names appearing in newOrder that do not appear in getNames() will be ignored.
     * Callbacks will be called if the new name order differs from the old order.
     * @method setNameOrder
     * @param {Array} newOrder The new desired ordering of names.
     */
    p.setNameOrder = function (newOrder) {
        var changeDetected = false;
        var name;
        var i;
        var originalNameCount = this._orderedNames.length; // remembers how many names existed before appending
        var haveSeen = {}; // to remember which names have been seen in newOrder
        // append each name in newOrder to the end of _orderedNames
        for (i = 0; i < newOrder.length; i++) {
            name = newOrder[i];
            // ignore bogus names and append each name only once.
            if (this._nameToObjectMap[name] === undefined || haveSeen[name] !== undefined)
                continue;
            haveSeen[name] = true; // remember that this name was appended to the end of the list
            this._orderedNames.push(name); // add this name to the end of the list
        }
        // Now compare the ordered appended items to the end of the original list.
        // If the order differs, set _nameOrderChanged to true.
        // Meanwhile, set old name entries to null so they will be removed in the next pass.
        var appendedCount = this._orderedNames.length - originalNameCount;
        for (i = 0; i < appendedCount; i++) {
            var newIndex = originalNameCount + i;
            var oldIndex = this._orderedNames.indexOf(this._orderedNames[newIndex]);
            if (newIndex - oldIndex !== appendedCount)
                changeDetected = true;
            this._orderedNames[oldIndex] = null;
        }
        // remove array items that have been set to null
        var out = 0;
        for (i = 0; i < this._orderedNames.length; i++)
            if (this._orderedNames[i] !== null && this._orderedNames[i] !== undefined)
                this._orderedNames[out++] = this._orderedNames[i];
        this._orderedNames.length = out;
        // if the name order changed, run child list callbacks
        if (changeDetected)
            this._childListCallbacks.runCallbacks(null, null, null);
    };

    /**
     * This function creates an object in the hash map if it doesn't already exist.
     * If there is an existing object associated with the specified name, it will be kept if it
     * is the specified type, or replaced with a new instance of the specified type if it is not.
     * @method requestObject
     * @param {String} name The identifying name of a new or existing object.
     * @param {Class} classDef The Class of the desired object type.
     * @param {Boolean} lockObject If this is true, the object will be locked in place under the specified name.
     * @return {Object} The object under the requested name of the requested type, or null if an error occurred.
     */
    p.requestObject = function (name, classDef, lockObject) {
        var className = classDef ? classDef.NS + '.' + (classDef.CLASS_NAME ? classDef.CLASS_NAME : classDef.name) : null;
        var result = this._initObjectByClassName.call(this, name, className, lockObject);
        return classDef ? result : null;
    };

    /**
     * This function will copy the session state of an ILinkableObject to a new object under the given name in this LinkableHashMap.
     * @method requestObjectCopy
     * @param {String} newName A name for the object to be initialized in this LinkableHashMap.
     * @param {ILinkableObject} objectToCopy An object to copy the session state from.
     * @return {ILinkableObject} The new object of the same type, or null if an error occurred.
     */
    p.requestObjectCopy = function (name, objectToCopy) {
        if (objectToCopy === null || objectToCopy === undefined) {
            this.removeObject(name);
            return null;
        }

        this.delayCallbacks(); // make sure callbacks only trigger once
        var classDef = objectToCopy.constructor; //ClassUtils.getClassDefinition(className);
        var sessionState = WeaveAPI.SessionManager.getSessionState(objectToCopy);
        var object = requestObject(name, classDef, false);
        if (object !== null && object !== undefined)
            WeaveAPI.SessionManager.setSessionState(object, sessionState);
        this.resumeCallbacks();

        return object;
    };

    /**
     * This function will rename an object by making a copy and removing the original.
     * @method renameObject
     * @param {String} oldName The name of an object to replace.
     * @param {String} newName The new name to use for the copied object.
     * @return {ILinkableObject} The copied object associated with the new name, or the original object if newName is the same as oldName.
     */
    p.renameObject = function (oldName, newName) {
        if (oldName !== newName) {
            this.delayCallbacks();

            // prepare a name order that will put the new name in the same place the old name was
            var newNameOrder = this._orderedNames.concat();
            var index = newNameOrder.indexOf(oldName);
            if (index >= 0)
                newNameOrder.splice(index, 1, newName);

            this.requestObjectCopy(newName, getObject(oldName));
            this.removeObject(oldName);
            this.setNameOrder(newNameOrder);

            this.resumeCallbacks();
        }
        return this.getObject(newName);
    };

    /**
     * If there is an existing object associated with the specified name, it will be kept if it
     * is the specified type, or replaced with a new instance of the specified type if it is not.
     * @method _initObjectByClassName
     * @private
     * @param {String} name The identifying name of a new or existing object.  If this is null, a new one will be generated.
     * @param {String} className The qualified class name of the desired object type.
     * @param {Boolean} lockObject If this is set to true, lockObject() will be called on the given name.
     * @return {ILinkableObject} The object associated with the given name, or null if an error occurred.
     */
    p._initObjectByClassName = function (name, className, lockObject) {
        if (className) {
            // if no name is specified, generate a unique one now.
            if (!name)
                name = this.generateUniqueName(className);
            if (className !== "delete") // to-do Add Support for class Utils - delete is temp solution
            {
                // If this name is not associated with an object of the specified type,
                // associate the name with a new object of the specified type.
                console.log(className);
                var classDef = eval(className);
                //var classDef = window['weavecore'][className]; //TODO:remove hardcoded weavecore with namespace
                var object = this._nameToObjectMap[name];
                if (!object || object.constructor !== classDef)
                    this._createAndSaveNewObject.call(this, name, classDef, lockObject);
                else if (lockObject)
                    this._lockObject(name);

            } else {
                this.removeObject(name);
            }
        } else {
            this.removeObject(name);
        }
        return this._nameToObjectMap[name];
    };

    /**
     * @method _createAndSaveNewObject
     * @private
     * @param {String} name The identifying name to associate with a new object.
     * @param {Class} classDef The Class definition used to instantiate a new object.
     * @param {Boolean} lockObject If this is set to true, lockObject() will be called on the given name.
     */
    p._createAndSaveNewObject = function (name, classDef, lockObject) {
        if (this._nameIsLocked[name])
            return;

        // remove any object currently using this name
        this.removeObject(name);
        // create a new object
        var object = new classDef();
        // register the object as a child of this LinkableHashMap
        WeaveAPI.SessionManager.registerLinkableChild(this, object);
        // save the name-object mappings
        this._nameToObjectMap[name] = object;
        this._objectToNameMap.set(object, name);
        // add the name to the end of _orderedNames
        this._orderedNames.push(name);
        // remember that this name was used.
        this._previousNameMap[name] = true;

        if (lockObject)
            this._lockObject(name);

        // make sure the callback variables signal that the object was added
        this._childListCallbacks.runCallbacks(name, object, null);
    };

    /**
     * This function will lock an object in place for a given identifying name.
     * If there is no object using the specified name, this function will have no effect.
     * @method _lockObject
     * @private
     * @param {String} name The identifying name of an object to lock in place.
     */
    p._lockObject = function (name) {
        if (name !== null && name !== undefined && this._nameToObjectMap[name] !== null && this._nameToObjectMap[name] !== undefined)
            this._nameIsLocked[name] = true;
    };

    /**
     * This function will return true if the specified object was previously locked.
     * @method objectIsLocked
     * @param {String} name The name of an object.
     * @return {Boolean}
     */
    p.objectIsLocked = function (name) {
        return this._nameIsLocked[name] ? true : false;
    };

    /**
     * This function removes an object from the hash map.
     * @method removeObject
     * @param {String} name The identifying name of an object previously saved with setObject().
     */
    p.removeObject = function (name) {
        if (!name || this._nameIsLocked[name])
            return;

        var object = this._nameToObjectMap[name];
        if (object === null || object === undefined)
            return; // do nothing if the name isn't mapped to an object.

        //console.log(LinkableHashMap, "removeObject",name,object);
        // remove name & associated object
        delete this._nameToObjectMap[name];
        this._objectToNameMap.delete(object);
        var index = this._orderedNames.indexOf(name);
        this._orderedNames.splice(index, 1);

        // make sure the callback variables signal that the object was removed
        this._childListCallbacks.runCallbacks(name, null, object);

        // dispose the object AFTER the callbacks know that the object was removed
        WeaveAPI.SessionManager.disposeObject(object);
    };

    /**
     * This function attempts to removes all objects from this LinkableHashMap.
     * Any objects that are locked will remain.
     * @method removeAllObjects
     */
    p.removeAllObjects = function () {
        this.delayCallbacks();
        var orderedNamesCopy = this._orderedNames.concat();
        for (var i = 0; i < orderedNamesCopy.length; i++) {
            this.removeObject(orderedNamesCopy[i]);
        }
        this.resumeCallbacks();
    };

    /**
     * This function removes all objects from this LinkableHashMap.
     * adds implementaion to {{#crossLink "CallbackCollection/dispose:method"}}{{/crossLink}}
     * @method dispose
     */
    p.dispose = function dispose() {

        weavecore.CallbackCollection.prototype.dispose.call(this);

        // first, remove all objects that aren't locked
        this.removeAllObjects();

        // remove all locked objects
        var orderedNamesCopy = this._orderedNames.concat();
        for (var i = 0; i < orderedNamesCopy.length; i++) {
            var name = orderedNamesCopy[i];
            this._nameIsLocked[name] = undefined; // make sure removeObject() will carry out its action
            this.removeObject(name);
        }
    };

    /**
     * This will generate a new name for an object that is different from all the names of objects previously used in this LinkableHashMap.
     * @method generateUniqueName
     * @param {String} baseName The name to start with.  If the name is already in use, an integer will be appended to create a unique name.
     */
    p.generateUniqueName = function (baseName) {
        var count = 1;
        var name = baseName;
        while (this._previousNameMap[name] !== undefined)
            name = baseName + (++count);
        return name;
    };

    /**
     * This gets the session state of this composite object.
     * @method getSessionState
     * @return {Array} An Array of {{#crossLink "DynamicState"}}{{/crossLink}} objects which compose the session state for this object.
     */
    p.getSessionState = function () {
        var result = new Array(this._orderedNames.length);
        for (var i = 0; i < this._orderedNames.length; i++) {
            var name = this._orderedNames[i];
            var object = this._nameToObjectMap[name];
            result[i] = weavecore.DynamicState.create(
                name,
                object.constructor.name,
                WeaveAPI.SessionManager.getSessionState(object)
            );
        }
        return result;
    };

    /**
     * This sets the session state of this composite object.
     * @method setSessionState
     * @param {Array} newState An Array of child name Strings or {{#crossLink "DynamicState"}}{{/crossLink}} objects containing the new values and types for child ILinkableObjects.
     * @param {Boolean} removeMissingDynamicObjects If true, this will remove any child objects that do not appear in the session state.
     *     As a special case, a null session state will result in no change regardless of the removeMissingDynamicObjects value.
     */
    p.setSessionState = function (newStateArray, removeMissingDynamicObjects) {
        // special case - no change
        if (newStateArray === null || newStateArray === undefined)
            return;

        this.delayCallbacks();

        // first pass: make sure the types match and sessioned properties are instantiated.
        var i;
        var objectName;
        var className;
        var typedState;
        var remainingObjects = removeMissingDynamicObjects ? {} : null; // maps an objectName to a value of true
        var newObjects = {}; // maps an objectName to a value of true if the object is newly created as a result of setting the session state
        var newNameOrder = []; // the order the object names appear in the vector
        if (newStateArray !== null && newStateArray !== undefined) {
            // initialize all the objects before setting their session states because they may refer to each other.
            for (i = 0; i < newStateArray.length; i++) {
                typedState = newStateArray[i];
                if (!weavecore.DynamicState.isDynamicState(typedState))
                    continue;
                objectName = typedState[weavecore.DynamicState.OBJECT_NAME];
                className = typedState[weavecore.DynamicState.CLASS_NAME];
                // ignore objects that do not have a name because they may not load the same way on different application instances.
                if (objectName === null || objectName === undefined)
                    continue;
                // if className is not specified, make no change
                if (className === null || className === undefined)
                    continue;
                // initialize object and remember if a new one was just created
                if (this._nameToObjectMap[objectName] !== this._initObjectByClassName.call(this, objectName, className))
                    newObjects[objectName] = true;
            }
            // second pass: copy the session state for each property that is defined.
            // Also remember the ordered list of names that appear in the session state.
            for (i = 0; i < newStateArray.length; i++) {
                typedState = newStateArray[i];
                if (typeof (typedState) === "string") {
                    objectName = typedState;
                    if (removeMissingDynamicObjects)
                        remainingObjects[objectName] = true;
                    newNameOrder.push(objectName);
                    continue;
                }

                if (!weavecore.DynamicState.isDynamicState(typedState))
                    continue;
                objectName = typedState[weavecore.DynamicState.OBJECT_NAME];
                if (objectName === null || objectName === undefined)
                    continue;
                var object = this._nameToObjectMap[objectName];
                if (object === null || object === undefined)
                    continue;
                // if object is newly created, we want to apply an absolute session state
                WeaveAPI.SessionManager.setSessionState(object, typedState[weavecore.DynamicState.SESSION_STATE], newObjects[objectName] || removeMissingDynamicObjects);
                if (removeMissingDynamicObjects)
                    remainingObjects[objectName] = true;
                newNameOrder.push(objectName);
            }
        }
        if (removeMissingDynamicObjects) {
            // third pass: remove objects based on the Boolean flags in remainingObjects.
            var orderedNamesCopy = this._orderedNames.concat();
            for (var j = 0; j < orderedNamesCopy.length; j++) {
                objectName = torderedNamesCopy[j];
                if (remainingObjects[objectName] !== true) {
                    //trace(LinkableHashMap, "missing value: "+objectName);
                    this.removeObject(objectName);
                }
            }
        }
        // update name order AFTER objects have been added and removed.
        this.setNameOrder(newNameOrder);

        this.resumeCallbacks();
    };

    weavecore.LinkableHashMap = LinkableHashMap;
}());

createjs.Ticker.setFPS(50);
//createjs.Ticker.

// constructor:

if (typeof window === 'undefined') {
    this.WeaveAPI = this.WeaveAPI || {};
} else {
    window.WeaveAPI = window.WeaveAPI || {};
}

//Object.defineProperty(WeaveAPI, '_sessionManager', {
// value: new SessionManager()
//});
//Object.defineProperty(WeaveAPI, '_stageUtils', {
//value: new weave.core.StageUtils()
//});

Object.defineProperty(WeaveAPI, 'TASK_PRIORITY_IMMEDIATE', {
    value: 0
});

Object.defineProperty(WeaveAPI, 'TASK_PRIORITY_HIGH', {
    value: 1
});

Object.defineProperty(WeaveAPI, 'TASK_PRIORITY_NORMAL', {
    value: 2
});

Object.defineProperty(WeaveAPI, 'TASK_PRIORITY_LOW', {
    value: 3
});

/* WeaveAPI.__defineGetter__("SessionManager", function(){
     return WeaveAPI._sessionManager;
 });

 WeaveAPI.__defineGetter__("StageUtils", function(){
     return WeaveAPI._stageUtils;
 });*/
WeaveAPI.SessionManager = new weavecore.SessionManager();
WeaveAPI.globalHashMap = new weavecore.LinkableHashMap();

/**
 * @module weavecore
 */

//namesapce
if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

(function () {
    "use strict";

    /**
     * temporary solution to save the namespace for this class/prototype
     * @static
     * @public
     * @property NS
     * @default weavecore
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableDynamicObject, 'NS', {
        value: 'weavecore'
    });

    /**
     * TO-DO:temporary solution to save the CLASS_NAME constructor.name works for window object , but modular based won't work
     * @static
     * @public
     * @property CLASS_NAME
     * @readOnly
     * @type String
     */
    Object.defineProperty(LinkableDynamicObject, 'CLASS_NAME', {
        value: 'LinkableDynamicObject'
    });

    // constructor:
    /**
     * This object links to an internal ILinkableObject.
     * The internal object can be either a local one or a global one identified by a global name.
     * @class LinkableDynamicObject
     * @extends LinkableWatcher
     * @constructor
     * @param {Class} typeRestriction If specified, this will limit the type of objects that can be added to this LinkableHashMap.
     */
    function LinkableDynamicObject(typeRestriction) {
        if (typeRestriction === undefined) typeRestriction = null;
        // this is a constraint on the type of object that can be linked
        this._typeRestrictionClassName;
        this._typeRestriction = typeRestriction;
        // when this is true, the linked object cannot be changed
        this._locked = false;

        weavecore.LinkableWatcher.call(this, typeRestriction);
        if (typeRestriction)
            this._typeRestrictionClassName = typeRestriction.constructor.name;

        // the callback collection for this object
        // private const
        Object.defineProperty(this, '_cc', {
            value: WeaveAPI.SessionManager.registerDisposableChild(this, new weavecore.CallbackCollection()),
            writable: false
        });

        Object.defineProperty(LinkableDynamicObject, 'ARRAY_CLASS_NAME', {
            value: 'Array'
        });

        /**
         * @inheritDoc
         */
        Object.defineProperty(this, 'internalObject', {
            get: function () {
                return this.target;
            }
        });

        // override public
        Object.defineProperty(this, 'targetPath', {

            set: function (path) {
                if (this._locked)
                    return;
                weavecore.LinkableWatcher.prototype.targetPath = path;
            },
            configurable: true
        });

        // override public
        Object.defineProperty(this, 'target', {

            set: function (newTarget) {
                if (this._locked)
                    return;

                if (!newTarget) {
                    weavecore.LinkableWatcher.prototype.target = null;
                    return;
                }

                this._cc.delayCallbacks();

                // if the target can be found by a path, use the path
                var sm = WeaveAPI.SessionManager;
                var path = sm.getPath(WeaveAPI.globalHashMap, newTarget);
                if (path) {
                    this.targetPath = path;
                } else {
                    // it's ok to assign a local object that we own or that doesn't have an owner yet
                    // otherwise, unset the target
                    var owner = sm.getLinkableOwner(newTarget);
                    if (owner === this || !owner)
                        weavecore.LinkableWatcher.prototype.target = newTarget;
                    else
                        weavecore.LinkableWatcher.prototype.target = null;
                }

                this._cc.resumeCallbacks();
            },
            configurable: true
        });


        Object.defineProperty(this, 'globalName', {
            /**
             * This is the name of the linked global object, or null if the internal object is local.
             */
            get: function () {
                if (this._targetPath && this._targetPath.length == 1)
                    return this._targetPath[0];
                return null;
            },
            /**
             * This function will change the internalObject if the new globalName is different, unless this object is locked.
             * If a new global name is given, the session state of the new global object will take precedence.
             * @param newGlobalName This is the name of the global object to link to, or null to unlink from the current global object.
             */
            set: function (newGlobalName) {
                if (this._locked)
                    return;

                // change empty string to null
                if (!newGlobalName)
                    newGlobalName = null;

                var oldGlobalName = this.globalName;
                if (oldGlobalName === newGlobalName)
                    return;

                this._cc.delayCallbacks();

                if (newGlobalName === null || newGlobalName === undefined) {
                    // unlink from global object and copy session state into a local object
                    this.requestLocalObjectCopy(this.internalObject);
                } else {
                    // when switcing from a local object to a global one that doesn't exist yet, copy the local object
                    if (this.target && !this.targetPath && !WeaveAPI.globalHashMap.getObject(newGlobalName))
                        WeaveAPI.globalHashMap.requestObjectCopy(newGlobalName, this.internalObject);

                    // link to new global name
                    this.targetPath = [newGlobalName];
                }

                this._cc.resumeCallbacks();
            }
        });

        /**
         * @inheritDoc
         */
        Object.defineProperty(this, 'locked', {
            get: function () {
                return this.locked;
            }

        });

        /**
         * temporary solution to save the namespace for this class/prototype
         * @public
         * @property ns
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'ns', {
            value: 'weavecore'
        });
    }

    LinkableDynamicObject.prototype = new weavecore.LinkableWatcher();
    LinkableDynamicObject.prototype.constructor = LinkableDynamicObject;

    var p = LinkableDynamicObject.prototype;


    p.lock = function () {
        this._locked = true;
    };

    /**
     * @inheritDoc
     */
    //public

    p.getSessionState = function () {
        var obj = this.targetPath || this.target;
        if (!obj)
            return [];

        var className = obj.constructor.name;
        var sessionState = obj || WeaveAPI.SessionManager.getSessionState(obj);
        return [weavecore.DynamicState.create(null, className, sessionState)];
    };

    /**
     * @inheritDoc
     */
    //public

    p.setSessionState = function (newState, removeMissingDynamicObjects) {
        //console.log(debugId(this), removeMissingDynamicObjects ? 'diff' : 'state', Compiler.stringify(newState, null, '\t'));

        // special case - no change
        if (newState === null || newState === undefined)
            return;

        try {
            // make sure callbacks only run once
            this._cc.delayCallbacks();

            // stop if there are no items
            if (!newState.length) {
                if (removeMissingDynamicObjects)
                    target = null;
                return;
            }

            // if it's not a dynamic state array, treat it as a path
            if (!weavecore.DynamicState.isDynamicStateArray(newState)) {
                this.targetPath = newState;
                return;
            }

            // if there is more than one item, it's in a deprecated format
            /*if (newState.length > 1) {
                handleDeprecatedSessionState(newState, removeMissingDynamicObjects);
                return;
            }*/

            var dynamicState = newState[0];
            var className = dynamicState[weavecore.DynamicState.CLASS_NAME];
            var objectName = dynamicState[weavecore.DynamicState.OBJECT_NAME];
            var sessionState = dynamicState[weavecore.DynamicState.SESSION_STATE];

            // backwards compatibility
            /*if (className == 'weave.core::GlobalObjectReference' || className == 'GlobalObjectReference') {
                className = ARRAY_CLASS_NAME;
                sessionState = [objectName];
            }*/

            if (className === ARRAY_CLASS_NAME || (!className && this.targetPath))
                this.targetPath = sessionState;
            else if (className === SessionManager.DIFF_DELETE)
                this.target = null;
            else {
                var prevTarget = this.target;
                // if className is not specified, make no change unless removeMissingDynamicObjects is true
                if (className || removeMissingDynamicObjects)
                    this._setLocalObjectType(className);
                //TODO:Remove hardcoded NameSpace
                //var classDef = eval("weavecore." + className);
                var classDef = window[className];
                if ((!className && this.target) || (classDef && this.target instanceof classDef))
                    WeaveAPI.SessionManager.setSessionState(this.target, sessionState, prevTarget !== this.target || removeMissingDynamicObjects);
            }
        } finally {
            // allow callbacks to run once now
            this._cc.resumeCallbacks();
        }
    };





    // override protected

    p.internalSetTarget = function (newTarget) {
        // don't allow recursive linking
        if (newTarget === this || WeaveAPI.SessionManager.getLinkableDescendants(newTarget, LinkableDynamicObject).indexOf(this) >= 0)
            newTarget = null;

        weavecore.LinkableWatcher.prototype.internalSetTarget(newTarget);
    };



    //private
    //to-do
    // replace weavecore with ns and figure out best way to deal this
    p._setLocalObjectType = function (className) {
        // stop if locked
        if (this._locked)
            return;

        this._cc.delayCallbacks();

        this.targetPath = null;

        var classDef = eval(className);
        if (classDef instanceof weavecore.ILinkableObject && (this._typeRestriction === null || this._typeRestriction === undefined || classDef instanceof this._typeRestriction)) {

            var obj = target;
            if (!obj || obj.constructor !== classDef)
                weavecore.LinkableWatcher.prototype.target = new classDef();
        } else {
            weavecore.LinkableWatcher.prototype.target = null;
        }

        _cc.resumeCallbacks();
    };

    /**
     * @inheritDoc
     */


    p.requestLocalObject = function (objectType, lockObject) {
        this._cc.delayCallbacks();

        //To-do
        // this will fail if we minify the weavecore, as constructor name wont be same in minified version
        // we nee dot get namespace of that object here too
        // temp solution store  Ns name in the object instance as String
        if (objectType)
            this._setLocalObjectType(objectType.ns + '.' + objectType.constructor.name);
        else
            this.target = null;

        if (lockObject)
            this._locked = true;

        this._cc.resumeCallbacks();

        return target;
    };

    /**
     * @inheritDoc
     */
    p.requestGlobalObject = function (name, objectType, lockObject) {
        if (!name)
            return this.requestLocalObject(objectType, lockObject);

        if (!this._locked) {
            this._cc.delayCallbacks();

            this.targetPath = [name];
            WeaveAPI.globalHashMap.requestObject(name, objectType, lockObject);
            if (lockObject)
                this._locked = true;

            this._cc.resumeCallbacks();
        }

        return this.target;
    };

    /**
     * @inheritDoc
     */
    p.requestLocalObjectCopy = function (objectToCopy) {
        this._cc.delayCallbacks(); // make sure callbacks only trigger once
        var classDef = objectToCopy ? objectToCopy.constructor : null;
        var object = this.requestLocalObject(classDef, false);
        if (object !== null && object !== undefined && objectToCopy !== null && objectToCopy !== undefined) {
            var state = WeaveAPI.SessionManager.getSessionState(objectToCopy);
            WeaveAPI.SessionManager.setSessionState(object, state, true);
        }
        this._cc.resumeCallbacks();
    };


    p.removeObject = function () {
        if (!this._locked)
            weavecore.LinkableWatcher.prototype.target = null;
    };

    p.dispose = function () {
        // explicitly dispose the CallbackCollection before anything else
        this._cc.dispose();
        weavecore.LinkableWatcher.prototype.dispose();
    };

    weavecore.LinkableDynamicObject = LinkableDynamicObject;


}());

/*
    Weave (Web-based Analysis and Visualization Environment)
    Copyright (C) 2008-2011 University of Massachusetts Lowell
    This file is a part of Weave.
    Weave is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License, Version 3,
    as published by the Free Software Foundation.
    Weave is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with Weave.  If not, see <http://www.gnu.org/licenses/>.
*/

// namespace

if (!this.weavecore)
    this.weavecore = {};

/**
 * This allows you to add callbacks that will be called when an event occurs on the stage.
 *
 * WARNING: These callbacks will trigger on every mouse and keyboard event that occurs on the stage.
 *          Developers should not add any callbacks that run computationally expensive code.
 *
 * @author adufilie
 * @author sanjay1909
 */
(function () {

    // Internal class constructor

    Object.defineProperty(EventCallbackCollection, 'eventTypes', {
        value: ['tick']
    });

    function EventCallbackCollection(eventManager, eventType) {
        weavecore.CallbackCollection.call(this, this.setEvent.bind(this));
        this._eventManager = eventManager;
        this._eventType = eventType;

    }

    EventCallbackCollection.prototype = new weavecore.CallbackCollection();
    EventCallbackCollection.prototype.constructor = EventCallbackCollection;

    var p = EventCallbackCollection.prototype;

    /**
     * This is the _preCallback
     */
    p.setEvent = function setEvent(event) {
        this._eventManager.event = event;
    };

    /**
     * This function remembers the previous event value, runs callbacks using the new event value,
     * then restores the previous event value. This is necessary because it is possible for a popup
     * browser window to interrupt Flash with requests in the middle of an event.
     */
    p.runEventCallbacks = function (event) {
        var previousEvent = this._eventManager.event; // remember previous value
        this._runCallbacksImmediately(event); // make sure event is set before each immediate callback
        this._preCallback(previousEvent); // restore the previous value
    };

    /**
     * Call this when the stage is available to set up event listeners.
     */
    p.listenToStage = function () {
        // do not create event listeners for these meta events
        //if (eventType == POINT_CLICK_EVENT || eventType == THROTTLED_MOUSE_MOVE_EVENT)
        //return;

        //if (eventType == KeyboardEvent.KEY_DOWN && Capabilities.playerType == "Desktop")
        //cancelable = false;

        // Add a listener to the capture phase so the callbacks will run before the target gets the event.
        //stage.addEventListener(eventType, captureListener, true, 0, true); // use capture phase

        // If the target is the stage, the capture listener won't be called, so add
        // an additional listener that runs callbacks when the stage is the target.
        createjs.Ticker.addEventListener(this._eventType, this._tickerListener.bind(this)); // do not use capture phase

        // when callbacks are disposed, remove the listeners
        this.addDisposeCallback(null, function () {
            //stage.removeEventListener(eventType, captureListener, true);
            createjs.Ticker.removeEventListener(this._eventType, this._tickerListener.bind(this));
        });
    };

    p._tickerListener = function (event) {
        this._eventManager.eventTime = new Date().getTime();
        if (this._eventType === "tick") {
            if (this._eventManager.userActivity > 0 && !this._eventManager.mouseButtonDown)
                this._eventManager.userActivity--;
            this._eventManager.previousFrameElapsedTime = this._eventManager.eventTime - this._eventManager.currentFrameStartTime;
            this._eventManager.currentFrameStartTime = this._eventManager.eventTime;
            //this._eventManager.triggeredThrottledMouseThisFrame = false;
        }
        // finally, trigger callbacks for non-mouse-move events
        if (this._eventType === "tick") // altered temporarily
            this.runEventCallbacks(event);

    };

    weavecore.EventCallbackCollection = EventCallbackCollection;

    //constructor
    function StageUtils() {

        this.averageFrameTime = 0;

        Object.defineProperties(this, {
            eventManager: {
                value: new EventManager()
            },
            frameTimes: {
                value: []
            },
            _stackTraceMap: {
                value: new Map()
            },
            _taskElapsedTime: {
                value: new Map()
            },
            _taskStartTime: {
                value: new Map()
            },

        });
        this._currentTaskStopTime = 0;

        /**
         * This is an Array of "callLater queues", each being an Array of function invocations to be done later.
         * The Arrays get populated by callLater().
         * There are four nested Arrays corresponding to the four priorities (0, 1, 2, 3) defined by static constants in WeaveAPI.
         */
        Object.defineProperties(this, {
            _priorityCallLaterQueues: {
                value: [[], [], [], []]
            },
            _priorityAllocatedTimes: {
                value: [Number.MAX_VALUE, 300, 200, 100]
            }
        });
        this._activePriority = WeaveAPI.TASK_PRIORITY_IMMEDIATE + 1; // task priority that is currently being processed
        this._activePriorityElapsedTime = 0;
        this._deactivatedMaxComputationTimePerFrame = 1000;
        this._nextCallLaterPriority = WeaveAPI.TASK_PRIORITY_IMMEDIATE; // private variable to control the priority of the next callLater() internally
        this.addEventCallback("tick", null, this._handleCallLater.bind(this));
        this.maxComputationTimePerFrame = 100;
        this.maxComputationTimePerFrame_noActivity = 250;

    }

    var suP = StageUtils.prototype;
    suP.getMaxComputationTimePerFrame = function () {
        return this.maxComputationTimePerFrame;
    };

    suP.setMaxComputationTimePerFrame = function (value) {
        // this.eventManager.throttledMouseMoveInterval = value;
        this.maxComputationTimePerFrame = value;
    };

    suP.getTaskPriorityTimeAllocation = function (priority) {
        return this._priorityAllocatedTimes[priority];
    };

    suP.setTaskPriorityTimeAllocation = function (priority, milliseconds) {
        this._priorityAllocatedTimes[priority] = Math.max(milliseconds, 5);
    };

    StageUtils._time;
    StageUtils._times = [];

    suP.callLater = function (relevantContext, method, parameters) {
        if (method === null || method === undefined) {
            console.log('StageUtils.callLater(): received null "method" parameter');
            return;
        }

        this._priorityCallLaterQueues[this._nextCallLaterPriority].push(arguments);
        this._nextCallLaterPriority = WeaveAPI.TASK_PRIORITY_IMMEDIATE;

        //if (this.debug_async_stack)
        //_stackTraceMap[arguments] = new Error("This is the stack trace from when callLater() was called.").getStackTrace();
    };

    suP._handleCallLater = function () {
        if (this.maxComputationTimePerFrame === 0)
            this.maxComputationTimePerFrame = 100;

        var maxComputationTime;
        if (this.eventManager.useDeactivatedFrameRate)
            maxComputationTime = this._deactivatedMaxComputationTimePerFrame;
        else if (!this.eventManager.userActivity)
            maxComputationTime = this.maxComputationTimePerFrame_noActivity;
        else
            maxComputationTime = this.maxComputationTimePerFrame;
        if (!this.eventManager.event) {
            console.log("StageUtils.handleCallLater(): _event is null. This should never happen.");
            return;
        }
        if (this.eventManager.event.type === "tick") {
            //resetDebugTime();

            /*if (debug_fps)
            {
                frameTimes.push(previousFrameElapsedTime);
                if (StandardLib.sum(frameTimes) >= 1000)
                {
                    averageFrameTime = StandardLib.mean(frameTimes);
                    var fps:Number = StandardLib.roundSignificant(1000 / averageFrameTime, 2);
                    trace(fps,'fps; max computation time',maxComputationTime);
                    frameTimes.length = 0;
                }
            }*/

            if (this.eventManager.previousFrameElapsedTime > 3000)
                console.log('Previous frame took', this.eventManager.previousFrameElapsedTime, 'ms');
        }

        //if (UIComponentGlobals.callLaterSuspendCount > 0)
        //return;

        // The variables countdown and lastPriority are used to avoid running newly-added tasks immediately.
        // This avoids wasting time on async tasks that do nothing and return early, adding themselves back to the queue.

        var args;
        var args2; // this is set to args[2]
        var stackTrace;
        var now;
        var allStop = this.eventManager.currentFrameStartTime + maxComputationTime;

        this._currentTaskStopTime = allStop; // make sure _iterateTask knows when to stop

        // first run the functions that should be called before anything else.
        /*if (pauseForGCIfCollectionImminent != null)
        {
            var t:int = getTimer();
            pauseForGCIfCollectionImminent();
            t = getTimer() - t;
            if (t > maxComputationTimePerFrame)
                trace('paused',t,'ms for GC');
        }*/
        var queue = this._priorityCallLaterQueues[WeaveAPI.TASK_PRIORITY_IMMEDIATE];
        var countdown;
        for (countdown = queue.length; countdown > 0; countdown--) {
            /*if (debug_callLater)
                DebugTimer.begin();*/

            now = new Date().getTime();
            // stop when max computation time is reached for this frame
            if (now > allStop) {
                /*if (debug_callLater)
                    DebugTimer.cancel();*/
                return;
            }

            // args: (relevantContext:Object, method:Function, parameters:Array, priority:uint)
            args = queue.shift();
            stackTrace = this._stackTraceMap[args];

            // don't call the function if the relevantContext was disposed.
            if (!WeaveAPI.SessionManager.objectWasDisposed(args[0])) {
                args2 = args[2];
                if (args2 !== null && args2 && args2.length > 0)
                    args[1].apply(null, args2);
                else
                    args[1].call();
            }

            /*if (debug_callLater)
                DebugTimer.end(stackTrace);*/
        }

        //			trace('-------');

        var minPriority = WeaveAPI.TASK_PRIORITY_IMMEDIATE + 1;
        var lastPriority = this._activePriority === minPriority ? this._priorityCallLaterQueues.length - 1 : this._activePriority - 1;
        var pStart = new Date().getTime();
        var pAlloc = this._priorityAllocatedTimes[this._activePriority];
        if (this.eventManager.useDeactivatedFrameRate)
            pAlloc = pAlloc * this._deactivatedMaxComputationTimePerFrame / this.maxComputationTimePerFrame;
        else if (!this.eventManager.userActivity)
            pAlloc = pAlloc * this.maxComputationTimePerFrame_noActivity / this.maxComputationTimePerFrame;
        var pStop = Math.min(allStop, pStart + pAlloc - this._activePriorityElapsedTime); // continue where we left off
        queue = this._priorityCallLaterQueues[this._activePriority];
        countdown = queue.length;
        while (true) {
            /*if (debug_callLater)
					DebugTimer.begin();*/

            now = new Date().getTime();
            if (countdown === 0 || now > pStop) {
                // add the time we just spent on this priority
                this._activePriorityElapsedTime += now - pStart;

                // if max computation time was reached for this frame or we have visited all priorities, stop now
                if (now > allStop || this._activePriority === lastPriority) {
                    /*if (debug_callLater)
							DebugTimer.cancel();
						if (debug_fps)
							trace('spent',currentFrameElapsedTime,'ms');*/
                    return;
                }

                // see if there are any entries left in the queues (except for the immediate queue)
                var remaining = 0;
                for (var i = minPriority; i < this._priorityCallLaterQueues.length; i++)
                    remaining += this._priorityCallLaterQueues[i].length;
                // stop if no more entries
                if (remaining === 0) {
                    /*if (debug_callLater)
							DebugTimer.cancel();*/
                    break;
                }

                // switch to next priority, reset elapsed time
                this._activePriority++;
                this._activePriorityElapsedTime = 0;
                if (this._activePriority === this._priorityCallLaterQueues.length)
                    this._activePriority = minPriority;
                pStart = now;
                pAlloc = this._priorityAllocatedTimes[_activePriority];
                if (this.eventManager.useDeactivatedFrameRate)
                    pAlloc = pAlloc * this._deactivatedMaxComputationTimePerFrame / this.maxComputationTimePerFrame;
                else if (!this.eventManager.userActivity)
                    pAlloc = pAlloc * this.maxComputationTimePerFrame_noActivity / this.maxComputationTimePerFrame;
                pStop = Math.min(allStop, pStart + pAlloc);
                queue = this._priorityCallLaterQueues[this._activePriority];
                countdown = queue.length;

                // restart loop to check stopping condition
                /*if (debug_callLater)
						DebugTimer.cancel();*/
                continue;
            }

            countdown--;

            //				trace('p',_activePriority,pElapsed,'/',pAlloc);
            _currentTaskStopTime = pStop; // make sure _iterateTask knows when to stop

            // call the next function in the queue
            // args: (relevantContext:Object, method:Function, parameters:Array, priority:uint)
            args = queue.shift();
            stackTrace = this._stackTraceMap[args]; // check this for debugging where the call came from

            //				WeaveAPI.SessionManager.unassignBusyTask(args);

            // don't call the function if the relevantContext was disposed.
            if (!WeaveAPI.SessionManager.objectWasDisposed(args[0])) {
                // TODO: PROFILING: check how long this function takes to execute.
                // if it takes a long time (> 1000 ms), something's wrong...
                args2 = args[2];
                if (args2 !== null && args2.length > 0)
                    args[1].apply(null, args2);
                else
                    args[1].call();
            }

            /*if (debug_callLater)
					DebugTimer.end(stackTrace);*/
        }

    };

    suP.addEventCallback = function (eventType, relevantContext, callback, runCallbackNow) {
        // set default parameter value
        if (runCallbackNow === null || runCallbackNow === undefined) {
            runCallbackNow = false;
        }
        var cc = this.eventManager.callbackCollections[eventType];
        if (cc !== null && cc !== undefined) {
            cc.addImmediateCallback(relevantContext, callback, runCallbackNow);
        } else {
            console.log("(StageUtils) Unsupported event: ", eventType);
        }
    };



    weavecore.StageUtils = new StageUtils();


    function EventManager() {
        Object.defineProperty(this, 'callbackCollections', {
            value: {}
        });
        this.userActivity = 0; // greater than 0 when there was user activity since the last frame.
        this.event = null;
        this.eventTime = 0;
        this.shiftKey = false;
        this.altKey = false;
        this.ctrlKey = false;
        this.mouseButtonDown = false;

        this.currentFrameStartTime = new Date().getTime(); // this is the result of getTimer() on the last ENTER_FRAME event.
        this.previousFrameElapsedTime = 0; // this is the amount of time it took to process the previous frame.
        this.pointClicked = false;
        this.deactivated = true; // true when application is deactivated
        this.useDeactivatedFrameRate = false;

        this.triggeredThrottledMouseThisFrame = false; // set to false on enterFrame, set to true on throttled mouse move
        this.nextThrottledMouseMoveTime = 0; // time threshold before triggering throttled mouse move again
        this.throttledMouseMoveInterval = 100; // time threshold before triggering throttled mouse move again

        // create a new callback collection for each type of event
        for (var j = 0; j < EventCallbackCollection.eventTypes.length; j++) {
            var type = EventCallbackCollection.eventTypes[j];
            this.callbackCollections[type] = new EventCallbackCollection(this, type);
            // this.callbackCollections[type] = WeaveAPI.SessionManager.registerDisposableChild(WeaveAPI.globalHashMap, new EventCallbackCollection(this, type));
        }

        //add event listeners
        for (var eventtype in this.callbackCollections) {
            this.callbackCollections[eventtype].listenToStage();
        }
        this.event;
    }


    weavecore.EventManager = EventManager;



}());

if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

/**
 * This class saves the session history of an ILinkableObject.
 *
 * @author adufilie
 * @author sanjay1909
 */
(function () {

    /**
     * This is an entry in the session history log.  It contains both undo and redo session state diffs.
     * The triggerDelay is the time it took for the user to make a change since the last synchronization.
     * This time difference does not include the time it took to set the session state.  This way, when
     * the session state is replayed at a reasonable speed regardless of the speed of the computer.
     * @param id
     * @param forward The diff for applying redo.
     * @param backward The diff for applying undo.
     * @param triggerDelay The length of time between the last synchronization and the diff.
     */
    function LogEntry(id, forward, backward, triggerDelay, diffDuration) {
        this.id = id;
        this.forward = forward; // the diff for applying redo
        this.backward = backward; // the diff for applying undo
        this.triggerDelay = triggerDelay; // the length of time between the last synchronization and the diff
        this.diffDuration = diffDuration; // the length of time in which the diff took place
    }

    /**
     * This will convert an Array of generic objects to an Array of LogEntry objects.
     * Generic objects are easier to create backwards compatibility for.
     */
    LogEntry.convertGenericObjectsToLogEntries = function (array, defaultTriggerDelay) {
        for (var i = 0; i < array.length; i++) {
            var o = array[i];
            if (!(o instanceof LogEntry))
                array[i] = new LogEntry(o.id, o.forward, o.backward, o.triggerDelay || defaultTriggerDelay, o.diffDuration);
        }
        return array;
    };


    function getTimer() {
        var start = new Date().getTime();
        return start;
    }

    function SessionStateLog(subject, syncDelay) {
        // set default values
        if (syncDelay === undefined)
            syncDelay = 0;
        this._subject = subject; // the object we are monitoring
        this._syncDelay = syncDelay; // the number of milliseconds to wait before automatically synchronizing
        this._prevState = WeaveAPI.SessionManager.getSessionState(this._subject); // remember the initial state

        /**
         * When this is set to true, changes in the session state of the subject will be automatically logged.
         */
        SessionStateLog.prototype.enableLogging = WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableBoolean(true), this.synchronizeNow.bind(this));


        WeaveAPI.SessionManager.registerDisposableChild(this._subject, this); // make sure this is disposed when _subject is disposed

        var cc = WeaveAPI.SessionManager.getCallbackCollection(this._subject);
        cc.addImmediateCallback(this, this._immediateCallback.bind(this));
        cc.addGroupedCallback(this, this._groupedCallback.bind(this));

        this._undoHistory = []; // diffs that can be undone
        this._redoHistory = []; // diffs that can be redone
        this._nextId = 0; // gets incremented each time a new diff is created
        this._undoActive = false; // true while an undo operation is active
        this._redoActive = false; // true while a redo operation is active

        this._syncTime = getTimer(); // this is set to getTimer() when synchronization occurs
        this._triggerDelay = -1; // this is set to (getTimer() - _syncTime) when immediate callbacks are triggered for the first time since the last synchronization occurred
        this._saveTime = 0; // this is set to getTimer() + _syncDelay to determine when the next diff should be computed and logged
        this._savePending = false; // true when a diff should be computed

        Object.defineProperty(SessionStateLog, 'debug', {
            value: true,
            writable: true
        });
        Object.defineProperty(SessionStateLog, 'enableHistoryRewrite', {
            value: true,
            writable: true
        });

        /**
         * @TODO create an interface for the objects in this Array
         */
        Object.defineProperty(this, 'undoHistory', {
            get: function () {
                return this._undoHistory;
            }
        });

        /**
         * @TODO create an interface for the objects in this Array
         */
        Object.defineProperty(this, 'redoHistory', {
            get: function () {
                return this._redoHistory;
            }
        });

        /**
         * temporary solution to save the namespace for this class/prototype
         * @public
         * @property ns
         * @readOnly
         * @type String
         */
        Object.defineProperty(this, 'ns', {
            value: 'weavecore'
        });


    }

    SessionStateLog.prototype = new weavecore.LinkableVariable();
    SessionStateLog.prototype.constructor = SessionStateLog;

    var p = SessionStateLog.prototype;


    /**
     * @inheritDoc
     */
    p.dispose = function () {
        if (this._undoHistory === null || this._undoHistory === undefined)
            console.log("SessionStateLog.dispose() called more than once");

        this._subject = null;
        this._undoHistory = null;
        this._redoHistory = null;
    };

    /**
     * This function will save any pending diff in session state.
     * Use this function only when necessary (for example, when writing a collaboration service that must synchronize).
     */
    p.synchronizeNow = function () {
        this._saveDiff.call(this, true);
    };



    /**
     * This gets called as an immediate callback of the subject.
     */
    p._immediateCallback = function () {
        if (!this.enableLogging.value)
            return;

        // we have to wait until grouped callbacks are called before we save the diff
        this._saveTime = Number.MAX_VALUE;

        // make sure only one call to saveDiff() is pending
        if (!this._savePending) {
            this._savePending = true;
            this._saveDiff.call(this);
        }


        if (SessionStateLog.debug && (this._undoActive || this._redoActive)) {
            var state = WeaveAPI.SessionManager.getSessionState(this._subject);
            var forwardDiff = WeaveAPI.SessionManager.computeDiff(this._prevState, state);
            console.log('immediate diff:', forwardDiff);
        }
    };

    /**
     * This gets called as a grouped callback of the subject.
     */
    p._groupedCallback = function () {
        if (!this.enableLogging.value)
            return;

        // Since grouped callbacks are currently running, it means something changed, so make sure the diff is saved.
        this._immediateCallback();
        // It is ok to save a diff some time after the last time grouped callbacks are called.
        // If callbacks are triggered again before the next frame, the immediateCallback will reset this value.
        this._saveTime = getTimer() + this._syncDelay;

        if (SessionStateLog.debug && (this._undoActive || this._redoActive)) {
            var state = WeaveAPI.SessionManager.getSessionState(this._subject);
            var forwardDiff = WeaveAPI.SessionManager.computeDiff(this._prevState, state);
            console.log('grouped diff:', forwardDiff);
        }
    };

    /**
     * This will save a diff in the history, if there is any.
     * @param immediately Set to true if it should be saved immediately, or false if it can wait.
     */
    p._saveDiff = function (immediately) {
        //console.log("save difference is called");
        if (immediately === undefined) {
            immediately = false;
        }
        if (!this.enableLogging.value) {
            this._savePending = false;
            return;
        }

        var currentTime = getTimer();

        // remember how long it's been since the last synchronization
        if (this._triggerDelay < 0)
            this._triggerDelay = currentTime - this._rsyncTime;

        if (!immediately && getTimer() < this._saveTime) {
            // console.log("save difference is Paused");
            // we have to wait until the next frame to save the diff because grouped callbacks haven't finished.
            weavecore.StageUtils.callLater(this, this._saveDiff.bind(this));
            return;
        }

        var cc = WeaveAPI.SessionManager.getCallbackCollection(this);
        cc.delayCallbacks.call(cc);

        // console.log("save difference is executed");

        var state = WeaveAPI.SessionManager.getSessionState(this._subject);
        var forwardDiff = WeaveAPI.SessionManager.computeDiff(this._prevState, state);
        if (forwardDiff !== undefined) {
            var diffDuration = currentTime - (this._rsyncTime + this._triggerDelay);
            var backwardDiff = WeaveAPI.SessionManager.computeDiff(state, this._prevState);
            var oldEntry;
            var newEntry;
            if (this._undoActive) {
                // To prevent new undo history from being added as a result of applying an undo, overwrite first redo entry.
                // Keep existing delay/duration.
                oldEntry = this._redoHistory[0];
                newEntry = new LogEntry(this._nextId++, backwardDiff, forwardDiff, oldEntry.triggerDelay, oldEntry.diffDuration);
                if (this.enableHistoryRewrite) {
                    this._redoHistory[0] = newEntry;
                } else if (weavecore.StandardLib.compare(oldEntry.forward, newEntry.forward) !== 0) {
                    this._redoHistory.unshift(newEntry);
                }
            } else {
                newEntry = new LogEntry(this._nextId++, forwardDiff, backwardDiff, this._triggerDelay, diffDuration);
                if (this._redoActive) {
                    // To prevent new undo history from being added as a result of applying a redo, overwrite last undo entry.
                    // Keep existing delay/duration.
                    oldEntry = this._undoHistory.pop();
                    newEntry.triggerDelay = oldEntry.triggerDelay;
                    newEntry.diffDuration = oldEntry.diffDuration;

                    if (!this.enableHistoryRewrite && weavecore.StandardLib.compare(oldEntry.forward, newEntry.forward) === 0)
                        newEntry = oldEntry; // keep old entry
                }
                // save new undo entry
                this._undoHistory.push(newEntry);
            }

            if (SessionStateLog.debug)
                debugHistory.call(this, newEntry);

            this._rsyncTime = currentTime; // remember when diff was saved
            cc.triggerCallbacks.call(cc);
        }

        // always reset sync time after undo/redo even if there was no new diff
        if (this._undoActive || this._redoActive)
            this._rsyncTime = currentTime;
        this._prevState = state;
        this._undoActive = false;
        this._redoActive = false;
        this._savePending = false;
        this._triggerDelay = -1;

        cc.resumeCallbacks.call(cc);
    };



    /**
     * This will undo a number of steps from the saved history.
     * @param numberOfSteps The number of steps to undo.
     */
    p.undo = function (numberOfSteps) {
        if (isNaN(numberOfSteps))
            numberOfSteps = 1;
        this.applyDiffs.call(this, -numberOfSteps);
    };

    /**
     * This will redo a number of steps that have been previously undone.
     * @param numberOfSteps The number of steps to redo.
     */
    p.redo = function (numberOfSteps) {
        if (isNaN(numberOfSteps))
            numberOfSteps = 1;
        this.applyDiffs.call(this, numberOfSteps);
    };

    /**
     * This will clear all undo and redo history.
     * @param directional Zero will clear everything. Set this to -1 to clear all undos or 1 to clear all redos.
     */
    p.clearHistory = function (directional) {
        if (directional === undefined) directional = 0;
        var cc = WeaveAPI.SessionManager.getCallbackCollection(this);
        cc.delayCallbacks();

        this.synchronizeNow();

        if (directional <= 0) {
            if (this._undoHistory.length > 0)
                cc.triggerCallbacks("Log: Clear History Undo > 0");
            this._undoHistory.length = 0;
        }
        if (directional >= 0) {
            if (this._redoHistory.length > 0)
                cc.triggerCallbacks("Log: Clear History Redo > 0");
            this._redoHistory.length = 0;
        }

        cc.resumeCallbacks();
    };

    /**
     * This will apply a number of undo or redo steps.
     * @param delta The number of steps to undo (negative) or redo (positive).
     */
    p.applyDiffs = function (delta) {
        var stepsRemaining = Math.min(Math.abs(delta), delta < 0 ? this._undoHistory.length : this._redoHistory.length);
        if (stepsRemaining > 0) {
            var logEntry;
            var diff;
            var debug = SessionStateLog.debug && stepsRemaining === 1;

            // if something changed and we're not currently undoing/redoing, save the diff now
            if (this._savePending && !this._undoActive && !this._redoActive)
                this.synchronizeNow();

            var combine = stepsRemaining > 2;
            var baseDiff = null;
            WeaveAPI.SessionManager.getCallbackCollection(this._subject).delayCallbacks.call(this._subject);
            // when logging is disabled, revert to previous state before applying diffs
            if (!this.enableLogging.value) {
                var state = WeaveAPI.SessionManager.getSessionState(this._subject);
                // baseDiff becomes the change that needs to occur to get back to the previous state
                baseDiff = WeaveAPI.SessionManager.computeDiff(state, this._prevState);
                if (baseDiff !== null && baseDiff !== undefined)
                    combine = true;
            }
            while (stepsRemaining-- > 0) {
                if (delta < 0) {
                    logEntry = this._undoHistory.pop();
                    this._redoHistory.unshift(logEntry);
                    diff = logEntry.backward;
                } else {
                    logEntry = this._redoHistory.shift();
                    this._undoHistory.push(logEntry);
                    diff = logEntry.forward;
                }
                if (debug)
                    console.log('apply ' + (delta < 0 ? 'undo' : 'redo'), logEntry.id + ':', diff);

                if (stepsRemaining === 0 && this.enableLogging.value) {
                    // remember the session state right before applying the last step so we can rewrite the history if necessary
                    this._prevState = WeaveAPI.SessionManager.getSessionState(this._subject);
                }

                if (combine) {
                    baseDiff = WeaveAPI.SessionManager.combineDiff(baseDiff, diff);
                    if (stepsRemaining <= 1) {
                        WeaveAPI.SessionManager.setSessionState(this._subject, baseDiff, false);
                        combine = false;
                    }
                } else {
                    WeaveAPI.SessionManager.setSessionState(this._subject, diff, false);
                }

                if (debug) {
                    var newState = WeaveAPI.SessionManager.getSessionState(this._subject);
                    var resultDiff = WeaveAPI.SessionManager.computeDiff(this._prevState, newState);
                    console.log('resulting diff:', resultDiff);
                }
            }

            WeaveAPI.SessionManager.getCallbackCollection(this._subject).resumeCallbacks.call(this._subject);

            this._undoActive = delta < 0 && this._savePending;
            this._redoActive = delta > 0 && this._savePending;
            if (!this._savePending) {
                this._prevState = WeaveAPI.SessionManager.getSessionState(this._subject);
            }
            var slcc = WeaveAPI.SessionManager.getCallbackCollection(this);
            slcc.triggerCallbacks.call(slcc);
        }
    };



    function debugHistory(logEntry) {
        var h = this._undoHistory.concat();
        for (var i = 0; i < h.length; i++)
            h[i] = h[i].id;
        var f = this._redoHistory.concat();
        for (i = 0; i < f.length; i++)
            f[i] = f[i].id;
        if (logEntry) {
            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
            console.log('NEW HISTORY (backward) ' + logEntry.id + ':', logEntry.backward);
            console.log("===============================================================");
            console.log('NEW HISTORY (forward) ' + logEntry.id + ':', logEntry.forward);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        }
        console.log('undo [' + h + ']', 'redo [' + f + ']');
    }

    /**
     * This will generate an untyped session state object that contains the session history log.
     * @return An object containing the session history log.
     */
    p.getSessionState = function () {
        var cc = WeaveAPI.SessionManager.getCallbackCollection(this);
        cc.delayCallbacks();
        this.synchronizeNow.call(this);

        // The "version" property can be used to detect old session state formats and should be incremented whenever the format is changed.
        var state = {
            "version": 0,
            "currentState": this._prevState,
            "undoHistory": this._undoHistory.concat(),
            "redoHistory": this._redoHistory.concat(),
            "nextId": this._nextId
                // not including enableLogging
        };

        cc.resumeCallbacks();
        return state;
    };

    /**
     * This will load a session state log from an untyped session state object.
     * @param input The ByteArray containing the output from seralize().
     */
    p.setSessionState = function (state) {
        // make sure callbacks only run once while we set the session state
        var cc = WeaveAPI.SessionManager.getCallbackCollection(this);
        cc.delayCallbacks();
        this.enableLogging.delayCallbacks();
        try {
            var version = state.version;
            switch (version) {
            case 0:
                {
                    // note: some states from version 0 may include enableLogging, but here we ignore it
                    this._prevState = state.currentState;
                    this._undoHistory = LogEntry.convertGenericObjectsToLogEntries(state.undoHistory, this._syncDelay);
                    this._redoHistory = LogEntry.convertGenericObjectsToLogEntries(state.redoHistory, this._syncDelay);
                    this._nextId = state.nextId;

                    break;
                }
            default:
                console.log("Weave history format version " + version + " is unsupported.");
            }

            // reset these flags so nothing unexpected happens in later frames
            this._undoActive = false;
            this._redoActive = false;
            this._savePending = false;
            this._saveTime = 0;
            this._triggerDelay = -1;
            this._rsyncTime = getTimer();

            WeaveAPI.SessionManager.setSessionState(this._subject, this._prevState);
        } finally {
            this.enableLogging.resumeCallbacks();
            cc.triggerCallbacks("Log: Setsessionstate");
            cc.resumeCallbacks();
        }
    };
    weavecore.SessionStateLog = SessionStateLog;

}());
