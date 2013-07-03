/*! Flyleaf v0.1 2013-07-03 15:40 */
/**
 * Flyleaf framework
 * ^^^^^^^^^^^^^^^^^^
 */
(function (global, $) {
    'use strict';

;var version = '0.1.20130703-1540',
    libName = global.Flyleaf || 'Fly',
    Fly = {},
    F = Fly, //shorthand
    nsCache = {},
    arraySlice = Array.prototype.slice,
    doc = $(document),
    onTouchEnd,
    isObjectCreate = $.isFunction(Object.create),
    isMobile;

global[libName] = Fly;

$.extend(Fly, {
    global : global,

    version : version,

    // clickEvent : window.Touch ? 'touchstart' : 'click',

    clickEvent : 'tap',

    doc : doc,

    emptyFn : $.noop,

    isString : function (reference) {
        return $.type(reference) === "string";
    },

    isObject : function (reference) {
        return $.type(reference) === "object";
    },

    isFunction : $.isFunction,
    isNumeric  : $.isNumeric,
    isArray    : $.isArray,
    each       : _.each,

    objCreate : isObjectCreate ? Object.create : function (o) {
        function F () {}

        F.prototype = o;
        return new F();
    },

    instanceOf : function (instance, Class) {
        if (!instance || !Class) {
            return false;
        }

        if (isObjectCreate) {
            return Class.isPrototypeOf(instance);
        }

        return instance instanceof Class;
    },

    isCollection : function (data) {
        return (data instanceof Backbone.Collection) || (data.prototype instanceof Backbone.Collection);
    },

    isMobile : function () {
        var ua = navigator.userAgent || navigator.vendor || window.opera;

        if (isMobile === undefined) {
            isMobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
        }

        return isMobile;
    }
});

$(function () {
    F.body = $('body');

    // remove address bar on compatible mobile devices
    F.isMobile() && setTimeout(function () {
        if (!pageYOffset) {
            window.scrollTo(0, 1);
        }
    }, 100);

    // Init hammer touch events
    Fly.body.hammer();
});;/**
 * To use later on
 * @type {{}}
 */
Fly.util = {};$.extend(Fly, {
    /**
     * Create a custom namespace. Allows deep creation
     * @param {String} ns
     * @param {Object} value
     */
    ns : function (ns, value) {
        if (!F.isString(ns)) {
            throw new Error("Invalid namespace, must be a string");
        }

        //if NS already exists, return it
        if (nsCache.hasOwnProperty(ns)) {
            return nsCache[ns];
        }

        var parts = ns.split('.'),
            last = parts.length - 1,
            lastNs = parts[last],
            parent = window,
            part,
            obj,
            i;

        if (last > 0) {
            for (i = 0; i < last; i += 1) {
                part = parts[i];
                obj = parent[part];
                if (!F.isObject(obj)) {
                    parent[part] = {};
                }
                parent = parent[part];
            }
        }

        parent[lastNs] = parent[lastNs] || value;
        parent = parent[lastNs];

        nsCache[ns] = parent;

        return parent;
    },

    /**
     * Define a new class
     * @
     */
    def : function (ns, config) {
        var Base = Fly.BaseClass || {},
            Extend = config && config.extend ? Fly.ns(config.extend) : Base,
            Class;

        if (!F.isObject(config)) {
            config = {};
        }

        Class = $.extend(F.objCreate(Extend), config);
        Class.$super = Extend;
        Class.$className = ns;

        Fly.ns(ns, Class);

        if (Class.singleton === true) {
            Class.construct && Class.construct(config);
            Class.init && Class.init(config);
        }

        return Class;
    },

    /**
     * Instantiate and initialize a class
     * @param {String} name
     * @param {Object} cfg
     */
    init : function (name, cfg) {
        var cls,
            instance;

        if (!F.isObject(name)) {
            if (!F.isString(name) || name.length < 1) {
                return F.error("Invalid class name '" + name.toString() + "' specified, must be a non-empty string");
            }

            cls = F.getClass(name);
        } else {
            cls = name;
        }

        if (!cls) {
            return F.error("Cannot create an instance of unrecognized class name: " + name.toString());
        }

        if (cls.singleton) {
            return F.error("Cannot instantiate singleton " + name);
        }

        instance = F.objCreate(cls);

        if (F.isFunction(instance.construct)) {
            instance.construct(cfg);
        }

        return instance;
    },

    getClass: function (name) {
        var appName = Fly.App.name;

        return Fly.ns(name) ||
                (appName ? Fly.ns(appName + "." + name) : false) ||
                Fly.ns('Fly.' + name) ||
                (appName ? Fly.ns(appName + ".view." + name) : false) ||
                Fly.ns('Fly.view.' + name) ||
                Fly.ns('App.' + name);
    }
});;var cmpReg = /^[\w]*/,
    attrReg = /(?:[\[](?:@)?([\w\-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]])/,

    isDomEvent = /^[#\.a-zA-Z]/,

    registryCache = {},

    domEventRegistry = [];

Fly.def('Fly.Registry', {
    singleton : true,

    views : undefined,

    controllers : undefined,

    controls : [],

    init : function () {
        var me = this;
        me.views = new Backbone.Collection();
        me.controllers = new Backbone.Collection();

        me.views.on('all', me.clearCache, me);
        //        me.views.on('add', me.registerViewListeners, me);
    },

    add : function (instance) {
        this.views.add({
            id        : instance.id,
            className : instance.$className,
            instance  : instance
        });

        // bind events from controllers
        this.registerViewListeners(instance);
    },

    remove : function (instance) {
        var collection = this.views,
            models = collection.where({id : instance.id});

        collection.remove(models);
    },


    /**
     * Parse query string
     * @param query
     * @returns {*}
     */
    parseQuery : function (query) {
        var cmp = query.match(cmpReg),
            attr,
            parsed;

        if (!cmp) {
            return false;
        }

        attr = query.match(attrReg);

        parsed = {
            cmp : F.getClass(cmp[0])
        };

        // cmp doesn't exist
        if (!parsed.cmp) {
            return false;
        }

        if (attr) {
            parsed.attr = {};
            parsed.attr[attr[1]] = attr[3];
        }

        return parsed;
    },

    /**
     * The hard work of querying
     * @param query
     * @returns {*}
     */
    doQuery : function (query, views) {
        var me = this,
            parsed = me.parseQuery(query),
            collection = views ? new Backbone.Collection(views) : me.views,
            foundClasses = [],
            filtered = [];

        if (!parsed) {
            return false;
        }

        collection.each(function (item) {
            var instance = item.get('instance');
            if (F.instanceOf(instance, parsed.cmp)) {
                foundClasses.push(instance);
            }
        });

        // if attributes were not specified than just
        if (!parsed.attr) {
            return foundClasses;
        }

        F.each(parsed.attr, function (value, key) {
            $.grep(foundClasses, function (Class) {
                if (Class[key] == value) { //intentionally loose
                    filtered.push(Class);
                }
            });
        });

        return filtered;
    },

    /**
     * Find instantiated classes
     * @param query
     * @param {Array} views Limit to specific views
     * @returns {*}
     */
    query : function (query, views) {
        var cached = registryCache[query];

        if (!cached) {
            cached = registryCache[query] = this.doQuery(query, views);
        }

        return cached;
    },

    /**
     * Return the first found item
     * @param query
     * @returns {*}
     */
    first : function (query) {
        var items = this.query(query);

        if (!items) {
            return false;
        }

        return items[0];
    },

    clearCache : function () {
        registryCache = {};
    },

    addController   : function (controller) {
        var me = this;

        // fix scope
        $.each(controller.control, $.proxy(me.fixControlScope, me, controller));

        me.controllers.add({
            name     : controller.$className,
            control  : controller.control,
            instance : controller
        });

        me.controls.push(controller.control);
    },

    // fix scope in control
    fixControlScope : function (controller, query, events) {
        $.each(events, $.proxy(this.fixEventScope, this, controller, events));
    },

    // fix string event callback
    fixEventScope: function (controller, events, event, callback) {
        if (F.isString(callback)) {
            events[event] = {
                fn    : controller[callback],
                scope : controller
            };
        }
    },

    /**
     * Iterates through controls to see if any existing views need processing
     * @debug unused in the framework
     * @param controls
     */
    parseControls : function (controls) {
        F.each(controls, this.registerControllerListener, this);
    },

    /**
     * finds listeners in controllers and registers them in views
     */
    registerControllerListener : function (events, query, obj, views) {
        var me = this,
            dom = query.match(isDomEvent),
            cmp = dom ? false : query.replace('$', ''),
            cls;

        F.each(events, function (cfg, event) {
            var cbFn = me[cfg] || cfg.fn,
                callback = F.isString(cfg) ? $.proxy(me[cfg], me) : $.proxy(cfg.fn, cfg.scope),
                domEvExistsTester;

            if (dom) {
                domEvExistsTester = function (ev) {
                    return (ev.event === event && ev.query === query && ev.cb === cbFn);
                };

                if (_.find(domEventRegistry, domEvExistsTester)) {
                    // event already registered
                    return false;
                }

                domEventRegistry.push(
                    {
                        event : event,
                        query : query,
                        cb    : cbFn

                    }
                );

                // attach event to <body> and delegate to the query string
                return Fly.body.on(event, query, callback);
            }

            cls = F.Registry.doQuery(cmp, views);

            if (!cls) {
                return;
            }

            $.grep(cls, function (Class) {
                Class.on(event, callback);
            });
        });

    },

    /**
     * when a view is instantiated, it will get processed to see if it can be registered with any controller
     */
    registerViewListeners : function (view) {
        var me = this,
            callback = function (events, query, obj) {
                me.registerControllerListener(events, query, obj, [
                    {
                        id        : view.id,
                        className : view.$className,
                        instance  : view
                    }
                ]);
            };

        $.grep(me.controls, function (control) {
            F.each(control, callback);
        });
    }

});;/**
 * @mixin
 *
 * todo: create a mixin injector
 */

var domEvents = [
        'tap', 'tapstart', 'tapend', 'singletap', 'doubletap', 'taphold', 'swipe', 'swipeup', 'swipedown', 'swipeleft',
        'swiperight', 'swipeend', 'scrollstart', 'scrollend', 'orientationchange', 'dblclick', 'click', 'mousemove',
        'mouseout', 'mousein', 'mouseover'
    ],
    Events = Backbone.Events;

Fly.def('Fly.Events', {
    deferredEventRelays : [],

    off : Events.off,

    trigger : Events.trigger,

    init: function () {
        if (!this.relays) {
            this.relays = [];
        }
    },

    on : function (eventName, callback, scope) {
        this.relay(eventName);
        Events.on.apply(this, arguments);
    },

    once : function (eventName, callback, scope) {
        this.relay(eventName);
        Events.once.apply(this, arguments);
    },


    relay : function (eventName) {
        var me = this,
            el = me.el || me.$el,
            isDomEvent = $.inArray(eventName, domEvents) > -1,
            domReady = isDomEvent && el,
            domButNoEl = isDomEvent && !el,
            relayed = domReady ? $.inArray(eventName, me.relays) > -1 : false;

        if (domButNoEl) {
            me.deferredEventRelays.push(eventName);
            return -1;
        }

        if (relayed || !domReady) {
            return false;
        }

        el.on(eventName, function (event) {
            me.trigger(eventName, me, event, this);
        });
        me.relays.push(eventName);

        return true;
    }
});;Fly.def('Fly.BaseClass', {
    singleton : false,

    construct : function (config) {
        var me = this;

        me.mixin(Fly.Events);

        me.initConfig(config);
        me.initListeners(me.listeners);

        me.trigger('beforeinit', me, arguments);

        if (me.init) {
            me.init(config, me);
        }
        return me;
    },

    //    init : function (cfg, me) {
    // use your custom initialization sequence here
    //    },

    callParent : function (fn, args, scope) {
        var sup = this.$super,
            inherited = this[fn],
            supFn = sup[fn];

        if (supFn === inherited) {
            return sup.callParent(fn, args, scope);
        }

        if (supFn) {
            supFn.apply(scope || this, args);
        }
    },

    initConfig : function (config) {
        $.extend(this, config);
    },

    initListeners : function (listeners) {
        var me = this,
            g = F.global;

        F.each(listeners, function (conf, event) {
            if (F.isObject(conf)) {
                me.on(event, conf.fn, conf.scope || g);
            } else {
                me.on(event, conf);
            }
        });
    },

    mixin : function () {
        var me = this,
            args = arraySlice.call(arguments),
            mixin,
            i,
            key;

        for (i = 0; i < args.length; i += 1) {
            mixin = args[i];
            for (key in mixin) {
                if (mixin.hasOwnProperty(key) && me[key] === undefined) {
                    me[key] = mixin[key];
                }
            }
            if (F.isFunction(mixin.init)) {
                mixin.init.call(me);
            }
        }
    }
});;/**
 * Manages timers
 * @type {{timerID: number, timers: Array, add: Function, start: Function, stop: Function}}
 *
 * @event start
 * Fires when execution is started
 *
 * @event stop
 * Fires when execution is forcefully stopped
 *
 * @event finish
 * Fires when the queue gets empty
 */

Fly.def('Fly.TimerManager', {
    batch   : 350,
    timerID : 0,
    queue  : [],

    runner : undefined,

    init : function () {
        var me = this;
        me.runner = $.proxy(me.runNext, me);
    },

    add   : function (fn, autoStart) {
        this.queue.push(fn);
        if (autoStart) {
            this.start();
        }
    },
    start : function () {
        var me = this;
        if (me.timerID) {
            return;
        }

        me.trigger('start', me);

        me.timerID = setTimeout(me.runner, 0);
    },
    stop  : function () {
        var me = this;
        clearTimeout(me.timerID);
        me.timerID = 0;
        me.trigger('stop', me);
    },

    runNext : function () {
        var me = this,
            timers = me.queue,
            batch,
            i;

        if (timers.length > 0) {
            batch = timers.splice(0, me.batch);
            for (i = 0; i < batch.length; i += 1) {
                batch[i]();
            }
            me.timerID = setTimeout(me.runner, 0);
        } else {
            me.timerID = 0;
            me.trigger('finish', me);
        }
    }
});;Fly.def('Fly.App', {
    singleton   : true,
    name        : undefined,
    views       : {},
    models      : {},
    stores      : {},
    controllers : {},
    setup       : function (conf) {
        var me = this,
            appName = conf.name;

        $.extend(me, conf);

        if (!F.isString(appName) || !appName.length) {
            appName = 'App';
        }

        F.ns(appName + ".app", me);

        if ($.isFunction(me.launch)) {
            $($.proxy(me.launch, me));
        }

        me.name = appName;
    },

    launch : undefined
});;/**
 * Instance of {@link Fly.TimerManager} that manipulates with pseudo-threads
 * @type {*}
 */
Fly.ThreadManager = Fly.init('TimerManager');


/**
 * Shorthand for Fly.ThreadManager.add with automatic run action
 * @param fn
 */
Fly.thread = function (fn) {
    Fly.ThreadManager.add(fn, 1);
};var domMatch = /^[#\.a-zA-Z]/,
    clsMatch = /^\$/;


Fly.def('Fly.Controller', {

    singleton: true,

    /**
     *
     *
     * .class
     * #id
     * $className as in Fly.ns(__className__)
     * $className[foo=bar]
     *
     *
     *
     * control: {
     *  'something' : {
     *      event: 'fn'
     *  }
     * }
     */
    control: {},

    construct: function () {
//        var me = this;

        if (this !== Fly.Controller) {
            Fly.Registry.addController(this);
        }

//        F.each(me.control, me.assignListener, me);
    }


});
;$.extend(Fly, {

    logLevel : ['error', 'warn', 'log'],

    errorFn : console ? $.proxy(console.error, console) : F.emptyFn,
    warnFn  : console ? $.proxy(console.warn, console) : F.emptyFn,
    logFn   : console ? $.proxy(console.log, console) : F.emptyFn,

    throwOnError : true,

    error : function (msg) {
        var a;

        if (F.throwOnError) {
            throw new Error(msg);
        }

        if ($.inArray('error', F.logLevel) > -1) {
            a = arraySlice.call(arguments);
            return F.errorFn.apply(this, a);
        }
    },

    warn : function () {
        if ($.inArray('warn', F.logLevel) > -1) {
            return F.warnFn.apply(this, arguments);
        }
    },

    log : function () {
        if ($.inArray('log', F.logLevel) > -1) {
            return F.logFn.apply(this, arguments);
        }
    }

});;/**
 * TODO: VVVVVVVVVVV
 * - div el should have data-property with possibly class name (TBD)
 * - monitor dependents and be able to recreate them on remove->show
 * - destroy should remove dependents as well
 * - dependents are configurable. They don't have to be nested under the parent
 * - How to add descendents into _.template and how to recreate them?
 * ^^^^^^^^^^^^^^^^^^
 */
Fly.def('Fly.view.View', {
    /**
     * Template string
     * Based on _.template
     * Variables in {}
     * Evaluate in {[]}
     *
     * Example
     * '<div>{name}</div>
     * '<div>{[for (i in obj) {print obj[i];}]}</div'>
     *
     */
    tpl : undefined,

    /**
     * Template engine
     * Built-in options: Underscore, Handlebars
     * todo: global tplEngine setting
     */
    tplEngine : 'Underscore',

    /**
     * True to compile template when idle to speed up app initialization
     */
    tplCompileDeferred : false,

    /**
     * Template data object
     */
    data : undefined,

    /**
     * Plain html to be used instead of template
     */
    html : undefined,

    /**
     * DOM node to apply html to
     */
    applyTo : undefined,

    /**
     * reference to element placed in DOM
     */
    el : undefined,

    /**
     * Template element for use with rapid removal and add. It gets cloned to this.el
     */
    $el : undefined,

    /**
     * Element ID and Page ID all in one
     */
    id : undefined,

    /**
     * True to automatically paint the component
     */
    autoShow : false,

    /**
     * Nested views
     */
    items : [],

    /**
     * Short name for the view. Not used in configuration. Similar to xtype but doesn't need to be registered
     */
    module : undefined,

    /**
     * HTML element making this view/container
     */
    tag : 'div',

    /**
     * CSS classes to add
     */
    cls : undefined,

    /**
     * Flag that tells if view was already painted
     */
    $painted : false,

    /**
     * Initialize tpl and/or html
     */
    init : function () {
        var me = this;

        me.id = me.id || _.uniqueId('view_');

        F.Registry.add(me);

        if (F.isString(me.tpl)) {
            me.initTpl();
        } else if (F.isString(me.html)) {
            me.setHtml();
        }
    },

    /**
     * Initialize and compile template
     */
    initTpl : function () {
        var me = this,
            engine = 'Fly.tpl.' + me.tplEngine;

        // save the original string
        me.$tpl = me.tpl;

        // compile the template
        me.tpl = Fly.init(engine, {
            compileDeferred : true,
            autoRender      : true,
            tpl             : me.tpl,
            data            : me.data,
            listeners       : {
                render : {
                    fn    : me.onTplRender,
                    scope : me
                }
            }
        });
    },

    /**
     * Update template with object data
     * @param data
     */
    setData : function (data) {
        var me = this;

        if (data) {
            me.data = data;
        }

        if (me.tpl) {
            me.tpl.setData(data, true);
        }

        me.reset();

        if (me.autoShow === true || me.el) {
            me.paint();
        }

        me.trigger('update', me, me.data, me.tpl);
    },

    /**
     * Apply html from rendered template
     * @param {Fly.tpl.Abstract} tpl Template instance
     * @param {String} html HTML received from the template
     */
    onTplRender : function (tpl, html) {
        var me = this,
            x,
            y;

        if (me.el) {
            y = pageYOffset;
            x = pageXOffset;
            me.el.html(html);
            // todo: investigate if this is even necessary
            return window.scrollTo(x, y || 1);
        }

        me.setHtml(html);

        me.trigger('update', me, me.data, me.tpl);
    },

    /**
     * Set html content
     * @param html
     */
    setHtml : function (html) {
        var me = this,
            content = html || me.html,
            el = me.$el,
            id = me.id || _.uniqueId('view_'),
            tag = me.tag;

        if (!content && !me.items.length) {
            return false;
        }

        if (!el) {
            me.$el = el = $(document.createElement(tag)).attr('id', id);
            me.addCls(me.cls, me.$el);
            me.setDefferredRelays();
        }

        el.html(content);

        if (me.autoShow === true || me.$painted) {
            // helps with performance on consecutive paints
            Fly.thread(function () { me.paint(); });
        }

        return me;
    },

    addCls : function (cls, el) {
        var me = this;

        cls = cls || me.cls;
        el = el || me.el;

        el.addClass(cls);
    },

    /**
     * Removes references to element (el and $el)
     * @private
     */
    reset : function () {
        var me = this;

        me.remove();
        delete me.el;
    },

    /**
     * Append the element to DOM
     * @param target
     * @returns {*}
     */
    paint : function (target) {
        var me = this,
            content,
            items = me.items;

        me.$painted = true;

        if (me.el) {
            // already painted
            return me;
        }

        if (!me.$el) {
            content = me.setHtml();
            if (!content && !items.length) {
                // no content and no items. Probably waiting for template to render
                return me;
            }
        }

        target = target || me.applyTo || F.body;

        me.trigger('beforepainted', me, me.$el, me.html);

        me.el = me.$el.clone(true);

        // add nested children
        me.add(me.$items || items);

        me.el.appendTo(target);
        me.trigger('painted', me, me.$el, me.html);

        return me;
    },

    setDefferredRelays: function () {
        var me = this,
            deferred = me.deferredEventRelays;

        $.each(deferred, function (index, event) {
            me.relay(event);
        });
    },

    /**
     * Start the destroy sequence. Removes element from DOM and clears events
     */
    destroy : function () {
        var me = this;

        // remove listeners
        me.off();

        me.$painted = false;

        // remove dom
        me.reset();

        delete me.$el;
    },

    /**
     * Hide the View
     */
    hide : function () {
        this.el.hide();
    },

    /**
     * Remove the element from DOM. The element is still cached for fast re-introduction
     * @returns {*}
     */
    remove : function () {
        var me = this;

        if (me.el) {
            me.el.remove();
        }
        delete me.el;

        F.Registry.remove(me);

        return me;
    },

    /**
     * Show after hidden or add after remove
     * @returns {*}
     */
    show : function () {
        var me = this;

        if (me.el) {
            me.el.show();
            return me;
        }

        return me.paint();
    },

    /**
     * Show at position x,y
     * @returns {*}
     */
    showAt : function () {
        var me = this,
            args = arguments,
            xy = ($.isNumeric(args[0]) && $.isNumeric(args[1])) ? args : me.xy;

        if (!me.el) {
            me.paint();
            me.once('painted', function () {
                me.doShowAt(xy[0], xy[1]);
            });
        } else {
            me.doShowAt(xy[0], xy[1]);
        }

        return me;
    },

    /**
     * Sets CSS for showing at specific XY position
     * @private
     * @param x
     * @param y
     */
    doShowAt : function (x, y) {
        this.el.css({
            top      : y + 'px',
            left     : x + 'px',
            position : 'absolute'
        });
    },

    add : function () {
        var me = this,
            args = arraySlice.call(arguments),
            len,
            item;

        if ($.isNumeric(args[0])) {
            args.splice(0, 1);
        }

        len = args.length;

        // if each argument is an item
        if (len > 1) {
            $.each(args, $.proxy(me.add, me));
            return me;
        }

        // if the first argument is array of items
        if ($.isArray(args[0])) {
            $.each(args[0], $.proxy(me.add, me));
            return me;
        }

        item = args[0];

        if (!item) {
            return false;
        }

        if (!F.instanceOf(item, Fly.view.View)) {
            if (!item.module) {
                item.module = 'View';
            }
            if (item.module) {
                item = Fly.init(item.module, item);
            } else {
                return Fly.error('Item not recognized', item, me);
            }

        }
        item.paint(me.el);
    },

    /**
     * Get element object
     * @returns {Element} jQuery element
     */
    getEl: function () {
        return this.el;
    }
});;Fly.def('Fly.view.List', {
    extend : 'Fly.view.View',

    tag : 'ul',

    itemTpl : '',

    itemCls : '',

    init : function () {
        var me = this;

        //make sure we use collection
        me.data = me.convertToCollection(me.data);

        me.setCollectionChangeEvent();

        me.formatTpl();

        me.callParent('init', arguments, me);

        me.on('beforepainted', function (me, $el) {
            $el.delegate('li', 'tap', function (event) {
                var el = this,
                    record = me.data.get(el.getAttribute('data-id'));
                me.trigger('itemtap', record, el, me, event);
            });
        });
    },

    formatTpl: function () {
        var me = this;

        me.tpl = [
            '{{#each .}}',
            '<li ',
                me.itemCls ? ' class="' + me.itemCls + '" ' : '',
             'data-id="{{modelId}}">',
                me.itemTpl,
            '</li>',
            '{{/each}}'
        ].join('');
    },

    convertToCollection : function () {
        var me = this,
            data = arguments[0] || me.data;

        // if already a Collection then exit
        if (Fly.isCollection(me.data)) {
            return me.data;
        }

        return new Backbone.Collection(data);
    },

    onCollectionChange : function (event, model, collection) {
        collection = (collection instanceof Backbone.Collection) ? collection : this.data;
        this.tpl.setData(collection, true);
    },

    setCollectionChangeEvent : function () {
        this.data.on('all', this.onCollectionChange, this);
    }


});;/**
 * Abstract Template
 *
 * @event setdata
 * Fires when new data object has been set
 * @param {Fly.tpl.Abstract} me Template instance
 * @param {Object} data Data applied
 *
 * @event render
 * Fires when html is rendered from template
 * @param {Fly.tpl.Abstract} me Template instance
 * @param {String} html HTML string returned
 * @param {Object} data Data applied
 *
 * @event compile
 * Fires when template has compiled
 * @param {Fly.tpl.Abstract} me Template instance
 */
Fly.def('Fly.tpl.Abstract', {
    /**
     * @config
     * Template string
     */
    tpl : '',

    /**
     * @config
     * Data to apply to template
     */
    data : undefined,

    /**
     * @config autoRender
     * True to render on instantiation
     * Assumes {@link autoCompile} true
     */
    autoRender : false,

    /**
     * @config autoCompile
     * True to compile the template immediately on instantiation
     */
    autoCompile : false,

    /**
     * @config compileDeferred
     * True to kick compilation out of the execution loop.
     * Useful when template is not used immediately
     * Uses timers to compile when browser turns idle
     * Make sure your code is evented in this case
     */
    compileDeferred : false,

    /**
     * @property
     * Rendered HTML string
     */
    html : undefined,

    /**
     * @property
     * Template engine to use
     * Examples: Handlebars, _.template
     */
    engine : undefined,

    /**
     * @private
     * Compiled template. Result of this.compile()
     */
    compiled : undefined,

    /**
     * Abstract method, replace with a real compile function
     */
    compile : Fly.emptyFn,

    init : function (cfg) {
        var me = this;

        if (me.compileDeferred) {
            return Fly.thread(function () {
                me.doCompile();
                me.initTpl();
            });
        }

        if (me.autoRender === true || me.autoCompile === true) {
            me.doCompile();
        }

        me.initTpl();
    },

    /**
     * @private
     * Normalize data and render if applicable
     */
    initTpl : function () {
        var me = this;

        if (me.data) {
            me.setData(me.data, me.autoRender);
        }
    },

    /**
     * Set data and optionally render
     * @param {Object} data Data to apply
     * @param {Boolean} render True to render immediately and return rendered string
     * @returns {Object/String} Data set or HTML rendered
     */
    setData : function (data, render) {
        var me = this,
            parsedData;

        if (F.isFunction(me.applyData)) {
            data = me.applyData(data);
            if (data === false) {
                return data;
            }
        }

        me.data = data;

        me.trigger('setdata', me, data);

        if (render) {
            parsedData = Fly.isCollection(data) ?
                    data.map(function (model) {var obj = model.toJSON(); obj["modelId"] = model.cid; return obj; }) :
                    data;

            return me.render(parsedData);
        }

        return data;
    },

    /**
     * Apply data to template and return parsed string
     * @param {Object} data Optionally pass data to render. Skips setting the value to this.data
     * @returns {String} html Rendered string
     */
    render : function (data) {
        var me = this;

        if (!me.compiled) {
            me.doCompile();
        }

        if (!data) {
            data = me.data;
        }
        me.html = me.compiled(data);

        me.trigger('render', me, me.html, data);

        return me.html;
    },

    /**
     * Compilation sequence
     */
    doCompile : function () {
        var me = this;
        me.compile();
        me.trigger('compile', me);
    }

    /**
     * @method applyData
     * Use this method to normalize data. Received passed data and is expected to return it normalized.
     * Return false to abort
     * Only used if exists
     */
});;/**
 * todo: Goal to support:
 * √ -.template
 * √ Handlebars
 * Mustache
 * dust.js
 * 
 */
Fly.def('Fly.tpl.Handlebars', {
    extend : 'Fly.tpl.Abstract',

    /**
     * @config precompiled
     * Supply with a pre-compiled template to skip compilation
     */
    precompiled : false,

    init : function () {
        var me = this;
        me.callParent('init', arguments, me);

        me.engine = Handlebars;
    },

    compile : function (tpl) {
        var me = this;

        if (me.precompiled) {
            return me.precompiled;
        }

        if (!tpl) {
            tpl = me.tpl;
        }

        me.compiled = Handlebars.compile(tpl);

        return me.compiled;
    }
});;Fly.def('Fly.tpl.Underscore', {
    extend : 'Fly.tpl.Abstract',

    /**
     * @config likeExt
     * Use {var} and {[expression]} like in ExtJS and Sencha Touch
     */
    likeExt : false,

    init : function () {
        var me = this;
        me.callParent('init', arguments, me);

        if (me.likeExt) {
            me.lookLikeExtTpl();
        }

        me.engine = _.template;
    },

    compile : function (tpl) {
        var me = this;

        if (!tpl) {
            tpl = me.tpl;
        }

        me.compiled = _.template(tpl);

        return me.compiled;
    },

    lookLikeExtTpl : function () {
        _.templateSettings = {
            interpolate : /\{(.+?)\}/g,
            evaluate    : /\{\[(.+?)\]\}/g
        };
    }
});;}(this, jQuery));