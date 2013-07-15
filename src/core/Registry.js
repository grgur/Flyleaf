/**
 * Main Registry
 * Collects View instances and Controllers
 */

var cmpReg = /^[\w]*/,
    attrReg = /(?:[\[](?:@)?([\w\-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]])/,

    isDomEvent = /^[#\.a-zA-Z]/,

    registryCache = {},

    domEventRegistry = [];

Fly.def('Fly.Registry', {
    singleton : true,

    /**
     * List of view instances
     */
    views : undefined,

    /**
     * Collection of controllers
     */
    controllers : undefined,

    /**
     * Listeners registered through controllers
     */
    controls : [],

    /**
     * Set up Backbone Collections for views and controllers
     * @private
     */
    init : function () {
        var me = this;
        me.views = new Backbone.Collection();
        me.controllers = new Backbone.Collection();

        me.views.on('all', me.clearCache, me);
        //        me.views.on('add', me.registerViewListeners, me);
    },

    /**
     * Add a view to the registry
     * @private
     * @param {Fly.view.View} instance View instance
     */
    add : function (instance) {
        this.views.add({
            id        : instance.id,
            className : instance.$className,
            instance  : instance
        });

        // bind events from controllers
        this.registerViewListeners(instance);
    },

    /**
     * Remvove a view instance from the registry
     * @private
     * @param {Fly.view.View} instance View instance
     */
    remove : function (instance) {
        var collection = this.views,
            models = collection.where({id : instance.id});

        collection.remove(models);
    },


    /**
     * Parse a query string
     * @private
     * @param {String} query Query to parse
     * @returns {Object} Parsed object
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
     * Find the view based on the query
     * @private
     * @param {String} query Query string
     * @param {Fly.view.View[]} views Views to match against
     * @returns {Fly.view.View[]/Boolean} Returns array of matched views or false if none found
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
     * Find instantiated views by a simple query string
     *
     * Query examples
     *      Fly.Registry.query('className'); // Find views instantiated from className (see @Fly.getClass)
     *      Fly.Registry.query('className[foo=bar]'); // Find views with key foo equaling to the value of bar
     *
     * @param {String} query Query string
     * @param {Fly.view.View[]} views Limit to specific views
     * @returns {Fly.view.View[]/Boolean} Returns array of matched views or false if none found
     */
    query : function (query, views) {
        var cached = registryCache[query];

        if (!cached) {
            cached = registryCache[query] = this.doQuery(query, views);
        }

        return cached;
    },

    /**
     * Return the first found view
     * @param {String} query Query string
     * @returns {Fly.view.View/Boolean} Returns array of matched views or false if none found
     */
    first : function (query) {
        var items = this.query(query);

        if (!items) {
            return false;
        }

        return items[0];
    },

    /**
     * Clear registry cache
     */
    clearCache : function () {
        registryCache = {};
    },


    /**
     * Add a controller to the registry and initialize the listeners in the control object
     * @param controller
     */
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

    /**
     * Fix control scope
     * @private
     * @param {Fly.Controller} controller
     * @param {String} query
     * @param {Object} events
     */
    fixControlScope : function (controller, query, events) {
        $.each(events, $.proxy(this.fixEventScope, this, controller, events));
    },

    /**
     * Fix string event callback
     * @private
     */

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
     * Finds listeners in controllers and registers them in views
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
     * When a view is instantiated, it will get processed to see if it can be registered with any controller
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

});